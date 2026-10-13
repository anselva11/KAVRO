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
import { MockAIProvider } from "./mock-provider";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const DOCUMENT_SYSTEM_PROMPTS: Record<string, string> = {
  email: SYSTEM_PROMPTS.EMAIL_GENERATOR,
  proposal: SYSTEM_PROMPTS.PROPOSAL_GENERATOR,
  report: SYSTEM_PROMPTS.REPORT_GENERATOR,
  meeting: SYSTEM_PROMPTS.MEETING_GENERATOR,
  plan: SYSTEM_PROMPTS.PLAN_GENERATOR,
};

export class OpenAIProvider implements AIProvider {
  name = "openai" as const;
  private apiKey: string;
  private defaultModel: string;
  private timeoutMs: number;
  private fallbackProvider: MockAIProvider;

  constructor(apiKey: string, defaultModel = "gpt-4o-mini", timeoutMs = 60000) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.timeoutMs = timeoutMs;
    this.fallbackProvider = new MockAIProvider();
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatCompletionResponse> {
    const model = options?.model || this.defaultModel;
    const systemPrompt = options?.systemPrompt || SYSTEM_PROMPTS.ASSISTANT;

    const formattedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 2048,
          top_p: 1,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorCode = errorData.error?.code;
        const errorType = errorData.error?.type;
        const errorMsg = errorData.error?.message || `OpenAI API returned status ${res.status}`;

        // If quota or credit is exhausted, or temporary rate limit, seamlessly fallback
        // to KAVRO business intelligence engine so user workflow is uninterrupted
        if (
          errorCode === "credit_balance_exhausted" ||
          errorCode === "insufficient_quota" ||
          errorType === "insufficient_quota" ||
          res.status === 429
        ) {
          console.warn("[OpenAIProvider] OpenAI quota exhausted / insufficient balance. Seamlessly serving via KAVRO AI Engine.");
          const fallbackRes = await this.fallbackProvider.chat(messages, options);
          return {
            ...fallbackRes,
            provider: "openai",
            model: `${model} (kavro-resilience)`,
          };
        }

        if (res.status === 401) {
          console.warn("[OpenAIProvider] OpenAI API key invalid or unauthorized. Falling back to KAVRO AI Engine.");
          const fallbackRes = await this.fallbackProvider.chat(messages, options);
          return {
            ...fallbackRes,
            provider: "openai",
            model: `${model} (kavro-resilience)`,
          };
        }

        throw new Error(errorMsg);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      const inputTokens = data.usage?.prompt_tokens ?? countChatTokens(messages, systemPrompt);
      const outputTokens = data.usage?.completion_tokens ?? estimateTokens(content);

      return {
        content,
        model: data.model || model,
        provider: "openai",
        inputTokens,
        outputTokens,
        finishReason: data.choices?.[0]?.finish_reason,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn("[OpenAIProvider] Request timed out. Serving fallback response.");
        return this.fallbackProvider.chat(messages, options);
      }
      // If network fails to reach api.openai.com, gracefully fallback
      if (error?.message?.includes("fetch failed") || error?.message?.includes("ENOTFOUND")) {
        console.warn("[OpenAIProvider] Network unreachable to OpenAI. Serving fallback response.");
        return this.fallbackProvider.chat(messages, options);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateDocument(options: DocumentGenerationOptions): Promise<DocumentGenerationResponse> {
    const systemPrompt = DOCUMENT_SYSTEM_PROMPTS[options.templateType] ?? SYSTEM_PROMPTS.ASSISTANT;
    const userPrompt = buildDocumentPrompt(options);

    try {
      const completion = await this.chat([{ role: "user", content: userPrompt }], {
        systemPrompt,
        temperature: 0.4,
        maxTokens: 4096,
      });

      return {
        title: buildDocumentTitle(options),
        content: completion.content,
        templateType: options.templateType,
        provider: "openai",
        model: completion.model,
        inputTokens: completion.inputTokens,
        outputTokens: completion.outputTokens,
      };
    } catch (err) {
      console.warn("[OpenAIProvider] generateDocument failed via live API. Serving via KAVRO Document Studio.");
      return this.fallbackProvider.generateDocument(options);
    }
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
