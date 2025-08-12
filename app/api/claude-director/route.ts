// app/api/claude-director/route.ts
// The real Claude Director - AI that actually understands design

import { NextRequest, NextResponse } from 'next/server';
import { ClaudeDesignDirector, SpecToConfig } from '@/lib/claude-director';
import { generatePage } from '@/lib/generate-page';
import { withSecurityMiddleware } from '@/lib/middleware/auth';
import { RATE_LIMITS } from '@/lib/middleware/rate-limiter';

export async function POST(request: NextRequest) {
  // Apply security middleware
  const securityResponse = await withSecurityMiddleware(request, {
    rateLimit: RATE_LIMITS.aiDirector,
    auth: { requireAuth: false }, // Set to true in production
  });
  if (securityResponse) return securityResponse;

  try {
    const body = await request.json();
    const {
      intent,      // User's request in natural language
      context,     // Optional context
      apiKey,      // Claude API key (or use env var)
      streaming = false, // Stream Claude's response
    } = body;

    if (!intent) {
      return NextResponse.json(
        { error: 'Intent required' },
        { status: 400 }
      );
    }

    // Get Claude API key
    const claudeKey = apiKey || 
                     process.env.ANTHROPIC_API_KEY ||
                     (process.env.CLAUDE_SESSION_KEY ? 'browser-auth' : null);

    console.log(`🧠 Claude Director: "${intent}"`);
    console.log(`🔑 Auth method: ${claudeKey || 'none'}, Session key: ${process.env.CLAUDE_SESSION_KEY ? 'present' : 'missing'}`);
    
    let spec;
    
    // First, try Python Claude client (most reliable)
    if (process.env.CLAUDE_SESSION_KEY) {
      try {
        console.log('🐍 Attempting Python Claude client...');
        const { generateSpecWithPythonClaude } = await import('@/lib/claude-python-bridge');
        spec = await generateSpecWithPythonClaude(intent);
        console.log('✅ Got response from Claude via Python client');
      } catch (error) {
        console.warn('Python Claude client failed:', error);
        // Fall through to other methods
      }
    }
    
    // Fallback: try to connect to existing browser if user has Chrome open with Claude
    if (!spec) {
      const useExistingBrowser = process.env.USE_EXISTING_BROWSER === 'true';
      if (useExistingBrowser) {
        try {
          console.log('🔌 Attempting to connect to existing Chrome browser...');
          const { generateSpecWithExistingBrowser } = await import('@/lib/claude-existing-browser');
          spec = await generateSpecWithExistingBrowser(intent);
          console.log('✅ Got response from Claude via existing browser');
        } catch (error) {
          console.warn('Existing browser connection failed:', error);
          // Fall through to other methods
        }
      }
    }
    
    // If existing browser didn't work, try browser auth with cookies
    if (!spec && claudeKey === 'browser-auth') {
      // Try browser auth with Playwright
      try {
        const sessionKey = process.env.CLAUDE_SESSION_KEY;
        const orgId = process.env.CLAUDE_ORG_ID;
        
        if (!sessionKey) {
          throw new Error('No CLAUDE_SESSION_KEY found in environment');
        }

        console.log('🚀 Attempting Claude browser automation with cookies...');
        const { generateSpecWithClaudeBrowser } = await import('@/lib/claude-playwright');
        spec = await generateSpecWithClaudeBrowser(intent, {
          sessionKey,
          orgId,
          cfBm: process.env.CLAUDE_CF_BM,
          activitySession: process.env.CLAUDE_ACTIVITY_SESSION,
          deviceId: process.env.CLAUDE_DEVICE_ID,
        });
        console.log('✅ Got response from Claude via browser automation');
      } catch (error) {
        console.error('❌ Browser Claude failed:', error);
        // NO DEMO FALLBACK - will be handled at end
      }
    } else if (claudeKey && claudeKey !== 'your_anthropic_api_key_here') {
      // Try API key
      try {
        const director = new ClaudeDesignDirector(claudeKey);
        spec = await director.generateDesignSpec(intent, context);
      } catch (error) {
        console.error('❌ Claude API failed:', error);
        // NO DEMO FALLBACK - will be handled at end
      }
    }
    
    // If no spec was generated from real Claude, fail hard
    if (!spec) {
      console.error('❌ All Claude methods failed - NO DEMO MODE');
      return NextResponse.json({
        error: 'Claude Director unavailable',
        details: 'All authentication methods failed. Please check Claude session cookies.',
        fallback: false
      }, { status: 503 });
    }

    console.log(`✨ Philosophy: "${spec.philosophy.inspiration}"`);
    console.log(`🎨 Personality: "${spec.style.personality}"`);

    // Convert spec to executable config
    const config = SpecToConfig.convert(spec);

    console.log(`⚙️ Executing design with ${config.sections.length} sections...`);

    // Generate page using beam search
    const { primary, alternates, renderTime } = await generatePage(
      config.content,
      config.brand,
      config.tone,
      config.sections.map(s => s.kind)
    );

    console.log(`🚀 Generated in ${renderTime}ms`);

    // Cache Claude's response for "I'm Feeling Lucky"
    try {
      const { cacheClaudeSpec } = await import('@/lib/claude-cache');
      const cacheId = await cacheClaudeSpec(intent, spec);
      console.log(`💾 Cached as: ${cacheId}`);
    } catch (cacheError) {
      console.warn('Failed to cache spec:', cacheError);
    }

    return NextResponse.json({
      // Claude's complete thinking
      spec: {
        philosophy: spec.philosophy,
        style: spec.style,
        experience: spec.experience,
        optimization: spec.optimization,
        sections: spec.sections.map((s: any) => ({
          ...s,
          // Include Claude's reasoning
          purpose: s.purpose,
          reasoning: s.variant.reasoning,
        })),
      },
      
      // Executable configuration
      config,
      
      // Generated page
      page: primary,
      alternates,
      renderTime,
      
      // Debug info
      debug: {
        prompt: intent,
        philosophy: spec.philosophy.inspiration,
        personality: spec.style.personality,
        principles: spec.philosophy.principles,
        sectionsGenerated: primary.sections.length,
        claudeReasoningAvailable: true,
      },
      
      // Meta
      meta: {
        generatedBy: 'claude-director',
        model: 'claude-3-5-sonnet',
        timestamp: new Date().toISOString(),
        intent,
      },
    });

  } catch (error) {
    console.error('❌ Claude Director error:', error);
    
    // Check if it's a Claude API error
    const isClaudeError = error instanceof Error && 
                         (error.message.includes('Claude API') || 
                          error.message.includes('Invalid design specification'));

    return NextResponse.json(
      { 
        error: 'Design generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        isClaudeError,
        fallbackAvailable: true,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check Claude Director status
export async function GET() {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY && 
                   process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here';
  const hasCookies = !!process.env.CLAUDE_COOKIES;
  
  return NextResponse.json({
    available: hasApiKey || hasCookies,
    authMethod: hasApiKey ? 'api-key' : hasCookies ? 'browser-cookies' : 'none',
    model: 'claude-3-5-sonnet-20241022',
    capabilities: [
      'Complete design philosophy generation',
      'Brand personality interpretation', 
      'Custom visual language creation',
      'User experience journey mapping',
      'Business goal optimization',
      'Contextual content generation',
    ],
    status: 'ready',
  });
}