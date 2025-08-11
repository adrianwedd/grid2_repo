// lib/preview-session.ts
import { HistoryManager, interpretChat, analyzeTransform } from '@/lib/transforms';
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

export function handlePreview(sessionId: string, command: string) {
  const s = getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const before = s.history.current();
  const { transforms, intents, warnings } = interpretChat(command, before);
  const after = transforms.reduce((state, t) => t(state), before);
  const analysis = analyzeTransform(before, after);
  return { sections: after, intents, warnings, analysis };
}

export function handleCommand(sessionId: string, command: string) {
  const s = getSession(sessionId);
  if (!s) throw new Error('Session not found');
  const before = s.history.current();
  const { transforms, intents, warnings } = interpretChat(command, before);
  const after = s.history.apply(transforms);
  const analysis = analyzeTransform(before, after);
  return { sections: after, intents, warnings, analysis };
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
