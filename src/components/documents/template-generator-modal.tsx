"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, FileText, BarChart, Users, Calendar, AlertCircle, ArrowRight } from "lucide-react";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: "email" | "proposal" | "report" | "meeting" | "plan";
}

export function TemplateGeneratorModal({ isOpen, onClose, initialTemplate = "proposal" }: TemplateModalProps) {
  const router = useRouter();
  const [templateType, setTemplateType] = useState(initialTemplate);
  const [topic, setTopic] = useState("");
  const [keyPointsText, setKeyPointsText] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<"professional" | "persuasive" | "concise" | "executive" | "technical">("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const templates = [
    { id: "proposal", label: "Commercial Proposal", icon: FileText },
    { id: "report", label: "Executive Report", icon: BarChart },
    { id: "email", label: "Executive Memo", icon: Mail },
    { id: "meeting", label: "Meeting Summary", icon: Users },
    { id: "plan", label: "Project Roadmap", icon: Calendar },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const points = keyPointsText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/ai/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType,
          topic,
          keyPoints: points.length > 0 ? points : [topic],
          audience: audience || undefined,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate document");
      }

      onClose();
      if (data.document?.id) {
        router.push(`/documents/${data.document.id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate document.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Draft Business Deliverable"
      description="Select an architectural template and provide structured context."
      maxWidth="lg"
    >
      <form onSubmit={handleGenerate} className="space-y-4 pt-2">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-xs text-red-300 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Template Type Picker */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
            Framework Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {templates.map((t) => {
              const Icon = t.icon;
              const isSelected = templateType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateType(t.id as any)}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center space-x-2 transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary-500 bg-primary-500/15 text-white"
                      : "border-slate-800 bg-navy-900/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-primary-400" : "text-slate-500"}`} />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Input */}
        <Input
          label="Subject / Scope Focus"
          id="doc-topic"
          placeholder="e.g. Enterprise Cloud Infrastructure Migration or Q4 Retention Strategy"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Key Points */}
        <Textarea
          label="Context & Discussion Points (one per line)"
          id="doc-points"
          rows={3}
          placeholder="e.g.&#10;Phase 1 architecture review&#10;SOC2 compliance certification&#10;Milestone budget: $75,000"
          value={keyPointsText}
          onChange={(e) => setKeyPointsText(e.target.value)}
        />

        {/* Tone and Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Target Audience"
            id="doc-audience"
            placeholder="e.g. Operating Board or Enterprise Customer"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />

          <div>
            <label htmlFor="doc-tone" className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Register & Tone
            </label>
            <select
              id="doc-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full h-10 px-3 text-xs text-slate-100 bg-navy-900 border border-slate-800 rounded-lg focus:outline-none focus:border-slate-700 font-mono"
            >
              <option value="professional">Professional & Direct</option>
              <option value="persuasive">Commercial & Persuasive</option>
              <option value="executive">Executive Strategic</option>
              <option value="concise">Concise & Minimal</option>
              <option value="technical">Technical Specification</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800/80">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
            className="h-8 text-xs bg-slate-100 text-slate-950 hover:bg-white font-medium border-0"
          >
            Draft Deliverable <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
