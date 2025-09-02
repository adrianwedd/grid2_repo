// components/sections/FeaturesAccordion.tsx
'use client';

import React, { useState } from 'react';
import type { SectionProps } from '@/types/section-system';

export function FeaturesAccordion({ tone = 'minimal', content = {} }: SectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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

  const accordionClasses = {
    minimal: 'bg-white border border-gray-200',
    bold: 'bg-gray-800 border border-gray-700',
    playful: 'bg-white border border-purple-200',
    corporate: 'bg-white border border-gray-200',
    modern: 'bg-gray-800/50 border border-cyan-500/20 backdrop-blur-sm',
    elegant: 'bg-white border border-amber-200/50',
    warm: 'bg-white border border-orange-200',
    luxury: 'bg-gray-800/50 border border-amber-500/20',
    creative: 'bg-white border border-pink-200',
    nature: 'bg-white border border-green-200',
    retro: 'bg-white border border-yellow-300',
    monochrome: 'bg-white border border-gray-300',
    techno: 'bg-gray-900/50 border border-blue-500/20 backdrop-blur-sm',
    zen: 'bg-white border border-stone-200'
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

  const buttonHoverClasses = {
    minimal: 'hover:bg-gray-50',
    bold: 'hover:bg-gray-700',
    playful: 'hover:bg-purple-50',
    corporate: 'hover:bg-gray-50',
    modern: 'hover:bg-gray-700/50',
    elegant: 'hover:bg-amber-50',
    warm: 'hover:bg-orange-50',
    luxury: 'hover:bg-gray-700/50',
    creative: 'hover:bg-pink-50',
    nature: 'hover:bg-green-50',
    retro: 'hover:bg-yellow-50',
    monochrome: 'hover:bg-gray-50',
    techno: 'hover:bg-blue-900/30',
    zen: 'hover:bg-stone-50'
  };

  // Default features if none provided
  const features = (Array.isArray(content.features) ? content.features : []) || [
    { 
      title: 'Advanced Security', 
      description: 'Enterprise-grade security with end-to-end encryption, multi-factor authentication, and compliance with industry standards like SOC 2 and GDPR.',
      details: 'Our security infrastructure includes real-time threat detection, automated vulnerability scanning, and 24/7 monitoring by our security operations center.',
      icon: '🔒' 
    },
    { 
      title: 'Lightning Performance', 
      description: 'Optimized for speed with global CDN, intelligent caching, and sub-second response times across all features and integrations.',
      details: 'Built on modern cloud architecture with auto-scaling, load balancing, and edge computing to ensure consistent performance worldwide.',
      icon: '⚡' 
    },
    { 
      title: 'Smart Analytics', 
      description: 'AI-powered insights and real-time analytics help you understand your data and make informed decisions with predictive modeling.',
      details: 'Advanced reporting tools, custom dashboards, data visualization, and machine learning algorithms to identify trends and opportunities.',
      icon: '📊' 
    },
    { 
      title: 'Seamless Integrations', 
      description: 'Connect with 500+ tools and services through our robust API ecosystem and pre-built integrations for popular platforms.',
      details: 'REST and GraphQL APIs, webhooks, Zapier integration, and dedicated connectors for CRM, marketing, and productivity tools.',
      icon: '🔌' 
    },
    { 
      title: 'Team Collaboration', 
      description: 'Built-in collaboration tools including real-time editing, commenting, version control, and role-based access management.',
      details: 'Advanced permission systems, audit trails, team workspaces, and communication tools to keep everyone aligned and productive.',
      icon: '👥' 
    },
    { 
      title: '24/7 Expert Support', 
      description: 'Round-the-clock support from our expert team with multiple channels including chat, email, phone, and dedicated account managers.',
      details: 'Comprehensive documentation, video tutorials, webinar training, and premium onboarding services for enterprise customers.',
      icon: '🎧' 
    }
  ];

  return (
    <section className={`py-20 px-4 ${bgClasses[tone]}`}>
      <div className="max-w-4xl mx-auto">
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

        {/* Accordion */}
        <div className={`rounded-2xl overflow-hidden ${accordionClasses[tone]}`}>
          {features.map((feature: any, i: number) => {
            const isOpen = openItems.includes(i);
            
            return (
              <div key={i} className={i > 0 ? `border-t ${
                tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'border-gray-700' : 'border-gray-200'
              }` : ''}>
                {/* Accordion Button */}
                <button
                  onClick={() => toggleItem(i)}
                  className={`w-full px-6 lg:px-8 py-6 text-left transition-colors ${buttonHoverClasses[tone]} group`}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
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
                      }`}>
                        {feature.icon || '✨'}
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className={`text-xl font-bold mb-2 transition-colors group-hover:${iconClasses[tone]} ${textClasses[tone]}`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm lg:text-base ${
                          tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Chevron */}
                    <div className={`flex-shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <svg className={`w-6 h-6 ${iconClasses[tone]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Accordion Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className={`px-6 lg:px-8 pb-6 pl-20 lg:pl-24 ${
                    tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <p className="text-base leading-relaxed">
                      {feature.details || feature.description}
                    </p>
                  </div>
                </div>
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
              {(content.cta as any)?.label || 'Learn More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}