// components/sections/FAQGrid.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function FAQGrid({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Common Questions';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Quick answers to help you get started.';
  
  const defaultFaqs = [
    {
      question: 'What is included?',
      answer: 'Everything you need to succeed: tools, resources, support, and regular updates.',
      icon: '📦'
    },
    {
      question: 'How fast is setup?',
      answer: 'Get up and running in under 5 minutes with our guided setup process.',
      icon: '⚡'
    },
    {
      question: 'Is it scalable?',
      answer: 'Built to grow with you from startup to enterprise scale.',
      icon: '📈'
    },
    {
      question: 'What about security?',
      answer: 'Enterprise-grade security with encryption, compliance, and regular audits.',
      icon: '🔒'
    },
    {
      question: 'Can I customize it?',
      answer: 'Fully customizable to match your brand and workflow needs.',
      icon: '🎨'
    },
    {
      question: 'Is support included?',
      answer: '24/7 support via chat, email, and phone for all paid plans.',
      icon: '💬'
    }
  ];

  const faqs = Array.isArray(content?.faqs) ? content.faqs : defaultFaqs;

  const cardStyles = {
    minimal: 'bg-white border border-gray-200',
    bold: 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200',
    playful: 'bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-300 rounded-2xl',
    corporate: 'bg-gray-50 border border-gray-300',
    elegant: 'bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200',
    modern: 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200',
    warm: 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200',
    luxury: 'bg-black text-white border border-yellow-600',
    creative: 'bg-gradient-to-br from-fuchsia-50 to-purple-50 border-2 border-fuchsia-300',
    nature: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300',
    retro: 'bg-gradient-to-br from-pink-100 to-orange-100 border-2 border-pink-400',
    monochrome: 'bg-zinc-100 border border-zinc-400',
    techno: 'bg-gray-900 text-white border border-cyan-400',
    zen: 'bg-stone-50 border border-stone-300'
  };

  const cardStyle = tone && cardStyles[tone] ? cardStyles[tone] : cardStyles.minimal;
  const isDark = tone === 'luxury' || tone === 'techno';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faqs.map((faq: any, i: number) => (
            <div
              key={i}
              className={`${cardStyle} rounded-lg p-6 hover:shadow-lg transition-shadow`}
            >
              {faq.icon && (
                <div className="text-3xl mb-4">{faq.icon}</div>
              )}
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {faq.question}
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Optional CTA */}
        <div className="text-center mt-12">
          <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}