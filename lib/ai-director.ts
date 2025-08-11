// lib/ai-director.ts
// AI Design Director - Converts high-level intent to precise specifications

import type { 
  SectionKind, 
  SectionVariant, 
  Tone,
  ContentGraph,
  BrandTokens 
} from '@/types/section-system';

/**
 * Design specification that AI generates
 */
export interface DesignSpec {
  // High-level design decisions
  style: {
    tone: Tone;
    inspiration?: string; // "apple", "stripe", "linear", etc.
    colorScheme: 'monochrome' | 'vibrant' | 'pastel' | 'dark' | 'brand-heavy';
    spacing: 'tight' | 'normal' | 'generous' | 'airy';
    typography: 'sans' | 'serif' | 'mixed' | 'bold' | 'elegant';
    animations: 'none' | 'subtle' | 'playful' | 'dramatic';
  };
  
  // Precise section configuration
  sections: SectionSpec[];
  
  // Brand overrides
  brand?: {
    primaryColor?: string;
    font?: {
      heading?: string;
      body?: string;
    };
  };
  
  // Content strategy
  content: {
    voice: 'professional' | 'friendly' | 'bold' | 'technical' | 'inspirational';
    density: 'minimal' | 'balanced' | 'detailed';
    emphasis?: string[]; // Key points to highlight
  };
  
  // Layout preferences
  layout: {
    firstImpression: 'hero-focused' | 'value-first' | 'social-proof' | 'action-oriented';
    flow: 'linear' | 'exploratory' | 'conversion-focused';
    ctaStrategy: 'single-strong' | 'multiple-soft' | 'progressive';
  };
}

export interface SectionSpec {
  kind: SectionKind;
  variant: string; // Will be validated against available variants
  priority: 'critical' | 'important' | 'nice-to-have';
  content?: {
    headline?: string;
    subheadline?: string;
    style?: 'large-serif' | 'bold-sans' | 'elegant' | 'playful';
    bullets?: string[];
    features?: string[];
    customization?: Record<string, any>;
  };
  visual?: {
    imagery: 'none' | 'abstract' | 'product' | 'people' | 'illustration';
    layout: 'symmetric' | 'asymmetric' | 'centered' | 'offset';
    emphasis: 'content' | 'visual' | 'balanced';
  };
}

/**
 * Style presets for common inspirations
 */
export const STYLE_PRESETS: Record<string, Partial<DesignSpec>> = {
  apple: {
    style: {
      tone: 'minimal',
      colorScheme: 'monochrome',
      spacing: 'generous',
      typography: 'sans',
      animations: 'subtle',
    },
    content: {
      voice: 'inspirational',
      density: 'minimal',
    },
    layout: {
      firstImpression: 'hero-focused',
      flow: 'exploratory',
      ctaStrategy: 'single-strong',
    },
  },
  
  stripe: {
    style: {
      tone: 'corporate',
      colorScheme: 'brand-heavy',
      spacing: 'normal',
      typography: 'sans',
      animations: 'subtle',
    },
    content: {
      voice: 'technical',
      density: 'detailed',
    },
    layout: {
      firstImpression: 'value-first',
      flow: 'linear',
      ctaStrategy: 'progressive',
    },
  },
  
  linear: {
    style: {
      tone: 'minimal',
      colorScheme: 'dark',
      spacing: 'normal',
      typography: 'sans',
      animations: 'none',
    },
    content: {
      voice: 'technical',
      density: 'balanced',
    },
    layout: {
      firstImpression: 'value-first',
      flow: 'linear',
      ctaStrategy: 'single-strong',
    },
  },
  
  vercel: {
    style: {
      tone: 'bold',
      colorScheme: 'dark',
      spacing: 'generous',
      typography: 'bold',
      animations: 'subtle',
    },
    content: {
      voice: 'bold',
      density: 'minimal',
    },
    layout: {
      firstImpression: 'hero-focused',
      flow: 'conversion-focused',
      ctaStrategy: 'multiple-soft',
    },
  },
  
  notion: {
    style: {
      tone: 'playful',
      colorScheme: 'pastel',
      spacing: 'normal',
      typography: 'mixed',
      animations: 'playful',
    },
    content: {
      voice: 'friendly',
      density: 'balanced',
    },
    layout: {
      firstImpression: 'value-first',
      flow: 'exploratory',
      ctaStrategy: 'progressive',
    },
  },
};

/**
 * Convert design spec to executable configuration
 */
export class SpecInterpreter {
  constructor(
    private availableComponents: Map<string, string[]> // kind -> variants[]
  ) {}

