// components/sections/HeroFullBleed.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroFullBleed({ tone = 'minimal', content = {} }: SectionProps) {
  const overlayClasses = {
    minimal: 'bg-gradient-to-r from-white/95 to-white/90',
    bold: 'bg-gradient-to-r from-black/80 to-black/60',
    playful: 'bg-gradient-to-br from-purple-600/90 to-pink-600/90',
    corporate: 'bg-gradient-to-r from-blue-900/90 to-blue-800/80',
    modern: 'bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-slate-900/95',
    elegant: 'bg-gradient-to-r from-amber-900/90 to-rose-900/80',
    warm: 'bg-gradient-to-br from-orange-800/90 to-yellow-700/85',
    luxury: 'bg-gradient-to-r from-black/90 to-amber-950/80',
    creative: 'bg-gradient-to-br from-fuchsia-900/90 to-indigo-900/85',
    nature: 'bg-gradient-to-r from-green-900/90 to-emerald-800/85',
    retro: 'bg-gradient-to-br from-pink-800/90 to-orange-700/85',
    monochrome: 'bg-gradient-to-r from-black/95 to-zinc-900/90',
    techno: 'bg-gradient-to-br from-blue-950/95 to-cyan-900/90',
    zen: 'bg-gradient-to-r from-stone-800/90 to-stone-700/85'
  };

  const textClasses = {
    minimal: 'text-gray-900',
    bold: 'text-white',
    playful: 'text-white',
    corporate: 'text-white',
    modern: 'text-white',
    elegant: 'text-white',
    warm: 'text-white',
    luxury: 'text-white',
    creative: 'text-white',
    nature: 'text-white',
    retro: 'text-white',
    monochrome: 'text-white',
    techno: 'text-white',
    zen: 'text-white'
  };

  const buttonClasses = {
    minimal: 'bg-gray-900 text-white hover:bg-gray-800',
    bold: 'bg-red-600 text-white hover:bg-red-700',
    playful: 'bg-white text-purple-600 hover:bg-gray-100',
    corporate: 'bg-white text-blue-900 hover:bg-gray-100',
    modern: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25',
    elegant: 'bg-gradient-to-r from-amber-600 to-rose-600 text-white hover:from-amber-700 hover:to-rose-700',
    warm: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600',
    luxury: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600',
    creative: 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:from-fuchsia-600 hover:to-purple-600',
    nature: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600',
    retro: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600',
    monochrome: 'bg-white text-black hover:bg-gray-100',
    techno: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 shadow-lg shadow-blue-500/25',
    zen: 'bg-gradient-to-r from-stone-500 to-stone-600 text-white hover:from-stone-600 hover:to-stone-700'
  };

  // Using a placeholder image for the background
  const backgroundImage = content.backgroundImage || 
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 z-10 ${overlayClasses[tone]}`} />
      
      {/* Content */}
      <div className={`relative z-20 max-w-6xl mx-auto px-4 text-center ${textClasses[tone]}`}>
        {content.eyebrow && (
          <p className="text-sm md:text-base uppercase tracking-wider mb-4 opacity-90">
{typeof content.eyebrow === 'string' ? content.eyebrow : 'Eyebrow'}
          </p>
        )}
        
        {content.headline && (
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
{typeof content.headline === 'string' ? content.headline : 'Headline'}
          </h1>
        )}
        
        {content.subheadline && (
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl mx-auto opacity-90">
{typeof content.subheadline === 'string' ? content.subheadline : 'Subheadline'}
          </p>
        )}

        {content.primaryCta && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-10 py-5 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${buttonClasses[tone]}`}>
{(content.primaryCta && typeof content.primaryCta === 'object' && 'label' in content.primaryCta) ? (content.primaryCta as any).label : 'Get Started'}
            </button>
            {content.secondaryCta && (
              <button className="px-10 py-5 rounded-lg font-bold text-lg border-2 border-current transition-all transform hover:scale-105">
{(content.secondaryCta && typeof content.secondaryCta === 'object' && 'label' in content.secondaryCta) ? (content.secondaryCta as any).label : 'Watch Demo'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}