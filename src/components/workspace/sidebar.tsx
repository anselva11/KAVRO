"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BarChart3,
  Workflow,
  History,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { BrandIcon } from "@/components/ui/brand-icon";
import { createClient } from "@/lib/supabase/client";

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const [usage, setUsage] = useState({
    currentMonthTokens: 12450,
    quotaLimit: 50000,
    usagePercentage: 25,
    plan: "Free",
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
  }, [pathname]);

  const mainNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Assistant", href: "/assistant", icon: MessageSquare },
    { name: "Document Studio", href: "/documents", icon: FileText },
    { name: "Data Intelligence", href: "/data-analysis", icon: BarChart3 },
    { name: "Workflows", href: "/workflows", icon: Workflow },
    { name: "History", href: "/history", icon: History },
  ];

  const settingsNav = [
    { name: "Profile", href: "/settings/profile", icon: Settings },
    { name: "Usage & Telemetry", href: "/settings/usage", icon: Zap },
    { name: "Billing", href: "/settings/billing", icon: CreditCard },
  ];

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push("/login");
  };

  return (
    <aside className="w-60 h-full bg-[#080C14] border-r border-slate-800/80 flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Workspace Brand / Selector */}
        <div className="p-3 border-b border-slate-800/80">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/40 transition-colors group"
          >
            <div className="flex items-center space-x-2.5">
              <BrandIcon className="w-6 h-6" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-100 leading-tight">Executive WS</p>
                <p className="text-[10px] text-slate-400 capitalize font-mono">{usage.plan} Tier</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="p-2 space-y-6">
          {/* Main tools */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
              Workspace
            </p>
            {mainNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center space-x-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-slate-800/80 text-white border border-slate-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary-400" : "text-slate-500")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Settings Section */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
              System
            </p>
            {settingsNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center space-x-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-slate-800/80 text-white border border-slate-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary-400" : "text-slate-500")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Quota & User Profile Area */}
      <div className="p-3 border-t border-slate-800/80 space-y-3 bg-[#060A10]">
        {/* Token Usage Widget */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Monthly Usage</span>
            <span className="text-slate-200 font-semibold">{usage.usagePercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, usage.usagePercentage)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{formatNumber(usage.currentMonthTokens)} used</span>
            <span>{formatNumber(usage.quotaLimit)} limit</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-sm">
              AV
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">Alex Vance</p>
              <p className="text-[11px] text-slate-400 truncate">Managing Partner</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
