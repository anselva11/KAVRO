import { AIProvider, SupportedAIProvider } from "@/types/ai";
import { MockAIProvider } from "./mock-provider";
import { OpenAIProvider } from "./openai-provider";
import { GeminiProvider } from "./gemini-provider";
import { AnthropicProvider } from "./anthropic-provider";

let defaultProviderInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (defaultProviderInstance) {
    return defaultProviderInstance;
  }

  const providerType = (process.env.AI_PROVIDER || "mock").toLowerCase() as SupportedAIProvider;
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  const model = process.env.AI_MODEL;
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 30000;

  if (providerType === "openai" && apiKey) {
    defaultProviderInstance = new OpenAIProvider(apiKey, model || "gpt-4o-mini", timeoutMs);
  } else if (providerType === "gemini" && apiKey) {
    defaultProviderInstance = new GeminiProvider(apiKey, model || "gemini-1.5-flash", timeoutMs);
  } else if (providerType === "anthropic" && apiKey) {
    defaultProviderInstance = new AnthropicProvider(apiKey, model || "claude-3-5-sonnet-20241022", timeoutMs);
  } else {
    // If provider is set to mock, or API key is absent, use the robust MockAIProvider
    defaultProviderInstance = new MockAIProvider();
  }

  return defaultProviderInstance;
}
