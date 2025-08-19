// Intelligent Page Generator - Uses Claude to refine prompts and generate with AI images
import type { Tone, ContentGraph, SectionNode, SectionKind } from '@/types/section-system';
import { imageProvider } from '@/lib/image-provider';
import { generatePage } from '@/lib/generate-page';

// Extended style definitions with hex color palettes extracted from AI images
export const STYLE_DEFINITIONS: Record<Tone, {
  name: string;
  description: string;
  category: 'Safe & Boring' | 'Normal Human' | 'Getting Weird' | 'Research Lab';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  aestheticKeywords: string[];
  visualPersonality: string;
}> = {
  // Safe & Boring - Government Ass-Covering Blandness
  minimal: {
    name: 'Minimal',
    description: 'Maximum safety, minimum liability - sterile corporate perfection',
    category: 'Safe & Boring',
    colors: {
      primary: '#ffffff',   // Pure white from AI image analysis
      secondary: '#f8fafc', // Light gray from minimal aesthetic
      accent: '#e2e8f0',    // Soft gray accent
      background: '#ffffff',
      text: '#64748b'
    },
    aestheticKeywords: ['clean', 'sterile', 'corporate', 'safe', 'institutional', 'minimal'],
    visualPersonality: 'Ultra-clean minimalist with maximum professional blandness and corporate safety'
  },
  corporate: {
    name: 'Corporate', 
    description: 'Government bureaucracy meets institutional reliability',
    category: 'Safe & Boring',
    colors: {
      primary: '#1e40af',   // Institutional blue from AI images
      secondary: '#3b82f6', // Corporate blue
      accent: '#dbeafe',    // Light blue accent
      background: '#f8fafc',
      text: '#1e293b'
    },
    aestheticKeywords: ['institutional', 'bureaucratic', 'professional', 'government', 'compliance', 'reliable'],
    visualPersonality: 'Professional institutional blue with government bureaucracy aesthetic and maximum compliance safety'
  },
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated gray refinement with premium boring appeal',
    category: 'Safe & Boring',
    colors: {
      primary: '#475569',   // Refined gray from AI images
      secondary: '#64748b', // Sophisticated gray
      accent: '#e2e8f0',    // Light gray accent
      background: '#f1f5f9',
      text: '#334155'
    },
    aestheticKeywords: ['sophisticated', 'refined', 'premium', 'upscale', 'elegant', 'professional'],
    visualPersonality: 'Sophisticated refined gray with upscale professional aesthetic and premium boring sophistication'
  },

  // Normal Human - Actually Usable
  warm: {
    name: 'Warm',
    description: 'Cozy coffee shop vibes with human-friendly appeal',
    category: 'Normal Human', 
    colors: {
      primary: '#f59e0b',   // Amber orange from AI images
      secondary: '#f97316', // Warm orange
      accent: '#fed7aa',    // Light amber accent
      background: '#fef3c7',
      text: '#92400e'
    },
    aestheticKeywords: ['cozy', 'warm', 'friendly', 'approachable', 'autumn', 'inviting'],
    visualPersonality: 'Cozy warm autumn with orange amber colors and coffee shop aesthetic vibes'
  },
  nature: {
    name: 'Nature',
    description: 'Eco-friendly harmony without being preachy',
    category: 'Normal Human',
    colors: {
      primary: '#059669',   // Natural green (estimated from style)
      secondary: '#10b981', // Fresh green
      accent: '#a7f3d0',    // Light green accent
      background: '#ecfdf5',
      text: '#047857'
    },
    aestheticKeywords: ['natural', 'eco-friendly', 'organic', 'sustainable', 'fresh', 'green'],
    visualPersonality: 'Fresh natural eco-friendly with vibrant green organic environment and sustainable aesthetic'
  },
  luxury: {
    name: 'Luxury',
    description: 'Premium materials with rich people problems energy',
    category: 'Normal Human',
    colors: {
      primary: '#d97706',   // Premium gold (estimated)
      secondary: '#f59e0b', // Luxury gold
      accent: '#fef3c7',    // Light gold accent
      background: '#fffbeb',
      text: '#92400e'
    },
    aestheticKeywords: ['premium', 'luxury', 'exclusive', 'gold', 'sophisticated', 'expensive'],
    visualPersonality: 'Premium luxury with gold accents and exclusive high-end aesthetic with rich sophisticated environment'
  },

  // Getting Weird - Stepping Outside Comfort Zone
  bold: {
    name: 'Bold',
    description: 'Dramatic villain energy with high-contrast impact',
    category: 'Getting Weird',
    colors: {
      primary: '#000000',   // Stark black (estimated)
      secondary: '#1f2937', // Dark gray
      accent: '#6b7280',    // Medium gray accent
      background: '#f9fafb',
      text: '#000000'
    },
    aestheticKeywords: ['dramatic', 'bold', 'high-contrast', 'villain', 'stark', 'impactful'],
    visualPersonality: 'Dramatic high-contrast with stark black environment and villain energy aesthetic'
  },
  modern: {
    name: 'Modern',
    description: 'Cyberpunk startup with electric neon innovation',
    category: 'Getting Weird',
    colors: {
      primary: '#0891b2',   // Electric cyan (estimated)
      secondary: '#06b6d4', // Neon cyan
      accent: '#67e8f9',    // Light cyan accent
      background: '#cffafe',
      text: '#0e7490'
    },
    aestheticKeywords: ['futuristic', 'cyberpunk', 'neon', 'tech', 'electric', 'innovative'],
    visualPersonality: 'Futuristic cyberpunk with electric cyan neon colors and tech-forward sci-fi aesthetic'
  },
  retro: {
    name: 'Retro',
    description: '80s synthwave nostalgia meets modern confusion',
    category: 'Getting Weird',
    colors: {
      primary: '#f97316',   // Orange sunset (estimated)
      secondary: '#dc2626', // Retro red
      accent: '#fbbf24',    // Sunset yellow accent
      background: '#fef3c7',
      text: '#ea580c'
    },
    aestheticKeywords: ['vintage', '80s', 'synthwave', 'retro', 'nostalgic', 'sunset'],
    visualPersonality: 'Vintage 80s synthwave with orange sunset colors and nostalgic aesthetic vibes'
  },

  // Research Lab - Unhinged Psychedelic Territory
  playful: {
    name: 'Playful',
    description: 'Kids cereal box meets acid trip experimental chaos',
    category: 'Research Lab',
    colors: {
      primary: '#a855f7',   // Psychedelic purple (estimated)
      secondary: '#ec4899', // Vibrant pink
      accent: '#f97316',    // Wild orange accent
      background: '#fef3c7',
      text: '#8b5cf6'
    },
    aestheticKeywords: ['psychedelic', 'chaotic', 'playful', 'rainbow', 'experimental', 'wild'],
    visualPersonality: 'Psychedelic rainbow with vibrant chaotic colors and kids cereal acid trip aesthetic'
  },
  creative: {
    name: 'Creative',
    description: 'Unhinged psychedelic research lab experimental madness',
    category: 'Research Lab',
    colors: {
      primary: '#dc2626',   // Experimental red (estimated)
      secondary: '#f59e0b', // Mad orange
      accent: '#8b5cf6',    // Purple accent
      background: '#c084fc',
      text: '#b91c1c'
    },
    aestheticKeywords: ['unhinged', 'experimental', 'chaotic', 'artistic', 'laboratory', 'madness'],
    visualPersonality: 'Unhinged experimental research lab with psychedelic chaos aesthetic and artistic madness'
  },
  monochrome: {
    name: 'Monochrome',
    description: 'Stark brutalist editorial chaos with architectural madness',
    category: 'Research Lab',
    colors: {
      primary: '#000000',   // Pure black (estimated)
      secondary: '#ffffff', // Pure white
      accent: '#374151',    // Gray accent
      background: '#e5e7eb',
      text: '#111827'
    },
    aestheticKeywords: ['brutalist', 'stark', 'editorial', 'architectural', 'minimal', 'harsh'],
    visualPersonality: 'Stark brutalist with pure black and white design and editorial chaos aesthetic'
  },

  // New AI-Generated Styles
  techno: {
    name: 'Techno',
    description: 'Futuristic cyberpunk with neon colors and holographic effects',
    category: 'Research Lab',
    colors: {
      primary: '#00ffff',   // Cyan neon
      secondary: '#ff00ff', // Magenta neon
      accent: '#00ff00',    // Green neon accent
      background: '#0a0a0a',
      text: '#ffffff'
    },
    aestheticKeywords: ['cyberpunk', 'neon', 'digital', 'holographic', 'futuristic', 'tech'],
    visualPersonality: 'Futuristic cyberpunk with electric neon colors and holographic tech aesthetic'
  },
  zen: {
    name: 'Zen',
    description: 'Minimal meditation with natural calm and balanced harmony',
    category: 'Normal Human',
    colors: {
      primary: '#8b9dc3',   // Calm blue-gray
      secondary: '#ddd6c1', // Warm beige
      accent: '#c9b59c',    // Soft tan accent
      background: '#f7f5f3',
      text: '#4a4a4a'
    },
    aestheticKeywords: ['calm', 'serene', 'balanced', 'meditative', 'japanese', 'mindful'],
    visualPersonality: 'Serene minimalist with balanced natural colors and meditative calm aesthetic'
  }
};

