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
  const [sessionReady, setSessionReady] = useState(false);

  const sessionIdRef = useRef<string | null>(null);

  const post = useCallback(async (payload: any): Promise<PreviewResponse> => {
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Network error' }));
        console.error('Preview API error:', res.status, error);
        return { ok: false, error: error.error || 'Request failed', sessionId: '', sections: [] };
      }
      
      return res.json();
    } catch (err) {
      console.error('Fetch error:', err);
      return { ok: false, error: 'Network error', sessionId: '', sections: [] };
    }
  }, []);

  // Initialize session only once on mount
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout | undefined;
    
    (async () => {
      try {
        // Set a timeout to prevent infinite initialization
        timeoutId = setTimeout(() => {
          if (!sessionReady && mounted) {
            console.error('Session initialization timeout');
            setError('Session initialization timed out');
            // Set ready anyway to allow manual interaction
            setSessionReady(true);
          }
        }, 5000);
        
        console.log('Initializing preview session with sections:', initialSections);
        
        // Validate sections before sending
        if (!initialSections || initialSections.length === 0) {
          console.error('No sections provided for initialization');
          setError('No sections available to initialize');
          // Still mark as ready to allow user to proceed
          setSessionReady(true);
          return;
        }
        
        // Ensure sections have required structure
        const validSections = initialSections.map(s => ({
          id: s.id || `section-${Date.now()}-${Math.random()}`,
          meta: s.meta || { kind: 'hero' },
          props: s.props || {},
          position: s.position || 0
        }));
        
        const resp = await post({ action: 'init', sections: validSections });
        console.log('Session init response:', resp);
        
        if (!mounted) return;
        
        clearTimeout(timeoutId);
        
        if (resp.ok) {
          sessionIdRef.current = resp.sessionId;
          setSessionReady(true);
          console.log('Session initialized successfully:', resp.sessionId);
        } else {
          const errorMsg = resp.error || 'Failed to init session';
          setError(errorMsg);
          console.error('Session init failed:', errorMsg, resp);
          // Still mark as ready to allow user interaction
          setSessionReady(true);
        }
      } catch (err) {
        if (!mounted) return;
        if (timeoutId) clearTimeout(timeoutId);
        console.error('Session init error:', err);
        setError(`Failed to initialize session: ${err instanceof Error ? err.message : 'Unknown error'}`);
        // Still mark as ready to allow user interaction
        setSessionReady(true);
      }
    })();
    
    return () => { 
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
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
    console.log('Apply clicked - Session:', sessionIdRef.current, 'Input:', input);
    if (!sessionIdRef.current || !input.trim()) {
      console.log('Apply aborted - no session or input');
      return;
    }
    setLoading(true);
    console.log('Sending command to API...');
    const resp = await post({ action: 'command', sessionId: sessionIdRef.current, command: input });
    console.log('Command response:', resp);
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
    loading, error, sessionReady,
    apply, undo, redo,
  };
}
