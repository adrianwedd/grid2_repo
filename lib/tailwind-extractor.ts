// lib/tailwind-extractor.ts
// Extract used Tailwind classes from rendered HTML + generate CSS

import type { BrandTokens } from '@/types/section-system';

// Common Tailwind classes that are likely to be used
// In production, you'd run actual Tailwind JIT compilation
const TAILWIND_BASE_CLASSES = `
/* Tailwind CSS Base */
*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}
`;

// Simplified Tailwind class-to-CSS mapping
// In production, use actual Tailwind compilation
const TAILWIND_UTILITIES: Record<string, string> = {
  // Layout
  'block': 'display: block;',
  'inline-block': 'display: inline-block;',
  'inline': 'display: inline;',
  'flex': 'display: flex;',
  'inline-flex': 'display: inline-flex;',
  'grid': 'display: grid;',
  'hidden': 'display: none;',
  
  // Flexbox
  'flex-col': 'flex-direction: column;',
  'flex-row': 'flex-direction: row;',
  'items-center': 'align-items: center;',
  'items-start': 'align-items: flex-start;',
  'items-end': 'align-items: flex-end;',
  'justify-center': 'justify-content: center;',
  'justify-start': 'justify-content: flex-start;',
  'justify-end': 'justify-content: flex-end;',
  'justify-between': 'justify-content: space-between;',
  'justify-around': 'justify-content: space-around;',
  'gap-4': 'gap: 1rem;',
  'gap-6': 'gap: 1.5rem;',
  'gap-8': 'gap: 2rem;',
  
  // Spacing
  'p-4': 'padding: 1rem;',
  'p-6': 'padding: 1.5rem;',
  'p-8': 'padding: 2rem;',
  'p-12': 'padding: 3rem;',
  'px-4': 'padding-left: 1rem; padding-right: 1rem;',
  'px-6': 'padding-left: 1.5rem; padding-right: 1.5rem;',
  'px-8': 'padding-left: 2rem; padding-right: 2rem;',
  'py-4': 'padding-top: 1rem; padding-bottom: 1rem;',
  'py-6': 'padding-top: 1.5rem; padding-bottom: 1.5rem;',
  'py-8': 'padding-top: 2rem; padding-bottom: 2rem;',
  'py-12': 'padding-top: 3rem; padding-bottom: 3rem;',
  'py-16': 'padding-top: 4rem; padding-bottom: 4rem;',
  'py-20': 'padding-top: 5rem; padding-bottom: 5rem;',
  'py-24': 'padding-top: 6rem; padding-bottom: 6rem;',
  'm-4': 'margin: 1rem;',
  'mx-auto': 'margin-left: auto; margin-right: auto;',
  'mb-4': 'margin-bottom: 1rem;',
  'mb-6': 'margin-bottom: 1.5rem;',
  'mb-8': 'margin-bottom: 2rem;',
  'mt-4': 'margin-top: 1rem;',
  'mt-8': 'margin-top: 2rem;',
  
  // Width/Height
  'w-full': 'width: 100%;',
  'w-auto': 'width: auto;',
  'h-full': 'height: 100%;',
  'h-auto': 'height: auto;',
  'min-h-screen': 'min-height: 100vh;',
  'max-w-4xl': 'max-width: 56rem;',
  'max-w-6xl': 'max-width: 72rem;',
  'max-w-7xl': 'max-width: 80rem;',
  
  // Typography
  'text-sm': 'font-size: 0.875rem; line-height: 1.25rem;',
  'text-base': 'font-size: 1rem; line-height: 1.5rem;',
  'text-lg': 'font-size: 1.125rem; line-height: 1.75rem;',
  'text-xl': 'font-size: 1.25rem; line-height: 1.75rem;',
  'text-2xl': 'font-size: 1.5rem; line-height: 2rem;',
  'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem;',
  'text-4xl': 'font-size: 2.25rem; line-height: 2.5rem;',
  'text-5xl': 'font-size: 3rem; line-height: 1;',
  'text-6xl': 'font-size: 3.75rem; line-height: 1;',
  'font-bold': 'font-weight: 700;',
  'font-semibold': 'font-weight: 600;',
  'font-medium': 'font-weight: 500;',
  'font-normal': 'font-weight: 400;',
  'text-center': 'text-align: center;',
  'text-left': 'text-align: left;',
  'text-right': 'text-align: right;',
  'leading-tight': 'line-height: 1.25;',
  'leading-snug': 'line-height: 1.375;',
  'leading-normal': 'line-height: 1.5;',
  'leading-relaxed': 'line-height: 1.625;',
  
  // Colors
  'text-white': 'color: rgb(255 255 255);',
  'text-black': 'color: rgb(0 0 0);',
  'text-gray-600': 'color: rgb(75 85 99);',
  'text-gray-700': 'color: rgb(55 65 81);',
  'text-gray-800': 'color: rgb(31 41 55);',
  'text-gray-900': 'color: rgb(17 24 39);',
  'bg-white': 'background-color: rgb(255 255 255);',
  'bg-black': 'background-color: rgb(0 0 0);',
  'bg-gray-50': 'background-color: rgb(249 250 251);',
  'bg-gray-100': 'background-color: rgb(243 244 246);',
  'bg-gray-900': 'background-color: rgb(17 24 39);',
  
  // Borders
  'border': 'border-width: 1px;',
  'border-gray-200': 'border-color: rgb(229 231 235);',
  'border-gray-300': 'border-color: rgb(209 213 219);',
  'rounded': 'border-radius: 0.25rem;',
  'rounded-lg': 'border-radius: 0.5rem;',
  'rounded-xl': 'border-radius: 0.75rem;',
  'rounded-2xl': 'border-radius: 1rem;',
  'rounded-full': 'border-radius: 9999px;',
  
  // Shadow
  'shadow': 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
  'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
  'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
  
  // Position
  'relative': 'position: relative;',
  'absolute': 'position: absolute;',
  'fixed': 'position: fixed;',
  'sticky': 'position: sticky;',
  
  // Grid
  'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr));',
  'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr));',
  'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr));',
  'grid-cols-4': 'grid-template-columns: repeat(4, minmax(0, 1fr));',
  
  // Responsive prefixes (simplified)
  'md:block': '@media (min-width: 768px) { display: block; }',
  'md:flex': '@media (min-width: 768px) { display: flex; }',
  'md:grid-cols-2': '@media (min-width: 768px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
  'md:grid-cols-3': '@media (min-width: 768px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }',
  'md:text-lg': '@media (min-width: 768px) { font-size: 1.125rem; line-height: 1.75rem; }',
  'md:text-xl': '@media (min-width: 768px) { font-size: 1.25rem; line-height: 1.75rem; }',
  'md:text-2xl': '@media (min-width: 768px) { font-size: 1.5rem; line-height: 2rem; }',
  'md:text-4xl': '@media (min-width: 768px) { font-size: 2.25rem; line-height: 2.5rem; }',
  'md:text-5xl': '@media (min-width: 768px) { font-size: 3rem; line-height: 1; }',
};

