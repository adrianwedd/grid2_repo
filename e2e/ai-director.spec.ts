import { test, expect } from '@playwright/test';

test.describe('AI Director API', () => {
  test('should generate page with Apple style preset', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {
        prompt: 'Create a landing page inspired by Apple',
        preview: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    expect(json).toHaveProperty('spec');
    expect(json).toHaveProperty('config');
    expect(json).toHaveProperty('page');
    expect(json).toHaveProperty('renderTime');
    
    expect(json.spec.style.tone).toBe('minimal');
    expect(json.spec.style.colorScheme).toBe('monochrome');
    expect(json.spec.style.spacing).toBe('generous');
    
    expect(json.stats.inspiration).toBe('apple');
    expect(json.renderTime).toBeLessThan(100); // Should be fast
  });

  test('should generate page with Stripe style preset', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {
        prompt: 'Build a developer-focused site like Stripe',
        preview: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    expect(json.spec.style.tone).toBe('corporate');
    expect(json.spec.content.voice).toBe('technical');
    expect(json.stats.inspiration).toBe('stripe');
  });

  test('should generate page with Linear style preset', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {
        prompt: 'Design something like Linear',
        preview: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    expect(json.spec.style.colorScheme).toBe('dark');
    expect(json.spec.style.animations).toBe('none');
    expect(json.stats.inspiration).toBe('linear');
  });

  test('should generate page with Vercel style preset', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {
        prompt: 'Create a modern dark site like Vercel',
        preview: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    expect(json.spec.style.tone).toBe('bold');
    expect(json.spec.style.colorScheme).toBe('dark');
    expect(json.stats.inspiration).toBe('vercel');
  });

  test('should generate page with Notion style preset', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {
        prompt: 'Make it playful and creative like Notion',
        preview: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    expect(json.spec.style.tone).toBe('playful');
    expect(json.spec.style.colorScheme).toBe('pastel');
    expect(json.spec.content.voice).toBe('friendly');
    expect(json.stats.inspiration).toBe('notion');
  });

  test('should handle direct spec input', async ({ request }) => {
    const spec = {
      style: {
        tone: 'minimal',
        colorScheme: 'monochrome',
        spacing: 'generous',
        typography: 'sans',
        animations: 'subtle',
      },
      sections: [
        {
          kind: 'hero',
          variant: 'split-image-left',
          priority: 'critical',
        },
        {
          kind: 'features',
          variant: 'cards-3up',
          priority: 'important',
        },
      ],
      content: {
        voice: 'professional',
        density: 'balanced',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'linear',
        ctaStrategy: 'single-strong',
      },
    };

    const response = await request.post('/api/ai-director', {
      data: {
        spec,
        preview: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    expect(json.spec).toEqual(spec);
    expect(json.page.sections).toHaveLength(2);
  });

  test('should return preview when requested', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {
        prompt: 'Create a minimal landing page',
        preview: true,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    expect(json).toHaveProperty('spec');
    expect(json).toHaveProperty('generated_by');
    expect(json).not.toHaveProperty('page'); // Preview doesn't generate page
  });

  test('should handle invalid requests', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {},
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.error).toBe('Prompt or spec required');
  });

  test('should detect style keywords in prompts', async ({ request }) => {
    const testCases = [
      { prompt: 'Create a minimal clean design', expectedTone: 'minimal' },
      { prompt: 'Build a developer-friendly technical site', expectedTone: 'corporate' },
      { prompt: 'Make it dark and modern', expectedColorScheme: 'dark' },
      { prompt: 'Design something playful and fun', expectedTone: 'playful' },
    ];

    for (const testCase of testCases) {
      const response = await request.post('/api/ai-director', {
        data: {
          prompt: testCase.prompt,
          preview: false,
        },
      });

      expect(response.ok()).toBeTruthy();
      const json = await response.json();
      
      if (testCase.expectedTone) {
        expect(json.spec.style.tone).toBe(testCase.expectedTone);
      }
      if (testCase.expectedColorScheme) {
        expect(json.spec.style.colorScheme).toBe(testCase.expectedColorScheme);
      }
    }
  });
});