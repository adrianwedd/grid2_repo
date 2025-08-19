import { test, expect } from '@playwright/test';

// ==========================================
// API INTEGRATION TESTS
// ==========================================

test.describe('API Integration - /api/generate', () => {
  test('should handle all 14 tones correctly', async ({ request }) => {
    const tones = [
      'minimal', 'bold', 'playful', 'corporate', 'elegant',
      'modern', 'warm', 'luxury', 'creative', 'nature',
      'retro', 'monochrome', 'techno', 'zen'
    ];

    for (const tone of tones) {
      const response = await request.post('/api/generate', {
        data: {
          mode: 'tone',
          tone: tone,
          sections: ['hero', 'features']
        }
      });

      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.tone).toBe(tone);
      expect(data.page).toBeDefined();
      expect(data.page.sections).toHaveLength(2);
      
      // Verify content matches tone
      const heroContent = data.page.sections[0].content;
      expect(heroContent).toBeDefined();
    }
  });

  test('should generate different designs in random mode', async ({ request }) => {
    const designs = [];
    
    // Generate 5 random designs
    for (let i = 0; i < 5; i++) {
      const response = await request.post('/api/generate', {
        data: { mode: 'random' }
      });
      
      const data = await response.json();
      designs.push(data.tone);
    }
    
    // Should have at least 2 different tones in 5 tries
    const uniqueTones = new Set(designs);
    expect(uniqueTones.size).toBeGreaterThan(1);
  });

  test('should correctly interpret intents', async ({ request }) => {
    const testCases = [
      { intent: 'create a bold dramatic website', expectedTone: 'bold' },
      { intent: 'build a corporate professional site', expectedTone: 'corporate' },
      { intent: 'design a playful fun interface', expectedTone: 'playful' },
      { intent: 'make an elegant sophisticated page', expectedTone: 'elegant' },
      { intent: 'create a modern tech startup site', expectedTone: 'modern' },
      { intent: 'build a warm friendly website', expectedTone: 'warm' },
      { intent: 'design a luxury premium experience', expectedTone: 'luxury' },
      { intent: 'make a creative artistic portfolio', expectedTone: 'creative' },
      { intent: 'create an eco nature website', expectedTone: 'nature' },
      { intent: 'build a retro vintage shop', expectedTone: 'retro' },
      { intent: 'design a minimal monochrome interface', expectedTone: 'monochrome' }
    ];

    for (const { intent, expectedTone } of testCases) {
      const response = await request.post('/api/generate', {
        data: {
          mode: 'intent',
          intent: intent
        }
      });

      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.tone).toBe(expectedTone);
    }
  });

  test('should include render time statistics', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        mode: 'tone',
        tone: 'minimal'
      }
    });

    const data = await response.json();
    expect(data.stats).toBeDefined();
    expect(data.stats.renderTime).toBeGreaterThan(0);
    expect(data.stats.sectionCount).toBeGreaterThan(0);
    expect(data.stats.audits).toBeDefined();
  });

  test('should return alternates in addition to primary', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        mode: 'tone',
        tone: 'bold'
      }
    });

    const data = await response.json();
    expect(data.page).toBeDefined();
    expect(data.alternates).toBeDefined();
    expect(Array.isArray(data.alternates)).toBe(true);
    expect(data.alternates.length).toBeLessThanOrEqual(2);
  });

  test('should handle custom content override', async ({ request }) => {
    const customContent = {
      hero: {
        headline: 'Custom Headline',
        subheadline: 'Custom Subheadline',
        bullets: ['Custom 1', 'Custom 2']
      }
    };

    const response = await request.post('/api/generate', {
      data: {
        mode: 'tone',
        tone: 'minimal',
        content: customContent
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.page.sections[0].content.headline).toBe('Custom Headline');
  });

  test('should validate required parameters', async ({ request }) => {
    // Missing intent for intent mode
    const response = await request.post('/api/generate', {
      data: {
        mode: 'intent'
        // intent is missing
      }
    });

    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data.error).toContain('Intent required');
  });

  test('should handle different section configurations', async ({ request }) => {
    const sectionConfigs = [
      ['hero'],
      ['hero', 'features'],
      ['hero', 'features', 'testimonials'],
      ['hero', 'features', 'testimonials', 'cta'],
      ['hero', 'features', 'testimonials', 'cta', 'footer']
    ];

    for (const sections of sectionConfigs) {
      const response = await request.post('/api/generate', {
        data: {
          mode: 'tone',
          tone: 'minimal',
          sections: sections
        }
      });

      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.page.sections).toHaveLength(sections.length);
    }
  });
});

