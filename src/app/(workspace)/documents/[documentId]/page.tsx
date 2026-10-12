"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Save,
  Copy,
  Download,
  Trash2,
  Check,
  Eye,
  Edit3,
  Columns,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentData {
  id: string;
  title: string;
  templateType: string;
  content: string;
  status: "draft" | "in_review" | "final";
  updatedAt: string;
}

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.documentId as string;

  const [docRecord, setDocRecord] = useState<DocumentData | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "in_review" | "final">("draft");
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDoc() {
      try {
        const res = await fetch(`/api/documents/${documentId}`);
        const data = await res.json();
        if (data.success && data.document) {
          setDocRecord(data.document);
          setTitle(data.document.title);
          setContent(data.document.content);
          setStatus(data.document.status || "draft");
        }
      } catch (err) {
        console.error("Failed to load document:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDoc();
  }, [documentId]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save document:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await fetch(`/api/documents/${documentId}`, { method: "DELETE" });
      router.push("/documents");
    } catch {}
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-slate-500">
        Loading document workspace...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-4 sm:-m-6 lg:-m-8 bg-[#0B0F19] overflow-hidden">
      {/* Top Editor Bar */}
      <div className="h-14 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between bg-[#0E1524]/60 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3 flex-1 min-w-0 pr-4">
          <Link
            href="/documents"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="bg-transparent text-sm sm:text-base font-semibold text-white focus:outline-none focus:border-b border-primary-500 max-w-sm sm:max-w-md w-full truncate"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="text-[11px] bg-navy-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none hidden sm:block"
          >
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="final">Final</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* View toggle (desktop) */}
          <div className="hidden md:flex items-center bg-navy-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("edit")}
              className={`p-1.5 rounded text-xs cursor-pointer ${
                viewMode === "edit" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Editor Only"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded text-xs cursor-pointer ${
                viewMode === "split" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Split View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`p-1.5 rounded text-xs cursor-pointer ${
                viewMode === "preview" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-xs hidden sm:inline-flex">
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>

          <Button variant="secondary" size="sm" onClick={handleExport} className="h-8 text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            className="h-8 text-xs font-semibold shadow-sm"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Saved
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1" /> Save
              </>
            )}
          </Button>

          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Preview Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={`flex-1 flex flex-col h-full bg-[#0A0E18] border-r border-slate-800/80 p-4 sm:p-6 overflow-hidden ${viewMode === "split" ? "w-1/2" : "w-full"}`}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start drafting or editing your document here..."
              className="w-full flex-1 bg-transparent text-xs sm:text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        )}

        {/* Live Formatted Markdown Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`flex-1 overflow-y-auto p-6 sm:p-10 bg-[#0B0F19] ${viewMode === "split" ? "w-1/2" : "w-full"}`}>
            <div className="max-w-2xl mx-auto prose prose-invert prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed text-xs sm:text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ ...props }) => (
                    <div className="my-4 overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full text-xs text-left" {...props} />
                    </div>
                  ),
                  th: ({ ...props }) => (
                    <th className="bg-slate-800 px-3 py-2 font-semibold text-slate-200 border-b border-slate-700" {...props} />
                  ),
                  td: ({ ...props }) => (
                    <td className="px-3 py-2 border-b border-slate-800/60 text-slate-300" {...props} />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Ribbon */}
      <div className="h-8 border-t border-slate-800/80 bg-[#080C14] px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
        <div className="flex items-center space-x-4">
          <span>{wordCount} words</span>
          <span>{content.length} chars</span>
          <span>~{readingTime} min read</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Markdown Mode</span>
          <span className="text-slate-700">•</span>
          <span className="text-emerald-400">Autosave Ready</span>
        </div>
      </div>
    </div>
  );
}
