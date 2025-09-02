// components/sections/FeaturesIconGrid.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function FeaturesIconGrid({ tone, content }: SectionProps) {
  const defaultFeatures = [
    { icon: '🚀', title: 'Fast Performance', description: 'Lightning-fast load times' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
    { icon: '📱', title: 'Responsive', description: 'Works on all devices' },
    { icon: '🎨', title: 'Customizable', description: 'Fully customizable design' },
    { icon: '📊', title: 'Analytics', description: 'Built-in analytics' },
    { icon: '🤝', title: 'Support', description: '24/7 customer support' },
  ];
  
  // Handle both string array and object array
  let features = defaultFeatures;
  if (content?.features) {
    if (Array.isArray(content.features) && typeof content.features[0] === 'string') {
      // Convert string array to feature objects
      features = (content.features as string[]).map((f, i) => ({
        icon: ['🚀', '🔒', '📱', '🎨', '📊', '🤝'][i % 6],
        title: f,
        description: ''
      }));
    } else if (Array.isArray(content.features)) {
      features = content.features as any[];
    }
  }

  const bgColors = {
    minimal: 'bg-gray-50',
    bold: 'bg-gradient-to-br from-purple-50 to-pink-50',
    playful: 'bg-gradient-to-br from-yellow-50 to-blue-50',
    corporate: 'bg-slate-50',
    elegant: 'bg-stone-50',
    modern: 'bg-zinc-50',
    warm: 'bg-orange-50',
    luxury: 'bg-amber-50',
    creative: 'bg-gradient-to-br from-fuchsia-50 to-cyan-50',
    nature: 'bg-green-50',
    retro: 'bg-gradient-to-br from-pink-50 to-orange-50',
    monochrome: 'bg-gray-50',
    techno: 'bg-blue-50',
    zen: 'bg-stone-50'
  };

  const bgClass = tone && bgColors[tone] ? bgColors[tone] : bgColors.minimal;
  
  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {typeof content?.headline === 'string' ? content.headline : 'Features'}
          </h2>
          <p className="text-xl text-gray-600">
            {typeof content?.subheadline === 'string' ? content.subheadline : 'Everything you need to succeed'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {features.map((feature: any, i: number) => (
            <div key={i} className="text-center group hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}