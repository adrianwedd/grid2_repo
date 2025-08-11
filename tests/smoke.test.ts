// tests/smoke.test.ts
// Core smoke tests for critical path components

import { describe, it, expect } from 'vitest';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { interpretChat } from '@/lib/transforms';
import { HistoryManager } from '@/lib/transforms';
import { BeamSearchAssembler } from '@/lib/beam-search';
import { componentRegistry } from '@/components/sections/registry';
import type { SectionNode, SectionMeta, Tone } from '@/types/section-system';

describe('generatePage smoke tests', () => {
  it('should generate page with all tone variants', async () => {
    const tones: Tone[] = ['minimal', 'bold', 'playful', 'corporate'];
    
    for (const tone of tones) {
      const result = await generatePage(demoContent, demoBrand, tone);
      
      expect(result.primary).toBeDefined();
      expect(result.primary.sections).toHaveLength.greaterThan(0);
      expect(result.primary.audits).toBeDefined();
      expect(result.alternates).toBeDefined();
      expect(result.renderTime).toBeTypeOf('number');
      
      // Check all sections have proper structure
      for (const section of result.primary.sections) {
        expect(section.id).toMatch(/^[a-z]+-[a-z0-9-]+$/);
        expect(section.meta).toBeDefined();
        expect(section.props).toBeDefined();
        expect(section.position).toBeTypeOf('number');
      }
    }
  });

  it('should produce deterministic results with same inputs', async () => {
    const result1 = await generatePage(demoContent, demoBrand, 'bold');
    const result2 = await generatePage(demoContent, demoBrand, 'bold');
    
    expect(result1.primary.sections.length).toBe(result2.primary.sections.length);
    expect(result1.primary.sections.map(s => s.meta.kind)).toEqual(
      result2.primary.sections.map(s => s.meta.kind)
    );
  });

  it('should pass audits for generated pages', async () => {
    const result = await generatePage(demoContent, demoBrand, 'minimal');
    const { audits } = result.primary;
    
    // Should have no critical a11y errors
    const criticalA11yErrors = audits.a11y.filter(r => r.severity === 'error');
    expect(criticalA11yErrors).toHaveLength(0);
    
    // Should have at least basic SEO structure
    expect(result.primary.meta.title).toBeTruthy();
    expect(result.primary.meta.description).toBeTruthy();
  });
});

