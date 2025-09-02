// Unified generation API - replaces 12 redundant endpoints
import { NextRequest, NextResponse } from 'next/server';
import { generatePage, demoBrand } from '@/lib/generate-page';
import { creativeContent } from '@/lib/creative-content';
import type { Tone } from '@/types/section-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      mode = 'tone',        // 'tone' | 'intent' | 'random'
      tone = 'minimal',     // For tone-based generation
      intent,               // For AI-based generation (future)
      sections = ['hero', 'features', 'cta', 'footer'],
      content,              // Optional custom content
    } = body;

    console.log(`🎨 Unified Generate API - Mode: ${mode}, Tone: ${tone}`);

    let selectedTone: Tone = tone as Tone;
    let generatedContent = content || generateDefaultContent(selectedTone);

    // Handle different generation modes
    switch (mode) {
      // Removed 'random' mode - "I'm Feeling Lucky" feature deprecated

      case 'intent':
        // AI-based generation from natural language
        if (!intent) {
          return NextResponse.json({ error: 'Intent required for AI mode' }, { status: 400 });
        }
        // Analyze intent to determine tone (simplified fallback)
        selectedTone = analyzeToneFromIntent(intent);
        generatedContent = generateContentFromIntent(intent, selectedTone);
        console.log(`🧠 Intent-based generation: "${intent}" → ${selectedTone}`);
        break;

      case 'tone':
      default:
        // Direct tone-based generation
        console.log(`🎨 Tone-based generation: ${selectedTone}`);
        break;
    }

    // Generate the page using beam search
    const result = await generatePage(
      generatedContent,
      demoBrand,
      selectedTone,
      sections
    );

    return NextResponse.json({
      success: true,
      mode,
      tone: selectedTone,
      page: result.primary,
      alternates: result.alternates.slice(0, 2),
      stats: {
        renderTime: result.renderTime,
        sectionCount: result.primary.sections.length,
        audits: result.primary.audits
      }
    });

  } catch (error) {
    console.error('❌ Generation failed:', error);
    return NextResponse.json(
      { error: 'Generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Simplified tone analysis from intent
function analyzeToneFromIntent(intent: string): Tone {
  const lower = intent.toLowerCase();
  
  if (lower.includes('bold') || lower.includes('dramatic')) return 'bold';
  if (lower.includes('corporate') || lower.includes('professional')) return 'corporate';
  if (lower.includes('playful') || lower.includes('fun')) return 'playful';
  if (lower.includes('elegant') || lower.includes('sophisticated')) return 'elegant';
  if (lower.includes('modern') || lower.includes('tech')) return 'modern';
  if (lower.includes('warm') || lower.includes('friendly')) return 'warm';
  if (lower.includes('luxury') || lower.includes('premium')) return 'luxury';
  if (lower.includes('creative') || lower.includes('artistic')) return 'creative';
  if (lower.includes('nature') || lower.includes('eco')) return 'nature';
  if (lower.includes('retro') || lower.includes('vintage')) return 'retro';
  if (lower.includes('monochrome') || lower.includes('minimal')) return 'monochrome';
  
  return 'minimal'; // Default
}

// Generate content from intent
function generateContentFromIntent(intent: string, tone: Tone): any {
  // Use creative content with custom headline if provided
  const baseContent = generateDefaultContent(tone);
  const customHeadline = extractHeadline(intent);
  
  if (customHeadline) {
    baseContent.hero.headline = customHeadline;
  }
  
  return baseContent;
}

// Extract headline from intent
function extractHeadline(intent: string): string | null {
  // Simple extraction - find quoted text or use first few words
  const quoted = intent.match(/"([^"]+)"/);
  if (quoted) return quoted[1];
  
  const words = intent.split(' ').slice(0, 5).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Generate default content for a tone with MUCH more interesting text
function generateDefaultContent(tone: Tone): any {
  // Use creative content generator for hilarious and interesting text
  const heroContent = creativeContent.generateHeroContent(tone);
  const featureContent = creativeContent.generateFeatureContent(tone);
  const ctaContent = creativeContent.generateCTAContent(tone);
  
  return {
    hero: heroContent,
    features: featureContent,
    cta: ctaContent
  };
}

// GET endpoint for API info
export async function GET() {
  return NextResponse.json({
    name: 'Unified Generate API',
    version: '2.0',
    endpoints: {
      POST: {
        description: 'Generate a page design',
        parameters: {
          mode: 'tone | intent | random',
          tone: 'Tone name (for tone mode)',
          intent: 'Natural language description (for intent mode)',
          sections: 'Array of section types to include',
          content: 'Optional custom content'
        }
      }
    },
    availableTones: [
      'minimal', 'bold', 'playful', 'corporate', 'elegant',
      'modern', 'warm', 'luxury', 'creative', 'nature',
      'retro', 'monochrome', 'techno', 'zen'
    ]
  });
}