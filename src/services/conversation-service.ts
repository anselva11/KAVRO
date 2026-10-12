import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];
type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

export interface ConversationItem {
  id: string;
  title: string;
  workspaceId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  createdAt: string;
}

// Resilient in-memory store for instant zero-config preview
const mockConversations: ConversationItem[] = [
  {
    id: "conv-101",
    title: "Q4 GTM SaaS Strategy & Pricing Review",
    workspaceId: "ws-default",
    userId: "usr-default",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "conv-102",
    title: "Enterprise Security Compliance RFP Answers",
    workspaceId: "ws-default",
    userId: "usr-default",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

const mockMessages: Record<string, MessageItem[]> = {
  "conv-101": [
    {
      id: "msg-1",
      conversationId: "conv-101",
      userId: "usr-default",
      role: "user",
      content: "Can you evaluate our proposed tiering for an enterprise B2B SaaS product?",
      model: "kavro-core",
      inputTokens: 18,
      outputTokens: 0,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: "msg-2",
      conversationId: "conv-101",
      userId: "kavro-ai",
      role: "assistant",
      content: `### Executive Tiering Evaluation

Here is a recommended 3-tier structure tailored for B2B expansion:

1. **Starter ($49/seat/mo)**: Targeted at individual consultants and early teams. Focus on core workflows and basic exports.
2. **Growth ($99/seat/mo)**: Team collaboration, automated triggers, priority AI quota, and analytics dashboards.
3. **Enterprise (Custom)**: Single Sign-On (SAML/Okta), SOC2 type II compliance pack, custom model fine-tuning, and dedicated SLA.

#### Immediate Recommendations:
- Gate advanced multi-agent workflows to the Growth tier.
- Offer annual payment upfront with a 15% discount to accelerate cash flow.`,
      model: "kavro-core",
      inputTokens: 0,
      outputTokens: 142,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
};

function mapConversationRow(c: ConversationRow): ConversationItem {
  return {
    id: c.id,
    title: c.title,
    workspaceId: c.workspace_id,
    userId: c.user_id,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

function mapMessageRow(m: MessageRow): MessageItem {
  return {
    id: m.id,
    conversationId: m.conversation_id,
    userId: m.user_id,
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
    model: m.model,
    inputTokens: m.input_tokens,
    outputTokens: m.output_tokens,
    createdAt: m.created_at,
  };
}

export async function getConversations(userId: string, workspaceId?: string): Promise<ConversationItem[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("conversations").select("*").order("updated_at", { ascending: false });
    if (workspaceId) {
      query = query.eq("workspace_id", workspaceId);
    } else {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockConversations;
    }
    return (data as unknown as ConversationRow[]).map(mapConversationRow);
  } catch {
    return mockConversations;
  }
}

export async function getConversationWithMessages(conversationId: string) {
  try {
    const supabase = await createClient();
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convError || !conv) {
      const fallbackConv = mockConversations.find((c) => c.id === conversationId);
      const fallbackMsgs = mockMessages[conversationId] || [];
      return {
        conversation: fallbackConv || {
          id: conversationId,
          title: "Active Chat",
          workspaceId: "ws-default",
          userId: "usr-default",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        messages: fallbackMsgs,
      };
    }

    const convRow = conv as unknown as ConversationRow;

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    return {
      conversation: mapConversationRow(convRow),
      messages: ((msgs || []) as unknown as MessageRow[]).map(mapMessageRow),
    };
  } catch {
    const fallbackConv = mockConversations.find((c) => c.id === conversationId);
    const fallbackMsgs = mockMessages[conversationId] || [];
    return {
      conversation: fallbackConv || {
        id: conversationId,
        title: "Active Chat",
        workspaceId: "ws-default",
        userId: "usr-default",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      messages: fallbackMsgs,
    };
  }
}

export async function createConversation(userId: string, workspaceId: string, title: string = "New Conversation") {
  const newId = `conv-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
        title,
      })
      .select()
      .single();

    if (!error && data) {
      const row = data as unknown as ConversationRow;
      return mapConversationRow(row);
    }
  } catch {
    // proceed to fallback
  }

  const fallback: ConversationItem = {
    id: newId,
    title,
    workspaceId,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  mockConversations.unshift(fallback);
  mockMessages[newId] = [];
  return fallback;
}

export async function saveMessage(params: {
  conversationId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}) {
  const newId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("messages")
      .insert({
        conversation_id: params.conversationId,
        user_id: params.userId,
        role: params.role,
        content: params.content,
        model: params.model,
        input_tokens: params.inputTokens ?? 0,
        output_tokens: params.outputTokens ?? 0,
      })
      .select()
      .single();

    if (data) {
      const row = data as unknown as MessageRow;

      // Touch conversation updated_at
      await supabase
        .from("conversations")
        .update({ updated_at: now })
        .eq("id", params.conversationId);

      return mapMessageRow(row);
    }
  } catch {
    // proceed to fallback
  }

  const item: MessageItem = {
    id: newId,
    conversationId: params.conversationId,
    userId: params.userId,
    role: params.role,
    content: params.content,
    model: params.model,
    inputTokens: params.inputTokens ?? 0,
    outputTokens: params.outputTokens ?? 0,
    createdAt: now,
  };

  if (!mockMessages[params.conversationId]) {
    mockMessages[params.conversationId] = [];
  }
  mockMessages[params.conversationId].push(item);

  const conv = mockConversations.find((c) => c.id === params.conversationId);
  if (conv) {
    conv.updatedAt = now;
  }

  return item;
}

export async function updateConversationTitle(conversationId: string, title: string) {
  try {
    const supabase = await createClient();
    await supabase.from("conversations").update({ title }).eq("id", conversationId);
  } catch {
    // update fallback
  }
  const conv = mockConversations.find((c) => c.id === conversationId);
  if (conv) conv.title = title;
  return { id: conversationId, title };
}

export async function deleteConversation(conversationId: string) {
  try {
    const supabase = await createClient();
    await supabase.from("conversations").delete().eq("id", conversationId);
  } catch {
    // delete fallback
  }
  const idx = mockConversations.findIndex((c) => c.id === conversationId);
  if (idx !== -1) mockConversations.splice(idx, 1);
  delete mockMessages[conversationId];
  return { success: true };
}
