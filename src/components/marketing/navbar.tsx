"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Command } from "lucide-react";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080C14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <BrandIcon className="w-7 h-7 group-hover:scale-105 transition-transform" />
            <span className="font-semibold text-sm tracking-wider text-slate-100 uppercase">
              Kavro
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-400">
            <Link href="/#capabilities" className="hover:text-slate-200 transition-colors">
              Platform
            </Link>
            <Link href="/testimonials" className="hover:text-slate-200 transition-colors flex items-center gap-1 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Testimonials
            </Link>
            <Link href="/pricing" className="hover:text-slate-200 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              Architecture
            </Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">
              Enterprise
            </Link>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-slate-800 bg-[#0F1420] text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs"
          >
            <Command className="w-3 h-3 text-slate-500" />
            <span className="font-mono text-[11px]">Command Menu</span>
            <span className="kbd-badge ml-1">K</span>
          </Link>

          <Link href="/login">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-300 hover:text-white">
              Log in
            </Button>
          </Link>

          <Link href="/signup">
            <Button size="sm" className="h-8 px-3.5 text-xs bg-slate-100 text-slate-950 hover:bg-white font-medium border-0 shadow-sm">
              Open Workspace
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0D121D] px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-2 text-xs font-medium text-slate-300">
            <Link
              href="/#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded hover:bg-slate-800"
            >
              Platform
            </Link>
            <Link
              href="/testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded hover:bg-slate-800 text-blue-400 font-semibold"
            >
              Testimonials
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded hover:bg-slate-800"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded hover:bg-slate-800"
            >
              Architecture
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded hover:bg-slate-800"
            >
              Enterprise
            </Link>
          </nav>
          <div className="pt-2 flex flex-col space-y-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                Log in
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full h-8 text-xs bg-white text-slate-900 font-semibold">
                Open Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
