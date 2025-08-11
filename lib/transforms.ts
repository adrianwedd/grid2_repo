// lib/transforms.ts
// Pure transform system for chat-based page editing

import type {
  Transform,
  TransformRegistry,
  SectionNode,
  SectionId,
  Tone,
  SectionMeta,
  SectionProps,
  Action,
  BrandTokens,
  PageNode,
} from '@/types/section-system';
import { componentRegistry } from '@/components/sections/registry';

/** Utils **/
const deepClone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const uid = () =>
  (globalThis as any).crypto?.randomUUID?.() ?? `id_${Math.random().toString(36).slice(2)}`;

const findIndexById = (sections: SectionNode[], id: SectionId) =>
  sections.findIndex((s) => s.id === id);

const findFirstByKind = (sections: SectionNode[], kind: SectionMeta['kind']) =>
  sections.find((s) => s.meta.kind === kind);

const move = (arr: any[], from: number, to: number) => {
  const out = arr.slice();
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item);
  return out;
};

/** ---------- Core Transforms (pure) ---------- */
export const transforms: TransformRegistry = {
  /** Make hero section more dramatic */
  makeHeroDramatic: (doc) => {
    const next = deepClone(doc);
    for (const s of next) {
      if (s.meta.kind === 'hero') {
        s.props.tone = 'bold';
        // Nudge headline if present
        const content: any = s.props.content || {};
        if (typeof content.headline === 'string') {
          content.headline = content.headline.replace(/\.$/, '') + ' — Fast. Fearless.';
        }
        s.props.content = content;
      }
    }
    return next;
  },

  /** Increase contrast globally (but keep purity) */
  increaseContrast: (doc) => {
    const next = deepClone(doc);
    for (const s of next) {
      if (s.props.tone === 'minimal') s.props.tone = 'corporate'; // slight bump
      if (s.meta.kind === 'cta') s.props.tone = 'bold'; // always bold CTA
      // Optional custom tweak
      s.props.customStyles = {
        ...s.props.customStyles,
        colors: {
          ...(s.props.customStyles?.colors as any),
          // Hint to use stronger brand swatch (no renderer change here, but preserved in props)
        } as any,
      };
    }
    return next;
  },

  /** Add social proof (fallback if no testimonials component registered) */
  addSocialProof: (doc) => {
    const next = deepClone(doc);
    // Try to insert a testimonials section if registry has any testimonials entry
    const testimonialKey = Object.keys(componentRegistry).find((k) => k === 'testimonials-grid-2x2') || Object.keys(componentRegistry).find((k) => k.startsWith('testimonials-'));
    if (testimonialKey) {
      const meta = componentRegistry[testimonialKey].meta;
      const node: SectionNode = {
        id: (`${meta.kind}-${uid()}`) as SectionId,
        meta,
        position: next.length,
        props: {
          id: (`${meta.kind}-${uid()}`) as SectionId,
          tone: 'minimal',
          content: {
            headline: 'Loved by top teams',
            quotes: [
              { text: 'We ship 3x faster.', author: 'Sarah C.' },
              { text: 'Feels like magic.', author: 'Marcus J.' },
            ],
          } as any,
        },
      };
      // Place before CTA if possible
      const ctaIndex = next.findIndex((s) => s.meta.kind === 'cta');
      const insertIndex = ctaIndex > 0 ? Math.max(1, ctaIndex) : next.length;
      next.splice(insertIndex, 0, node);
      // Fix positions
      next.forEach((s, i) => (s.position = i));
      return next;
    }

    // Fallback: enrich hero/features copy
    const hero = findFirstByKind(next, 'hero');
    if (hero) {
      const content: any = hero.props.content || {};
      const bullets: string[] = Array.isArray(content.bullets) ? content.bullets.slice() : [];
      if (!bullets.some((b) => /trusted by/i.test(b))) {
        bullets.push('Trusted by thousands of teams');
        content.bullets = bullets;
        hero.props.content = content;
      }
    }
    const features = findFirstByKind(next, 'features');
    if (features) {
      const content: any = features.props.content || {};
      content.subheadline =
        (content.subheadline ?? 'Powerful features') + ' • Trusted by top engineering orgs';
      features.props.content = content;
    }
    return next;
  },

  /** Tighten above-the-fold: hero concise + CTA higher */
  tightenAboveTheFold: (doc) => {
    const next = deepClone(doc);
    // Trim hero bullets to max 2
    const hero = findFirstByKind(next, 'hero');
    if (hero) {
      const content: any = hero.props.content || {};
      if (Array.isArray(content.bullets) && content.bullets.length > 2) {
        content.bullets = content.bullets.slice(0, 2);
        hero.props.content = content;
      }
    }
    // Move CTA to index 1 if exists
    const ctaIdx = next.findIndex((s) => s.meta.kind === 'cta');
    if (ctaIdx > 0) {
      const moved = move(next, ctaIdx, Math.min(1, next.length - 1));
      moved.forEach((s, i) => (s.position = i));
      return moved;
    }
    next.forEach((s, i) => (s.position = i));
    return next;
  },

  /** Swap a section's variant */
  swapVariant:
    (sectionId: SectionId, newVariant: string) =>
    (doc) => {
      const next = deepClone(doc);
      const idx = findIndexById(next, sectionId);
      if (idx === -1) return next;
      next[idx].meta = { ...next[idx].meta, variant: newVariant as any };
      return next;
    },

  /** Reorder sections by index */
  reorderSections:
    (from: number, to: number) =>
    (doc) => {
      if (from === to) return doc;
      const next = move(deepClone(doc), from, Math.max(0, Math.min(to, doc.length - 1)));
      next.forEach((s, i) => (s.position = i));
      return next;
    },

  /** Update content on a section */
  updateContent:
    (sectionId, partial) =>
    (doc) => {
      const next = deepClone(doc);
      const idx = findIndexById(next, sectionId);
      if (idx === -1) return next;
      const current = (next[idx].props.content as any) ?? {};
      next[idx].props.content = { ...current, ...(partial as any) };
      return next;
    },
};

