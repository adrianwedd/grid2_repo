// Unified generation API - replaces 12 redundant endpoints
import { NextRequest, NextResponse } from 'next/server';
import { generatePage, demoBrand } from '@/lib/generate-page';
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
      case 'random':
        // "Feeling Lucky" mode - pick random tone
        const tones: Tone[] = ['minimal', 'bold', 'playful', 'corporate', 'elegant', 
                               'modern', 'warm', 'luxury', 'creative', 'nature', 
                               'retro', 'monochrome', 'techno', 'zen'];
        selectedTone = tones[Math.floor(Math.random() * tones.length)];
        generatedContent = generateDefaultContent(selectedTone);
        console.log(`🎲 Random tone selected: ${selectedTone}`);
        break;

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
  // This would ideally use AI, but for now use intelligent defaults
  return {
    hero: {
      headline: extractHeadline(intent) || `Your ${tone} Vision`,
      subheadline: `Crafted with precision using Grid 2.0's intelligent design system`,
      bullets: [
        'AI-powered design understanding',
        'Deterministic generation engine',
        'Beautiful, accessible, fast'
      ]
    },
    features: {
      headline: 'Built for Excellence',
      subheadline: 'Every detail optimized for your success',
      items: ['Smart Design', 'Fast Performance', 'Full Control']
    },
    cta: {
      headline: 'Ready to Launch?',
      description: 'Transform your vision into reality',
      primaryAction: { label: 'Get Started', href: '#' },
      secondaryAction: { label: 'Learn More', href: '#' }
    }
  };
}

// Extract headline from intent
function extractHeadline(intent: string): string | null {
  // Simple extraction - find quoted text or use first few words
  const quoted = intent.match(/"([^"]+)"/);
  if (quoted) return quoted[1];
  
  const words = intent.split(' ').slice(0, 5).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Generate default content for a tone
function generateDefaultContent(tone: Tone): any {
  const toneContent: Record<Tone, any> = {
    minimal: {
      hero: {
        headline: 'Simple. Clean. Perfect.',
        subheadline: 'Minimalist design that speaks volumes',
        bullets: ['No clutter', 'Pure focus', 'Essential beauty']
      }
    },
    bold: {
      hero: {
        headline: 'MAKE AN IMPACT',
        subheadline: 'Bold design for those who dare to stand out',
        bullets: ['Maximum contrast', 'Dramatic presence', 'Unforgettable']
      }
    },
    playful: {
      hero: {
        headline: 'Let\'s Have Some Fun!',
        subheadline: 'Playful design that brings joy to every interaction',
        bullets: ['Vibrant colors', 'Delightful animations', 'Pure happiness']
      }
    },
    corporate: {
      hero: {
        headline: 'Professional Excellence',
        subheadline: 'Enterprise-grade solutions for modern business',
        bullets: ['Trusted by leaders', 'Proven results', 'Scalable growth']
      }
    },
    elegant: {
      hero: {
        headline: 'Refined Sophistication',
        subheadline: 'Elegant design for discerning tastes',
        bullets: ['Timeless beauty', 'Subtle luxury', 'Exquisite details']
      }
    },
    modern: {
      hero: {
        headline: 'The Future is Now',
        subheadline: 'Cutting-edge design for tomorrow\'s innovators',
        bullets: ['Next-gen tech', 'Lightning fast', 'Always ahead']
      }
    },
    warm: {
      hero: {
        headline: 'Welcome Home',
        subheadline: 'Warm, inviting design that feels like a hug',
        bullets: ['Cozy comfort', 'Friendly vibes', 'Human connection']
      }
    },
    luxury: {
      hero: {
        headline: 'Exclusively Yours',
        subheadline: 'Luxury design for the most discerning',
        bullets: ['Premium quality', 'Bespoke service', 'Unparalleled excellence']
      }
    },
    creative: {
      hero: {
        headline: 'Unleash Creativity',
        subheadline: 'Where imagination meets innovation',
        bullets: ['Artistic vision', 'Boundless possibilities', 'Creative freedom']
      }
    },
    nature: {
      hero: {
        headline: 'Naturally Beautiful',
        subheadline: 'Eco-conscious design in harmony with nature',
        bullets: ['Sustainable choices', 'Organic growth', 'Earth-friendly']
      }
    },
    retro: {
      hero: {
        headline: 'Vintage Vibes',
        subheadline: 'Nostalgic design with a modern twist',
        bullets: ['Classic style', 'Timeless appeal', 'Retro cool']
      }
    },
    monochrome: {
      hero: {
        headline: 'Black. White. Bold.',
        subheadline: 'Monochrome design with maximum impact',
        bullets: ['Pure contrast', 'Editorial edge', 'Striking simplicity']
      }
    },
    techno: {
      hero: {
        headline: 'SYSTEM ONLINE',
        subheadline: 'Cyberpunk aesthetics for the digital age',
        bullets: ['Neon dreams', 'Digital reality', 'Future shock']
      }
    },
    zen: {
      hero: {
        headline: 'Find Your Balance',
        subheadline: 'Zen design for mindful living',
        bullets: ['Inner peace', 'Harmonious flow', 'Serene beauty']
      }
    }
  };

  const baseContent = toneContent[tone] || toneContent.minimal;
  
  return {
    ...baseContent,
    features: {
      headline: 'Features',
      subheadline: 'Everything you need',
      items: ['Feature One', 'Feature Two', 'Feature Three']
    },
    cta: {
      headline: 'Get Started',
      description: 'Join thousands of satisfied users',
      primaryAction: { label: 'Start Now', href: '#' },
      secondaryAction: { label: 'Learn More', href: '#' }
    }
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