// components/sections/HeroSplitImageLeft.tsx
import React from 'react';
import type { SectionProps, MediaAsset, Action } from '@/types/section-system';

interface HeroSplitImageLeftProps extends SectionProps {
  content: {
    headline: string;
    subheadline?: string;
    bullets?: string[];
  };
  media?: MediaAsset[];
  actions?: Action[];
}

export function HeroSplitImageLeft({
  content,
  media,
  actions,
  tone = 'minimal',
}: HeroSplitImageLeftProps) {
  const heroImage = media?.[0];

  const toneStyles = {
    minimal: {
      container: 'bg-white',
      headline: 'text-gray-900',
      subheadline: 'text-gray-600',
      imageWrapper: 'rounded-2xl overflow-hidden shadow-lg',
    },
    bold: {
      container: 'bg-gradient-to-br from-gray-900 to-gray-800',
      headline: 'text-white',
      subheadline: 'text-gray-300',
      imageWrapper: 'rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10',
    },
    playful: {
      container: 'bg-gradient-to-br from-purple-50 to-pink-50',
      headline:
        'text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
      subheadline: 'text-gray-700',
      imageWrapper:
        'rounded-[2rem] overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300',
    },
    corporate: {
      container: 'bg-gray-50',
      headline: 'text-gray-900',
      subheadline: 'text-gray-600',
      imageWrapper: 'rounded-lg overflow-hidden shadow-md border border-gray-200',
    },
    elegant: {
      container: 'bg-gradient-to-b from-slate-50 to-slate-100',
      headline: 'text-slate-900 font-light tracking-wide',
      subheadline: 'text-slate-600 font-light',
      imageWrapper: 'rounded-none shadow-2xl border-8 border-white',
    },
    warm: {
      container: 'bg-gradient-to-br from-amber-50 to-orange-50',
      headline: 'text-amber-900',
      subheadline: 'text-amber-700',
      imageWrapper: 'rounded-3xl overflow-hidden shadow-warm ring-4 ring-amber-200/50',
    },
    nature: {
      container: 'bg-gradient-to-br from-green-50 to-emerald-50',
      headline: 'text-green-900',
      subheadline: 'text-green-700',
      imageWrapper: 'rounded-[3rem] overflow-hidden shadow-xl border-4 border-green-200/50',
    },
    luxury: {
      container: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100',
      headline: 'text-amber-900 font-serif',
      subheadline: 'text-amber-800 font-light',
      imageWrapper: 'rounded-sm shadow-2xl ring-2 ring-amber-400/30',
    },
    modern: {
      container: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900',
      headline: 'text-cyan-100 font-mono uppercase tracking-wider',
      subheadline: 'text-cyan-300 font-mono',
      imageWrapper: 'clip-path-polygon-[0_0,100%_0,100%_85%,0_100%] shadow-neon ring-2 ring-cyan-400/50',
    },
    retro: {
      container: 'bg-gradient-to-br from-orange-100 to-red-100',
      headline: 'text-orange-900 font-bold italic',
      subheadline: 'text-orange-700',
      imageWrapper: 'rounded-lg shadow-retro border-4 border-orange-900 outline outline-4 outline-offset-4 outline-orange-400',
    },
    creative: {
      container: 'bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100',
      headline: 'text-purple-900 font-bold transform -skew-y-2',
      subheadline: 'text-purple-700',
      imageWrapper: 'rounded-[40%_60%_60%_40%/60%_30%_70%_40%] shadow-creative ring-rainbow',
    },
    monochrome: {
      container: 'bg-black',
      headline: 'text-white font-bold uppercase tracking-[0.2em]',
      subheadline: 'text-gray-400',
      imageWrapper: 'grayscale contrast-125 shadow-none border-l-8 border-white',
    },
  } as const;

  const styles = toneStyles[tone as keyof typeof toneStyles] || toneStyles.minimal;

  return (
    <section className={`relative isolate min-h-[90vh] flex items-center ${styles.container}`}>
      {(tone === 'bold' || tone === 'playful') && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] skew-x-[-30deg] bg-white/5 shadow-xl" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h1 className={`font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl break-words relative z-10 ${styles.headline}`}>
              {content.headline}
            </h1>

            {content.subheadline && (
              <p className={`mt-6 text-lg leading-8 ${styles.subheadline}`}>{content.subheadline}</p>
            )}

            {!!content.bullets?.length && (
              <ul className="mt-8 space-y-3">
                {content.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-x-3">
                    <svg className={`h-6 w-5 flex-none ${tone === 'bold' ? 'text-white' : 'text-brand-500'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`text-base ${styles.subheadline}`}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {!!actions?.length && (
              <div className="mt-10 flex items-center gap-x-4">
                {actions.map((action, i) => (
                  <a
                    key={i}
                    href={action.href}
                    target={action.target}
                    className={`
                      inline-flex items-center justify-center px-6 py-3 text-sm font-semibold 
                      transition-all duration-200 rounded-lg
                      ${
                        action.variant === 'secondary'
                          ? tone === 'bold'
                            ? 'bg-white/10 text-white hover:bg-white/20 ring-1 ring-white/20'
                            : 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-gray-300'
                          : tone === 'bold'
                          ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                          : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
                      }
                    `}
                  >
                    {action.label}
                    {action.icon === 'arrow-right' && (
                      <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            {heroImage ? (
              <div className={styles.imageWrapper}>
                <img
                  src={heroImage.src}
                  alt={heroImage.alt || ''}
                  width={heroImage.width || 1200}
                  height={heroImage.height || 900}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ) : (
              <div className={`${styles.imageWrapper} bg-gradient-to-br from-gray-200 to-gray-300 aspect-[4/3] lg:aspect-[3/4]`} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
