// components/sections/TestimonialsGrid2x2.tsx
import React from 'react';
import type { SectionProps, Quote } from '@/types/section-system';

interface TestimonialsGrid2x2Props extends SectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    quotes: Quote[];
  };
}

export function TestimonialsGrid2x2({ content, tone = 'minimal' }: TestimonialsGrid2x2Props) {
  const toneStyles = {
    minimal: {
      section: 'bg-white',
      card: 'bg-gray-50 border border-gray-200',
      quote: 'text-gray-800',
      author: 'text-gray-900',
      role: 'text-gray-600',
      rating: 'text-yellow-500',
    },
    bold: {
      section: 'bg-gray-900',
      card: 'bg-gray-800 border border-gray-700',
      quote: 'text-gray-100',
      author: 'text-white',
      role: 'text-gray-300',
      rating: 'text-yellow-400',
    },
    playful: {
      section: 'bg-gradient-to-b from-white to-purple-50',
      card: 'bg-white border border-purple-100 shadow-sm',
      quote: 'text-gray-800',
      author: 'text-gray-900',
      role: 'text-purple-700',
      rating: 'text-pink-500',
    },
    corporate: {
      section: 'bg-white',
      card: 'bg-gray-50 border border-gray-200',
      quote: 'text-gray-700',
      author: 'text-gray-900',
      role: 'text-gray-600',
      rating: 'text-blue-500',
    },
    elegant: {
      section: 'bg-gradient-to-b from-slate-50 to-slate-100',
      card: 'bg-white border border-slate-300 shadow-sm',
      quote: 'text-slate-700 font-light italic',
      author: 'text-slate-900 font-light',
      role: 'text-slate-600 font-light',
      rating: 'text-slate-500',
    },
    warm: {
      section: 'bg-gradient-to-br from-amber-50 to-orange-50',
      card: 'bg-white/90 border-2 border-amber-200 shadow-warm',
      quote: 'text-amber-800',
      author: 'text-amber-900',
      role: 'text-amber-700',
      rating: 'text-orange-500',
    },
    nature: {
      section: 'bg-gradient-to-br from-green-50 to-emerald-50',
      card: 'bg-white/90 border-2 border-green-200 shadow-lg',
      quote: 'text-green-800',
      author: 'text-green-900',
      role: 'text-green-700',
      rating: 'text-green-500',
    },
    luxury: {
      section: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100',
      card: 'bg-white border border-amber-300 shadow-xl',
      quote: 'text-amber-800 font-light italic',
      author: 'text-amber-900 font-serif',
      role: 'text-amber-700 font-light',
      rating: 'text-amber-500',
    },
    modern: {
      section: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900',
      card: 'bg-cyan-800/30 backdrop-blur border border-cyan-400/30',
      quote: 'text-cyan-100 font-mono',
      author: 'text-cyan-50 font-mono uppercase',
      role: 'text-cyan-300 font-mono text-sm',
      rating: 'text-cyan-400',
    },
    retro: {
      section: 'bg-gradient-to-br from-orange-100 to-red-100',
      card: 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-900',
      quote: 'text-orange-800 font-bold',
      author: 'text-orange-900 font-bold',
      role: 'text-orange-700',
      rating: 'text-orange-600',
    },
    creative: {
      section: 'bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100',
      card: 'bg-gradient-to-br from-white to-purple-50 border-2 border-purple-300 shadow-creative',
      quote: 'text-purple-800',
      author: 'text-purple-900 font-bold',
      role: 'text-purple-700',
      rating: 'text-purple-500',
    },
    monochrome: {
      section: 'bg-white',
      card: 'bg-black text-white border-l-4 border-white',
      quote: 'text-gray-100',
      author: 'text-white font-bold uppercase tracking-wider',
      role: 'text-gray-400',
      rating: 'text-gray-500',
    },
  } as const;

  const styles = toneStyles[tone as keyof typeof toneStyles] || toneStyles.minimal;
  const StarRating = ({ rating = 5 }: { rating?: number }) => (
    <div className="flex" aria-label={`Rating ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < (rating ?? 0) ? styles.rating : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.954L10 0l2.949 5.956 6.561.954-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );

  const quotes = content.quotes?.slice(0, 4) ?? [];

  return (
    <section className={`py-24 sm:py-32 ${styles.section}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(content.headline || content.subheadline) && (
          <div className="mx-auto max-w-2xl text-center mb-16">
            {content.headline && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {content.headline}
              </h2>
            )}
            {content.subheadline && (
              <p className="mt-4 text-lg leading-8 text-gray-600">
                {content.subheadline}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {quotes.map((q, i) => (
            <figure key={i} className={`rounded-2xl p-8 ${styles.card}`}>
              <blockquote className="space-y-4">
                <svg className="h-6 w-6 opacity-30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V22h8v-8H7.17A3.17 3.17 0 0 1 4 10.83 3.83 3.83 0 0 1 7.83 7H9V6H7.17Zm10 0A5.17 5.17 0 0 0 12 11.17V22h8v-8h-2.83A3.17 3.17 0 0 1 14 10.83 3.83 3.83 0 0 1 17.83 7H19V6h-1.83Z" />
                </svg>
                <p className={`text-base leading-7 ${styles.quote}`}>{q.text}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                {q.avatar ? (
                  <img
                    src={q.avatar}
                    alt={`Avatar of ${q.author}`}
                    className="h-10 w-10 rounded-full ring-1 ring-gray-200 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 ring-1 ring-gray-200" aria-hidden="true" />
                )}
                <div className="flex-1">
                  <div className={`font-medium ${styles.author}`}>{q.author}</div>
                  <div className={`text-sm ${styles.role}`}>
                    {[q.role, q.company].filter(Boolean).join(' • ')}
                  </div>
                </div>
                <StarRating rating={q.rating ?? 5} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
