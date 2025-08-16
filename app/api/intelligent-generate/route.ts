// API endpoint for intelligent page generation with Claude prompt refinement
import { NextRequest, NextResponse } from 'next/server';
import { intelligentPageGenerator } from '@/lib/intelligent-page-generator';

export async function POST(request: NextRequest) {
  try {
    const { userPrompt, sections = ['hero', 'features', 'cta'] } = await request.json();

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    console.log('🤖 Starting intelligent page generation...');
    console.log('📝 Original prompt:', userPrompt);

    // Step 1: Refine user prompt with Claude intelligence
    const refinedPrompt = await intelligentPageGenerator.refineUserPrompt(userPrompt);
    console.log('✨ Refined prompt:', refinedPrompt.refinedPrompt);
    console.log('🎨 Suggested tone:', refinedPrompt.suggestedTone);

    // Step 2: Generate page with AI images and intelligent matching
    const result = await intelligentPageGenerator.generateIntelligentPage(
      refinedPrompt,
      sections
    );

    console.log('✅ Intelligent generation completed');

    return NextResponse.json({
      success: true,
      data: {
        originalPrompt: userPrompt,
        refinedPrompt: refinedPrompt.refinedPrompt,
        selectedTone: refinedPrompt.suggestedTone,
        styleRationale: result.styleRationale,
        colorScheme: refinedPrompt.colorScheme,
        contentStrategy: refinedPrompt.contentStrategy,
        targetAudience: refinedPrompt.targetAudience,
        visualDirection: refinedPrompt.visualDirection,
        page: result.page,
        aiImages: result.aiImages,
        metadata: {
          generatedAt: new Date().toISOString(),
          sectionsRequested: sections,
          processingTime: Date.now()
        }
      }
    });

  } catch (error) {
    console.error('❌ Intelligent generation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate intelligent page',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check system status
export async function GET() {
  try {
    const imageStats = intelligentPageGenerator.getAIImagesForTone('minimal', ['hero']);
    
    return NextResponse.json({
      status: 'operational',
      capabilities: {
        promptRefinement: true,
        intelligentStyleMatching: true,
        aiImageIntegration: true,
        availableStyles: 12,
        availableSections: ['hero', 'features', 'about', 'testimonials', 'cta', 'footer']
      },
      systemHealth: {
        aiImagesLoaded: Object.keys(imageStats).length > 0,
        lastCheck: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}