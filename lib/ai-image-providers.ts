/**
 * AI Image Provider System
 * 
 * Multi-provider image generation with automatic fallback
 * Supports: OpenAI DALL-E, Stability AI, Replicate, Midjourney (via proxy)
 */

export interface ImageGenerationRequest {
  prompt: string;
  style?: 'photorealistic' | 'artistic' | 'minimal' | 'bold' | 'playful';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  quality?: 'draft' | 'standard' | 'high';
  negative?: string; // What to avoid in the image
}

export interface ImageGenerationResponse {
  url: string;
  provider: string;
  model: string;
  cost?: number;
  metadata?: Record<string, any>;
}

// Provider configurations
const PROVIDERS = {
  openai: {
    name: 'OpenAI DALL-E',
    models: ['dall-e-3', 'dall-e-2'],
    endpoint: 'https://api.openai.com/v1/images/generations',
    requiresKey: 'OPENAI_API_KEY'
  },
  stability: {
    name: 'Stability AI',
    models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6'],
    endpoint: 'https://api.stability.ai/v1/generation',
    requiresKey: 'STABILITY_API_KEY'
  },
  replicate: {
    name: 'Replicate',
    models: [
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      'playgroundai/playground-v2-1024px-aesthetic:42fe626e41cc811eaf02c94b892774839268ce1994ea778eba97103fe1ef51b8'
    ],
    endpoint: 'https://api.replicate.com/v1/predictions',
    requiresKey: 'REPLICATE_API_TOKEN'
  },
  together: {
    name: 'Together AI',
    models: ['stabilityai/stable-diffusion-xl-base-1.0'],
    endpoint: 'https://api.together.xyz/v1/images/generations',
    requiresKey: 'TOGETHER_API_KEY'
  }
};

// Style to prompt modifiers mapping
const STYLE_MODIFIERS: Record<string, string> = {
  photorealistic: 'photorealistic, high detail, professional photography, 8k resolution',
  artistic: 'artistic, creative, painterly, expressive, unique style',
  minimal: 'minimalist, clean, simple, modern, geometric, less is more',
  bold: 'bold, dramatic, high contrast, striking, powerful, impactful',
  playful: 'playful, fun, colorful, whimsical, creative, energetic'
};

/**
 * Generate image using OpenAI DALL-E
 */
async function generateWithOpenAI(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const styleModifier = request.style ? STYLE_MODIFIERS[request.style] : '';
  const enhancedPrompt = `${request.prompt}. ${styleModifier}`.trim();

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: request.aspectRatio === '16:9' ? '1792x1024' : '1024x1024',
      quality: request.quality === 'high' ? 'hd' : 'standard',
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.data[0].url,
    provider: 'OpenAI',
    model: 'dall-e-3',
    metadata: { revised_prompt: data.data[0].revised_prompt }
  };
}

/**
 * Generate image using Stability AI
 */
async function generateWithStability(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) throw new Error('STABILITY_API_KEY not configured');

  const styleModifier = request.style ? STYLE_MODIFIERS[request.style] : '';
  const enhancedPrompt = `${request.prompt}. ${styleModifier}`.trim();

  // Determine dimensions based on aspect ratio
  let width = 1024, height = 1024;
  switch (request.aspectRatio) {
    case '16:9': width = 1344; height = 768; break;
    case '9:16': width = 768; height = 1344; break;
    case '4:3': width = 1152; height = 896; break;
    case '3:4': width = 896; height = 1152; break;
  }

  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: enhancedPrompt,
          weight: 1
        },
        ...(request.negative ? [{
          text: request.negative,
          weight: -1
        }] : [])
      ],
      cfg_scale: 7,
      height,
      width,
      steps: request.quality === 'high' ? 50 : 30,
      samples: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Stability API error: ${response.statusText}`);
  }

  const data = await response.json();
  const image = data.artifacts[0];
  
  // Convert base64 to data URL
  const imageUrl = `data:image/png;base64,${image.base64}`;
  
  return {
    url: imageUrl,
    provider: 'Stability',
    model: 'stable-diffusion-xl-1024-v1-0',
    metadata: { seed: image.seed }
  };
}

/**
 * Generate image using Replicate
 */
async function generateWithReplicate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) throw new Error('REPLICATE_API_TOKEN not configured');

  const styleModifier = request.style ? STYLE_MODIFIERS[request.style] : '';
  const enhancedPrompt = `${request.prompt}. ${styleModifier}`.trim();

  // Use SDXL model
  const model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model.split(':')[1],
      input: {
        prompt: enhancedPrompt,
        negative_prompt: request.negative || '',
        width: request.aspectRatio === '16:9' ? 1344 : 1024,
        height: request.aspectRatio === '16:9' ? 768 : 1024,
        num_inference_steps: request.quality === 'high' ? 50 : 25,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.statusText}`);
  }

  const prediction = await response.json();
  
  // Poll for completion
  let result = prediction;
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });
    result = await pollResponse.json();
  }

  if (result.status !== 'succeeded') {
    throw new Error(`Replicate generation failed: ${result.error}`);
  }

  return {
    url: result.output[0],
    provider: 'Replicate',
    model: 'SDXL',
    metadata: { prediction_id: result.id }
  };
}

