// app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initSession, handlePreview, handleCommand, handleUndo, handleRedo, handleGet } from '@/lib/preview-session';
import type { SectionNode } from '@/types/section-system';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action as string;

    if (action === 'init') {
      const sections = body.sections as SectionNode[];
      const session = await initSession(sections, body.sessionId);
      return NextResponse.json({ ok: true, sessionId: session.id, sections });
    }

    const sessionId = body?.sessionId as string;
    if (!sessionId) return NextResponse.json({ ok: false, error: 'Missing sessionId' }, { status: 400 });

    if (action === 'preview') {
      const result = await handlePreview(sessionId, body.command as string);
      return NextResponse.json({ ok: true, sessionId, ...result });
    }

    if (action === 'command') {
      const result = await handleCommand(sessionId, body.command as string);
      return NextResponse.json({ ok: true, sessionId, ...result });
    }

    if (action === 'undo') {
      const result = await handleUndo(sessionId);
      return NextResponse.json({ ok: true, sessionId, ...result });
    }

    if (action === 'redo') {
      const result = await handleRedo(sessionId);
      return NextResponse.json({ ok: true, sessionId, ...result });
    }

    if (action === 'get') {
      const result = await handleGet(sessionId);
      return NextResponse.json({ ok: true, sessionId, ...result });
    }

    return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
