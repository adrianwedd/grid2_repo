// components/sections/HeroGradientSpotlight.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroGradientSpotlight({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Transform Your Vision Into Reality';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Powerful solutions that drive results and exceed expectations.';
  const defaultPrimaryCta = { label: 'Get Started', href: '/signup' };
  const defaultSecondaryCta = { label: 'Learn More', href: '/about' };
  
  const primaryCta = (typeof content?.primaryCta === 'object' && 
    content.primaryCta && 
    !Array.isArray(content.primaryCta) &&
    'href' in content.primaryCta) 
    ? content.primaryCta as any
    : defaultPrimaryCta;
    
  const secondaryCta = (typeof content?.secondaryCta === 'object' && 
    content.secondaryCta && 
    !Array.isArray(content.secondaryCta) &&
    'href' in content.secondaryCta)
    ? content.secondaryCta as any
    : defaultSecondaryCta;

  const gradientClasses = {
    minimal: 'from-gray-900 via-gray-800 to-black',
    bold: 'from-purple-900 via-pink-800 to-orange-700',
    playful: 'from-blue-600 via-purple-600 to-pink-600',
    corporate: 'from-slate-800 via-blue-900 to-slate-900',
    elegant: 'from-amber-900 via-rose-900 to-purple-900',
    modern: 'from-cyan-900 via-blue-900 to-indigo-900',
    warm: 'from-orange-800 via-red-800 to-yellow-700',
    luxury: 'from-black via-amber-950 to-black',
    creative: 'from-fuchsia-900 via-purple-800 to-indigo-900',
    nature: 'from-green-900 via-emerald-800 to-teal-900',
    retro: 'from-pink-800 via-orange-700 to-yellow-600',
    monochrome: 'from-zinc-900 via-zinc-800 to-black',
    techno: 'from-blue-950 via-cyan-900 to-blue-950',
    zen: 'from-stone-800 via-stone-700 to-stone-900'
  };

  const gradient = tone && gradientClasses[tone] ? gradientClasses[tone] : gradientClasses.minimal;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
        {/* Animated spotlight effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-1000" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              {headline}
            </span>
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {subheadline}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href={primaryCta.href}
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl"
            >
              {primaryCta.label}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>

          {/* Optional: Stats or trust indicators */}
          {content?.stats && (
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              {content.stats.map((stat: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}