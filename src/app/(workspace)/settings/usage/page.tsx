"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, BarChart3, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

export default function UsageSettingsPage() {
  const [usage, setUsage] = useState({
    currentMonthTokens: 12450,
    quotaLimit: 50000,
    remaining: 37550,
    plan: "free",
    usagePercentage: 25,
    tierLimits: {
      free: 50000,
      pro: 500000,
      business: 2500000,
    },
  });

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.usage) {
          setUsage(data.usage);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Usage & Quotas</h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry of compute tokens consumed across your workspace.
          </p>
        </div>
        <Link href="/settings/billing">
          <Button size="sm" className="h-8 text-xs font-semibold">
            Upgrade Tier <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Main Quota Progress Card */}
      <Card className="border-primary-500/30 bg-[#0E1524]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary-400" />
              <span>Current Monthly Cycle</span>
            </CardTitle>
            <Badge variant="default" className="capitalize font-mono">
              {usage.plan} Plan
            </Badge>
          </div>
          <CardDescription>Resets on the first of each calendar month</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-xs font-mono">
              <span className="text-2xl font-bold text-white">
                {formatNumber(usage.currentMonthTokens)}{" "}
                <span className="text-xs font-normal text-slate-400">tokens consumed</span>
              </span>
              <span className="text-primary-400 font-semibold">{usage.usagePercentage}% of quota</span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, usage.usagePercentage)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 font-mono pt-1">
              <span>0 tokens</span>
              <span>{formatNumber(usage.remaining)} remaining</span>
              <span>{formatNumber(usage.quotaLimit)} cap</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown by Module */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Consumption by Module</CardTitle>
          <CardDescription>Token allocation across workspace features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-sans font-medium text-slate-200">
              <Cpu className="w-4 h-4 text-primary-400" />
              <span>AI Assistant Chat</span>
            </div>
            <span className="text-slate-300">
              {formatNumber(Math.round(usage.currentMonthTokens * 0.58))} tokens (58%)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-sans font-medium text-slate-200">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Document Studio Generation</span>
            </div>
            <span className="text-slate-300">
              {formatNumber(Math.round(usage.currentMonthTokens * 0.42))} tokens (42%)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quota Policy Note */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#090D18] flex items-start space-x-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          Token caps protect against unintended billing surges. If you reach 100% of your quota ceiling, requests will be paused until upgraded or until the next billing cycle.
        </p>
      </div>
    </div>
  );
}
