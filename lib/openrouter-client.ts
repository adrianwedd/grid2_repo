// OpenRouter client for FREE AI model access
// Uses only free-tier models for text and image generation

import type { Tone } from '@/types/section-system';

// TRULY FREE models available on OpenRouter (with :free suffix = $0.00 cost)
const FREE_MODELS = {
  text: {
    // DeepSeek models - POWERFUL reasoning capabilities!
    reasoning: 'deepseek/deepseek-r1:free', // Best reasoning model, comparable to o1!
    reasoningFast: 'deepseek/deepseek-r1-0528:free', // Faster R1 variant
    coding: 'deepseek/deepseek-chat-v3-0324:free', // Excellent for coding
    reasoningLite: 'deepseek/deepseek-r1-distill-qwen-14b:free', // Smaller but smart
    reasoningLarge: 'deepseek/deepseek-r1-distill-llama-70b:free', // Large distilled
    
    // Other excellent free models
    creative: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', // High creativity
    fast: 'qwen/qwen3-coder:free', // Fast and reliable
    balanced: 'google/gemma-3n-e2b-it:free', // Good balance
    analytical: 'mistralai/mistral-small-3.2-24b-instruct:free', // Good for analysis
    general: 'openai/gpt-oss-20b:free', // General purpose
    kimi: 'moonshotai/kimi-k2:free', // MoonshotAI's Kimi model
    kimiDev: 'moonshotai/kimi-dev-72b:free', // Larger Kimi for development
    versatile: 'z-ai/glm-4.5-air:free' // Z.AI's GLM model
  },
  image: {
    // Most image models require credits, but some have free tiers
    // We'll focus on text generation for now
  }
} as const;

interface OpenRouterConfig {
  apiKey?: string; // Optional - some free models don't require auth
  baseUrl?: string;
}

interface TextGenerationOptions {
  prompt: string;
  tone?: Tone;
  maxTokens?: number;
  temperature?: number;
  model?: keyof typeof FREE_MODELS.text;
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string | undefined;
  private baseUrl: string;

  constructor(config?: OpenRouterConfig) {
    this.apiKey = config?.apiKey || process.env.OPENROUTER_API_KEY;
    this.baseUrl = config?.baseUrl || 'https://openrouter.ai/api/v1';
  }

