'use client';

import React, { useState, useEffect } from 'react';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { PageRenderer } from '@/components/PageRenderer';
import type { SectionNode, Tone, PageNode } from '@/types/section-system';

const TONES: { value: Tone; label: string; description: string; accent: string }[] = [
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Clean, focused, essential elements only',
    accent: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
  },
  {
    value: 'bold',
    label: 'Bold', 
    description: 'Strong contrasts, dramatic impact',
    accent: 'bg-black hover:bg-gray-900 text-white'
  },
  {
    value: 'playful',
    label: 'Playful',
    description: 'Vibrant colors, friendly interactions',
    accent: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
  },
  {
    value: 'corporate', 
    label: 'Corporate',
    description: 'Professional, trustworthy, refined',
    accent: 'bg-blue-600 hover:bg-blue-700 text-white'
  }
];

export function StyleShowcase() {
  const [currentTone, setCurrentTone] = useState<Tone>('minimal');
  const [page, setPage] = useState<PageNode | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate page for current tone
  useEffect(() => {
    async function generateForTone() {
      setLoading(true);
      try {
        const result = await generatePage(demoContent, demoBrand, currentTone, ['hero', 'features', 'cta']);
        setPage(result.primary);
      } catch (error) {
        console.error('Failed to generate page:', error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    }
    
    generateForTone();
  }, [currentTone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with style switcher */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grid 2.0 Style Showcase</h1>
              <p className="text-sm text-gray-600 mt-1">
                AI for understanding • Algorithms for execution
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setCurrentTone(tone.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentTone === tone.value
                      ? tone.accent
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title={tone.description}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current tone description */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900">
                  {TONES.find(t => t.value === currentTone)?.label}
                </span>
                <span className="ml-2 text-gray-600">
                  {TONES.find(t => t.value === currentTone)?.description}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <a href="/editor" className="hover:text-blue-600 transition-colors">
                  Try Editor →
                </a>
                <a href="/demo" className="hover:text-blue-600 transition-colors">
                  Static Demo →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated page preview */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Generating {currentTone} design...</span>
            </div>
          </div>
        )}
        
        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {page && <PageRenderer page={page} />}
        </div>
      </div>

      {/* Footer info */}
      <div className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            Each style generated in ~1ms using deterministic beam search • 
            <span className="ml-1 text-blue-400">
              Same content, different aesthetic personalities
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}