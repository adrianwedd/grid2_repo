// components/sections/FeaturesCards3Up.tsx
import React from 'react';
import type { SectionProps } from '@/types/section-system';
import Image from 'next/image';

interface FeaturesCards3UpProps extends SectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    // MVP: keep features as simple strings to align with ContentSlot 'text[]'
    features: string[];
  };
}

// Inline SVG icons as data URLs (fallback for deployment issues)
const featureIcons: Record<string, string> = {
  'Clean interface': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzNCODJGNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHJlY3QgeD0iMjQiIHk9IjI0IiB3aWR0aD0iNDgiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiMzQjgyRjYiLz4KICA8cmVjdCB4PSIyNCIgeT0iNDAiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0IiByeD0iMSIgZmlsbD0iIzkzQzVGRCIvPgogIDxyZWN0IHg9IjI0IiB5PSI0OCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSIjOTNDNUZEIi8+CiAgPHJlY3QgeD0iMjQiIHk9IjU2IiB3aWR0aD0iNDAiIGhlaWdodD0iNCIgcng9IjEiIGZpbGw9IiM5M0M1RkQiLz4KICA8Y2lyY2xlIGN4PSI2OCIgY3k9IjY4IiByPSI2IiBmaWxsPSIjM0I4MkY2Ii8+Cjwvc3ZnPg==',
  'Fast performance': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cG9seWdvbiBwb2ludHM9IjMyLDY0IDQ4LDE2IDUyLDE2IDUyLDMyIDY0LDMyIDY0LDM2IDUyLDM2IDUyLDQ4IDY0LDQ4IDQ4LDgwIDQ0LDgwIDQ0LDY0IiBmaWxsPSIjRjU5RTBCII8+CiAgPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iMzIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Y1OUVPQSI+CjL=',
  'Simple workflow': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjMyIiByPSI4IiBmaWxsPSIjMTBCOTgxIi8+CiAgPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iOCIgZmlsbD0iIzEwQjk4MSIvPgogIDxjaXJjbGUgY3g9IjcyIiBjeT0iNjQiIHI9IjgiIGZpbGw9IiMxMEI5ODEiLz4KICA8bGluZSB4MT0iMzAiIHkxPSIzNiIgeDI9IjQyIiB5Mj0iNDQiIHN0cm9rZT0iIzEwQjk4MSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjU0IiB5MT0iNTIiIHgyPSI2NiIgeTI9IjYwIiBzdHJva2U9IiMxMEI5ODEiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwb2x5Z29uIHBvaW50cz0iNDAsNDIgNDYsNDQgNDAsNDYiIGZpbGw9IiMxMEI5ODEiLz4KICA8cG9seWdvbiBwb2ludHM9IjY0LDU4IDcwLDYwIDY0LDYyIiBmaWxsPSIjMTBCOTgxIi8+Cjwvc3ZnPg==',
  // Case variations for compatibility
  'Clean Interface': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzNCODJGNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHJlY3QgeD0iMjQiIHk9IjI0IiB3aWR0aD0iNDgiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiMzQjgyRjYiLz4KICA8cmVjdCB4PSIyNCIgeT0iNDAiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0IiByeD0iMSIgZmlsbD0iIzkzQzVGRCIvPgogIDxyZWN0IHg9IjI0IiB5PSI0OCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSIjOTNDNUZEIi8+CiAgPHJlY3QgeD0iMjQiIHk9IjU2IiB3aWR0aD0iNDAiIGhlaWdodD0iNCIgcng9IjEiIGZpbGw9IiM5M0M1RkQiLz4KICA8Y2lyY2xlIGN4PSI2OCIgY3k9IjY4IiByPSI2IiBmaWxsPSIjM0I4MkY2Ii8+Cjwvc3ZnPg==',
  'Fast Performance': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cG9seWdvbiBwb2ludHM9IjMyLDY0IDQ4LDE2IDUyLDE2IDUyLDMyIDY0LDMyIDY0LDM2IDUyLDM2IDUyLDQ4IDY0LDQ4IDQ4LDgwIDQ0LDgwIDQ0LDY0IiBmaWxsPSIjRjU5RTBCII8+CiAgPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iMzIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Y1OUVPQII+Cjwvc3ZnPg==',
  'Simple Workflow': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjMyIiByPSI4IiBmaWxsPSIjMTBCOTgxIi8+CiAgPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iOCIgZmlsbD0iIzEwQjk4MSIvPgogIDxjaXJjbGUgY3g9IjcyIiBjeT0iNjQiIHI9IjgiIGZpbGw9IiMxMEI5ODEiLz4KICA8bGluZSB4MT0iMzAiIHkxPSIzNiIgeDI9IjQyIiB5Mj0iNDQiIHN0cm9rZT0iIzEwQjk4MSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjU0IiB5MT0iNTIiIHgyPSI2NiIgeTI9IjYwIiBzdHJva2U9IiMxMEI5ODEiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwb2x5Z29uIHBvaW50cz0iNDAsNDIgNDYsNDQgNDAsNDYiIGZpbGw9IiMxMEI5ODEiLz4KICA8cG9seWdvbiBwb2ludHM9IjY0LDU4IDcwLDYwIDY0LDYyIiBmaWxsPSIjMTBCOTgxIi8+Cjwvc3ZnPg==',
};

