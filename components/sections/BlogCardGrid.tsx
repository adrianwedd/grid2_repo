// components/sections/BlogCardGrid.tsx
'use client';

import React from 'react';
import type { SectionProps } from '@/types/section-system';

export function BlogCardGrid({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Latest Articles';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Insights, tutorials, and updates from our team.';
  
  const defaultPosts = [
    {
      title: 'The Future of Web Development',
      excerpt: 'Exploring emerging trends and technologies shaping the web.',
      author: 'Sarah Johnson',
      date: 'Mar 15, 2024',
      category: 'Technology',
      image: '/api/placeholder/400/250',
      readTime: '5 min read'
    },
    {
      title: 'Design Systems at Scale',
      excerpt: 'Building and maintaining design systems for large organizations.',
      author: 'Michael Chen',
      date: 'Mar 12, 2024',
      category: 'Design',
      image: '/api/placeholder/400/250',
      readTime: '8 min read'
    },
    {
      title: 'Performance Optimization Tips',
      excerpt: 'Practical strategies to make your applications lightning fast.',
      author: 'Emily Davis',
      date: 'Mar 10, 2024',
      category: 'Development',
      image: '/api/placeholder/400/250',
      readTime: '6 min read'
    },
    {
      title: 'The Art of User Research',
      excerpt: 'How to conduct effective user research that drives product decisions.',
      author: 'James Wilson',
      date: 'Mar 8, 2024',
      category: 'UX',
      image: '/api/placeholder/400/250',
      readTime: '7 min read'
    },
    {
      title: 'Scaling Your Startup',
      excerpt: 'Lessons learned from growing from 10 to 100 employees.',
      author: 'Lisa Anderson',
      date: 'Mar 5, 2024',
      category: 'Business',
      image: '/api/placeholder/400/250',
      readTime: '10 min read'
    },
    {
      title: 'AI in Modern Applications',
      excerpt: 'Practical applications of AI that are transforming industries.',
      author: 'David Brown',
      date: 'Mar 3, 2024',
      category: 'AI',
      image: '/api/placeholder/400/250',
      readTime: '9 min read'
    }
  ];

  const posts = Array.isArray(content?.posts) ? content.posts as any[] : defaultPosts;

  const cardStyles = {
    minimal: 'bg-white border border-gray-200',
    bold: 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200',
    playful: 'bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-300 rounded-2xl',
    corporate: 'bg-white border border-gray-300 shadow-sm',
    elegant: 'bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200',
    modern: 'bg-white border border-cyan-200 shadow-lg',
    warm: 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200',
    luxury: 'bg-black text-white border border-yellow-600',
    creative: 'bg-gradient-to-br from-fuchsia-50 to-purple-50 border-2 border-fuchsia-300',
    nature: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300',
    retro: 'bg-gradient-to-br from-pink-100 to-orange-100 border-2 border-pink-400 rounded-2xl',
    monochrome: 'bg-white border border-zinc-400',
    techno: 'bg-gray-900 text-white border border-cyan-400',
    zen: 'bg-stone-50 border border-stone-300'
  };

  const categoryStyles = {
    minimal: 'text-blue-600 bg-blue-50',
    bold: 'text-purple-600 bg-purple-100',
    playful: 'text-blue-600 bg-blue-100 rounded-full',
    corporate: 'text-blue-900 bg-blue-50',
    elegant: 'text-amber-700 bg-amber-100',
    modern: 'text-cyan-600 bg-cyan-50',
    warm: 'text-orange-600 bg-orange-100',
    luxury: 'text-yellow-500 bg-yellow-900',
    creative: 'text-fuchsia-600 bg-fuchsia-100',
    nature: 'text-green-600 bg-green-100',
    retro: 'text-pink-600 bg-pink-200 rounded-full',
    monochrome: 'text-zinc-700 bg-zinc-200',
    techno: 'text-cyan-400 bg-gray-800',
    zen: 'text-stone-700 bg-stone-200'
  };

  const cardStyle = tone && cardStyles[tone] ? cardStyles[tone] : cardStyles.minimal;
  const categoryStyle = tone && categoryStyles[tone] ? categoryStyles[tone] : categoryStyles.minimal;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any, i: number) => (
            <article key={i} className={`${cardStyle} rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group`}>
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold ${categoryStyle} rounded-md`}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h3>
                <p className={`mb-4 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex items-center gap-3">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <span className="text-xs">{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
}