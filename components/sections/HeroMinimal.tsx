// components/sections/HeroMinimal.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroMinimal({ tone = 'minimal', content = {} }: SectionProps) {
  const toneClasses = {
    minimal: 'bg-white text-gray-900',
    bold: 'bg-black text-white',
    playful: 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900',
    corporate: 'bg-gray-50 text-gray-900',
    modern: 'bg-gradient-to-br from-gray-900 to-gray-800 text-white',
    elegant: 'bg-gradient-to-br from-amber-50 to-rose-50 text-gray-900',
    warm: 'bg-gradient-to-br from-orange-50 to-red-50 text-gray-900',
    luxury: 'bg-gradient-to-br from-black to-amber-950 text-white',
    creative: 'bg-gradient-to-br from-fuchsia-50 to-purple-50 text-gray-900',
    nature: 'bg-gradient-to-br from-green-50 to-emerald-50 text-gray-900',
    retro: 'bg-gradient-to-br from-pink-50 to-orange-50 text-gray-900',
    monochrome: 'bg-white text-gray-900',
    techno: 'bg-gradient-to-br from-blue-950 to-cyan-900 text-white',
    zen: 'bg-gradient-to-br from-stone-50 to-stone-100 text-gray-900'
  };

  const buttonClasses = {
    minimal: 'bg-gray-900 text-white hover:bg-gray-800',
    bold: 'bg-white text-black hover:bg-gray-100',
    playful: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    corporate: 'bg-blue-600 text-white hover:bg-blue-700',
    modern: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600',
    elegant: 'bg-gradient-to-r from-amber-600 to-rose-600 text-white hover:from-amber-700 hover:to-rose-700',
    warm: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600',
    luxury: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600',
    creative: 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:from-fuchsia-600 hover:to-purple-600',
    nature: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600',
    retro: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600',
    monochrome: 'bg-black text-white hover:bg-gray-800',
    techno: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500',
    zen: 'bg-gradient-to-r from-stone-500 to-stone-600 text-white hover:from-stone-600 hover:to-stone-700'
  };

  return (
    <section className={`min-h-[70vh] flex items-center justify-center px-4 ${toneClasses[tone]}`}>
      <div className="max-w-4xl mx-auto text-center">
        {content.headline && (
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
            tone === 'playful' ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' :
            tone === 'elegant' ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent' :
            tone === 'creative' ? 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent' :
            tone === 'techno' ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent' : ''
          }`}>
{typeof content.headline === 'string' ? content.headline : 'Headline'}
          </h1>
        )}
        
        {content.subheadline && (
          <p className={`text-xl md:text-2xl mb-8 ${
            tone === 'minimal' ? 'text-gray-600' :
            tone === 'bold' ? 'text-gray-300' :
            tone === 'corporate' ? 'text-gray-700' :
            tone === 'modern' ? 'text-gray-300' :
            'text-gray-700'
          }`}>
{typeof content.subheadline === 'string' ? content.subheadline : 'Subheadline'}
          </p>
        )}

        {content.primaryCta && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-8 py-4 rounded-lg font-semibold transition-colors ${buttonClasses[tone]}`}>
{(content.primaryCta && typeof content.primaryCta === 'object' && 'label' in content.primaryCta) ? (content.primaryCta as any).label : 'Get Started'}
            </button>
            {content.secondaryCta && (
              <button className="px-8 py-4 rounded-lg font-semibold border-2 border-current transition-opacity hover:opacity-80">
{(content.secondaryCta && typeof content.secondaryCta === 'object' && 'label' in content.secondaryCta) ? (content.secondaryCta as any).label : 'Learn More'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}