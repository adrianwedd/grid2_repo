// API route for generating creative content using FREE OpenRouter models
import { NextRequest, NextResponse } from 'next/server';
import { openRouterClient } from '@/lib/openrouter-client';
import type { Tone } from '@/types/section-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      tone = 'playful', 
      context = '',
      features = []
    } = body;

    let result;

    switch (type) {
      case 'features':
        // Generate hilarious feature descriptions
        result = await openRouterClient.generateFeatureDescriptions(
          features,
          tone as Tone
        );
        break;

      case 'cta':
        // Generate compelling CTA text
        result = await openRouterClient.generateCTAText(
          context,
          tone as Tone
        );
        break;

      case 'hero':
        // Generate hero content
        const heroPrompt = `Create a compelling hero section for a ${tone} website about: ${context}
        
        Return:
        - Headline (punchy, memorable)
        - Subheadline (supportive, engaging)
        - 3 bullet points (benefits or features)`;
        
        const heroText = await openRouterClient.generateText({
          prompt: heroPrompt,
          tone: tone as Tone,
          model: 'creative',
          temperature: 0.85
        });

        // Parse the response
        const lines = heroText.split('\n').filter(l => l.trim());
        result = {
          headline: lines[0] || 'Amazing Things Await',
          subheadline: lines[1] || 'Discover the extraordinary',
          bullets: lines.slice(2, 5).filter(Boolean)
        };
        break;

      case 'discovery':
        // Generate discovery/teaser text
        const discoveryPrompt = `Create 5 discovery teasers for a ${tone} feature called "${context}".
        Make them intriguing, ${tone}, and slightly unexpected.`;
        
        const discoveryText = await openRouterClient.generateText({
          prompt: discoveryPrompt,
          tone: tone as Tone,
          model: 'creative',
          temperature: 0.9,
          maxTokens: 300
        });

        result = {
          teasers: discoveryText.split('\n').filter(l => l.trim()).slice(0, 5)
        };
        break;

      default:
        // General text generation
        result = await openRouterClient.generateText({
          prompt: context,
          tone: tone as Tone,
          temperature: 0.8
        });
        break;
    }

    return NextResponse.json({
      success: true,
      data: result,
      tone,
      model: 'free' // Indicate we're using free models
    });

  } catch (error) {
    console.error('Content generation error:', error);
    
    // Always return graceful fallback
    return NextResponse.json({
      success: false,
      error: 'Failed to generate content',
      fallback: true,
      data: getLocalFallback(body.type, body.tone)
    });
  }
}

// Local fallback content when API fails
function getLocalFallback(type: string, tone: string) {
  const fallbacks: Record<string, any> = {
    features: {
      'Speed': 'Faster than a caffeinated cheetah',
      'Security': 'Fort Knox wishes it was this secure',
      'Simplicity': 'So simple, even your cat could use it'
    },
    cta: {
      headline: 'Ready to Rock?',
      description: 'Join thousands who already made the leap',
      buttonText: 'Start Now'
    },
    hero: {
      headline: 'Welcome to the Future',
      subheadline: 'Where amazing happens daily',
      bullets: ['Lightning fast', 'Rock solid', 'Dead simple']
    },
    discovery: {
      teasers: [
        'Discover what makes this special',
        'Uncover hidden possibilities',
        'Experience the difference',
        'See why everyone\'s talking',
        'Find out what you\'ve been missing'
      ]
    }
  };

  return fallbacks[type] || { text: 'Something amazing goes here' };
}