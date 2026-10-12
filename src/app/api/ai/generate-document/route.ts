import { NextResponse } from "next/server";
import { generateDocumentSchema } from "@/lib/validations/ai";
import { getAIProvider } from "@/lib/ai/provider-factory";
import { checkUsageQuota, recordUsageEvent } from "@/services/usage-service";
import { createDocument } from "@/services/document-service";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validation = generateDocumentSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { templateType, topic, keyPoints, audience, tone, customInstructions } = validation.data;
    let { workspaceId } = validation.data;

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

    // 1. Quota Check
    const quota = await checkUsageQuota(userId, workspaceId);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: "Monthly AI quota exceeded. Please upgrade your subscription to generate additional documents.",
        },
        { status: 429 }
      );
    }

    // 2. Generate with AI Provider
    const provider = getAIProvider();
    const result = await provider.generateDocument({
      templateType,
      topic,
      keyPoints,
      audience,
      tone,
      customInstructions,
    });

    // 3. Save Document into PostgreSQL
    const savedDoc = await createDocument({
      workspaceId,
      userId,
      title: result.title,
      templateType: result.templateType,
      content: result.content,
      status: "draft",
      metadata: {
        aiGenerated: true,
        model: result.model,
        provider: result.provider,
        topic,
        tone,
      },
    });

    // 4. Record Usage Event
    await recordUsageEvent({
      userId,
      workspaceId,
      provider: result.provider,
      model: result.model,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    });

    return NextResponse.json({
      success: true,
      document: savedDoc,
      usage: {
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
      },
    });
  } catch (error: any) {
    console.error("Document Gen API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
