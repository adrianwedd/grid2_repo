// lib/llm/openrouter.ts
// OpenRouter API integration for LLM features

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenRouter API key not configured');
    }
  }

  async chat(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://grid2repo.vercel.app',
        'X-Title': 'Grid 2.0 Builder'
      },
      body: JSON.stringify({
        ...request,
        stream: false // We don't support streaming yet
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async generatePageContent(prompt: string, context?: any): Promise<string> {
    const systemPrompt = `You are an expert web designer and content strategist. 
Your task is to provide specific, actionable suggestions for improving web pages.
Focus on:
1. Visual design and aesthetics
2. Content structure and hierarchy
3. User experience improvements
4. Conversion optimization
5. Accessibility considerations

Provide clear, specific recommendations that can be implemented immediately.`;

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    if (context) {
      messages.push({
        role: 'user',
        content: `Current page context: ${JSON.stringify(context, null, 2)}`
      });
    }

    const response = await this.chat({
      model: 'anthropic/claude-3-haiku', // Fast and cost-effective
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || '';
  }

  async transformCommand(userInput: string, sections: any[]): Promise<string> {
    const systemPrompt = `You are a web page transformation assistant.
Convert user requests into specific transformation commands.

Available commands:
- "add [section]" - Add a new section (hero, features, about, etc.)
- "remove [section]" - Remove a section
- "change tone to [tone]" - Change visual tone (minimal, bold, playful, etc.)
- "update headline to [text]" - Update main headline
- "make it [adjective]" - Transform style (dramatic, professional, fun, etc.)

Based on the user's input, suggest the most appropriate transformation command.`;

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `User request: "${userInput}"
Current sections: ${sections.map(s => s.meta?.kind).join(', ')}
        
Suggest a transformation command:`
      }
    ];

    const response = await this.chat({
      model: 'anthropic/claude-3-haiku',
      messages,
      temperature: 0.3,
      max_tokens: 100
    });

    return response.choices[0]?.message?.content || userInput;
  }

  // Get available models from OpenRouter
  async getAvailableModels(): Promise<string[]> {
    // Popular models on OpenRouter
    return [
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      'openai/gpt-4-turbo',
      'openai/gpt-3.5-turbo',
      'google/gemini-pro',
      'meta-llama/llama-3.1-70b-instruct',
      'mistralai/mistral-7b-instruct'
    ];
  }
}