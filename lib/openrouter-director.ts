// lib/openrouter-director.ts
// OpenRouter integration for design generation

import type { DesignSpec } from './claude-director';

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generate design spec using OpenRouter API
 */
export async function generateSpecWithOpenRouter(
  userIntent: string,
  context?: any
): Promise<DesignSpec> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const prompt = buildDesignPrompt(userIntent, context);
  
  // Try different models in order of preference
  const models = [
    'anthropic/claude-3-sonnet:beta',  // Latest Claude
    'anthropic/claude-3-haiku',       // Faster Claude
    'mistralai/mistral-medium',       // Good alternative  
    'meta-llama/llama-3-8b-instruct:free', // Free fallback
  ];
  
  let model = models[0];
  
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are an expert web design director. Generate complete, detailed design specifications in valid JSON format only.'
    },
    {
      role: 'user', 
      content: prompt
    }
  ];

  // Try models in order until one works
  let lastError: Error | null = null;
  
  for (const testModel of models) {
    try {
      console.log(`🌐 OpenRouter request: ${testModel} with ${messages.length} messages`);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://grid2repo.vercel.app/',
          'X-Title': 'Grid 2.0 AI Director'
        },
        body: JSON.stringify({
          model: testModel,
          messages,
          max_tokens: 4000,
          temperature: 0.7,
          // Only use JSON mode for models that support it
          ...(testModel.includes('claude') ? { response_format: { type: 'json_object' } } : {})
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`❌ ${testModel} failed: ${response.status} ${errorText}`);
        lastError = new Error(`${testModel}: ${response.status} ${errorText}`);
        continue; // Try next model
      }

      model = testModel; // Remember which model worked
      console.log(`✅ ${testModel} responded successfully`);
      
      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        console.warn(`❌ ${testModel} returned no content`);
        lastError = new Error(`${testModel}: No content in response`);
        continue;
      }

      const content = data.choices[0].message.content;
      
      try {
        // Try to parse as JSON first
        const spec = JSON.parse(content);
        return validateAndEnhanceSpec(spec, userIntent);
      } catch (parseError) {
        // If not JSON, try to extract JSON from the content
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const spec = JSON.parse(jsonMatch[0]);
            return validateAndEnhanceSpec(spec, userIntent);
          } catch (e) {
            console.warn(`❌ ${testModel} JSON extraction failed:`, e);
          }
        }
        
        console.warn(`❌ ${testModel} returned invalid JSON`);
        lastError = new Error(`${testModel}: Invalid JSON response`);
        continue;
      }
      
    } catch (fetchError) {
      console.warn(`❌ ${testModel} request failed:`, fetchError);
      lastError = fetchError as Error;
      continue;
    }
  }
  
  // If we get here, all models failed
  throw lastError || new Error('All OpenRouter models failed');
}

/**
 * Build comprehensive design prompt for OpenRouter
 */
function buildDesignPrompt(userIntent: string, context?: any): string {
  return `Generate a complete website design specification for this request:

"${userIntent}"

${context ? `Context:
- Industry: ${context.industry || 'Not specified'}
- Target Audience: ${context.targetAudience || 'Not specified'}
- Brand Guidelines: ${context.brandGuidelines || 'Create new'}
` : ''}

Return ONLY valid JSON matching this exact structure:

{
  "philosophy": {
    "inspiration": "Brief description of design inspiration",
    "mood": "minimal|bold|playful|corporate|elegant|modern|warm|luxury|creative|nature|retro|zen",
    "essence": "Core design essence in one sentence",
    "principles": ["Principle 1", "Principle 2", "Principle 3"]
  },
  "style": {
    "personality": "Design personality description",
    "voice": "Brand voice description", 
    "energy": "high|balanced|calm"
  },
  "experience": {
    "userJourney": ["Discovery", "Engagement", "Action"],
    "emotions": ["Primary emotion user should feel"],
    "interactions": ["Interaction pattern 1", "Interaction pattern 2"]
  },
  "optimization": {
    "performance": ["Performance goal 1", "Performance goal 2"],
    "accessibility": ["Accessibility requirement 1", "Accessibility requirement 2"],
    "seo": ["SEO optimization 1", "SEO optimization 2"]
  },
  "colors": {
    "primary": "#HEX_COLOR",
    "secondary": "#HEX_COLOR",
    "accent": "#HEX_COLOR"
  },
  "typography": {
    "scale": 1.0,
    "contrast": "standard|refined"
  },
  "layout": {
    "style": "classic|asymmetric",
    "density": "tight|balanced|spacious"
  },
  "sections": [
    {
      "kind": "hero",
      "purpose": "Purpose of this section",
      "variant": {
        "suggestion": "split-image-left|centered|gradient-overlay",
        "reasoning": "Why this variant works for the design"
      },
      "content": {
        "headline": {
          "text": "Compelling headline text",
          "tone": "Bold|Inspiring|Professional"
        },
        "subheadline": {
          "text": "Supporting subheadline text",
          "tone": "Clarifying|Supporting"
        },
        "body": {
          "approach": "Benefits-focused bullets",
          "items": ["Benefit 1", "Benefit 2", "Benefit 3"]
        }
      }
    },
    {
      "kind": "features",
      "purpose": "Showcase key capabilities",
      "variant": {
        "suggestion": "three-column-cards|grid-layout",
        "reasoning": "Reasoning for this layout"
      },
      "content": {
        "headline": {
          "text": "Features section headline",
          "tone": "Confident"
        },
        "body": {
          "approach": "Feature showcase",
          "items": ["Feature 1", "Feature 2", "Feature 3"]
        }
      }
    },
    {
      "kind": "cta",
      "purpose": "Drive user action",
      "variant": {
        "suggestion": "gradient-slab|centered-button",
        "reasoning": "Conversion-focused reasoning"
      },
      "content": {
        "headline": {
          "text": "Call to action headline",
          "tone": "Inviting|Urgent"
        },
        "cta": {
          "primary": {
            "text": "Primary button text",
            "psychology": "Low commitment|High value"
          }
        }
      }
    }
  ],
  "tone": "One of: minimal|bold|playful|corporate|elegant|modern|warm|luxury|creative|nature|retro|zen"
}

Be creative and specific. Write real compelling copy, not placeholders.`;
}

