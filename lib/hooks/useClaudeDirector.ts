// lib/hooks/useClaudeDirector.ts
// React hook for Claude Director - the real AI design director

'use client';

import { useState, useCallback } from 'react';
import type { DesignSpec } from '@/lib/claude-director';

interface ClaudeDirectorResult {
  spec: DesignSpec;
  page: any;
  debug: {
    prompt: string;
    philosophy: string;
    personality: string;
    principles: string[];
    sectionsGenerated: number;
  };
  meta: {
    generatedBy: string;
    model: string;
    timestamp: string;
    intent: string;
  };
  renderTime: number;
}

interface ClaudeDirectorError {
  error: string;
  details: string;
  isClaudeError: boolean;
  fallbackAvailable: boolean;
}

export function useClaudeDirector() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ClaudeDirectorError | null>(null);
  const [result, setResult] = useState<ClaudeDirectorResult | null>(null);
  const [history, setHistory] = useState<ClaudeDirectorResult[]>([]);

  const generate = useCallback(async (
    intent: string,
    context?: {
      industry?: string;
      targetAudience?: string;
      competitors?: string[];
      brandGuidelines?: string;
    }
  ): Promise<ClaudeDirectorResult> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🧠 Asking Claude Director:', intent);

      const response = await fetch('/api/claude-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Generation failed');
      }

      const data: ClaudeDirectorResult = await response.json();
      
      console.log('✨ Claude generated:', data.debug.philosophy);
      console.log('🎨 Personality:', data.debug.personality);
      console.log('📐 Principles:', data.debug.principles);
      
      setResult(data);
      setHistory(prev => [data, ...prev.slice(0, 9)]); // Keep last 10
      
      return data;

    } catch (err) {
      const errorObj: ClaudeDirectorError = {
        error: 'Design generation failed',
        details: err instanceof Error ? err.message : 'Unknown error',
        isClaudeError: err instanceof Error && err.message.includes('Claude'),
        fallbackAvailable: true,
      };
      
      console.error('❌ Claude Director failed:', errorObj);
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate variations of the current design
  const generateVariation = useCallback(async (
    basePrompt: string,
    variation: string
  ): Promise<ClaudeDirectorResult> => {
    const combinedIntent = `${basePrompt} - ${variation}`;
    return generate(combinedIntent);
  }, [generate]);

  // Check if Claude Director is available
  const checkAvailability = useCallback(async () => {
    try {
      const response = await fetch('/api/claude-director');
      const data = await response.json();
      return data.available;
    } catch {
      return false;
    }
  }, []);

  // Get the last successful philosophy for reference
  const getLastPhilosophy = useCallback(() => {
    return result?.spec.philosophy || history[0]?.spec.philosophy || null;
  }, [result, history]);

  // Get design insights from the current spec
  const getDesignInsights = useCallback(() => {
    if (!result) return null;
    
    return {
      philosophy: result.spec.philosophy,
      personality: result.spec.style.personality,
      experience: result.spec.experience,
      optimization: result.spec.optimization,
      sections: result.spec.sections.map(s => ({
        kind: s.kind,
        purpose: s.purpose,
        reasoning: s.reasoning,
      })),
    };
  }, [result]);

  return {
    // Core functions
    generate,
    generateVariation,
    checkAvailability,
    
    // State
    isLoading,
    error,
    result,
    history,
    
    // Helpers
    getLastPhilosophy,
    getDesignInsights,
    
    // Computed properties
    hasResult: !!result,
    isAvailable: !error?.isClaudeError,
    lastGenerated: result?.meta.timestamp,
  };
}

// Hook for streaming Claude's responses (future enhancement)
export function useClaudeDirectorStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  
  const streamGenerate = useCallback(async (intent: string) => {
    setIsStreaming(true);
    setStreamContent('');
    setPhilosophy('');
    
    // This would implement Server-Sent Events for streaming
    // For now, it's a placeholder for future enhancement
    
    setTimeout(() => {
      setPhilosophy('Generating design philosophy...');
      setStreamContent('Claude is thinking about your design...');
    }, 100);
    
    setTimeout(() => {
      setIsStreaming(false);
    }, 2000);
  }, []);
  
  return {
    streamGenerate,
    isStreaming,
    streamContent,
    philosophy,
  };
}