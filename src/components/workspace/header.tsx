"use client";

import React from "react";
import Link from "next/link";
import { Menu, Plus, Command, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
  return (
    <header className="h-13 border-b border-slate-800/80 bg-[#080C14]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        {/* Mobile toggle */}
        <button
          onClick={onOpenMobile}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-200">Kavro</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">Acme Advisory</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="hidden sm:inline text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Active Workspace
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Link
          href="/assistant"
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded border border-slate-800 bg-[#0E1320] text-slate-400 hover:text-slate-200 text-xs font-mono"
        >
          <Command className="w-3 h-3 text-slate-500" />
          <span>Quick Chat</span>
          <span className="kbd-badge ml-1">C</span>
        </Link>

        <Link href="/assistant">
          <Button variant="secondary" size="sm" className="h-7 px-2.5 text-xs border-slate-800 bg-[#0E1320]">
            <MessageSquare className="w-3 h-3 mr-1.5 text-slate-400" />
            <span className="hidden sm:inline">New Thread</span>
          </Button>
        </Link>

        <Link href="/documents">
          <Button size="sm" className="h-7 px-3 text-xs bg-slate-100 text-slate-950 hover:bg-white font-medium border-0">
            <Plus className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">New Document</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
