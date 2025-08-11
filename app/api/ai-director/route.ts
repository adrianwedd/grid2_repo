// app/api/ai-director/route.ts
// API endpoint for AI Director - the bridge between intent and execution

import { NextRequest, NextResponse } from 'next/server';
import { generatePage } from '@/lib/generate-page';
import { SpecInterpreter, STYLE_PRESETS, CLAUDE_PROMPT_TEMPLATE } from '@/lib/ai-director';
import type { DesignSpec } from '@/lib/ai-director';
import { componentRegistry } from '@/components/sections/registry';
import { demoBrand, demoContent } from '@/lib/generate-page';

import { withSecurityMiddleware } from '@/lib/middleware/auth';
import { RATE_LIMITS } from '@/lib/middleware/rate-limiter';

export async function POST(request: NextRequest) {
  // Apply security middleware
  const securityResponse = await withSecurityMiddleware(request, {
    rateLimit: RATE_LIMITS.aiDirector,
    auth: { requireAuth: false }, // Set to true in production
  });
  if (securityResponse) return securityResponse;

  try {
    const body = await request.json();
    const { 
      prompt,           // User's high-level request
      spec,            // Or direct spec from Claude
      existingContent, // Optional existing content
      preview = false, // Just return spec without generating
      useClaudeIfAvailable = true,
    } = body;

    let designSpec: DesignSpec;

    if (spec) {
      // Direct spec provided (from Claude or user)
      designSpec = spec;
    } else if (prompt) {
      // Try Claude first if available
      if (useClaudeIfAvailable && process.env.ANTHROPIC_API_KEY && process.env.CLAUDE_ENABLED === 'true') {
        try {
          designSpec = await generateSpecWithClaude(prompt);
        } catch (error) {
          console.warn('Claude generation failed, falling back to presets:', error);
          designSpec = generateSpecFromPrompt(prompt);
        }
      } else {
        // Use presets and heuristics
        designSpec = generateSpecFromPrompt(prompt);
      }
    } else {
      return NextResponse.json(
        { error: 'Prompt or spec required' },
        { status: 400 }
      );
    }

    // If just previewing spec, return it
    if (preview) {
      return NextResponse.json({ 
        spec: designSpec,
        generated_by: spec ? 'provided' : (process.env.CLAUDE_ENABLED === 'true' ? 'claude' : 'presets')
      });
    }

    // Get available components
    const availableComponents = new Map<string, string[]>();
    for (const [key, entry] of Object.entries(componentRegistry)) {
      const kind = entry.meta.kind;
      if (!availableComponents.has(kind)) {
        availableComponents.set(kind, []);
      }
      availableComponents.get(kind)!.push(entry.meta.variant);
    }

    // Interpret spec
    const interpreter = new SpecInterpreter(availableComponents);
    const config = interpreter.interpret(designSpec, existingContent);

    // Generate content if not provided
    const contentGraph = existingContent || generateContentFromSpec(designSpec);
    
    // Ensure brand is properly set
    const brandTokens = config.brand && Object.keys(config.brand).length > 0 
      ? { ...demoBrand, ...config.brand }
      : demoBrand;
    
    // Generate page using beam search
    const { primary, alternates, renderTime } = await generatePage(
      contentGraph,
      brandTokens as any,
      config.tone,
      config.requiredSections
    );

    return NextResponse.json({
      spec: designSpec,
      config,
      page: primary,
      alternates,
      renderTime,
      stats: {
        sections: primary.sections.length,
        tone: config.tone,
        inspiration: designSpec.style.inspiration || detectInspiration(prompt || ''),
      }
    });

  } catch (error) {
    console.error('AI Director error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate design',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Generate spec using Claude
 */
async function generateSpecWithClaude(prompt: string): Promise<DesignSpec> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';
  
  if (!apiKey) {
    throw new Error('Claude API key not configured');
  }

  const systemPrompt = CLAUDE_PROMPT_TEMPLATE.replace('{USER_INPUT}', prompt);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a design specification for: "${prompt}"`
        }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Claude API error:', error);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  try {
    // Parse and validate the JSON
    const spec = JSON.parse(content);
    return validateSpec(spec);
  } catch (parseError) {
    console.error('Failed to parse Claude response:', content);
    throw new Error('Invalid spec from Claude');
  }
}

/**
 * Detect brand inspiration from prompt
 */
function detectInspiration(prompt: string): string | undefined {
  const lower = prompt.toLowerCase();
  for (const brand of Object.keys(STYLE_PRESETS)) {
    if (lower.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return undefined;
}

/**
 * Generate spec from prompt using presets and heuristics
 */
function generateSpecFromPrompt(prompt: string): DesignSpec {
  const lower = prompt.toLowerCase();
  
  // Check for brand inspirations
  for (const [brand, preset] of Object.entries(STYLE_PRESETS)) {
    if (lower.includes(brand.toLowerCase())) {
      return {
        ...preset,
        style: {
          ...preset.style!,
          inspiration: brand,
        },
        sections: generateDefaultSections(brand),
      } as DesignSpec;
    }
  }
  
  // Check for style keywords
  if (lower.includes('minimal') || lower.includes('clean') || lower.includes('simple')) {
    return {
      ...STYLE_PRESETS.apple,
      sections: generateDefaultSections('apple'),
    } as DesignSpec;
  }
  
  if (lower.includes('developer') || lower.includes('technical') || lower.includes('api')) {
    return {
      ...STYLE_PRESETS.stripe,
      sections: generateDefaultSections('stripe'),
    } as DesignSpec;
  }
  
  if (lower.includes('dark') || lower.includes('modern') || lower.includes('sleek')) {
    return {
      ...STYLE_PRESETS.vercel,
      sections: generateDefaultSections('vercel'),
    } as DesignSpec;
  }
  
  if (lower.includes('playful') || lower.includes('fun') || lower.includes('creative')) {
    return {
      ...STYLE_PRESETS.notion,
      sections: generateDefaultSections('notion'),
    } as DesignSpec;
  }
  
  // Default spec
  return {
    style: {
      tone: 'minimal',
      colorScheme: 'brand-heavy',
      spacing: 'normal',
      typography: 'sans',
      animations: 'subtle',
    },
    sections: [
      {
        kind: 'hero',
        variant: 'split-image-left',
        priority: 'critical',
      },
      {
        kind: 'features',
        variant: 'cards-3up',
        priority: 'important',
      },
      {
        kind: 'testimonials',
        variant: 'grid-2x2',
        priority: 'nice-to-have',
      },
      {
        kind: 'cta',
        variant: 'gradient-slab',
        priority: 'critical',
      },
    ],
    content: {
      voice: 'professional',
      density: 'balanced',
    },
    layout: {
      firstImpression: 'hero-focused',
      flow: 'linear',
      ctaStrategy: 'single-strong',
    },
  };
}

/**
 * Generate default sections for inspiration
 */
function generateDefaultSections(inspiration: string): DesignSpec['sections'] {
  const sectionMap: Record<string, DesignSpec['sections']> = {
    apple: [
      {
        kind: 'hero',
        variant: 'split-image-left',
        priority: 'critical',
        content: {
          style: 'large-serif',
        },
        visual: {
          imagery: 'product',
          layout: 'centered',
          emphasis: 'visual',
        },
      },
      {
        kind: 'features',
        variant: 'cards-3up',
        priority: 'important',
        visual: {
          imagery: 'abstract',
          layout: 'symmetric',
          emphasis: 'balanced',
        },
      },
      {
        kind: 'cta',
        variant: 'gradient-slab',
        priority: 'critical',
      },
    ],
    stripe: [
      {
        kind: 'hero',
        variant: 'split-image-left',
        priority: 'critical',
        content: {
          style: 'bold-sans',
        },
      },
      {
        kind: 'features',
        variant: 'cards-3up',
        priority: 'critical',
      },
      {
        kind: 'testimonials',
        variant: 'grid-2x2',
        priority: 'important',
      },
      {
        kind: 'cta',
        variant: 'gradient-slab',
        priority: 'critical',
      },
    ],
    vercel: [
      {
        kind: 'hero',
        variant: 'split-image-left',
        priority: 'critical',
        visual: {
          imagery: 'abstract',
          layout: 'asymmetric',
          emphasis: 'visual',
        },
      },
      {
        kind: 'features',
        variant: 'cards-3up',
        priority: 'important',
      },
      {
        kind: 'cta',
        variant: 'gradient-slab',
        priority: 'critical',
      },
    ],
    linear: [
      {
        kind: 'hero',
        variant: 'split-image-left',
        priority: 'critical',
        visual: {
          layout: 'centered',
          emphasis: 'content',
        },
      },
      {
        kind: 'features',
        variant: 'cards-3up',
        priority: 'critical',
      },
      {
        kind: 'cta',
        variant: 'gradient-slab',
        priority: 'critical',
      },
    ],
    notion: [
      {
        kind: 'hero',
        variant: 'split-image-left',
        priority: 'critical',
        visual: {
          imagery: 'illustration',
          layout: 'asymmetric',
          emphasis: 'balanced',
        },
      },
      {
        kind: 'features',
        variant: 'cards-3up',
        priority: 'important',
      },
      {
        kind: 'testimonials',
        variant: 'grid-2x2',
        priority: 'nice-to-have',
      },
      {
        kind: 'cta',
        variant: 'gradient-slab',
        priority: 'critical',
      },
    ],
  };

  return sectionMap[inspiration] || sectionMap.apple;
}

/**
 * Generate content from spec
 */
function generateContentFromSpec(spec: DesignSpec): any {
  // Generate content based on voice and density
  const content: any = { ...demoContent };
  
  // Adjust based on content strategy
  if (spec.content.voice === 'bold') {
    content.hero = {
      ...content.hero,
      headline: 'TRANSFORM YOUR BUSINESS',
      subheadline: 'Revolutionary solutions that deliver results.',
    };
  } else if (spec.content.voice === 'friendly') {
    content.hero = {
      ...content.hero,
      headline: 'Welcome! Let\'s build something amazing',
      subheadline: 'We\'re here to help you succeed, every step of the way.',
    };
  } else if (spec.content.voice === 'technical') {
    content.hero = {
      ...content.hero,
      headline: 'Enterprise-grade infrastructure',
      subheadline: 'Scalable, secure, and built for developers.',
    };
  }
  
  // Apply density
  if (spec.content.density === 'minimal') {
    if (content.hero?.bullets && content.hero.bullets.length > 3) {
      content.hero.bullets = content.hero.bullets.slice(0, 3);
    }
  }
  
  return content;
}

/**
 * Validate spec structure
 */
function validateSpec(spec: any): DesignSpec {
  // Basic validation - could be enhanced with JSON schema
  if (!spec.style || !spec.sections || !spec.content || !spec.layout) {
    throw new Error('Invalid spec structure');
  }
  
  // Ensure required fields
  spec.style.tone = spec.style.tone || 'minimal';
  spec.style.colorScheme = spec.style.colorScheme || 'brand-heavy';
  spec.style.spacing = spec.style.spacing || 'normal';
  spec.style.typography = spec.style.typography || 'sans';
  spec.style.animations = spec.style.animations || 'subtle';
  
  spec.content.voice = spec.content.voice || 'professional';
  spec.content.density = spec.content.density || 'balanced';
  
  spec.layout.firstImpression = spec.layout.firstImpression || 'hero-focused';
  spec.layout.flow = spec.layout.flow || 'linear';
  spec.layout.ctaStrategy = spec.layout.ctaStrategy || 'single-strong';
  
  return spec as DesignSpec;
}