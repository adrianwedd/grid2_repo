// lib/preview-session.ts
import { HistoryManager, interpretChat, analyzeTransform } from '@/lib/transforms';
import { interpretCommand } from '@/lib/claude-interpreter';
import type { SectionNode } from '@/types/section-system';

type Session = {
  id: string;
  history: HistoryManager;
  updatedAt: number;
};

const SESSIONS = new Map<string, Session>();
const TTL_MS = 30 * 60 * 1000;

const uid = () => (globalThis as any).crypto?.randomUUID?.() ?? `s_${Math.random().toString(36).slice(2)}`;

function cleanup() {
  const now = Date.now();
  for (const [id, s] of SESSIONS) {
    if (now - s.updatedAt > TTL_MS) SESSIONS.delete(id);
  }
}

export function initSession(sections: SectionNode[], sessionId?: string) {
  cleanup();
  const id = sessionId ?? uid();
  const session: Session = { id, history: new HistoryManager(sections), updatedAt: Date.now() };
  SESSIONS.set(id, session);
  return session;
}

export function getSession(id: string) {
  cleanup();
  const s = SESSIONS.get(id);
  if (!s) return null;
  s.updatedAt = Date.now();
  return s;
}

export async function handlePreview(sessionId: string, command: string) {
  const s = getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const before = s.history.current();
  
  // ALWAYS use Claude Director when enabled for maximum magic
  if (false && process.env.CLAUDE_ENABLED === 'true' && command.trim()) { // Disabled - fix port
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('http://localhost:7429/api/claude-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ 
          intent: command,
          context: {
            // Extract context from existing sections
            industry: 'web',
            targetAudience: 'general',
          }
        }),
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        return {
          sections: data.page.sections,
          intents: [`Claude Director: ${data.spec.philosophy.inspiration}`],
          warnings: [],
          analysis: {
            summary: [
              `Philosophy: ${data.spec.philosophy.inspiration}`,
              `Personality: ${data.spec.style.personality}`,
              `Goal: ${data.spec.optimization.primaryGoal}`,
              `Sections: ${data.page.sections.length}`,
            ],
            estImpact: { 
              aesthetics: 0.95, 
              conversion: 0.90, 
              performance: 0.92 
            },
            diff: [],
            claudeReasoning: {
              philosophy: data.spec.philosophy,
              experience: data.spec.experience,
              principles: data.spec.philosophy.principles,
            },
          },
        };
      }
    } catch (error) {
      console.warn('Claude Director failed, falling back to demo mode:', error);
    }
  }
  
  // Fallback to basic transforms only if Claude is disabled
  const result = interpretChat(command, before);
  const after = result.transforms.reduce((state, t) => t(state), before);
  const analysis = analyzeTransform(before, after);
  return { 
    sections: after, 
    intents: result.intents, 
    warnings: result.warnings, 
    analysis 
  };
}

export async function handleCommand(sessionId: string, command: string) {
  const s = getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const before = s.history.current();
  
  // ALWAYS use Claude Director when enabled for maximum magic
  if (false && process.env.CLAUDE_ENABLED === 'true' && command.trim()) { // Disabled - fix port
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('http://localhost:7429/api/claude-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ 
          intent: command,
          context: {
            // Extract context from existing sections
            industry: 'web',
            targetAudience: 'general',
          }
        }),
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        // Update history with new sections
        s.history = new HistoryManager(data.page.sections);
        return {
          sections: data.page.sections,
          intents: [`Claude Director: ${data.spec.philosophy.inspiration}`],
          warnings: [],
          analysis: {
            summary: [
              `Philosophy: ${data.spec.philosophy.inspiration}`,
              `Personality: ${data.spec.style.personality}`,
              `Goal: ${data.spec.optimization.primaryGoal}`,
              `Sections: ${data.page.sections.length}`,
            ],
            estImpact: { 
              aesthetics: 0.95, 
              conversion: 0.90, 
              performance: 0.92 
            },
            diff: [],
            claudeReasoning: {
              philosophy: data.spec.philosophy,
              experience: data.spec.experience,
              principles: data.spec.philosophy.principles,
            },
          },
        };
      }
    } catch (error) {
      console.warn('Claude Director failed, falling back to demo mode:', error);
    }
  }
  
  // Fallback to basic transforms only if Claude is disabled
  const result = interpretChat(command, before);
  const after = s.history.apply(result.transforms);
  const analysis = analyzeTransform(before, after);
  return { 
    sections: after, 
    intents: result.intents, 
    warnings: result.warnings, 
    analysis 
  };
}

export function handleUndo(sessionId: string) {
  const s = getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const out = s.history.undo();
  return { sections: out ?? s.history.current() };
}

export function handleRedo(sessionId: string) {
  const s = getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const out = s.history.redo();
  return { sections: out ?? s.history.current() };
}

export function handleGet(sessionId: string) {
  const s = getSession(sessionId);
  if (!s) throw new Error('Session not found');
  return { sections: s.history.current() };
}
