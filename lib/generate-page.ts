// lib/generate-page.ts
// Complete page generation pipeline

import { BeamSearchAssembler } from './beam-search';
import { componentRegistry } from '@/components/sections/registry';
import { getContextualMedia } from './image-provider';
import type {
  ContentGraph,
  BrandTokens,
  Tone,
  SectionKind,
  SectionNode,
  PageNode,
  PageMeta,
  AuditReport,
  AuditResult,
  SectionMeta,
} from '@/types/section-system';

/**
 * Generate a complete page from content and brand inputs
 */
export async function generatePage(
  content: ContentGraph,
  brand: BrandTokens,
  tone: Tone = 'minimal',
  requiredSections: SectionKind[] = ['hero', 'features', 'cta']
): Promise<{
  primary: PageNode;
  alternates: PageNode[];
  renderTime: number;
}> {
  const startTime = (globalThis as any).performance?.now?.() ?? Date.now();

  // Extract section metadata from registry
  const sectionLibrary: SectionMeta[] = Object.values(componentRegistry).map(
    (entry) => entry.meta
  );

  // Initialize beam search
  const assembler = new BeamSearchAssembler(sectionLibrary, {
    beamWidth: 5,
    maxDepth: 7,
  });

  // Run search
  const { primary, alternates } = await assembler.search(
    content,
    brand,
    tone,
    requiredSections
  );

  // Enhance sections with contextual media
  const enhancedPrimary = enhanceSectionsWithMedia(primary, tone);
  const enhancedAlternates = alternates.map(alt => enhanceSectionsWithMedia(alt, tone));

  // Generate page metadata
  const pageMeta = generatePageMeta(content);

  // Run audits
  const primaryAudits = await auditPage(enhancedPrimary, brand);
  const alternateAudits = await Promise.all(
    enhancedAlternates.map((sections) => auditPage(sections, brand))
  );

  // Package results
  const primaryPage: PageNode = {
    sections: enhancedPrimary,
    meta: pageMeta,
    brand,
    audits: primaryAudits,
  };

  const alternatePages: PageNode[] = enhancedAlternates.map((sections, i) => ({
    sections,
    meta: pageMeta,
    brand,
    audits: alternateAudits[i],
  }));

  const endTime = (globalThis as any).performance?.now?.() ?? Date.now();
  const renderTime = endTime - startTime;

  return {
    primary: primaryPage,
    alternates: alternatePages,
    renderTime,
  };
}

/**
 * Generate page metadata from content
 */
function generatePageMeta(content: ContentGraph): PageMeta {
  const title =
    content.hero?.headline ||
    content.cta?.headline ||
    'Welcome';
    
  const description =
    content.hero?.subheadline ||
    content.about?.description ||
    'Discover our products and services';

  return {
    title: title.slice(0, 60),
    description: description.slice(0, 160),
    og: {
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      type: 'website',
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: title,
      description,
    },
  };
}

/**
 * Audit a page for a11y, SEO, and performance
 */
