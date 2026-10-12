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

export class GeminiProvider implements AIProvider {
  name = "gemini" as const;
  private apiKey: string;
  private defaultModel: string;
  private timeoutMs: number;

  constructor(apiKey: string, defaultModel = "gemini-1.5-flash", timeoutMs = 45000) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.timeoutMs = timeoutMs;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatCompletionResponse> {
    const model = options?.model || this.defaultModel;
    const systemPrompt = options?.systemPrompt || SYSTEM_PROMPTS.ASSISTANT;

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 2048,
          },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini request failed with status ${res.status}`);
      }

      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const inputTokens =
        data.usageMetadata?.promptTokenCount ?? countChatTokens(messages, systemPrompt);
      const outputTokens =
        data.usageMetadata?.candidatesTokenCount ?? estimateTokens(content);

      return {
        content,
        model,
        provider: "gemini",
        inputTokens,
        outputTokens,
        finishReason: data.candidates?.[0]?.finishReason,
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
      provider: "gemini",
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
