// Render a dynamic theme into a complete page
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { generatePage } from '@/lib/generate-page';

const THEME_CACHE_DIR = join(process.cwd(), '.dynamic-themes');

export async function POST(request: NextRequest) {
  try {
    const { themeId } = await request.json();
    
    if (!themeId) {
      return NextResponse.json({
        error: 'Theme ID is required'
      }, { status: 400 });
    }

    console.log('🎨 Rendering dynamic theme:', themeId);
    
    // Load the theme from cache
    const themePath = join(THEME_CACHE_DIR, `${themeId}.json`);
    const themeData = await fs.readFile(themePath, 'utf-8');
    const theme = JSON.parse(themeData);
    
    if (!theme.renderingSpec) {
      return NextResponse.json({
        error: 'Theme missing rendering specification'
      }, { status: 400 });
    }
    
    // Update usage tracking
    theme.usage = (theme.usage || 0) + 1;
    await fs.writeFile(themePath, JSON.stringify(theme, null, 2));
    
    // Generate page using our existing system with Claude's converted spec
    const pageResult = await generatePage(
      theme.renderingSpec.content,
      theme.renderingSpec.brandTokens,
      theme.renderingSpec.tone,
      theme.renderingSpec.sections
    );
    
    console.log('✅ Dynamic theme rendered successfully');
    
    return NextResponse.json({
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        claudeAnalysis: theme.claudeAnalysis
      },
      page: pageResult.primary,
      alternates: pageResult.alternates,
      renderTime: pageResult.renderTime,
      aiImages: theme.aiImages,
      meta: {
        generatedBy: 'dynamic-theme-renderer',
        themeUsage: theme.usage,
        originalPrompt: theme.prompt,
        renderingTone: theme.renderingSpec.tone,
        sectionsRendered: theme.renderingSpec.sections
      }
    });

  } catch (error) {
    console.error('❌ Dynamic theme rendering failed:', error);
    return NextResponse.json({
      error: 'Failed to render dynamic theme',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to preview a theme without full rendering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId');
    
    if (!themeId) {
      return NextResponse.json({
        error: 'Theme ID required'
      }, { status: 400 });
    }
    
    const themePath = join(THEME_CACHE_DIR, `${themeId}.json`);
    const themeData = await fs.readFile(themePath, 'utf-8');
    const theme = JSON.parse(themeData);
    
    return NextResponse.json({
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        claudeAnalysis: theme.claudeAnalysis,
        aiImages: theme.aiImages,
        usage: theme.usage,
        timestamp: theme.timestamp
      },
      renderingSpec: theme.renderingSpec,
      canRender: !!theme.renderingSpec
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Theme not found',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 404 });
  }
}