/**
 * Generate image using Together AI
 */
async function generateWithTogether(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error('TOGETHER_API_KEY not configured');

  const styleModifier = request.style ? STYLE_MODIFIERS[request.style] : '';
  const enhancedPrompt = `${request.prompt}. ${styleModifier}`.trim();

  const response = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      prompt: enhancedPrompt,
      width: request.aspectRatio === '16:9' ? 1344 : 1024,
      height: request.aspectRatio === '16:9' ? 768 : 1024,
      steps: request.quality === 'high' ? 50 : 25,
      n: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Together API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.data[0].url,
    provider: 'Together',
    model: 'stable-diffusion-xl-base-1.0',
  };
}

/**
 * Generate a placeholder image URL using Unsplash or placeholder service
 */
function generatePlaceholder(request: ImageGenerationRequest): ImageGenerationResponse {
  // Use Unsplash for high-quality placeholders
  const query = encodeURIComponent(request.prompt.slice(0, 50));
  const width = request.aspectRatio === '16:9' ? 1920 : 1080;
  const height = request.aspectRatio === '16:9' ? 1080 : 1080;
  
  return {
    url: `https://source.unsplash.com/${width}x${height}/?${query}`,
    provider: 'Unsplash',
    model: 'placeholder',
    metadata: { 
      fallback: true,
      reason: 'No AI providers configured'
    }
  };
}

/**
 * Main image generation function with automatic provider fallback
 */
export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  console.log('🎨 Generating image:', request.prompt);
  
  // Try providers in order of preference
  const providers = [
    { name: 'OpenAI', fn: generateWithOpenAI, enabled: !!process.env.OPENAI_API_KEY },
    { name: 'Stability', fn: generateWithStability, enabled: !!process.env.STABILITY_API_KEY },
    { name: 'Replicate', fn: generateWithReplicate, enabled: !!process.env.REPLICATE_API_TOKEN },
    { name: 'Together', fn: generateWithTogether, enabled: !!process.env.TOGETHER_API_KEY },
  ];

  // Try each enabled provider
  for (const provider of providers.filter(p => p.enabled)) {
    try {
      console.log(`  Trying ${provider.name}...`);
      const result = await provider.fn(request);
      console.log(`  ✅ Success with ${provider.name}`);
      return result;
    } catch (error) {
      console.error(`  ❌ ${provider.name} failed:`, error);
      continue;
    }
  }

  // All providers failed or none configured - use placeholder
  console.log('  ⚠️ Using placeholder image');
  return generatePlaceholder(request);
}

/**
 * Check which providers are configured
 */
export function getConfiguredProviders(): string[] {
  const configured = [];
  if (process.env.OPENAI_API_KEY) configured.push('OpenAI DALL-E');
  if (process.env.STABILITY_API_KEY) configured.push('Stability AI');
  if (process.env.REPLICATE_API_TOKEN) configured.push('Replicate');
  if (process.env.TOGETHER_API_KEY) configured.push('Together AI');
  return configured;
}

/**
 * Estimate cost for image generation
 */
export function estimateCost(provider: string, quality: string = 'standard'): number {
  const costs: Record<string, Record<string, number>> = {
    'OpenAI': { draft: 0.016, standard: 0.016, high: 0.032 }, // DALL-E 2 pricing
    'Stability': { draft: 0.002, standard: 0.002, high: 0.004 },
    'Replicate': { draft: 0.001, standard: 0.002, high: 0.003 },
    'Together': { draft: 0.001, standard: 0.001, high: 0.002 },
    'Unsplash': { draft: 0, standard: 0, high: 0 },
  };
  
  return costs[provider]?.[quality] || 0;
}