// Claude prompt refinement system
export interface UserPromptRefinement {
  originalPrompt: string;
  refinedPrompt: string;
  suggestedTone: Tone;
  colorScheme: string[];
  contentStrategy: string;
  visualDirection: string;
  targetAudience: string;
}

// Intelligent page generation with AI images and prompt refinement
export class IntelligentPageGenerator {
  
  /**
   * Refine user prompt using Claude's intelligence
   */
  async refineUserPrompt(originalPrompt: string): Promise<UserPromptRefinement> {
    // This would call Claude API in production
    // For now, we'll simulate intelligent refinement
    
    const analysis = this.analyzePromptCharacteristics(originalPrompt);
    
    return {
      originalPrompt,
      refinedPrompt: this.enhancePromptClarity(originalPrompt, analysis),
      suggestedTone: analysis.suggestedTone,
      colorScheme: Object.values(STYLE_DEFINITIONS[analysis.suggestedTone].colors),
      contentStrategy: analysis.contentStrategy,
      visualDirection: STYLE_DEFINITIONS[analysis.suggestedTone].visualPersonality,
      targetAudience: analysis.targetAudience
    };
  }

  /**
   * Generate page with AI images and intelligent style matching
   */
  async generateIntelligentPage(
    refinedPrompt: UserPromptRefinement,
    sections: string[] = ['hero', 'features', 'cta']
  ): Promise<{
    page: any;
    aiImages: Record<string, string>;
    styleRationale: string;
  }> {
    
    // Extract content from refined prompt
    const content = this.promptToContentGraph(refinedPrompt);
    
    // Generate brand tokens from style definition
    const brandTokens = this.styleToBrandTokens(refinedPrompt.suggestedTone);
    
    // Generate page using our existing system
    const pageResult = await generatePage(
      content,
      brandTokens,
      refinedPrompt.suggestedTone,
      sections as SectionKind[]
    );
    
    // Get AI images for the selected tone
    const aiImages = this.getAIImagesForTone(refinedPrompt.suggestedTone, sections as SectionKind[]);
    
    // Create rationale for style choice
    const styleRationale = this.generateStyleRationale(refinedPrompt);
    
    return {
      page: pageResult.primary,
      aiImages,
      styleRationale
    };
  }

