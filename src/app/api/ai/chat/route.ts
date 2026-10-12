import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/validations/ai";
import { getAIProvider } from "@/lib/ai/provider-factory";
import { checkUsageQuota, recordUsageEvent } from "@/services/usage-service";
import { saveMessage, createConversation } from "@/services/conversation-service";
import { createClient } from "@/lib/supabase/server";

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

    // Determine current user
    let userId = "usr-default";
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Dev fallback
    }

    workspaceId = workspaceId || "ws-default";

    // 1. Quota & Rate Limit Check
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

    // 2. Ensure Conversation Exists
    const lastUserMessage = messages[messages.length - 1];
    const targetConversationId =
      conversationId ||
      (await createConversation(userId, workspaceId, lastUserMessage.content.slice(0, 40) + "...")).id;

    // 3. Persist incoming user message
    await saveMessage({
      conversationId: targetConversationId,
      userId,
      role: "user",
      content: lastUserMessage.content,
      model: model || "kavro-core",
    });

    // 4. Call AI Provider
    const provider = getAIProvider();
    const completion = await provider.chat(messages, { model });

    // 5. Persist assistant reply
    const savedMsg = await saveMessage({
      conversationId: targetConversationId,
      userId,
      role: "assistant",
      content: completion.content,
      model: completion.model,
      inputTokens: completion.inputTokens,
      outputTokens: completion.outputTokens,
    });

    // 6. Record usage event for audit & quota
    await recordUsageEvent({
      userId,
      workspaceId,
      provider: completion.provider,
      model: completion.model,
      inputTokens: completion.inputTokens,
      outputTokens: completion.outputTokens,
    });

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
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred while communicating with the AI service." },
      { status: 500 }
    );
  }
}