/** ---------- Advanced Transforms ---------- */

export function applyThemePreset(preset: Tone): Transform {
  return (doc) => {
    const next = deepClone(doc);
    for (const s of next) s.props.tone = preset;
    return next;
  };
}

export function optimizeForConversion(): Transform {
  return (doc) => {
    let next = deepClone(doc);
    // Ensure CTA exists; if not, inject one using registry
    if (!next.some((s) => s.meta.kind === 'cta')) {
      const ctaKey = 'cta-gradient-slab';
      const entry = componentRegistry[ctaKey];
      if (entry) {
        const node: SectionNode = {
          id: (`cta-${uid()}`) as SectionId,
          meta: entry.meta,
          position: next.length,
          props: {
            id: (`cta-${uid()}`) as SectionId,
            tone: 'bold',
            content: {
              headline: 'Start your free trial',
              description: 'Get started in minutes—no credit card.',
            },
            actions: [{ label: 'Get started', href: '/signup' }],
          },
        };
        next.push(node);
      }
    }
    // Move CTA near top
    const ctaIdx = next.findIndex((s) => s.meta.kind === 'cta');
    if (ctaIdx > 0) next = transforms.reorderSections(ctaIdx, 1)(next);
    // Bold hero + CTA
    next = transforms.makeHeroDramatic(next);
    for (const s of next) if (s.meta.kind === 'cta') s.props.tone = 'bold';
    return next;
  };
}

export function addUrgencyBanner(copy = 'Limited-time offer: 20% off this month!'): Transform {
  return (doc) => {
    const next = deepClone(doc);
    const ctaKey = 'cta-gradient-slab';
    const entry = componentRegistry[ctaKey];
    if (!entry) return next;
    const node: SectionNode = {
      id: (`cta-${uid()}`) as SectionId,
      meta: entry.meta,
      position: 0,
      props: {
        id: (`cta-${uid()}`) as SectionId,
        tone: 'bold',
        content: {
          headline: copy,
          description: '',
          disclaimer: 'While supplies last.',
        },
        actions: [{ label: 'Claim offer', href: '#offer' }],
      },
    };
    next.unshift(node);
    next.forEach((s, i) => (s.position = i));
    return next;
  };
}

/** ---------- Chat Interpreter (regex/keyword-based) ---------- */

export type InterpretResult = {
  transforms: Transform[];
  intents: string[];
  warnings: string[];
};

