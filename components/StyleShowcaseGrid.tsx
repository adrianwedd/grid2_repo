'use client';

import React, { useState, useEffect } from 'react';
import { generatePage, demoBrand } from '@/lib/generate-page';
import { PageRenderer } from '@/components/PageRenderer';
import { imageProvider } from '@/lib/image-provider';
import { generateToneSpecificContent } from '@/lib/tone-content-generator';
import type { Tone, PageNode } from '@/types/section-system';

const STYLES: Array<{
  value: Tone;
  name: string;
  description: string;
  colors: { primary: string; secondary: string; background: string };
}> = [
  {
    value: 'minimal',
    name: 'Minimal Swiss',
    description: 'Clean, focused, distraction-free',
    colors: { primary: '#000000', secondary: '#666666', background: '#FFFFFF' }
  },
  {
    value: 'bold',
    name: 'Bold Brutalist',
    description: 'Maximum impact, zero subtlety',
    colors: { primary: '#FF0000', secondary: '#000000', background: '#FFFF00' }
  },
  {
    value: 'playful',
    name: 'Playful Memphis',
    description: 'Fun, energetic, delightful',
    colors: { primary: '#FF69B4', secondary: '#00CED1', background: '#FFE4E1' }
  },
  {
    value: 'corporate',
    name: 'Corporate Professional',
    description: 'Business-ready, trustworthy',
    colors: { primary: '#003366', secondary: '#0066CC', background: '#F0F4F8' }
  },
  {
    value: 'elegant',
    name: 'Elegant Editorial',
    description: 'Sophisticated and refined',
    colors: { primary: '#2C3E50', secondary: '#8B7355', background: '#FAF9F6' }
  },
  {
    value: 'modern',
    name: 'Modern Tech',
    description: 'Future-forward innovation',
    colors: { primary: '#6366F1', secondary: '#8B5CF6', background: '#0F172A' }
  },
  {
    value: 'warm',
    name: 'Warm Organic',
    description: 'Cozy, inviting, human',
    colors: { primary: '#D2691E', secondary: '#8B4513', background: '#FFF8DC' }
  },
  {
    value: 'luxury',
    name: 'Luxury Premium',
    description: 'Exclusive, high-end excellence',
    colors: { primary: '#D4AF37', secondary: '#1C1C1C', background: '#FFFEF7' }
  },
  {
    value: 'creative',
    name: 'Creative Artistic',
    description: 'Imaginative and unconventional',
    colors: { primary: '#FF1493', secondary: '#00FFFF', background: '#FFE4E1' }
  },
  {
    value: 'nature',
    name: 'Nature Eco',
    description: 'Sustainable, earth-friendly',
    colors: { primary: '#228B22', secondary: '#8B4513', background: '#F5FFFA' }
  },
  {
    value: 'retro',
    name: 'Retro Vintage',
    description: 'Nostalgic throwback vibes',
    colors: { primary: '#FF6347', secondary: '#4682B4', background: '#FFF8DC' }
  },
  {
    value: 'zen',
    name: 'Zen Tranquil',
    description: 'Peaceful, balanced harmony',
    colors: { primary: '#4A5568', secondary: '#718096', background: '#F7FAFC' }
  }
];

interface StyleCardProps {
  style: typeof STYLES[0];
  page: PageNode | null;
  loading: boolean;
  imageStats: {
    hasAI: boolean;
    hasGenerated: boolean;
    hasPlaceholder: boolean;
  };
}

