// components/sections/ContactSplitMap.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function ContactSplitMap({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Get in Touch';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.';
  
  const defaultInfo = {
    email: 'hello@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St, Suite 100, City, State 12345',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
  };

  const info = typeof content?.contactInfo === 'object' && content.contactInfo
    ? { ...defaultInfo, ...content.contactInfo }
    : defaultInfo;

  const formStyles = {
    minimal: {
      bg: 'bg-white',
      input: 'border-gray-300 focus:border-gray-500',
      button: 'bg-gray-900 hover:bg-gray-800 text-white'
    },
    bold: {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      input: 'border-purple-300 focus:border-purple-500',
      button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
    },
    playful: {
      bg: 'bg-gradient-to-br from-blue-50 to-green-50',
      input: 'border-blue-300 focus:border-blue-500 rounded-xl',
      button: 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full'
    },
    corporate: {
      bg: 'bg-gray-50',
      input: 'border-gray-400 focus:border-blue-600',
      button: 'bg-blue-900 hover:bg-blue-800 text-white'
    },
    elegant: {
      bg: 'bg-gradient-to-br from-amber-50 to-rose-50',
      input: 'border-amber-300 focus:border-amber-500',
      button: 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white'
    },
    modern: {
      bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
      input: 'border-cyan-300 focus:border-cyan-500',
      button: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
    },
    warm: {
      bg: 'bg-gradient-to-br from-orange-50 to-red-50',
      input: 'border-orange-300 focus:border-orange-500',
      button: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
    },
    luxury: {
      bg: 'bg-black',
      input: 'bg-gray-900 border-yellow-600 focus:border-yellow-500 text-white',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-black font-bold'
    },
    creative: {
      bg: 'bg-gradient-to-br from-fuchsia-50 to-purple-50',
      input: 'border-fuchsia-300 focus:border-fuchsia-500',
      button: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white'
    },
    nature: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      input: 'border-green-300 focus:border-green-500',
      button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
    },
    retro: {
      bg: 'bg-gradient-to-br from-pink-100 to-orange-100',
      input: 'border-pink-400 focus:border-pink-500 rounded-xl border-2',
      button: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full'
    },
    monochrome: {
      bg: 'bg-zinc-100',
      input: 'border-zinc-400 focus:border-zinc-600',
      button: 'bg-zinc-900 hover:bg-zinc-800 text-white'
    },
    techno: {
      bg: 'bg-gray-900',
      input: 'bg-gray-800 border-cyan-400 focus:border-cyan-300 text-white',
      button: 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold'
    },
    zen: {
      bg: 'bg-stone-50',
      input: 'border-stone-300 focus:border-stone-500',
      button: 'bg-stone-800 hover:bg-stone-700 text-white'
    }
  };

  const style = tone && formStyles[tone] ? formStyles[tone] : formStyles.minimal;
  const isDark = tone === 'luxury' || tone === 'techno';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`${style.bg} p-8 rounded-2xl`}>
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {headline}
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {subheadline}
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.input}`}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.input}`}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.input}`}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.input}`}
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${style.button}`}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map/Info Section */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-64 lg:h-96 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500">Map Integration</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">{info.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600">{info.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600">{info.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Hours</p>
                  <p className="text-gray-600">{info.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}