// components/sections/AboutTeamGrid.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function AboutTeamGrid({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Meet Our Team';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'The talented people behind our success.';
  
  const defaultTeam = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years of experience.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Technical expert driving innovation.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Design',
      bio: 'Creating beautiful experiences that delight users.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'James Wilson',
      role: 'Head of Marketing',
      bio: 'Building connections with our community.',
      image: '/api/placeholder/300/300'
    }
  ];

  let team = defaultTeam;
  if (Array.isArray(content?.team)) {
    team = content.team.map((member: any) => ({
      name: typeof member.name === 'string' ? member.name : 'Team Member',
      role: typeof member.role === 'string' ? member.role : 'Role',
      bio: typeof member.bio === 'string' ? member.bio : '',
      image: typeof member.image === 'string' ? member.image : '/api/placeholder/300/300'
    }));
  }

  const cardStyles = {
    minimal: 'bg-white border border-gray-200',
    bold: 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200',
    playful: 'bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-300 rounded-2xl',
    corporate: 'bg-gray-50 border border-gray-300',
    elegant: 'bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200',
    modern: 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200',
    warm: 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200',
    luxury: 'bg-black text-white border border-gold-500',
    creative: 'bg-gradient-to-br from-fuchsia-50 to-purple-50 border-2 border-fuchsia-300',
    nature: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300',
    retro: 'bg-gradient-to-br from-pink-100 to-orange-100 border-2 border-pink-400',
    monochrome: 'bg-zinc-100 border border-zinc-400',
    techno: 'bg-gradient-to-br from-blue-900 to-cyan-900 text-white border border-cyan-400',
    zen: 'bg-stone-50 border border-stone-300'
  };

  const cardStyle = tone && cardStyles[tone] ? cardStyles[tone] : cardStyles.minimal;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className={`${cardStyle} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="aspect-square bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className={`text-sm mb-3 ${tone === 'techno' || tone === 'luxury' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {member.role}
                </p>
                {member.bio && (
                  <p className={`text-sm ${tone === 'techno' || tone === 'luxury' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}