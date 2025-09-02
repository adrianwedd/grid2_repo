// components/sections/HeroAnimatedText.tsx
'use client';

import React, { useEffect, useState } from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroAnimatedText({ tone, content }: SectionProps) {
  const defaultWords = ['Innovate', 'Create', 'Transform', 'Inspire'];
  const words = Array.isArray(content?.animatedWords) ? content.animatedWords : defaultWords;
  const [currentWord, setCurrentWord] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const subheadline = typeof content?.subheadline === 'string' 
    ? content.subheadline 
    : 'Building the future, one line of code at a time.';
  
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
          We{' '}
          <span className="inline-block min-w-[200px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            {typeof words[currentWord] === 'string' ? words[currentWord] : 'Transform'}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
          {subheadline}
        </p>
      </div>
    </section>
  );
}