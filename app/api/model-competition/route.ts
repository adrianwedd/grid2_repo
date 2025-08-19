// API endpoint for the model competition - this WILL work on Vercel!

import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Competition models that WORK (from your dashboard)
const COMPETITION_MODELS = [
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'deepseek/deepseek-r1:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'qwen/qwen3-coder:free',
  'moonshotai/kimi-k2:free',
  'z-ai/glm-4.5-air:free'
];

export async function POST(request: NextRequest) {
  try {
    const { challenge, model } = await request.json();
    
    const selectedModel = model || COMPETITION_MODELS[Math.floor(Math.random() * COMPETITION_MODELS.length)];
    
    const prompt = challenge || `Create a wildly creative website style with:
1. A memorable name
2. A bold philosophy
3. Unique color scheme
4. 3 innovative features
5. Catchy hero headline

Be extremely creative and unconventional! Format as JSON.`;

    console.log(`🤖 Using model: ${selectedModel}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app/',
        'X-Title': 'Grid 2.0 Model Competition'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{
          role: 'system',
          content: 'You are a wildly creative web designer. Break all conventions!'
        }, {
          role: 'user',
          content: prompt
        }],
        max_tokens: 500,
        temperature: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      return NextResponse.json(
        { error: 'Model API failed', details: error },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse JSON from response
    let styleData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      styleData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      styleData = { raw: content };
    }

    return NextResponse.json({
      success: true,
      model: selectedModel,
      style: styleData || { raw: content },
      usage: data.usage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Competition error:', error);
    return NextResponse.json(
      { error: 'Competition failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to run a full competition
export async function GET() {
  console.log('🏆 Running Model Competition on Vercel!');
  
  const results = [];
  
  for (const model of COMPETITION_MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://grid2repo.vercel.app/',
          'X-Title': 'Grid 2.0 Model Competition'
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: 'user',
            content: 'Create a website style name and tagline. Be creative! (10 words max)'
          }],
          max_tokens: 100,
          temperature: 0.8
        })
      });

      if (response.ok) {
        const data = await response.json();
        results.push({
          model,
          success: true,
          response: data.choices[0].message.content
        });
      } else {
        const error = await response.text();
        results.push({
          model,
          success: false,
          error: error.substring(0, 100)
        });
      }
    } catch (error) {
      results.push({
        model,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 1000));
  }
  
  return NextResponse.json({
    competition: 'Model Style Competition',
    timestamp: new Date().toISOString(),
    models: COMPETITION_MODELS.length,
    results,
    summary: {
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  });
}