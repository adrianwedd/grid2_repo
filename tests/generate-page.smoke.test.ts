import { describe, it, expect } from 'vitest';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';

describe('generatePage smoke', () => {
  it('returns a deterministic set of sections for the demo content', async () => {
    const a = await generatePage(demoContent, demoBrand, 'bold', ['hero','features','cta']);
    const b = await generatePage(demoContent, demoBrand, 'bold', ['hero','features','cta']);
    const seqA = a.primary.sections.map(s => `${s.meta.kind}:${s.meta.variant}`);
    const seqB = b.primary.sections.map(s => `${s.meta.kind}:${s.meta.variant}`);
    expect(seqA).toEqual(seqB);
    expect(a.primary.sections.length).toBeGreaterThan(0);
  });
});
