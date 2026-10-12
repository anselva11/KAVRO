"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Terminal, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  outputTokens?: number;
  createdAt?: string;
}

export function ChatMessageItem({ role, content, model, outputTokens }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full space-x-3 py-3.5 px-3 sm:px-4 rounded-lg transition-colors",
        isUser ? "bg-transparent" : "bg-[#090D16] border border-slate-800/80"
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-300">
            OP
          </div>
        ) : (
          <div className="w-6 h-6 rounded bg-slate-900 border border-slate-700/80 flex items-center justify-center text-[10px] font-mono font-bold text-primary-400">
            KV
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-200">
            {isUser ? "Operator" : "Kavro Assistant"}
          </span>
          {!isUser && (
            <div className="flex items-center space-x-2 text-slate-500 font-mono text-[10px]">
              {model && <span>{model}</span>}
              <button
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Copy markdown"
                aria-label="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed break-words font-sans">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ ...props }) => (
                <div className="my-3 overflow-x-auto rounded border border-slate-800">
                  <table className="w-full text-xs text-left" {...props} />
                </div>
              ),
              th: ({ ...props }) => (
                <th className="bg-slate-900 px-3 py-2 font-semibold text-slate-200 border-b border-slate-800" {...props} />
              ),
              td: ({ ...props }) => (
                <td className="px-3 py-2 border-b border-slate-900 text-slate-300" {...props} />
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-[#05080E] border border-slate-800 p-3 rounded overflow-x-auto font-mono text-xs text-slate-200 my-2">
                    <code {...props}>{children}</code>
                  </pre>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
