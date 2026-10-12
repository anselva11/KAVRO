"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowRight, Code, BarChart, FileText, Compass } from "lucide-react";
import { ConversationSidebar } from "@/components/assistant/conversation-sidebar";
import { ChatInput } from "@/components/assistant/chat-input";

export default function AssistantNewChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchConversations = () => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.conversations) {
          setConversations(data.conversations);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: textToSend }],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate session");
      }

      if (data.conversationId) {
        router.push(`/assistant/${data.conversationId}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    {
      title: "Evaluate SaaS Tiering & Unit Economics",
      desc: "Analyze value metrics, ARPU elasticity, and competitor benchmarks.",
      icon: BarChart,
      prompt: "Can you evaluate our proposed tiering for an enterprise B2B SaaS product? What metrics should we consider?",
    },
    {
      title: "Draft Commercial Master Services Agreement",
      desc: "Draft milestone delivery terms, governance SLAs, and liability scopes.",
      icon: FileText,
      prompt: "Draft an executive summary and milestone breakdown for an enterprise software consulting agreement.",
    },
    {
      title: "Audit Route Architecture & Security",
      desc: "Architect a resilient, rate-limited Next.js route handler with Supabase RLS.",
      icon: Code,
      prompt: "Provide a production-ready Next.js Route Handler pattern with Zod validation and safe error boundaries.",
    },
    {
      title: "Quarterly Board Review Agenda",
      desc: "Synthesize operational updates into a concise board briefing deck.",
      icon: Compass,
      prompt: "Structure a high-impact Quarterly Business Review (QBR) agenda and executive briefing framework.",
    },
  ];

  return (
    <div className="flex h-full -m-4 sm:-m-6 lg:-m-8 overflow-hidden">
      {/* Historical Thread Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <ConversationSidebar
          conversations={conversations}
          onRefresh={fetchConversations}
        />
      </div>

      {/* Main Chat Stage */}
      <div className="flex-1 flex flex-col h-full bg-[#080C14] overflow-hidden">
        {/* Chat Canvas (Empty State) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto w-full">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-300 font-mono text-sm font-semibold">
              KV
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Assistant Session
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Dispatch strategic directives, review commercial terms, or audit architectures. All records are isolated per workspace.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 w-full text-left font-mono">
              {errorMessage}
            </div>
          )}

          {/* Starter Directives Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
            {starterPrompts.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(p.prompt)}
                  disabled={isLoading}
                  className="p-3.5 rounded-lg border border-slate-800 bg-[#0A0E18] hover:border-slate-700 hover:bg-[#0E1320] transition-all text-left space-y-1 cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-400" />
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                      {p.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-[#080C14]/90 backdrop-blur-md">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={() => handleSend()}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
