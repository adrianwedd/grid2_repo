// New API endpoint for our 12-tone style gallery
import { NextResponse } from 'next/server';
import { STYLE_DEFINITIONS } from '@/lib/intelligent-page-generator';
import type { Tone } from '@/types/section-system';

export async function GET() {
  try {
    // Convert our style definitions into gallery format
    const styles = Object.entries(STYLE_DEFINITIONS).map(([tone, definition]) => ({
      id: tone,
      tone: tone as Tone,
      name: definition.name,
      description: definition.description,
      category: definition.category,
      philosophy: definition.description, // Use description as philosophy for compatibility
      personality: definition.visualPersonality,
      colors: definition.colors,
      aestheticKeywords: definition.aestheticKeywords,
      spec: {
        brandTokens: {
          colors: {
            primary: definition.colors.primary,
            secondary: definition.colors.secondary,
            accent: definition.colors.accent,
            neutral: [definition.colors.background, definition.colors.text]
          },
          typography: {
            headingFont: getHeadingFontForTone(tone as Tone),
            bodyFont: getBodyFontForTone(tone as Tone)
          }
        },
        visualStyle: {
          mood: definition.aestheticKeywords.slice(0, 3).join(', '),
          tone: tone,
          personality: definition.visualPersonality
        }
      }
    }));

    return NextResponse.json(styles);
  } catch (error) {
    console.error('Failed to load style gallery:', error);
    return NextResponse.json({
      error: 'Failed to load styles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Font mapping for each tone
function getHeadingFontForTone(tone: Tone): string {
  const fontMap: Record<Tone, string> = {
    minimal: 'Inter',
    corporate: 'IBM Plex Sans', 
    elegant: 'Playfair Display',
    warm: 'Poppins',
    nature: 'Nunito',
    luxury: 'Cormorant Garamond',
    bold: 'Space Grotesk',
    modern: 'JetBrains Mono',
    retro: 'Righteous',
    playful: 'Fredoka',
    creative: 'Abril Fatface',
    monochrome: 'IBM Plex Mono'
  };
  return fontMap[tone] || 'Inter';
}

function getBodyFontForTone(tone: Tone): string {
  const fontMap: Record<Tone, string> = {
    minimal: 'Inter',
    corporate: 'IBM Plex Sans',
    elegant: 'Crimson Text', 
    warm: 'Open Sans',
    nature: 'Nunito Sans',
    luxury: 'Lora',
    bold: 'Inter',
    modern: 'Roboto',
    retro: 'Roboto',
    playful: 'Open Sans',
    creative: 'Open Sans',
    monochrome: 'IBM Plex Sans'
  };
  return fontMap[tone] || 'Inter';
}