import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/validations/ai";
import { getAIProvider } from "@/lib/ai/provider-factory";
import { checkUsageQuota, recordUsageEvent } from "@/services/usage-service";
import { saveMessage, createConversation } from "@/services/conversation-service";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// Resolve user identity from Supabase session
async function resolveUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? "usr-default";
  } catch {
    return "usr-default";
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validation = chatRequestSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { messages, model } = validation.data;
    let { conversationId, workspaceId } = validation.data;

    // Resolve user & workspace in parallel with quota check bootstrap
    const userId = await resolveUserId();
    workspaceId = workspaceId || "ws-default";

    // 1. Quota & Rate Limit Check (fast-path cache inside checkUsageQuota)
    const quota = await checkUsageQuota(userId, workspaceId);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: "Monthly AI token quota exceeded for your workspace. Please upgrade your plan.",
          currentUsage: quota.currentUsage,
          quotaLimit: quota.quotaLimit,
        },
        { status: 429 }
      );
    }

    const lastUserMessage = messages[messages.length - 1];

    // 2. Ensure conversation exists & persist user message CONCURRENTLY
    const conversationPromise = conversationId
      ? Promise.resolve(conversationId)
      : createConversation(
          userId,
          workspaceId,
          lastUserMessage.content.slice(0, 60).trim() + (lastUserMessage.content.length > 60 ? "…" : "")
        ).then((c) => c.id);

    const targetConversationId = await conversationPromise;

    // 3. Persist incoming user message (non-blocking — fire and don't await before AI call)
    const userMessagePromise = saveMessage({
      conversationId: targetConversationId,
      userId,
      role: "user",
      content: lastUserMessage.content,
      model: model || "kavro-core",
    });

    // 4. Call AI Provider (start immediately — don't block on DB write above)
    const provider = getAIProvider();
    const [completion] = await Promise.all([
      provider.chat(messages, { model }),
      userMessagePromise, // ensure user message is saved before we respond
    ]);

    // 5. Persist assistant reply & record usage event CONCURRENTLY
    const [savedMsg] = await Promise.all([
      saveMessage({
        conversationId: targetConversationId,
        userId,
        role: "assistant",
        content: completion.content,
        model: completion.model,
        inputTokens: completion.inputTokens,
        outputTokens: completion.outputTokens,
      }),
      // Fire-and-forget: usage recording should not block the response
      recordUsageEvent({
        userId,
        workspaceId,
        provider: completion.provider,
        model: completion.model,
        inputTokens: completion.inputTokens,
        outputTokens: completion.outputTokens,
      }).catch((err) => {
        console.warn("[chat] recordUsageEvent failed silently:", err?.message);
      }),
    ]);

    return NextResponse.json({
      success: true,
      conversationId: targetConversationId,
      message: savedMsg,
      usage: {
        inputTokens: completion.inputTokens,
        outputTokens: completion.outputTokens,
        totalTokens: completion.inputTokens + completion.outputTokens,
      },
    });
  } catch (error: any) {
    console.error("[chat] API error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred while communicating with the AI service." },
      { status: 500 }
    );
  }
}
