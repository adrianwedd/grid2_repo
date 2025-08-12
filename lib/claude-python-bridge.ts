// lib/claude-python-bridge.ts
// Bridge to use the working Python Claude browser implementation

import { spawn } from 'child_process';
import path from 'path';

interface ClaudePythonResult {
  success: boolean;
  response?: string;
  error?: string;
}

export class ClaudePythonBridge {
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    this.pythonPath = 'python3'; // or 'python' depending on system
    this.scriptPath = path.join(process.cwd(), 'claude-simple-client.py');
  }

  async sendMessage(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('🐍 Using Python Claude client...');
      
      const python = spawn(this.pythonPath, [this.scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,  // Pass through all environment variables
          CLAUDE_SESSION_KEY: process.env.CLAUDE_SESSION_KEY || '',
          CLAUDE_ORG_ID: process.env.CLAUDE_ORG_ID || '',
          CLAUDE_CF_BM: process.env.CLAUDE_CF_BM || '',
          CLAUDE_ACTIVITY_SESSION: process.env.CLAUDE_ACTIVITY_SESSION || '',
          CLAUDE_DEVICE_ID: process.env.CLAUDE_DEVICE_ID || '',
          CLAUDE_USER_ID: process.env.CLAUDE_USER_ID || ''
        }
      });

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          try {
            // Look for JSON in the output
            const jsonMatch = output.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              resolve(jsonMatch[0]);
            } else {
              // Return the full output if no JSON found
              resolve(output.trim());
            }
          } catch (e) {
            reject(new Error(`Failed to parse Python output: ${e}`));
          }
        } else {
          reject(new Error(`Python script failed with code ${code}: ${errorOutput}`));
        }
      });

      python.on('error', (error) => {
        reject(new Error(`Failed to spawn Python: ${error.message}`));
      });

      // Send the prompt to Python script
      python.stdin.write(prompt);
      python.stdin.end();
    });
  }
}

