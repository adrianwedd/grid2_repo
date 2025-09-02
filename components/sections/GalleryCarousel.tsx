// components/sections/GalleryCarousel.tsx
'use client';

import React, { useState } from 'react';
import type { SectionProps } from '@/types/section-system';

export function GalleryCarousel({ tone, content }: SectionProps) {
  const headline = typeof content?.headline === 'string' ? content.headline : 'Featured Work';
  const subheadline = typeof content?.subheadline === 'string' ? content.subheadline : 'Swipe through our collection of stunning visuals.';
  
  const defaultImages = [
    { 
      src: '/api/placeholder/1200/600', 
      alt: 'Project Alpha',
      title: 'Project Alpha',
      description: 'A revolutionary design approach'
    },
    { 
      src: '/api/placeholder/1200/600', 
      alt: 'Project Beta',
      title: 'Project Beta',
      description: 'Pushing creative boundaries'
    },
    { 
      src: '/api/placeholder/1200/600', 
      alt: 'Project Gamma',
      title: 'Project Gamma',
      description: 'Innovation meets elegance'
    },
    { 
      src: '/api/placeholder/1200/600', 
      alt: 'Project Delta',
      title: 'Project Delta',
      description: 'Crafted with precision'
    },
    { 
      src: '/api/placeholder/1200/600', 
      alt: 'Project Epsilon',
      title: 'Project Epsilon',
      description: 'Where art meets technology'
    }
  ];

  const images = Array.isArray(content?.images) ? content.images as any[] : defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const buttonStyles = {
    minimal: 'bg-white/80 hover:bg-white text-gray-900',
    bold: 'bg-purple-600 hover:bg-purple-700 text-white',
    playful: 'bg-blue-500 hover:bg-blue-600 text-white rounded-full',
    corporate: 'bg-blue-900 hover:bg-blue-800 text-white',
    elegant: 'bg-amber-700 hover:bg-amber-800 text-white',
    modern: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    warm: 'bg-orange-500 hover:bg-orange-600 text-white',
    luxury: 'bg-yellow-600 hover:bg-yellow-700 text-black',
    creative: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white',
    nature: 'bg-green-600 hover:bg-green-700 text-white',
    retro: 'bg-pink-500 hover:bg-pink-600 text-white rounded-full',
    monochrome: 'bg-zinc-800 hover:bg-zinc-900 text-white',
    techno: 'bg-cyan-400 hover:bg-cyan-500 text-black',
    zen: 'bg-stone-700 hover:bg-stone-800 text-white'
  };

  const dotStyles = {
    minimal: 'bg-gray-400',
    bold: 'bg-purple-400',
    playful: 'bg-blue-400',
    corporate: 'bg-blue-400',
    elegant: 'bg-amber-400',
    modern: 'bg-cyan-400',
    warm: 'bg-orange-400',
    luxury: 'bg-yellow-400',
    creative: 'bg-fuchsia-400',
    nature: 'bg-green-400',
    retro: 'bg-pink-400',
    monochrome: 'bg-zinc-400',
    techno: 'bg-cyan-300',
    zen: 'bg-stone-400'
  };

  const activeDotStyles = {
    minimal: 'bg-gray-900',
    bold: 'bg-purple-600',
    playful: 'bg-blue-600',
    corporate: 'bg-blue-900',
    elegant: 'bg-amber-700',
    modern: 'bg-cyan-600',
    warm: 'bg-orange-600',
    luxury: 'bg-yellow-600',
    creative: 'bg-fuchsia-600',
    nature: 'bg-green-600',
    retro: 'bg-pink-600',
    monochrome: 'bg-zinc-900',
    techno: 'bg-cyan-400',
    zen: 'bg-stone-700'
  };

  const buttonStyle = tone && buttonStyles[tone] ? buttonStyles[tone] : buttonStyles.minimal;
  const dotStyle = tone && dotStyles[tone] ? dotStyles[tone] : dotStyles.minimal;
  const activeDotStyle = tone && activeDotStyles[tone] ? activeDotStyles[tone] : activeDotStyles.minimal;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subheadline}</p>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            <div className="aspect-w-16 aspect-h-9 relative" style={{ paddingBottom: '50%' }}>
              <img
                src={images[currentIndex]?.src || '/api/placeholder/1200/600'}
                alt={images[currentIndex]?.alt || 'Gallery image'}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {images[currentIndex]?.title || images[currentIndex]?.alt || 'Gallery Image'}
                  </h3>
                  {images[currentIndex]?.description && (
                    <p className="text-lg opacity-90">
                      {images[currentIndex].description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-lg ${buttonStyle} backdrop-blur-sm transition-all shadow-lg`}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-lg ${buttonStyle} backdrop-blur-sm transition-all shadow-lg`}
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? `${activeDotStyle} w-8` 
                    : dotStyle
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="grid grid-cols-5 gap-2 mt-8">
          {images.map((image: any, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-lg ${
                index === currentIndex ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'
              } transition-all`}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-20 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}