  /**
   * Get AI images for a specific tone and sections
   */
  getAIImagesForTone(tone: Tone, sections: string[]): Record<string, string> {
    const aiImages: Record<string, string> = {};
    
    sections.forEach(section => {
      const image = imageProvider.getImageForToneSection(tone, section as any);
      if (image) {
        aiImages[`${tone}_${section}`] = image.src;
      }
    });
    
    return aiImages;
  }

  /**
   * Analyze prompt to determine characteristics and suggest appropriate style
   */
  private analyzePromptCharacteristics(prompt: string): {
    suggestedTone: Tone;
    contentStrategy: string;
    targetAudience: string;
    visualComplexity: 'simple' | 'moderate' | 'complex';
  } {
    const lowerPrompt = prompt.toLowerCase();
    
    // Keyword-based tone detection (would use Claude AI in production)
    if (lowerPrompt.includes('corporate') || lowerPrompt.includes('business') || lowerPrompt.includes('professional')) {
      return {
        suggestedTone: 'corporate',
        contentStrategy: 'Professional authority and trust-building',
        targetAudience: 'Business professionals and enterprise clients',
        visualComplexity: 'simple'
      };
    }
    
    if (lowerPrompt.includes('creative') || lowerPrompt.includes('artistic') || lowerPrompt.includes('experimental')) {
      return {
        suggestedTone: 'creative',
        contentStrategy: 'Bold experimentation and artistic expression',
        targetAudience: 'Creative professionals and artistic communities',
        visualComplexity: 'complex'
      };
    }
    
    if (lowerPrompt.includes('eco') || lowerPrompt.includes('sustainable') || lowerPrompt.includes('green')) {
      return {
        suggestedTone: 'nature',
        contentStrategy: 'Environmental consciousness and sustainability',
        targetAudience: 'Environmentally conscious consumers',
        visualComplexity: 'moderate'
      };
    }
    
    // Default to minimal for unclear prompts
    return {
      suggestedTone: 'minimal',
      contentStrategy: 'Clean simplicity and maximum clarity',
      targetAudience: 'General professional audience',
      visualComplexity: 'simple'
    };
  }

  /**
   * Enhance prompt clarity based on analysis
   */
  private enhancePromptClarity(original: string, analysis: any): string {
    const styleInfo = STYLE_DEFINITIONS[analysis.suggestedTone as Tone];
    
    return `${original}

Enhanced with ${styleInfo.name} aesthetic: ${styleInfo.visualPersonality}
Target audience: ${analysis.targetAudience}
Content strategy: ${analysis.contentStrategy}
Color palette: ${Object.values(styleInfo.colors).join(', ')}`;
  }

