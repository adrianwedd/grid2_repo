// app/api/test-tone-content/route.ts
import { NextResponse } from 'next/server';
import { generateToneSpecificContent } from '@/lib/tone-content-generator';
import { generatePage } from '@/lib/generate-page';
import { demoBrand } from '@/lib/generate-page';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tone = (url.searchParams.get('tone') || 'minimal') as any;
  
  try {
    const toneContent = generateToneSpecificContent(tone);
    const result = await generatePage(toneContent, demoBrand, tone, ['hero', 'features', 'cta']);
    
    return NextResponse.json({
      success: true,
      tone,
      content: toneContent,
      result: {
        hasPrimary: !!result.primary,
        primaryType: typeof result.primary,
        primaryIsArray: Array.isArray(result.primary),
        primaryLength: Array.isArray(result.primary) ? result.primary.length : 'not array',
        hasAlternates: !!result.alternates,
      },
      headlines: {
        hero: toneContent.hero?.headline,
        features: toneContent.features?.headline,
        cta: toneContent.cta?.headline,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}