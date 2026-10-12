import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    let userId = "usr-default";
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    const plans = [
      {
        id: "free",
        name: "Starter",
        price: 0,
        billingPeriod: "forever",
        description: "Essential AI assistance for individual operators and solo consultants.",
        tokenQuota: 50000,
        features: [
          "50,000 monthly AI tokens",
          "AI Assistant with persistent history",
          "5 core business document templates",
          "Standard markdown export",
          "Community support",
        ],
      },
      {
        id: "pro",
        name: "Professional",
        price: 39,
        billingPeriod: "monthly",
        description: "Higher compute quotas, advanced templates, and faster model response times.",
        tokenQuota: 500000,
        popular: true,
        features: [
          "500,000 monthly AI tokens",
          "Unlimited document generation",
          "Data Intelligence CSV spreadsheet analysis",
          "Priority reasoning engine",
          "Document version history & export to PDF/Docx",
          "Priority email support",
        ],
      },
      {
        id: "business",
        name: "Business Scale",
        price: 99,
        billingPeriod: "monthly",
        description: "Built for teams and high-volume operations with automated workflows.",
        tokenQuota: 2500000,
        features: [
          "2,500,000 monthly AI tokens",
          "Collaborative workspace (up to 10 seats)",
          "Workflow Automation foundations",
          "Custom tone & brand guidelines injection",
          "Audit logging and compliance reporting",
          "Dedicated account specialist",
        ],
      },
    ];

    return NextResponse.json({
      success: true,
      currentPlan: "free",
      status: "active",
      plans,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch subscription data" }, { status: 500 });
  }
}
