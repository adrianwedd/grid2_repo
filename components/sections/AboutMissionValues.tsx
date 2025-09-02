// components/sections/AboutMissionValues.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function AboutMissionValues({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Our Mission & Values';
  const mission = typeof content?.mission === 'string' 
    ? content.mission 
    : 'To empower businesses and individuals with innovative solutions that drive meaningful change.';
  
  const defaultValues = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries and embrace new ideas.',
      icon: '💡'
    },
    {
      title: 'Integrity',
      description: 'We do the right thing, even when no one is watching.',
      icon: '🤝'
    },
    {
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do.',
      icon: '⭐'
    },
    {
      title: 'Collaboration',
      description: 'We believe great things happen when we work together.',
      icon: '🤲'
    },
    {
      title: 'Customer Focus',
      description: 'Our customers success is our success.',
      icon: '❤️'
    },
    {
      title: 'Sustainability',
      description: 'We care about our impact on the world.',
      icon: '🌍'
    }
  ];

  let values = defaultValues;
  if (Array.isArray(content?.values)) {
    values = content.values.map((value: any) => ({
      title: typeof value.title === 'string' ? value.title : 'Value',
      description: typeof value.description === 'string' ? value.description : '',
      icon: typeof value.icon === 'string' ? value.icon : '⭐'
    }));
  }

  const bgColors = {
    minimal: 'bg-white',
    bold: 'bg-gradient-to-br from-purple-900 to-pink-900 text-white',
    playful: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    corporate: 'bg-slate-900 text-white',
    elegant: 'bg-gradient-to-br from-amber-50 to-rose-50',
    modern: 'bg-gradient-to-br from-cyan-900 to-blue-900 text-white',
    warm: 'bg-gradient-to-br from-orange-100 to-red-100',
    luxury: 'bg-black text-white',
    creative: 'bg-gradient-to-br from-fuchsia-100 to-purple-100',
    nature: 'bg-gradient-to-br from-green-50 to-emerald-50',
    retro: 'bg-gradient-to-br from-pink-200 to-orange-200',
    monochrome: 'bg-zinc-100',
    techno: 'bg-gradient-to-br from-blue-950 to-cyan-950 text-white',
    zen: 'bg-stone-50'
  };

  const cardColors = {
    minimal: 'bg-gray-50 text-gray-900',
    bold: 'bg-white/10 backdrop-blur border border-white/20',
    playful: 'bg-white/20 backdrop-blur border border-white/30',
    corporate: 'bg-white/10 backdrop-blur border border-white/20',
    elegant: 'bg-white border border-amber-200',
    modern: 'bg-white/10 backdrop-blur border border-white/20',
    warm: 'bg-white border border-orange-200',
    luxury: 'bg-white/5 backdrop-blur border border-yellow-600',
    creative: 'bg-white border border-fuchsia-200',
    nature: 'bg-white border border-green-200',
    retro: 'bg-white border-2 border-pink-400',
    monochrome: 'bg-white border border-zinc-300',
    techno: 'bg-white/10 backdrop-blur border border-cyan-400',
    zen: 'bg-white border border-stone-200'
  };

  const bgColor = tone && bgColors[tone] ? bgColors[tone] : bgColors.minimal;
  const cardColor = tone && cardColors[tone] ? cardColors[tone] : cardColors.minimal;
  const isDark = ['bold', 'playful', 'corporate', 'modern', 'luxury', 'techno'].includes(tone || '');

  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {headline}
          </h2>
          
          {/* Mission Statement */}
          <div className={`max-w-4xl mx-auto p-8 rounded-2xl ${cardColor} mb-12`}>
            <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Mission
            </h3>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {mission}
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <div key={i} className={`p-6 rounded-xl ${cardColor} hover:shadow-lg transition-shadow`}>
              <div className="text-3xl mb-4">{value.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {value.title}
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}