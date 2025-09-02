// components/sections/FeaturesIconList.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function FeaturesIconList({ tone = 'minimal', content = {} }: SectionProps) {
  const bgClasses = {
    minimal: 'bg-white',
    bold: 'bg-gray-900',
    playful: 'bg-gradient-to-br from-purple-50 to-pink-50',
    corporate: 'bg-gray-50',
    modern: 'bg-gradient-to-br from-slate-900 to-gray-800',
    elegant: 'bg-gradient-to-b from-neutral-50 to-white',
    warm: 'bg-gradient-to-br from-orange-50 to-amber-50',
    luxury: 'bg-gradient-to-b from-gray-900 to-black',
    creative: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
    nature: 'bg-gradient-to-br from-green-50 to-emerald-50',
    retro: 'bg-gradient-to-br from-yellow-100 to-orange-100',
    monochrome: 'bg-gray-100',
    techno: 'bg-gradient-to-br from-blue-900 to-indigo-900',
    zen: 'bg-gradient-to-b from-stone-50 to-white'
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

  const iconClasses = {
    minimal: 'text-gray-600',
    bold: 'text-red-500',
    playful: 'text-purple-600',
    corporate: 'text-blue-600',
    modern: 'text-cyan-400',
    elegant: 'text-amber-600',
    warm: 'text-orange-600',
    luxury: 'text-amber-500',
    creative: 'text-pink-500',
    nature: 'text-green-600',
    retro: 'text-yellow-600',
    monochrome: 'text-gray-600',
    techno: 'text-blue-400',
    zen: 'text-stone-500'
  };

  const headlineClasses = {
    minimal: 'text-gray-900',
    bold: 'text-white',
    playful: 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    corporate: 'text-gray-900',
    modern: 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent',
    elegant: 'text-gray-900',
    warm: 'text-gray-900',
    luxury: 'bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent',
    creative: 'bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent',
    nature: 'text-gray-900',
    retro: 'text-gray-900',
    monochrome: 'text-gray-900',
    techno: 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent',
    zen: 'text-gray-900'
  };

  // Default features if none provided
  const features = (Array.isArray(content.features) ? content.features : []) || [
    { title: 'Fast Performance', description: 'Optimized for speed and efficiency', icon: '⚡' },
    { title: 'Secure by Default', description: 'Built with security best practices', icon: '🔒' },
    { title: 'Easy to Use', description: 'Intuitive interface and workflow', icon: '👍' },
    { title: 'Scalable', description: 'Grows with your business needs', icon: '📈' },
    { title: '24/7 Support', description: 'Always here when you need us', icon: '🎧' },
    { title: 'API Access', description: 'Full programmatic control', icon: '🔌' }
  ];

  return (
    <section className={`py-20 px-4 ${bgClasses[tone]}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {content.eyebrow && (
            <p className={`text-sm uppercase tracking-wider mb-4 ${iconClasses[tone]}`}>
              {String(content.eyebrow)}
            </p>
          )}
          
          {content.headline && (
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${headlineClasses[tone]}`}>
              {String(content.headline)}
            </h2>
          )}
          
          {content.subheadline && (
            <p className={`text-xl max-w-2xl mx-auto ${
              tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {String(content.subheadline)}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, i: number) => (
            <div key={i} className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                tone === 'minimal' ? 'bg-gray-100' :
                tone === 'bold' ? 'bg-gray-800' :
                tone === 'playful' ? 'bg-purple-100' :
                tone === 'corporate' ? 'bg-blue-100' :
                tone === 'modern' ? 'bg-gray-800 border border-cyan-500/20' :
                tone === 'elegant' ? 'bg-amber-50' :
                tone === 'warm' ? 'bg-orange-100' :
                tone === 'luxury' ? 'bg-gray-800' :
                tone === 'creative' ? 'bg-pink-100' :
                tone === 'nature' ? 'bg-green-100' :
                tone === 'retro' ? 'bg-yellow-100' :
                tone === 'monochrome' ? 'bg-gray-200' :
                tone === 'techno' ? 'bg-blue-900/50 border border-blue-400/20' :
                'bg-stone-100'
              }`}>
                {feature.icon || '✨'}
              </div>

              {/* Content */}
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${textClasses[tone]}`}>
                  {feature.title}
                </h3>
                <p className={`${
                  tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional CTA */}
        {content.cta && (
          <div className="text-center mt-16">
            <button className={`px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              tone === 'minimal' ? 'bg-gray-900 text-white hover:bg-gray-800' :
              tone === 'bold' ? 'bg-red-600 text-white hover:bg-red-700' :
              tone === 'playful' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' :
              tone === 'corporate' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              tone === 'modern' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25' :
              tone === 'elegant' ? 'bg-amber-600 text-white hover:bg-amber-700' :
              tone === 'warm' ? 'bg-orange-600 text-white hover:bg-orange-700' :
              tone === 'luxury' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400' :
              tone === 'creative' ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-400 hover:to-violet-400' :
              tone === 'nature' ? 'bg-green-600 text-white hover:bg-green-700' :
              tone === 'retro' ? 'bg-yellow-500 text-black hover:bg-yellow-400' :
              tone === 'monochrome' ? 'bg-gray-800 text-white hover:bg-gray-700' :
              tone === 'techno' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-400 hover:to-cyan-400 shadow-lg shadow-blue-500/25' :
              'bg-stone-600 text-white hover:bg-stone-700'
            }`}>
              {(content.cta as any)?.label || 'Learn More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}