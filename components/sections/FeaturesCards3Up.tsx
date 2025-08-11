// components/sections/FeaturesCards3Up.tsx
import React from 'react';
import type { SectionProps } from '@/types/section-system';

interface FeaturesCards3UpProps extends SectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    // MVP: keep features as simple strings to align with ContentSlot 'text[]'
    features: string[];
  };
}

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
  } as const;

  const styles = toneStyles[tone];

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
                {/* Decorative icon block; replace with real icon lib if desired */}
                <div className="h-12 w-12 rounded-lg bg-current opacity-10" aria-hidden="true" />
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
