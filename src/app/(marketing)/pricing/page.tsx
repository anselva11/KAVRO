"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Starter",
      id: "free",
      tagline: "For individual operators and consultants exploring structured execution.",
      monthlyPrice: 0,
      annualPrice: 0,
      tokens: "50,000",
      cta: "Start Free",
      popular: false,
      href: "/signup",
      features: [
        "50,000 monthly tokens",
        "Executive Assistant with session memory",
        "5 core business document templates",
        "Deterministic Markdown & text export",
        "PostgreSQL Row Level Security (RLS)",
        "Standard community support",
      ],
    },
    {
      name: "Professional",
      id: "pro",
      tagline: "For busy founders, management consultants, and growing operators.",
      monthlyPrice: 39,
      annualPrice: 32,
      tokens: "500,000",
      cta: "Select Professional",
      popular: true,
      href: "/signup?plan=pro",
      features: [
        "500,000 monthly compute tokens",
        "Full Document Studio with unlimited generation",
        "Data Intelligence CSV spreadsheet analysis",
        "Priority reasoning models (Claude 3.5 / GPT-4o)",
        "Document version history & export",
        "Custom document tone & audience calibration",
        "Email support & 99.9% uptime SLA",
      ],
    },
    {
      name: "Business Scale",
      id: "business",
      tagline: "For teams requiring multi-user workspaces and high compute thresholds.",
      monthlyPrice: 99,
      annualPrice: 79,
      tokens: "2,500,000",
      cta: "Contact Sales",
      popular: false,
      href: "/signup?plan=business",
      features: [
        "2,500,000 monthly compute tokens",
        "Multi-seat workspace collaboration (up to 10 seats)",
        "Operational workflow blueprints & audit logs",
        "Bring-your-own AI API key option",
        "Centralized seat & usage audit telemetry",
        "Shared document workspace templates",
        "Dedicated customer success architect",
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Predictable, compute-based pricing
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          No hidden fees or unexpected surge charges. Switch plans or cancel anytime with single-click ease.
        </p>

        {/* Toggle Billing */}
        <div className="pt-3 flex items-center justify-center space-x-3 text-xs font-mono">
          <span className={billingCycle === "monthly" ? "text-slate-200" : "text-slate-500"}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="w-10 h-5 rounded-full bg-slate-800 p-0.5 border border-slate-700 relative transition-colors cursor-pointer"
            aria-label="Toggle billing cycle"
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-slate-200 transition-transform ${
                billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`flex items-center ${billingCycle === "annual" ? "text-slate-200" : "text-slate-500"}`}>
            Annual <span className="ml-1 text-[10px] text-emerald-400 font-mono">(-20%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const price = billingCycle === "annual" ? p.annualPrice : p.monthlyPrice;
          return (
            <Card
              key={p.id}
              className={`flex flex-col justify-between border-slate-800 bg-[#0A0E18] ${
                p.popular ? "border-slate-700 bg-[#0E1320]" : ""
              }`}
            >
              <CardHeader className="space-y-1.5 p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{p.name}</CardTitle>
                  {p.popular && (
                    <span className="kbd-badge text-[10px] text-slate-300">
                      Standard
                    </span>
                  )}
                </div>
                <CardDescription className="text-xs leading-relaxed">{p.tagline}</CardDescription>
                <div className="pt-3 flex items-baseline space-x-1 font-mono">
                  <span className="text-3xl font-bold text-white">${price}</span>
                  <span className="text-xs text-slate-500">/ mo</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">{p.tokens} tokens / mo</p>
              </CardHeader>

              <CardContent className="space-y-3 p-5 pt-0 flex-1">
                <div className="border-t border-slate-800/80 pt-3" />
                <ul className="space-y-2 text-xs text-slate-300">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start text-[11px] text-slate-400">
                      <Check className="w-3.5 h-3.5 text-slate-300 mr-2 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-5 pt-0">
                <Link href={p.href} className="w-full">
                  <Button
                    variant={p.popular ? "primary" : "secondary"}
                    className={`w-full h-8 text-xs font-medium ${
                      p.popular
                        ? "bg-white text-slate-950 hover:bg-slate-200 border-0"
                        : "border-slate-800 bg-[#0B0F19] text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {p.cta} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Enterprise Contact Strip */}
      <div className="rounded-lg border border-slate-800 bg-[#090D16] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold text-white">Custom Enterprise Engagements</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Dedicated private compute clusters, custom model routing, and SOC2 compliance audits.
          </p>
        </div>
        <Link href="/contact">
          <Button variant="secondary" size="sm" className="h-7 text-xs border-slate-800 bg-[#0D121D]">
            Contact Enterprise Team
          </Button>
        </Link>
      </div>
    </div>
  );
}
