// tests/export.test.ts
// Tests for the export system

import { describe, it, expect, vi } from 'vitest';
import { extractTailwindClasses, generateTailwindCSS, generateBrandTokenCSS } from '@/lib/tailwind-extractor';
import { 
  generateStaticHTML, 
  generateNextJSPackageJSON,
  generateTailwindConfig,
  generateNextJSLayout,
  generateNextJSPage 
} from '@/lib/export-templates';
import { demoBrand, demoContent } from '@/lib/generate-page';
import type { PageNode, SectionNode } from '@/types/section-system';

describe('Tailwind Extraction', () => {
  it('should extract classes from HTML', () => {
    const html = `
      <div class="flex items-center justify-between p-4 bg-white">
        <h1 class="text-3xl font-bold text-gray-900">Title</h1>
        <button class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
          Click me
        </button>
      </div>
    `;

    const classes = extractTailwindClasses(html);
    
    expect(classes).toContain('flex');
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-between');
    expect(classes).toContain('p-4');
    expect(classes).toContain('bg-white');
    expect(classes).toContain('text-3xl');
    expect(classes).toContain('font-bold');
    expect(classes).toContain('text-gray-900');
    expect(classes).toContain('px-4');
    expect(classes).toContain('py-2');
    expect(classes).toContain('bg-brand-500');
    expect(classes).toContain('text-white');
    expect(classes).toContain('rounded-lg');
    expect(classes).toContain('hover:bg-brand-600');
  });

  it('should generate CSS for extracted classes', () => {
    const classes = ['flex', 'items-center', 'text-3xl', 'p-4', 'bg-brand-500'];
    const result = generateTailwindCSS(classes, demoBrand);
    
    expect(result.css).toContain('display: flex;');
    expect(result.css).toContain('align-items: center;');
    expect(result.css).toContain('font-size: 1.875rem;');
    expect(result.css).toContain('padding: 1rem;');
    expect(result.stats.extractedClasses).toBe(5); // All classes extracted
    expect(result.stats.totalClasses).toBe(5);
  });

  it('should generate brand token CSS variables', () => {
    const css = generateBrandTokenCSS(demoBrand);
    
    expect(css).toContain('--brand-500: #3b82f6');
    expect(css).toContain('--gray-900: #111827');
    expect(css).toContain('--font-heading: Inter');
    expect(css).toContain('--radius-sm: 0.375rem');
    expect(css).toContain('--shadow-md:');
  });
});