export function FeaturesCards3Up({ content, tone = 'minimal' }: FeaturesCards3UpProps) {
  const toneStyles = {
    minimal: {
      section: 'bg-white',
      card: 'bg-gray-50 hover:bg-gray-100',
      icon: 'text-brand-600',
      title: 'text-gray-900',
      description: 'text-gray-600',
    },
    bold: {
      section: 'bg-gray-900',
      card:
        'bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 shadow-xl',
      icon: 'text-brand-400',
      title: 'text-white',
      description: 'text-gray-300',
    },
    playful: {
      section: 'bg-gradient-to-b from-white to-purple-50',
      card: 'bg-white hover:shadow-xl hover:-translate-y-1',
      icon: 'text-purple-600',
      title: 'text-gray-900',
      description: 'text-gray-600',
    },
    corporate: {
      section: 'bg-gray-50',
      card: 'bg-white hover:shadow-md border border-gray-200',
      icon: 'text-blue-600',
      title: 'text-gray-900',
      description: 'text-gray-600',
    },
    elegant: {
      section: 'bg-gradient-to-b from-slate-50 to-slate-100',
      card: 'bg-white hover:bg-slate-50 shadow-md hover:shadow-lg border border-slate-200',
      icon: 'text-slate-700',
      title: 'text-slate-900 font-light',
      description: 'text-slate-600 font-light',
    },
    warm: {
      section: 'bg-gradient-to-br from-amber-50 to-orange-50',
      card: 'bg-white/80 hover:bg-white shadow-warm hover:shadow-xl border-2 border-amber-200',
      icon: 'text-orange-600',
      title: 'text-amber-900',
      description: 'text-amber-700',
    },
    nature: {
      section: 'bg-gradient-to-br from-green-50 to-emerald-50',
      card: 'bg-white/90 hover:bg-white shadow-lg hover:shadow-xl border-2 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      description: 'text-green-700',
    },
    luxury: {
      section: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100',
      card: 'bg-white hover:bg-amber-50/50 shadow-xl border border-amber-300',
      icon: 'text-amber-700',
      title: 'text-amber-900 font-serif',
      description: 'text-amber-800 font-light',
    },
    modern: {
      section: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900',
      card: 'bg-gradient-to-br from-cyan-800/50 to-blue-800/50 hover:from-cyan-700/50 hover:to-blue-700/50 backdrop-blur border border-cyan-400/30',
      icon: 'text-cyan-400',
      title: 'text-cyan-100 font-mono uppercase',
      description: 'text-cyan-300 font-mono text-sm',
    },
    retro: {
      section: 'bg-gradient-to-br from-orange-100 to-red-100',
      card: 'bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-orange-100 hover:to-red-100 shadow-retro border-4 border-orange-900',
      icon: 'text-orange-700',
      title: 'text-orange-900 font-bold',
      description: 'text-orange-700',
    },
    creative: {
      section: 'bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100',
      card: 'bg-gradient-to-br from-white to-purple-50 hover:from-purple-50 hover:to-pink-50 shadow-creative transform hover:rotate-1 transition-all',
      icon: 'text-purple-600',
      title: 'text-purple-900 font-bold',
      description: 'text-purple-700',
    },
    monochrome: {
      section: 'bg-white',
      card: 'bg-black hover:bg-gray-900 text-white',
      icon: 'text-white',
      title: 'text-white font-bold uppercase tracking-wider',
      description: 'text-gray-300',
    },
  } as const;

  const styles = toneStyles[tone as keyof typeof toneStyles] || toneStyles.minimal;

  return (
    <section className={`py-24 sm:py-32 ${styles.section}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(content.headline || content.subheadline) && (
          <div className="mx-auto max-w-2xl text-center mb-16">
            {content.headline && (
              <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${styles.title}`}>
                {content.headline}
              </h2>
            )}
            {content.subheadline && (
              <p className={`mt-4 text-lg leading-8 ${styles.description}`}>
                {content.subheadline}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((title, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 transition-all duration-200 ${styles.card}`}
            >
              <div className={`mb-6 ${styles.icon}`}>
                {/* Use AI-generated icon if available, otherwise fallback to decorative block */}
                {featureIcons[title] ? (
                  <div className="h-20 w-20 relative">
                    <Image
                      src={featureIcons[title]}
                      alt={`${title} icon`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      onError={(e) => {
                        // Fallback to decorative block if image fails to load
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'block';
                        }
                      }}
                    />
                    <div 
                      className="h-12 w-12 rounded-lg bg-current opacity-10 fallback-icon" 
                      style={{ display: 'none' }}
                      aria-hidden="true" 
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-current opacity-10" aria-hidden="true" />
                )}
              </div>

              <h3 className={`text-xl font-semibold leading-7 ${styles.title}`}>{title}</h3>
              {/* Optional: small default blurb to avoid empty card feel */}
              <p className={`mt-4 text-base leading-7 ${styles.description}`}>
                {`Discover more about ${title.toLowerCase()}.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
