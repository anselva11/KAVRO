"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Star,
  Quote,
  TrendingUp,
  Building2,
  Calendar,
  X
} from "lucide-react";
import Image from "next/image";
import { Testimonial, TESTIMONIALS_DATA } from "@/data/testimonials";
import { TestimonialCard } from "./testimonial-card";
import { Button } from "@/components/ui/button";

export function TestimonialsMarquee() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<Testimonial | null>(null);
  const [modalImageError, setModalImageError] = useState(false);

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Filter testimonials based on selected category
  const filteredList = selectedCategory === "all"
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter((item) => item.category === selectedCategory);

  // Partition into two sets for row 1 and row 2
  const mid = Math.ceil(filteredList.length / 2);
  const row1Items = filteredList.slice(0, mid);
  const row2Items = filteredList.slice(mid);

  // Ensure enough items to fill the marquee seamlessly
  const row1Repeated = [...row1Items, ...row1Items, ...row1Items, ...row1Items];
  const row2Repeated = [...row2Items, ...row2Items, ...row2Items, ...row2Items];

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "founders", label: "Founders & CEOs" },
    { id: "consulting", label: "Management Consulting" },
    { id: "operations", label: "Strategy & Operations" },
    { id: "security", label: "Security & Tech" },
  ];

  const getMarqueeClass = (isReverse = false) => {
    let speedClass = "animate-marquee-normal";
    if (speed === "slow") speedClass = isReverse ? "animate-marquee-reverse-slow" : "animate-marquee-slow";
    else if (speed === "fast") speedClass = isReverse ? "animate-marquee-reverse-normal" : "animate-marquee-fast";
    else speedClass = isReverse ? "animate-marquee-reverse-normal" : "animate-marquee-normal";

    return `${speedClass} ${!isPlaying ? "marquee-paused" : "marquee-pause"}`;
  };

  const handleManualScroll = (direction: "left" | "right") => {
    const scrollAmount = 380;
    if (row1Ref.current) {
      row1Ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
    if (row2Ref.current) {
      row2Ref.current.scrollBy({
        left: direction === "left" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative w-full py-12 overflow-hidden select-none" aria-label="Testimoni Pengguna Bergerak Kesamping">
      {/* Interactive Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-[#090E1A]/80 backdrop-blur-md">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Marquee Playback & Speed Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title={isPlaying ? "Jeda Animasi Geser" : "Lanjutkan Animasi Geser"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            {/* Speed toggle */}
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5 font-mono text-[11px]">
              <button
                onClick={() => setSpeed("slow")}
                className={`px-2 py-1 rounded transition-colors ${
                  speed === "slow" ? "bg-slate-800 text-blue-300 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                0.75x
              </button>
              <button
                onClick={() => setSpeed("normal")}
                className={`px-2 py-1 rounded transition-colors ${
                  speed === "normal" ? "bg-slate-800 text-blue-300 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                1.0x
              </button>
              <button
                onClick={() => setSpeed("fast")}
                className={`px-2 py-1 rounded transition-colors ${
                  speed === "fast" ? "bg-slate-800 text-blue-300 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                1.5x
              </button>
            </div>

            {/* Manual scroll buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleManualScroll("left")}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Geser ke kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleManualScroll("right")}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Geser ke kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hover guidance tooltip */}
        <div className="mt-2 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            💡 Arahkan kursor atau sentuh kartu untuk menjeda • Klik kartu untuk melihat studi kasus lengkap
          </p>
        </div>
      </div>

      {/* HORIZONTAL MOVING TRACKS */}
      <div className="relative w-full space-y-4 mask-gradient-x">
        {/* ROW 1: Scrolls to the Left */}
        <div
          ref={row1Ref}
          className="w-full overflow-hidden flex"
        >
          <div className={`flex gap-4 sm:gap-6 py-2 ${getMarqueeClass(false)}`}>
            {row1Repeated.map((item, idx) => (
              <TestimonialCard
                key={`r1-${item.id}-${idx}`}
                testimonial={item}
                isCompact
                onClick={() => {
                  setModalImageError(false);
                  setActiveModalItem(item);
                }}
              />
            ))}
          </div>
        </div>

        {/* ROW 2: Scrolls in Reverse (to the Right) */}
        <div
          ref={row2Ref}
          className="w-full overflow-hidden flex"
        >
          <div className={`flex gap-4 sm:gap-6 py-2 ${getMarqueeClass(true)}`}>
            {row2Repeated.map((item, idx) => (
              <TestimonialCard
                key={`r2-${item.id}-${idx}`}
                testimonial={item}
                isCompact
                onClick={() => {
                  setModalImageError(false);
                  setActiveModalItem(item);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL FOR TESTIMONIAL STORY */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-xl rounded-2xl border border-slate-700/80 bg-[#0E1424] p-6 sm:p-8 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-slate-700 bg-slate-800 shadow-md">
                {!modalImageError ? (
                  <Image
                    src={activeModalItem.avatarUrl}
                    alt={activeModalItem.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    onError={() => setModalImageError(true)}
                    unoptimized
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-tr ${activeModalItem.gradient}`}
                  >
                    {activeModalItem.initials}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeModalItem.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {activeModalItem.verifiedBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {activeModalItem.role} • <span className="font-semibold text-blue-400">{activeModalItem.company}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {activeModalItem.companyLogoText}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {activeModalItem.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1.5 mb-4 p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < activeModalItem.rating
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]"
                        : "text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-300 ml-1">
                5.0 / 5.0 Rating Sempurna
              </span>
            </div>

            {/* Impact Metric Hero Box */}
            <div className="p-4 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-indigo-950/30 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-300">
                  Hasil Terukur (Verified Impact)
                </span>
                <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {activeModalItem.highlightMetric}
                </p>
              </div>
              <span className="text-xs text-slate-300 max-w-[140px] text-right font-medium">
                {activeModalItem.metricLabel}
              </span>
            </div>

            {/* Story & Quote */}
            <div className="space-y-3 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-lg border-l-2 border-blue-500 bg-slate-900/50 italic text-slate-200">
                &ldquo;{activeModalItem.quote}&rdquo;
              </div>

              {activeModalItem.fullStory && (
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Latar Belakang & Implementasi:
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    {activeModalItem.fullStory}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveModalItem(null)}
                className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
              >
                Tutup
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveModalItem(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
              >
                Eksplorasi Kavro Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