describe('Export Templates', () => {
  const mockPage: PageNode = {
    sections: [
      {
        id: 'hero-test',
        meta: { kind: 'hero', variant: 'split-image-left', name: 'Hero', description: 'Test hero' } as any,
        props: { 
          id: 'hero-test', 
          content: { headline: 'Test Hero', subheadline: 'Test description' } 
        },
        position: 0
      }
    ] as SectionNode[],
    meta: {
      title: 'Test Page',
      description: 'A test page for export',
    },
    brand: demoBrand,
    audits: { a11y: [], seo: [], performance: [], passed: true }
  };

  it('should generate static HTML template', () => {
    const html = '<div>Test content</div>';
    const css = 'body { margin: 0; }';
    const result = generateStaticHTML(html, css, 'Test Page');
    
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<title>Test Page</title>');
    expect(result).toContain('<div>Test content</div>');
    expect(result).toContain('body { margin: 0; }');
    expect(result).toContain('// Smooth scrolling');
    expect(result).toContain('// Basic form validation');
  });

  it('should generate Next.js package.json', () => {
    const result = generateNextJSPackageJSON('My Test Project');
    const parsed = JSON.parse(result);
    
    expect(parsed.name).toBe('my-test-project');
    expect(parsed.scripts.dev).toBe('next dev');
    expect(parsed.scripts.build).toBe('next build');
    expect(parsed.dependencies.next).toBeTruthy();
    expect(parsed.dependencies.react).toBeTruthy();
    expect(parsed.devDependencies.typescript).toBeTruthy();
    expect(parsed.devDependencies.tailwindcss).toBeTruthy();
  });

  it('should generate Tailwind config', () => {
    const result = generateTailwindConfig();
    
    expect(result).toContain('module.exports');
    expect(result).toContain('content: [');
    expect(result).toContain('./pages/**/*.{js,ts,jsx,tsx,mdx}');
    expect(result).toContain('colors: {');
    expect(result).toContain('brand: {');
    expect(result).toContain('var(--brand-500)');
    expect(result).toContain('fontFamily: {');
    expect(result).toContain('var(--font-heading)');
  });

  it('should generate Next.js layout', () => {
    const result = generateNextJSLayout(mockPage);
    
    expect(result).toContain('import type { Metadata }');
    expect(result).toContain('export const metadata: Metadata');
    expect(result).toContain('title: \'Test Page\'');
    expect(result).toContain('description: \'A test page for export\'');
    expect(result).toContain('export default function RootLayout');
  });

  it('should generate Next.js page component', () => {
    const result = generateNextJSPage(mockPage, false);
    
    expect(result).toContain('import HeroSplitImageLeft');
    expect(result).toContain('export default function Home');
    expect(result).toContain('<HeroSplitImageLeft');
    expect(result).toContain('headline: Test Hero');
  });

  it('should generate Next.js page with source includes', () => {
    const result = generateNextJSPage(mockPage, true);
    
    expect(result).toContain('import HeroSplitImageLeft from \'./components/HeroSplitImageLeft\'');
  });
});

describe('Export Integration', () => {
  it('should handle missing page data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Valid page with sections is required' }),
    });
    
    global.fetch = mockFetch;
    
    const response = await fetch('/api/export', {
      method: 'POST',
      body: JSON.stringify({ page: null }),
    });
    
    expect(response.ok).toBe(false);
  });

  it('should validate export format', async () => {
    const mockPage = {
      sections: [{ id: 'test', meta: { kind: 'hero' }, props: {}, position: 0 }],
      meta: { title: 'Test' },
      brand: demoBrand,
      audits: { passed: true }
    };
    
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid export format. Use: static, nextjs, or remix' }),
    });
    
    global.fetch = mockFetch;
    
    const response = await fetch('/api/export', {
      method: 'POST',
      body: JSON.stringify({ page: mockPage, format: 'invalid' }),
    });
    
    expect(response.ok).toBe(false);
  });
});

describe('Export Performance', () => {
  it('should handle large pages efficiently', () => {
    // Generate a large page with many sections
    const sections = Array.from({ length: 20 }, (_, i) => ({
      id: `section-${i}`,
      meta: { kind: 'hero', variant: 'split-image-left' } as any,
      props: { id: `section-${i}`, content: { headline: `Section ${i}` } },
      position: i,
    }));

    const mockPage: PageNode = {
      sections: sections as SectionNode[],
      meta: { title: 'Large Page', description: 'A page with many sections' },
      brand: demoBrand,
      audits: { a11y: [], seo: [], performance: [], passed: true }
    };

    // This should complete without errors
    const result = generateNextJSPage(mockPage, false);
    expect(result).toContain('import HeroSplitImageLeft');
    expect(result.split('<HeroSplitImageLeft').length - 1).toBe(20); // 20 components
  });

  it('should extract classes from complex HTML efficiently', () => {
    const complexHTML = Array.from({ length: 100 }, (_, i) => 
      `<div class="flex-${i} items-center-${i} p-${i % 8 + 1} text-lg bg-brand-500">Content ${i}</div>`
    ).join('');
    
    const startTime = performance.now();
    const classes = extractTailwindClasses(complexHTML);
    const endTime = performance.now();
    
    expect(classes.length).toBeGreaterThan(0);
    expect(endTime - startTime).toBeLessThan(100); // Should be fast < 100ms
  });
});