export function interpretChat(command: string, doc: SectionNode[]): InterpretResult {
  const text = command.toLowerCase();
  const intents: string[] = [];
  const actions: Transform[] = [];
  const warnings: string[] = [];

  // Core intents
  if (/make .*hero.* (more )?dramatic|dramatic hero|bigger hero/.test(text)) {
    intents.push('makeHeroDramatic');
    actions.push(transforms.makeHeroDramatic);
  }
  if (/increase (the )?contrast|high[- ]contrast|more pop/.test(text)) {
    intents.push('increaseContrast');
    actions.push(transforms.increaseContrast);
  }
  if (/add (more )?social proof|testimonials|logo wall/.test(text)) {
    intents.push('addSocialProof');
    actions.push(transforms.addSocialProof);
  }
  if (/tighten (the )?above[- ]the[- ]fold|less above the fold|reduce clutter/.test(text)) {
    intents.push('tightenAboveTheFold');
    actions.push(transforms.tightenAboveTheFold);
  }

  // Theme presets
  const themeMatch = text.match(/apply (?:theme )?(minimal|bold|playful|corporate)/);
  if (themeMatch) {
    intents.push(`applyTheme:${themeMatch[1]}`);
    actions.push(applyThemePreset(themeMatch[1] as Tone));
  }

  // Conversion
  if (/optimi[sz]e (for )?conversion|increase conversions|boost cta/.test(text)) {
    intents.push('optimizeForConversion');
    actions.push(optimizeForConversion());
  }

  // Urgency banner
  const urgencyMatch = text.match(/add (?:an )?urgency (?:banner|bar)(?:\:?\s*(.*))?/);
  if (urgencyMatch) {
    intents.push('addUrgencyBanner');
    actions.push(addUrgencyBanner(urgencyMatch[1]?.trim() || undefined));
  }

  // Swap variant: "swap hero to split-image-left"
  const swapMatch = text.match(/swap (hero|features|cta) (?:to|with) ([\w-]+)/);
  if (swapMatch) {
    const kind = swapMatch[1] as SectionMeta['kind'];
    const variant = swapMatch[2];
    const target = doc.find((s) => s.meta.kind === kind);
    if (target) {
      intents.push(`swapVariant:${kind}->${variant}`);
      actions.push(transforms.swapVariant(target.id, variant));
    } else {
      warnings.push(`No ${kind} section found to swap.`);
    }
  }

  // Reorder: "move cta to position 1" or "move section 3 to 1"
  const moveByIndex = text.match(/move (?:section )?(\d+)\s+(?:to|->)\s*(\d+)/);
  if (moveByIndex) {
    const from = parseInt(moveByIndex[1], 10) - 1;
    const to = parseInt(moveByIndex[2], 10) - 1;
    intents.push(`reorder:${from}->${to}`);
    actions.push(transforms.reorderSections(from, to));
  } else {
    const moveByKind = text.match(/move (hero|features|cta|about|testimonials) (?:to|before|after) (\d+|hero|features|cta|about|testimonials)/);
    if (moveByKind) {
      const sourceKind = moveByKind[1] as SectionMeta['kind'];
      const targetRaw = moveByKind[2];
      const from = doc.findIndex((s) => s.meta.kind === sourceKind);
      let to = from;
      if (/\d+/.test(targetRaw)) to = Math.max(0, Math.min(parseInt(targetRaw, 10) - 1, doc.length - 1));
      else {
        const targetIndex = doc.findIndex((s) => s.meta.kind === (targetRaw as any));
        if (targetIndex >= 0) to = targetIndex;
      }
      if (from >= 0) {
        intents.push(`reorder:${from}->${to}`);
        actions.push(transforms.reorderSections(from, to));
      } else {
        warnings.push(`No ${sourceKind} section found to move.`);
      }
    }
  }

  // Update content: `set headline to "X"` or `update cta description: Save 20%`
  const setHeadline = text.match(/set (?:the )?headline to ["“](.+?)["”]/);
  if (setHeadline) {
    const hero = doc.find((s) => s.meta.kind === 'hero') ?? doc[0];
    if (hero) {
      intents.push('updateContent:hero.headline');
      actions.push(transforms.updateContent(hero.id, { headline: setHeadline[1] } as any));
    }
  }
  const updateField = text.match(/update (hero|features|cta) (headline|subheadline|description|disclaimer)\s*:\s*(.+)$/);
  if (updateField) {
    const kind = updateField[1] as SectionMeta['kind'];
    const key = updateField[2];
    const value = updateField[3].replace(/^["“]|["”]$/g, '');
    const section = doc.find((s) => s.meta.kind === kind);
    if (section) {
      const patch: any = {}; patch[key] = value;
      intents.push(`updateContent:${kind}.${key}`);
      actions.push(transforms.updateContent(section.id, patch));
    }
  }

  if (actions.length === 0) warnings.push('No actions matched. Try: "make the hero more dramatic", "increase contrast", "add social proof".');

  return { transforms: actions, intents, warnings };
}

/** ---------- Transform Analyzer (diff + impact) ---------- */

