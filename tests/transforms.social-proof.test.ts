import { describe, it, expect } from 'vitest';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { HistoryManager, interpretChat } from '@/lib/transforms';

describe('add social proof', () => {
  it('inserts a testimonials section when registered', async () => {
    const { primary } = await generatePage(demoContent, demoBrand, 'bold', ['hero','features','cta']);
    const history = new HistoryManager(primary.sections);
    const before = history.current();
    const { transforms } = interpretChat('add social proof', before);
    const after = history.apply(transforms);
    expect(after.some(s => s.meta.kind === 'testimonials')).toBe(true);
  });
});
