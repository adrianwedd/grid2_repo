import { generatePage, demoContent, demoBrand, PageRenderer } from '@/lib/generate-page';

export const dynamic = 'force-static';

export default async function Page() {
  const { primary } = await generatePage(demoContent, demoBrand, 'bold', ['hero','features','cta']);
  return (
    <main className="min-h-screen">
      <PageRenderer page={primary} />
    </main>
  );
}
