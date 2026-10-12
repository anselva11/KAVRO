import { NextResponse } from "next/server";
import { checkUsageQuota } from "@/services/usage-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    let userId = "usr-default";
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    const quota = await checkUsageQuota(userId);

    return NextResponse.json({
      success: true,
      usage: {
        currentMonthTokens: quota.currentUsage,
        quotaLimit: quota.quotaLimit,
        remaining: quota.remaining,
        plan: quota.plan,
        usagePercentage: Math.min(100, Math.round((quota.currentUsage / quota.quotaLimit) * 100)),
        tierLimits: {
          free: Number(process.env.QUOTA_FREE_TIER) || 50000,
          pro: Number(process.env.QUOTA_PRO_TIER) || 500000,
          business: Number(process.env.QUOTA_BUSINESS_TIER) || 2500000,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch usage stats" }, { status: 500 });
  }
}