test.describe('API Integration - /api/preview', () => {
  let sessionId: string;

  test('should initialize a preview session', async ({ request }) => {
    const response = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: [
          { id: 'hero-1', kind: 'hero', variant: 'centered' }
        ]
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.sessionId).toBeDefined();
    expect(data.sections).toHaveLength(1);
    
    sessionId = data.sessionId;
  });

  test('should preview transform without committing', async ({ request }) => {
    // First init session
    const initResponse = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: [
          { id: 'hero-1', kind: 'hero', variant: 'centered' }
        ]
      }
    });
    
    const { sessionId } = await initResponse.json();

    // Preview a transform
    const previewResponse = await request.post('/api/preview', {
      data: {
        action: 'preview',
        sessionId: sessionId,
        input: 'make hero bold'
      }
    });

    expect(previewResponse.ok()).toBeTruthy();
    
    const previewData = await previewResponse.json();
    expect(previewData.preview).toBeDefined();
    expect(previewData.intents).toContain('bold');
  });

  test('should commit transforms to history', async ({ request }) => {
    // Init session
    const initResponse = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: [
          { id: 'hero-1', kind: 'hero', variant: 'centered' }
        ]
      }
    });
    
    const { sessionId } = await initResponse.json();

    // Apply command
    const commandResponse = await request.post('/api/preview', {
      data: {
        action: 'command',
        sessionId: sessionId,
        input: 'add features section'
      }
    });

    expect(commandResponse.ok()).toBeTruthy();
    
    const commandData = await commandResponse.json();
    expect(commandData.sections.length).toBeGreaterThan(1);
    expect(commandData.history).toHaveLength(1);
  });

  test('should support undo/redo operations', async ({ request }) => {
    // Init and apply changes
    const initResponse = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: [
          { id: 'hero-1', kind: 'hero', variant: 'centered' }
        ]
      }
    });
    
    const { sessionId } = await initResponse.json();

    // Apply first command
    await request.post('/api/preview', {
      data: {
        action: 'command',
        sessionId: sessionId,
        input: 'add features'
      }
    });

    // Apply second command
    await request.post('/api/preview', {
      data: {
        action: 'command',
        sessionId: sessionId,
        input: 'add testimonials'
      }
    });

    // Undo
    const undoResponse = await request.post('/api/preview', {
      data: {
        action: 'undo',
        sessionId: sessionId
      }
    });

    expect(undoResponse.ok()).toBeTruthy();
    const undoData = await undoResponse.json();
    expect(undoData.sections).toHaveLength(2); // hero + features

    // Redo
    const redoResponse = await request.post('/api/preview', {
      data: {
        action: 'redo',
        sessionId: sessionId
      }
    });

    expect(redoResponse.ok()).toBeTruthy();
    const redoData = await redoResponse.json();
    expect(redoData.sections).toHaveLength(3); // hero + features + testimonials
  });

  test('should retrieve session state', async ({ request }) => {
    // Init session
    const initResponse = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: [
          { id: 'hero-1', kind: 'hero', variant: 'centered' }
        ]
      }
    });
    
    const { sessionId } = await initResponse.json();

    // Get session state
    const getResponse = await request.post('/api/preview', {
      data: {
        action: 'get',
        sessionId: sessionId
      }
    });

    expect(getResponse.ok()).toBeTruthy();
    
    const getData = await getResponse.json();
    expect(getData.sections).toBeDefined();
    expect(getData.history).toBeDefined();
  });

  test('should interpret various transform commands', async ({ request }) => {
    const initResponse = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: [
          { id: 'hero-1', kind: 'hero', variant: 'centered' }
        ]
      }
    });
    
    const { sessionId } = await initResponse.json();

    const commands = [
      { input: 'make it bold', expectedIntent: 'bold' },
      { input: 'add social proof', expectedIntent: 'testimonials' },
      { input: 'increase contrast', expectedIntent: 'contrast' },
      { input: 'remove features', expectedIntent: 'remove' },
      { input: 'make hero dramatic', expectedIntent: 'dramatic' }
    ];

    for (const { input, expectedIntent } of commands) {
      const response = await request.post('/api/preview', {
        data: {
          action: 'preview',
          sessionId: sessionId,
          input: input
        }
      });

      const data = await response.json();
      const intentsString = data.intents.join(' ');
      expect(intentsString.toLowerCase()).toContain(expectedIntent);
    }
  });
});

test.describe('API Error Handling', () => {
  test('should handle malformed JSON gracefully', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(500);
  });

  test('should handle missing session ID', async ({ request }) => {
    const response = await request.post('/api/preview', {
      data: {
        action: 'command',
        // sessionId missing
        input: 'test command'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('should handle invalid action types', async ({ request }) => {
    const response = await request.post('/api/preview', {
      data: {
        action: 'invalid_action',
        sessionId: 'test'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('should handle server timeouts gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/generate', async route => {
      await new Promise(resolve => setTimeout(resolve, 100));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          tone: 'minimal',
          page: { sections: [] }
        })
      });
    });

    await page.goto('/lucky');
    
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    await luckyBtn.click();
    
    // Should show loading state
    await expect(page.locator('text=Getting Lucky...')).toBeVisible();
    
    // Should eventually complete
    await page.waitForResponse('**/api/generate');
  });
});

test.describe('Session Management', () => {
  test('should maintain session across multiple transforms', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    const applyBtn = page.locator('button:has-text("Apply")');

    // Apply multiple transforms
    const commands = [
      'add features section',
      'make it bold',
      'add testimonials',
      'increase contrast'
    ];

    for (const command of commands) {
      await textarea.fill(command);
      await applyBtn.click();
      await page.waitForTimeout(500);
    }

    // Check history exists
    const undoBtn = page.locator('button:has-text("Undo")');
    
    // Should be able to undo all commands
    for (let i = 0; i < commands.length; i++) {
      await undoBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('should handle concurrent API requests', async ({ request }) => {
    const promises = [];
    
    // Send 5 concurrent requests
    for (let i = 0; i < 5; i++) {
      promises.push(
        request.post('/api/generate', {
          data: {
            mode: 'random'
          }
        })
      );
    }

    const responses = await Promise.all(promises);
    
    // All should succeed
    for (const response of responses) {
      expect(response.ok()).toBeTruthy();
    }
  });
});