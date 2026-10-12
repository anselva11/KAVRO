import React from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Shield, Cpu, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060910] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <BrandIcon className="w-6 h-6" />
              <span className="font-semibold text-sm tracking-wider text-slate-100 uppercase">
                Kavro
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Sovereign business operating workspace. Strategy modeling, document authoring, and deterministic dataset analysis.
            </p>
            <div className="flex items-center space-x-4 text-slate-500 pt-1 text-xs">
              <span className="inline-flex items-center text-slate-400">
                <Lock className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Isolated PostgreSQL Storage
              </span>
              <span className="inline-flex items-center text-slate-400">
                <Shield className="w-3.5 h-3.5 mr-1 text-blue-400" /> Zero Training on Customer Data
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-300 mb-3 font-semibold">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-slate-200 transition-colors">Workspace Canvas</Link></li>
              <li><Link href="/assistant" className="hover:text-slate-200 transition-colors">Executive Assistant</Link></li>
              <li><Link href="/documents" className="hover:text-slate-200 transition-colors">Document Studio</Link></li>
              <li><Link href="/data-analysis" className="hover:text-slate-200 transition-colors">Data Intelligence</Link></li>
              <li><Link href="/workflows" className="hover:text-slate-200 transition-colors">Workflows</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-300 mb-3 font-semibold">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-slate-200 transition-colors">Architecture</Link></li>
              <li><Link href="/pricing" className="hover:text-slate-200 transition-colors">Commercial Plans</Link></li>
              <li><Link href="/contact" className="hover:text-slate-200 transition-colors">Enterprise Sales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-300 mb-3 font-semibold">
              Legal & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy & Security</Link></li>
              <li><Link href="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link></li>
              <li><span className="text-slate-500">SOC-2 Type II Aligned</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Kavro Technologies Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-slate-400">
            Built for modern founders, consultants, and leaders.
          </p>
        </div>
      </div>
    </footer>
  );
}
