// lib/claude-director.ts
// Claude as the actual design director - no presets, pure AI understanding

import type { 
  SectionKind, 
  Tone,
  ContentGraph,
  BrandTokens 
} from '@/types/section-system';

/**
 * Design specification that Claude generates
 * This is what Claude outputs - a complete, precise specification
 */
export interface DesignSpec {
  // Design philosophy
  philosophy: {
    inspiration: string; // "Apple's minimalism with Stripe's technical clarity"
    principles: string[]; // ["Whitespace is luxury", "Every word matters", "Show don't tell"]
    antipatterns: string[]; // ["No stock photos", "No corporate jargon", "No clutter"]
  };
  
  // Visual language
  style: {
    tone: Tone;
    personality: string; // Claude's interpretation: "Confident but approachable"
    colorStrategy: {
      approach: string; // "Monochrome with single accent"
      primary: string; // hex
      secondary?: string;
      semantic: {
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
      };
    };
    typography: {
      philosophy: string; // "Sharp headlines, readable body"
      headingFont: string;
      bodyFont: string;
      scale: 'compact' | 'normal' | 'generous';
      weights: number[]; // [400, 600, 700]
    };
    spacing: {
      approach: string; // "Breathable but not wasteful"
      unit: number; // base unit in rem
      scale: number[]; // [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16]
    };
    motion: {
      philosophy: string; // "Subtle feedback, no decoration"
      duration: 'instant' | 'fast' | 'normal' | 'slow';
      easing: string; // "cubic-bezier(0.4, 0, 0.2, 1)"
      triggers: string[]; // ["hover", "focus", "page-transition"]
    };
  };
  
  // Content architecture
  sections: Array<{
    purpose: string; // Claude explains why: "Immediate value proposition"
    kind: SectionKind;
    variant: {
      suggestion: string; // "split-image-left"
      reasoning: string; // "Creates visual hierarchy while maintaining readability"
    };
    content: {
      headline: {
        text: string;
        tone: string; // "Bold assertion"
        maxLength?: number;
      };
      subheadline?: {
        text: string;
        tone: string; // "Clarifying support"
      };
      body?: {
        approach: string; // "Benefits-focused bullets"
        items?: string[];
      };
      cta?: {
        primary: {
          text: string;
          psychology: string; // "Low commitment entry"
        };
        secondary?: {
          text: string;
          psychology: string;
        };
      };
    };
    visual: {
      requirements: string[]; // ["High contrast hero image", "Abstract geometric pattern"]
      avoid: string[]; // ["Generic stock photos", "Overused metaphors"]
    };
  }>;
  
  // User experience
  experience: {
    firstImpression: string; // "Professional capability, not corporate stuffiness"
    emotionalJourney: string[]; // ["Curiosity", "Understanding", "Confidence", "Action"]
    frictionPoints: string[]; // ["Too many choices", "Unclear value prop"]
    microCopy: {
      philosophy: string; // "Helpful, not clever"
      examples: Record<string, string>; // {"404": "Page not found. Let's get you back on track."}
    };
  };
  
  // Business goals
  optimization: {
    primaryGoal: string; // "Qualified lead generation"
    secondaryGoals: string[];
    successMetrics: string[]; // ["Time to CTA click", "Scroll depth", "Return visits"]
    conversionStrategy: string; // "Build trust through expertise demonstration"
  };
}

/**
 * Claude integration for design generation
 */
export class ClaudeDesignDirector {
  private apiKey: string;
  private model = 'claude-3-5-sonnet-20241022'; // Best model for design
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate design spec from user intent
   */
  async generateDesignSpec(
    userIntent: string,
    context?: {
      industry?: string;
      targetAudience?: string;
      competitors?: string[];
      brandGuidelines?: string;
      existingContent?: ContentGraph;
    }
  ): Promise<DesignSpec> {
    const prompt = this.buildPrompt(userIntent, context);
    
    const response = await this.callClaude(prompt);
    
    // Parse and validate response
    const spec = this.parseResponse(response);
    
    // Validate and enhance
    return this.validateAndEnhance(spec);
  }

