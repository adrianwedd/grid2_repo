// components/sections/CTAGradientSlab.tsx
import React from 'react';
import type { SectionProps, Action } from '@/types/section-system';

interface CTAGradientSlabProps extends SectionProps {
  content: {
    headline: string;
    description?: string;
    disclaimer?: string;
  };
  actions?: Action[];
}

export function CTAGradientSlab({ content, actions, tone = 'minimal' }: CTAGradientSlabProps) {
  const toneStyles = {
    minimal: {
      background: 'from-gray-900 to-gray-700',
      headline: 'text-white',
      description: 'text-gray-300',
      disclaimer: 'text-gray-400',
    },
    bold: {
      background: 'from-brand-600 via-brand-700 to-purple-800',
      headline: 'text-white',
      description: 'text-brand-100',
      disclaimer: 'text-brand-200',
    },
    playful: {
      background: 'from-purple-600 via-pink-600 to-orange-500',
      headline: 'text-white',
      description: 'text-white/90',
      disclaimer: 'text-white/70',
    },
    corporate: {
      background: 'from-blue-600 to-blue-800',
      headline: 'text-white',
      description: 'text-blue-100',
      disclaimer: 'text-blue-200',
    },
  } as const;

  const styles = toneStyles[tone as keyof typeof toneStyles] || toneStyles.minimal;

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24">
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${styles.background}`}>
        {(tone === 'bold' || tone === 'playful') && (
          <>
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          </>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${styles.headline}`}>
            {content.headline}
          </h2>

          {content.description && (
            <p className={`mx-auto mt-6 max-w-xl text-lg leading-8 ${styles.description}`}>
              {content.description}
            </p>
          )}

          {!!actions?.length && (
            <div className="mt-10 flex items-center justify-center gap-x-4">
              {actions.map((action, i) => (
                <a
                  key={i}
                  href={action.href}
                  target={action.target}
                  className={`
                    inline-flex items-center justify-center px-8 py-4 text-base font-semibold
                    transition-all duration-200 rounded-xl
                    ${
                      action.variant === 'secondary'
                        ? 'bg-white/10 text-white hover:bg-white/20 ring-2 ring-white/20 backdrop-blur-sm'
                        : 'bg-white text-gray-900 hover:bg-gray-100 shadow-2xl'
                    }
                  `}
                >
                  {action.label}
                  {action.icon === 'arrow-right' && (
                    <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          )}

          {content.disclaimer && (
            <p className={`mt-8 text-sm ${styles.disclaimer}`}>{content.disclaimer}</p>
          )}
        </div>
      </div>
    </section>
  );
}
