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
  { value: 'minimal', label: 'Minimal', description: 'Maximum safety, minimum liability', accent: 'bg-gray-300 hover:bg-gray-400 text-gray-900', category: 'Safe & Boring',
    preview: { colors: ['#111827', '#F3F4F6'], font: 'Sans-serif', mood: 'Clean' } },
  { value: 'corporate', label: 'Corporate', description: 'Government ass-covering blandness', accent: 'bg-blue-600 hover:bg-blue-700 text-white', category: 'Safe & Boring',
    preview: { colors: ['#1E40AF', '#DBEAFE'], font: 'Sans-serif', mood: 'Trustworthy' } },
  { value: 'elegant', label: 'Elegant', description: 'Boring, but make it sophisticated', accent: 'bg-slate-600 hover:bg-slate-700 text-white', category: 'Safe & Boring',
    preview: { colors: ['#334155', '#F1F5F9'], font: 'Serif', mood: 'Refined' } },
  
  // Normal Human
  { value: 'warm', label: 'Warm', description: 'Cozy coffee shop vibes, actually likeable', accent: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white', category: 'Normal Human',
    preview: { colors: ['#EA580C', '#FED7AA'], font: 'Sans-serif', mood: 'Friendly' } },
  { value: 'nature', label: 'Nature', description: 'Eco-friendly without being preachy', accent: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white', category: 'Normal Human',
    preview: { colors: ['#16A34A', '#BBF7D0'], font: 'Serif', mood: 'Natural' } },
  { value: 'luxury', label: 'Luxury', description: 'Rich people problems, premium materials', accent: 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white', category: 'Normal Human',
    preview: { colors: ['#B45309', '#FEF3C7'], font: 'Serif', mood: 'Premium' } },
  { value: 'zen', label: 'Zen', description: 'Mindful meditation, balanced harmony', accent: 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white', category: 'Normal Human',
    preview: { colors: ['#4A5568', '#68D391'], font: 'Sans-serif', mood: 'Calm' } },
  
  // Getting Weird
  { value: 'bold', label: 'Bold', description: 'Dramatic villain energy, high contrast', accent: 'bg-black hover:bg-gray-900 text-white', category: 'Getting Weird',
    preview: { colors: ['#DC2626', '#FEE2E2'], font: 'Bold Sans', mood: 'Impactful' } },
  { value: 'modern', label: 'Modern', description: 'Cyberpunk startup, neon everything', accent: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white', category: 'Getting Weird',
    preview: { colors: ['#0891B2', '#CFFAFE'], font: 'Mono', mood: 'Tech' } },
  { value: 'retro', label: 'Retro', description: '80s nostalgia meets modern confusion', accent: 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white', category: 'Getting Weird',
    preview: { colors: ['#C2410C', '#FFEDD5'], font: 'Display', mood: 'Nostalgic' } },
  
  // Research Lab
  { value: 'playful', label: 'Playful', description: 'Kids cereal box meets acid trip', accent: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white', category: 'Research Lab',
    preview: { colors: ['#9333EA', '#F3E8FF'], font: 'Rounded', mood: 'Energetic' } },
  { value: 'creative', label: 'Creative', description: 'Unhinged psychedelic research lab', accent: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white', category: 'Research Lab',
    preview: { colors: ['#EC4899', '#8B5CF6'], font: 'Display', mood: 'Artistic' } },
  { value: 'monochrome', label: 'Monochrome', description: 'Stark brutalist madness, editorial chaos', accent: 'bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white', category: 'Research Lab',
    preview: { colors: ['#000000', '#FFFFFF'], font: 'Sans-serif', mood: 'Contrast' } },
  { value: 'techno', label: 'Techno', description: 'Futuristic cyberpunk, neon everything', accent: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white', category: 'Research Lab',
    preview: { colors: ['#007AFF', '#5856D6'], font: 'Sans-serif', mood: 'Futuristic' } },
  
  // AI Generated Madness
  { value: 'playful', label: 'Quantum Nebula', description: 'Where Pixels Dance with the Cosmos', accent: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 text-white', category: 'AI Generated',
    preview: { colors: ['#FF00FF', '#00FFFF'], font: 'Display', mood: 'Cosmic' } },
  { value: 'bold', label: 'DeepSeek Enigma', description: 'Where logic transcends reality', accent: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white', category: 'AI Generated',
    preview: { colors: ['#0080FF', '#4B0082'], font: 'Mono', mood: 'Enigmatic' } },
  { value: 'creative', label: 'Thunder Goat', description: 'Where Chaos Meets Brilliance', accent: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white', category: 'AI Generated',
    preview: { colors: ['#FF00F6', '#8B00FF'], font: 'Display', mood: 'Chaotic' } },
  { value: 'playful', label: 'VOIDWHISPER', description: 'CHAOS BIRTHS CLARITY', accent: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white', category: 'AI Generated',
    preview: { colors: ['#FF00FF', '#000000'], font: 'Glitch', mood: 'Void' } },
  { value: 'retro', label: 'Psychedelic Café', description: 'Time, Space, and Flavors Collide', accent: 'bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white', category: 'AI Generated',
    preview: { colors: ['#FF69B4', '#FFA500'], font: 'Psychedelic', mood: 'Trippy' } },
  { value: 'playful', label: 'GlitchGizzard', description: 'Reality is a slow-loading JPEG', accent: 'bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-900', category: 'AI Generated',
    preview: { colors: ['#FFD9FF', '#DDA0DD'], font: 'Glitch', mood: 'Buffering' } },
  { value: 'modern', label: 'GLM Air Flow', description: 'Breathe in the digital atmosphere', accent: 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-white', category: 'AI Generated',
    preview: { colors: ['#00FFCC', '#40E0D0'], font: 'Sans-serif', mood: 'Atmospheric' } },
  { value: 'creative', label: 'Quantum Quokka', description: 'Reality Melts, Imagination Bakes', accent: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white', category: 'AI Generated',
    preview: { colors: ['#FF66CC', '#CC66FF'], font: 'Display', mood: 'Melting' } },
];

interface StyleGalleryProps {
  currentTone: Tone;
  onSelectTone: (tone: Tone) => void;
  expanded?: boolean;
}

export function StyleGallery({ currentTone, onSelectTone, expanded = false }: StyleGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredStyle, setHoveredStyle] = useState<Tone | null>(null);

  const categories = ['All', 'Safe & Boring', 'Normal Human', 'Getting Weird', 'Research Lab', 'AI Generated'];
  
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
            <button
              onClick={() => window.open('/editor', '_blank')}
              className={`ml-4 px-6 py-3 rounded-lg transition-all hover:scale-105 ${STYLES.find(t => t.value === currentTone)?.accent}`}
            >
              <span className="text-sm font-medium">Preview in Editor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}