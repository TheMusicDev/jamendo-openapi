import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { LanguageModel } from 'ai';

/**
 * Provider-agnostic LLM config, read from env. Works against any
 * OpenAI-compatible endpoint -- a local Ollama server today, a hosted
 * OpenAI-compatible API later -- by changing env vars only, no code change.
 */
export const getLlmModel = (): LanguageModel => {
    const baseURL = process.env.LLM_BASE_URL;
    const apiKey = process.env.LLM_API_KEY;
    const modelId = process.env.LLM_MODEL;

    if (!baseURL) throw new Error('LLM_BASE_URL is not set (e.g. http://localhost:11434/v1 for Ollama)');
    if (!apiKey) throw new Error('LLM_API_KEY is not set (any non-empty value works for Ollama)');
    if (!modelId) throw new Error('LLM_MODEL is not set (e.g. qwen3.5:cloud)');

    const provider = createOpenAICompatible({
        name: 'llm',
        baseURL,
        apiKey,
    });

    return provider.chatModel(modelId);
};
