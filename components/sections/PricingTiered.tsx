// components/sections/PricingTiered.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function PricingTiered({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Choose Your Plan';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Simple, transparent pricing that scales with your needs.';
  
  const defaultPlans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals and small projects',
      features: [
        '5 Projects',
        '1 User',
        'Basic Support',
        '10GB Storage',
        'SSL Certificate'
      ],
      cta: 'Start Free Trial',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing teams and businesses',
      features: [
        'Unlimited Projects',
        '10 Users',
        'Priority Support',
        '100GB Storage',
        'Advanced Analytics',
        'API Access',
        'Custom Domain'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with specific needs',
      features: [
        'Unlimited Everything',
        'Unlimited Users',
        'Dedicated Support',
        'Unlimited Storage',
        'Advanced Security',
        'Custom Integrations',
        'SLA Guarantee',
        'Training & Onboarding'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const plans = Array.isArray(content?.plans) ? content.plans : defaultPlans;

  const cardStyles = {
    minimal: {
      normal: 'bg-white border border-gray-200',
      highlighted: 'bg-gray-900 text-white border-2 border-gray-900 transform scale-105'
    },
    bold: {
      normal: 'bg-white border-2 border-purple-200',
      highlighted: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-2 border-purple-600 transform scale-105'
    },
    playful: {
      normal: 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200',
      highlighted: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-2 border-blue-500 transform scale-105'
    },
    corporate: {
      normal: 'bg-white border border-gray-300',
      highlighted: 'bg-blue-900 text-white border-2 border-blue-900 transform scale-105'
    },
    elegant: {
      normal: 'bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200',
      highlighted: 'bg-gradient-to-br from-amber-600 to-rose-600 text-white border-2 border-amber-600 transform scale-105'
    },
    modern: {
      normal: 'bg-white border border-cyan-200',
      highlighted: 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white border-2 border-cyan-600 transform scale-105'
    },
    warm: {
      normal: 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200',
      highlighted: 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-2 border-orange-500 transform scale-105'
    },
    luxury: {
      normal: 'bg-white border border-gray-300',
      highlighted: 'bg-black text-white border-2 border-yellow-600 transform scale-105'
    },
    creative: {
      normal: 'bg-gradient-to-br from-fuchsia-50 to-purple-50 border-2 border-fuchsia-200',
      highlighted: 'bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white border-2 border-fuchsia-600 transform scale-105'
    },
    nature: {
      normal: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
      highlighted: 'bg-gradient-to-br from-green-600 to-emerald-600 text-white border-2 border-green-600 transform scale-105'
    },
    retro: {
      normal: 'bg-gradient-to-br from-pink-100 to-orange-100 border-2 border-pink-300',
      highlighted: 'bg-gradient-to-br from-pink-500 to-orange-500 text-white border-2 border-pink-500 transform scale-105'
    },
    monochrome: {
      normal: 'bg-white border border-zinc-300',
      highlighted: 'bg-zinc-900 text-white border-2 border-zinc-900 transform scale-105'
    },
    techno: {
      normal: 'bg-gray-900 text-white border border-cyan-400',
      highlighted: 'bg-gradient-to-br from-blue-900 to-cyan-900 text-white border-2 border-cyan-400 transform scale-105 shadow-cyan-400/50'
    },
    zen: {
      normal: 'bg-stone-50 border border-stone-300',
      highlighted: 'bg-stone-800 text-white border-2 border-stone-800 transform scale-105'
    }
  };

  const styles = tone && cardStyles[tone] ? cardStyles[tone] : cardStyles.minimal;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan: any, i: number) => {
            const isHighlighted = plan.highlighted;
            const cardStyle = isHighlighted ? styles.highlighted : styles.normal;
            const isDark = isHighlighted || tone === 'techno';
            
            return (
              <div key={i} className={`${cardStyle} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all`}>
                {isHighlighted && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-sm rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature: string, j: number) => (
                    <li key={j} className="flex items-start">
                      <svg className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isHighlighted 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : tone === 'techno'
                    ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}