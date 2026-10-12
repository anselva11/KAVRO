"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle, Quote, TrendingUp } from "lucide-react";
import { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
  onClick?: () => void;
  isCompact?: boolean;
}

export function TestimonialCard({
  testimonial,
  onClick,
  isCompact = false,
}: TestimonialCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0C111E]/90 p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-slate-700 hover:bg-[#101728] hover:shadow-xl hover:shadow-blue-950/20 text-left select-none ${
        onClick ? "cursor-pointer" : ""
      } ${isCompact ? "w-[320px] sm:w-[380px] shrink-0" : "w-full"}`}
    >
      {/* Top row: Stars & Badge */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center space-x-1" aria-label={`${testimonial.rating} dari 5 bintang`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]"
                  : "text-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-emerald-500/25 bg-emerald-950/30 text-emerald-300">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span>{testimonial.verifiedBadge}</span>
        </div>
      </div>

      {/* Quote */}
      <div className="relative mb-4 flex-1">
        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-slate-800 -z-0 opacity-40 group-hover:text-blue-900/40 transition-colors" />
        <p className="relative z-10 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Metric highlight badge */}
      {testimonial.highlightMetric && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-950/25 text-slate-300 text-xs">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-semibold text-blue-300 font-mono">
            {testimonial.highlightMetric}
          </span>
          <span className="text-[11px] text-slate-400">• {testimonial.metricLabel}</span>
        </div>
      )}

      {/* Author info */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with fallback */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-700/80 bg-slate-800 shadow-inner">
            {!imageError ? (
              <Image
                src={testimonial.avatarUrl}
                alt={testimonial.name}
                width={40}
                height={40}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr ${testimonial.gradient}`}
              >
                {testimonial.initials}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 truncate group-hover:text-blue-300 transition-colors">
              {testimonial.name}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {testimonial.role} • <span className="text-slate-300 font-medium">{testimonial.company}</span>
            </p>
          </div>
        </div>

        {/* Company abbreviation pill */}
        {testimonial.companyLogoText && (
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-bold text-slate-400 bg-slate-900 border border-slate-800">
            {testimonial.companyLogoText}
          </span>
        )}
      </div>
    </div>
  );
}
