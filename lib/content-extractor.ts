// lib/content-extractor.ts
// Deterministic heuristics for turning messy text into a ContentGraph.
// You can swap the internals with an LLM later, but keep the output shape identical.

import type { ContentGraph } from '@/types/section-system';

export type ExtractOptions = {
  fallbackHeadline?: string;
};

export function extractContentFromText(input: string, opts: ExtractOptions = {}): ContentGraph {
  const text = (input || '').trim();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const cg: ContentGraph = {};

  // Headline = first non-empty line, subheadline = second
  if (lines[0]) {
    cg.hero = {
      headline: lines[0].replace(/^[#*\-\s]+/, ''),
      subheadline: lines[1]?.replace(/^[#*\-\s]+/, ''),
    };
  } else if (opts.fallbackHeadline) {
    cg.hero = { headline: opts.fallbackHeadline };
  }

  // Features: collect bullets after a Features-like heading
  const feats: string[] = [];
  let inFeatures = false;
  for (const l of lines) {
    if (/^features?\b[:]?/i.test(l)) { inFeatures = true; continue; }
    if (/^[A-Z].+:$/.test(l)) { inFeatures = false; continue; } // next heading
    if (inFeatures && /^[-*•]/.test(l)) feats.push(l.replace(/^[-*•]\s*/, ''));
  }
  if (feats.length >= 3) {
    cg.features = {
      headline: 'Features',
      items: feats.slice(0, 6),
    };
  }

  // CTA: look for a CTA line
  const ctaLine = lines.find(l => /\b(start|try|join|get)\b.*\b(free|now|demo|trial)\b/i.test(l));
  if (ctaLine) {
    cg.cta = {
      headline: ctaLine,
      primaryAction: { label: 'Get Started', href: '/signup' },
    };
  }

  return cg;
}