  /**
   * Convert high-level spec to concrete configuration
   */
  interpret(spec: DesignSpec, existingContent?: ContentGraph): {
    tone: Tone;
    sections: Array<{
      kind: SectionKind;
      variant: string;
      content: any;
    }>;
    brand: Partial<BrandTokens>;
    requiredSections: SectionKind[];
  } {
    // Map style to tone
    const tone = this.mapTone(spec.style);
    
    // Convert section specs to concrete sections
    const sections = this.mapSections(spec.sections, spec);
    
    // Generate brand tokens
    const brand = this.generateBrand(spec);
    
    // Extract required section kinds
    const requiredSections = sections
      .filter(s => spec.sections.find(ss => ss.kind === s.kind)?.priority === 'critical')
      .map(s => s.kind);
    
    return {
      tone,
      sections,
      brand,
      requiredSections,
    };
  }

  /**
   * Map style preferences to tone
   */
  private mapTone(style: DesignSpec['style']): Tone {
    // Direct mapping if tone is specified
    if (style.tone) return style.tone;
    
    // Infer from other properties
    if (style.colorScheme === 'monochrome' && style.spacing === 'generous') {
      return 'minimal';
    }
    if (style.animations === 'playful' || style.colorScheme === 'vibrant') {
      return 'playful';
    }
    if (style.colorScheme === 'dark' || style.animations === 'dramatic') {
      return 'bold';
    }
    
    return 'corporate'; // Safe default
  }

  /**
   * Map section specs to concrete variants
   */
  private mapSections(
    specs: SectionSpec[],
    designSpec: DesignSpec
  ): Array<{ kind: SectionKind; variant: string; content: any }> {
    return specs.map(spec => {
      // Find best matching variant
      const variant = this.selectVariant(spec, designSpec.style);
      
      // Generate content based on spec
      const content = this.generateContent(spec, designSpec.content);
      
      return {
        kind: spec.kind,
        variant,
        content,
      };
    });
  }

  /**
   * Select best variant based on spec
   */
  private selectVariant(spec: SectionSpec, style: DesignSpec['style']): string {
    const availableVariants = this.availableComponents.get(spec.kind) || [];
    
    // If variant is explicitly specified and available, use it
    if (spec.variant && availableVariants.includes(spec.variant)) {
      return spec.variant;
    }
    
    // Otherwise, select based on style preferences
    const variantScores = availableVariants.map(variant => ({
      variant,
      score: this.scoreVariant(variant, spec, style),
    }));
    
    variantScores.sort((a, b) => b.score - a.score);
    
    return variantScores[0]?.variant || availableVariants[0] || 'default';
  }

  /**
   * Score how well a variant matches the spec
   */
  private scoreVariant(
    variant: string,
    spec: SectionSpec,
    style: DesignSpec['style']
  ): number {
    let score = 0;
    
    // Spacing preferences
    if (style.spacing === 'generous' && variant.includes('minimal')) score += 2;
    if (style.spacing === 'tight' && variant.includes('compact')) score += 2;
    
    // Animation preferences
    if (style.animations === 'none' && !variant.includes('animated')) score += 1;
    if (style.animations === 'playful' && variant.includes('carousel')) score += 2;
    
    // Visual preferences
    if (spec.visual?.layout === 'centered' && variant.includes('centered')) score += 2;
    if (spec.visual?.layout === 'asymmetric' && variant.includes('split')) score += 2;
    
    // Typography preferences
    if (style.typography === 'serif' && variant.includes('elegant')) score += 1;
    if (style.typography === 'bold' && variant.includes('bold')) score += 1;
    
    return score;
  }

  /**
   * Generate content based on spec
   */
  private generateContent(
    spec: SectionSpec,
    contentStrategy: DesignSpec['content']
  ): any {
    const content: any = {};
    
    // Use provided content
    if (spec.content?.headline) {
      content.headline = spec.content.headline;
    }
    if (spec.content?.subheadline) {
      content.subheadline = spec.content.subheadline;
    }
    if (spec.content?.bullets) {
      content.bullets = spec.content.bullets;
    }
    if (spec.content?.features) {
      content.features = spec.content.features;
    }
    
    // Apply content density preferences
    if (contentStrategy.density === 'minimal' && content.bullets?.length > 3) {
      content.bullets = content.bullets.slice(0, 3);
    }
    
    // Apply voice transformations
    if (contentStrategy.voice === 'bold' && content.headline) {
      content.headline = content.headline.toUpperCase();
    }
    
    return content;
  }

