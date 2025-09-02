// components/sections/FAQAccordion.tsx
'use client';

import React, { useState } from 'react';
import type { SectionProps } from '@/types/section-system';

export function FAQAccordion({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Frequently Asked Questions';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Everything you need to know about our product.';
  
  const defaultFaqs = [
    {
      question: 'How do I get started?',
      answer: 'Getting started is easy! Simply sign up for a free account, choose your plan, and follow our onboarding guide to set up your first project.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial on all plans. No credit card required to start your trial.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We take security seriously. All data is encrypted at rest and in transit, and we comply with SOC 2, GDPR, and CCPA standards.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! We provide email support for all plans, with priority support for Professional plans and dedicated support for Enterprise.'
    }
  ];

  const faqs = Array.isArray(content?.faqs) ? content.faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const accordionStyles = {
    minimal: {
      bg: 'bg-white',
      border: 'border border-gray-200',
      hover: 'hover:border-gray-300'
    },
    bold: {
      bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
      border: 'border-2 border-purple-200',
      hover: 'hover:border-purple-400'
    },
    playful: {
      bg: 'bg-gradient-to-r from-blue-50 to-green-50',
      border: 'border-2 border-blue-300 rounded-2xl',
      hover: 'hover:border-blue-400'
    },
    corporate: {
      bg: 'bg-gray-50',
      border: 'border border-gray-300',
      hover: 'hover:border-blue-500'
    },
    elegant: {
      bg: 'bg-gradient-to-r from-amber-50 to-rose-50',
      border: 'border border-amber-200',
      hover: 'hover:border-amber-400'
    },
    modern: {
      bg: 'bg-gradient-to-r from-cyan-50 to-blue-50',
      border: 'border border-cyan-200',
      hover: 'hover:border-cyan-400'
    },
    warm: {
      bg: 'bg-gradient-to-r from-orange-50 to-red-50',
      border: 'border border-orange-200',
      hover: 'hover:border-orange-400'
    },
    luxury: {
      bg: 'bg-black text-white',
      border: 'border border-yellow-600',
      hover: 'hover:border-yellow-500'
    },
    creative: {
      bg: 'bg-gradient-to-r from-fuchsia-50 to-purple-50',
      border: 'border-2 border-fuchsia-300',
      hover: 'hover:border-fuchsia-400'
    },
    nature: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border border-green-300',
      hover: 'hover:border-green-400'
    },
    retro: {
      bg: 'bg-gradient-to-r from-pink-100 to-orange-100',
      border: 'border-2 border-pink-400',
      hover: 'hover:border-pink-500'
    },
    monochrome: {
      bg: 'bg-zinc-100',
      border: 'border border-zinc-400',
      hover: 'hover:border-zinc-500'
    },
    techno: {
      bg: 'bg-gray-900 text-white',
      border: 'border border-cyan-400',
      hover: 'hover:border-cyan-300 hover:shadow-cyan-400/20'
    },
    zen: {
      bg: 'bg-stone-50',
      border: 'border border-stone-300',
      hover: 'hover:border-stone-400'
    }
  };

  const style = tone && accordionStyles[tone] ? accordionStyles[tone] : accordionStyles.minimal;
  const isDark = tone === 'luxury' || tone === 'techno';

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            
            return (
              <div
                key={i}
                className={`${style.bg} ${style.border} ${style.hover} rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    } ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div
                  className={`transition-all duration-200 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className={`px-6 pb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}