export async function generateSpecWithPythonClaude(prompt: string): Promise<any> {
  const systemPrompt = `You are Claude, an expert web design director. Analyze this request and create a comprehensive JSON design specification with specific CSS-ready styling data.

CRITICAL: Respond with ONLY valid JSON, no explanations.

Create a unique visual identity with specific design tokens:

{
  "philosophy": {
    "inspiration": "Specific design reference (e.g. 'Brutalist architecture meets Swiss typography')",
    "principles": ["specific design principles"],
    "antipatterns": ["what to avoid"]
  },
  "brandTokens": {
    "colors": {
      "primary": "#hexcode",
      "secondary": "#hexcode", 
      "accent": "#hexcode",
      "neutral": ["#hex1", "#hex2", "#hex3"],
      "semantic": {
        "success": "#hexcode",
        "warning": "#hexcode", 
        "error": "#hexcode"
      }
    },
    "typography": {
      "headingFont": "specific font name",
      "bodyFont": "specific font name",
      "monoFont": "monospace font",
      "scale": {
        "xs": "0.75rem",
        "sm": "0.875rem", 
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem"
      },
      "weights": {
        "light": 300,
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      }
    },
    "spacing": {
      "unit": 4,
      "scale": [2, 4, 8, 12, 16, 24, 32, 48, 64, 96]
    },
    "borderRadius": {
      "none": "0",
      "sm": "0.125rem", 
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "full": "9999px"
    },
    "shadows": {
      "sm": "specific shadow values",
      "md": "specific shadow values",
      "lg": "specific shadow values"
    }
  },
  "visualStyle": {
    "personality": "specific brand personality",
    "tone": "minimal" | "bold" | "playful" | "corporate" | "luxury" | "tech" | "organic",
    "mood": "specific mood description",
    "animations": {
      "duration": "150ms" | "300ms" | "500ms",
      "easing": "ease-in-out" | "cubic-bezier(...)",
      "effects": ["fade", "slide", "scale", "rotate"]
    },
    "layout": {
      "maxWidth": "1200px" | "1400px" | "100%",
      "gutter": "1rem" | "1.5rem" | "2rem",
      "grid": "12" | "16" | "flexible"
    }
  },
  "sections": [
    {
      "kind": "hero",
      "style": {
        "background": "gradient" | "solid" | "image" | "pattern",
        "backgroundValue": "specific CSS value",
        "textAlign": "left" | "center" | "right",
        "padding": "specific padding values",
        "height": "viewport" | "auto" | "fixed"
      },
      "content": {
        "headline": "generated headline text",
        "subheadline": "generated subheadline",
        "cta": "call to action text"
      }
    }
  ],
  "responsive": {
    "breakpoints": {
      "mobile": "768px",
      "tablet": "1024px", 
      "desktop": "1280px"
    },
    "strategy": "mobile-first" | "desktop-first"
  }
}

Here's an example of the expected format:

{
  "philosophy": {
    "inspiration": "Scandinavian minimalism meets Japanese wabi-sabi",
    "principles": ["intentional white space", "natural textures", "subtle color harmony"],
    "antipatterns": ["visual clutter", "aggressive marketing copy", "flashy animations"]
  },
  "brandTokens": {
    "colors": {
      "primary": "#2c3e50",
      "secondary": "#34495e",
      "accent": "#e74c3c",
      "neutral": ["#f8f9fa", "#e9ecef", "#dee2e6"],
      "semantic": {
        "success": "#27ae60",
        "warning": "#f39c12",
        "error": "#e74c3c"
      }
    },
    "typography": {
      "headingFont": "Inter",
      "bodyFont": "Source Sans Pro",
      "monoFont": "JetBrains Mono",
      "scale": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem"
      },
      "weights": {
        "light": 300,
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      }
    },
    "spacing": {
      "unit": 4,
      "scale": [2, 4, 8, 12, 16, 24, 32, 48, 64, 96]
    },
    "borderRadius": {
      "none": "0",
      "sm": "0.125rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "full": "9999px"
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px rgba(0, 0, 0, 0.1)"
    }
  },
  "visualStyle": {
    "personality": "Thoughtful minimalist with warm undertones",
    "tone": "minimal",
    "mood": "Calm confidence with approachable sophistication",
    "animations": {
      "duration": "300ms",
      "easing": "cubic-bezier(0.4, 0, 0.2, 1)",
      "effects": ["fade", "slide"]
    },
    "layout": {
      "maxWidth": "1200px",
      "gutter": "1.5rem",
      "grid": "12"
    }
  },
  "sections": [
    {
      "kind": "hero",
      "style": {
        "background": "solid",
        "backgroundValue": "#f8f9fa",
        "textAlign": "left",
        "padding": "4rem 2rem",
        "height": "auto"
      },
      "content": {
        "headline": "Thoughtful design for modern life",
        "subheadline": "Creating spaces that inspire calm and focus",
        "cta": "Explore our approach"
      }
    }
  ],
  "responsive": {
    "breakpoints": {
      "mobile": "768px",
      "tablet": "1024px",
      "desktop": "1280px"
    },
    "strategy": "mobile-first"
  }
}

Now create a unique design for: "${prompt}"`;

  const bridge = new ClaudePythonBridge();
  const response = await bridge.sendMessage(systemPrompt);
  
  // Try to extract JSON from the response - use more robust matching
  let jsonMatch = response.match(/\{(?:[^{}]|{[^{}]*})*\}/);
  
  // If first regex fails, try to find the largest valid JSON block
  if (!jsonMatch) {
    // Look for JSON blocks that start with { and try to find valid JSON
    const possibleStarts = [...response.matchAll(/\{/g)];
    for (const match of possibleStarts) {
      const fromMatch = response.substring(match.index);
      // Try progressively longer substrings to find valid JSON
      for (let end = fromMatch.length; end > 100; end -= 10) {
        const candidate = fromMatch.substring(0, end);
        if (candidate.trim().endsWith('}')) {
          try {
            JSON.parse(candidate);
            jsonMatch = [candidate];
            break;
          } catch (e) {
            continue;
          }
        }
      }
      if (jsonMatch) break;
    }
  }
  
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ Successfully parsed JSON response');
      return parsed;
    } catch (e) {
      console.error('Failed to parse extracted JSON:', e);
      console.error('JSON snippet:', jsonMatch[0].substring(0, 200));
      throw new Error('Invalid JSON in Claude response');
    }
  }
  
  console.log('Full Claude response:', response);
  throw new Error('No JSON found in Claude response: ' + response.substring(0, 100));
}