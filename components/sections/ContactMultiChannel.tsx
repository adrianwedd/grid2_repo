// components/sections/ContactMultiChannel.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function ContactMultiChannel({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Choose Your Preferred Channel';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Connect with us through any of these convenient methods.';
  
  const defaultChannels = [
    {
      icon: '📧',
      title: 'Email Us',
      description: 'Get a response within 24 hours',
      value: 'support@example.com',
      action: 'Send Email'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our team instantly',
      value: 'Available 9am-6pm EST',
      action: 'Start Chat'
    },
    {
      icon: '📞',
      title: 'Call Us',
      description: 'Speak directly with an expert',
      value: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: '📅',
      title: 'Schedule Meeting',
      description: 'Book a video consultation',
      value: '30-minute sessions',
      action: 'Book Time'
    },
    {
      icon: '🎫',
      title: 'Support Ticket',
      description: 'Track your request status',
      value: 'Average response: 4 hours',
      action: 'Create Ticket'
    },
    {
      icon: '📍',
      title: 'Visit Office',
      description: 'Meet us in person',
      value: '123 Business St, City',
      action: 'Get Directions'
    }
  ];

  const channels = Array.isArray(content?.channels) ? content.channels : defaultChannels;

  const cardStyles = {
    minimal: 'bg-white border border-gray-200 hover:border-gray-300',
    bold: 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400',
    playful: 'bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-300 hover:border-blue-400 rounded-2xl',
    corporate: 'bg-gray-50 border border-gray-300 hover:border-blue-500',
    elegant: 'bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 hover:border-amber-400',
    modern: 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 hover:border-cyan-400',
    warm: 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 hover:border-orange-400',
    luxury: 'bg-black text-white border border-yellow-600 hover:border-yellow-500',
    creative: 'bg-gradient-to-br from-fuchsia-50 to-purple-50 border-2 border-fuchsia-300 hover:border-fuchsia-400',
    nature: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 hover:border-green-400',
    retro: 'bg-gradient-to-br from-pink-100 to-orange-100 border-2 border-pink-400 hover:border-pink-500',
    monochrome: 'bg-zinc-100 border border-zinc-400 hover:border-zinc-500',
    techno: 'bg-gray-900 text-white border border-cyan-400 hover:border-cyan-300 hover:shadow-cyan-400/20',
    zen: 'bg-stone-50 border border-stone-300 hover:border-stone-400'
  };

  const buttonStyles = {
    minimal: 'text-blue-600 hover:text-blue-700',
    bold: 'text-purple-600 hover:text-purple-700',
    playful: 'text-blue-600 hover:text-blue-700',
    corporate: 'text-blue-900 hover:text-blue-800',
    elegant: 'text-amber-600 hover:text-amber-700',
    modern: 'text-cyan-600 hover:text-cyan-700',
    warm: 'text-orange-600 hover:text-orange-700',
    luxury: 'text-yellow-500 hover:text-yellow-400',
    creative: 'text-fuchsia-600 hover:text-fuchsia-700',
    nature: 'text-green-600 hover:text-green-700',
    retro: 'text-pink-600 hover:text-pink-700',
    monochrome: 'text-zinc-700 hover:text-zinc-800',
    techno: 'text-cyan-400 hover:text-cyan-300',
    zen: 'text-stone-700 hover:text-stone-800'
  };

  const cardStyle = tone && cardStyles[tone] ? cardStyles[tone] : cardStyles.minimal;
  const buttonStyle = tone && buttonStyles[tone] ? buttonStyles[tone] : buttonStyles.minimal;
  const isDark = tone === 'luxury' || tone === 'techno';

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel: any, i: number) => (
            <div
              key={i}
              className={`${cardStyle} rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group`}
            >
              <div className="text-4xl mb-4">{channel.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {channel.title}
              </h3>
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {channel.description}
              </p>
              <p className={`font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {channel.value}
              </p>
              <button className={`font-semibold flex items-center ${buttonStyle} transition-colors`}>
                {channel.action}
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Optional footer CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
          <a
            href="/help"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Visit Help Center
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}