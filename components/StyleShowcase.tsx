'use client';

import React, { useState, useEffect } from 'react';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { PageRenderer } from '@/components/PageRenderer';
import { imageProvider } from '@/lib/image-provider';
import type { SectionNode, Tone, PageNode } from '@/types/section-system';

const STYLES: { value: Tone; label: string; description: string; accent: string; category: string }[] = [
  // Government Ass-Covering Blandness
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Maximum safety, minimum liability',
    accent: 'bg-gray-300 hover:bg-gray-400 text-gray-900',
    category: 'Safe & Boring'
  },
  {
    value: 'corporate',
    label: 'Corporate',
    description: 'Government ass-covering blandness',
    accent: 'bg-blue-600 hover:bg-blue-700 text-white',
    category: 'Safe & Boring'
  },
  {
    value: 'elegant',
    label: 'Elegant',
    description: 'Boring, but make it sophisticated',
    accent: 'bg-slate-600 hover:bg-slate-700 text-white',
    category: 'Safe & Boring'
  },
  
  // Normal Human Styles
  {
    value: 'warm',
    label: 'Warm',
    description: 'Cozy coffee shop vibes, actually likeable',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
    category: 'Normal Human'
  },
  {
    value: 'nature',
    label: 'Nature',
    description: 'Eco-friendly without being preachy',
    accent: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white',
    category: 'Normal Human'
  },
  {
    value: 'luxury',
    label: 'Luxury',
    description: 'Rich people problems, premium materials',
    accent: 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white',
    category: 'Normal Human'
  },
  
  // Getting Weird
  {
    value: 'bold',
    label: 'Bold',
    description: 'Dramatic villain energy, high contrast',
    accent: 'bg-black hover:bg-gray-900 text-white',
    category: 'Getting Weird'
  },
  {
    value: 'modern',
    label: 'Modern',
    description: 'Cyberpunk startup, neon everything',
    accent: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white',
    category: 'Getting Weird'
  },
  {
    value: 'retro',
    label: 'Retro',
    description: '80s nostalgia meets modern confusion',
    accent: 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white',
    category: 'Getting Weird'
  },
  
  // Unhinged Research Lab
  {
    value: 'playful',
    label: 'Playful',
    description: 'Kids cereal box meets acid trip',
    accent: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
    category: 'Research Lab'
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Unhinged psychedelic research lab',
    accent: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white',
    category: 'Research Lab'
  },
  {
    value: 'monochrome',
    label: 'Monochrome',
    description: 'Stark brutalist madness, editorial chaos',
    accent: 'bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white',
    category: 'Research Lab'
  }
];

export function StyleShowcase() {
  const [currentTone, setCurrentTone] = useState<Tone>('minimal');
  const [page, setPage] = useState<PageNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageStats, setImageStats] = useState({ placeholders: 0, generated: 0, aiGenerated: 0, tones: [] as string[], sections: [] as string[] });
  const [selectedCategory, setSelectedCategory] = useState<string>('Safe & Boring');
  
  // Group styles by category
  const stylesByCategory = STYLES.reduce((acc, style) => {
    if (!acc[style.category]) acc[style.category] = [];
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, typeof STYLES>);
  
  const categories = Object.keys(stylesByCategory);

  // Generate page for current tone with contextual images
  useEffect(() => {
    async function generateForTone() {
      setLoading(true);
      try {
        console.log('🎨 Generating page for tone:', currentTone);
        
        // Get image stats
        const stats = imageProvider.getImageStats();
        setImageStats(stats);
        console.log('📊 Image stats:', stats);
        
        const result = await generatePage(demoContent, demoBrand, currentTone, ['hero', 'features', 'cta']);
        console.log('✅ Page generated successfully');
        setPage(result.primary);
      } catch (error) {
        console.error('❌ Failed to generate page:', error);
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Grid 2.0 Style Showcase</h1>
                <p className="text-sm text-gray-600 mt-1">
                  From government blandness to psychedelic research lab
                </p>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>
                  {imageStats.generated > 0 
                    ? `${imageStats.generated} AI images` 
                    : `${imageStats.placeholders} placeholders`
                  }
                </span>
                <a href="/editor" className="hover:text-blue-600 transition-colors">
                  Try Editor →
                </a>
                <a href="/demo" className="hover:text-blue-600 transition-colors">
                  Static Demo →
                </a>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="flex items-center space-x-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Style Buttons for Selected Category */}
            <div className="flex flex-wrap items-center gap-2">
              {stylesByCategory[selectedCategory]?.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setCurrentTone(style.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentTone === style.value
                      ? style.accent
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title={style.description}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current tone description */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900">
                  {STYLES.find(t => t.value === currentTone)?.label}
                </span>
                <span className="ml-2 text-gray-600">
                  {STYLES.find(t => t.value === currentTone)?.description}
                </span>
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