function StyleCard({ style, page, loading, imageStats }: StyleCardProps) {
  // Extract images from the page sections
  const getImages = () => {
    if (!page || !page.sections) return [];
    
    const images: Array<{ src: string; alt: string; section: string }> = [];
    
    page.sections.forEach(section => {
      if (section.props?.media && Array.isArray(section.props.media)) {
        section.props.media.forEach((media: any) => {
          if (media.kind === 'image' && media.src) {
            images.push({
              src: media.src,
              alt: media.alt || `${style.value} ${section.meta.kind} image`,
              section: section.meta.kind
            });
          }
        });
      }
    });
    
    return images;
  };

  const images = getImages();
  
  return (
    <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white hover:border-gray-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Color bar header */}
      <div 
        className="h-3 bg-gradient-to-r"
        style={{
          background: `linear-gradient(to right, ${style.colors.primary}, ${style.colors.secondary})`
        }}
      />
      
      {/* Card content */}
      <div className="p-4">
        {/* Title and description */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900">{style.name}</h3>
          <p className="text-sm text-gray-600">{style.description}</p>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <span className="text-gray-400">Loading {style.value}...</span>
          </div>
        )}
        
        {/* Images grid */}
        {!loading && images.length > 0 && (
          <div className="space-y-2">
            {/* Hero image - larger */}
            {images.find(img => img.section === 'hero') && (
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images.find(img => img.section === 'hero')!.src}
                  alt={images.find(img => img.section === 'hero')!.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                  <span className="text-white text-xs font-medium">Hero Section</span>
                </div>
              </div>
            )}
            
            {/* Other images - smaller grid */}
            <div className="grid grid-cols-2 gap-2">
              {images.filter(img => img.section !== 'hero').slice(0, 2).map((img, idx) => (
                <div key={idx} className="relative h-20 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5">
                    <span className="text-white text-xs">{img.section}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* No images fallback */}
        {!loading && images.length === 0 && (
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <span className="text-gray-400 text-sm">No images available</span>
              <p className="text-xs text-gray-400 mt-1">Check image generation</p>
            </div>
          </div>
        )}
        
        {/* Image stats badge */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {imageStats.hasAI && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">AI</span>
            )}
            {imageStats.hasGenerated && !imageStats.hasAI && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Generated</span>
            )}
            {imageStats.hasPlaceholder && !imageStats.hasAI && !imageStats.hasGenerated && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Placeholder</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{images.length} images</span>
        </div>
        
        {/* Style info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: style.colors.primary }}
                title={style.colors.primary}
              />
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: style.colors.secondary }}
                title={style.colors.secondary}
              />
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: style.colors.background }}
                title={style.colors.background}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StyleShowcaseGrid() {
  const [pages, setPages] = useState<Record<Tone, PageNode | null>>({} as any);
  const [loading, setLoading] = useState<Record<Tone, boolean>>({} as any);
  const [imageStats, setImageStats] = useState({ 
    placeholders: 0, 
    generated: 0, 
    aiGenerated: 0,
    tones: [] as string[],
    sections: [] as string[]
  });

  useEffect(() => {
    // Initialize image provider and get stats
    const loadImageStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      imageProvider.refresh();
      const stats = imageProvider.getImageStats();
      setImageStats(stats);
      console.log('📊 Image stats loaded:', stats);
    };

    loadImageStats();

    // Generate all pages
    STYLES.forEach(style => {
      generateStylePage(style.value);
    });
  }, []);

  const generateStylePage = async (tone: Tone) => {
    setLoading(prev => ({ ...prev, [tone]: true }));
    
    try {
      const toneContent = generateToneSpecificContent(tone);
      const { primary } = await generatePage(
        toneContent, 
        demoBrand, 
        tone, 
        ['hero', 'features', 'cta']
      );
      
      setPages(prev => ({ ...prev, [tone]: primary }));
      console.log(`✅ Generated ${tone} page with ${primary.sections.length} sections`);
    } catch (error) {
      console.error(`❌ Failed to generate ${tone}:`, error);
      setPages(prev => ({ ...prev, [tone]: null }));
    } finally {
      setLoading(prev => ({ ...prev, [tone]: false }));
    }
  };

  const getImageStatsForStyle = (tone: Tone) => {
    const page = pages[tone];
    if (!page) return { hasAI: false, hasGenerated: false, hasPlaceholder: false };
    
    let hasAI = false;
    let hasGenerated = false;
    let hasPlaceholder = false;
    
    page.sections.forEach(section => {
      if (section.props?.media) {
        section.props.media.forEach((media: any) => {
          if (media.src) {
            if (media.src.includes('ai-generated') || media.src.includes('ai-patient')) {
              hasAI = true;
            } else if (media.src.includes('generated')) {
              hasGenerated = true;
            } else if (media.src.includes('placeholder')) {
              hasPlaceholder = true;
            }
          }
        });
      }
    });
    
    return { hasAI, hasGenerated, hasPlaceholder };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Grid 2.0</h1>
              <p className="text-gray-600 mt-1">AI Director meets Deterministic Engine</p>
            </div>
            <div className="text-sm text-gray-500">
              {imageStats.aiGenerated > 0 
                ? `${imageStats.aiGenerated} AI images loaded`
                : imageStats.generated > 0
                ? `${imageStats.generated} generated images`
                : `${imageStats.placeholders} placeholder images`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Styles grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {STYLES.map(style => (
            <StyleCard
              key={style.value}
              style={style}
              page={pages[style.value]}
              loading={loading[style.value] || false}
              imageStats={getImageStatsForStyle(style.value)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            12 unique design philosophies • Same content, different personalities • 
            <span className="text-blue-400 ml-1">Powered by Grid 2.0</span>
          </p>
        </div>
      </div>
    </div>
  );
}