// app/editor/page.tsx
import { RealtimeEditor } from '@/components/RealtimeEditor-Fixed';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import type { SectionNode } from '@/types/section-system';

export const dynamic = 'force-dynamic';

// Fallback sections if generation fails
const fallbackSections: SectionNode[] = [
  {
    id: 'hero-fallback',
    meta: {
      kind: 'hero',
      variant: 'split-content',
      name: 'Hero Fallback',
    } as any,
    props: {
      id: 'hero-fallback-props',
      tone: 'minimal',
      content: {
        headline: 'Welcome to Grid 2.0 Editor',
        subheadline: 'AI-powered website builder'
      }
    } as any,
    position: 0
  }
];

export default async function EditorPage() {
  try {
    const { primary } = await generatePage(demoContent, demoBrand, 'minimal', ['hero','features','cta']);
    return <RealtimeEditor initialSections={primary.sections || fallbackSections} />;
  } catch (error) {
    console.error('Failed to generate page:', error);
    return <RealtimeEditor initialSections={fallbackSections} />;
  }
}
