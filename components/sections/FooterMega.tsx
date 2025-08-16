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
    elegant: { section: 'bg-slate-100', heading: 'text-slate-900 font-light', link: 'text-slate-600 hover:text-slate-900 font-light', legal: 'text-slate-500 font-light' },
    warm: { section: 'bg-gradient-to-b from-amber-50 to-orange-50', heading: 'text-amber-900', link: 'text-amber-700 hover:text-amber-900', legal: 'text-amber-600' },
    nature: { section: 'bg-gradient-to-b from-green-50 to-emerald-50', heading: 'text-green-900', link: 'text-green-700 hover:text-green-900', legal: 'text-green-600' },
    luxury: { section: 'bg-gradient-to-b from-amber-100 to-yellow-100', heading: 'text-amber-900 font-serif', link: 'text-amber-700 hover:text-amber-900 font-light', legal: 'text-amber-600 font-light' },
    modern: { section: 'bg-gray-900', heading: 'text-cyan-400 font-mono uppercase', link: 'text-cyan-300 hover:text-cyan-100 font-mono text-sm', legal: 'text-cyan-500 font-mono text-xs' },
    retro: { section: 'bg-gradient-to-b from-orange-100 to-red-100 border-t-4 border-orange-900', heading: 'text-orange-900 font-bold', link: 'text-orange-700 hover:text-orange-900 font-medium', legal: 'text-orange-600' },
    creative: { section: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50', heading: 'text-purple-900 font-bold', link: 'text-purple-700 hover:text-purple-900', legal: 'text-purple-600' },
    monochrome: { section: 'bg-black border-t-2 border-white', heading: 'text-white font-bold uppercase tracking-wider', link: 'text-gray-300 hover:text-white', legal: 'text-gray-500' },
  } as const;
  const styles = toneStyles[tone as keyof typeof toneStyles] || toneStyles.minimal;
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
