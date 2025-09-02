// components/sections/PricingComparison.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function PricingComparison({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Compare Plans';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Find the perfect plan for your needs.';
  
  const defaultComparison = {
    plans: ['Starter', 'Professional', 'Enterprise'],
    prices: ['$9/mo', '$29/mo', 'Custom'],
    features: [
      { name: 'Projects', values: ['5', 'Unlimited', 'Unlimited'] },
      { name: 'Users', values: ['1', '10', 'Unlimited'] },
      { name: 'Storage', values: ['10GB', '100GB', 'Unlimited'] },
      { name: 'Support', values: ['Basic', 'Priority', 'Dedicated'] },
      { name: 'Analytics', values: [false, true, true] },
      { name: 'API Access', values: [false, true, true] },
      { name: 'Custom Domain', values: [false, true, true] },
      { name: 'SSO', values: [false, false, true] },
      { name: 'Audit Logs', values: [false, false, true] },
      { name: 'SLA', values: [false, false, true] }
    ],
    recommended: 1 // Index of recommended plan
  };

  const comparison = (typeof content?.comparison === 'object' && 
    content.comparison && 
    !Array.isArray(content.comparison) &&
    'plans' in content.comparison)
    ? content.comparison as any
    : defaultComparison;

  const headerColors = {
    minimal: 'bg-gray-100 text-gray-900',
    bold: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    playful: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    corporate: 'bg-blue-900 text-white',
    elegant: 'bg-gradient-to-r from-amber-600 to-rose-600 text-white',
    modern: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
    warm: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    luxury: 'bg-black text-white',
    creative: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white',
    nature: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
    retro: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white',
    monochrome: 'bg-zinc-800 text-white',
    techno: 'bg-gradient-to-r from-blue-900 to-cyan-900 text-white',
    zen: 'bg-stone-700 text-white'
  };

  const headerColor = tone && headerColors[tone] ? headerColors[tone] : headerColors.minimal;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-white"></th>
                {comparison.plans.map((plan: string, i: number) => (
                  <th key={i} className={`p-4 text-center ${headerColor} ${i === comparison.recommended ? 'relative' : ''}`}>
                    {i === comparison.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                          Recommended
                        </span>
                      </div>
                    )}
                    <div className="pt-2">
                      <div className="text-xl font-bold mb-2">{plan}</div>
                      <div className="text-2xl font-bold">{comparison.prices[i]}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.features.map((feature: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4 font-medium text-gray-700">{feature.name}</td>
                  {feature.values.map((value: any, j: number) => (
                    <td key={j} className="p-4 text-center">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="text-gray-700">{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4"></td>
                {comparison.plans.map((_: any, i: number) => (
                  <td key={i} className="p-4 text-center">
                    <button className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      i === comparison.recommended
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      Get Started
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}