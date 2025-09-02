// components/sections/FeaturesComparison.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function FeaturesComparison({ tone = 'minimal', content = {} }: SectionProps) {
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

  const cardClasses = {
    minimal: 'bg-white border border-gray-200 shadow-sm',
    bold: 'bg-gray-800 border border-gray-700',
    playful: 'bg-white border border-purple-200 shadow-lg',
    corporate: 'bg-white border border-gray-200 shadow-sm',
    modern: 'bg-gray-800/50 border border-cyan-500/20 backdrop-blur-sm',
    elegant: 'bg-white border border-amber-200/50 shadow-sm',
    warm: 'bg-white border border-orange-200 shadow-sm',
    luxury: 'bg-gray-800/50 border border-amber-500/20',
    creative: 'bg-white border border-pink-200 shadow-lg',
    nature: 'bg-white border border-green-200 shadow-sm',
    retro: 'bg-white border border-yellow-300 shadow-sm',
    monochrome: 'bg-white border border-gray-300 shadow-sm',
    techno: 'bg-gray-900/50 border border-blue-500/20 backdrop-blur-sm',
    zen: 'bg-white border border-stone-200 shadow-sm'
  };

  const highlightClasses = {
    minimal: 'bg-gray-900 text-white',
    bold: 'bg-red-600 text-white',
    playful: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    corporate: 'bg-blue-600 text-white',
    modern: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
    elegant: 'bg-amber-600 text-white',
    warm: 'bg-orange-600 text-white',
    luxury: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black',
    creative: 'bg-gradient-to-r from-pink-500 to-violet-500 text-white',
    nature: 'bg-green-600 text-white',
    retro: 'bg-yellow-500 text-black',
    monochrome: 'bg-gray-800 text-white',
    techno: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    zen: 'bg-stone-600 text-white'
  };

  // Default comparison data
  const plans = (Array.isArray(content.plans) ? content.plans : []) || [
    {
      name: 'Basic',
      price: '$9',
      period: 'month',
      description: 'Perfect for getting started',
      highlighted: false,
      features: [
        { name: 'Users', value: '5' },
        { name: 'Storage', value: '10 GB' },
        { name: 'Support', value: 'Email' },
        { name: 'Analytics', value: 'Basic' },
        { name: 'API Access', value: false },
        { name: 'Custom Domain', value: false }
      ]
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'month',
      description: 'Best for growing teams',
      highlighted: true,
      features: [
        { name: 'Users', value: '25' },
        { name: 'Storage', value: '100 GB' },
        { name: 'Support', value: 'Priority' },
        { name: 'Analytics', value: 'Advanced' },
        { name: 'API Access', value: true },
        { name: 'Custom Domain', value: true }
      ]
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      description: 'For large organizations',
      highlighted: false,
      features: [
        { name: 'Users', value: 'Unlimited' },
        { name: 'Storage', value: '1 TB' },
        { name: 'Support', value: '24/7 Phone' },
        { name: 'Analytics', value: 'Custom' },
        { name: 'API Access', value: true },
        { name: 'Custom Domain', value: true }
      ]
    }
  ];

  const renderFeatureValue = (feature: any) => {
    if (typeof feature.value === 'boolean') {
      return feature.value ? (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    return <span className="font-medium">{feature.value}</span>;
  };

  return (
    <section className={`py-20 px-4 ${bgClasses[tone]}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {content.headline && (
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${textClasses[tone]}`}>
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

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan: any, i: number) => (
            <div key={i} className={`relative rounded-2xl p-8 ${
              plan.highlighted ? highlightClasses[tone] : cardClasses[tone]
            }`}>
              {plan.highlighted && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${
                  tone === 'minimal' ? 'bg-blue-600 text-white' :
                  tone === 'bold' ? 'bg-yellow-400 text-black' :
                  tone === 'playful' ? 'bg-white text-purple-600' :
                  tone === 'corporate' ? 'bg-white text-blue-600' :
                  tone === 'modern' ? 'bg-white text-cyan-600' :
                  'bg-white text-gray-900'
                }`}>
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.highlighted ? (tone === 'luxury' || tone === 'retro' ? 'text-black' : 'text-white') : textClasses[tone]
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  plan.highlighted 
                    ? (tone === 'luxury' || tone === 'retro' ? 'text-black/70' : 'text-white/80')
                    : (tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-300' : 'text-gray-600')
                }`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className={`text-4xl font-bold ${
                    plan.highlighted ? (tone === 'luxury' || tone === 'retro' ? 'text-black' : 'text-white') : textClasses[tone]
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${
                    plan.highlighted 
                      ? (tone === 'luxury' || tone === 'retro' ? 'text-black/70' : 'text-white/70')
                      : (tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    /{plan.period}
                  </span>
                </div>
              </div>

              <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                plan.highlighted 
                  ? (tone === 'luxury' || tone === 'retro' 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-white text-gray-900 hover:bg-gray-100')
                  : `${highlightClasses[tone]} hover:opacity-90`
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className={`rounded-2xl overflow-hidden ${cardClasses[tone]}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                  <th className={`text-left p-6 font-semibold ${textClasses[tone]}`}>
                    Features
                  </th>
                  {plans.map((plan: any, i: number) => (
                    <th key={i} className={`text-center p-6 font-semibold ${textClasses[tone]}`}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(plans[0] as any).features.map((_: any, featureIndex: number) => (
                  <tr key={featureIndex} className={`border-t ${
                    tone === 'bold' || tone === 'luxury' || tone === 'modern' || tone === 'techno' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className={`p-6 font-medium ${textClasses[tone]}`}>
                      {(plans[0] as any).features[featureIndex].name}
                    </td>
                    {plans.map((plan: any, planIndex: number) => (
                      <td key={planIndex} className="p-6 text-center">
                        {renderFeatureValue((plan as any).features[featureIndex])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}