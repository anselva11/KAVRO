import { z } from "zod";

export const createConversationSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID").optional(),
  title: z.string().min(1).max(100).default("New Conversation"),
});

export const updateConversationSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(100),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
