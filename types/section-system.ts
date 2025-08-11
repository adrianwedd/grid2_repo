// types/section-system.ts
// Core type system for the component generation engine

import type { ComponentType } from 'react';

export type SectionKind =
  | 'hero'
  | 'features'
  | 'about'
  | 'testimonials'
  | 'cta'
  | 'footer';

export type SectionVariant = {
  hero:
    | 'split-image-left'
    | 'split-image-right'
    | 'full-bleed'
    | 'card-over-image'
    | 'headline-left'
    | 'headline-right'
    | 'with-form'
    | 'minimal'
    | 'video-bg'
    | 'animated-gradient';
  features:
    | 'cards-3up'
    | 'cards-4up'
    | 'icon-list'
    | 'split-list'
    | 'comparison-table'
    | 'bento-grid'
    | 'timeline'
    | 'accordion';
  about:
    | 'media-left'
    | 'media-right'
    | 'timeline'
    | 'stat-block'
    | 'team-grid'
    | 'mission-vision';
  testimonials:
    | 'grid-2x2'
    | 'carousel'
    | 'single-spotlight'
    | 'logo-wall-quotes'
    | 'twitter-style'
    | 'case-study';
  cta:
    | 'simple'
    | 'gradient-slab'
    | 'inline-form'
    | 'pricing-teaser'
    | 'countdown'
    | 'split-benefits'
    | 'floating-bar'
    | 'exit-intent';
  footer:
    | 'simple'
    | 'mega'
    | 'minimal'
    | 'legal-heavy'
    | 'newsletter'
    | 'social-focused';
};

export type SectionId = `${SectionKind}-${string}`;

export type Tone = 'minimal' | 'bold' | 'playful' | 'corporate';

// Constraint types
export type HardConstraint =
  | 'h1_once_per_page'
  | 'img_alt_required'
  | 'form_label_required'
  | 'cta_required'
  | 'mobile_first'
  | 'no_horizontal_scroll';

export type SoftConstraint =
  | 'avoid_dense_text_mobile'
  | 'prefer_high_contrast'
  | 'limit_animations'
  | 'optimize_for_thumb_reach'
  | 'avoid_adjacent_heavy_imagery';

export type A11yRequirement =
  | 'contrast_aa'
  | 'contrast_aaa'
  | 'focus_visible'
  | 'keyboard_navigable'
  | 'screen_reader_friendly'
  | 'reduced_motion_safe';

// Content slot types
export interface ContentSlot {
  key: string;
  type: 'text' | 'text[]' | 'image' | 'video' | 'icon' | 'quote' | 'stat';
  required: boolean;
  maxLength?: number;
  minLength?: number;
  validation?: string; // regex pattern
}

// Section metadata definition
export interface SectionMeta<K extends SectionKind = SectionKind> {
  kind: K;
  variant: SectionVariant[K];
  name: string; // Human-readable name
  description: string;

  // Content requirements
  contentSlots: ContentSlot[];

  // Constraints
  hardConstraints: HardConstraint[];
  softConstraints: SoftConstraint[];
  a11yChecklist: A11yRequirement[];

  // Scoring hints
  bestFor: string[]; // e.g., ['saas', 'agency', 'portfolio']
  avoidFor: string[]; // e.g., ['ecommerce', 'blog']

  // Performance characteristics
  estimatedSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // rough category
  hasAnimations: boolean;
  requiresJs: boolean;
}

// Runtime props for sections
export interface SectionProps {
  id: SectionId;
  content: Record<string, string | string[] | MediaAsset | Quote[] | Stat[]>;
  media?: MediaAsset[];
  actions?: Action[];
  tone?: Tone;
  customStyles?: Partial<BrandTokens>;
}

export interface MediaAsset {
  kind: 'image' | 'video' | 'lottie';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  placeholder?: string; // base64 blur
}

export interface Action {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  icon?: string;
  target?: '_self' | '_blank';
}

export interface Quote {
  text: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

export interface Stat {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  suffix?: string;
  prefix?: string;
}

// Brand tokens
export interface BrandTokens {
  colors: {
    brand: Record<
      50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
      string
    >;
    accent?: Record<
      50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
      string
    >;
    gray: Record<
      50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
      string
    >;
  };
  fonts: {
    heading: string;
    body: string;
    mono?: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    tight: number; // multiplier
    normal: number;
    relaxed: number;
  };
}

// Component registry entry
export interface ComponentRegistryEntry<K extends SectionKind = SectionKind> {
  meta: SectionMeta<K>;
  component: ComponentType<SectionProps>;
  previewImage?: string;
  code?: string; // For export
}

// Page-level types
export interface PageNode {
  sections: SectionNode[];
  meta: PageMeta;
  brand: BrandTokens;
  audits: AuditReport;
}

export interface SectionNode {
  id: SectionId;
  meta: SectionMeta;
  props: SectionProps;
  position: number;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  og?: Record<string, string>;
  jsonLd?: Record<string, any>;
}

export interface AuditReport {
  a11y: AuditResult[];
  seo: AuditResult[];
  performance: AuditResult[];
  passed: boolean;
}

export interface AuditResult {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  suggestion?: string;
}

// Beam search types
export interface BeamSearchConfig {
  beamWidth: number;
  maxDepth: number;
  scorer: ScoringFunction;
}

export type ScoringFunction = (
  partial: SectionNode[],
  candidate: SectionMeta,
  context: ScoringContext
) => number;

export interface ScoringContext {
  content: ContentGraph;
  brand: BrandTokens;
  tone: Tone;
  constraints: {
    hard: HardConstraint[];
    soft: SoftConstraint[];
  };
}

export interface ContentGraph {
  hero?: {
    headline: string;
    subheadline?: string;
    image?: MediaAsset;
    bullets?: string[];
  };
  features?: {
    headline?: string;
    subheadline?: string;
    items?: string[];     // allow either 'items' or 'features' (MVP)
    features?: string[];
  };
  testimonials?: Quote[];
  about?: {
    title: string;
    description: string;
    stats?: Stat[];
  };
  cta?: {
    headline: string;
    description?: string;
    primaryAction: Action;
    secondaryAction?: Action;
    disclaimer?: string;
  };
  footer?: {
    copyright: string;
    links?: Array<{ label: string; href: string }>;
    social?: Array<{ platform: string; href: string }>;
  };
}

// Transform system for chat edits
export type Transform = (doc: SectionNode[]) => SectionNode[];

export interface TransformRegistry {
  makeHeroDramatic: Transform;
  increaseContrast: Transform;
  addSocialProof: Transform;
  tightenAboveTheFold: Transform;
  swapVariant: (sectionId: SectionId, newVariant: string) => Transform;
  reorderSections: (from: number, to: number) => Transform;
  updateContent: (
    sectionId: SectionId,
    content: Partial<SectionProps['content']>
  ) => Transform;
}

// Export for component authors
export interface ComponentAuthorKit {
  defineMeta: <K extends SectionKind>(meta: SectionMeta<K>) => SectionMeta<K>;
  validateProps: (props: SectionProps, meta: SectionMeta) => boolean;
  extractRequiredContent: (meta: SectionMeta) => ContentSlot[];
}
