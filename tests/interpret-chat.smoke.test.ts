import { describe, it, expect } from 'vitest';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { HistoryManager, interpretChat } from '@/lib/transforms';

describe('interpretChat + transforms', () => {
  it('makes the hero more dramatic', async () => {
    const { primary } = await generatePage(demoContent, demoBrand, 'minimal', ['hero','features','cta']);
    const history = new HistoryManager(primary.sections);
    const before = history.current();
    const { transforms, intents } = interpretChat('make the hero more dramatic', before);
    expect(intents.some(i => /makeHeroDramatic/.test(i))).toBe(true);
    const after = history.apply(transforms);
    const hero = after.find(s => s.meta.kind === 'hero');
    expect(hero?.props.tone).toBe('bold');
  });
});