  /**
   * Build comprehensive prompt for Claude
   */
  private buildPrompt(userIntent: string, context?: any): string {
    return `You are an expert web design director with deep knowledge of design systems, user psychology, and conversion optimization.

Generate a complete design specification for a website based on this request:

"${userIntent}"

${context ? `Context:
- Industry: ${context.industry || 'Not specified'}
- Target Audience: ${context.targetAudience || 'Not specified'}
- Competitors: ${context.competitors?.join(', ') || 'Not specified'}
- Brand Guidelines: ${context.brandGuidelines || 'Create new'}
` : ''}

Return a JSON specification that includes:

1. DESIGN PHILOSOPHY
- What existing sites/brands inspire this design and why
- Core design principles (3-5 specific rules)
- What to explicitly avoid

2. VISUAL LANGUAGE
- Color strategy with specific hex values
- Typography choices with real font names
- Spacing system with specific units
- Motion philosophy

3. SECTION ARCHITECTURE
For each section, explain:
- Its purpose in the user journey
- Specific variant recommendation with reasoning
- Exact copy (headlines, subheadlines, CTAs)
- Visual requirements and what to avoid

4. USER EXPERIENCE
- The emotional journey from landing to conversion
- Potential friction points to avoid
- Microcopy philosophy with examples

5. BUSINESS OPTIMIZATION
- Primary conversion goal
- Success metrics
- Conversion strategy

Be specific, opinionated, and explain your reasoning. Don't use generic placeholder text - write real, compelling copy.

Return ONLY valid JSON matching the DesignSpec interface. No explanations outside the JSON.`;
  }

  /**
   * Call Claude API
   */
  private async callClaude(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.7, // Some creativity but mostly consistent
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * Parse Claude's response
   */
  private parseResponse(response: string): DesignSpec {
    try {
      // Extract JSON from response (Claude might add explanation)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      throw new Error('Invalid design specification from Claude');
    }
  }

  /**
   * Validate and enhance spec
   */
  private validateAndEnhance(spec: DesignSpec): DesignSpec {
    // Ensure all required fields
    if (!spec.style?.tone) {
      spec.style.tone = 'minimal'; // Safe default
    }
    
    // Validate color hex codes
    if (spec.style.colorStrategy?.primary) {
      spec.style.colorStrategy.primary = this.validateHex(
        spec.style.colorStrategy.primary
      );
    }
    
    // Ensure sections have valid kinds
    spec.sections = spec.sections.filter(s => 
      ['hero', 'features', 'about', 'testimonials', 'cta', 'footer'].includes(s.kind)
    );
    
    // Add missing critical sections
    if (!spec.sections.some(s => s.kind === 'hero')) {
      spec.sections.unshift(this.generateDefaultHero());
    }
    if (!spec.sections.some(s => s.kind === 'cta')) {
      spec.sections.push(this.generateDefaultCTA());
    }
    
    return spec;
  }

  /**
   * Validate hex color
   */
  private validateHex(color: string): string {
    const hex = color.replace('#', '');
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return '#000000'; // Safe default
    }
    return `#${hex}`;
  }

  /**
   * Generate default hero if missing
   */
  private generateDefaultHero(): any {
    return {
      purpose: 'Immediate value proposition',
      kind: 'hero',
      variant: {
        suggestion: 'split-image-left',
        reasoning: 'Balance of visual impact and content clarity',
      },
      content: {
        headline: {
          text: 'Build Something Amazing',
          tone: 'Bold and inspiring',
        },
      },
      visual: {
        requirements: ['High-quality hero image'],
        avoid: ['Stock photos'],
      },
    };
  }

  /**
   * Generate default CTA if missing
   */
  private generateDefaultCTA(): any {
    return {
      purpose: 'Convert interest to action',
      kind: 'cta',
      variant: {
        suggestion: 'gradient-slab',
        reasoning: 'Strong visual closure',
      },
      content: {
        headline: {
          text: 'Ready to Get Started?',
          tone: 'Inviting',
        },
        cta: {
          primary: {
            text: 'Start Free',
            psychology: 'Low commitment entry',
          },
        },
      },
      visual: {
        requirements: ['High contrast'],
        avoid: ['Aggressive colors'],
      },
    };
  }
}

/**
 * Convert Claude's spec to executable configuration
 */
export class SpecToConfig {
  /**
   * Convert design spec to page configuration
   * Handles both new Claude Director format and legacy formats
   */
  static convert(spec: any): {
    tone: Tone;
    brand: BrandTokens;
    content: ContentGraph;
    sections: Array<{
      kind: SectionKind;
      variant: string;
    }>;
  } {
    // Handle different spec formats
    const style = spec.style || {};
    const sections = spec.sections || [];
    
    return {
      tone: style.tone || 'minimal',
      brand: this.extractBrand(spec),
      content: this.extractContent(spec),
      sections: sections.map((s: any) => ({
        kind: s.kind,
        variant: s.variant?.suggestion || s.variant || 'split-image-left',
      })),
    };
  }

