// Image provider system for style-specific images
import type { Tone, SectionKind, MediaAsset } from '@/types/section-system';

interface ImageManifest {
  [tone: string]: {
    [section: string]: {
      filename: string;
      filepath?: string;
      style?: string;
      colors?: string[];
      dimensions?: string;
      type?: string;
      url?: string;
      prompt?: string;
      timestamp?: number;
      error?: string;
    }
  }
}

class ImageProvider {
  private placeholderManifest: ImageManifest | null = null;
  private aiManifest: ImageManifest | null = null;
  private generatedManifest: ImageManifest | null = null;
  private manifestsInitialized = false;

  constructor() {
    this.initializeManifests();
  }

  private async initializeManifests() {
    // Use fetch for both client and server side to ensure consistency
    const isServerSide = typeof window === 'undefined';
    
    try {
      // Determine base URL for server-side requests
      // In production, use the actual deployment URL
      let baseUrl = '';
      if (isServerSide) {
        if (process.env.VERCEL_URL) {
          baseUrl = `https://${process.env.VERCEL_URL}`;
        } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
          baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
        } else if (process.env.NODE_ENV === 'production') {
          baseUrl = 'https://grid2repo.vercel.app';
        } else {
          baseUrl = 'http://localhost:3000';
        }
      }
      
      const aiResponse = await fetch(`${baseUrl}/generated-images/ai-patient-manifest.json`);
      if (aiResponse.ok) {
        this.aiManifest = await aiResponse.json();
        this.manifestsInitialized = true;
        console.log(`✅ Loaded AI images manifest (${isServerSide ? 'server' : 'client'}) with ${this.aiManifest ? Object.keys(this.aiManifest).length : 0} tones`);
      } else {
        console.warn('Failed to fetch AI manifest:', aiResponse.status, aiResponse.statusText);
      }
    } catch (error) {
      console.warn('Failed to load AI manifest:', error);
    }

    try {
      // Use same base URL determination
      let baseUrl = '';
      if (isServerSide) {
        if (process.env.VERCEL_URL) {
          baseUrl = `https://${process.env.VERCEL_URL}`;
        } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
          baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
        } else if (process.env.NODE_ENV === 'production') {
          baseUrl = 'https://grid2repo.vercel.app';
        } else {
          baseUrl = 'http://localhost:3000';
        }
      }
      
