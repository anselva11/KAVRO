import { AIProvider, ChatMessage, ChatOptions, ChatCompletionResponse, DocumentGenerationOptions, DocumentGenerationResponse } from "@/types/ai";
import { SYSTEM_PROMPTS } from "./prompts";
import { countChatTokens } from "./token-counter";
import { estimateTokens } from "../utils";

export class OpenAIProvider implements AIProvider {
  name = "openai" as const;
  private apiKey: string;
  private defaultModel: string;
  private timeoutMs: number;

  constructor(apiKey: string, defaultModel = "gpt-4o-mini", timeoutMs = 30000) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.timeoutMs = timeoutMs;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatCompletionResponse> {
    const model = options?.model || this.defaultModel;
    const systemPrompt = options?.systemPrompt || SYSTEM_PROMPTS.ASSISTANT;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `OpenAI request failed with status ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      const inputTokens = data.usage?.prompt_tokens ?? countChatTokens(messages, systemPrompt);
      const outputTokens = data.usage?.completion_tokens ?? estimateTokens(content);

      return {
        content,
        model,
        provider: "openai",
        inputTokens,
        outputTokens,
        finishReason: data.choices?.[0]?.finish_reason,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateDocument(options: DocumentGenerationOptions): Promise<DocumentGenerationResponse> {
    let systemPrompt = SYSTEM_PROMPTS.ASSISTANT;
    switch (options.templateType) {
      case "email":
        systemPrompt = SYSTEM_PROMPTS.EMAIL_GENERATOR;
        break;
      case "proposal":
        systemPrompt = SYSTEM_PROMPTS.PROPOSAL_GENERATOR;
        break;
      case "report":
        systemPrompt = SYSTEM_PROMPTS.REPORT_GENERATOR;
        break;
      case "meeting":
        systemPrompt = SYSTEM_PROMPTS.MEETING_GENERATOR;
        break;
      case "plan":
        systemPrompt = SYSTEM_PROMPTS.PLAN_GENERATOR;
        break;
    }

    const userPrompt = `Template: ${options.templateType}
Topic: ${options.topic}
Target Audience: ${options.audience || "General Business"}
Tone: ${options.tone || "Professional"}
Key Points:
${options.keyPoints.map((p) => `- ${p}`).join("\n")}
${options.customInstructions ? `Additional Instructions: ${options.customInstructions}` : ""}`;

    const completion = await this.chat(
      [{ role: "user", content: userPrompt }],
      { systemPrompt, temperature: 0.5, maxTokens: 3000 }
    );

    return {
      title: `${options.templateType.toUpperCase()}: ${options.topic}`,
      content: completion.content,
      templateType: options.templateType,
      provider: "openai",
      model: completion.model,
      inputTokens: completion.inputTokens,
      outputTokens: completion.outputTokens,
    };
  }
}
