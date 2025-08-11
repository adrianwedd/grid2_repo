// components/RealtimeEditor.tsx
'use client';

import React from 'react';
import { useRealtimePreview } from '@/lib/hooks/useRealtimePreview';
import type { SectionNode } from '@/types/section-system';
import { PageRenderer } from '@/components/PageRenderer';

export function RealtimeEditor({ initialSections }: { initialSections: SectionNode[] }) {
  const {
    input, setInput,
    sections, preview,
    intents, warnings, analysis,
    loading, error,
    apply, undo, redo,
  } = useRealtimePreview(initialSections);

  const current = preview ?? sections;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <h2 className="text-xl font-semibold">Realtime Editor</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Try: "make the hero more dramatic", "add social proof", "increase contrast"'
          className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={apply}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            disabled={loading || !input.trim()}
            title="Apply current command"
          >
            Apply
          </button>
          <button onClick={undo} className="px-3 py-2 rounded-lg border">Undo</button>
          <button onClick={redo} className="px-3 py-2 rounded-lg border">Redo</button>
          {loading && <span className="text-sm text-gray-500 ml-2">Previewing...</span>}
        </div>

        {/* Interpretation */}
        <div className="rounded-lg border p-3 bg-gray-50">
          <div className="text-sm font-medium">Interpreted intents</div>
          <div className="mt-1 text-sm text-gray-700">{intents.length ? intents.join(', ') : '—'}</div>
          {!!warnings.length && (
            <div className="mt-2 text-xs text-amber-700">
              {warnings.join(' | ')}
            </div>
          )}
        </div>

        {/* Analysis */}
        {analysis && (
          <div className="rounded-lg border p-3 bg-white">
            <div className="text-sm font-medium mb-1">Change summary</div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {(analysis.summary ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded border p-2">
                <div className="font-semibold">Aesthetics</div>
                <div>{Math.round((analysis.estImpact?.aesthetics ?? 0) * 100)}%</div>
              </div>
              <div className="rounded border p-2">
                <div className="font-semibold">Conversion</div>
                <div>{Math.round((analysis.estImpact?.conversion ?? 0) * 100)}%</div>
              </div>
              <div className="rounded border p-2">
                <div className="font-semibold">Performance</div>
                <div>{Math.round((analysis.estImpact?.performance ?? 0) * 100)}%</div>
              </div>
            </div>
          </div>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      {/* Preview */}
      <div className="lg:col-span-8 rounded-xl border bg-white">
        <div className="border-b p-3 text-sm text-gray-600">
          Preview {preview ? '(uncommitted)' : '(committed)'}
        </div>
        <div className="p-6">
          <PageRenderer
            page={{
              sections: current,
              meta: { title: 'Preview', description: 'Real-time preview' },
              brand: {} as any,
              audits: { a11y: [], seo: [], performance: [], passed: true },
            }}
          />
        </div>
      </div>
    </div>
  );
}
