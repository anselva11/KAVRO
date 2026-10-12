import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Cpu, Target, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="default">Our Mission</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Reinventing business operations through AI intelligence
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          KAVRO was created to eliminate the busywork of modern professionals. We build software for people who value speed, structural clarity, and data sovereign autonomy.
        </p>
      </div>

      {/* Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0F1626]/70 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Zero Filler Philosophy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We reject the conversational fluff of generic AI bots. KAVRO delivers executive summaries, structured tables, and decisive commercial outputs directly.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-[#0F1626]/70 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Sovereign Data Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All user data is housed in Supabase PostgreSQL protected by Row-Level Security. We do not sell user prompts or use them for third-party foundation model training.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-[#0F1626]/70 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Deterministic Computation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Math and statistics should be calculated with deterministic algorithms, not hallucinated by generative models. We verify facts first and generate explanations second.
          </p>
        </div>
      </div>

      {/* Architecture overview */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-[#0A0E17] space-y-4">
        <h2 className="text-xl font-bold text-white">Built for Founders and Scale-Up Teams</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Whether drafting a multimillion-dollar vendor proposal, converting raw customer feedback into an executive roadmap, or evaluating unit metrics from a monthly spreadsheet, KAVRO provides an integrated operating canvas.
        </p>
        <div className="pt-2">
          <Link href="/signup">
            <Button size="sm">
              Join KAVRO Workspace <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
