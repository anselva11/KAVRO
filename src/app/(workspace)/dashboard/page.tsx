"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  BarChart3,
  Workflow,
  ArrowRight,
  Clock,
  Zap,
  CheckCircle2,
  Plus,
  Layers,
  Sparkles,
  TrendingUp,
  FolderOpen,
  ArrowUpRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";

interface DashboardData {
  conversations: any[];
  documents: any[];
  usage: {
    currentMonthTokens: number;
    quotaLimit: number;
    remaining: number;
    plan: string;
    usagePercentage: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    conversations: [],
    documents: [],
    usage: {
      currentMonthTokens: 12450,
      quotaLimit: 50000,
      remaining: 37550,
      plan: "Free",
      usagePercentage: 25,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [convRes, docRes, usageRes] = await Promise.all([
          fetch("/api/conversations"),
          fetch("/api/documents"),
          fetch("/api/usage"),
        ]);

        const convJson = await convRes.json();
        const docJson = await docRes.json();
        const usageJson = await usageRes.json();

        setData({
          conversations: convJson.conversations || [],
          documents: docJson.documents || [],
          usage: usageJson.usage || {
            currentMonthTokens: 12450,
            quotaLimit: 50000,
            remaining: 37550,
            plan: "Free",
            usagePercentage: 25,
          },
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. WELCOME & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good morning, Alex
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Acme Advisory
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is your team&apos;s strategic output, document drafts, and analytics pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/assistant">
            <Button variant="secondary" size="sm" className="h-9 px-3.5 text-xs border-slate-700/80 bg-slate-900 text-slate-200 hover:bg-slate-800">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> New Thread
            </Button>
          </Link>
          <Link href="/documents">
            <Button size="sm" className="h-9 px-4 text-xs bg-white text-slate-950 hover:bg-slate-100 font-semibold shadow-sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> New Document
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-colors space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Active Documents</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {data.documents.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-medium">
              {data.documents.filter((d) => d.status === "final").length} approved
            </span>
            <span>•</span>
            <span>{data.documents.filter((d) => d.status !== "final").length} drafts in progress</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-colors space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Strategy Threads</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {data.conversations.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-indigo-400 font-medium">Full memory recall</span>
            <span>•</span>
            <span>Private & isolated</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-colors space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Compute Consumption</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatNumber(data.usage.currentMonthTokens)}
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(100, data.usage.usagePercentage)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400">
            {data.usage.usagePercentage}% of {formatNumber(data.usage.quotaLimit)} monthly allowance
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-colors space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Workspace Plan</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white capitalize tracking-tight">
            {data.usage.plan} Tier
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Sovereign Storage Active</span>
          </div>
        </div>
      </div>

      {/* 3. QUICK SHORTCUTS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/documents"
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700 transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Generate Proposal
            </p>
            <p className="text-[11px] text-slate-400">
              Draft investment memos, client proposals, or strategic reports.
            </p>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        <Link
          href="/data-analysis"
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700 transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              Audit CSV Data
            </p>
            <p className="text-[11px] text-slate-400">
              Verify column distributions, missing rates, and metrics.
            </p>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        <Link
          href="/workflows"
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700 transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white group-hover:text-violet-400 transition-colors flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-violet-400" />
              Run Workflow
            </p>
            <p className="text-[11px] text-slate-400">
              Synthesize meeting notes into board updates with approval gates.
            </p>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4. RECENT ACTIVITY LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Documents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              Recent Documents
            </h2>
            <Link href="/documents" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 divide-y divide-slate-800/80 overflow-hidden">
            {data.documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No documents drafted yet. Click &quot;New Document&quot; to begin.
              </div>
            ) : (
              data.documents.slice(0, 4).map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors group block"
                >
                  <div className="space-y-1 overflow-hidden pr-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-blue-400 transition-colors" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {doc.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-[11px] text-slate-400">
                      <span className="capitalize">{doc.templateType.replace("_", " ")}</span>
                      <span>•</span>
                      <span>Updated {formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>

                  <Badge
                    variant={doc.status === "final" ? "success" : "secondary"}
                    className="text-[10px] py-0.5 capitalize shrink-0 font-medium"
                  >
                    {doc.status === "final" ? "Approved" : "In Progress"}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Conversations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Recent Strategy Threads
            </h2>
            <Link href="/assistant" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 divide-y divide-slate-800/80 overflow-hidden">
            {data.conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No strategy sessions started yet. Click &quot;New Thread&quot; to begin.
              </div>
            ) : (
              data.conversations.slice(0, 4).map((conv) => (
                <Link
                  key={conv.id}
                  href={`/assistant/${conv.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors group block"
                >
                  <div className="space-y-1 overflow-hidden pr-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {conv.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Last turn: {formatDate(conv.updatedAt)}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