async function auditPage(
  sections: SectionNode[],
  brand: BrandTokens
): Promise<AuditReport> {
  const a11y: AuditResult[] = [];
  const seo: AuditResult[] = [];
  const performance: AuditResult[] = [];

  // A11y checks
  const h1Count = sections.filter((s) =>
    s.meta.hardConstraints.includes('h1_once_per_page')
  ).length;

  if (h1Count === 0) {
    a11y.push({
      rule: 'heading-hierarchy',
      severity: 'error',
      message: 'Page is missing an h1 element',
      suggestion: 'Add a hero section with a main headline',
    });
  } else if (h1Count > 1) {
    a11y.push({
      rule: 'heading-hierarchy',
      severity: 'error',
      message: 'Page has multiple h1 elements',
      element: sections.find(s => s.meta.kind === 'hero')?.id,
      suggestion: 'Use only one h1 per page',
    });
  }

  // Check contrast (simplified)
  const hasLowContrast = sections.some(
    (s) => !s.meta.a11yChecklist.includes('contrast_aa')
  );
  if (hasLowContrast) {
    a11y.push({
      rule: 'color-contrast',
      severity: 'warning',
      message: 'Some sections may have insufficient color contrast',
      suggestion: 'Review text colors against backgrounds',
    });
  }

  // SEO checks
  if (!sections.some((s) => s.meta.kind === 'hero')) {
    seo.push({
      rule: 'hero-section',
      severity: 'warning',
      message: 'Page lacks a hero section',
      suggestion: 'Add a hero section for better SEO and user engagement',
    });
  }

  const ctaCount = sections.filter((s) => s.meta.kind === 'cta').length;
  if (ctaCount === 0) {
    seo.push({
      rule: 'call-to-action',
      severity: 'warning',
      message: 'Page lacks a clear call-to-action',
      suggestion: 'Add a CTA section to improve conversions',
    });
  }

  // Performance checks
  const animatedSections = sections.filter((s) => s.meta.hasAnimations).length;
  const totalSections = sections.length;
  
  if (animatedSections / totalSections > 0.5) {
    performance.push({
      rule: 'excessive-animations',
      severity: 'warning',
      message: 'Too many animated sections may impact performance',
      suggestion: 'Limit animations to key sections only',
    });
  }

  const heavySections = sections.filter((s) => 
    s.meta.estimatedSize === 'xl' || s.meta.estimatedSize === 'lg'
  ).length;
  
  if (heavySections > 3) {
    performance.push({
      rule: 'page-weight',
      severity: 'info',
      message: 'Page contains multiple heavy sections',
      suggestion: 'Consider lazy loading below-the-fold content',
    });
  }

  // Check brand colors for accessibility (placeholder)
  if (brand.colors.brand && (brand.colors.brand as any)[500]) {
    performance.push({
      rule: 'brand-colors',
      severity: 'info',
      message: 'Brand colors applied successfully',
    });
  }

  const passed =
    a11y.filter((r) => r.severity === 'error').length === 0 &&
    seo.filter((r) => r.severity === 'error').length === 0;

  return {
    a11y,
    seo,
    performance,
    passed,
  };
}

/**
 * Enhance sections with contextual media based on tone
 */
function enhanceSectionsWithMedia(sections: SectionNode[], tone: Tone): SectionNode[] {
  return sections.map(section => {
    // Get contextual media for this section type and tone
    const contextualMedia = getContextualMedia(tone, section.meta.kind);
    
    // If we have contextual media and the section doesn't already have media, add it
    if (contextualMedia.length > 0 && (!section.props.media || section.props.media.length === 0)) {
      return {
        ...section,
        props: {
          ...section.props,
          media: contextualMedia
        }
      };
    }
    
    return section;
  });
}

// ============================================
// Demo: Full page generation
// ============================================

/**
 * Demo content for a SaaS landing page
 */
export const demoContent: ContentGraph = {
  hero: {
    headline: 'Ship faster with AI-powered development',
    subheadline:
      'Build, test, and deploy applications 10x faster with our intelligent development platform.',
    bullets: [
      'AI code generation and review',
      'Automated testing and deployment',
      'Real-time collaboration tools',
    ],
  },
  features: {
    headline: 'Everything you need to build',
    subheadline: 'Powerful features that accelerate your development workflow',
    items: [
      'Smart code completion',
      'Automated documentation',
      'Performance monitoring',
    ],
  },
  testimonials: [
    {
      text: 'This platform transformed how we build software. We ship 3x faster now.',
      author: 'Sarah Chen',
      role: 'CTO',
      company: 'TechCorp',
    },
    {
      text: 'The AI suggestions are incredibly accurate. It feels like pair programming with a senior dev.',
      author: 'Marcus Johnson',
      role: 'Lead Developer',
      company: 'StartupXYZ',
    },
  ],
  cta: {
    headline: 'Ready to accelerate your development?',
    description: 'Join thousands of teams building faster with AI',
    primaryAction: {
      label: 'Start free trial',
      href: '/signup',
    },
    secondaryAction: {
      label: 'Book a demo',
      href: '/demo',
      variant: 'secondary',
    },
    disclaimer: 'No credit card required • 14-day free trial',
  },
};

/**
 * Demo brand tokens
 */
export const demoBrand: BrandTokens = {
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  spacing: {
    tight: 0.8,
    normal: 1,
    relaxed: 1.2,
  },
};

/**
 * Run the demo
 */
export async function runDemo(tone: Tone = 'bold') {
  const result = await generatePage(
    demoContent,
    demoBrand,
    tone,
    ['hero', 'features', 'cta']
  );
  return result;
}

// PageRenderer component moved to components/PageRenderer.tsx
// Import it with: import { PageRenderer } from '@/components/PageRenderer';
