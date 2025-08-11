import { describe, it, expect } from 'vitest';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { HistoryManager, interpretChat } from '@/lib/transforms';

describe('HistoryManager', () => {
  it('supports undo/redo deterministically', async () => {
    const { primary } = await generatePage(demoContent, demoBrand, 'bold', ['hero','features','cta']);
    const history = new HistoryManager(primary.sections);
    const before = history.current();
    const { transforms } = interpretChat('increase contrast', before);
    const after = history.apply(transforms);
    expect(after).not.toEqual(before);
    const undo = history.undo();
    expect(undo).toBeTruthy();
    expect(history.current()).toEqual(before);
    const redo = history.redo();
    expect(redo).toBeTruthy();
  });
});
