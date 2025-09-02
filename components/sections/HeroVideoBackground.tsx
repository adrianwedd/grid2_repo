// components/sections/HeroVideoBackground.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroVideoBackground({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Experience the Future';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Innovation that transforms industries and empowers people.';
  const defaultPrimaryCta = { label: 'Start Now', href: '/signup' };
  const primaryCta = (typeof content?.primaryCta === 'object' && 
    content.primaryCta && 
    !Array.isArray(content.primaryCta) &&
    'href' in content.primaryCta) 
    ? content.primaryCta as any
    : defaultPrimaryCta;
  const videoUrl = typeof content?.videoUrl === 'string' ? content.videoUrl : 'https://www.w3schools.com/html/mov_bbb.mp4';
  
  const overlayOpacity = {
    minimal: 'bg-black/40',
    bold: 'bg-black/60',
    playful: 'bg-gradient-to-b from-purple-900/60 to-pink-900/60',
    corporate: 'bg-blue-950/70',
    elegant: 'bg-black/50',
    modern: 'bg-gradient-to-br from-cyan-900/50 to-blue-900/50',
    warm: 'bg-gradient-to-b from-orange-900/60 to-red-900/60',
    luxury: 'bg-black/70',
    creative: 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60',
    nature: 'bg-gradient-to-b from-green-900/50 to-emerald-900/50',
    retro: 'bg-gradient-to-br from-pink-900/60 to-orange-900/60',
    monochrome: 'bg-black/60',
    techno: 'bg-gradient-to-b from-blue-950/70 to-cyan-950/70',
    zen: 'bg-gradient-to-b from-stone-900/40 to-stone-800/40'
  };

  const overlay = tone && overlayOpacity[tone] ? overlayOpacity[tone] : overlayOpacity.minimal;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/api/placeholder/1920/1080"
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
        </video>
        
        {/* Overlay for text readability */}
        <div className={`absolute inset-0 ${overlay}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Headline with animation */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white animate-fade-in-up">
            {headline}
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              {subheadline}
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-4 animate-fade-in-up animation-delay-400">
            <a
              href={primaryCta.href}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl"
            >
              {primaryCta.label}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Optional: Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </section>
  );
}