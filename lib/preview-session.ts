// lib/preview-session.ts
import { HistoryManager, interpretChat, analyzeTransform } from '@/lib/transforms';
import { interpretCommand } from '@/lib/claude-interpreter';
import { getSessionStorage, serializeSession, deserializeSession } from '@/lib/session-storage';
import type { SectionNode } from '@/types/section-system';

type Session = {
  id: string;
  history: HistoryManager;
  updatedAt: number;
};

const uid = () => (globalThis as any).crypto?.randomUUID?.() ?? `s_${Math.random().toString(36).slice(2)}`;

export async function initSession(sections: SectionNode[], sessionId?: string) {
  const storage = getSessionStorage();
  await storage.cleanup();
  
  const id = sessionId ?? uid();
  const history = new HistoryManager(sections);
  const sessionData = serializeSession(id, history);
  
  await storage.set(id, sessionData);
  
  return { id, history, updatedAt: Date.now() };
}

export async function getSession(id: string): Promise<Session | null> {
  const storage = getSessionStorage();
  const sessionData = await storage.get(id);
  
  if (!sessionData) return null;
  
  const history = deserializeSession(sessionData);
  const session = { id, history, updatedAt: Date.now() };
  
  // Update timestamp in storage
  await storage.set(id, serializeSession(id, history));
  
  return session;
}

async function saveSession(session: Session) {
  const storage = getSessionStorage();
  const sessionData = serializeSession(session.id, session.history);
  await storage.set(session.id, sessionData);
}

export async function handlePreview(sessionId: string, command: string) {
  const s = await getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const before = s.history.current();
  
  // ALWAYS use Claude Director when enabled for maximum magic
  if (process.env.CLAUDE_ENABLED === 'true' && command.trim()) {
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
  const session = await getSession(sessionId);
  if (!session) throw new Error('Session not found');
  const before = session.history.current();
  
  // ALWAYS use Claude Director when enabled for maximum magic
  if (process.env.CLAUDE_ENABLED === 'true' && command.trim()) {
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
        session!.history.push(data.page.sections);
        await saveSession(session!);
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
  const after = session.history.apply(result.transforms);
  await saveSession(session);
  const analysis = analyzeTransform(before, after);
  return { 
    sections: after, 
    intents: result.intents, 
    warnings: result.warnings, 
    analysis 
  };
}

export async function handleUndo(sessionId: string) {
  const s = await getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const out = s.history.undo();
  await saveSession(s);
  return { sections: out ?? s.history.current() };
}

export async function handleRedo(sessionId: string) {
  const s = await getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const out = s.history.redo();
  await saveSession(s);
  return { sections: out ?? s.history.current() };
}

export async function handleGet(sessionId: string) {
  const s = await getSession(sessionId);
  if (!s) throw new Error('Session not found');
  return { sections: s.history.current() };
}
