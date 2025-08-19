// app/editor/page.tsx
import { RealtimeEditor } from '@/components/RealtimeEditor-Fixed';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';

export const dynamic = 'force-dynamic';

export default async function EditorPage() {
  const { primary } = await generatePage(demoContent, demoBrand, 'minimal', ['hero','features','cta']);
  return <RealtimeEditor initialSections={primary.sections} />;
}
