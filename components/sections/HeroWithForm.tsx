// components/sections/HeroWithForm.tsx
'use client';

import React, { useState } from 'react';
import type { SectionProps } from '@/types/section-system';

export function HeroWithForm({ tone = 'minimal', content = {} }: SectionProps) {
  const [email, setEmail] = useState('');
  
  const bgClasses = {
    minimal: 'bg-white',
    bold: 'bg-gradient-to-br from-gray-900 to-black',
    playful: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50',
    corporate: 'bg-gradient-to-br from-blue-50 to-gray-50',
    modern: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
    elegant: 'bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50',
    warm: 'bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50',
    luxury: 'bg-gradient-to-br from-black to-amber-950',
    creative: 'bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50',
    nature: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
    retro: 'bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50',
    monochrome: 'bg-white',
    techno: 'bg-gradient-to-br from-blue-950 via-cyan-900 to-blue-950',
    zen: 'bg-gradient-to-br from-stone-50 to-stone-100'
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

  const formClasses = {
    minimal: 'bg-gray-50 border-gray-200',
    bold: 'bg-gray-900 border-gray-700',
    playful: 'bg-white border-purple-200',
    corporate: 'bg-white border-blue-200',
    modern: 'bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm',
    elegant: 'bg-white border-amber-200',
    warm: 'bg-white border-orange-200',
    luxury: 'bg-amber-950/50 border-amber-500/30 backdrop-blur-sm',
    creative: 'bg-white border-fuchsia-200',
    nature: 'bg-white border-green-200',
    retro: 'bg-white border-pink-200',
    monochrome: 'bg-gray-50 border-gray-300',
    techno: 'bg-blue-950/50 border-blue-500/30 backdrop-blur-sm',
    zen: 'bg-stone-50 border-stone-200'
  };

  const inputClasses = {
    minimal: 'bg-white border-gray-300 text-gray-900',
    bold: 'bg-gray-800 border-gray-600 text-white',
    playful: 'bg-white border-purple-300 text-gray-900',
    corporate: 'bg-white border-gray-300 text-gray-900',
    modern: 'bg-slate-700/50 border-cyan-500/30 text-white placeholder-gray-400',
    elegant: 'bg-white border-amber-300 text-gray-900',
    warm: 'bg-white border-orange-300 text-gray-900',
    luxury: 'bg-amber-900/50 border-amber-500/30 text-white placeholder-amber-400',
    creative: 'bg-white border-fuchsia-300 text-gray-900',
    nature: 'bg-white border-green-300 text-gray-900',
    retro: 'bg-white border-pink-300 text-gray-900',
    monochrome: 'bg-white border-gray-400 text-gray-900',
    techno: 'bg-blue-900/50 border-blue-500/30 text-white placeholder-blue-400',
    zen: 'bg-white border-stone-300 text-gray-900'
  };

  const buttonClasses = {
    minimal: 'bg-black text-white hover:bg-gray-800',
    bold: 'bg-red-600 text-white hover:bg-red-700',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with email:', email);
  };

  return (
    <section className={`min-h-screen flex items-center px-4 py-20 ${bgClasses[tone]}`}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <div className={textClasses[tone]}>
            {content.eyebrow && (
              <p className={`text-sm uppercase tracking-wider mb-4 ${
                tone === 'bold' ? 'text-gray-400' :
                tone === 'modern' ? 'text-cyan-400' :
                tone === 'luxury' ? 'text-amber-400' :
                tone === 'techno' ? 'text-blue-400' :
                'text-gray-600'
              }`}>
{typeof content.eyebrow === 'string' ? content.eyebrow : 'Eyebrow'}
              </p>
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
                tone === 'corporate' ? 'text-gray-600' :
                tone === 'modern' ? 'text-gray-300' :
                tone === 'luxury' ? 'text-gray-300' :
                tone === 'techno' ? 'text-gray-300' :
                'text-gray-700'
              }`}>
{typeof content.subheadline === 'string' ? content.subheadline : 'Subheadline'}
              </p>
            )}

            {/* Feature List */}
            {content.features && (
              <ul className="space-y-3 mb-8">
{(Array.isArray(content.features) ? content.features as string[] : []).map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      tone === 'playful' ? 'text-purple-600' :
                      tone === 'corporate' ? 'text-blue-600' :
                      tone === 'modern' ? 'text-cyan-400' :
                      tone === 'elegant' ? 'text-amber-500' :
                      tone === 'luxury' ? 'text-amber-400' :
                      tone === 'creative' ? 'text-fuchsia-500' :
                      tone === 'nature' ? 'text-green-600' :
                      tone === 'techno' ? 'text-blue-400' :
                      'text-green-500'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={tone === 'bold' ? 'text-gray-300' : tone === 'modern' ? 'text-gray-300' : tone === 'luxury' ? 'text-gray-300' : tone === 'techno' ? 'text-gray-300' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Form Side */}
          <div className={`p-8 rounded-2xl border ${formClasses[tone]}`}>
            <h3 className={`text-2xl font-bold mb-2 ${textClasses[tone]}`}>
{typeof content.formTitle === 'string' ? content.formTitle : 'Start your free trial'}
            </h3>
            <p className={`mb-6 ${
              tone === 'bold' ? 'text-gray-400' :
              tone === 'modern' ? 'text-cyan-300' :
              tone === 'luxury' ? 'text-amber-300' :
              tone === 'techno' ? 'text-blue-300' :
              'text-gray-600'
            }`}>
{typeof content.formSubtitle === 'string' ? content.formSubtitle : 'No credit card required'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                  tone === 'bold' ? 'text-gray-300' :
                  tone === 'modern' ? 'text-cyan-300' :
                  tone === 'luxury' ? 'text-amber-300' :
                  tone === 'techno' ? 'text-blue-300' :
                  'text-gray-700'
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 ${inputClasses[tone]} ${
                    tone === 'playful' ? 'focus:ring-purple-500' :
                    tone === 'corporate' ? 'focus:ring-blue-500' :
                    tone === 'modern' ? 'focus:ring-cyan-500' :
                    tone === 'elegant' ? 'focus:ring-amber-500' :
                    tone === 'luxury' ? 'focus:ring-amber-500' :
                    tone === 'creative' ? 'focus:ring-fuchsia-500' :
                    tone === 'nature' ? 'focus:ring-green-500' :
                    tone === 'techno' ? 'focus:ring-blue-500' :
                    'focus:ring-gray-900'
                  }`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                  tone === 'bold' ? 'text-gray-300' :
                  tone === 'modern' ? 'text-cyan-300' :
                  tone === 'luxury' ? 'text-amber-300' :
                  tone === 'techno' ? 'text-blue-300' :
                  'text-gray-700'
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 ${inputClasses[tone]} ${
                    tone === 'playful' ? 'focus:ring-purple-500' :
                    tone === 'corporate' ? 'focus:ring-blue-500' :
                    tone === 'modern' ? 'focus:ring-cyan-500' :
                    tone === 'elegant' ? 'focus:ring-amber-500' :
                    tone === 'luxury' ? 'focus:ring-amber-500' :
                    tone === 'creative' ? 'focus:ring-fuchsia-500' :
                    tone === 'nature' ? 'focus:ring-green-500' :
                    tone === 'techno' ? 'focus:ring-blue-500' :
                    'focus:ring-gray-900'
                  }`}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="company" className={`block text-sm font-medium mb-2 ${
                  tone === 'bold' ? 'text-gray-300' :
                  tone === 'modern' ? 'text-cyan-300' :
                  tone === 'luxury' ? 'text-amber-300' :
                  tone === 'techno' ? 'text-blue-300' :
                  'text-gray-700'
                }`}>
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0 ${inputClasses[tone]} ${
                    tone === 'playful' ? 'focus:ring-purple-500' :
                    tone === 'corporate' ? 'focus:ring-blue-500' :
                    tone === 'modern' ? 'focus:ring-cyan-500' :
                    tone === 'elegant' ? 'focus:ring-amber-500' :
                    tone === 'luxury' ? 'focus:ring-amber-500' :
                    tone === 'creative' ? 'focus:ring-fuchsia-500' :
                    tone === 'nature' ? 'focus:ring-green-500' :
                    tone === 'techno' ? 'focus:ring-blue-500' :
                    'focus:ring-gray-900'
                  }`}
                  placeholder="Acme Inc."
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-lg font-semibold transition-colors ${buttonClasses[tone]}`}
              >
{typeof content.formCta === 'string' ? content.formCta : 'Get Started Free'}
              </button>

              <p className={`text-xs text-center ${
                tone === 'bold' ? 'text-gray-500' :
                tone === 'modern' ? 'text-gray-400' :
                tone === 'luxury' ? 'text-gray-400' :
                tone === 'techno' ? 'text-gray-400' :
                'text-gray-500'
              }`}>
                By signing up, you agree to our{' '}
                <a href="#" className="underline hover:no-underline">Terms</a> and{' '}
                <a href="#" className="underline hover:no-underline">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}