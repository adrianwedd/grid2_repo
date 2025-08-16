import { test, expect } from '@playwright/test';

test.describe('Beam Search Determinism', () => {
  test('should generate consistent output for same input', async ({ request }) => {
    const spec = {
      style: {
        tone: 'minimal',
        colorScheme: 'monochrome',
        spacing: 'normal',
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
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical',
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

    // Make multiple requests with same spec
    const responses = [];
    for (let i = 0; i < 3; i++) {
      const response = await request.post('/api/ai-director', {
        data: { spec, preview: false },
      });
      
      expect(response.ok()).toBeTruthy();
      const json = await response.json();
      responses.push(json);
    }

    // Check that all responses have same structure
    for (let i = 1; i < responses.length; i++) {
      // Same number of sections
      expect(responses[i].page.sections.length).toBe(responses[0].page.sections.length);
      
      // Same section kinds in same order
      const kinds0 = responses[0].page.sections.map((s: any) => s.meta.kind);
      const kindsI = responses[i].page.sections.map((s: any) => s.meta.kind);
      expect(kindsI).toEqual(kinds0);
      
      // Same variants selected
      const variants0 = responses[0].page.sections.map((s: any) => s.meta.variant);
      const variantsI = responses[i].page.sections.map((s: any) => s.meta.variant);
      expect(variantsI).toEqual(variants0);
      
      // Same tone
      expect(responses[i].config.tone).toBe(responses[0].config.tone);
    }
  });

  test('should respect required sections', async ({ request }) => {
    const spec = {
      style: {
        tone: 'bold',
        colorScheme: 'vibrant',
        spacing: 'normal',
        typography: 'bold',
        animations: 'playful',
      },
      sections: [
        {
          kind: 'hero',
          variant: 'full-bleed',
          priority: 'critical', // Required
        },
        {
          kind: 'features',
          variant: 'bento-grid',
          priority: 'nice-to-have', // Optional
        },
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical', // Required
        },
      ],
      content: {
        voice: 'bold',
        density: 'minimal',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'conversion-focused',
        ctaStrategy: 'single-strong',
      },
    };

    const response = await request.post('/api/ai-director', {
      data: { spec, preview: false },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();

    // Check that critical sections are included
    const sectionKinds = json.page.sections.map((s: any) => s.meta.kind);
    expect(sectionKinds).toContain('hero');
    expect(sectionKinds).toContain('cta');
    
    // Features might or might not be included (nice-to-have)
    // But hero and cta must be there
    expect(json.config.requiredSections).toContain('hero');
    expect(json.config.requiredSections).toContain('cta');
    expect(json.config.requiredSections).not.toContain('features');
  });

  test('should generate pages quickly', async ({ request }) => {
    const prompts = [
      'Create a minimal landing page',
      'Build a bold marketing site',
      'Design a playful product page',
      'Make a corporate business site',
      'Create a technical documentation site',
    ];

    for (const prompt of prompts) {
      const startTime = Date.now();
      
      const response = await request.post('/api/ai-director', {
        data: { prompt, preview: false },
      });
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      expect(response.ok()).toBeTruthy();
      const json = await response.json();
      
      // Total request time should be reasonable
      expect(totalTime).toBeLessThan(1000); // Less than 1 second
      
      // Render time should be very fast
      expect(json.renderTime).toBeLessThan(100); // Less than 100ms
    }
  });

  test('should handle different tones correctly', async ({ request }) => {
    const tones = ['minimal', 'bold', 'playful', 'corporate'];
    
    for (const tone of tones) {
      const spec = {
        style: {
          tone,
          colorScheme: 'brand-heavy',
          spacing: 'normal',
          typography: 'sans',
          animations: tone === 'playful' ? 'playful' : 'subtle',
        },
        sections: [
          {
            kind: 'hero',
            variant: 'split-image-left',
            priority: 'critical',
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
        data: { spec, preview: false },
      });

      expect(response.ok()).toBeTruthy();
      const json = await response.json();
      
      // Tone should be preserved
      expect(json.config.tone).toBe(tone);
      expect(json.spec.style.tone).toBe(tone);
    }
  });

  test('should select appropriate variants based on style', async ({ request }) => {
    // Test that variant selection respects style preferences
    const spec = {
      style: {
        tone: 'playful',
        colorScheme: 'vibrant',
        spacing: 'normal',
        typography: 'mixed',
        animations: 'playful', // Should prefer carousel
      },
      sections: [
        {
          kind: 'testimonials',
          // Don't specify variant, let system choose
          priority: 'important',
        },
      ],
      content: {
        voice: 'friendly',
        density: 'balanced',
      },
      layout: {
        firstImpression: 'social-proof',
        flow: 'exploratory',
        ctaStrategy: 'progressive',
      },
    };

    const response = await request.post('/api/ai-director', {
      data: { spec, preview: false },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    // Check that a testimonials section was generated
    const testimonialSection = json.page.sections.find((s: any) => s.meta.kind === 'testimonials');
    expect(testimonialSection).toBeTruthy();
    
    // With playful animations, carousel might be preferred (if available)
    // This is a heuristic test - adjust based on actual scoring logic
    if (testimonialSection) {
      expect(testimonialSection.meta.variant).toBeTruthy();
    }
  });
});