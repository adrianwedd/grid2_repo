'use client';

import React, { useState, useEffect } from 'react';
import { generatePage, demoBrand } from '@/lib/generate-page';
import { PageRenderer } from '@/components/PageRenderer';
import { imageProvider } from '@/lib/image-provider';
import { AI_STYLE_METADATA, AI_STYLES_CONTENT_MAP } from '@/lib/all-ai-styles';
import type { Tone, PageNode } from '@/types/section-system';

// Use ALL AI-generated styles
const STYLES = AI_STYLE_METADATA;

interface StyleCardProps {
  style: typeof STYLES[0];
  page: PageNode | null;
  loading: boolean;
  imageStats: {
    hasAI: boolean;
    hasGenerated: boolean;
    hasPlaceholder: boolean;
  };
  onPreview: () => void;
}

function StyleCard({ style, page, loading, imageStats, onPreview }: StyleCardProps) {
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
    <div 
      className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white hover:border-gray-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onPreview}
    >
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
            
            {/* Other section images - smaller grid */}
            <div className="grid grid-cols-2 gap-2">
              {images.filter(img => img.section !== 'hero').slice(0, 2).map((image, idx) => (
                <div key={idx} className="relative h-16 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-white text-xs font-medium capitalize">{image.section}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* No images state */}
        {!loading && images.length === 0 && (
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <span className="text-gray-400 text-sm">No images available</span>
              <p className="text-xs text-gray-400 mt-1">Check image generation</p>
            </div>
          </div>
        )}
        
        {/* Image stats */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {imageStats.hasAI && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">AI</span>
            )}
            {imageStats.hasGenerated && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Generated</span>
            )}
            {imageStats.hasPlaceholder && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Placeholder</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{images.length} images</span>
        </div>
        
        {/* Color palette */}
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
  const [pages, setPages] = useState<Record<string, PageNode | null>>({} as any);
  const [loading, setLoading] = useState<Record<string, boolean>>({} as any);
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);
  const [imageCounts, setImageCounts] = useState<{
    aiGenerated: number;
    placeholder: number;
    generated: number;
  }>({ aiGenerated: 0, placeholder: 0, generated: 0 });

  // Load image counts from provider
  const loadImageStats = () => {
    const stats = imageProvider.getImageStats();
    setImageCounts({
      aiGenerated: stats.aiGenerated || 0,
      placeholder: stats.placeholder || 0,
      generated: stats.generated || 0
    });
  };

  useEffect(() => {
    // Load image stats on mount
    loadImageStats();

    // Generate all pages after mount to avoid hydration mismatch
    STYLES.forEach(style => {
      generateStylePage(style);
    });
  }, []);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && previewStyle) {
        setPreviewStyle(null);
      }
    };

    if (previewStyle) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [previewStyle]);

  const generateStylePage = async (style: typeof STYLES[0]) => {
    const tone = style.value;
    // Always use aiStyleId as key for AI styles
    const styleKey = style.aiStyleId!;
    setLoading(prev => ({ ...prev, [styleKey]: true }));
    
    try {
      // Get AI style content
      const aiStyle = AI_STYLES_CONTENT_MAP[style.aiStyleId!];
      const content = aiStyle.content;
      
      // Create custom brand with AI colors  
      const brand = {
        ...demoBrand,
        colors: {
          ...demoBrand.colors,
          brand: {
            ...demoBrand.colors.brand,
            500: aiStyle.colors.primary,
            600: aiStyle.colors.secondary
          }
        }
      };
      
      console.log(`🤖 Generating ${aiStyle.name} with unique content`);
      
      const { primary } = await generatePage(
        content, 
        brand, 
        tone, 
        ['hero', 'features', 'cta']
      );
      
      setPages(prev => ({ ...prev, [styleKey]: primary }));
      console.log(`✅ Generated ${style.name} page with ${primary.sections.length} sections`);
    } catch (error) {
      console.error(`❌ Failed to generate ${style.name}:`, error);
      setPages(prev => ({ ...prev, [styleKey]: null }));
    } finally {
      setLoading(prev => ({ ...prev, [styleKey]: false }));
    }
  };

  const getImageStatsForStyle = (tone: Tone) => {
    const styleKey = STYLES.find(s => s.value === tone)?.aiStyleId || tone;
    const page = pages[styleKey];
    if (!page) return { hasAI: false, hasGenerated: false, hasPlaceholder: false };
    
    let hasAI = false;
    let hasGenerated = false;
    let hasPlaceholder = false;
    
    page.sections.forEach(section => {
      if (section.props?.media) {
        section.props.media.forEach((media: any) => {
          if (media.src) {
            if (media.src.includes('/ai-images/')) hasAI = true;
            else if (media.src.includes('/generated-images/')) hasGenerated = true;
            else if (media.src.includes('/api/placeholder')) hasPlaceholder = true;
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
              {imageCounts.aiGenerated + imageCounts.generated + imageCounts.placeholder} images total
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">AI-Generated Style Collection</h2>
            <div className="flex gap-4 text-sm">
              <span className="text-purple-600">
                <span className="font-semibold">{STYLES.length}</span> Unique AI Styles
              </span>
              {imageCounts.aiGenerated > 0 && (
                <span className="text-blue-600">
                  <span className="font-semibold">{imageCounts.aiGenerated}</span> AI Images
                </span>
              )}
              {imageCounts.generated > 0 && (
                <span className="text-green-600">
                  <span className="font-semibold">{imageCounts.generated}</span> Generated
                </span>
              )}
              {imageCounts.placeholder > 0 && (
                <span className="text-gray-600">
                  <span className="font-semibold">{imageCounts.placeholder}</span> Placeholders
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Styles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {STYLES.map(style => (
            <StyleCard
              key={style.aiStyleId}
              style={style}
              page={pages[style.aiStyleId!]}
              loading={loading[style.aiStyleId!] || false}
              imageStats={getImageStatsForStyle(style.value)}
              onPreview={() => setPreviewStyle(style.aiStyleId!)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            All {STYLES.length} styles generated by AI models • Each with unique philosophy and content
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Powered by OpenRouter with DeepSeek, Mistral, Qwen, and more
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {previewStyle && pages[previewStyle] && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-4">
                <div 
                  className="w-6 h-6 rounded bg-gradient-to-r"
                  style={{
                    background: `linear-gradient(to right, ${STYLES.find(s => s.aiStyleId === previewStyle)?.colors.primary}, ${STYLES.find(s => s.aiStyleId === previewStyle)?.colors.secondary})`
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {STYLES.find(s => s.aiStyleId === previewStyle)?.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {STYLES.find(s => s.aiStyleId === previewStyle)?.description}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setPreviewStyle(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close preview"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Scrollable preview content */}
            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="min-h-full">
                <PageRenderer page={pages[previewStyle]!} />
              </div>
            </div>
            
            {/* Modal footer */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Full preview of {STYLES.find(s => s.aiStyleId === previewStyle)?.name} style</span>
                <span>{pages[previewStyle]?.sections.length} sections • {pages[previewStyle]?.sections.reduce((acc, section) => acc + (section.props?.media?.length || 0), 0)} images</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}