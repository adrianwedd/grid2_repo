// Free image generation using Pollinations.ai
// No API key required - completely free!

import type { Tone } from '@/types/section-system';

// Image style prompts for different tones
const TONE_IMAGE_STYLES: Record<Tone, string> = {
  minimal: 'minimalist, clean, white space, simple geometric shapes, monochrome',
  bold: 'high contrast, dramatic lighting, powerful, intense colors, dynamic composition',
  playful: 'colorful, fun, whimsical, cartoon style, bright and cheerful',
  corporate: 'professional, business, office environment, modern architecture, blue tones',
  elegant: 'sophisticated, luxury, refined, subtle gradients, premium textures',
  modern: 'futuristic, neon lights, cyberpunk, tech, holographic, blue and purple',
  warm: 'cozy, autumn colors, soft lighting, comfortable, orange and brown tones',
  luxury: 'gold accents, marble textures, premium materials, elegant lighting',
  creative: 'abstract art, paint splashes, vibrant colors, artistic chaos',
  nature: 'natural landscapes, green environment, organic shapes, earth tones',
  retro: '80s style, synthwave, neon pink and blue, vintage aesthetics',
  monochrome: 'black and white, high contrast, dramatic shadows, minimalist',
  techno: 'digital matrix, circuit boards, cyber aesthetic, green code rain',
  zen: 'peaceful, meditation, japanese garden, calm water, minimal elements'
};

// Section-specific image prompts
const SECTION_PROMPTS: Record<string, string> = {
  hero: 'hero banner, wide landscape, main focal point',
  features: 'abstract geometric patterns, feature showcase, grid layout',
  cta: 'action oriented, dynamic movement, call to action background',
  testimonials: 'people, faces, social proof, community',
  about: 'company story, journey, timeline, heritage',
  footer: 'subtle pattern, foundation, base texture'
};

export class FreeImageGenerator {
  private baseUrl = 'https://image.pollinations.ai/prompt';
  
  /**
   * Generate a free AI image URL for any prompt
   * No API key required!
   */
  generateImageUrl(
    prompt: string,
    options?: {
      width?: number;
      height?: number;
      seed?: number;
      model?: string;
    }
  ): string {
    const { 
      width = 1792, 
      height = 1024,
      seed,
      model = 'flux' // or 'turbo' for faster generation
    } = options || {};
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Build URL with parameters
    let url = `${this.baseUrl}/${encodedPrompt}`;
    
    // Add optional parameters
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    if (seed) params.append('seed', seed.toString());
    if (model) params.append('model', model);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return url;
  }
  
  /**
   * Generate an image URL for a specific tone and section
   */
  generateForToneSection(
    tone: Tone,
    section: string,
    customPrompt?: string
  ): string {
    // Build comprehensive prompt
    const toneStyle = TONE_IMAGE_STYLES[tone] || TONE_IMAGE_STYLES.minimal;
    const sectionStyle = SECTION_PROMPTS[section] || 'abstract background';
    
    const prompt = customPrompt 
      ? `${customPrompt}, ${toneStyle}, ${sectionStyle}`
      : `${toneStyle}, ${sectionStyle}, professional web design, high quality, 4k`;
    
    // Determine dimensions based on section
    const dimensions = this.getDimensionsForSection(section);
    
    return this.generateImageUrl(prompt, dimensions);
  }
  
  /**
   * Generate a batch of images for all sections of a tone
   */
  generateToneSet(tone: Tone): Record<string, string> {
    const sections = ['hero', 'features', 'cta', 'testimonials', 'about', 'footer'];
    const images: Record<string, string> = {};
    
    sections.forEach(section => {
      images[section] = this.generateForToneSection(tone, section);
    });
    
    return images;
  }
  
  /**
   * Generate creative, contextual images based on content
   */
  generateContextualImage(
    content: string,
    tone: Tone,
    style?: string
  ): string {
    const toneStyle = TONE_IMAGE_STYLES[tone];
    const prompt = `${content}, ${toneStyle}, ${style || 'digital art'}, trending on artstation`;
    
    return this.generateImageUrl(prompt);
  }
  
  /**
   * Get appropriate dimensions for different sections
   */
  private getDimensionsForSection(section: string): { width: number; height: number } {
    const dimensions: Record<string, { width: number; height: number }> = {
      hero: { width: 1792, height: 1024 },
      features: { width: 1024, height: 1024 },
      cta: { width: 1792, height: 600 },
      testimonials: { width: 800, height: 800 },
      about: { width: 1200, height: 800 },
      footer: { width: 1792, height: 400 }
    };
    
    return dimensions[section] || { width: 1024, height: 1024 };
  }
  
  /**
   * Generate fun, creative images with specific moods
   */
  generateMoodImage(mood: string, style?: string): string {
    const moodPrompts: Record<string, string> = {
      happy: 'joyful celebration, bright colors, smiling, sunshine, rainbow',
      epic: 'epic scale, dramatic landscape, heroic, cinematic, awe-inspiring',
      calm: 'peaceful, serene, tranquil water, soft clouds, meditation',
      energetic: 'dynamic action, motion blur, explosion of colors, high energy',
      mysterious: 'dark atmospheric, fog, shadows, enigmatic, hidden secrets',
      funny: 'hilarious, cartoon, meme style, absurd, comedy',
      inspirational: 'motivational, sunrise, mountain peak, achievement, success',
      romantic: 'soft pink, hearts, dreamy atmosphere, love, roses',
      scary: 'horror aesthetic, dark shadows, spooky, halloween',
      futuristic: 'sci-fi, neon city, flying cars, holographic, year 3000'
    };
    
    const prompt = `${moodPrompts[mood] || mood}, ${style || 'digital art'}, masterpiece, high quality`;
    return this.generateImageUrl(prompt);
  }
}

// Export singleton instance
export const freeImageGenerator = new FreeImageGenerator();

// Helper function to get image URL instantly (no async needed!)
export function getInstantImageUrl(prompt: string): string {
  return freeImageGenerator.generateImageUrl(prompt);
}

// Generate themed images for Grid 2.0
export function generateGridImages(tone: Tone): Record<string, string> {
  const prompts: Record<string, string> = {
    hero: `${TONE_IMAGE_STYLES[tone]}, website hero banner, modern web design, stunning visuals`,
    features: `${TONE_IMAGE_STYLES[tone]}, feature grid, geometric patterns, tech innovation`,
    cta: `${TONE_IMAGE_STYLES[tone]}, call to action background, conversion focused, dynamic`,
    testimonials: `${TONE_IMAGE_STYLES[tone]}, happy customers, social proof, success stories`,
    pricing: `${TONE_IMAGE_STYLES[tone]}, pricing table background, value proposition`,
    footer: `${TONE_IMAGE_STYLES[tone]}, footer texture, subtle pattern, foundation`
  };
  
  const images: Record<string, string> = {};
  Object.entries(prompts).forEach(([section, prompt]) => {
    images[section] = getInstantImageUrl(prompt);
  });
  
  return images;
}