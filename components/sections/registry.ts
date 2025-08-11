// components/sections/registry.ts
import type { ComponentRegistryEntry } from '@/types/section-system';
import { HeroSplitImageLeft } from './HeroSplitImageLeft';
import { FeaturesCards3Up } from './FeaturesCards3Up';
import { CTAGradientSlab } from './CTAGradientSlab';
import { TestimonialsGrid2x2 } from './TestimonialsGrid2x2';
import { FooterMega } from './FooterMega';
import { NavBasic } from './NavBasic';
import { PricingTable3Tier } from './PricingTable3Tier';
import { ContactFormBasic } from './ContactFormBasic';
import { GalleryMasonry } from './GalleryMasonry';
import { BlogListStandard } from './BlogListStandard';

export const componentRegistry: Record<string, ComponentRegistryEntry> = {
  'hero-split-image-left': {
    component: HeroSplitImageLeft,
    meta: {
      kind: 'hero',
      variant: 'split-image-left',
      name: 'Hero • Split Image Left',
      description: 'Split layout with content on right, image on left.',
      contentSlots: [
        { key: 'headline', type: 'text', required: true, maxLength: 100 },
        { key: 'subheadline', type: 'text', required: false, maxLength: 200 },
        { key: 'bullets', type: 'text[]', required: false, maxLength: 6 },
      ],
      hardConstraints: ['h1_once_per_page', 'img_alt_required', 'mobile_first'],
      softConstraints: ['avoid_dense_text_mobile', 'optimize_for_thumb_reach'],
      a11yChecklist: ['contrast_aa', 'focus_visible', 'keyboard_navigable'],
      bestFor: ['saas', 'agency', 'product'],
      avoidFor: ['blog', 'news'],
      estimatedSize: 'lg',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  'features-cards-3up': {
    component: FeaturesCards3Up,
    meta: {
      kind: 'features',
      variant: 'cards-3up',
      name: 'Features • Cards (3-up)',
      description: 'Three feature cards in a responsive grid.',
      contentSlots: [
        { key: 'headline', type: 'text', required: false, maxLength: 100 },
        { key: 'subheadline', type: 'text', required: false, maxLength: 200 },
        // We expect 'features' (string[]). The beam search maps items->features if needed.
        { key: 'features', type: 'text[]', required: true, minLength: 3, maxLength: 6 },
      ],
      hardConstraints: ['mobile_first'],
      softConstraints: ['avoid_dense_text_mobile'],
      a11yChecklist: ['contrast_aa', 'keyboard_navigable'],
      bestFor: ['saas', 'product', 'service'],
      avoidFor: [],
      estimatedSize: 'md',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  'cta-gradient-slab': {
    component: CTAGradientSlab,
    meta: {
      kind: 'cta',
      variant: 'gradient-slab',
      name: 'CTA • Gradient Slab',
      description: 'Full-width gradient background with centered CTA.',
      contentSlots: [
        { key: 'headline', type: 'text', required: true, maxLength: 100 },
        { key: 'description', type: 'text', required: false, maxLength: 240 },
        { key: 'disclaimer', type: 'text', required: false, maxLength: 120 },
      ],
      hardConstraints: ['cta_required', 'mobile_first'],
      softConstraints: ['prefer_high_contrast'],
      a11yChecklist: ['contrast_aa', 'focus_visible', 'keyboard_navigable'],
      bestFor: ['saas', 'product', 'landing'],
      avoidFor: ['documentation'],
      estimatedSize: 'sm',
      hasAnimations: false,
      requiresJs: false,
    },
  },

  'testimonials-grid-2x2': {
    component: TestimonialsGrid2x2,
    meta: {
      kind: 'testimonials',
      variant: 'grid-2x2',
      name: 'Testimonials • Grid 2×2',
      description: 'Four quotes in a 2×2 responsive grid with avatars and star ratings.',
      contentSlots: [
        { key: 'headline', type: 'text', required: false, maxLength: 100 },
        { key: 'subheadline', type: 'text', required: false, maxLength: 200 },
        { key: 'quotes', type: 'quote', required: true },
      ],
      hardConstraints: ['mobile_first'],
      softConstraints: ['avoid_dense_text_mobile'],
      a11yChecklist: ['contrast_aa', 'keyboard_navigable', 'screen_reader_friendly'],
      bestFor: ['saas', 'product', 'agency', 'landing'],
      avoidFor: ['documentation'],
      estimatedSize: 'md',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  
  'footer-mega': {
    component: FooterMega,
    meta: {
      kind: 'footer',
      variant: 'mega',
      name: 'Footer • Mega',
      description: 'Five-column mega footer with headings and link lists.',
      contentSlots: [
        { key: 'columns', type: 'text[]', required: true },
        { key: 'legal', type: 'text', required: false, maxLength: 200 },
      ],
      hardConstraints: ['mobile_first'],
      softConstraints: ['avoid_dense_text_mobile'],
      a11yChecklist: ['contrast_aa', 'keyboard_navigable', 'screen_reader_friendly'],
      bestFor: ['saas','agency','product','landing'],
      avoidFor: [],
      estimatedSize: 'sm',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  'navigation-basic': {
    component: NavBasic,
    meta: {
      kind: 'navigation',
      variant: 'basic',
      name: 'Navigation • Basic',
      description: 'A simple navigation bar with a logo and links.',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'sm',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  'pricing-table-3-tier': {
    component: PricingTable3Tier,
    meta: {
      kind: 'pricing',
      variant: 'table-3-tier',
      name: 'Pricing • 3-Tier Table',
      description: 'A pricing table with three tiers.',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'md',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  'contact-form-basic': {
    component: ContactFormBasic,
    meta: {
      kind: 'contact',
      variant: 'form-basic',
      name: 'Contact • Basic Form',
      description: 'A simple contact form.',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'md',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  'gallery-masonry': {
    component: GalleryMasonry,
    meta: {
      kind: 'gallery',
      variant: 'masonry',
      name: 'Gallery • Masonry',
      description: 'A masonry-style image gallery.',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'lg',
      hasAnimations: false,
      requiresJs: false,
    },
  },
  'blog-list-standard': {
    component: BlogListStandard,
    meta: {
      kind: 'blog',
      variant: 'list-standard',
      name: 'Blog • Standard List',
      description: 'A standard list of blog posts.',
      contentSlots: [],
      hardConstraints: [],
      softConstraints: [],
      a11yChecklist: [],
      bestFor: [],
      avoidFor: [],
      estimatedSize: 'lg',
      hasAnimations: false,
      requiresJs: false,
    },
  }
};
