"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Check, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BillingSettingsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [upgradingTo, setUpgradingTo] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/billing/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlans(data.plans || []);
          setCurrentPlan(data.currentPlan || "free");
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return;
    setUpgradingTo(planId);
    setTimeout(() => {
      setCurrentPlan(planId);
      setUpgradingTo(null);
      setSuccessMsg(`Workspace upgraded to ${planId.toUpperCase()} plan.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Subscription & Billing</h1>
        <p className="text-xs text-slate-400">
          Manage your workspace subscription tier, invoices, and payment methods.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Current Plan Overview Banner */}
      <Card className="border-slate-800 bg-[#0E1524]">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white capitalize">Active Plan: {currentPlan} Tier</span>
              <Badge variant="success" className="text-[10px] py-0 capitalize">
                Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Next billing cycle renewal: {new Date(Date.now() + 30 * 86400000).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Manage Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Available Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.id;
            return (
              <Card
                key={p.id}
                className={`flex flex-col justify-between ${
                  isCurrent ? "border-primary-500 bg-[#10172A]" : "hover:border-slate-700"
                }`}
              >
                <CardHeader className="space-y-1 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    {isCurrent && (
                      <Badge variant="default" className="text-[10px]">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{p.description}</CardDescription>
                  <div className="pt-2 flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-white">${p.price}</span>
                    <span className="text-xs text-slate-500">/ mo</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 pt-0 flex-1">
                  <div className="border-t border-slate-800/80 pt-2" />
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {p.features?.map((f: string, i: number) => (
                      <li key={i} className="flex items-start text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    variant={isCurrent ? "secondary" : "primary"}
                    size="sm"
                    disabled={isCurrent}
                    isLoading={upgradingTo === p.id}
                    onClick={() => handleSelectPlan(p.id)}
                    className="w-full h-8 text-xs font-semibold"
                  >
                    {isCurrent ? "Active Plan" : `Switch to ${p.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
