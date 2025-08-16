'use client';

import React, { useState } from 'react';
import { PageRenderer } from '@/components/PageRenderer';

interface IntelligentResult {
  originalPrompt: string;
  refinedPrompt: string;
  selectedTone: string;
  styleRationale: string;
  colorScheme: any;
  contentStrategy: string;
  targetAudience: string;
  visualDirection: string;
  page: any;
  aiImages: Record<string, string>;
  metadata: {
    generatedAt: string;
    sectionsRequested: string[];
    processingTime: number;
  };
}

export default function IntelligentDemo() {
  const [userPrompt, setUserPrompt] = useState('');
  const [result, setResult] = useState<IntelligentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examplePrompts = [
    "Create a corporate website for a consulting firm that builds trust with enterprise clients",
    "Design a creative portfolio site for an experimental digital art studio", 
    "Build an eco-friendly landing page for a sustainable products company",
    "Make a luxury brand website for premium handcrafted goods",
    "Create a playful site for a children's educational app with fun colors"
  ];

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/intelligent-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt })
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">🤖 Intelligent Page Generator</h1>
            <p className="text-gray-600 mt-2">
              AI-powered prompt refinement → Style matching → AI image integration
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Describe your website vision</h2>
          
          <div className="space-y-4">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="E.g., Create a modern tech startup website that builds trust with developers and showcases our AI products..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Quick examples:</span>
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setUserPrompt(prompt)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                >
                  {prompt.substring(0, 50)}...
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!userPrompt.trim() || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? '🔄 Analyzing & Generating...' : '🚀 Generate Intelligent Website'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {/* Analysis Results */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🧠 AI Analysis Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Selected Style</h3>
                    <div className="mt-1 px-3 py-2 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-900 capitalize">{result.selectedTone}</span>
                      <p className="text-sm text-blue-700 mt-1">{result.styleRationale}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Target Audience</h3>
                    <p className="text-sm text-gray-600 mt-1">{result.targetAudience}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Content Strategy</h3>
                    <p className="text-sm text-gray-600 mt-1">{result.contentStrategy}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Visual Direction</h3>
                    <p className="text-sm text-gray-600 mt-1">{result.visualDirection}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Color Palette</h3>
                    <div className="flex gap-2 mt-1">
                      {Object.values(result.colorScheme).slice(0, 5).map((color: any, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">AI Images Used</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {Object.keys(result.aiImages).length} AI-generated images integrated
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Refinement */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📝 Prompt Refinement</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Original Prompt</h3>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {result.originalPrompt}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Claude-Enhanced Prompt</h3>
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                    {result.refinedPrompt}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Website */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">🎨 Generated Website</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generated at {new Date(result.metadata.generatedAt).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-50">
                {result.page && <PageRenderer page={result.page} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}