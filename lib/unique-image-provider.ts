// Unique AI-generated image provider for all 32 styles
import type { Tone, SectionKind, MediaAsset } from '@/types/section-system';

interface UniqueImageManifest {
  generated: string;
  totalStyles: number;
  totalImages: number;
  provider: string;
  styles: Array<{
    id: string;
    name: string;
    tone: Tone;
    images: {
      hero: string;
      feature1: string;
      feature2: string;
      feature3: string;
      cta: string;
    };
  }>;
}

class UniqueImageProvider {
  private manifest: UniqueImageManifest | null = null;
  private styleMap: Map<string, any> = new Map();
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.loadManifest();
  }

  private async loadManifest(): Promise<void> {
    try {
      const isServerSide = typeof window === 'undefined';
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

      const response = await fetch(`${baseUrl}/images/ai-generated/manifest.json`);
      
      if (response.ok) {
        this.manifest = await response.json();
        
        // Create lookup map for fast access
        if (this.manifest?.styles) {
          this.manifest.styles.forEach(style => {
            this.styleMap.set(style.id, style);
            // Also map by tone for backward compatibility
            this.styleMap.set(style.tone, style);
          });
        }
        
        console.log(`✅ Loaded unique images manifest with ${this.manifest?.totalImages || 0} images for ${this.manifest?.totalStyles || 0} styles`);
      } else {
        console.warn('Unique images manifest not found, falling back to existing system');
      }
    } catch (error) {
      console.warn('Failed to load unique images manifest:', error);
    }
  }

  async waitForInit(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  // Get image for a specific style and section
  getImageForStyle(styleId: string, sectionKind: SectionKind): MediaAsset | null {
    if (!this.manifest) return null;

    const style = this.styleMap.get(styleId);
    if (!style) return null;

    let imageType: keyof typeof style.images;
    
    // Map section kinds to image types
    switch (sectionKind) {
      case 'hero':
        imageType = 'hero';
        break;
      case 'features':
        imageType = 'feature1'; // Could rotate between feature1, feature2, feature3
        break;
      case 'about':
        imageType = 'feature2';
        break;
      case 'testimonials':
        imageType = 'feature3';
        break;
      case 'cta':
        imageType = 'cta';
        break;
      case 'footer':
        imageType = 'cta'; // Use CTA image for footer
        break;
      default:
        imageType = 'feature1';
    }

    const imagePath = style.images[imageType];
    if (!imagePath) return null;

    return {
      kind: 'image',
      src: imagePath,
      alt: `${style.name} ${sectionKind} image - AI-generated for ${style.name} style`
    };
  }

  // Get multiple images for a section (like features with multiple items)
  getImagesForStyle(styleId: string, sectionKind: SectionKind, count: number = 1): MediaAsset[] {
    if (!this.manifest || count <= 0) return [];

    const style = this.styleMap.get(styleId);
    if (!style) return [];

    const images: MediaAsset[] = [];
    const availableTypes: Array<keyof typeof style.images> = ['feature1', 'feature2', 'feature3'];
    
    // For hero and CTA, use specific images
    if (sectionKind === 'hero') {
      const heroImage = this.getImageForStyle(styleId, 'hero');
      return heroImage ? [heroImage] : [];
    }
    
    if (sectionKind === 'cta') {
      const ctaImage = this.getImageForStyle(styleId, 'cta');
      return ctaImage ? [ctaImage] : [];
    }

    // For other sections, use feature images
    for (let i = 0; i < Math.min(count, availableTypes.length); i++) {
      const imageType = availableTypes[i];
      const imagePath = style.images[imageType];
      
      if (imagePath) {
        images.push({
          kind: 'image',
          src: imagePath,
          alt: `${style.name} ${sectionKind} image ${i + 1} - AI-generated for ${style.name} style`
        });
      }
    }

    return images;
  }

  // Check if unique images are available for a style
  hasUniqueImages(styleId: string): boolean {
    return this.styleMap.has(styleId);
  }

  // Get stats about available images
  getStats() {
    if (!this.manifest) {
      return {
        available: false,
        totalStyles: 0,
        totalImages: 0,
        provider: 'none'
      };
    }

    return {
      available: true,
      totalStyles: this.manifest.totalStyles,
      totalImages: this.manifest.totalImages,
      provider: this.manifest.provider,
      generated: this.manifest.generated
    };
  }

  // List all available style IDs
  getAvailableStyles(): string[] {
    if (!this.manifest) return [];
    return this.manifest.styles.map(style => style.id);
  }
}

// Export singleton instance
export const uniqueImageProvider = new UniqueImageProvider();