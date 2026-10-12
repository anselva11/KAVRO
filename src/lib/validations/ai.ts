import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1, "Message content cannot be empty").max(16000),
});

export const chatRequestSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID").optional(),
  workspaceId: z.string().uuid("Invalid workspace ID").optional(),
  messages: z.array(chatMessageSchema).min(1, "At least one message is required"),
  model: z.string().max(50).optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

export const generateDocumentSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID").optional(),
  templateType: z.enum(["email", "proposal", "report", "meeting", "plan"]),
  topic: z.string().min(3, "Topic must be at least 3 characters").max(200),
  keyPoints: z.array(z.string()).min(1, "Provide at least one key point"),
  audience: z.string().max(100).optional(),
  tone: z.enum(["professional", "persuasive", "concise", "executive", "technical"]).default("professional"),
  customInstructions: z.string().max(1000).optional(),
});

export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>;