  /**
   * Extract brand tokens from spec - handles both old and new formats
   */
  private static extractBrand(spec: any): BrandTokens {
    // New format with brandTokens
    if (spec.brandTokens) {
      const tokens = spec.brandTokens;
      return {
        colors: {
          brand: this.generateColorScale(tokens.colors?.primary || '#2563eb'),
          gray: this.generateGrayScale(),
          ...(tokens.colors?.secondary && {
            accent: this.generateColorScale(tokens.colors.secondary),
          }),
        },
        fonts: {
          heading: tokens.typography?.headingFont || 'Inter',
          body: tokens.typography?.bodyFont || 'Inter',
        },
        radius: tokens.borderRadius ? {
          sm: tokens.borderRadius.sm || '0.25rem',
          md: tokens.borderRadius.md || '0.5rem', 
          lg: tokens.borderRadius.lg || '0.75rem',
          xl: tokens.borderRadius.xl || '1rem',
        } : {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
        },
        shadow: tokens.shadows ? {
          sm: tokens.shadows.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: tokens.shadows.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: tokens.shadows.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          xl: tokens.shadows.lg || '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        } : {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        },
        spacing: tokens.spacing?.scale ? {
          tight: 0.8,
          normal: 1,
          relaxed: 1.2,
        } : {
          tight: 0.8,
          normal: 1,
          relaxed: 1.5,
        },
      };
    }
    
    // Legacy format with style.colorStrategy
    const style = spec.style || {};
    const colorStrategy = style.colorStrategy || {};
    const typography = style.typography || {};
    
    return {
      colors: {
        brand: this.generateColorScale(colorStrategy.primary || '#2563eb'),
        gray: this.generateGrayScale(),
        ...(colorStrategy.secondary && {
          accent: this.generateColorScale(colorStrategy.secondary),
        }),
      },
      fonts: {
        heading: typography.headingFont || 'Inter',
        body: typography.bodyFont || 'Inter',
      },
      radius: {
        sm: '0.25rem',
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
        relaxed: 1.5,
      },
    };
  }

  /**
   * Extract content from spec
   */
  private static extractContent(spec: any): ContentGraph {
    const content: ContentGraph = {};
    const sections = spec.sections || [];
    
    for (const section of sections) {
      const sectionContent = section.content || {};
      
      switch (section.kind) {
        case 'hero':
          content.hero = {
            headline: sectionContent.headline?.text || sectionContent.headline || 'Welcome',
            subheadline: sectionContent.subheadline?.text || sectionContent.subheadline,
            bullets: sectionContent.body?.items || sectionContent.bullets,
          };
          break;
          
        case 'features':
          content.features = {
            headline: sectionContent.headline?.text || sectionContent.headline || 'Features',
            items: sectionContent.body?.items || sectionContent.features || sectionContent.items || [],
          };
          break;
          
        case 'cta':
          content.cta = {
            headline: sectionContent.headline?.text || sectionContent.headline || 'Get Started',
            description: sectionContent.subheadline?.text || sectionContent.subheadline,
            primaryAction: {
              label: sectionContent.cta?.primary?.text || sectionContent.primaryAction?.label || 'Get Started',
              href: sectionContent.cta?.primary?.href || '/signup',
            },
            secondaryAction: sectionContent.cta?.secondary && {
              label: sectionContent.cta.secondary.text,
              href: '/demo',
              variant: 'secondary' as const,
            },
          };
          break;
      }
    }
    
    return content;
  }

  /**
   * Generate color scale from single color
   */
  private static generateColorScale(hex: string): any {
    // This would use proper color theory
    // For now, simple opacity variations
    return {
      50: hex + '0D',  // 5% opacity
      100: hex + '1A', // 10% opacity
      200: hex + '33', // 20% opacity
      300: hex + '4D', // 30% opacity
      400: hex + '66', // 40% opacity
      500: hex,        // 100% opacity
      600: hex + 'E6', // 90% opacity
      700: hex + 'CC', // 80% opacity
      800: hex + 'B3', // 70% opacity
      900: hex + '99', // 60% opacity
    };
  }

  private static generateGrayScale(): any {
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
}