import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandIcon } from "@/components/ui/brand-icon";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#080C14] bg-grid-pattern relative">
      {/* Top back navigation */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-sm relative z-10 space-y-5">
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex items-center space-x-2">
            <BrandIcon className="w-8 h-8" />
            <span className="font-semibold text-lg tracking-wider text-slate-100 uppercase">
              Kavro
            </span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