  /**
   * Generate hilarious, creative text using FREE models
   */
  async generateText(options: TextGenerationOptions): Promise<string> {
    const {
      prompt,
      tone = 'playful',
      maxTokens = 500,
      temperature = 0.8,
      model = 'creative'
    } = options;

    // Select the best free model for the tone
    const selectedModel = this.selectModelForTone(tone, model);
    
    // Build creative prompt based on tone
    const enhancedPrompt = this.enhancePromptForTone(prompt, tone);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
          'HTTP-Referer': 'https://grid2repo.vercel.app', // Required for some free models
          'X-Title': 'Grid 2.0 Generator' // Optional but helps with rate limits
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: this.getSystemPromptForTone(tone)
            },
            {
              role: 'user',
              content: enhancedPrompt
            }
          ],
          max_tokens: maxTokens,
          temperature,
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenRouter error:', error);
        // Fallback to local creative content
        return this.getFallbackContent(tone, prompt);
      }

      const data = await response.json() as OpenRouterResponse;
      return data.choices[0]?.message?.content || this.getFallbackContent(tone, prompt);

    } catch (error) {
      console.error('Failed to generate text:', error);
      // Always fallback gracefully to local content
      return this.getFallbackContent(tone, prompt);
    }
  }

  /**
   * Generate feature descriptions with humor
   */
  async generateFeatureDescriptions(
    features: string[],
    tone: Tone
  ): Promise<Record<string, string>> {
    const prompt = `Generate hilariously creative descriptions for these features. Make them memorable, fun, and aligned with a ${tone} tone:
    
    Features: ${features.join(', ')}
    
    Format: Return a JSON object with feature names as keys and creative descriptions as values.
    Make each description punchy, memorable, and slightly absurd while still being professional.`;

    try {
      const result = await this.generateText({
        prompt,
        tone,
        model: 'creative',
        temperature: 0.9,
        maxTokens: 800
      });

      // Try to parse as JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback to simple parsing
      const descriptions: Record<string, string> = {};
      features.forEach(feature => {
        descriptions[feature] = this.generateLocalDescription(feature, tone);
      });
      return descriptions;

    } catch (error) {
      console.error('Failed to generate feature descriptions:', error);
      // Fallback to local generation
      const descriptions: Record<string, string> = {};
      features.forEach(feature => {
        descriptions[feature] = this.generateLocalDescription(feature, tone);
      });
      return descriptions;
    }
  }

  /**
   * Generate CTA text that actually converts (and entertains)
   */
  async generateCTAText(
    purpose: string,
    tone: Tone
  ): Promise<{ headline: string; description: string; buttonText: string }> {
    const prompt = `Create an irresistible CTA for: ${purpose}
    
    Tone: ${tone}
    Requirements:
    - Headline that stops scrolling
    - Description that builds desire
    - Button text that demands clicking
    - Be creative, unexpected, and slightly ridiculous
    - Still maintain professionalism`;

    try {
      const result = await this.generateText({
        prompt,
        tone,
        model: 'creative',
        temperature: 0.85
      });

      // Parse the result
      const lines = result.split('\n').filter(l => l.trim());
      return {
        headline: lines[0] || this.getFallbackCTA(tone).headline,
        description: lines[1] || this.getFallbackCTA(tone).description,
        buttonText: lines[2] || this.getFallbackCTA(tone).buttonText
      };

    } catch (error) {
      console.error('Failed to generate CTA:', error);
      return this.getFallbackCTA(tone);
    }
  }

  // Private helper methods

  private selectModelForTone(tone: Tone, preferredModel: keyof typeof FREE_MODELS.text): string {
    // Match tone to best free model - now with DeepSeek reasoning!
    const toneModelMap: Partial<Record<Tone, keyof typeof FREE_MODELS.text>> = {
      playful: 'creative', // Dolphin model for maximum creativity
      creative: 'creative', // Dolphin model for wild ideas
      bold: 'reasoning', // DeepSeek R1 for powerful statements
      minimal: 'reasoningLite', // DeepSeek distilled for concise output
      corporate: 'analytical', // Mistral for professional tone
      elegant: 'reasoning', // DeepSeek R1 for sophisticated content
      modern: 'coding', // DeepSeek V3 for tech content
      luxury: 'reasoningLarge', // DeepSeek 70B for premium quality
      warm: 'kimi', // Kimi for friendly, warm tone
      nature: 'balanced', // Gemma for natural language
      retro: 'creative', // Dolphin for nostalgic creativity
      monochrome: 'reasoningFast', // DeepSeek fast for stark simplicity
      techno: 'coding', // DeepSeek V3 for tech-focused content
      zen: 'reasoning' // DeepSeek R1 for thoughtful content
    };

    const modelKey = toneModelMap[tone] || preferredModel;
    return FREE_MODELS.text[modelKey];
  }

  private getSystemPromptForTone(tone: Tone): string {
    const tonePrompts: Record<Tone, string> = {
      minimal: "You are a minimalist writer. Every word must earn its place. Be concise, clear, and impactful.",
      bold: "You are a bold, confident writer. Make statements that demand attention. Be fearless and unapologetic.",
      playful: "You are a playful, witty writer. Make people smile. Use humor, wordplay, and delightful surprises.",
      corporate: "You are a corporate writer who secretly hates corporate speak but has to use it. Sneak in subtle humor.",
      elegant: "You are a sophisticated writer. Channel your inner New Yorker magazine with a dash of sass.",
      modern: "You are writing from the future. Reference technology that doesn't exist yet. Be confidently absurd.",
      warm: "You are the coziest writer on the internet. Make everything feel like a warm hug with a side of cookies.",
      luxury: "You write for people who have everything. Be outrageously premium while winking at the absurdity.",
      creative: "You are chaos incarnate. Break every writing rule. Make sense optional. Creativity mandatory.",
      nature: "You are Mother Earth's copywriter. Everything is organic, sustainable, and slightly hippie.",
      retro: "You're stuck in the past but loving it. Reference old tech, use outdated slang, be nostalgic.",
      monochrome: "You see the world in black and white. Be stark, dramatic, film noir-esque.",
      techno: "You are a cyberpunk AI. Speak in code, reference the matrix, be mysteriously technical.",
      zen: "You have achieved enlightenment through web design. Be peaceful, profound, and slightly pretentious."
    };

    return tonePrompts[tone] || tonePrompts.playful;
  }

  private enhancePromptForTone(prompt: string, tone: Tone): string {
    return `${prompt}

Style requirements for ${tone} tone:
- Be unexpectedly creative and memorable
- Use humor appropriately for the tone
- Make boring things interesting
- Avoid generic corporate speak
- Include personality and character
- Surprise and delight the reader`;
  }

  private generateLocalDescription(feature: string, tone: Tone): string {
    // Local fallback descriptions
    const templates = {
      minimal: `${feature}: Stripped down to pure essence`,
      bold: `${feature}: MAXIMUM POWER UNLEASHED`,
      playful: `${feature}: Like a party in your browser! 🎉`,
      corporate: `${feature}: Leveraging synergies for optimal outcomes`,
      elegant: `${feature}: Refined sophistication meets digital excellence`,
      modern: `${feature}: From the future, with love`,
      warm: `${feature}: Cozy comfort for your digital soul`,
      luxury: `${feature}: Because ordinary is for other people`,
      creative: `${feature}: Where chaos meets genius`,
      nature: `${feature}: Organically grown, digitally delivered`,
      retro: `${feature}: Old school cool for new school rules`,
      monochrome: `${feature}: Bold simplicity in black and white`,
      techno: `${feature}: Cyberpunk dreams realized`,
      zen: `${feature}: Inner peace through outer performance`
    };

    return templates[tone] || `${feature}: Surprisingly delightful`;
  }

  private getFallbackContent(tone: Tone, context: string): string {
    // Import from our local creative content as fallback
    const fallbacks: Record<Tone, string[]> = {
      minimal: [
        "Less is more. More or less.",
        "Simplicity is the ultimate sophistication.",
        "We removed everything. You're welcome."
      ],
      bold: [
        "BOLD MOVE, COTTON. LET'S SEE IF IT PAYS OFF.",
        "SUBTLETY IS FOR COWARDS.",
        "GO BIG OR GO HOME. ACTUALLY, JUST GO BIG."
      ],
      playful: [
        "We put the 'fun' in 'functional'! And the 'pro' in 'procrastination'!",
        "Warning: Side effects may include smiling",
        "Built with love, cookies, and questionable decisions"
      ],
      corporate: [
        "Synergizing paradigms since before it was cool",
        "Disrupting disruption disruptively",
        "Our KPIs have KPIs"
      ],
      elegant: [
        "Sophistication without the attitude",
        "Refined like fine wine, priced like tap water",
        "Elegance is not about being noticed, it's about being remembered"
      ],
      modern: [
        "Living in 3024 while everyone else is in 2024",
        "The future called. We answered.",
        "Modern problems require modern solutions"
      ],
      warm: [
        "Like a hug from your favorite website",
        "Comfort food for your eyeballs",
        "Home is where the CSS is"
      ],
      luxury: [
        "First class everything, economy nothing",
        "Exclusively inclusive",
        "Because you deserve pixels that cost more"
      ],
      creative: [
        "Normal is just a setting on the washing machine",
        "We color outside the lines, inside the box, and on the ceiling",
        "Creativity is intelligence having fun"
      ],
      nature: [
        "100% organic, gluten-free, carbon-neutral code",
        "Tree-hugging technology",
        "Digital sustainability for analog souls"
      ],
      retro: [
        "Party like it's 1999, code like it's 2099",
        "Vintage vibes, modern performance",
        "Yesterday's tomorrow, today"
      ],
      monochrome: [
        "Life in black and white, no gray areas",
        "Minimalist palette, maximalist impact",
        "Color is overrated"
      ],
      techno: [
        "Welcome to the machine",
        "Digital rain, real results",
        "The matrix has you"
      ],
      zen: [
        "Inner peace, outer performance",
        "Breathe in features, breathe out bugs",
        "Enlightenment through engineering"
      ]
    };

    const toneFallbacks = fallbacks[tone] || fallbacks.playful;
    return toneFallbacks[Math.floor(Math.random() * toneFallbacks.length)];
  }

  private getFallbackCTA(tone: Tone): { headline: string; description: string; buttonText: string } {
    const ctas: Record<Tone, { headline: string; description: string; buttonText: string }> = {
      minimal: {
        headline: "Ready? Let's Begin.",
        description: "Simple start. Powerful results.",
        buttonText: "Start Now"
      },
      bold: {
        headline: "STOP WAITING. START WINNING.",
        description: "Fortune favors the brave. Click favors the bold.",
        buttonText: "UNLEASH POWER"
      },
      playful: {
        headline: "🎉 Let's Make Magic Together!",
        description: "Serious results with a silly smile.",
        buttonText: "Join the Fun!"
      },
      corporate: {
        headline: "Transform Your Business Today",
        description: "Leverage our solutions to maximize your potential.",
        buttonText: "Schedule Demo"
      },
      elegant: {
        headline: "Your Journey Awaits",
        description: "For those who appreciate the finer pixels in life.",
        buttonText: "Begin Elegantly"
      },
      modern: {
        headline: "The Future is Now",
        description: "Tomorrow's solutions, today's reality.",
        buttonText: "Enter Future"
      },
      warm: {
        headline: "Come On In, We're Open",
        description: "A warm welcome to your new digital home.",
        buttonText: "Get Cozy"
      },
      luxury: {
        headline: "Exclusively Yours",
        description: "Because ordinary is for other people.",
        buttonText: "Experience Luxury"
      },
      creative: {
        headline: "Break the Rules",
        description: "Where weird meets wonderful.",
        buttonText: "Get Weird"
      },
      nature: {
        headline: "Grow Something Beautiful",
        description: "Sustainably sourced success.",
        buttonText: "Plant Seeds"
      },
      retro: {
        headline: "Blast from the Past",
        description: "Yesterday's charm, tomorrow's tech.",
        buttonText: "Press Start"
      },
      monochrome: {
        headline: "Black. White. Right.",
        description: "No shades of gray here.",
        buttonText: "Choose Contrast"
      },
      techno: {
        headline: "System Ready",
        description: "Initialize the sequence.",
        buttonText: "Jack In"
      },
      zen: {
        headline: "Find Your Balance",
        description: "Peace through pixels.",
        buttonText: "Breathe Deep"
      }
    };

    return ctas[tone] || ctas.playful;
  }
}

// Singleton instance
export const openRouterClient = new OpenRouterClient();

// Helper function to check if OpenRouter is configured
export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY || !!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
}