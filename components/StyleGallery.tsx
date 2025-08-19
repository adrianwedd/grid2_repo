'use client';

import React, { useState } from 'react';
import type { Tone } from '@/types/section-system';

interface StyleInfo {
  value: Tone;
  label: string;
  description: string;
  accent: string;
  category: string;
  preview?: {
    colors: string[];
    font: string;
    mood: string;
  };
}

const STYLES: StyleInfo[] = [
  // Safe & Boring
  { value: 'minimal', label: 'Minimal', description: 'IBM ThinkPad running Ubuntu', accent: 'bg-gray-800 text-white', category: 'Safe & Boring',
    preview: { colors: ['#111827', '#F3F4F6'], font: 'Sans-serif', mood: 'Clean' } },
  { value: 'corporate', label: 'Corporate', description: 'Business professional', accent: 'bg-blue-600 text-white', category: 'Safe & Boring',
    preview: { colors: ['#1E40AF', '#DBEAFE'], font: 'Sans-serif', mood: 'Trustworthy' } },
  { value: 'elegant', label: 'Elegant', description: 'Sophisticated and refined', accent: 'bg-slate-700 text-white', category: 'Safe & Boring',
    preview: { colors: ['#334155', '#F1F5F9'], font: 'Serif', mood: 'Refined' } },
  
  // Tasteful Design
  { value: 'bold', label: 'Bold', description: 'Graphic design is my passion', accent: 'bg-red-600 text-white', category: 'Tasteful Design',
    preview: { colors: ['#DC2626', '#FEE2E2'], font: 'Bold Sans', mood: 'Impactful' } },
  { value: 'warm', label: 'Warm', description: 'Cozy and inviting', accent: 'bg-orange-600 text-white', category: 'Tasteful Design',
    preview: { colors: ['#EA580C', '#FED7AA'], font: 'Sans-serif', mood: 'Friendly' } },
  { value: 'nature', label: 'Nature', description: 'Earth-inspired tones', accent: 'bg-green-600 text-white', category: 'Tasteful Design',
    preview: { colors: ['#16A34A', '#BBF7D0'], font: 'Serif', mood: 'Natural' } },
  
  // Luxury Experience
  { value: 'luxury', label: 'Luxury', description: 'Premium and exclusive', accent: 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white', category: 'Luxury Experience',
    preview: { colors: ['#B45309', '#FEF3C7'], font: 'Serif', mood: 'Premium' } },
  { value: 'modern', label: 'Modern', description: 'Cutting-edge design', accent: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white', category: 'Luxury Experience',
    preview: { colors: ['#0891B2', '#CFFAFE'], font: 'Mono', mood: 'Tech' } },
  { value: 'retro', label: 'Retro', description: 'Vintage nostalgia', accent: 'bg-gradient-to-r from-orange-500 to-red-500 text-white', category: 'Luxury Experience',
    preview: { colors: ['#C2410C', '#FFEDD5'], font: 'Display', mood: 'Nostalgic' } },
  
  // Research Lab
  { value: 'playful', label: 'Playful', description: 'Kids cereal box meets acid trip', accent: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white', category: 'Research Lab',
    preview: { colors: ['#9333EA', '#F3E8FF'], font: 'Rounded', mood: 'Energetic' } },
  { value: 'creative', label: 'Creative', description: 'Unhinged psychedelic research lab', accent: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white', category: 'Research Lab',
    preview: { colors: ['#EC4899', '#8B5CF6'], font: 'Display', mood: 'Artistic' } },
  { value: 'monochrome', label: 'Monochrome', description: 'Stark brutalist madness', accent: 'bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white', category: 'Research Lab',
    preview: { colors: ['#000000', '#FFFFFF'], font: 'Sans-serif', mood: 'Contrast' } },
  { value: 'techno', label: 'Techno', description: 'Futuristic cyberpunk aesthetic', accent: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white', category: 'Research Lab',
    preview: { colors: ['#007AFF', '#5856D6'], font: 'Sans-serif', mood: 'Futuristic' } },
  { value: 'zen', label: 'Zen', description: 'Mindful meditation balance', accent: 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white', category: 'Tasteful Design',
    preview: { colors: ['#4A5568', '#68D391'], font: 'Sans-serif', mood: 'Calm' } },
];

interface StyleGalleryProps {
  currentTone: Tone;
  onSelectTone: (tone: Tone) => void;
  expanded?: boolean;
}

export function StyleGallery({ currentTone, onSelectTone, expanded = false }: StyleGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredStyle, setHoveredStyle] = useState<Tone | null>(null);

  const categories = ['All', 'Safe & Boring', 'Tasteful Design', 'Luxury Experience', 'Research Lab'];
  
  const filteredStyles = selectedCategory === 'All' 
    ? STYLES 
    : STYLES.filter(s => s.category === selectedCategory);

  if (!expanded) {
    // Compact view - just buttons
    return (
      <div className="flex flex-wrap gap-2">
        {filteredStyles.map((style) => (
          <button
            key={style.value}
            onClick={() => onSelectTone(style.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTone === style.value
                ? style.accent
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title={style.description}
          >
            {style.label}
          </button>
        ))}
      </div>
    );
  }

  // Expanded gallery view
  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {cat} {cat !== 'All' && `(${STYLES.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Style cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStyles.map((style) => (
          <div
            key={style.value}
            onClick={() => onSelectTone(style.value)}
            onMouseEnter={() => setHoveredStyle(style.value)}
            onMouseLeave={() => setHoveredStyle(null)}
            className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 hover:shadow-xl ${
              currentTone === style.value
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
          >
            {/* Color preview bar */}
            <div className={`h-2 ${style.accent}`}></div>
            
            {/* Card content */}
            <div className="p-4 space-y-3">
              {/* Visual preview */}
              <div className={`h-24 rounded-lg ${style.accent} flex items-center justify-center`}>
                <span className="text-white/80 text-xs font-medium">
                  {style.preview?.mood || style.label}
                </span>
              </div>
              
              {/* Style info */}
              <div>
                <h3 className="font-semibold text-gray-900">{style.label}</h3>
                <p className="text-xs text-gray-600 mt-1">{style.description}</p>
              </div>
              
              {/* Preview details */}
              {style.preview && (hoveredStyle === style.value || currentTone === style.value) && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Colors:</span>
                    <div className="flex gap-1">
                      {style.preview.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Font: {style.preview.font}
                  </div>
                </div>
              )}
              
              {/* Status badges */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {style.category}
                </span>
                {currentTone === style.value && (
                  <span className="text-xs text-blue-600 font-semibold">Active</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected style details */}
      {currentTone && (
        <div className="mt-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl">
                {STYLES.find(t => t.value === currentTone)?.label} Theme Active
              </h3>
              <p className="mt-2 text-gray-600">
                {STYLES.find(t => t.value === currentTone)?.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  Tone: {currentTone}
                </span>
                <span className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  Category: {STYLES.find(t => t.value === currentTone)?.category}
                </span>
                <span className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  Mood: {STYLES.find(t => t.value === currentTone)?.preview?.mood}
                </span>
              </div>
            </div>
            <div className={`ml-4 px-6 py-3 rounded-lg ${STYLES.find(t => t.value === currentTone)?.accent}`}>
              <span className="text-sm font-medium">Preview</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}