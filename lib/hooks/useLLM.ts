// lib/hooks/useLLM.ts
'use client';

import { useState, useCallback } from 'react';

export interface LLMResult {
  content?: string;
  command?: string;
  error?: string;
  model?: string;
}

export function useLLM() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LLMResult | null>(null);

  const callLLM = useCallback(async (
    action: 'generate' | 'transform',
    prompt: string,
    context?: any,
    model?: string
  ): Promise<LLMResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, prompt, context, model })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.suggestion || data.message || data.error || 'LLM request failed';
        setError(errorMessage);
        setResult({ error: errorMessage });
        return { error: errorMessage };
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      setResult({ error: errorMessage });
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateContent = useCallback(
    (prompt: string, context?: any) => callLLM('generate', prompt, context),
    [callLLM]
  );

  const transformCommand = useCallback(
    (prompt: string, sections: any[]) => callLLM('transform', prompt, { sections }),
    [callLLM]
  );

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setIsLoading(false);
  }, []);

  return {
    generateContent,
    transformCommand,
    isLoading,
    error,
    result,
    reset
  };
}