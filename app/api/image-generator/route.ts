import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

// Simple in-memory cache for browser instance
let browserInstance: any = null;
let lastUsed = Date.now();

// Close browser after 5 minutes of inactivity
const BROWSER_TIMEOUT = 5 * 60 * 1000;

async function getBrowser() {
  // Check if we need to close stale browser
  if (browserInstance && Date.now() - lastUsed > BROWSER_TIMEOUT) {
    await browserInstance.close();
    browserInstance = null;
  }

  if (!browserInstance) {
    console.log('Starting new ChatGPT browser instance...');
    browserInstance = await chromium.launch({
      headless: process.env.NODE_ENV === 'production',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  lastUsed = Date.now();
  return browserInstance;
}

export async function POST(request: NextRequest) {
  try {
    const { sections, spec, mode = 'prompts', imageUrls } = await request.json();

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections array required' },
        { status: 400 }
      );
    }

    // Apply images to sections (when user provides generated images)
    if (mode === 'apply' && imageUrls) {
      const updatedSections = sections.map((section: any) => {
        if (imageUrls[section.id]) {
          return {
            ...section,
            props: {
              ...section.props,
              media: [{
                src: imageUrls[section.id],
                alt: `Generated image for ${section.kind} section`,
                width: 1200,
                height: 800,
                type: 'image' as const
              }]
            }
          };
        }
        return section;
      });

      return NextResponse.json({
        ok: true,
        mode: 'applied',
        updatedSections,
        appliedImages: Object.keys(imageUrls).length
      });
    }

    // Generate prompts for manual use (default mode due to Cloudflare blocking)
    if (mode === 'prompts') {
      const prompts: Record<string, { prompt: string; sectionKind: string }> = {};

      // Generate prompts for each section that needs an image
      for (const section of sections) {
        if (shouldGenerateImage(section)) {
          const prompt = generateImagePrompt(section, spec);
          prompts[section.id] = {
            prompt,
            sectionKind: section.kind
          };
        }
      }

      return NextResponse.json({
        ok: true,
        mode: 'manual',
        prompts,
        total: Object.keys(prompts).length,
        instructions: 'Copy each prompt to ChatGPT manually to generate images. Cloudflare blocks automated access.'
      });
    }

    // Automated mode (currently blocked by Cloudflare but kept for future)
    return NextResponse.json({
      error: 'Automated mode temporarily disabled due to Cloudflare blocking. Use manual mode instead.',
      details: 'Set mode: "prompts" to get prompts for manual ChatGPT input'
    }, { status: 503 });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Image generation failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

function shouldGenerateImage(section: any): boolean {
  // Determine which sections need images
  const imageableSections = ['hero', 'about', 'features'];
  return imageableSections.includes(section.kind);
}

function generateImagePrompt(section: any, spec?: any): string {
  const { kind, props } = section;
  
  // Extract brand details from spec
  const philosophy = spec?.cached?.philosophy || spec?.philosophy || '';
  const personality = spec?.cached?.personality || spec?.personality || '';
  const colors = spec?.spec?.brandTokens?.colors || {};
  const visualStyle = spec?.spec?.visualStyle || {};
  const mood = visualStyle.mood || 'modern';
  const tone = visualStyle.tone || 'professional';
  
  // Build color palette description
  const colorDesc = [];
  if (colors.primary) colorDesc.push(`primary color ${colors.primary}`);
  if (colors.secondary) colorDesc.push(`accent ${colors.secondary}`);
  if (colors.accent) colorDesc.push(`highlights ${colors.accent}`);
  const colorPalette = colorDesc.length > 0 ? `Color palette: ${colorDesc.join(', ')}.` : '';
  
  // Extract content from props
  const headline = props?.content?.headline || props?.title || '';
  const subheadline = props?.content?.subheadline || props?.subtitle || '';
  
  // Generate highly specific prompts based on section and brand
  switch (kind) {
    case 'hero':
      // For the brutalist street art example
      if (philosophy.includes('brutalist') || philosophy.includes('street art')) {
        return `Create a hero image for a revolutionary street art gallery website.
          Style: ${philosophy}. ${personality}.
          Visual: Raw concrete walls covered in vibrant graffiti tags and murals. 
          Industrial urban environment with exposed brick, metal scaffolding, spray paint cans.
          Dramatic harsh lighting creating deep shadows. Gritty texture, high contrast.
          ${colorPalette}
          Mood: ${mood}. Underground, rebellious, anti-establishment.
          Wide aspect ratio 16:9. Photorealistic or stylized illustration.
          NO text, NO words, NO typography in the image.`;
      }
      
      // Generic hero with brand awareness
      return `Create a hero image for: "${headline}". 
        Concept: ${subheadline}.
        Brand philosophy: ${philosophy}.
        Visual style: ${mood}, ${tone}.
        ${colorPalette}
        Wide aspect ratio 16:9. High quality, no text in image.`;
    
    case 'features':
      const features = props?.content?.features || [];
      const featureDesc = features.length > 0 
        ? `representing: ${features.slice(0, 3).join(', ')}`
        : 'showing key benefits';
      
      return `Create an illustration for a features section.
        ${features.length || 3} distinct visual elements ${featureDesc}.
        Style: ${philosophy || 'modern and clean'}.
        Visual approach: ${mood}, ${tone}.
        ${colorPalette}
        Abstract or iconographic representations, no literal text.
        Clean composition with clear visual hierarchy.`;
    
    case 'about':
      return `Create an about/team section image.
        Context: ${philosophy || 'professional company'}.
        Personality: ${personality || 'welcoming and authentic'}.
        Visual: ${mood} atmosphere, ${tone} setting.
        ${colorPalette}
        Show people, workspace, or brand environment.
        Authentic, diverse, engaging composition.`;
    
    case 'testimonials':
      return `Create testimonial section imagery.
        Brand context: ${philosophy || 'trusted service'}.
        Visual style: ${mood}, ${tone}.
        ${colorPalette}
        Happy customers, authentic expressions, diverse people.
        Professional headshots or lifestyle photography.`;
    
    default:
      return `Create a web image.
        Brand: ${philosophy || 'modern digital'}.
        Style: ${mood}, ${tone}.
        ${colorPalette}
        High quality, professional, no text.`;
  }
}