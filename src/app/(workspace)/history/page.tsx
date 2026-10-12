"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { History, Bot, FileText, Clock, ArrowRight, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const [convRes, docRes] = await Promise.all([
          fetch("/api/conversations"),
          fetch("/api/documents"),
        ]);
        const convData = await convRes.json();
        const docData = await docRes.json();

        const combined = [
          ...(convData.conversations || []).map((c: any) => ({
            id: c.id,
            title: c.title,
            type: "chat",
            updatedAt: c.updatedAt,
            href: `/assistant/${c.id}`,
          })),
          ...(docData.documents || []).map((d: any) => ({
            id: d.id,
            title: d.title,
            type: "document",
            templateType: d.templateType,
            updatedAt: d.updatedAt,
            href: `/documents/${d.id}`,
          })),
        ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        setItems(combined);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium mb-1 border border-slate-700">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Workspace Activity History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Chronological audit log of all assistant conversations and document generations.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-2 bg-navy-900 border border-slate-800 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filter === "all" ? "bg-slate-800 text-white font-medium" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter("chat")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filter === "chat" ? "bg-slate-800 text-white font-medium" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setFilter("document")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filter === "document" ? "bg-slate-800 text-white font-medium" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      {/* Timeline items */}
      <div className="rounded-2xl border border-slate-800 bg-[#0E1524] divide-y divide-slate-800/60 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No activity records found for this filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors group block"
            >
              <div className="flex items-center space-x-3 overflow-hidden pr-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    item.type === "chat"
                      ? "text-primary-400 bg-primary-500/10 border-primary-500/20"
                      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  {item.type === "chat" ? <Bot className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>

                <div className="space-y-0.5 truncate">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-primary-300 transition-colors truncate">
                      {item.title}
                    </p>
                    <Badge variant="outline" className="text-[10px] py-0 uppercase font-mono">
                      {item.templateType || item.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {formatDate(item.updatedAt)}
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 shrink-0" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
