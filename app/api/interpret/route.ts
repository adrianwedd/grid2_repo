// app/api/interpret/route.ts
// API endpoint for hybrid command interpretation

import { NextRequest, NextResponse } from 'next/server';
import { interpretCommand } from '@/lib/claude-interpreter';
import type { SectionNode } from '@/types/section-system';

export async function POST(request: NextRequest) {
  try {
    const { command, sections } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections array is required' },
        { status: 400 }
      );
    }

    // Get config from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const claudeEnabled = process.env.CLAUDE_ENABLED === 'true';
    const model = process.env.CLAUDE_MODEL;

    // Interpret the command
    const interpretation = await interpretCommand(
      command,
      sections as SectionNode[],
      {
        useClaudeIfAvailable: claudeEnabled,
        apiKey,
        model,
      }
    );

    return NextResponse.json({
      success: true,
      interpretation,
      usedClaude: claudeEnabled && !!apiKey && interpretation.confidence > 0.6,
    });
  } catch (error) {
    console.error('Interpretation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to interpret command',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Rate limiting headers
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}