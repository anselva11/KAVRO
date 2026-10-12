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

// Simple in-process quota cache to avoid hammering Supabase on every message
interface CacheEntry {
  result: QuotaCheckResult;
  expiresAt: number;
}
const quotaCache = new Map<string, CacheEntry>();
const QUOTA_CACHE_TTL_MS = 15_000; // 15 seconds per workspace

export async function checkUsageQuota(userId: string, workspaceId?: string): Promise<QuotaCheckResult> {
  const freeLimit = Number(process.env.QUOTA_FREE_TIER) || 50000;
  const proLimit = Number(process.env.QUOTA_PRO_TIER) || 500000;
  const businessLimit = Number(process.env.QUOTA_BUSINESS_TIER) || 2500000;

  const cacheKey = `${userId}:${workspaceId || "_"}`;
  const cached = quotaCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  const setCache = (result: QuotaCheckResult) => {
    quotaCache.set(cacheKey, { result, expiresAt: Date.now() + QUOTA_CACHE_TTL_MS });
    return result;
  };

  try {
    const supabase = await createClient();

    // Resolve plan and usage in parallel
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [subResult, usageResult] = await Promise.all([
      workspaceId
        ? supabase
            .from("subscriptions")
            .select("plan, status")
            .eq("workspace_id", workspaceId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("usage_events")
        .select("input_tokens, output_tokens")
        .gte("created_at", startOfMonth.toISOString())
        .eq(workspaceId ? "workspace_id" : "user_id", workspaceId || userId),
    ]);

    let plan = "free";
    let quotaLimit = freeLimit;
    const subRecord = subResult?.data as { plan: string; status: string } | null;
    if (subRecord?.plan === "pro") {
      plan = "pro";
      quotaLimit = proLimit;
    } else if (subRecord?.plan === "business") {
      plan = "business";
      quotaLimit = businessLimit;
    }

    const { data: events, error } = usageResult;
    if (error || !events) {
      return setCache({
        allowed: devMemoryTokens < quotaLimit,
        currentUsage: devMemoryTokens,
        quotaLimit,
        remaining: Math.max(0, quotaLimit - devMemoryTokens),
        plan,
      });
    }

    const eventList = events as unknown as Array<{ input_tokens: number; output_tokens: number }>;
    const currentUsage = eventList.reduce(
      (sum, e) => sum + (e.input_tokens || 0) + (e.output_tokens || 0),
      0
    );

    return setCache({
      allowed: currentUsage < quotaLimit,
      currentUsage,
      quotaLimit,
      remaining: Math.max(0, quotaLimit - currentUsage),
      plan,
    });
  } catch {
    return setCache({
      allowed: devMemoryTokens < freeLimit,
      currentUsage: devMemoryTokens,
      quotaLimit: freeLimit,
      remaining: Math.max(0, freeLimit - devMemoryTokens),
      plan: "free",
    });
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

  // Update dev memory counter immediately (sync, instant)
  devMemoryTokens += inputTokens + outputTokens;

  // Invalidate cache so next check reflects updated usage
  const cacheKey = `${params.userId}:${params.workspaceId}`;
  quotaCache.delete(cacheKey);

  // Best-effort DB write — never block the caller
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
  } catch (err: any) {
    console.warn("[usage-service] Could not record usage event to Supabase:", err?.message);
  }
}