  /**
   * Convert refined prompt to ContentGraph structure
   */
  private promptToContentGraph(refinement: UserPromptRefinement): ContentGraph {
    // This would use Claude to intelligently extract content in production
    // For now, create a basic structure
    
    return {
      hero: {
        headline: this.extractHeadline(refinement.refinedPrompt),
        subheadline: refinement.contentStrategy,
      },
      features: {
        headline: 'Key Features',
        items: this.extractFeatures(refinement.refinedPrompt)
      },
      cta: {
        headline: 'Get Started',
        description: 'Ready to begin?',
        primaryAction: {
          label: 'Start Now',
          href: '/get-started'
        }
      }
    };
  }

  /**
   * Convert style definition to brand tokens
   */
  private styleToBrandTokens(tone: Tone): any {
    const style = STYLE_DEFINITIONS[tone];
    
    return {
      colors: {
        brand: this.createColorScale(style.colors.primary),
        gray: this.createGrayScale(),
      },
      fonts: {
        heading: this.getFontForStyle(tone, 'heading'),
        body: this.getFontForStyle(tone, 'body')
      },
      radius: this.getRadiusForStyle(tone),
      shadow: this.getShadowForStyle(tone),
      spacing: { tight: 0.8, normal: 1.0, relaxed: 1.2 }
    };
  }

  /**
   * Generate rationale for style choice
   */
  private generateStyleRationale(refinement: UserPromptRefinement): string {
    const style = STYLE_DEFINITIONS[refinement.suggestedTone];
    
    return `Selected ${style.name} style from the "${style.category}" category because: ${style.description}. This choice aligns with your content strategy of "${refinement.contentStrategy}" and targets "${refinement.targetAudience}".`;
  }

  // Utility methods
  private extractHeadline(prompt: string): string {
    // Simple extraction - would use Claude in production
    return prompt.split('.')[0] || 'Welcome';
  }

  private extractFeatures(prompt: string): string[] {
    // Simple extraction - would use Claude in production
    return ['Feature 1', 'Feature 2', 'Feature 3'];
  }

  private createColorScale(baseColor: string): Record<number, string> {
    // Generate Tailwind-style color scale from base color
    return {
      50: this.lightenColor(baseColor, 0.95),
      500: baseColor,
      900: this.darkenColor(baseColor, 0.7)
    };
  }

  private createGrayScale(): Record<number, string> {
    return {
      50: '#f9fafb',
      500: '#6b7280',
      900: '#111827'
    };
  }

  private getFontForStyle(tone: Tone, type: 'heading' | 'body'): string {
    const fonts = {
      minimal: { heading: 'Inter', body: 'Inter' },
      corporate: { heading: 'system-ui', body: 'system-ui' },
      elegant: { heading: 'Georgia', body: 'system-ui' },
      creative: { heading: 'Space Grotesk', body: 'Inter' },
      bold: { heading: 'Space Grotesk', body: 'Inter' },
      playful: { heading: 'Fredoka', body: 'Open Sans' },
      warm: { heading: 'Poppins', body: 'Open Sans' },
      nature: { heading: 'Nunito', body: 'Nunito Sans' },
      luxury: { heading: 'Cormorant Garamond', body: 'Lora' },
      modern: { heading: 'JetBrains Mono', body: 'Roboto' },
      retro: { heading: 'Righteous', body: 'Roboto' },
      monochrome: { heading: 'IBM Plex Mono', body: 'IBM Plex Sans' },
      techno: { heading: 'Orbitron', body: 'Roboto Mono' },
      zen: { heading: 'Noto Sans JP', body: 'Noto Sans' }
    };
    
    return (fonts as any)[tone]?.[type] || 'system-ui';
  }

  private getRadiusForStyle(tone: Tone): any {
    const radiusMap = {
      minimal: { sm: '0.125rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
      creative: { sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
      playful: { sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
      techno: { sm: '0rem', md: '0.25rem', lg: '0.5rem', xl: '0.75rem' },
      zen: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' }
    };
    
    return (radiusMap as any)[tone] || radiusMap.minimal;
  }

  private getShadowForStyle(tone: Tone): any {
    return {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    };
  }

  private lightenColor(color: string, amount: number): string {
    // Simple color manipulation - would use proper color library in production
    return color;
  }

  private darkenColor(color: string, amount: number): string {
    // Simple color manipulation - would use proper color library in production  
    return color;
  }
}

// Export singleton instance
export const intelligentPageGenerator = new IntelligentPageGenerator();