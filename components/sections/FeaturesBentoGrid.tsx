// components/sections/FeaturesBentoGrid.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function FeaturesBentoGrid({ tone = 'minimal', content = {} }: SectionProps) {
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

  const cardClasses = {
    minimal: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    bold: 'bg-gray-800 border border-gray-700 hover:border-red-500/50',
    playful: 'bg-white border border-purple-200 shadow-lg hover:shadow-purple-200/50',
    corporate: 'bg-white border border-gray-200 shadow-sm hover:shadow-lg',
    modern: 'bg-gray-800/50 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40',
    elegant: 'bg-white border border-amber-200/50 shadow-sm hover:shadow-amber-100/50',
    warm: 'bg-white border border-orange-200 shadow-sm hover:shadow-orange-100/50',
    luxury: 'bg-gray-800/50 border border-amber-500/20 hover:border-amber-400/40',
    creative: 'bg-white border border-pink-200 shadow-lg hover:shadow-pink-200/50',
    nature: 'bg-white border border-green-200 shadow-sm hover:shadow-green-100/50',
    retro: 'bg-white border border-yellow-300 shadow-sm hover:shadow-yellow-200/50',
    monochrome: 'bg-white border border-gray-300 shadow-sm hover:shadow-lg',
    techno: 'bg-gray-900/50 border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40',
    zen: 'bg-white border border-stone-200 shadow-sm hover:shadow-stone-100/50'
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

  // Default features if none provided - designed for bento grid layout
  const features = (Array.isArray(content.features) ? content.features : []) || [
    { 
      title: 'Lightning Fast', 
      description: 'Optimized performance with sub-second load times and instant interactions', 
      icon: '⚡',
      featured: true 
    },
    { 
      title: 'Secure by Design', 
      description: 'Enterprise-grade security built into every layer', 
      icon: '🛡️',
      featured: false 
    },
    { 
      title: 'Smart Analytics', 
      description: 'AI-powered insights that help you make better decisions', 
      icon: '📊',
      featured: true 
    },
    { 
      title: 'Easy Integration', 
      description: 'Connect with your existing tools in minutes', 
      icon: '🔌',
      featured: false 
    },
    { 
      title: 'Global Scale', 
      description: 'Built to handle millions of users worldwide', 
      icon: '🌍',
      featured: false 
    },
    { 
      title: '24/7 Support', 
      description: 'Expert help whenever you need it', 
      icon: '🎧',
      featured: false 
    }
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
          {features.map((feature: any, i: number) => {
            // Define different sizes for bento box effect
            const gridClasses = [
              'md:col-span-2 md:row-span-2', // Large featured
              'md:col-span-1 md:row-span-1', // Small
              'md:col-span-2 md:row-span-1', // Wide
              'md:col-span-1 md:row-span-2', // Tall
              'md:col-span-1 md:row-span-1', // Small
              'md:col-span-2 md:row-span-1', // Wide
            ];

            const isLarge = i === 0 || i === 2;
            const gridClass = gridClasses[i % gridClasses.length];

            return (
              <div 
                key={i} 
                className={`${cardClasses[tone]} ${gridClass} rounded-2xl p-6 lg:p-8 transition-all duration-300 group cursor-pointer`}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 text-2xl transition-transform group-hover:scale-110 ${
                  tone === 'minimal' ? 'bg-gray-100' :
                  tone === 'bold' ? 'bg-gray-700' :
                  tone === 'playful' ? 'bg-purple-100' :
                  tone === 'corporate' ? 'bg-blue-100' :
                  tone === 'modern' ? 'bg-gray-700 border border-cyan-500/20' :
                  tone === 'elegant' ? 'bg-amber-50' :
                  tone === 'warm' ? 'bg-orange-100' :
                  tone === 'luxury' ? 'bg-gray-700' :
                  tone === 'creative' ? 'bg-pink-100' :
                  tone === 'nature' ? 'bg-green-100' :
                  tone === 'retro' ? 'bg-yellow-100' :
                  tone === 'monochrome' ? 'bg-gray-200' :
                  tone === 'techno' ? 'bg-blue-900/50 border border-blue-400/20' :
                  'bg-stone-100'
                } ${isLarge ? 'lg:w-16 lg:h-16 lg:text-3xl' : ''}`}>
                  {feature.icon || '✨'}
                </div>

                {/* Content */}
                <div className={isLarge ? 'lg:pr-8' : ''}>
                  <h3 className={`font-bold mb-3 transition-colors group-hover:${iconClasses[tone]} ${
                    isLarge ? 'text-2xl lg:text-3xl' : 'text-xl'
                  } ${textClasses[tone]}`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
                  } ${isLarge ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}`}>
                    {feature.description}
                  </p>
                </div>

                {/* Decorative element for large cards */}
                {isLarge && (
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-20 ${
                    tone === 'minimal' ? 'bg-gray-400' :
                    tone === 'bold' ? 'bg-red-500' :
                    tone === 'playful' ? 'bg-purple-500' :
                    tone === 'corporate' ? 'bg-blue-500' :
                    tone === 'modern' ? 'bg-cyan-400' :
                    tone === 'elegant' ? 'bg-amber-500' :
                    tone === 'warm' ? 'bg-orange-500' :
                    tone === 'luxury' ? 'bg-amber-400' :
                    tone === 'creative' ? 'bg-pink-500' :
                    tone === 'nature' ? 'bg-green-500' :
                    tone === 'retro' ? 'bg-yellow-500' :
                    tone === 'monochrome' ? 'bg-gray-600' :
                    tone === 'techno' ? 'bg-blue-400' :
                    'bg-stone-500'
                  }`} />
                )}
              </div>
            );
          })}
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
              {(content.cta as any)?.label || 'Explore Features'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}