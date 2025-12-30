// Image provider system for style-specific images
import type { Tone, SectionKind, MediaAsset } from '@/types/section-system';
import { uniqueImageProvider } from './unique-image-provider';

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

// Control verbosity - silent by default in CLI/test environments
const VERBOSE_LOGGING = process.env.DEBUG_IMAGE_PROVIDER === 'true';

class ImageProvider {
  private placeholderManifest: ImageManifest | null = null;
  private aiManifest: ImageManifest | null = null;
  private generatedManifest: ImageManifest | null = null;
  private manifestsInitialized = false;
  private initPromise: Promise<void> | null = null;
  private hasTriedInit = false;

  constructor() {
    this.initPromise = this.initializeManifests();
  }

  private async initializeManifests() {
    this.hasTriedInit = true;
    const isServerSide = typeof window === 'undefined';

    // Determine base URL for server-side requests
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

    // Try to load AI manifest (silently fail if unavailable)
    try {
      const aiResponse = await fetch(`${baseUrl}/generated-images/ai-patient-manifest.json`);
      if (aiResponse.ok) {
        this.aiManifest = await aiResponse.json();
        this.manifestsInitialized = true;
        if (VERBOSE_LOGGING) {
          console.log(`✅ Loaded AI images manifest with ${this.aiManifest ? Object.keys(this.aiManifest).length : 0} tones`);
        }
      }
    } catch {
      // Silently fail - this is expected in CLI/test environments
    }

    // Try to load placeholder manifest (silently fail if unavailable)
    try {
      const placeholderResponse = await fetch(`${baseUrl}/generated-images/placeholder-manifest.json`);
      if (placeholderResponse.ok) {
        this.placeholderManifest = await placeholderResponse.json();
      }
    } catch {
      // Silently fail
    }

    // Try to load generated manifest (silently fail if unavailable)
    try {
      const generatedResponse = await fetch(`${baseUrl}/generated-images/image-manifest.json`);
      if (generatedResponse.ok) {
        this.generatedManifest = await generatedResponse.json();
      }
    } catch {
      // Silently fail
    }
  }

  private ensureManifestsLoaded() {
    // Try to reload AI manifest if it's not loaded yet and we haven't tried initializing
    if (!this.aiManifest && !this.manifestsInitialized) {
      this.initializeManifests();
    }
  }

  /**
   * Get appropriate image for a tone and section
   */
  async getImageForToneSection(tone: Tone, sectionKind: SectionKind): Promise<MediaAsset | null> {
    // First priority: Try unique AI-generated images
    await uniqueImageProvider.waitForInit();

    const uniqueImage = uniqueImageProvider.getImageForStyle(tone, sectionKind);
    if (uniqueImage) {
      if (VERBOSE_LOGGING) {
        console.log(`🎨 Using unique AI image for ${tone} ${sectionKind}`);
      }
      return uniqueImage;
    }

    // Wait for manifest loading to complete (only once)
    if (!this.aiManifest && this.initPromise && !this.hasTriedInit) {
      await this.initPromise;
    }

    // Use AI manifest if available (no fallbacks)
    const manifest = this.aiManifest;
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
      about: 'hero',
      testimonials: 'features',
      cta: 'cta',
      footer: 'cta',
      blog: 'features',
      contact: 'cta',
      gallery: 'hero',
      navigation: 'features',
      pricing: 'features',
      faq: 'features'
    };

    const imageCategory = sectionMapping[sectionKind];
    const imageData = toneData[imageCategory];

    if (!imageData || imageData.error) {
      return null;
    }

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
  async getImagesForTone(tone: Tone): Promise<Record<string, MediaAsset | null>> {
    return {
      hero: await this.getImageForToneSection(tone, 'hero'),
      features: await this.getImageForToneSection(tone, 'features'),
      about: await this.getImageForToneSection(tone, 'about'),
      testimonials: await this.getImageForToneSection(tone, 'testimonials'),
      cta: await this.getImageForToneSection(tone, 'cta'),
      footer: await this.getImageForToneSection(tone, 'footer')
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
export async function getContextualMedia(tone: Tone, sectionKind: SectionKind): Promise<MediaAsset[]> {
  const image = await imageProvider.getImageForToneSection(tone, sectionKind);
  return image ? [image] : [];
}