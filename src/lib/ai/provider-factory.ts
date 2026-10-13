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

  const rawProvider = (process.env.AI_PROVIDER || "").toLowerCase();
  const openAiKey = process.env.AI_PROVIDER_API_KEY || process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || (rawProvider === "gemini" ? process.env.AI_PROVIDER_API_KEY : undefined);
  const anthropicKey = process.env.ANTHROPIC_API_KEY || (rawProvider === "anthropic" ? process.env.AI_PROVIDER_API_KEY : undefined);

  const model = process.env.AI_MODEL;
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 60000;

  // Resolve provider with priority: explicit provider setting -> available keys -> mock
  if ((rawProvider === "openai" || (!rawProvider && openAiKey)) && openAiKey) {
    defaultProviderInstance = new OpenAIProvider(openAiKey, model || "gpt-4o-mini", timeoutMs);
  } else if (rawProvider === "gemini" && geminiKey) {
    defaultProviderInstance = new GeminiProvider(geminiKey, model || "gemini-1.5-flash", timeoutMs);
  } else if (rawProvider === "anthropic" && anthropicKey) {
    defaultProviderInstance = new AnthropicProvider(anthropicKey, model || "claude-3-5-sonnet-20241022", timeoutMs);
  } else if (openAiKey) {
    // If any OpenAI key is present, default to OpenAI as requested
    defaultProviderInstance = new OpenAIProvider(openAiKey, model || "gpt-4o-mini", timeoutMs);
  } else {
    // Zero-dependency mock provider for preview & offline development
    defaultProviderInstance = new MockAIProvider();
  }

  return defaultProviderInstance;
}

/** Reset the singleton (useful in tests or when env vars change at runtime). */
export function resetAIProvider(): void {
  defaultProviderInstance = null;
}
