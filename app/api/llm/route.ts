// app/api/llm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterClient } from '@/lib/llm/openrouter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, prompt, context, model } = body;

    // Check if API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'OpenRouter API key not configured',
          suggestion: 'Please set OPENROUTER_API_KEY in your environment variables'
        },
        { status: 503 }
      );
    }

    const client = new OpenRouterClient(apiKey);

    switch (action) {
      case 'generate':
        // Generate content suggestions
        const content = await client.generatePageContent(prompt, context);
        return NextResponse.json({ 
          success: true, 
          content,
          model: model || 'anthropic/claude-3-haiku'
        });

      case 'transform':
        // Transform user input into commands
        const command = await client.transformCommand(prompt, context?.sections || []);
        return NextResponse.json({ 
          success: true, 
          command,
          original: prompt
        });

      case 'models':
        // Get available models
        const models = await client.getAvailableModels();
        return NextResponse.json({ 
          success: true, 
          models 
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: generate, transform, or models' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('LLM API error:', error);
    
    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'API key issue',
          message: error.message,
          suggestion: 'Check your OpenRouter API key configuration'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'LLM request failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}