import { AIProvider, SupportedAIProvider } from "@/types/ai";
import { MockAIProvider } from "./mock-provider";
import { OpenAIProvider } from "./openai-provider";
import { GeminiProvider } from "./gemini-provider";
import { AnthropicProvider } from "./anthropic-provider";

// Singleton provider instance — initialized once at module load time,
// avoiding repeated env lookups on every request.
let defaultProviderInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (defaultProviderInstance) {
    return defaultProviderInstance;
  }

  const providerType = (process.env.AI_PROVIDER || "mock").toLowerCase() as SupportedAIProvider;
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  const model = process.env.AI_MODEL;

  // Generous timeout for long-form document generation (90s) vs chat (45s)
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 45000;

  if (providerType === "openai" && apiKey) {
    defaultProviderInstance = new OpenAIProvider(apiKey, model || "gpt-4o-mini", timeoutMs);
  } else if (providerType === "gemini" && apiKey) {
    defaultProviderInstance = new GeminiProvider(apiKey, model || "gemini-1.5-flash", timeoutMs);
  } else if (providerType === "anthropic" && apiKey) {
    defaultProviderInstance = new AnthropicProvider(apiKey, model || "claude-3-5-sonnet-20241022", timeoutMs);
  } else {
    // Robust zero-dependency mock provider for demo / development
    defaultProviderInstance = new MockAIProvider();
  }

  return defaultProviderInstance;
}

/** Reset the singleton (useful in tests or when env vars change at runtime). */
export function resetAIProvider(): void {
  defaultProviderInstance = null;
}
