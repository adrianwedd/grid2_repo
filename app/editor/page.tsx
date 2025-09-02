// app/editor/page.tsx
'use client';

import { RealtimeEditorLLM } from '@/components/RealtimeEditor-LLM';
import type { SectionNode } from '@/types/section-system';

// Simple default sections that always work
const defaultSections: SectionNode[] = [
  {
    id: 'hero-default',
    meta: {
      kind: 'hero',
      variant: 'split-image-left',
      name: 'Hero Split Image',
      description: 'Hero with image on the left',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'lg',
      hasAnimations: false,
      requiresJs: false,
    },
    props: {
      id: 'hero-props',
      tone: 'minimal',
      content: {
        headline: 'Welcome to Grid 2.0',
        subheadline: 'Build beautiful websites with AI assistance'
      }
    },
    position: 0
  },
  {
    id: 'features-default',
    meta: {
      kind: 'features',
      variant: 'cards-3up',
      name: 'Features Cards',
      description: 'Three feature cards',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'md',
      hasAnimations: false,
      requiresJs: false,
    },
    props: {
      id: 'features-props',
      tone: 'minimal',
      content: {
        headline: 'Powerful Features',
        features: [
          'AI-powered design suggestions',
          'Real-time preview',
          'Export to code'
        ]
      }
    },
    position: 1
  },
  {
    id: 'cta-default',
    meta: {
      kind: 'cta',
      variant: 'gradient-slab',
      name: 'CTA Gradient',
      description: 'Call to action section',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'sm',
      hasAnimations: false,
      requiresJs: false,
    },
    props: {
      id: 'cta-props',
      tone: 'minimal',
      content: {
        headline: 'Ready to get started?',
        subheadline: 'Create your first page in minutes'
      }
    },
    position: 2
  }
];

export default function EditorPage() {
  // Use client-side only rendering with default sections
  // This avoids server-side generation issues
  return <RealtimeEditorLLM initialSections={defaultSections} />;
}