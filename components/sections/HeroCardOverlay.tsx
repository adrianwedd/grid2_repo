// components/sections/HeroCardOverlay.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroCardOverlay({ tone = 'minimal', content = {} }: SectionProps) {
  const bgClasses = {
    minimal: 'bg-gray-100',
    bold: 'bg-black',
    playful: 'bg-gradient-to-br from-purple-100 to-pink-100',
    corporate: 'bg-gradient-to-br from-blue-900 to-blue-800',
    modern: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
    elegant: 'bg-gradient-to-br from-amber-100 to-rose-100',
    warm: 'bg-gradient-to-br from-orange-100 to-red-100',
    luxury: 'bg-gradient-to-br from-black to-amber-950',
    creative: 'bg-gradient-to-br from-fuchsia-100 to-purple-100',
    nature: 'bg-gradient-to-br from-green-100 to-emerald-100',
    retro: 'bg-gradient-to-br from-pink-100 to-orange-100',
    monochrome: 'bg-gray-200',
    techno: 'bg-gradient-to-br from-blue-950 to-cyan-900',
    zen: 'bg-gradient-to-br from-stone-100 to-stone-200'
  };

  const cardClasses = {
    minimal: 'bg-white shadow-xl',
    bold: 'bg-gradient-to-br from-red-600 to-orange-600 shadow-2xl',
    playful: 'bg-white shadow-xl border-2 border-purple-200',
    corporate: 'bg-white shadow-xl',
    modern: 'bg-gradient-to-br from-slate-800 to-gray-800 shadow-2xl shadow-cyan-500/20 border border-cyan-500/20',
    elegant: 'bg-gradient-to-br from-amber-600 to-rose-600 shadow-2xl',
    warm: 'bg-gradient-to-br from-orange-600 to-red-600 shadow-2xl',
    luxury: 'bg-gradient-to-br from-amber-900 to-yellow-800 shadow-2xl shadow-amber-500/20',
    creative: 'bg-gradient-to-br from-fuchsia-600 to-purple-600 shadow-2xl',
    nature: 'bg-gradient-to-br from-green-600 to-emerald-600 shadow-2xl',
    retro: 'bg-gradient-to-br from-pink-600 to-orange-600 shadow-2xl',
    monochrome: 'bg-white shadow-xl border-2 border-gray-300',
    techno: 'bg-gradient-to-br from-blue-800 to-cyan-800 shadow-2xl shadow-blue-500/20 border border-blue-500/20',
    zen: 'bg-white shadow-xl border-2 border-stone-200'
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

  const buttonClasses = {
    minimal: 'bg-black text-white hover:bg-gray-800',
    bold: 'bg-white text-red-600 hover:bg-gray-100',
    playful: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    corporate: 'bg-blue-600 text-white hover:bg-blue-700',
    modern: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25',
    elegant: 'bg-gradient-to-r from-amber-600 to-rose-600 text-white hover:from-amber-700 hover:to-rose-700',
    warm: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600',
    luxury: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600',
    creative: 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:from-fuchsia-600 hover:to-purple-600',
    nature: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600',
    retro: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600',
    monochrome: 'bg-black text-white hover:bg-gray-800',
    techno: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 shadow-lg shadow-blue-500/25',
    zen: 'bg-gradient-to-r from-stone-500 to-stone-600 text-white hover:from-stone-600 hover:to-stone-700'
  };

  const statsClasses = {
    minimal: 'text-gray-600',
    bold: 'text-white/80',
    playful: 'text-purple-600',
    corporate: 'text-gray-600',
    modern: 'text-cyan-400',
    elegant: 'text-amber-600',
    warm: 'text-orange-600',
    luxury: 'text-amber-400',
    creative: 'text-fuchsia-600',
    nature: 'text-green-600',
    retro: 'text-pink-600',
    monochrome: 'text-gray-800',
    techno: 'text-blue-400',
    zen: 'text-stone-600'
  };

  // Placeholder image
  const imageUrl = (typeof content.imageUrl === 'string' ? content.imageUrl : null) || 
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop';

  return (
    <section className={`relative min-h-screen flex items-center px-4 py-20 overflow-hidden ${bgClasses[tone]}`}>
      {/* Background Pattern */}
      {tone === 'corporate' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div className={`${tone === 'corporate' ? 'text-white' : tone === 'modern' ? 'text-white' : tone === 'luxury' ? 'text-white' : tone === 'techno' ? 'text-white' : textClasses[tone]}`}>
            {content.badge && (
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
                tone === 'minimal' ? 'bg-gray-200 text-gray-700' :
                tone === 'bold' ? 'bg-gray-900 text-gray-300' :
                tone === 'playful' ? 'bg-purple-100 text-purple-700' :
                tone === 'modern' ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-300 border border-cyan-500/30' :
                tone === 'elegant' ? 'bg-gradient-to-r from-amber-100 to-rose-100 text-amber-800' :
                tone === 'luxury' ? 'bg-gradient-to-r from-amber-900/50 to-yellow-900/50 text-amber-300 border border-amber-500/30' :
                tone === 'creative' ? 'bg-gradient-to-r from-fuchsia-100 to-purple-100 text-fuchsia-700' :
                tone === 'nature' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
                tone === 'techno' ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 text-blue-300 border border-blue-500/30' :
                'bg-blue-100 text-blue-700'
              }`}>
{typeof content.badge === 'string' ? content.badge : 'Badge'}
              </span>
            )}
            
            {content.headline && (
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                tone === 'playful' ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' :
                tone === 'modern' ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' :
                tone === 'elegant' ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent' :
                tone === 'creative' ? 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent' :
                tone === 'techno' ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent' : ''
              }`}>
{typeof content.headline === 'string' ? content.headline : 'Headline'}
              </h1>
            )}
            
            {content.subheadline && (
              <p className={`text-xl mb-8 ${
                tone === 'minimal' ? 'text-gray-600' :
                tone === 'bold' ? 'text-gray-300' :
                tone === 'corporate' ? 'text-blue-100' :
                tone === 'modern' ? 'text-gray-300' :
                tone === 'luxury' ? 'text-gray-300' :
                tone === 'techno' ? 'text-gray-300' :
                'text-gray-700'
              }`}>
{typeof content.subheadline === 'string' ? content.subheadline : 'Subheadline'}
              </p>
            )}

            {content.primaryCta && (
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className={`px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${buttonClasses[tone]}`}>
{(content.primaryCta && typeof content.primaryCta === 'object' && 'label' in content.primaryCta) ? (content.primaryCta as any).label : 'Get Started'}
                </button>
                {content.secondaryCta && (
                  <button className={`px-8 py-4 rounded-lg font-semibold border-2 transition-all transform hover:scale-105 ${
                    tone === 'corporate' ? 'border-white text-white hover:bg-white hover:text-blue-900' :
                    tone === 'bold' ? 'border-gray-600 text-gray-300 hover:border-gray-400' :
                    tone === 'modern' ? 'border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:bg-cyan-500/10' :
                    tone === 'luxury' ? 'border-amber-400/50 hover:border-amber-400 text-amber-300 hover:bg-amber-500/10' :
                    tone === 'techno' ? 'border-blue-400/50 hover:border-blue-400 text-blue-300 hover:bg-blue-500/10' :
                    'border-gray-300 hover:border-gray-400'
                  }`}>
{(content.secondaryCta && typeof content.secondaryCta === 'object' && 'label' in content.secondaryCta) ? (content.secondaryCta as any).label : 'Learn More'}
                  </button>
                )}
              </div>
            )}

            {/* Stats */}
            {content.stats && (
              <div className="grid grid-cols-3 gap-6">
{(Array.isArray(content.stats) ? content.stats as any[] : []).map((stat: any, i: number) => (
                  <div key={i}>
                    <div className={`text-3xl font-bold mb-1 ${
                      tone === 'corporate' ? 'text-white' :
                      tone === 'modern' ? 'text-white' :
                      tone === 'luxury' ? 'text-white' :
                      tone === 'techno' ? 'text-white' : textClasses[tone]
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${statsClasses[tone]}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Side */}
          <div className={`relative rounded-2xl overflow-hidden ${cardClasses[tone]}`}>
            {tone === 'bold' || tone === 'modern' || tone === 'elegant' || tone === 'warm' || tone === 'luxury' || tone === 'creative' || tone === 'nature' || tone === 'retro' || tone === 'techno' ? (
              <div className="p-8 lg:p-12">
                <h3 className={`text-3xl font-bold mb-4 ${
                  tone === 'modern' ? 'text-cyan-300' :
                  tone === 'luxury' ? 'text-amber-300' :
                  tone === 'techno' ? 'text-blue-300' :
                  'text-white'
                }`}>
{typeof content.cardTitle === 'string' ? content.cardTitle : 'Premium Features'}
                </h3>
                <ul className={`space-y-4 ${
                  tone === 'modern' ? 'text-cyan-100' :
                  tone === 'luxury' ? 'text-amber-100' :
                  tone === 'techno' ? 'text-blue-100' :
                  'text-white/90'
                }`}>
{(Array.isArray(content.cardFeatures) ? content.cardFeatures as string[] : ['Feature 1', 'Feature 2', 'Feature 3']).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <img
                  src={imageUrl}
                  alt="Hero visual"
                  className="w-full h-full object-cover"
                />
                {content.cardOverlay && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-lg font-medium">
{typeof content.cardOverlay === 'string' ? content.cardOverlay : 'Overlay text'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}