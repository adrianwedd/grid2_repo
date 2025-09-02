// components/sections/AboutStoryTimeline.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function AboutStoryTimeline({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Our Story';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'How we got here and where we\'re going.';
  
  const defaultStory = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Started with a simple idea to solve a complex problem.',
      highlight: true
    },
    {
      year: '2020',
      title: 'First Milestone',
      description: 'Launched our MVP and gained first customers.',
      highlight: false
    },
    {
      year: '2021',
      title: 'Rapid Growth',
      description: 'Scaled to serve thousands of customers worldwide.',
      highlight: false
    },
    {
      year: '2022',
      title: 'Innovation',
      description: 'Introduced groundbreaking features that changed the industry.',
      highlight: true
    },
    {
      year: '2023',
      title: 'Recognition',
      description: 'Won multiple awards and expanded globally.',
      highlight: false
    },
    {
      year: '2024',
      title: 'The Future',
      description: 'Continuing to innovate and lead the market.',
      highlight: true
    }
  ];

  const story = Array.isArray(content?.story) ? content.story : defaultStory;

  const lineColors = {
    minimal: 'bg-gray-300',
    bold: 'bg-purple-500',
    playful: 'bg-gradient-to-b from-blue-400 to-purple-500',
    corporate: 'bg-blue-600',
    elegant: 'bg-amber-500',
    modern: 'bg-cyan-500',
    warm: 'bg-orange-500',
    luxury: 'bg-yellow-600',
    creative: 'bg-fuchsia-500',
    nature: 'bg-green-500',
    retro: 'bg-pink-500',
    monochrome: 'bg-zinc-600',
    techno: 'bg-cyan-400',
    zen: 'bg-stone-400'
  };

  const dotColors = {
    minimal: 'bg-gray-600 border-gray-300',
    bold: 'bg-purple-600 border-purple-300',
    playful: 'bg-blue-500 border-blue-300',
    corporate: 'bg-blue-700 border-blue-400',
    elegant: 'bg-amber-600 border-amber-300',
    modern: 'bg-cyan-600 border-cyan-300',
    warm: 'bg-orange-600 border-orange-300',
    luxury: 'bg-yellow-700 border-yellow-400',
    creative: 'bg-fuchsia-600 border-fuchsia-300',
    nature: 'bg-green-600 border-green-300',
    retro: 'bg-pink-600 border-pink-300',
    monochrome: 'bg-zinc-800 border-zinc-400',
    techno: 'bg-cyan-500 border-cyan-300',
    zen: 'bg-stone-600 border-stone-300'
  };

  const lineColor = tone && lineColors[tone] ? lineColors[tone] : lineColors.minimal;
  const dotColor = tone && dotColors[tone] ? dotColors[tone] : dotColors.minimal;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full ${lineColor}`} />

          {/* Timeline items */}
          <div className="space-y-12">
            {story.map((item: any, i: number) => (
              <div key={i} className={`flex items-center ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2 px-8">
                  <div className={`${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`text-2xl font-bold mb-2 ${item.highlight ? 'text-blue-600' : 'text-gray-700'}`}>
                      {item.year}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="relative flex items-center justify-center">
                  <div className={`w-6 h-6 ${dotColor} rounded-full border-4 z-10 ${item.highlight ? 'scale-125' : ''}`} />
                </div>
                
                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}