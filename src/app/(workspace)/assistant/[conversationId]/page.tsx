"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bot, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConversationSidebar } from "@/components/assistant/conversation-sidebar";
import { ChatMessageItem } from "@/components/assistant/chat-message";
import { ChatInput } from "@/components/assistant/chat-input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model: string;
  outputTokens: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export default function AssistantConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.conversationId as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchConversationsList = () => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.conversations) {
          setConversations(data.conversations);
        }
      })
      .catch(() => {});
  };

  const fetchCurrentConversation = async () => {
    if (!conversationId) return;
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const data = await res.json();
      if (data.success) {
        setConversation(data.conversation);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  useEffect(() => {
    fetchConversationsList();
    fetchCurrentConversation();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setErrorMessage(null);

    // Optimistic user message append
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userText,
      model: "kavro-core",
      outputTokens: 0,
      createdAt: new Date().toISOString(),
    };

    const currentHistory = [...messages, tempUserMsg];
    setMessages(currentHistory);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messages: currentHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI response");
      }

      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }

      fetchConversationsList();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to communicate with AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full -m-4 sm:-m-6 lg:-m-8 overflow-hidden">
      {/* Historical Thread Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <ConversationSidebar
          conversations={conversations}
          activeId={conversationId}
          onRefresh={fetchConversationsList}
        />
      </div>

      {/* Main Chat Stage */}
      <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden">
        {/* Top Thread Bar */}
        <div className="h-12 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between bg-[#0E1524]/40">
          <div className="flex items-center space-x-2 truncate">
            <Link href="/assistant" className="lg:hidden text-slate-400 hover:text-white mr-1">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
              {conversation?.title || "Conversation"}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {messages.length} messages
          </span>
        </div>

        {/* Message Stream Scroll Canvas */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
          {messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              role={msg.role}
              content={msg.content}
              model={msg.model}
              outputTokens={msg.outputTokens}
              createdAt={msg.createdAt}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 py-4 px-4 rounded-xl bg-[#0E1524]/60 border border-slate-800/60 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-primary-600/40 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 bg-slate-700/60 rounded w-1/4" />
                <div className="h-2 bg-slate-800/60 rounded w-3/4" />
              </div>
            </div>
          )}

          {/* Error Alert with Retry */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between text-xs text-red-300">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSend}
                className="h-7 text-xs border-red-500/30 text-red-300 hover:bg-red-500/20"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
