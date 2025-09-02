// components/sections/GalleryGrid.tsx
'use client';

import React, { useState } from 'react';
import type { SectionProps } from '@/types/section-system';

export function GalleryGrid({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Our Portfolio';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Explore our latest work and creative projects.';
  
  const defaultImages = [
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 1', category: 'Design' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 2', category: 'Photography' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 3', category: 'Branding' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 4', category: 'Web' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 5', category: 'Design' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 6', category: 'Photography' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 7', category: 'Branding' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 8', category: 'Web' },
    { src: '/api/placeholder/400/400', alt: 'Gallery Image 9', category: 'Design' }
  ];

  const images = Array.isArray(content?.images) ? content.images as any[] : defaultImages;
  const categories = ['All', ...Array.from(new Set(images.map((img: any) => img.category)))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter((img: any) => img.category === activeCategory);

  const gridStyles = {
    minimal: 'gap-4',
    bold: 'gap-6',
    playful: 'gap-8',
    corporate: 'gap-4',
    elegant: 'gap-6',
    modern: 'gap-2',
    warm: 'gap-6',
    luxury: 'gap-8',
    creative: 'gap-4',
    nature: 'gap-6',
    retro: 'gap-8',
    monochrome: 'gap-4',
    techno: 'gap-2',
    zen: 'gap-8'
  };

  const imageStyles = {
    minimal: 'rounded-lg',
    bold: 'rounded-none',
    playful: 'rounded-3xl',
    corporate: 'rounded',
    elegant: 'rounded-lg',
    modern: 'rounded-none',
    warm: 'rounded-2xl',
    luxury: 'rounded',
    creative: 'rounded-3xl transform hover:rotate-2',
    nature: 'rounded-2xl',
    retro: 'rounded-3xl border-4 border-white shadow-lg',
    monochrome: 'rounded grayscale hover:grayscale-0',
    techno: 'rounded-none border border-cyan-400',
    zen: 'rounded-xl'
  };

  const filterStyles = {
    minimal: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    bold: 'text-purple-600 hover:text-purple-800 hover:bg-purple-100',
    playful: 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full',
    corporate: 'text-blue-900 hover:text-blue-700 hover:bg-blue-50',
    elegant: 'text-amber-700 hover:text-amber-900 hover:bg-amber-50',
    modern: 'text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50',
    warm: 'text-orange-600 hover:text-orange-800 hover:bg-orange-50',
    luxury: 'text-yellow-600 hover:text-yellow-500 hover:bg-yellow-50',
    creative: 'text-fuchsia-600 hover:text-fuchsia-800 hover:bg-fuchsia-50',
    nature: 'text-green-600 hover:text-green-800 hover:bg-green-50',
    retro: 'text-pink-600 hover:text-pink-800 hover:bg-pink-100 rounded-full',
    monochrome: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
    techno: 'text-cyan-400 hover:text-cyan-300 hover:bg-gray-800',
    zen: 'text-stone-600 hover:text-stone-800 hover:bg-stone-100'
  };

  const activeFilterStyles = {
    minimal: 'bg-gray-900 text-white',
    bold: 'bg-purple-600 text-white',
    playful: 'bg-blue-600 text-white rounded-full',
    corporate: 'bg-blue-900 text-white',
    elegant: 'bg-amber-700 text-white',
    modern: 'bg-cyan-600 text-white',
    warm: 'bg-orange-600 text-white',
    luxury: 'bg-yellow-600 text-black',
    creative: 'bg-fuchsia-600 text-white',
    nature: 'bg-green-600 text-white',
    retro: 'bg-pink-600 text-white rounded-full',
    monochrome: 'bg-zinc-900 text-white',
    techno: 'bg-cyan-400 text-black',
    zen: 'bg-stone-700 text-white'
  };

  const gridGap = tone && gridStyles[tone] ? gridStyles[tone] : gridStyles.minimal;
  const imageStyle = tone && imageStyles[tone] ? imageStyles[tone] : imageStyles.minimal;
  const filterStyle = tone && filterStyles[tone] ? filterStyles[tone] : filterStyles.minimal;
  const activeStyle = tone && activeFilterStyles[tone] ? activeFilterStyles[tone] : activeFilterStyles.minimal;

  return (
    <section className={`py-20 ${tone === 'techno' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${tone === 'techno' ? 'text-white' : 'text-gray-900'}`}>
            {headline}
          </h2>
          {subheadline && (
            <p className={`text-xl max-w-3xl mx-auto ${tone === 'techno' ? 'text-gray-300' : 'text-gray-600'}`}>
              {subheadline}
            </p>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeCategory === category ? activeStyle : filterStyle
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridGap}`}>
          {filteredImages.map((image: any, i: number) => (
            <div
              key={i}
              className={`group relative overflow-hidden ${imageStyle} cursor-pointer`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-sm font-semibold">{image.category}</p>
                  <p className="text-lg font-bold mt-1">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}