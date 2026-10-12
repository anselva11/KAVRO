import { createClient } from "@/lib/supabase/server";
import { calculateUsageCosts } from "@/lib/ai/token-counter";

export interface QuotaCheckResult {
  allowed: boolean;
  currentUsage: number;
  quotaLimit: number;
  remaining: number;
  plan: string;
}

// In-memory fallback tracking for seamless offline / zero-setup dev
let devMemoryTokens = 12450;

export async function checkUsageQuota(userId: string, workspaceId?: string): Promise<QuotaCheckResult> {
  const freeLimit = Number(process.env.QUOTA_FREE_TIER) || 50000;
  const proLimit = Number(process.env.QUOTA_PRO_TIER) || 500000;
  const businessLimit = Number(process.env.QUOTA_BUSINESS_TIER) || 2500000;

  try {
    const supabase = await createClient();
    
    // Check workspace subscription tier
    let plan = "free";
    let quotaLimit = freeLimit;

    if (workspaceId) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("workspace_id", workspaceId)
        .single();

      const subRecord = sub as { plan: string; status: string } | null;
      if (subRecord?.plan === "pro") {
        plan = "pro";
        quotaLimit = proLimit;
      } else if (subRecord?.plan === "business") {
        plan = "business";
        quotaLimit = businessLimit;
      }
    }

    // Calculate sum of tokens for this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const query = supabase
      .from("usage_events")
      .select("input_tokens, output_tokens")
      .gte("created_at", startOfMonth.toISOString());

    if (workspaceId) {
      query.eq("workspace_id", workspaceId);
    } else {
      query.eq("user_id", userId);
    }

    const { data: events, error } = await query;

    if (error || !events) {
      // Fallback to dev memory calculation
      return {
        allowed: devMemoryTokens < quotaLimit,
        currentUsage: devMemoryTokens,
        quotaLimit,
        remaining: Math.max(0, quotaLimit - devMemoryTokens),
        plan,
      };
    }

    const eventList = events as unknown as Array<{ input_tokens: number; output_tokens: number }>;
    const currentUsage = eventList.reduce((sum, e) => sum + (e.input_tokens || 0) + (e.output_tokens || 0), 0);

    return {
      allowed: currentUsage < quotaLimit,
      currentUsage,
      quotaLimit,
      remaining: Math.max(0, quotaLimit - currentUsage),
      plan,
    };
  } catch {
    return {
      allowed: devMemoryTokens < freeLimit,
      currentUsage: devMemoryTokens,
      quotaLimit: freeLimit,
      remaining: Math.max(0, freeLimit - devMemoryTokens),
      plan: "free",
    };
  }
}

export async function recordUsageEvent(params: {
  userId: string;
  workspaceId: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}) {
  const { inputTokens, outputTokens } = params;
  const { estimatedCost } = calculateUsageCosts(inputTokens, outputTokens, params.model);

  devMemoryTokens += (inputTokens + outputTokens);

  try {
    const supabase = await createClient();
    await supabase.from("usage_events").insert({
      user_id: params.userId,
      workspace_id: params.workspaceId,
      provider: params.provider,
      model: params.model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      estimated_cost: estimatedCost,
      status: "completed",
    });
  } catch (err) {
    // Graceful logging if DB insert fails
    console.warn("Could not record usage event to Supabase:", err);
  }
}
