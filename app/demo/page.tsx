import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { PageRenderer } from '@/components/PageRenderer';

export const dynamic = 'force-static';

export default async function Page() {
  const { primary } = await generatePage(demoContent, demoBrand, 'bold', ['hero','features','cta']);
  return (
    <main className="min-h-screen">
      <PageRenderer page={primary} />
    </main>
  );
}
