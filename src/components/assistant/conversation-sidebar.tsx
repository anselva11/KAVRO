"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare, MoreVertical, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onRefresh: () => void;
}

export function ConversationSidebar({ conversations, activeId, onRefresh }: ConversationSidebarProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim()) return;

    try {
      await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });
      setEditingId(null);
      onRefresh();
    } catch {}
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      onRefresh();
      if (activeId === id) {
        router.push("/assistant");
      }
    } catch {}
  };

  return (
    <div className="w-64 border-r border-slate-800/80 bg-[#0A0F1D] flex flex-col h-full">
      {/* Top action */}
      <div className="p-3 border-b border-slate-800/80">
        <Link href="/assistant">
          <Button variant="secondary" size="sm" className="w-full text-xs font-medium justify-start h-8">
            <Plus className="w-3.5 h-3.5 mr-2 text-primary-400" /> New Conversation
          </Button>
        </Link>
      </div>

      {/* Conversations scroll area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <p className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          History
        </p>

        {conversations.length === 0 ? (
          <div className="p-3 text-center text-xs text-slate-500">No chat history</div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeId === conv.id;
            const isEditing = editingId === conv.id;

            return (
              <div
                key={conv.id}
                className={cn(
                  "group relative flex items-center rounded-lg text-xs transition-colors",
                  isActive
                    ? "bg-slate-800/80 text-white font-medium"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                )}
              >
                {isEditing ? (
                  <div className="flex items-center w-full p-1 space-x-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-navy-950 px-2 py-1 text-xs rounded border border-slate-700 text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={(e) => saveRename(conv.id, e)}
                      className="p-1 text-emerald-400 hover:bg-slate-700 rounded cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="p-1 text-slate-400 hover:bg-slate-700 rounded cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/assistant/${conv.id}`}
                      className="flex-1 flex items-center px-2.5 py-2 overflow-hidden truncate"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-2 shrink-0 text-slate-500 group-hover:text-primary-400" />
                      <span className="truncate">{conv.title}</span>
                    </Link>

                    {/* Actions on hover */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center pr-1 transition-opacity">
                      <button
                        onClick={(e) => startRename(conv, e)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(conv.id, e)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
