export type SupportedAIProvider = 'mock' | 'openai' | 'anthropic' | 'gemini';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  finishReason?: string;
}

export interface DocumentGenerationOptions {
  templateType: 'email' | 'proposal' | 'report' | 'meeting' | 'plan';
  topic: string;
  keyPoints: string[];
  audience?: string;
  tone?: 'professional' | 'persuasive' | 'concise' | 'executive' | 'technical';
  customInstructions?: string;
}

export interface DocumentGenerationResponse {
  title: string;
  content: string;
  templateType: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface AIProvider {
  name: SupportedAIProvider;
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatCompletionResponse>;
  generateDocument(options: DocumentGenerationOptions): Promise<DocumentGenerationResponse>;
}
