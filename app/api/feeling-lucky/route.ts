// app/api/feeling-lucky/route.ts
// "I'm Feeling Lucky" - Showcase Claude's cached design philosophies

import { NextRequest, NextResponse } from 'next/server';
import { 
  getRandomClaudeSpec, 
  searchClaudeSpecs, 
  getAllClaudeSpecs,
  getCacheStats,
  seedCacheWithDemoSpecs,
} from '@/lib/claude-cache';
import { generatePage } from '@/lib/generate-page';
import { SpecToConfig } from '@/lib/claude-director';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const query = searchParams.get('query');

  try {
    switch (action) {
      case 'random': {
        // Get random cached spec
        let spec = await getRandomClaudeSpec();
        
        // If no cached specs, seed with demos
        if (!spec) {
          console.log('🎲 No cached specs found, seeding with demos...');
          await seedCacheWithDemoSpecs();
          spec = await getRandomClaudeSpec();
        }
        
        if (!spec) {
          return NextResponse.json({
            error: 'No specs available',
            message: 'Generate some designs first!',
          }, { status: 404 });
        }

        console.log(`🍀 Feeling Lucky: "${spec.philosophy}" (${spec.id})`);
        
        // Convert spec to executable config and generate page
        const config = SpecToConfig.convert(spec.spec);
        const { primary, alternates, renderTime } = await generatePage(
          config.content,
          config.brand,
          config.tone,
          config.sections.map(s => s.kind)
        );

        return NextResponse.json({
          source: 'cached',
          cached: {
            id: spec.id,
            originalPrompt: spec.prompt,
            philosophy: spec.philosophy,
            personality: spec.personality,
            timestamp: spec.timestamp,
            tags: spec.tags,
          },
          spec: spec.spec,
          page: primary,
          alternates,
          renderTime,
          meta: {
            generatedBy: 'feeling-lucky',
            model: 'claude-cached',
            originalTimestamp: spec.timestamp,
            regeneratedAt: new Date().toISOString(),
          },
        });
      }

      case 'search': {
        if (!query) {
          return NextResponse.json({
            error: 'Query required for search',
          }, { status: 400 });
        }

        const specs = await searchClaudeSpecs(query);
        return NextResponse.json({
          query,
          results: specs.map(spec => ({
            id: spec.id,
            prompt: spec.prompt,
            philosophy: spec.philosophy,
            personality: spec.personality,
            timestamp: spec.timestamp,
            tags: spec.tags,
          })),
          total: specs.length,
        });
      }

      case 'gallery': {
        const specs = await getAllClaudeSpecs();
        return NextResponse.json({
          specs: specs.map(spec => ({
            id: spec.id,
            prompt: spec.prompt,
            philosophy: spec.philosophy,
            personality: spec.personality,
            timestamp: spec.timestamp,
            tags: spec.tags,
          })),
          total: specs.length,
        });
      }

      case 'stats': {
        const stats = await getCacheStats();
        return NextResponse.json({
          ...stats,
          status: 'ready',
          demoModeActive: stats.totalSpecs === 0,
        });
      }

      default: {
        // Default to random if no action specified
        return NextResponse.redirect(
          new URL('/api/feeling-lucky?action=random', request.url)
        );
      }
    }
  } catch (error) {
    console.error('❌ Feeling Lucky error:', error);
    return NextResponse.json({
      error: 'Failed to get lucky',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST to regenerate a specific cached spec
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { specId } = body;

    if (!specId) {
      return NextResponse.json({
        error: 'Spec ID required',
      }, { status: 400 });
    }

    const { getClaudeSpec } = await import('@/lib/claude-cache');
    const spec = await getClaudeSpec(specId);

    if (!spec) {
      return NextResponse.json({
        error: 'Spec not found',
      }, { status: 404 });
    }

    console.log(`🔄 Regenerating: "${spec.philosophy}" (${spec.id})`);

    // Regenerate page from cached spec
    const config = SpecToConfig.convert(spec.spec);
    const { primary, alternates, renderTime } = await generatePage(
      config.content,
      config.brand,
      config.tone,
      config.sections.map(s => s.kind)
    );

    return NextResponse.json({
      source: 'regenerated',
      cached: {
        id: spec.id,
        originalPrompt: spec.prompt,
        philosophy: spec.philosophy,
        personality: spec.personality,
        timestamp: spec.timestamp,
        tags: spec.tags,
      },
      spec: spec.spec,
      page: primary,
      alternates,
      renderTime,
      meta: {
        generatedBy: 'feeling-lucky-regenerated',
        model: 'claude-cached',
        originalTimestamp: spec.timestamp,
        regeneratedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Regeneration error:', error);
    return NextResponse.json({
      error: 'Failed to regenerate',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}