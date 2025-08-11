// lib/hooks/useRealtimePreview.ts
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SectionNode } from '@/types/section-system';

type PreviewResponse = {
  ok: boolean;
  sessionId: string;
  sections: SectionNode[];
  intents?: string[];
  warnings?: string[];
  analysis?: {
    summary: string[];
    estImpact: { aesthetics: number; performance: number; conversion: number };
    diff: Array<any>;
  };
  error?: string;
};

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function useRealtimePreview(initialSections: SectionNode[]) {
  const [sections, setSections] = useState<SectionNode[]>(initialSections);
  const [preview, setPreview] = useState<SectionNode[] | null>(null);
  const [intents, setIntents] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const sessionIdRef = useRef<string | null>(null);

  const post = useCallback(async (payload: any): Promise<PreviewResponse> => {
    const res = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }, []);

  // Initialize session
  useEffect(() => {
    (async () => {
      const resp = await post({ action: 'init', sections });
      if (resp.ok) {
        sessionIdRef.current = resp.sessionId;
      } else {
        setError(resp.error || 'Failed to init session');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doPreview = useMemo(
    () =>
      debounce(async (cmd: string) => {
        if (!sessionIdRef.current) return;
        if (!cmd.trim()) {
          setPreview(null);
          setIntents([]);
          setWarnings([]);
          setAnalysis(null);
          return;
        }
        setLoading(true);
        const resp = await post({ action: 'preview', sessionId: sessionIdRef.current, command: cmd });
        setLoading(false);
        if (resp.ok) {
          setPreview(resp.sections);
          setIntents(resp.intents || []);
          setWarnings(resp.warnings || []);
          setAnalysis(resp.analysis || null);
        } else {
          setError(resp.error || 'Preview failed');
        }
      }, 300),
    [post]
  );

  // Debounce preview as user types
  useEffect(() => {
    doPreview(input);
  }, [input, doPreview]);

  const apply = useCallback(async () => {
    if (!sessionIdRef.current || !input.trim()) return;
    setLoading(true);
    const resp = await post({ action: 'command', sessionId: sessionIdRef.current, command: input });
    setLoading(false);
    if (resp.ok) {
      setSections(resp.sections);
      setPreview(null);
      setIntents(resp.intents || []);
      setWarnings(resp.warnings || []);
      setAnalysis(resp.analysis || null);
      setInput('');
    } else {
      setError(resp.error || 'Apply failed');
    }
  }, [input, post]);

  const undo = useCallback(async () => {
    if (!sessionIdRef.current) return;
    const resp = await post({ action: 'undo', sessionId: sessionIdRef.current });
    if (resp.ok) {
      setSections(resp.sections);
      setPreview(null);
      setAnalysis(null);
      setIntents([]);
      setWarnings([]);
    }
  }, [post]);

  const redo = useCallback(async () => {
    if (!sessionIdRef.current) return;
    const resp = await post({ action: 'redo', sessionId: sessionIdRef.current });
    if (resp.ok) {
      setSections(resp.sections);
      setPreview(null);
      setAnalysis(null);
      setIntents([]);
      setWarnings([]);
    }
  }, [post]);

  return {
    input, setInput,
    sections, preview,
    intents, warnings, analysis,
    loading, error,
    apply, undo, redo,
  };
}
