// components/sections/HeroCentered.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroCentered({ tone = 'minimal', content = {} }: SectionProps) {
  const bgClasses = {
    minimal: 'bg-gradient-to-b from-gray-50 to-white',
    bold: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
    playful: 'bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50',
    corporate: 'bg-gradient-to-b from-blue-50 to-white',
    modern: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
    elegant: 'bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50',
    warm: 'bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50',
    luxury: 'bg-gradient-to-b from-black to-amber-950',
    creative: 'bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50',
    nature: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
    retro: 'bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50',
    monochrome: 'bg-gradient-to-b from-white to-gray-100',
    techno: 'bg-gradient-to-br from-blue-950 via-cyan-900 to-blue-950',
    zen: 'bg-gradient-to-b from-stone-50 to-stone-100'
  };

  const textClasses = {
    minimal: 'text-gray-900',
    bold: 'text-white',
    playful: 'text-gray-900',
    corporate: 'text-gray-900',
    modern: 'text-white',
    elegant: 'text-gray-900',
    warm: 'text-gray-900',
    luxury: 'text-white',
    creative: 'text-gray-900',
    nature: 'text-gray-900',
    retro: 'text-gray-900',
    monochrome: 'text-gray-900',
    techno: 'text-white',
    zen: 'text-gray-900'
  };

  const badgeClasses = {
    minimal: 'bg-gray-100 text-gray-700',
    bold: 'bg-gray-800 text-gray-300',
    playful: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700',
    corporate: 'bg-blue-100 text-blue-700',
    modern: 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-300 border border-cyan-500/30',
    elegant: 'bg-gradient-to-r from-amber-100 to-rose-100 text-amber-800',
    warm: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800',
    luxury: 'bg-gradient-to-r from-amber-900/50 to-yellow-900/50 text-amber-300 border border-amber-500/30',
    creative: 'bg-gradient-to-r from-fuchsia-100 to-purple-100 text-fuchsia-700',
    nature: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700',
    retro: 'bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700',
    monochrome: 'bg-gray-200 text-gray-800',
    techno: 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 text-blue-300 border border-blue-500/30',
    zen: 'bg-stone-100 text-stone-700'
  };

  const primaryButtonClasses = {
    minimal: 'bg-black text-white hover:bg-gray-800',
    bold: 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700',
    playful: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    corporate: 'bg-blue-600 text-white hover:bg-blue-700',
    modern: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 border border-cyan-400/20',
    elegant: 'bg-gradient-to-r from-amber-600 to-rose-600 text-white hover:from-amber-700 hover:to-rose-700',
    warm: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600',
    luxury: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600',
    creative: 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:from-fuchsia-600 hover:to-purple-600',
    nature: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600',
    retro: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600',
    monochrome: 'bg-black text-white hover:bg-gray-800',
    techno: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 shadow-lg shadow-blue-500/25',
    zen: 'bg-gradient-to-r from-stone-500 to-stone-600 text-white hover:from-stone-600 hover:to-stone-700'
  };

  return (
    <section className={`min-h-screen flex items-center justify-center px-4 py-20 ${bgClasses[tone]}`}>
      <div className={`max-w-4xl mx-auto text-center ${textClasses[tone]}`}>
        {/* Badge */}
        {content.badge && (
          <div className="inline-flex items-center gap-2 mb-6">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${badgeClasses[tone]}`}>
{typeof content.badge === 'string' ? content.badge : 'Badge'}
            </span>
          </div>
        )}

        {/* Headline */}
        {content.headline && (
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
            tone === 'playful' ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent' :
            tone === 'modern' ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' :
            tone === 'elegant' ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent' :
            tone === 'creative' ? 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent' :
            tone === 'techno' ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent' : ''
          }`}>
{typeof content.headline === 'string' ? content.headline : 'Headline'}
          </h1>
        )}
        
        {/* Subheadline */}
        {content.subheadline && (
          <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto ${
            tone === 'minimal' ? 'text-gray-600' :
            tone === 'bold' ? 'text-gray-300' :
            tone === 'corporate' ? 'text-gray-600' :
            tone === 'modern' ? 'text-gray-300' :
            tone === 'luxury' ? 'text-gray-300' :
            tone === 'techno' ? 'text-gray-300' :
            'text-gray-700'
          }`}>
{typeof content.subheadline === 'string' ? content.subheadline : 'Subheadline'}
          </p>
        )}

        {/* CTAs */}
        {content.primaryCta && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${primaryButtonClasses[tone]}`}>
{(content.primaryCta && typeof content.primaryCta === 'object' && 'label' in content.primaryCta) ? (content.primaryCta as any).label : 'Get Started Free'}
            </button>
            {content.secondaryCta && (
              <button className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all hover:shadow-lg ${
                tone === 'bold' ? 'border-gray-600 hover:border-gray-400' :
                tone === 'modern' ? 'border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:bg-cyan-500/10' :
                tone === 'luxury' ? 'border-amber-400/50 hover:border-amber-400 text-amber-300 hover:bg-amber-500/10' :
                tone === 'techno' ? 'border-blue-400/50 hover:border-blue-400 text-blue-300 hover:bg-blue-500/10' :
                'border-gray-300 hover:border-gray-400'
              }`}>
{(content.secondaryCta && typeof content.secondaryCta === 'object' && 'label' in content.secondaryCta) ? (content.secondaryCta as any).label : 'See How It Works'}
              </button>
            )}
          </div>
        )}

        {/* Trust indicators */}
        {content.trustIndicators && (
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm ${
            tone === 'bold' ? 'text-gray-400' :
            tone === 'modern' ? 'text-gray-400' :
            tone === 'luxury' ? 'text-gray-400' :
            tone === 'techno' ? 'text-gray-400' :
            'text-gray-600'
          }`}>
{(Array.isArray(content.trustIndicators) ? content.trustIndicators as string[] : []).map((indicator: string, i: number) => (
              <span key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {indicator}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}