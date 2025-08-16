// lib/claude-browser-auth.ts
// Claude integration using browser authentication (cookies from claude.ai)

export interface ClaudeBrowserConfig {
  cookies: string;
  organizationId?: string;
}

/**
 * Call Claude using browser authentication
 * This uses the same API that claude.ai uses in the browser
 */
export async function callClaudeWithBrowserAuth(
  prompt: string,
  config: ClaudeBrowserConfig
): Promise<any> {
  const { cookies, organizationId = '1287541f-a020-4755-bbb0-8945a1be4fa5' } = config;

  // Use Claude's browser API endpoint
  const response = await fetch('https://claude.ai/api/organizations/' + organizationId + '/chat_conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies,
      'Accept': 'text/event-stream',
      'Origin': 'https://claude.ai',
      'Referer': 'https://claude.ai/chat',
    },
    body: JSON.stringify({
      prompt,
      timezone: 'America/Los_Angeles',
      attachments: [],
      files: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude browser API error: ${response.status}`);
  }

  // Parse streaming response
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    // Extract content from SSE stream
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.completion) {
            result += data.completion;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return result;
}

/**
 * Generate design spec using browser-authenticated Claude
 */
export async function generateSpecWithBrowserClaude(
  prompt: string,
  cookies: string
): Promise<any> {
  const systemPrompt = `You are an AI Director for a website builder. 
Convert this request into a JSON design specification with this structure:
{
  "style": {
    "tone": "minimal" | "bold" | "playful" | "corporate",
    "inspiration": "apple" | "stripe" | "linear" | "vercel" | "notion",
    "colorScheme": "monochrome" | "vibrant" | "pastel" | "dark" | "brand-heavy",
    "spacing": "tight" | "normal" | "generous" | "airy",
    "typography": "sans" | "serif" | "mixed" | "bold" | "elegant",
    "animations": "none" | "subtle" | "playful" | "dramatic"
  },
  "sections": [
    {
      "kind": "hero" | "features" | "testimonials" | "cta",
      "variant": string,
      "priority": "critical" | "important" | "nice-to-have",
      "content": { optional content overrides }
    }
  ],
  "content": {
    "voice": "professional" | "friendly" | "bold" | "technical" | "inspirational",
    "density": "minimal" | "balanced" | "detailed"
  },
  "layout": {
    "firstImpression": "hero-focused" | "value-first" | "social-proof-first",
    "flow": "linear" | "exploratory" | "conversion-focused",
    "ctaStrategy": "single-strong" | "multiple-soft" | "progressive"
  }
}

User request: "${prompt}"

Respond with ONLY valid JSON, no explanation.`;

  try {
    const response = await callClaudeWithBrowserAuth(systemPrompt, { cookies });
    
    // Try to parse the response as JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not extract JSON from Claude response');
  } catch (error) {
    console.error('Browser Claude failed:', error);
    throw error;
  }
}

// Store cookies in memory (in production, use secure storage)
let storedCookies: string | null = null;

export function setClaudeCookies(cookies: string) {
  storedCookies = cookies;
}

export function getClaudeCookies(): string | null {
  return storedCookies;
}

export function hasClaudeCookies(): boolean {
  return storedCookies !== null && storedCookies.length > 0;
}