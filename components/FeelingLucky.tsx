// components/FeelingLucky.tsx
// "I'm Feeling Lucky" - Showcase Claude's cached design philosophies

'use client';

import React, { useState } from 'react';
import { PageRenderer } from '@/components/PageRenderer';

interface CachedSpec {
  id: string;
  originalPrompt: string;
  philosophy: string;
  personality: string;
  timestamp: string;
  tags: string[];
}

interface LuckyResult {
  cached: CachedSpec;
  page: any;
  renderTime: number;
  meta: {
    generatedBy: string;
    originalTimestamp: string;
    regeneratedAt: string;
  };
}

export function FeelingLucky() {
  const [result, setResult] = useState<LuckyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<LuckyResult[]>([]);

  const handleFeelingLucky = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/feeling-lucky?action=random');
      
      if (!response.ok) {
        throw new Error('Failed to get lucky');
      }

      const data: LuckyResult = await response.json();
      setResult(data);
      setHistory(prev => [data, ...prev.slice(0, 4)]); // Keep last 5
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const regenerateSpec = async (specId: string) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/feeling-lucky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specId }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate');
      }

      const data: LuckyResult = await response.json();
      setResult(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">I'm Feeling Lucky</h1>
        <p className="text-gray-600 mb-4">
          Showcase Claude's design philosophies from real conversations
        </p>
        <button
          onClick={handleFeelingLucky}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Getting Lucky...
            </>
          ) : (
            <>
              🍀 I'm Feeling Lucky
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Current Result */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Design Philosophy */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Claude's Design Philosophy</h2>
              <div className="text-sm text-gray-500">
                Generated {new Date(result.cached.timestamp).toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Original Prompt</div>
                <div className="text-gray-900 italic">"{result.cached.originalPrompt}"</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Philosophy</div>
                <div className="text-blue-600 font-medium">{result.cached.philosophy}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Personality</div>
                <div className="text-green-600">{result.cached.personality}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {result.cached.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => regenerateSpec(result.cached.id)}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                🔄 Regenerate This Design
              </button>
            </div>
          </div>

          {/* Generated Page */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium">Generated Page</h3>
              <div className="text-sm text-gray-500">
                Rendered in {result.renderTime}ms
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <PageRenderer
                page={{
                  sections: result.page.sections,
                  meta: { title: 'Lucky Design', description: 'Claude-generated' },
                  brand: {} as any,
                  audits: { a11y: [], seo: [], performance: [], passed: true },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Lucky Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item, i) => (
              <div
                key={`${item.cached.id}-${i}`}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                onClick={() => setResult(item)}
              >
                <div className="font-medium text-sm mb-1 line-clamp-2">
                  {item.cached.originalPrompt}
                </div>
                <div className="text-blue-600 text-sm mb-2">
                  {item.cached.philosophy}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(item.cached.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {!result && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">🎲</div>
          <p className="text-gray-600">
            Click "I'm Feeling Lucky" to see Claude's design philosophies in action!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Each cached design shows Claude's actual reasoning and creative thinking.
          </p>
        </div>
      )}
    </div>
  );
}