export interface TailwindExtractionResult {
  css: string;
  classes: string[];
  stats: {
    totalClasses: number;
    extractedClasses: number;
    customProperties: number;
  };
}

export function extractTailwindClasses(html: string): string[] {
  const classRegex = /class=['"]([^'"]*)['"]/g;
  const classes = new Set<string>();
  
  let match;
  while ((match = classRegex.exec(html)) !== null) {
    const classString = match[1];
    const individualClasses = classString.split(/\s+/).filter(Boolean);
    individualClasses.forEach(cls => classes.add(cls));
  }
  
  return Array.from(classes);
}

export function generateBrandTokenCSS(brand: BrandTokens): string {
  const brandVars = Object.entries(brand.colors.brand)
    .map(([key, value]) => `  --brand-${key}: ${value};`)
    .join('\n');
    
  const grayVars = Object.entries(brand.colors.gray)
    .map(([key, value]) => `  --gray-${key}: ${value};`)
    .join('\n');
    
  const accentVars = brand.colors.accent 
    ? Object.entries(brand.colors.accent)
        .map(([key, value]) => `  --accent-${key}: ${value};`)
        .join('\n')
    : '';

  return `:root {
${brandVars}
${grayVars}
${accentVars}
  --font-heading: ${brand.fonts.heading};
  --font-body: ${brand.fonts.body};
  --radius-sm: ${brand.radius.sm};
  --radius-md: ${brand.radius.md};
  --radius-lg: ${brand.radius.lg};
  --radius-xl: ${brand.radius.xl};
  --shadow-sm: ${brand.shadow.sm};
  --shadow-md: ${brand.shadow.md};
  --shadow-lg: ${brand.shadow.lg};
  --shadow-xl: ${brand.shadow.xl};
  --spacing-tight: ${brand.spacing.tight};
  --spacing-normal: ${brand.spacing.normal};
  --spacing-relaxed: ${brand.spacing.relaxed};
}`;
}

export function generateTailwindCSS(classes: string[], brand?: BrandTokens): TailwindExtractionResult {
  const extractedClasses: string[] = [];
  const utilityCSS: string[] = [];
  const mediaQueries: Record<string, string[]> = {};
  
  classes.forEach(className => {
    if (TAILWIND_UTILITIES[className]) {
      extractedClasses.push(className);
      
      const rule = TAILWIND_UTILITIES[className];
      if (rule.startsWith('@media')) {
        // Handle responsive classes
        const [mediaQuery, ...ruleParts] = rule.split(' { ');
        const innerRule = ruleParts.join(' { ');
        
        if (!mediaQueries[mediaQuery]) {
          mediaQueries[mediaQuery] = [];
        }
        mediaQueries[mediaQuery].push(`.${className.replace(':', '\\:')} { ${innerRule}`);
      } else {
        // Regular utility
        utilityCSS.push(`.${className} { ${rule} }`);
      }
    } else if (className.startsWith('text-brand-') || className.startsWith('bg-brand-') || 
               className.startsWith('border-brand-')) {
      // Handle brand color utilities
      extractedClasses.push(className);
      const [property, color, shade] = className.split('-');
      const cssProperty = property === 'text' ? 'color' : 
                         property === 'bg' ? 'background-color' : 'border-color';
      utilityCSS.push(`.${className} { ${cssProperty}: var(--${color}-${shade}); }`);
    }
  });
  
  // Build final CSS
  let css = TAILWIND_BASE_CLASSES;
  
  if (brand) {
    css += '\n\n' + generateBrandTokenCSS(brand);
  }
  
  if (utilityCSS.length > 0) {
    css += '\n\n/* Utilities */\n' + utilityCSS.join('\n');
  }
  
  // Add media queries
  Object.entries(mediaQueries).forEach(([query, rules]) => {
    css += `\n\n${query} {\n  ${rules.join('\n  ')}\n}`;
  });
  
  return {
    css,
    classes: extractedClasses,
    stats: {
      totalClasses: classes.length,
      extractedClasses: extractedClasses.length,
      customProperties: brand ? 
        Object.keys(brand.colors.brand).length + 
        Object.keys(brand.colors.gray).length + 
        (brand.colors.accent ? Object.keys(brand.colors.accent).length : 0) + 
        8 // fonts, radius, shadow, spacing
        : 0
    }
  };
}