export type DiffEntry =
  | { type: 'moved'; id: SectionId; from: number; to: number }
  | { type: 'added'; id: SectionId; kind: string; at: number }
  | { type: 'removed'; id: SectionId; kind: string; at: number }
  | { type: 'changed'; id: SectionId; key: string; from: any; to: any };

export type TransformPlan = {
  summary: string[];
  diff: DiffEntry[];
  estImpact: { aesthetics: number; performance: number; conversion: number };
  warnings: string[];
};

export function analyzeTransform(before: SectionNode[], after: SectionNode[]): TransformPlan {
  const diff: DiffEntry[] = [];
  const byIdBefore = new Map(before.map((s) => [s.id, s]));
  const byIdAfter = new Map(after.map((s) => [s.id, s]));

  // Moves + changes
  for (const b of before) {
    const a = byIdAfter.get(b.id);
    if (!a) continue;
    if (b.position !== a.position) diff.push({ type: 'moved', id: a.id, from: b.position, to: a.position });
    if (b.meta.variant !== a.meta.variant) diff.push({ type: 'changed', id: a.id, key: 'meta.variant', from: b.meta.variant, to: a.meta.variant });
    if (b.props.tone !== a.props.tone) diff.push({ type: 'changed', id: a.id, key: 'props.tone', from: b.props.tone, to: a.props.tone });
    // Shallow compare content keys
    const bk = Object.keys((b.props.content as any) ?? {});
    const ak = Object.keys((a.props.content as any) ?? {});
    for (const k of new Set([...bk, ...ak])) {
      const bv = (b.props.content as any)?.[k];
      const av = (a.props.content as any)?.[k];
      if (JSON.stringify(bv) !== JSON.stringify(av)) {
        diff.push({ type: 'changed', id: a.id, key: `content.${k}`, from: bv, to: av });
      }
    }
  }

  // Added/removed
  for (const a of after) if (!byIdBefore.has(a.id)) diff.push({ type: 'added', id: a.id, kind: a.meta.kind, at: a.position });
  for (const b of before) if (!byIdAfter.has(b.id)) diff.push({ type: 'removed', id: b.id, kind: b.meta.kind, at: b.position });

  // Estimate impact heuristics
  const aesthetics = Math.min(1, diff.filter(d => d.type === 'changed' && /tone|variant/.test((d as any).key)).length / 4 + diff.filter(d => d.type === 'moved').length * 0.2);
  const conversion = Math.min(1, after.findIndex(s => s.meta.kind === 'cta') <= 1 ? 0.7 : 0.3) + (after.some(s => s.meta.kind === 'cta' && s.props.tone === 'bold') ? 0.2 : 0);
  const performance = Math.max(0, 1 - after.filter(s => s.meta.estimatedSize === 'xl').length * 0.1);

  const summary: string[] = [];
  if (diff.some((d) => d.type === 'moved')) summary.push('Reordered sections for better flow.');
  if (diff.some((d) => (d as any).key === 'props.tone')) summary.push('Adjusted tones to increase contrast.');
  if (after.findIndex((s) => s.meta.kind === 'cta') <= 1) summary.push('Elevated CTA above the fold.');

  return {
    summary,
    diff,
    estImpact: {
      aesthetics: Number(aesthetics.toFixed(2)),
      performance: Number(performance.toFixed(2)),
      conversion: Number(Math.min(1, conversion).toFixed(2)),
    },
    warnings: [],
  };
}

/** ---------- History (undo/redo) ---------- */

export class HistoryManager {
  private history: SectionNode[][] = [];
  private index = -1;
  private limit = 50;

  constructor(initial: SectionNode[] = []) {
    this.push(initial);
  }

  current(): SectionNode[] {
    return deepClone(this.history[this.index]);
  }

  push(state: SectionNode[]) {
    // Trim forward
    if (this.index < this.history.length - 1) {
      this.history = this.history.slice(0, this.index + 1);
    }
    this.history.push(deepClone(state));
    if (this.history.length > this.limit) this.history.shift();
    this.index = this.history.length - 1;
  }

  apply(ts: Transform[] | Transform): SectionNode[] {
    const list = Array.isArray(ts) ? ts : [ts];
    let state = this.current();
    for (const t of list) state = t(state);
    this.push(state);
    return state;
  }

  undo(): SectionNode[] | null {
    if (this.index > 0) {
      this.index--;
      return this.current();
    }
    return null;
  }

  redo(): SectionNode[] | null {
    if (this.index < this.history.length - 1) {
      this.index++;
      return this.current();
    }
    return null;
  }

  canUndo() { return this.index > 0; }
  canRedo() { return this.index < this.history.length - 1; }
}
