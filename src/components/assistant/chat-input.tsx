"use client";

import React, { useRef, useEffect } from "react";
import { Send, Square, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop?: () => void;
  placeholder?: string;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  placeholder = "Send instructions or query... (e.g. 'Draft our Q4 commercial restructuring agreement')",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="relative rounded-xl border border-slate-800 bg-[#090D15] p-2 focus-within:border-slate-700 transition-colors shadow-sm">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none max-h-48 leading-relaxed font-sans"
      />

      <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-900 mt-1 text-xs">
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
          <span className="hidden sm:inline">Press</span>
          <span className="kbd-badge">Enter</span>
          <span className="hidden sm:inline">to dispatch</span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="hidden sm:inline">Shift + Enter for new line</span>
        </div>

        <div>
          {isLoading ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onStop}
              className="h-7 px-2.5 text-xs rounded"
            >
              <Square className="w-3 h-3 mr-1 fill-current" /> Stop
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={onSend}
              disabled={!input.trim()}
              className="h-7 px-3 text-xs rounded bg-slate-100 text-slate-950 hover:bg-white font-medium border-0 disabled:opacity-30"
            >
              Send <CornerDownLeft className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