/**
 * Validate and enhance the spec from OpenRouter
 */
function validateAndEnhanceSpec(spec: any, intent: string): DesignSpec {
  // Ensure required fields exist
  if (!spec.philosophy) {
    spec.philosophy = {
      inspiration: `OpenRouter design: ${intent}`,
      mood: 'minimal',
      essence: 'Clean and purposeful design',
      principles: ['Clarity first', 'User-focused', 'Performance optimized']
    };
  }

  if (!spec.style) {
    spec.style = {
      personality: 'Professional and approachable',
      voice: 'Clear and confident',
      energy: 'balanced'
    };
  }

  if (!spec.sections || !Array.isArray(spec.sections)) {
    spec.sections = [
      {
        kind: 'hero',
        purpose: 'Capture attention and communicate value',
        variant: {
          suggestion: 'split-image-left',
          reasoning: 'Balanced visual impact with clear messaging'
        },
        content: {
          headline: {
            text: extractHeadlineFromIntent(intent),
            tone: 'Bold and inspiring'
          }
        }
      }
    ];
  }

  // Ensure valid tone
  const validTones = ['minimal', 'bold', 'playful', 'corporate', 'elegant', 'modern', 'warm', 'luxury', 'creative', 'nature', 'retro', 'zen'];
  if (!spec.tone || !validTones.includes(spec.tone)) {
    spec.tone = spec.philosophy?.mood || 'minimal';
  }

  // Validate section kinds
  spec.sections = spec.sections.filter((section: any) => 
    ['hero', 'features', 'about', 'testimonials', 'cta', 'footer'].includes(section.kind)
  );

  // Ensure we have at least hero and cta
  if (!spec.sections.some((s: any) => s.kind === 'hero')) {
    spec.sections.unshift({
      kind: 'hero',
      purpose: 'Primary value proposition',
      variant: { suggestion: 'split-image-left', reasoning: 'Balanced approach' },
      content: {
        headline: { text: extractHeadlineFromIntent(intent), tone: 'Bold' }
      }
    });
  }

  if (!spec.sections.some((s: any) => s.kind === 'cta')) {
    spec.sections.push({
      kind: 'cta', 
      purpose: 'Drive conversions',
      variant: { suggestion: 'gradient-slab', reasoning: 'Strong visual close' },
      content: {
        headline: { text: 'Ready to Get Started?', tone: 'Inviting' },
        cta: { primary: { text: 'Get Started', psychology: 'Low commitment' } }
      }
    });
  }

  return spec as DesignSpec;
}

/**
 * Extract a compelling headline from user intent
 */
function extractHeadlineFromIntent(intent: string): string {
  const lowerIntent = intent.toLowerCase();
  
  if (lowerIntent.includes('awesome') || lowerIntent.includes('crazy') || lowerIntent.includes('insane')) {
    return 'Build Something Absolutely Incredible';
  }
  
  if (lowerIntent.includes('fast') || lowerIntent.includes('speed') || lowerIntent.includes('quick')) {
    return 'Lightning-Fast Solutions';
  }
  
  if (lowerIntent.includes('simple') || lowerIntent.includes('clean') || lowerIntent.includes('minimal')) {
    return 'Beautifully Simple Design';
  }
  
  if (lowerIntent.includes('modern') || lowerIntent.includes('future') || lowerIntent.includes('next')) {
    return 'The Future of Design';
  }
  
  if (lowerIntent.includes('business') || lowerIntent.includes('professional') || lowerIntent.includes('corporate')) {
    return 'Professional Excellence';
  }
  
  // Default based on intent length and content
  if (intent.length > 50) {
    return 'Transform Your Vision Into Reality';
  }
  
  return 'Build Something Amazing';
}