  /**
   * Generate brand tokens from spec
   */
  private generateBrand(spec: DesignSpec): Partial<BrandTokens> {
    const brand: Partial<BrandTokens> = {};
    
    // Color scheme
    if (spec.style.colorScheme === 'monochrome') {
      brand.colors = {
        brand: this.generateMonochromeScale('#000000'),
        gray: this.generateGrayScale(),
      };
    } else if (spec.style.colorScheme === 'dark') {
      brand.colors = {
        brand: this.generateMonochromeScale('#ffffff'),
        gray: this.generateDarkGrayScale(),
      };
    }
    
    // Typography
    const fontMap = {
      sans: { heading: 'Inter', body: 'Inter' },
      serif: { heading: 'Playfair Display', body: 'Inter' },
      mixed: { heading: 'Playfair Display', body: 'Inter' },
      bold: { heading: 'Space Grotesk', body: 'Inter' },
      elegant: { heading: 'Newsreader', body: 'Inter' },
    };
    
    if (spec.style.typography && fontMap[spec.style.typography]) {
      brand.fonts = fontMap[spec.style.typography];
    }
    
    // Spacing
    const spacingMap = {
      tight: { tight: 0.8, normal: 1, relaxed: 1.2 },
      normal: { tight: 0.9, normal: 1, relaxed: 1.3 },
      generous: { tight: 1, normal: 1.2, relaxed: 1.5 },
      airy: { tight: 1.2, normal: 1.5, relaxed: 2 },
    };
    
    if (spec.style.spacing && spacingMap[spec.style.spacing]) {
      brand.spacing = spacingMap[spec.style.spacing];
    }
    
    // Apply brand overrides
    if (spec.brand?.primaryColor) {
      brand.colors = {
        ...brand.colors,
        brand: this.generateColorScale(spec.brand.primaryColor),
      } as any;
    }
    
    return brand;
  }

  /**
   * Generate color scales
   */
  private generateMonochromeScale(base: string): any {
    // Simplified - would use proper color theory
    return {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    };
  }

  private generateGrayScale(): any {
    return {
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
    };
  }

  private generateDarkGrayScale(): any {
    return {
      50: '#18181b',
      100: '#27272a',
      200: '#3f3f46',
      300: '#52525b',
      400: '#71717a',
      500: '#a1a1aa',
      600: '#d4d4d8',
      700: '#e4e4e7',
      800: '#f4f4f5',
      900: '#fafafa',
    };
  }

  private generateColorScale(hex: string): any {
    // Simplified - would use proper color manipulation
    return {
      50: hex + '10',
      100: hex + '20',
      200: hex + '40',
      300: hex + '60',
      400: hex + '80',
      500: hex,
      600: hex + 'CC',
      700: hex + 'AA',
      800: hex + '88',
      900: hex + '66',
    };
  }
}

/**
 * Claude prompt template for generating design specs
 */
export const CLAUDE_PROMPT_TEMPLATE = `
You are a web design director. Generate a precise JSON specification for a website based on the user's request.

User request: {USER_INPUT}

Return a JSON object matching this TypeScript interface:

interface DesignSpec {
  style: {
    tone: 'minimal' | 'bold' | 'playful' | 'corporate';
    inspiration?: string;
    colorScheme: 'monochrome' | 'vibrant' | 'pastel' | 'dark' | 'brand-heavy';
    spacing: 'tight' | 'normal' | 'generous' | 'airy';
    typography: 'sans' | 'serif' | 'mixed' | 'bold' | 'elegant';
    animations: 'none' | 'subtle' | 'playful' | 'dramatic';
  };
  sections: Array<{
    kind: 'hero' | 'features' | 'about' | 'testimonials' | 'cta' | 'footer';
    variant: string;
    priority: 'critical' | 'important' | 'nice-to-have';
    content?: {
      headline?: string;
      subheadline?: string;
      style?: 'large-serif' | 'bold-sans' | 'elegant' | 'playful';
      bullets?: string[];
    };
    visual?: {
      imagery: 'none' | 'abstract' | 'product' | 'people' | 'illustration';
      layout: 'symmetric' | 'asymmetric' | 'centered' | 'offset';
      emphasis: 'content' | 'visual' | 'balanced';
    };
  }>;
  content: {
    voice: 'professional' | 'friendly' | 'bold' | 'technical' | 'inspirational';
    density: 'minimal' | 'balanced' | 'detailed';
    emphasis?: string[];
  };
  layout: {
    firstImpression: 'hero-focused' | 'value-first' | 'social-proof' | 'action-oriented';
    flow: 'linear' | 'exploratory' | 'conversion-focused';
    ctaStrategy: 'single-strong' | 'multiple-soft' | 'progressive';
  };
}

Consider the user's industry, target audience, and goals. If they mention a specific brand (like Apple, Stripe, etc.), use that as inspiration.

Return ONLY valid JSON, no explanations.
`;