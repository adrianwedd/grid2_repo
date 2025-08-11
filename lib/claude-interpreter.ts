// lib/claude-interpreter.ts
// Claude AI integration for complex command interpretation

import type { Transform, SectionNode } from '@/types/section-system';

export interface ClaudeInterpretation {
  transforms: string[];  // Transform names to apply
  parameters?: Record<string, any>;  // Optional parameters for transforms
  confidence: number;  // 0-1 confidence score
  reasoning?: string;  // Optional explanation
}

export interface ClaudeConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

const DEFAULT_MODEL = 'claude-3-haiku-20240307';
const DEFAULT_MAX_TOKENS = 500;
const DEFAULT_TEMPERATURE = 0.3; // Lower for more deterministic

/**
 * Interpret complex commands using Claude API
 */
export async function interpretWithClaude(
  command: string,
  currentSections: SectionNode[],
  config: ClaudeConfig
): Promise<ClaudeInterpretation> {
  const { apiKey, model = DEFAULT_MODEL, maxTokens = DEFAULT_MAX_TOKENS, temperature = DEFAULT_TEMPERATURE } = config;

  if (!apiKey) {
    throw new Error('Claude API key not configured');
  }

  // Build context about current page state
  const pageContext = currentSections.map(s => ({
    kind: s.meta.kind,
    variant: s.meta.variant,
    tone: s.props.tone,
    position: s.position,
  }));

  const systemPrompt = `You are a website builder AI that interprets user commands and translates them into specific transforms.

Available transforms:
- makeHeroDramatic: Makes hero section more dramatic with bold tone
- makeHeroMinimal: Makes hero section minimal and clean
- addSocialProof: Adds testimonials section if not present
- addTestimonials: Adds testimonials section
- increaseContrast: Increases visual contrast (dark mode)
- makeFriendly: Softens tone to be more approachable
- addCTA: Adds call-to-action section
- emphasizeFeatures: Makes features section more prominent
- simplifyLayout: Reduces visual complexity
- addFooter: Adds footer section if not present

Current page structure:
${JSON.stringify(pageContext, null, 2)}

Respond with a JSON object containing:
- transforms: array of transform names to apply (in order)
- confidence: 0-1 score of interpretation confidence
- reasoning: brief explanation of interpretation

Only use transforms from the available list. If the command doesn't clearly map to available transforms, return empty transforms array with low confidence.`;

  const userPrompt = `User command: "${command}"

Interpret this command and suggest which transforms to apply.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse Claude's response
    try {
      const parsed = JSON.parse(content);
      return {
        transforms: parsed.transforms || [],
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning,
        parameters: parsed.parameters,
      };
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content);
      // Fallback to empty transforms
      return {
        transforms: [],
        confidence: 0,
        reasoning: 'Failed to parse AI response',
      };
    }
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
}

/**
 * Simple regex-based interpreter for basic commands (fallback)
 */
export function interpretSimple(command: string): ClaudeInterpretation {
  const normalized = command.toLowerCase();
  const transforms: string[] = [];
  let confidence = 0.8; // High confidence for simple pattern matching

  // Pattern matching for common commands
  if (normalized.includes('dramatic') || normalized.includes('bold')) {
    transforms.push('makeHeroDramatic');
  }
  if (normalized.includes('minimal') || normalized.includes('simple') || normalized.includes('clean')) {
    transforms.push('makeHeroMinimal');
  }
  if (normalized.includes('social proof') || normalized.includes('testimonial')) {
    transforms.push('addSocialProof');
  }
  if (normalized.includes('contrast') || normalized.includes('dark')) {
    transforms.push('increaseContrast');
  }
  if (normalized.includes('friendly') || normalized.includes('approachable') || normalized.includes('warm')) {
    transforms.push('makeFriendly');
  }
  if (normalized.includes('cta') || normalized.includes('call to action') || normalized.includes('button')) {
    transforms.push('addCTA');
  }
  if (normalized.includes('feature')) {
    transforms.push('emphasizeFeatures');
  }
  if (normalized.includes('simplify') || normalized.includes('reduce')) {
    transforms.push('simplifyLayout');
  }
  if (normalized.includes('footer')) {
    transforms.push('addFooter');
  }

  // If no matches, lower confidence
  if (transforms.length === 0) {
    confidence = 0;
  }

  return {
    transforms,
    confidence,
    reasoning: 'Pattern-based interpretation',
  };
}

/**
 * Hybrid interpreter: tries Claude first, falls back to simple patterns
 */
export async function interpretCommand(
  command: string,
  currentSections: SectionNode[],
  options?: {
    useClaudeIfAvailable?: boolean;
    apiKey?: string;
    model?: string;
  }
): Promise<ClaudeInterpretation> {
  const { useClaudeIfAvailable = true, apiKey, model } = options || {};

  // Check if we should and can use Claude
  const shouldUseClaude = useClaudeIfAvailable && apiKey && command.length > 20;

  if (shouldUseClaude) {
    try {
      // Try Claude for complex commands
      const result = await interpretWithClaude(command, currentSections, { apiKey, model });
      
      // If Claude gives high confidence, use it
      if (result.confidence > 0.6) {
        return result;
      }
      
      // Otherwise, merge with simple interpretation
      const simple = interpretSimple(command);
      return {
        transforms: [...new Set([...result.transforms, ...simple.transforms])],
        confidence: Math.max(result.confidence, simple.confidence),
        reasoning: result.reasoning || simple.reasoning,
      };
    } catch (error) {
      console.warn('Claude interpretation failed, falling back to simple:', error);
      // Fall through to simple interpretation
    }
  }

  // Fallback to simple pattern matching
  return interpretSimple(command);
}