      const placeholderResponse = await fetch(`${baseUrl}/generated-images/placeholder-manifest.json`);
      if (placeholderResponse.ok) {
        this.placeholderManifest = await placeholderResponse.json();
        console.log(`✅ Loaded placeholder manifest (${isServerSide ? 'server' : 'client'})`);
      }
    } catch (error) {
      console.warn('Failed to load placeholder manifest:', error);
    }

    try {
      // Use same base URL determination
      let baseUrl = '';
      if (isServerSide) {
        if (process.env.VERCEL_URL) {
          baseUrl = `https://${process.env.VERCEL_URL}`;
        } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
          baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
        } else if (process.env.NODE_ENV === 'production') {
          baseUrl = 'https://grid2repo.vercel.app';
        } else {
          baseUrl = 'http://localhost:3000';
        }
      }
      
      const generatedResponse = await fetch(`${baseUrl}/generated-images/image-manifest.json`);
      if (generatedResponse.ok) {
        this.generatedManifest = await generatedResponse.json();
        console.log(`✅ Loaded generated manifest (${isServerSide ? 'server' : 'client'})`);
      }
    } catch (error) {
      console.warn('Failed to load generated manifest:', error);
    }
  }

  private ensureManifestsLoaded() {
    // Try to reload AI manifest if it's not loaded yet and we haven't tried initializing
    if (!this.aiManifest && !this.manifestsInitialized) {
      console.log('🔄 Attempting to initialize manifests...');
      this.initializeManifests();
    }
    
    // ONLY create placeholder manifest if we have NO AI images at all
    // This was the bug - it was always creating placeholders even when AI images existed
    if (!this.placeholderManifest && !this.aiManifest) {
      this.placeholderManifest = {
        // Safe & Boring
        minimal: {
          hero: { filename: 'minimal-hero-placeholder.svg', style: 'Clean white background', colors: ['#ffffff', '#f8fafc', '#e2e8f0'], dimensions: '1792x1024' },
          features: { filename: 'minimal-features-placeholder.svg', style: 'Minimalist icons', colors: ['#ffffff', '#64748b', '#94a3b8'], dimensions: '1024x1024' },
          cta: { filename: 'minimal-cta-placeholder.svg', style: 'Soft gradient', colors: ['#ffffff', '#f1f5f9', '#e2e8f0'], dimensions: '1024x1024' }
        },
        corporate: {
          hero: { filename: 'corporate-hero-placeholder.svg', style: 'Professional blue gradient', colors: ['#1e40af', '#3b82f6', '#60a5fa'], dimensions: '1792x1024' },
          features: { filename: 'corporate-features-placeholder.svg', style: 'Professional icons', colors: ['#1d4ed8', '#2563eb', '#60a5fa'], dimensions: '1024x1024' },
          cta: { filename: 'corporate-cta-placeholder.svg', style: 'Subtle blue gradient', colors: ['#1e40af', '#3b82f6', '#dbeafe'], dimensions: '1024x1024' }
        },
        elegant: {
          hero: { filename: 'elegant-hero-placeholder.svg', style: 'Sophisticated gray composition', colors: ['#475569', '#64748b', '#e2e8f0'], dimensions: '1792x1024' },
          features: { filename: 'elegant-features-placeholder.svg', style: 'Refined icons', colors: ['#64748b', '#94a3b8', '#cbd5e1'], dimensions: '1024x1024' },
          cta: { filename: 'elegant-cta-placeholder.svg', style: 'Premium gray gradient', colors: ['#475569', '#64748b', '#f1f5f9'], dimensions: '1024x1024' }
        },
        // Normal Human
        warm: {
          hero: { filename: 'warm-hero-placeholder.svg', style: 'Cozy autumn colors', colors: ['#f59e0b', '#f97316', '#fed7aa'], dimensions: '1792x1024' },
          features: { filename: 'warm-features-placeholder.svg', style: 'Friendly warm icons', colors: ['#f59e0b', '#f97316', '#fbbf24'], dimensions: '1024x1024' },
          cta: { filename: 'warm-cta-placeholder.svg', style: 'Inviting orange gradient', colors: ['#f59e0b', '#f97316', '#fef3c7'], dimensions: '1024x1024' }
        },
        nature: {
          hero: { filename: 'nature-hero-placeholder.svg', style: 'Fresh green environment', colors: ['#059669', '#10b981', '#a7f3d0'], dimensions: '1792x1024' },
          features: { filename: 'nature-features-placeholder.svg', style: 'Eco-friendly icons', colors: ['#059669', '#10b981', '#6ee7b7'], dimensions: '1024x1024' },
          cta: { filename: 'nature-cta-placeholder.svg', style: 'Natural green gradient', colors: ['#059669', '#10b981', '#ecfdf5'], dimensions: '1024x1024' }
        },
        luxury: {
          hero: { filename: 'luxury-hero-placeholder.svg', style: 'Premium gold accents', colors: ['#d97706', '#f59e0b', '#fef3c7'], dimensions: '1792x1024' },
          features: { filename: 'luxury-features-placeholder.svg', style: 'Luxury gold icons', colors: ['#d97706', '#f59e0b', '#fbbf24'], dimensions: '1024x1024' },
          cta: { filename: 'luxury-cta-placeholder.svg', style: 'Exclusive gold gradient', colors: ['#d97706', '#f59e0b', '#fffbeb'], dimensions: '1024x1024' }
        },
        // Getting Weird
        bold: {
          hero: { filename: 'bold-hero-placeholder.svg', style: 'Dramatic high contrast', colors: ['#000000', '#1f2937', '#6b7280'], dimensions: '1792x1024' },
          features: { filename: 'bold-features-placeholder.svg', style: 'Stark contrast icons', colors: ['#000000', '#374151', '#9ca3af'], dimensions: '1024x1024' },
          cta: { filename: 'bold-cta-placeholder.svg', style: 'Bold dramatic gradient', colors: ['#000000', '#1f2937', '#f9fafb'], dimensions: '1024x1024' }
        },
        modern: {
          hero: { filename: 'modern-hero-placeholder.svg', style: 'Cyberpunk cyan neon', colors: ['#0891b2', '#06b6d4', '#67e8f9'], dimensions: '1792x1024' },
          features: { filename: 'modern-features-placeholder.svg', style: 'Tech futuristic icons', colors: ['#0891b2', '#06b6d4', '#22d3ee'], dimensions: '1024x1024' },
          cta: { filename: 'modern-cta-placeholder.svg', style: 'Electric cyan gradient', colors: ['#0891b2', '#06b6d4', '#cffafe'], dimensions: '1024x1024' }
        },
        retro: {
          hero: { filename: 'retro-hero-placeholder.svg', style: '80s synthwave sunset', colors: ['#f97316', '#dc2626', '#fbbf24'], dimensions: '1792x1024' },
          features: { filename: 'retro-features-placeholder.svg', style: 'Vintage synthwave icons', colors: ['#f97316', '#dc2626', '#fb923c'], dimensions: '1024x1024' },
          cta: { filename: 'retro-cta-placeholder.svg', style: 'Nostalgic sunset gradient', colors: ['#f97316', '#dc2626', '#fef3c7'], dimensions: '1024x1024' }
        },
        // Research Lab
        playful: {
          hero: { filename: 'playful-hero-placeholder.svg', style: 'Psychedelic rainbow chaos', colors: ['#a855f7', '#ec4899', '#f97316'], dimensions: '1792x1024' },
          features: { filename: 'playful-features-placeholder.svg', style: 'Chaotic fun icons', colors: ['#8b5cf6', '#d946ef', '#f59e0b'], dimensions: '1024x1024' },
          cta: { filename: 'playful-cta-placeholder.svg', style: 'Wild rainbow gradient', colors: ['#9333ea', '#e879f9', '#f97316'], dimensions: '1024x1024' }
        },
        creative: {
          hero: { filename: 'creative-hero-placeholder.svg', style: 'Experimental chaos madness', colors: ['#dc2626', '#f59e0b', '#8b5cf6'], dimensions: '1792x1024' },
          features: { filename: 'creative-features-placeholder.svg', style: 'Unhinged creative icons', colors: ['#dc2626', '#f59e0b', '#a855f7'], dimensions: '1024x1024' },
          cta: { filename: 'creative-cta-placeholder.svg', style: 'Chaotic creative gradient', colors: ['#dc2626', '#f59e0b', '#c084fc'], dimensions: '1024x1024' }
        },
        monochrome: {
          hero: { filename: 'monochrome-hero-placeholder.svg', style: 'Stark brutalist black/white', colors: ['#000000', '#ffffff', '#374151'], dimensions: '1792x1024' },
          features: { filename: 'monochrome-features-placeholder.svg', style: 'Brutal editorial icons', colors: ['#000000', '#ffffff', '#6b7280'], dimensions: '1024x1024' },
          cta: { filename: 'monochrome-cta-placeholder.svg', style: 'Harsh contrast gradient', colors: ['#000000', '#ffffff', '#e5e7eb'], dimensions: '1024x1024' }
        }
      };
    }
  }

  /**
   * Get appropriate image for a tone and section
   */
  getImageForToneSection(tone: Tone, sectionKind: SectionKind): MediaAsset | null {
    // Ensure manifests are loaded (use fallback if needed)
    this.ensureManifestsLoaded();
    
    // Priority order: AI images > Generated images > Placeholders
    // DEBUG: Force AI manifest to be used if available
    console.log('🔍 Image provider debug:', {
      aiManifest: !!this.aiManifest,
      generatedManifest: !!this.generatedManifest,
      placeholderManifest: !!this.placeholderManifest,
      tone,
      sectionKind,
      manifestsInitialized: this.manifestsInitialized
    });
    
    // Force priority to AI manifest when available
    let manifest = this.aiManifest;
    if (!manifest) manifest = this.generatedManifest;
    if (!manifest) manifest = this.placeholderManifest;
    
    console.log('📝 Using manifest type:', 
      this.aiManifest ? 'AI' : 
      this.generatedManifest ? 'Generated' : 
      this.placeholderManifest ? 'Placeholder' : 'None'
    );
    
    if (!manifest) {
      return null;
    }

    const toneData = manifest[tone];
    if (!toneData) {
      return null;
    }

    // Map section kinds to image categories
    const sectionMapping: Record<SectionKind, string> = {
      hero: 'hero',
      features: 'features', 
      about: 'hero', // Use hero image for about sections
      testimonials: 'features', // Use features style for testimonials
      cta: 'cta',
      footer: 'cta', // Use CTA style for footer
      blog: 'features', // Use features style for blog
      contact: 'cta', // Use CTA style for contact
      gallery: 'hero', // Use hero style for gallery
      navigation: 'features', // Use features style for navigation
      pricing: 'features' // Use features style for pricing
    };

    const imageCategory = sectionMapping[sectionKind];
    const imageData = toneData[imageCategory];

    if (!imageData || imageData.error) {
      return null;
    }

    // Determine the public URL path
    const publicPath = `/generated-images/${imageData.filename}`;
    
    // Parse dimensions if available
    let width = 1024;
    let height = 1024;
    
    if (imageData.dimensions) {
      const [w, h] = imageData.dimensions.split('x').map(Number);
      width = w || 1024;
      height = h || 1024;
    }

    return {
      src: publicPath,
      alt: `${tone} ${sectionKind} background - ${imageData.style || 'Generated image'}`,
      width,
      height,
      kind: 'image'
    };
  }

  /**
   * Get all available images for a tone
   */
  getImagesForTone(tone: Tone): Record<string, MediaAsset | null> {
    return {
      hero: this.getImageForToneSection(tone, 'hero'),
      features: this.getImageForToneSection(tone, 'features'),
      about: this.getImageForToneSection(tone, 'about'),
      testimonials: this.getImageForToneSection(tone, 'testimonials'),
      cta: this.getImageForToneSection(tone, 'cta'),
      footer: this.getImageForToneSection(tone, 'footer')
    };
  }

  /**
   * Get stats about available images
   */
  getImageStats(): {
    placeholders: number;
    generated: number;
    aiGenerated: number;
    tones: string[];
    sections: string[];
  } {
    const placeholderCount = this.placeholderManifest 
      ? Object.values(this.placeholderManifest).reduce((acc, tone) => acc + Object.keys(tone).length, 0)
      : 0;

    const generatedCount = this.generatedManifest
      ? Object.values(this.generatedManifest).reduce((acc, tone) => acc + Object.keys(tone).filter(key => !tone[key].error).length, 0)
      : 0;

    const aiGeneratedCount = this.aiManifest
      ? Object.values(this.aiManifest).reduce((acc, tone) => acc + Object.keys(tone).filter(key => !tone[key].error).length, 0)
      : 0;

    // Use AI manifest for tones/sections if available, fallback to placeholders
    const activeManifest = this.aiManifest || this.placeholderManifest;
    const tones = activeManifest ? Object.keys(activeManifest) : [];
    const sections = activeManifest 
      ? Object.keys(Object.values(activeManifest)[0] || {})
      : [];

    return {
      placeholders: placeholderCount,
      generated: generatedCount,
      aiGenerated: aiGeneratedCount,
      tones,
      sections
    };
  }

  /**
   * Refresh manifests (useful for hot reloading)
   */
  refresh() {
    this.initializeManifests();
  }
}

// Export singleton instance
export const imageProvider = new ImageProvider();

// Helper function to get contextual images for sections
export function getContextualMedia(tone: Tone, sectionKind: SectionKind): MediaAsset[] {
  const image = imageProvider.getImageForToneSection(tone, sectionKind);
  console.log(`🖼️ Getting image for ${tone} ${sectionKind}:`, image ? 'Found' : 'Not found', image?.src);
  return image ? [image] : [];
}