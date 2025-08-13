// app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initSession, handlePreview, handleCommand, handleUndo, handleRedo, handleGet } from '@/lib/preview-session';
import type { SectionNode } from '@/types/section-system';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid JSON in request body',
        details: 'Request must contain valid JSON'
      }, { status: 400 });
    }

    // Validate required action field
    const action = body?.action as string;
    if (!action || typeof action !== 'string') {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing or invalid action field',
        details: 'Action must be a string: init, preview, command, undo, redo, or get'
      }, { status: 400 });
    }

    // Handle init action (special case - doesn't need sessionId)
    if (action === 'init') {
      const sections = body.sections as SectionNode[];
      
      // Validate sections array
      if (!Array.isArray(sections)) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Invalid sections data',
          details: 'Sections must be an array of SectionNode objects'
        }, { status: 400 });
      }

      if (sections.length === 0) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Empty sections array',
          details: 'At least one section is required to initialize a session'
        }, { status: 400 });
      }

      // Validate section structure
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section.id || !section.meta?.kind) {
          return NextResponse.json({ 
            ok: false, 
            error: `Invalid section at index ${i}`,
            details: 'Each section must have an id and meta.kind'
          }, { status: 400 });
        }
      }

      try {
        const session = await initSession(sections, body.sessionId);
        return NextResponse.json({ ok: true, sessionId: session.id, sections });
      } catch (initError: any) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Session initialization failed',
          details: initError.message
        }, { status: 500 });
      }
    }

    // Validate sessionId for all other actions
    const sessionId = body?.sessionId as string;
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing or invalid sessionId',
        details: 'SessionId must be a valid string for this action'
      }, { status: 400 });
    }

    // Validate sessionId format (basic UUID check)
    const sessionIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!sessionIdPattern.test(sessionId) && !sessionId.startsWith('s_')) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid sessionId format',
        details: 'SessionId must be a valid UUID or session identifier'
      }, { status: 400 });
    }

    // Handle command-based actions
    if (action === 'preview' || action === 'command') {
      const command = body.command as string;
      if (!command || typeof command !== 'string') {
        return NextResponse.json({ 
          ok: false, 
          error: 'Missing or invalid command',
          details: 'Command must be a non-empty string'
        }, { status: 400 });
      }

      if (command.trim().length === 0) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Empty command',
          details: 'Command cannot be empty or only whitespace'
        }, { status: 400 });
      }

      if (command.length > 500) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Command too long',
          details: 'Command must be 500 characters or less'
        }, { status: 400 });
      }

      try {
        const handler = action === 'preview' ? handlePreview : handleCommand;
        const result = await handler(sessionId, command);
        return NextResponse.json({ ok: true, sessionId, ...result });
      } catch (commandError: any) {
        if (commandError.message === 'Session not found') {
          return NextResponse.json({ 
            ok: false, 
            error: 'Session not found',
            details: 'The session may have expired or been cleaned up'
          }, { status: 404 });
        }
        return NextResponse.json({ 
          ok: false, 
          error: `${action} failed`,
          details: commandError.message
        }, { status: 500 });
      }
    }

    // Handle history actions (undo/redo)
    if (action === 'undo' || action === 'redo') {
      try {
        const handler = action === 'undo' ? handleUndo : handleRedo;
        const result = await handler(sessionId);
        return NextResponse.json({ ok: true, sessionId, ...result });
      } catch (historyError: any) {
        if (historyError.message === 'Session not found') {
          return NextResponse.json({ 
            ok: false, 
            error: 'Session not found',
            details: 'The session may have expired or been cleaned up'
          }, { status: 404 });
        }
        if (historyError.message.includes('Nothing to undo') || historyError.message.includes('Nothing to redo')) {
          return NextResponse.json({ 
            ok: false, 
            error: historyError.message,
            details: `No ${action} operation available`
          }, { status: 400 });
        }
        return NextResponse.json({ 
          ok: false, 
          error: `${action} failed`,
          details: historyError.message
        }, { status: 500 });
      }
    }

    // Handle get action
    if (action === 'get') {
      try {
        const result = await handleGet(sessionId);
        return NextResponse.json({ ok: true, sessionId, ...result });
      } catch (getError: any) {
        if (getError.message === 'Session not found') {
          return NextResponse.json({ 
            ok: false, 
            error: 'Session not found',
            details: 'The session may have expired or been cleaned up'
          }, { status: 404 });
        }
        return NextResponse.json({ 
          ok: false, 
          error: 'Get session failed',
          details: getError.message
        }, { status: 500 });
      }
    }

    // Unknown action
    return NextResponse.json({ 
      ok: false, 
      error: 'Unknown action',
      details: `Action '${action}' is not supported. Valid actions: init, preview, command, undo, redo, get`
    }, { status: 400 });

  } catch (error: any) {
    // Catch-all error handler
    console.error('Preview API error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}
