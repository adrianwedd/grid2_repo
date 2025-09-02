// components/sections/FeaturesTimeline.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function FeaturesTimeline({ tone, content }: SectionProps) {
  const defaultTimeline = [
    { year: '2020', title: 'Founded', description: 'Started with a vision' },
    { year: '2021', title: 'First Product', description: 'Launched our flagship product' },
    { year: '2022', title: 'Scale', description: 'Reached 10,000 customers' },
    { year: '2023', title: 'Innovation', description: 'AI-powered features' },
    { year: '2024', title: 'Global', description: 'Expanded worldwide' },
  ];
  
  const timeline = Array.isArray(content?.timeline) ? content.timeline : defaultTimeline;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {typeof content?.headline === 'string' ? content.headline : 'Our Journey'}
          </h2>
          <p className="text-xl text-gray-600">
            {typeof content?.subheadline === 'string' ? content.subheadline : 'Milestones that define us'}
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200" />
          
          {/* Timeline items */}
          <div className="space-y-12">
            {timeline.map((item: any, i: number) => (
              <div key={i} className={`flex items-center ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2 px-8">
                  <div className={`${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center w-8 h-8">
                  <div className="w-4 h-4 bg-blue-600 rounded-full" />
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