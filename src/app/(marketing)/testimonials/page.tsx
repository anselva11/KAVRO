"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  MessageSquarePlus,
  Search,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Send,
  ThumbsUp,
  Check
} from "lucide-react";
import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { TESTIMONIALS_DATA, Testimonial } from "@/data/testimonials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TestimonialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGridCategory, setSelectedGridCategory] = useState<string>("all");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form state for user testimonial submission
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    rating: 5,
    category: "founders" as Testimonial["category"],
    quote: "",
    highlightMetric: "",
  });

  // Client-side list including newly added user reviews
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(TESTIMONIALS_DATA);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) return;

    const newTestimonial: Testimonial = {
      id: `user-${Date.now()}`,
      name: formData.name,
      role: formData.role || "Operator",
      company: formData.company || "Independent",
      companyLogoText: formData.company ? formData.company.slice(0, 4).toUpperCase() : "USR",
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      rating: formData.rating,
      verifiedBadge: "Pengguna Terverifikasi",
      category: formData.category,
      quote: formData.quote,
      fullStory: formData.quote,
      highlightMetric: formData.highlightMetric || "Efisiensi Tinggi",
      metricLabel: "Diverifikasi Pengguna",
      date: "Baru saja",
      initials: formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U",
      gradient: "from-blue-600 to-indigo-700",
    };

    setAllTestimonials([newTestimonial, ...allTestimonials]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
      setFormData({
        name: "",
        role: "",
        company: "",
        rating: 5,
        category: "founders",
        quote: "",
        highlightMetric: "",
      });
    }, 2000);
  };

  // Filter grid items
  const gridFiltered = allTestimonials.filter((item) => {
    const matchesCategory =
      selectedGridCategory === "all" || item.category === selectedGridCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen ambient-glow bg-grid-pattern pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs shadow-inner mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold">Kisah Sukses & Testimoni Pengguna</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono">100% Terverifikasi</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Dipercaya oleh para pemimpin bisnis untuk{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            eksekusi berkecepatan tinggi.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Temukan bagaimana para founder, konsultan manajemen, dan eksekutif operasional
          memanfaatkan arsitektur deterministik KAVRO untuk menyusun deliverable berkualitas
          tinggi tanpa risiko halusinasi data.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link href="/signup">
            <Button size="lg" className="h-11 px-7 text-xs sm:text-sm font-semibold bg-white text-slate-950 hover:bg-slate-100 shadow-lg shadow-white/10 rounded-lg">
              Coba Workspace Gratis <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowSubmitModal(true)}
            className="h-11 px-6 text-xs sm:text-sm font-medium border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4 text-blue-400" />
            <span>Bagikan Pengalaman Anda</span>
          </Button>
        </div>

        {/* Trust Stats Counter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto p-4 sm:p-6 rounded-2xl border border-slate-800 bg-[#090E1A]/90 backdrop-blur-xl shadow-xl">
          <div className="text-center p-3 border-r border-slate-800/80 last:border-r-0">
            <div className="flex items-center justify-center space-x-1 mb-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">5.0 / 5.0</p>
            <p className="text-xs text-slate-400 mt-0.5">Rating Kepuasan Pengguna</p>
          </div>

          <div className="text-center p-3 sm:border-r border-slate-800/80">
            <div className="w-6 h-6 mx-auto mb-1 text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">18+ Jam</p>
            <p className="text-xs text-slate-400 mt-0.5">Waktu Terhemat Per Minggu</p>
          </div>

          <div className="text-center p-3 border-r border-slate-800/80 last:border-r-0">
            <div className="w-6 h-6 mx-auto mb-1 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</p>
            <p className="text-xs text-slate-400 mt-0.5">Deterministik & Tanpa Bocor</p>
          </div>

          <div className="text-center p-3">
            <div className="w-6 h-6 mx-auto mb-1 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">5,000+</p>
            <p className="text-xs text-slate-400 mt-0.5">Dokumen Eksekutif Tersusun</p>
          </div>
        </div>
      </section>

      {/* 2. THE SIDEWAYS MOVING TESTIMONIALS SECTION (MARQUEE SLIDER) */}
      <section className="relative my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-4">
          <Badge variant="default" className="mb-2">
            Sorotan Bergerak
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ulasan Pengguna Nyata Secara Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1">
            Animasi bergulir secara otomatis kesamping. Anda dapat mengatur kecepatan, memfilter bidang industri, atau menekan tombol jeda kapan saja.
          </p>
        </div>

        {/* Marquee Component with continuous sideways motion */}
        <TestimonialsMarquee />
      </section>

      {/* 3. BROWSE & SEARCH ALL STORIES (GRID VIEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Eksplorasi Seluruh Ulasan Pengguna
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan {gridFiltered.length} testimoni terverifikasi dari berbagai industri
            </p>
          </div>

          {/* Search bar & filter pills */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, posisi, atau kutipan..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900/90 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(["all", "founders", "consulting", "operations", "security"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedGridCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                    selectedGridCategory === cat
                      ? "bg-slate-200 text-slate-950 font-semibold"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {cat === "all" ? "Semua" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid cards */}
        {gridFiltered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridFiltered.map((item) => (
              <TestimonialCard key={`grid-${item.id}`} testimonial={item} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#0A0E18] space-y-3">
            <p className="text-sm text-slate-400">Tidak ada ulasan yang cocok dengan pencarian Anda.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedGridCategory("all");
              }}
            >
              Reset Filter Pencarian
            </Button>
          </div>
        )}
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 to-slate-950/90 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Siap meningkatkan produktivitas tim Anda?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Bergabunglah bersama ribuan founder dan profesional yang telah memercayakan proses
              penyusunan dokumen dan analisis dataset mereka pada KAVRO.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/signup">
                <Button size="lg" className="h-11 px-8 text-xs sm:text-sm font-semibold bg-white text-slate-950 hover:bg-slate-100 rounded-lg shadow-lg">
                  Buka Workspace Gratis Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="h-11 px-7 text-xs sm:text-sm font-medium border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 rounded-lg">
                  Konsultasi Enterprise
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUBMIT TESTIMONIAL MODAL */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0F1524] p-6 sm:p-8 shadow-2xl">
            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Terima Kasih Atas Ulasan Anda!</h3>
                <p className="text-xs text-slate-300">
                  Ulasan Anda telah ditambahkan ke galeri testimoni pengguna secara instan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageSquarePlus className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base font-bold text-white">Bagikan Testimoni Anda</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800"
                  >
                    Batal
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nama Lengkap *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Jabatan / Peran</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Contoh: CEO, Partner, Head of Ops"
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Perusahaan / Organisasi</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Contoh: Tech Nusantara"
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value as Testimonial["category"] })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-blue-500 text-xs"
                      >
                        <option value="founders">Founders & CEOs</option>
                        <option value="consulting">Management Consulting</option>
                        <option value="operations">Strategy & Operations</option>
                        <option value="security">Security & Tech</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Rating (Bintang)</label>
                      <div className="flex items-center space-x-1 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= formData.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">
                      Hasil Terukur / Metrik Singkat (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formData.highlightMetric}
                      onChange={(e) => setFormData({ ...formData, highlightMetric: e.target.value })}
                      placeholder="Contoh: Hemat 15 jam/minggu atau 2.5x Lebih Cepat"
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Ulasan / Pendapat Anda *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.quote}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      placeholder="Ceritakan bagaimana Kavro membantu alur kerja atau bisnis Anda..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowSubmitModal(false)}
                    className="border-slate-800 bg-slate-900 text-slate-300"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Testimoni</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
