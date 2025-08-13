// components/sections/FooterMega.tsx
import React from 'react';
import type { Tone } from '@/types/section-system';

interface FooterMegaProps {
  content: Record<string, any>;
  tone?: Tone;
}

export function FooterMega({ content, tone = 'minimal' }: FooterMegaProps) {
  const toneStyles = {
    minimal: { section: 'bg-white', heading: 'text-gray-900', link: 'text-gray-600 hover:text-gray-900', legal: 'text-gray-500' },
    bold: { section: 'bg-gray-950', heading: 'text-white', link: 'text-gray-300 hover:text-white', legal: 'text-gray-400' },
    playful: { section: 'bg-gradient-to-b from-white to-purple-50', heading: 'text-gray-900', link: 'text-purple-700 hover:text-purple-900', legal: 'text-purple-700/70' },
    corporate: { section: 'bg-gray-50', heading: 'text-gray-900', link: 'text-gray-700 hover:text-gray-900', legal: 'text-gray-600' },
  } as const;
  const styles = toneStyles[tone];
  const cols = content.columns?.slice(0, 5) ?? [];

  return (
    <footer className={`${styles.section} border-t border-gray-200`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {cols.map((col: any, i: number) => (
            <div key={i}>
              <h3 className={`text-sm font-semibold ${styles.heading}`}>{col.heading}</h3>
              <ul role="list" className="mt-6 space-y-2">
                {col.links?.map((l: any, j: number) => (
                  <li key={j}>
                    <a href={l.href} className={`text-sm ${styles.link}`}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {content.legal && (
          <div className={`mt-12 text-xs ${styles.legal}`}>{content.legal}</div>
        )}
      </div>
    </footer>
  );
}
