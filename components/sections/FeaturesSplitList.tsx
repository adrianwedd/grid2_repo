// components/sections/FeaturesSplitList.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function FeaturesSplitList({ tone = 'minimal', content = {} }: SectionProps) {
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

  const imageClasses = {
    minimal: 'border border-gray-200 shadow-lg',
    bold: 'border border-gray-700 shadow-2xl',
    playful: 'border border-purple-200 shadow-lg shadow-purple-100',
    corporate: 'border border-gray-200 shadow-lg',
    modern: 'border border-cyan-500/20 shadow-2xl shadow-cyan-500/10',
    elegant: 'border border-amber-200/50 shadow-lg shadow-amber-100/50',
    warm: 'border border-orange-200 shadow-lg shadow-orange-100',
    luxury: 'border border-amber-500/20 shadow-2xl shadow-amber-500/10',
    creative: 'border border-pink-200 shadow-lg shadow-pink-100',
    nature: 'border border-green-200 shadow-lg shadow-green-100',
    retro: 'border border-yellow-300 shadow-lg shadow-yellow-100',
    monochrome: 'border border-gray-300 shadow-xl',
    techno: 'border border-blue-500/20 shadow-2xl shadow-blue-500/10',
    zen: 'border border-stone-200 shadow-lg shadow-stone-100'
  };

  // Default features if none provided
  const features = (Array.isArray(content.features) ? content.features : []) || [
    { 
      title: 'Advanced Analytics', 
      description: 'Get deep insights into your data with real-time analytics, custom dashboards, and AI-powered recommendations that help you make informed decisions.',
      icon: '📊' 
    },
    { 
      title: 'Seamless Integration', 
      description: 'Connect with over 500+ tools and platforms through our robust API ecosystem. Set up integrations in minutes, not hours.',
      icon: '🔌' 
    },
    { 
      title: 'Enterprise Security', 
      description: 'Bank-grade security with end-to-end encryption, multi-factor authentication, and compliance with SOC 2, GDPR, and HIPAA standards.',
      icon: '🔒' 
    },
    { 
      title: 'Global Performance', 
      description: 'Lightning-fast load times worldwide with our global CDN network, intelligent caching, and edge computing infrastructure.',
      icon: '⚡' 
    },
    { 
      title: 'Smart Automation', 
      description: 'Automate repetitive tasks with intelligent workflows, custom triggers, and machine learning that adapts to your business patterns.',
      icon: '🤖' 
    },
    { 
      title: '24/7 Expert Support', 
      description: 'Get help when you need it with our dedicated support team, comprehensive documentation, and premium onboarding services.',
      icon: '🎧' 
    }
  ];

  // Default image/content for the right side
  const rightContent = (content.image as any) || (content.rightContent as any) || {
    type: 'stats',
    stats: [
      { value: '99.9%', label: 'Uptime Guarantee', icon: '🎯' },
      { value: '500+', label: 'Integrations Available', icon: '🔌' },
      { value: '<100ms', label: 'Average Response Time', icon: '⚡' },
      { value: '24/7', label: 'Expert Support', icon: '🎧' }
    ]
  };

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

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Features List */}
          <div className="space-y-8">
            {features.map((feature: any, i: number) => (
              <div key={i} className="flex gap-4 group">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 ${
                  tone === 'minimal' ? 'bg-gray-100 group-hover:bg-gray-200' :
                  tone === 'bold' ? 'bg-gray-800 group-hover:bg-gray-700' :
                  tone === 'playful' ? 'bg-purple-100 group-hover:bg-purple-200' :
                  tone === 'corporate' ? 'bg-blue-100 group-hover:bg-blue-200' :
                  tone === 'modern' ? 'bg-gray-800 border border-cyan-500/20 group-hover:border-cyan-400/40' :
                  tone === 'elegant' ? 'bg-amber-50 group-hover:bg-amber-100' :
                  tone === 'warm' ? 'bg-orange-100 group-hover:bg-orange-200' :
                  tone === 'luxury' ? 'bg-gray-800 group-hover:bg-gray-700' :
                  tone === 'creative' ? 'bg-pink-100 group-hover:bg-pink-200' :
                  tone === 'nature' ? 'bg-green-100 group-hover:bg-green-200' :
                  tone === 'retro' ? 'bg-yellow-100 group-hover:bg-yellow-200' :
                  tone === 'monochrome' ? 'bg-gray-200 group-hover:bg-gray-300' :
                  tone === 'techno' ? 'bg-blue-900/50 border border-blue-400/20 group-hover:border-blue-300/40' :
                  'bg-stone-100 group-hover:bg-stone-200'
                }`}>
                  {feature.icon || '✨'}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-3 transition-colors group-hover:${iconClasses[tone]} ${textClasses[tone]}`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Image or Stats */}
          <div className="lg:sticky lg:top-8">
            {rightContent.type === 'image' ? (
              <div className={`rounded-2xl overflow-hidden ${imageClasses[tone]}`}>
                <img 
                  src={rightContent.src || '/api/placeholder/600/400'}
                  alt={rightContent.alt || 'Features illustration'}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : rightContent.type === 'stats' ? (
              <div className={`rounded-2xl p-8 lg:p-10 ${
                tone === 'minimal' ? 'bg-gray-50 border border-gray-200' :
                tone === 'bold' ? 'bg-gray-800 border border-gray-700' :
                tone === 'playful' ? 'bg-white border border-purple-200 shadow-lg' :
                tone === 'corporate' ? 'bg-white border border-gray-200 shadow-sm' :
                tone === 'modern' ? 'bg-gray-800/50 border border-cyan-500/20 backdrop-blur-sm' :
                tone === 'elegant' ? 'bg-white border border-amber-200/50 shadow-sm' :
                tone === 'warm' ? 'bg-white border border-orange-200 shadow-sm' :
                tone === 'luxury' ? 'bg-gray-800/50 border border-amber-500/20' :
                tone === 'creative' ? 'bg-white border border-pink-200 shadow-lg' :
                tone === 'nature' ? 'bg-white border border-green-200 shadow-sm' :
                tone === 'retro' ? 'bg-white border border-yellow-300 shadow-sm' :
                tone === 'monochrome' ? 'bg-white border border-gray-300 shadow-sm' :
                tone === 'techno' ? 'bg-gray-900/50 border border-blue-500/20 backdrop-blur-sm' :
                'bg-white border border-stone-200 shadow-sm'
              }`}>
                <div className="grid grid-cols-2 gap-8">
                  {rightContent.stats?.map((stat: any, i: number) => (
                    <div key={i} className="text-center">
                      <div className={`text-2xl mb-2 ${iconClasses[tone]}`}>
                        {stat.icon}
                      </div>
                      <div className={`text-3xl lg:text-4xl font-bold mb-2 ${
                        tone === 'playful' ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' :
                        tone === 'modern' ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent' :
                        tone === 'luxury' ? 'bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent' :
                        tone === 'creative' ? 'bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent' :
                        tone === 'techno' ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent' :
                        textClasses[tone]
                      }`}>
                        {stat.value}
                      </div>
                      <p className={`text-sm font-medium ${
                        tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Default content box
              <div className={`rounded-2xl p-8 lg:p-10 text-center ${
                tone === 'minimal' ? 'bg-gray-50 border border-gray-200' :
                tone === 'bold' ? 'bg-gray-800 border border-gray-700' :
                tone === 'playful' ? 'bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200' :
                tone === 'corporate' ? 'bg-blue-50 border border-blue-200' :
                tone === 'modern' ? 'bg-gray-800/50 border border-cyan-500/20 backdrop-blur-sm' :
                tone === 'elegant' ? 'bg-amber-50 border border-amber-200' :
                tone === 'warm' ? 'bg-orange-50 border border-orange-200' :
                tone === 'luxury' ? 'bg-gray-800/50 border border-amber-500/20' :
                tone === 'creative' ? 'bg-gradient-to-br from-pink-100 to-violet-100 border border-pink-200' :
                tone === 'nature' ? 'bg-green-50 border border-green-200' :
                tone === 'retro' ? 'bg-yellow-50 border border-yellow-300' :
                tone === 'monochrome' ? 'bg-gray-50 border border-gray-300' :
                tone === 'techno' ? 'bg-gray-900/50 border border-blue-500/20 backdrop-blur-sm' :
                'bg-stone-50 border border-stone-200'
              }`}>
                <div className={`text-6xl mb-6 ${iconClasses[tone]}`}>
                  🚀
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${textClasses[tone]}`}>
                  Ready to Get Started?
                </h3>
                <p className={`text-lg mb-6 ${
                  tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Join thousands of teams already using our platform to build better products faster.
                </p>
                <button className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  tone === 'minimal' ? 'bg-gray-900 text-white hover:bg-gray-800' :
                  tone === 'bold' ? 'bg-red-600 text-white hover:bg-red-700' :
                  tone === 'playful' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' :
                  tone === 'corporate' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                  tone === 'modern' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400' :
                  tone === 'elegant' ? 'bg-amber-600 text-white hover:bg-amber-700' :
                  tone === 'warm' ? 'bg-orange-600 text-white hover:bg-orange-700' :
                  tone === 'luxury' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400' :
                  tone === 'creative' ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-400 hover:to-violet-400' :
                  tone === 'nature' ? 'bg-green-600 text-white hover:bg-green-700' :
                  tone === 'retro' ? 'bg-yellow-500 text-black hover:bg-yellow-400' :
                  tone === 'monochrome' ? 'bg-gray-800 text-white hover:bg-gray-700' :
                  tone === 'techno' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-400 hover:to-cyan-400' :
                  'bg-stone-600 text-white hover:bg-stone-700'
                }`}>
                  Get Started Free
                </button>
              </div>
            )}
          </div>
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
              {(content.cta as any)?.label || 'Explore All Features'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}