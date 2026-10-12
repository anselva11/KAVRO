"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Copy,
  Trash2,
  Clock,
  ArrowRight,
  Mail,
  BarChart,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateGeneratorModal } from "@/components/documents/template-generator-modal";
import { formatDate } from "@/lib/utils";

interface DocumentItem {
  id: string;
  title: string;
  templateType: string;
  content: string;
  status: "draft" | "in_review" | "final";
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<any>("proposal");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.success && data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const openGenerateModal = (type: any) => {
    setModalTemplate(type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await fetch(`/api/documents/${id}`, { method: "DELETE" });
      fetchDocuments();
    } catch {}
  };

  const handleDuplicate = async (doc: DocumentItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: "ws-default",
          title: `${doc.title} (Copy)`,
          templateType: doc.templateType,
          content: doc.content,
          status: "draft",
        }),
      });
      fetchDocuments();
    } catch {}
  };

  const templates = [
    {
      id: "proposal",
      title: "Commercial Proposal",
      desc: "Problem scope, methodology, timeline milestones, and investment terms.",
      icon: FileText,
    },
    {
      id: "report",
      title: "Executive Report",
      desc: "Structured business report with factual findings, risks, and strategic initiatives.",
      icon: BarChart,
    },
    {
      id: "email",
      title: "Executive Correspondence",
      desc: "Polished client and partner emails with clear calls to action.",
      icon: Mail,
    },
    {
      id: "meeting",
      title: "Meeting Summary & Actions",
      desc: "Synthesize unstructured discussion notes into decisions and accountability tables.",
      icon: Users,
    },
    {
      id: "plan",
      title: "Project Plan & Roadmap",
      desc: "Milestone roadmap with work breakdown structure, phases, and KPIs.",
      icon: Calendar,
    },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || doc.templateType === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* 1. STUDIO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Document Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured business document drafting, markdown editing, and exports.
          </p>
        </div>

        <Button
          onClick={() => openGenerateModal("proposal")}
          size="sm"
          className="h-8 px-3.5 text-xs bg-slate-100 text-slate-950 hover:bg-white font-medium border-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> New Document
        </Button>
      </div>

      {/* 2. TEMPLATES GALLERY */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Document Frameworks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {templates.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => openGenerateModal(t.id)}
                className="p-3.5 rounded-lg border border-slate-800 bg-[#0A0E18] hover:border-slate-700 hover:bg-[#0E1320] transition-all text-left space-y-2 cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-400 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug mt-1">{t.desc}</p>
                </div>
                <div className="pt-1 text-[11px] text-primary-400 font-mono flex items-center">
                  Draft Framework <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SAVED DOCUMENTS REPOSITORY */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Repository ({filteredDocs.length})
          </h2>

          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 pl-7 pr-3 text-xs bg-[#0A0E18] border border-slate-800 rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700 w-44 sm:w-56 font-mono"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-7 px-2 text-xs bg-[#0A0E18] border border-slate-800 rounded text-slate-300 focus:outline-none font-mono"
            >
              <option value="all">All Types</option>
              <option value="proposal">Proposals</option>
              <option value="report">Reports</option>
              <option value="email">Emails</option>
              <option value="meeting">Meetings</option>
              <option value="plan">Plans</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="p-10 text-center rounded-lg border border-slate-800 bg-[#090D15] space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No documents matched your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDocs.map((doc) => (
              <Card
                key={doc.id}
                className="border-slate-800 bg-[#090D15] hover:border-slate-700 transition-colors flex flex-col justify-between group"
              >
                <CardHeader className="space-y-1.5 p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      {doc.templateType}
                    </span>
                    <Badge
                      variant={doc.status === "final" ? "success" : "secondary"}
                      className="text-[10px] py-0 capitalize font-mono"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <Link href={`/documents/${doc.id}`} className="block">
                    <CardTitle className="text-xs font-semibold group-hover:text-primary-300 transition-colors truncate">
                      {doc.title}
                    </CardTitle>
                  </Link>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {doc.content.replace(/[#*`_]/g, "").slice(0, 110)}...
                  </p>
                </CardHeader>

                <CardContent className="p-4 pt-0 border-t border-slate-800/60 mt-2 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{formatDate(doc.updatedAt)}</span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleDuplicate(doc, e)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <Link href={`/documents/${doc.id}`}>
                      <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] text-primary-400">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Generator Modal */}
      <TemplateGeneratorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchDocuments();
        }}
        initialTemplate={modalTemplate}
      />
    </div>
  );
}
