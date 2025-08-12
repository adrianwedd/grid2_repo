// lib/validation/spec-validator.ts
// JSON Schema validation for AI-generated specifications

import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Zod schema for design specifications - supports both old and new formats
 */
export const DesignSpecSchema = z.object({
  // Legacy style format
  style: z.object({
    tone: z.enum(['minimal', 'bold', 'playful', 'corporate', 'luxury', 'tech', 'organic']).optional(),
    inspiration: z.string().optional(),
    colorScheme: z.enum(['monochrome', 'vibrant', 'pastel', 'dark', 'brand-heavy']).optional(),
    spacing: z.enum(['tight', 'normal', 'generous', 'airy']).optional(),
    typography: z.enum(['sans', 'serif', 'mixed', 'bold', 'elegant']).optional(),
    animations: z.enum(['none', 'subtle', 'playful', 'dramatic']).optional(),
  }).optional(),
  
  // New brandTokens format
  brandTokens: z.object({
    colors: z.object({
      primary: z.string().regex(/^#[0-9A-F]{6}$/i),
      secondary: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      accent: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      neutral: z.array(z.string().regex(/^#[0-9A-F]{6}$/i)).optional(),
      semantic: z.object({
        success: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        warning: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        error: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      }).optional(),
    }),
    typography: z.object({
      headingFont: z.string(),
      bodyFont: z.string(),
      monoFont: z.string().optional(),
      scale: z.object({
        xs: z.string(),
        sm: z.string(),
        base: z.string(),
        lg: z.string(),
        xl: z.string(),
        "2xl": z.string(),
        "3xl": z.string(),
        "4xl": z.string(),
      }).optional(),
      weights: z.object({
        light: z.number(),
        normal: z.number(),
        medium: z.number(),
        semibold: z.number(),
        bold: z.number(),
      }).optional(),
    }),
    spacing: z.object({
      unit: z.number(),
      scale: z.array(z.number()),
    }).optional(),
    borderRadius: z.object({
      none: z.string(),
      sm: z.string(),
      md: z.string(), 
      lg: z.string(),
      xl: z.string(),
      full: z.string(),
    }).optional(),
    shadows: z.object({
      sm: z.string(),
      md: z.string(),
      lg: z.string(),
    }).optional(),
  }).optional(),
  
  // Visual style (new format)
  visualStyle: z.object({
    personality: z.string(),
    tone: z.enum(['minimal', 'bold', 'playful', 'corporate', 'luxury', 'tech', 'organic']),
    mood: z.string(),
    animations: z.object({
      duration: z.string(),
      easing: z.string(),
      effects: z.array(z.string()),
    }).optional(),
    layout: z.object({
      maxWidth: z.string(),
      gutter: z.string(),
      grid: z.string(),
    }).optional(),
  }).optional(),
  
  sections: z.array(z.object({
    kind: z.enum(['hero', 'features', 'about', 'testimonials', 'cta', 'footer']),
    variant: z.string(),
    priority: z.enum(['critical', 'important', 'nice-to-have']),
    content: z.object({
      headline: z.string().optional(),
      subheadline: z.string().optional(),
      style: z.enum(['large-serif', 'bold-sans', 'elegant', 'playful']).optional(),
      bullets: z.array(z.string()).optional(),
      features: z.array(z.string()).optional(),
      customization: z.record(z.any()).optional(),
    }).optional(),
    visual: z.object({
      imagery: z.enum(['none', 'abstract', 'product', 'people', 'illustration']),
      layout: z.enum(['symmetric', 'asymmetric', 'centered', 'offset']),
      emphasis: z.enum(['content', 'visual', 'balanced']),
    }).optional(),
  })),
  
  brand: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    font: z.object({
      heading: z.string().optional(),
      body: z.string().optional(),
    }).optional(),
  }).optional(),
  
  content: z.object({
    voice: z.enum(['professional', 'friendly', 'bold', 'technical', 'inspirational']),
    density: z.enum(['minimal', 'balanced', 'detailed']),
    emphasis: z.array(z.string()).optional(),
  }),
  
  layout: z.object({
    firstImpression: z.enum(['hero-focused', 'value-first', 'social-proof', 'action-oriented']),
    flow: z.enum(['linear', 'exploratory', 'conversion-focused']),
    ctaStrategy: z.enum(['single-strong', 'multiple-soft', 'progressive']),
  }),
});

export type ValidatedDesignSpec = z.infer<typeof DesignSpecSchema>;

/**
 * Content sanitization configuration
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
};

/**
 * Validate and sanitize AI-generated specification
 */
export class SpecValidator {
  /**
   * Validate JSON specification
   */
  static validate(spec: unknown): { 
    success: boolean; 
    data?: ValidatedDesignSpec; 
    errors?: string[] 
  } {
    try {
      const validated = DesignSpecSchema.parse(spec);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(e => 
          `${e.path.join('.')}: ${e.message}`
        );
        return { success: false, errors };
      }
      return { 
        success: false, 
        errors: ['Invalid specification format'] 
      };
    }
  }

  /**
   * Sanitize content strings
   */
  static sanitizeContent(content: any): any {
    if (typeof content === 'string') {
      // Remove any HTML tags and potential XSS
      const cleaned = DOMPurify.sanitize(content, SANITIZE_CONFIG);
      // DOMPurify might return empty string for iframe content, preserve text
      if (cleaned === '' && content.includes('<iframe')) {
        // Extract text content from iframe tags
        return content.replace(/<iframe[^>]*>([^<]*)<\/iframe>/gi, '$1').trim();
      }
      return cleaned;
    }
    
    if (Array.isArray(content)) {
      return content.map(item => this.sanitizeContent(item));
    }
    
    if (typeof content === 'object' && content !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(content)) {
        sanitized[key] = this.sanitizeContent(value);
      }
      return sanitized;
    }
    
    return content;
  }

  /**
   * Full validation pipeline
   */
  static validateAndSanitize(spec: unknown): {
    success: boolean;
    data?: ValidatedDesignSpec;
    errors?: string[];
    warnings?: string[];
  } {
    // First, basic structure validation
    if (!spec || typeof spec !== 'object') {
      return { 
        success: false, 
        errors: ['Specification must be a valid JSON object'] 
      };
    }

    // Sanitize all string content
    const sanitized = this.sanitizeContent(spec);
    
    // Validate against schema
    const validation = this.validate(sanitized);
    
    if (!validation.success) {
      return validation;
    }

    // Additional business logic validation
    const warnings: string[] = [];
    const data = validation.data!;
    
    // Check for conflicting settings
    if (data.style.animations === 'dramatic' && data.style.spacing === 'tight') {
      warnings.push('Dramatic animations with tight spacing may feel cramped');
    }
    
    if (data.style.colorScheme === 'dark' && data.content.voice === 'playful') {
      warnings.push('Dark theme with playful voice is unusual - verify intent');
    }
    
    // Validate section combinations
    const sectionKinds = data.sections.map(s => s.kind);
    if (!sectionKinds.includes('hero')) {
      warnings.push('No hero section - consider adding for better first impression');
    }
    
    if (!sectionKinds.includes('cta')) {
      warnings.push('No CTA section - may impact conversions');
    }
    
    return {
      success: true,
      data,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Repair common AI mistakes
   */
  static attemptRepair(spec: any): any {
    const repaired = { ...spec };
    
    // Fix common AI hallucinations
    
    // 1. Invalid color formats
    if (repaired.brand?.primaryColor) {
      const color = repaired.brand.primaryColor;
      if (color.startsWith('rgb')) {
        // Convert RGB to hex
        repaired.brand.primaryColor = this.rgbToHex(color);
      } else if (!color.startsWith('#')) {
        // Add # if missing
        repaired.brand.primaryColor = '#' + color;
      }
    }
    
    // 2. Invalid section kinds (AI might make up new ones)
    const validKinds = ['hero', 'features', 'about', 'testimonials', 'cta', 'footer'];
    if (repaired.sections) {
      repaired.sections = repaired.sections.filter((s: any) => 
        validKinds.includes(s.kind)
      );
    }
    
    // 3. Fix typos in enums
    const typoMap: Record<string, string> = {
      'minimalist': 'minimal',
      'corperate': 'corporate',
      'profesional': 'professional',
      'symetric': 'symmetric',
      'assymetric': 'asymmetric',
    };
    
    const fixTypos = (obj: any): any => {
      if (typeof obj === 'string') {
        return typoMap[obj.toLowerCase()] || obj;
      }
      if (typeof obj === 'object' && obj !== null) {
        const fixed: any = Array.isArray(obj) ? [] : {};
        for (const [key, value] of Object.entries(obj)) {
          fixed[key] = fixTypos(value);
        }
        return fixed;
      }
      return obj;
    };
    
    return fixTypos(repaired);
  }

  /**
   * Convert RGB to hex
   */
  private static rgbToHex(rgb: string): string {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';
    
    const [r, g, b] = match.map(n => parseInt(n));
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}