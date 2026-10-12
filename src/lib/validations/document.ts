import { z } from "zod";

export const createDocumentSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  title: z.string().min(1, "Title is required").max(150),
  templateType: z.string().default("custom"),
  content: z.string().default(""),
  status: z.enum(["draft", "in_review", "final"]).default("draft"),
  metadata: z.record(z.any()).default({}),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "in_review", "final"]).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
