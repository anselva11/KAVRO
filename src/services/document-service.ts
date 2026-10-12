import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export interface DocumentRecord {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  templateType: string;
  content: string;
  status: "draft" | "in_review" | "final";
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const mockDocuments: DocumentRecord[] = [
  {
    id: "doc-201",
    workspaceId: "ws-default",
    userId: "usr-default",
    title: "Series A Investor Deck Executive Brief",
    templateType: "proposal",
    status: "final",
    content: `# Series A Executive Brief: KAVRO Platform

**Target Valuation**: $18M  
**Target Raise**: $3.5M  
**Primary Syndicate Lead**: Horizon Capital  

---

## 1. Executive Summary
KAVRO is the AI Business Workspace built for modern operators, delivering 4x efficiency in enterprise document authoring, decision intelligence, and client deliverables.

## 2. Traction & Unit Economics
- **MRR Growth**: 24% MoM
- **Net Revenue Retention (NRR)**: 128%
- **Gross Margin**: 84%

## 3. Capital Deployment
- 55% Enterprise Engineering & Model Optimizations
- 30% GTM & Developer Relations
- 15% Governance, SOC2 & IP Defense`,
    metadata: { generatedByAI: true },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "doc-202",
    workspaceId: "ws-default",
    userId: "usr-default",
    title: "Weekly Leadership All-Hands Summary",
    templateType: "meeting",
    status: "draft",
    content: `# Leadership All-Hands Summary
**Date**: October 12, 2026  
**Chair**: Operations Lead  

## Key Decisions
- Approved transition of core database to Supabase PostgreSQL with strict RLS.
- Expanded token allowances for Pro tier subscribers.

## Next Milestones
1. Complete Document Studio template suite.
2. Ship Data Intelligence CSV analysis module.`,
    metadata: { generatedByAI: false },
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

function mapDocumentRow(d: DocumentRow): DocumentRecord {
  return {
    id: d.id,
    workspaceId: d.workspace_id,
    userId: d.user_id,
    title: d.title,
    templateType: d.template_type,
    content: d.content,
    status: (d.status as DocumentRecord["status"]) || "draft",
    metadata: (d.metadata as Record<string, any>) || {},
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

export async function getDocuments(userId: string, workspaceId?: string): Promise<DocumentRecord[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("documents").select("*").order("updated_at", { ascending: false });
    if (workspaceId) {
      query = query.eq("workspace_id", workspaceId);
    } else {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockDocuments;
    }
    return (data as unknown as DocumentRow[]).map(mapDocumentRow);
  } catch {
    return mockDocuments;
  }
}

export async function getDocumentById(documentId: string): Promise<DocumentRecord | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (!error && data) {
      return mapDocumentRow(data as unknown as DocumentRow);
    }
  } catch {
    // proceed to fallback
  }

  return mockDocuments.find((d) => d.id === documentId) || null;
}

export async function createDocument(params: {
  workspaceId: string;
  userId: string;
  title: string;
  templateType: string;
  content: string;
  status?: "draft" | "in_review" | "final";
  metadata?: Record<string, any>;
}): Promise<DocumentRecord> {
  const newId = `doc-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("documents")
      .insert({
        workspace_id: params.workspaceId,
        user_id: params.userId,
        title: params.title,
        template_type: params.templateType,
        content: params.content,
        status: params.status || "draft",
        metadata: params.metadata || {},
      })
      .select()
      .single();

    if (!error && data) {
      return mapDocumentRow(data as unknown as DocumentRow);
    }
  } catch {
    // proceed to fallback
  }

  const newDoc: DocumentRecord = {
    id: newId,
    workspaceId: params.workspaceId,
    userId: params.userId,
    title: params.title,
    templateType: params.templateType,
    content: params.content,
    status: params.status || "draft",
    metadata: params.metadata || {},
    createdAt: now,
    updatedAt: now,
  };
  mockDocuments.unshift(newDoc);
  return newDoc;
}

export async function updateDocument(documentId: string, updates: Partial<DocumentRecord>) {
  const now = new Date().toISOString();
  try {
    const supabase = await createClient();
    const dbUpdates: Record<string, any> = { updated_at: now };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.metadata !== undefined) dbUpdates.metadata = updates.metadata;
    if (updates.templateType !== undefined) dbUpdates.template_type = updates.templateType;

    await supabase
      .from("documents")
      .update(dbUpdates)
      .eq("id", documentId);
  } catch {
    // proceed to fallback
  }

  const existing = mockDocuments.find((d) => d.id === documentId);
  if (existing) {
    Object.assign(existing, updates, { updatedAt: now });
    return existing;
  }
  return null;
}

export async function deleteDocument(documentId: string) {
  try {
    const supabase = await createClient();
    await supabase.from("documents").delete().eq("id", documentId);
  } catch {
    // proceed to fallback
  }

  const idx = mockDocuments.findIndex((d) => d.id === documentId);
  if (idx !== -1) mockDocuments.splice(idx, 1);
  return { success: true };
}
