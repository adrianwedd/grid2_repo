// Dynamic Claude-powered theme generator with image generation and caching
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { generateImagesForSections } from '@/lib/chatgpt-image-generator';

const THEME_CACHE_DIR = join(process.cwd(), '.dynamic-themes');
const THEME_INDEX = join(THEME_CACHE_DIR, 'index.json');

interface DynamicTheme {
  id: string;
  prompt: string;
  name: string;
  description: string;
  claudeAnalysis: {
    styleRationale: string;
    visualPersonality: string;
    targetAudience: string;
    colorStrategy: string;
    fontStrategy: string;
  };
  renderingSpec: {
    content: any; // ContentGraph structure
    brandTokens: any; // BrandTokens structure  
    tone: string; // Tone for our system
    sections: string[]; // Section types to render
  };
  brandTokens?: {
    colors?: any;
    typography?: any;
  };
  aiImages: {
    hero: string;
    features: string;
    cta: string;
  };
  timestamp: string;
  usage: number;
}

// Ensure cache directory exists
async function ensureThemeCache() {
  try {
    await fs.access(THEME_CACHE_DIR);
  } catch {
    await fs.mkdir(THEME_CACHE_DIR, { recursive: true });
  }
}

// POST: Generate new dynamic theme with Claude + AI images
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json({
        error: 'Theme prompt must be at least 10 characters'
      }, { status: 400 });
    }

    console.log('🎨 Generating dynamic theme for:', prompt);
    
    // Step 1: Use Claude to analyze prompt and create comprehensive style definition
    const claudeAnalysis = await analyzeThemeWithClaude(prompt);
    
    // Step 2: Use Claude to convert analysis into proper JSON structure for our rendering system
    const renderingSpec = await convertAnalysisToRenderingJSON(claudeAnalysis, prompt);
    
    // Step 3: Generate AI images for this specific theme
    const aiImages = await generateThemeImages(claudeAnalysis, prompt);
    
    // Step 4: Extract colors from generated images (if available)
    const extractedColors = await extractColorsFromImages(aiImages);
    
    // Step 5: Create complete theme definition
    const theme: DynamicTheme = {
      id: generateThemeId(prompt),
      prompt,
      name: claudeAnalysis.name,
      description: claudeAnalysis.description,
      claudeAnalysis,
      renderingSpec,
      aiImages,
      timestamp: new Date().toISOString(),
      usage: 0
    };
    
    // Step 5: Save theme to cache
    await saveTheme(theme);
    
    console.log('✅ Dynamic theme generated:', theme.name);
    
    return NextResponse.json({
      success: true,
      theme,
      meta: {
        generatedBy: 'claude-dynamic-theme-generator',
        hasAIImages: Object.keys(aiImages).length > 0,
        colorsExtracted: !!extractedColors
      }
    });

  } catch (error) {
    console.error('❌ Dynamic theme generation failed:', error);
    return NextResponse.json({
      error: 'Failed to generate dynamic theme',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET: Retrieve all cached dynamic themes
export async function GET() {
  try {
    await ensureThemeCache();
    
    try {
      const indexData = await fs.readFile(THEME_INDEX, 'utf-8');
      const themes = JSON.parse(indexData) as DynamicTheme[];
      
      // Sort by usage (most used first), then by recency
      const sortedThemes = themes.sort((a, b) => {
        if (a.usage !== b.usage) return b.usage - a.usage;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      return NextResponse.json({
        themes: sortedThemes,
        count: themes.length,
        stats: {
          totalThemes: themes.length,
          mostUsed: sortedThemes[0]?.name || 'None',
          oldestTheme: themes.reduce((oldest, theme) => 
            new Date(theme.timestamp) < new Date(oldest.timestamp) ? theme : oldest
          )?.timestamp || null
        }
      });
    } catch {
      return NextResponse.json({ themes: [], count: 0, stats: null });
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to load themes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Convert Claude's analysis into proper JSON structure for our rendering system
async function convertAnalysisToRenderingJSON(analysis: any, originalPrompt: string): Promise<DynamicTheme['renderingSpec']> {
  // This is where Claude takes the analysis and converts it to our exact JSON structure
  // In production, this would be a Claude API call with the analysis as context
  
  console.log('🔄 Converting analysis to rendering JSON...');
  
  // Extract content from the prompt using Claude's understanding
  const content = extractContentFromPrompt(originalPrompt, analysis);
  
  // Map analysis to our tone system
  const tone = mapAnalysisToTone(analysis);
  
  // Create brand tokens from analysis
  const brandTokens = createBrandTokensFromAnalysis(analysis);
  
  // Determine sections based on prompt intent
  const sections = determineSections(originalPrompt, analysis);
  
  return {
    content,
    brandTokens,
    tone,
    sections
  };
}

// Extract structured content from prompt using Claude's analysis
function extractContentFromPrompt(prompt: string, analysis: any) {
  // This would use Claude to intelligently extract content structure
  // For now, create reasonable defaults based on prompt
  
  const businessName = extractBusinessName(prompt) || analysis.name;
  
  return {
    hero: {
      headline: `${businessName}`,
      subheadline: analysis.description,
      primaryAction: {
        label: 'Get Started',
        href: '/get-started'
      },
      secondaryAction: {
        label: 'Learn More',
        href: '/learn-more'
      }
    },
    features: {
      headline: 'Why Choose Us',
      subheadline: `Experience the difference with our ${analysis.visualPersonality.toLowerCase()} approach`,
      items: [
        'Premium Quality',
        'Expert Service', 
        'Trusted Results'
      ]
    },
    cta: {
      headline: 'Ready to Begin?',
      description: `Join thousands who trust ${businessName}`,
      primaryAction: {
        label: 'Start Now',
        href: '/start'
      }
    }
  };
}

// Map analysis to our tone system
function mapAnalysisToTone(analysis: any): string {
  const personality = analysis.visualPersonality.toLowerCase();
  
  if (personality.includes('luxury') || personality.includes('premium')) return 'luxury';
  if (personality.includes('minimal') || personality.includes('clean')) return 'minimal';
  if (personality.includes('corporate') || personality.includes('professional')) return 'corporate';
  if (personality.includes('creative') || personality.includes('artistic')) return 'creative';
  if (personality.includes('tech') || personality.includes('modern')) return 'modern';
  if (personality.includes('elegant') || personality.includes('sophisticated')) return 'elegant';
  if (personality.includes('warm') || personality.includes('friendly')) return 'warm';
  if (personality.includes('bold') || personality.includes('dramatic')) return 'bold';
  if (personality.includes('playful') || personality.includes('fun')) return 'playful';
  
  return 'modern'; // Default
}

// Create brand tokens from analysis
function createBrandTokensFromAnalysis(analysis: any) {
  const colors = analysis.suggestedColors;
  
  return {
    colors: {
      brand: createColorScale(colors.primary),
      gray: createGrayScale(),
    },
    fonts: {
      heading: analysis.typography.headingFont,
      body: analysis.typography.bodyFont
    },
    radius: { sm: '0.125rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    spacing: { tight: 0.8, normal: 1.0, relaxed: 1.2 }
  };
}

// Determine sections from prompt
function determineSections(prompt: string, analysis: any): string[] {
  const lower = prompt.toLowerCase();
  let sections = ['hero']; // Always include hero
  
  if (lower.includes('feature') || lower.includes('service') || lower.includes('benefit')) {
    sections.push('features');
  }
  if (lower.includes('about') || lower.includes('story') || lower.includes('company')) {
    sections.push('about');
  }
  if (lower.includes('testimonial') || lower.includes('review') || lower.includes('client')) {
    sections.push('testimonials');
  }
  
  sections.push('cta'); // Always end with CTA
  
  return sections;
}

// Helper functions
function extractBusinessName(prompt: string): string | null {
  // Simple extraction - would use Claude for better results
  const match = prompt.match(/for (\w+)/i) || prompt.match(/(\w+) website/i);
  return match ? match[1] : null;
}

function createColorScale(baseColor: string) {
  return {
    50: lightenColor(baseColor, 0.95),
    500: baseColor,
    900: darkenColor(baseColor, 0.7)
  };
}

function createGrayScale() {
  return {
    50: '#f9fafb',
    500: '#6b7280', 
    900: '#111827'
  };
}

function lightenColor(color: string, amount: number): string {
  // Simple color manipulation - would use proper color library
  return color;
}

function darkenColor(color: string, amount: number): string {
  // Simple color manipulation - would use proper color library
  return color;
}

// Simulate Claude analysis (replace with actual Claude API call)
async function analyzeThemeWithClaude(prompt: string): Promise<DynamicTheme['claudeAnalysis'] & {
  name: string;
  description: string;
  suggestedColors: any;
  typography: any;
}> {
  // This would call Claude API in production
  // For now, simulate intelligent analysis based on prompt keywords
  
  const lowerPrompt = prompt.toLowerCase();
  
  // Analyze prompt for keywords and intent
  let baseStyle = 'modern';
  let colorPalette = { primary: '#3b82f6', secondary: '#64748b', accent: '#f59e0b', neutral: ['#f8fafc', '#334155'] };
  let fonts = { headingFont: 'Inter', bodyFont: 'Inter' };
  
  if (lowerPrompt.includes('luxury') || lowerPrompt.includes('premium') || lowerPrompt.includes('elegant')) {
    baseStyle = 'luxury';
    colorPalette = { primary: '#d97706', secondary: '#92400e', accent: '#fbbf24', neutral: ['#fffbeb', '#451a03'] };
    fonts = { headingFont: 'Cormorant Garamond', bodyFont: 'Lora' };
  } else if (lowerPrompt.includes('tech') || lowerPrompt.includes('startup') || lowerPrompt.includes('modern')) {
    baseStyle = 'tech';
    colorPalette = { primary: '#0891b2', secondary: '#0e7490', accent: '#06b6d4', neutral: ['#cffafe', '#164e63'] };
    fonts = { headingFont: 'Space Grotesk', bodyFont: 'Inter' };
  } else if (lowerPrompt.includes('creative') || lowerPrompt.includes('artistic') || lowerPrompt.includes('bold')) {
    baseStyle = 'creative';
    colorPalette = { primary: '#dc2626', secondary: '#b91c1c', accent: '#8b5cf6', neutral: ['#fef2f2', '#7f1d1d'] };
    fonts = { headingFont: 'Abril Fatface', bodyFont: 'Open Sans' };
  } else if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) {
    baseStyle = 'minimal';
    colorPalette = { primary: '#64748b', secondary: '#475569', accent: '#e2e8f0', neutral: ['#ffffff', '#1e293b'] };
    fonts = { headingFont: 'Inter', bodyFont: 'Inter' };
  }
  
  return {
    name: extractThemeName(prompt, baseStyle),
    description: `${baseStyle.charAt(0).toUpperCase() + baseStyle.slice(1)} theme generated from: "${prompt.substring(0, 80)}..."`,
    styleRationale: `Analyzed "${prompt}" and determined ${baseStyle} aesthetic best matches the described vision and target use case.`,
    visualPersonality: `${baseStyle.charAt(0).toUpperCase() + baseStyle.slice(1)} and purposeful with ${colorPalette.primary} as primary accent`,
    targetAudience: inferTargetAudience(prompt),
    colorStrategy: `Primary color ${colorPalette.primary} chosen for ${baseStyle} aesthetic with complementary accent ${colorPalette.accent}`,
    fontStrategy: `${fonts.headingFont} for headings provides ${baseStyle} character, ${fonts.bodyFont} ensures readability`,
    suggestedColors: colorPalette,
    typography: fonts
  };
}

// Generate theme-specific AI images
async function generateThemeImages(analysis: any, prompt: string): Promise<DynamicTheme['aiImages']> {
  try {
    const styleKeywords = analysis.visualPersonality.toLowerCase();
    const colorHint = analysis.suggestedColors.primary;
    
    // Create aesthetic prompts based on Claude's analysis
    const prompts = {
      hero: `${styleKeywords} aesthetic composition inspired by "${prompt}", ${colorHint} color palette, sophisticated visual design`,
      features: `${styleKeywords} icon set design, ${colorHint} accent colors, clean geometric elements`,
      cta: `${styleKeywords} background gradient, ${colorHint} color scheme, professional aesthetic atmosphere`
    };
    
    const images: Partial<DynamicTheme['aiImages']> = {};
    
    // Generate images using our patient system
    const imageRequests = Object.entries(prompts).map(([section, imagePrompt]) => ({
      style: analysis.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      section,
      prompt: imagePrompt
    }));
    
    try {
      // Create sections data for the image generator
      const sectionsData = Object.entries(prompts).map(([section, prompt]) => ({
        id: section,
        kind: section,
        props: { title: prompt }
      }));
      
      const imageMap = await generateImagesForSections(sectionsData);
      
      // Convert map to expected format
      sectionsData.forEach(section => {
        const imageUrl = imageMap.get(section.id);
        if (imageUrl) {
          images[section.id as keyof DynamicTheme['aiImages']] = imageUrl;
        }
      });
    } catch (error) {
      console.warn('Failed to generate theme images:', error);
    }
    
    return images as DynamicTheme['aiImages'];
  } catch (error) {
    console.warn('Failed to generate theme images:', error);
    return { hero: '', features: '', cta: '' };
  }
}

// Extract colors from generated images (placeholder - would use image analysis)
async function extractColorsFromImages(images: DynamicTheme['aiImages']): Promise<any | null> {
  // This would analyze the actual images to extract dominant colors
  // For now, return null to use Claude's suggested colors
  return null;
}

// Save theme to persistent cache
async function saveTheme(theme: DynamicTheme) {
  await ensureThemeCache();
  
  // Save individual theme file
  const themePath = join(THEME_CACHE_DIR, `${theme.id}.json`);
  await fs.writeFile(themePath, JSON.stringify(theme, null, 2));
  
  // Update index
  let themes: DynamicTheme[] = [];
  try {
    const indexData = await fs.readFile(THEME_INDEX, 'utf-8');
    themes = JSON.parse(indexData);
  } catch {
    themes = [];
  }
  
  // Remove existing theme with same ID and add new one
  themes = themes.filter(t => t.id !== theme.id);
  themes.unshift(theme);
  
  // Keep only latest 50 themes
  themes = themes.slice(0, 50);
  
  await fs.writeFile(THEME_INDEX, JSON.stringify(themes, null, 2));
}

// Utility functions
function generateThemeId(prompt: string): string {
  const hash = prompt.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = Date.now().toString(36);
  return `theme-${hash}-${timestamp}`.toLowerCase();
}

function extractThemeName(prompt: string, baseStyle: string): string {
  // Extract a meaningful name from the prompt
  const words = prompt.split(' ').filter(word => word.length > 3);
  const firstWords = words.slice(0, 3).join(' ');
  return firstWords.length > 0 ? `${firstWords} (${baseStyle})` : `Custom ${baseStyle} Theme`;
}

function inferTargetAudience(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('business') || lower.includes('corporate')) return 'Business professionals';
  if (lower.includes('creative') || lower.includes('artist')) return 'Creative professionals';
  if (lower.includes('tech') || lower.includes('developer')) return 'Technical audiences';
  if (lower.includes('luxury') || lower.includes('premium')) return 'Premium market';
  return 'General audience';
}