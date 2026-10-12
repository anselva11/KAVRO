"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  FileText,
  BarChart3,
  Lock,
  ChevronRight,
  Layers,
  Database,
  Check,
  Cpu,
  Workflow,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  Sliders,
  Copy,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"memo" | "cohorts" | "proposal">("memo");

  return (
    <div className="relative min-h-screen ambient-glow bg-grid-pattern pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/70 text-slate-300 text-xs shadow-inner mb-6 backdrop-blur-md hover:border-slate-600 transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-medium text-slate-200">Kavro Workspace 2.0</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Structured Business Intelligence & Document Studio</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          The business operating workspace for{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            high-output teams.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          Draft executive deliverables, audit complex tabular data, and orchestrate verified workflows. 
          Built on private PostgreSQL with strict data isolation and zero public model training.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <Link href="/signup">
            <Button size="lg" className="h-11 px-7 text-sm font-semibold bg-white text-slate-950 hover:bg-slate-100 shadow-lg shadow-white/10 rounded-lg group">
              Start Free Workspace
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="h-11 px-6 text-sm font-medium border-slate-700/80 bg-slate-900/80 text-slate-200 hover:bg-slate-800 rounded-lg">
              Explore Live Canvas
            </Button>
          </Link>
        </div>

        {/* Enterprise Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium pt-2 pb-6 border-b border-slate-800/60 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>PostgreSQL Row-Level Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Zero Customer Data Training</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Deterministic Statistical Engine</span>
          </div>
        </div>

        {/* 2. AUTHENTIC INTERACTIVE PRODUCT PREVIEW */}
        <div className="mt-12 max-w-5xl mx-auto text-left">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/90 shadow-2xl shadow-blue-950/20 overflow-hidden backdrop-blur-xl">
            {/* Top Workspace Header Bar */}
            <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                  <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                  <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                </div>
                <span className="text-xs font-semibold text-slate-300 ml-2">
                  Acme Advisory • Private Workspace
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab("memo")}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    activeTab === "memo"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Executive Memo
                </button>
                <button
                  onClick={() => setActiveTab("cohorts")}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    activeTab === "cohorts"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Cohort Retention (CSV)
                </button>
                <button
                  onClick={() => setActiveTab("proposal")}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    activeTab === "proposal"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Client Proposal
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium">Cloud Synced</span>
              </div>
            </div>

            {/* Tab 1: Executive Memo Content */}
            {activeTab === "memo" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
                      Strategic Deliverable
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">
                      Q4 Strategic Operating Plan & Expansion Thesis
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Author: Operating Committee • Version 2.3 (Reviewed & Approved)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md font-medium">
                      Ready for Board
                    </span>
                    <Button variant="secondary" size="sm" className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-300">
                      <Download className="w-3.5 h-3.5 mr-1" /> Export PDF
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
                    <span className="text-xs text-slate-400">Target Net Retention</span>
                    <div className="text-2xl font-bold text-white">128.4%</div>
                    <span className="text-[11px] text-emerald-400 font-medium">↑ +14.2% YoY across tier-1 accounts</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
                    <span className="text-xs text-slate-400">Blended Gross Margin</span>
                    <div className="text-2xl font-bold text-white">78.6%</div>
                    <span className="text-[11px] text-slate-400">Stable after infrastructure migration</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
                    <span className="text-xs text-slate-400">Payback Period</span>
                    <div className="text-2xl font-bold text-white">8.4 Months</div>
                    <span className="text-[11px] text-emerald-400 font-medium">Top quartile SaaS benchmark</span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-900/40 p-5 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-300">
                  <h4 className="text-sm font-semibold text-white">Executive Summary</h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Following audit of our enterprise accounts, client longevity correlates directly with verified onboarding SLAs. We propose reallocating $180k from outbound acquisition into solution engineering pods to lock in 94% gross revenue renewal for FY27.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Cohort Retention CSV Content */}
            {activeTab === "cohorts" && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Deterministic Dataset Audit</h3>
                    <p className="text-xs text-slate-400">Parsed 1,420 rows client-side • 0 missing values • Standard deviation: ±4.2%</p>
                  </div>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                    Verified Calculations
                  </Badge>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Cohort Month</th>
                        <th className="py-2.5 px-4">Starting ARR</th>
                        <th className="py-2.5 px-4">Month 3 Retained</th>
                        <th className="py-2.5 px-4">Month 12 Retained</th>
                        <th className="py-2.5 px-4">Expansion Multiplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-sans font-medium text-white">Jan 2026</td>
                        <td className="py-2.5 px-4">$124,000</td>
                        <td className="py-2.5 px-4 text-emerald-400">96.2%</td>
                        <td className="py-2.5 px-4 text-emerald-400">128.4%</td>
                        <td className="py-2.5 px-4 text-blue-400">1.33x</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-sans font-medium text-white">Feb 2026</td>
                        <td className="py-2.5 px-4">$142,500</td>
                        <td className="py-2.5 px-4 text-emerald-400">95.8%</td>
                        <td className="py-2.5 px-4 text-emerald-400">131.0%</td>
                        <td className="py-2.5 px-4 text-blue-400">1.37x</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-sans font-medium text-white">Mar 2026</td>
                        <td className="py-2.5 px-4">$168,000</td>
                        <td className="py-2.5 px-4 text-emerald-400">97.1%</td>
                        <td className="py-2.5 px-4 text-emerald-400">129.5%</td>
                        <td className="py-2.5 px-4 text-blue-400">1.34x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-white">AI Analysis: </span>
                  Cohorts post-Q1 demonstrate a 4.9 percentage point increase in year-one expansion, directly driven by multi-seat workspace adoption within 45 days of deployment.
                </div>
              </div>
            )}

            {/* Tab 3: Client Proposal Content */}
            {activeTab === "proposal" && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Commercial Engagement Proposal</h3>
                    <p className="text-xs text-slate-400">Client: Horizon Capital • Deliverable Scope: Enterprise Architecture</p>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md font-medium">
                    Fixed Scope
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                  <p className="font-medium text-white text-sm">Milestone 1: Security & Data Pipeline Audit (Weeks 1-2)</p>
                  <p className="text-slate-400">
                    Comprehensive vulnerability scan, database role-level privilege mapping, and verification of zero data persistence with external LLM endpoints.
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> SOC-2 Type II Controls</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> PostgreSQL Replication</span>
                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Custom Domain & SSO</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE WORKSPACE CAPABILITIES */}
      <section id="capabilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-blue-400">
            Engineered For Precision
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Four specialized tools. One unified workspace.
          </h3>
          <p className="text-sm sm:text-base text-slate-400">
            Stop juggling fragmented chat tabs, messy Google Docs, and spreadsheets. Kavro brings your workflow into a cohesive business canvas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700/80 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                Executive Document Studio
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1.5">
                Draft investor memos, business proposals, and strategic briefs with structured templates. Split-view live preview with instant export to Markdown and plain text.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">5 Proven Frameworks</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Autosave to PostgreSQL</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Version History</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700/80 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Deterministic Data Intelligence
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1.5">
                Upload CSVs without hallucination risks. Summary statistics, distributions, and missing values are computed mathematically in-browser before AI analyzes the insights.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Zero Hallucinations</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Statistical Distributions</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Client-Side Parser</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700/80 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Strategic Reasoning Assistant
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1.5">
                Deep multi-turn conversations with contextual memory. Test market hypotheses, evaluate contracts, and draft technical specs with citations.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Persistent Threads</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Provider Agnostic</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Token Control</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700/80 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                Repeatable Business Workflows
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1.5">
                Convert meeting transcripts into board updates, turn leads into tailored proposals, and execute complex business checklists with full auditability.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Confirmation Gates</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Audit History</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">Standardized Blueprints</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARISON: WHY KAVRO VS STANDARD CHATBOTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Why leadership teams migrate to Kavro
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Generic chat tools are built for casual Q&amp;A. Kavro is engineered for structured corporate output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-3">
              <h4 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                <span>Traditional Chatbots</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Free-form text that requires manual re-formatting into documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Data hallucination when summarizing numerical spreadsheets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Customer conversations often fed into public training sets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>No database persistence or team workspace governance</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
              <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <span>Kavro Business Workspace</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Structured document studio with 5 executive frameworks and live split preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Client-side mathematical CSV engine guarantees verified metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PostgreSQL Row-Level Security ensures total workspace isolation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Persistent database storage with export to Markdown, Text, and PDF</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIDEWAYS MOVING TESTIMONIALS SECTION */}
      <section className="pt-16 pb-6 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-950/30 text-blue-300 text-xs font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            Suara Para Operator & Pemimpin
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Dipercaya oleh Tim Berkinerja Tinggi
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Sorotan testimoni bergerak secara otomatis kesamping. Sentuh atau arahkan kursor untuk menjeda kartu.
          </p>
        </div>

        <TestimonialsMarquee />

        <div className="pt-2">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
          >
            Lihat semua cerita sukses dan bagikan ulasan Anda <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/30 to-slate-950/80 p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Elevate your team&apos;s output today.
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Get started in seconds. No credit card required. Experience sovereign document generation and deterministic analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button size="lg" className="h-11 px-8 text-sm font-semibold bg-white text-slate-950 hover:bg-slate-100 rounded-lg">
                Create Free Workspace <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="h-11 px-7 text-sm font-medium border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 rounded-lg">
                Sign In to Existing Workspace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
