/**
 * AI Image Generation API
 * 
 * POST /api/generate-image
 * 
 * Generates images using multiple AI providers with automatic fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateImage, getConfiguredProviders, estimateCost } from '@/lib/ai-image-providers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate image
    const result = await generateImage({
      prompt: body.prompt,
      style: body.style || 'artistic',
      aspectRatio: body.aspectRatio || '16:9',
      quality: body.quality || 'standard',
      negative: body.negative
    });

    // Add cost estimate
    const estimatedCost = estimateCost(result.provider, body.quality || 'standard');

    return NextResponse.json({
      success: true,
      image: result.url,
      provider: result.provider,
      model: result.model,
      estimatedCost,
      metadata: result.metadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { 
        error: 'Image generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check provider status
export async function GET() {
  const providers = getConfiguredProviders();
  
  return NextResponse.json({
    status: 'ready',
    configuredProviders: providers,
    totalProviders: 4,
    hasAnyProvider: providers.length > 0,
    fallbackAvailable: true,
    supportedStyles: ['photorealistic', 'artistic', 'minimal', 'bold', 'playful'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    supportedQualities: ['draft', 'standard', 'high']
  });
}