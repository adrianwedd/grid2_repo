// components/sections/HeroParallaxScroll.tsx
'use client';

import React, { useEffect, useState } from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroParallaxScroll({ tone, content }: SectionProps) {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headline = typeof content?.headline === 'string' ? content.headline : 'Scroll Into Innovation';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Experience depth and dimension in web design.';
  
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Parallax layers */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-600 to-purple-600"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      <div 
        className="absolute inset-0 bg-black/20"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          >
            {headline}
          </h1>
          <p 
            className="text-xl md:text-2xl opacity-90"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            {subheadline}
          </p>
        </div>
      </div>
    </section>
  );
}