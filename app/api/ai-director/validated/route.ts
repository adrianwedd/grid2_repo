// app/api/ai-director/validated/route.ts
// Enhanced AI Director with validation and sanitization

import { NextRequest, NextResponse } from 'next/server';
import { SpecValidator } from '@/lib/validation/spec-validator';
import { SpecInterpreter } from '@/lib/ai-director';
import { generatePage } from '@/lib/generate-page';
import { componentRegistry } from '@/components/sections/registry';
import { demoBrand, demoContent } from '@/lib/generate-page';
import type { ContentGraph } from '@/types/section-system';

import { withSecurityMiddleware } from '@/lib/middleware/auth';
import { RATE_LIMITS } from '@/lib/middleware/rate-limiter';

export async function POST(request: NextRequest) {
  // Apply security middleware  
  const securityResponse = await withSecurityMiddleware(request, {
    rateLimit: RATE_LIMITS.validation,
    auth: { requireAuth: false }, // Set to true in production
  });
  if (securityResponse) return securityResponse;

  try {
    const body = await request.json();
    const { spec: rawSpec, attemptRepair = true } = body;

    if (!rawSpec) {
      return NextResponse.json(
        { error: 'Specification required' },
        { status: 400 }
      );
    }

    // Attempt repair if requested
    const spec = attemptRepair 
      ? SpecValidator.attemptRepair(rawSpec)
      : rawSpec;

    // Validate and sanitize
    const validation = SpecValidator.validateAndSanitize(spec);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid specification',
          errors: validation.errors,
        },
        { status: 400 }
      );
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

    // Interpret validated spec
    const interpreter = new SpecInterpreter(availableComponents);
    const config = interpreter.interpret(validation.data!);

    // Generate content
    const contentGraph = generateContentFromSpec(validation.data!);
    
    // Ensure brand is properly set
    const brandTokens = config.brand && Object.keys(config.brand).length > 0 
      ? { ...demoBrand, ...config.brand }
      : demoBrand;

    // Generate page
    const { primary, alternates, renderTime } = await generatePage(
      contentGraph,
      brandTokens as any,
      config.tone,
      config.requiredSections
    );

    return NextResponse.json({
      spec: validation.data,
      warnings: validation.warnings,
      config,
      page: primary,
      alternates,
      renderTime,
      stats: {
        sections: primary.sections.length,
        tone: config.tone,
        validated: true,
        repaired: attemptRepair,
      }
    });

  } catch (error) {
    console.error('Validated AI Director error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process specification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateContentFromSpec(spec: any): ContentGraph {
  // Generate content based on validated spec
  const content: ContentGraph = { ...demoContent };

  // Find hero section
  const heroSpec = spec.sections.find((s: any) => s.kind === 'hero');
  if (heroSpec?.content) {
    content.hero = {
      ...content.hero,
      headline: heroSpec.content.headline || content.hero?.headline || 'Welcome',
      subheadline: heroSpec.content.subheadline || content.hero?.subheadline,
      bullets: heroSpec.content.bullets || content.hero?.bullets,
    };
  }

  // Find features section
  const featuresSpec = spec.sections.find((s: any) => s.kind === 'features');
  if (featuresSpec?.content) {
    content.features = {
      ...content.features,
      headline: featuresSpec.content.headline || content.features?.headline,
      subheadline: featuresSpec.content.subheadline || content.features?.subheadline,
      items: featuresSpec.content.features || featuresSpec.content.bullets || content.features?.items,
    };
  }

  // Find CTA section
  const ctaSpec = spec.sections.find((s: any) => s.kind === 'cta');
  if (ctaSpec?.content) {
    content.cta = {
      ...content.cta,
      headline: ctaSpec.content.headline || content.cta?.headline || 'Get Started',
      description: ctaSpec.content.subheadline || content.cta?.description,
      primaryAction: content.cta?.primaryAction || {
        label: 'Start Now',
        href: '/start',
      },
    };
  }

  return content;
}