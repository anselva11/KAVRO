import { estimateTokens, estimateCost } from "../utils";
import { ChatMessage } from "@/types/ai";

export function countChatTokens(messages: ChatMessage[], systemPrompt?: string): number {
  let text = systemPrompt || "";
  for (const msg of messages) {
    text += `\n${msg.role}: ${msg.content}`;
  }
  return estimateTokens(text);
}

export function calculateUsageCosts(inputTokens: number, outputTokens: number, model: string = "kavro-core") {
  const estimatedCost = estimateCost(inputTokens, outputTokens, model);
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCost,
  };
}