describe('interpretChat smoke tests', () => {
  const mockSections: SectionNode[] = [
    {
      id: 'hero-test',
      meta: { kind: 'hero', variant: 'split-image-left' } as SectionMeta,
      props: { id: 'hero-test', content: { headline: 'Test Hero' } },
      position: 0
    },
    {
      id: 'features-test', 
      meta: { kind: 'features', variant: 'cards-3up' } as SectionMeta,
      props: { id: 'features-test', content: { features: ['Feature 1', 'Feature 2'] } },
      position: 1
    }
  ];

  it('should interpret common commands', () => {
    const commands = [
      'make hero dramatic',
      'increase contrast', 
      'add social proof',
      'tighten above the fold',
      'apply theme bold',
      'optimize for conversion'
    ];

    for (const command of commands) {
      const result = interpretChat(command, mockSections);
      
      expect(result.intents.length).toBeGreaterThan(0);
      expect(result.transforms.length).toBeGreaterThan(0);
      expect(result.warnings).toBeInstanceOf(Array);
    }
  });

  it('should handle update commands', () => {
    const result = interpretChat('set headline to "New Amazing Headline"', mockSections);
    
    expect(result.intents).toContain('updateContent:hero.headline');
    expect(result.transforms.length).toBe(1);
    
    // Apply transform and verify
    const updated = result.transforms[0](mockSections);
    const hero = updated.find(s => s.meta.kind === 'hero');
    expect((hero?.props.content as any)?.headline).toBe('New Amazing Headline');
  });

  it('should handle swap commands', () => {
    const result = interpretChat('swap hero to full-bleed', mockSections);
    
    expect(result.intents[0]).toMatch(/swapVariant:hero/);
    expect(result.transforms.length).toBe(1);
  });

  it('should warn on unrecognized commands', () => {
    const result = interpretChat('do something completely random', mockSections);
    
    expect(result.transforms.length).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('HistoryManager smoke tests', () => {
  const initialSections: SectionNode[] = [
    {
      id: 'hero-test',
      meta: { kind: 'hero', variant: 'split-image-left' } as SectionMeta,
      props: { id: 'hero-test', content: { headline: 'Original' } },
      position: 0
    }
  ];

  it('should initialize with initial state', () => {
    const history = new HistoryManager(initialSections);
    
    expect(history.current()).toEqual(initialSections);
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });

  it('should handle undo/redo operations', () => {
    const history = new HistoryManager(initialSections);
    
    // Apply a transform
    const transform = (sections: SectionNode[]) => sections.map(s => ({
      ...s,
      props: {
        ...s.props,
        content: { ...s.props.content, headline: 'Modified' }
      }
    }));
    
    const modified = history.apply(transform);
    expect((modified[0].props.content as any).headline).toBe('Modified');
    expect(history.canUndo()).toBe(true);
    
    // Undo
    const undone = history.undo();
    expect(undone).not.toBeNull();
    expect((undone![0].props.content as any).headline).toBe('Original');
    expect(history.canRedo()).toBe(true);
    
    // Redo
    const redone = history.redo();
    expect(redone).not.toBeNull();
    expect((redone![0].props.content as any).headline).toBe('Modified');
  });

  it('should handle edge cases', () => {
    const history = new HistoryManager(initialSections);
    
    // Undo when nothing to undo
    expect(history.undo()).toBeNull();
    
    // Redo when nothing to redo  
    expect(history.redo()).toBeNull();
  });
});

describe('BeamSearchAssembler determinism', () => {
  it('should produce consistent results', async () => {
    const sectionLibrary: SectionMeta[] = Object.values(componentRegistry).map(
      (entry) => entry.meta
    );
    
    const assembler = new BeamSearchAssembler(sectionLibrary, {
      beamWidth: 3,
      maxDepth: 5,
    });

    const results = await Promise.all([
      assembler.search(demoContent, demoBrand, 'bold', ['hero', 'features', 'cta']),
      assembler.search(demoContent, demoBrand, 'bold', ['hero', 'features', 'cta']),
      assembler.search(demoContent, demoBrand, 'bold', ['hero', 'features', 'cta'])
    ]);

    // All results should have same structure
    expect(results[0].primary.length).toBe(results[1].primary.length);
    expect(results[0].primary.length).toBe(results[2].primary.length);
    
    // Same section kinds in same order
    const kinds1 = results[0].primary.map(s => s.meta.kind);
    const kinds2 = results[1].primary.map(s => s.meta.kind);  
    const kinds3 = results[2].primary.map(s => s.meta.kind);
    
    expect(kinds1).toEqual(kinds2);
    expect(kinds2).toEqual(kinds3);
  });
});

describe('Component registry integrity', () => {
  it('should have valid metadata for all components', () => {
    Object.entries(componentRegistry).forEach(([key, entry]) => {
      expect(entry.meta).toBeDefined();
      expect(entry.component).toBeDefined();
      expect(entry.meta.kind).toBeTruthy();
      expect(entry.meta.variant).toBeTruthy();
      expect(entry.meta.contentSlots).toBeInstanceOf(Array);
      expect(entry.meta.hardConstraints).toBeInstanceOf(Array);
      expect(entry.meta.softConstraints).toBeInstanceOf(Array);
      expect(entry.meta.a11yChecklist).toBeInstanceOf(Array);
    });
  });

  it('should have consistent key naming', () => {
    Object.entries(componentRegistry).forEach(([key, entry]) => {
      const expectedKey = `${entry.meta.kind}-${entry.meta.variant}`;
      expect(key).toBe(expectedKey);
    });
  });
});