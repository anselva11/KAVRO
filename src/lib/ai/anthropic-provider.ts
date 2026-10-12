import {
  AIProvider,
  ChatMessage,
  ChatOptions,
  ChatCompletionResponse,
  DocumentGenerationOptions,
  DocumentGenerationResponse,
} from "@/types/ai";
import { SYSTEM_PROMPTS } from "./prompts";
import { countChatTokens } from "./token-counter";
import { estimateTokens } from "../utils";

const DOCUMENT_SYSTEM_PROMPTS: Record<string, string> = {
  email: SYSTEM_PROMPTS.EMAIL_GENERATOR,
  proposal: SYSTEM_PROMPTS.PROPOSAL_GENERATOR,
  report: SYSTEM_PROMPTS.REPORT_GENERATOR,
  meeting: SYSTEM_PROMPTS.MEETING_GENERATOR,
  plan: SYSTEM_PROMPTS.PLAN_GENERATOR,
};

export class AnthropicProvider implements AIProvider {
  name = "anthropic" as const;
  private apiKey: string;
  private defaultModel: string;
  private timeoutMs: number;

  constructor(apiKey: string, defaultModel = "claude-3-5-sonnet-20241022", timeoutMs = 45000) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.timeoutMs = timeoutMs;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatCompletionResponse> {
    const model = options?.model || this.defaultModel;
    const systemPrompt = options?.systemPrompt || SYSTEM_PROMPTS.ASSISTANT;

    const formattedMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          system: systemPrompt,
          messages: formattedMessages,
          max_tokens: options?.maxTokens ?? 2048,
          temperature: options?.temperature ?? 0.7,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `Anthropic request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      const content = data.content?.[0]?.text || "";
      const inputTokens = data.usage?.input_tokens ?? countChatTokens(messages, systemPrompt);
      const outputTokens = data.usage?.output_tokens ?? estimateTokens(content);

      return {
        content,
        model,
        provider: "anthropic",
        inputTokens,
        outputTokens,
        finishReason: data.stop_reason,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateDocument(options: DocumentGenerationOptions): Promise<DocumentGenerationResponse> {
    const systemPrompt = DOCUMENT_SYSTEM_PROMPTS[options.templateType] ?? SYSTEM_PROMPTS.ASSISTANT;

    const userPrompt = buildDocumentPrompt(options);

    const completion = await this.chat([{ role: "user", content: userPrompt }], {
      systemPrompt,
      temperature: 0.4,
      maxTokens: 3500,
    });

    return {
      title: buildDocumentTitle(options),
      content: completion.content,
      templateType: options.templateType,
      provider: "anthropic",
      model: completion.model,
      inputTokens: completion.inputTokens,
      outputTokens: completion.outputTokens,
    };
  }
}

function buildDocumentPrompt(options: DocumentGenerationOptions): string {
  return [
    `Template: ${options.templateType}`,
    `Topic: ${options.topic}`,
    `Target Audience: ${options.audience || "General Business"}`,
    `Tone: ${options.tone || "Professional"}`,
    `Key Points:\n${options.keyPoints.map((p) => `- ${p}`).join("\n")}`,
    options.customInstructions ? `Additional Instructions: ${options.customInstructions}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildDocumentTitle(options: DocumentGenerationOptions): string {
  return `${options.templateType.toUpperCase()}: ${options.topic}`;
}
