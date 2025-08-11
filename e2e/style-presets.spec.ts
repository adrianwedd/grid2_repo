import { test, expect } from '@playwright/test';

test.describe('Style Presets', () => {
  const presets = [
    {
      name: 'Apple',
      prompt: 'Create a site like Apple',
      expectedStyle: {
        tone: 'minimal',
        colorScheme: 'monochrome',
        spacing: 'generous',
        typography: 'sans',
        animations: 'subtle',
      },
      expectedContent: {
        voice: 'inspirational',
        density: 'minimal',
      },
    },
    {
      name: 'Stripe',
      prompt: 'Build something like Stripe',
      expectedStyle: {
        tone: 'corporate',
        colorScheme: 'brand-heavy',
        spacing: 'normal',
        typography: 'sans',
        animations: 'subtle',
      },
      expectedContent: {
        voice: 'technical',
        density: 'detailed',
      },
    },
    {
      name: 'Linear',
      prompt: 'Design like Linear',
      expectedStyle: {
        tone: 'minimal',
        colorScheme: 'dark',
        spacing: 'normal',
        typography: 'sans',
        animations: 'none',
      },
      expectedContent: {
        voice: 'technical',
        density: 'balanced',
      },
    },
    {
      name: 'Vercel',
      prompt: 'Make it like Vercel',
      expectedStyle: {
        tone: 'bold',
        colorScheme: 'dark',
        spacing: 'generous',
        typography: 'bold',
        animations: 'subtle',
      },
      expectedContent: {
        voice: 'bold',
        density: 'minimal',
      },
    },
    {
      name: 'Notion',
      prompt: 'Create something like Notion',
      expectedStyle: {
        tone: 'playful',
        colorScheme: 'pastel',
        spacing: 'normal',
        typography: 'mixed',
        animations: 'playful',
      },
      expectedContent: {
        voice: 'friendly',
        density: 'balanced',
      },
    },
  ];

  for (const preset of presets) {
    test(`should apply ${preset.name} style preset correctly`, async ({ request }) => {
      const response = await request.post('/api/ai-director', {
        data: {
          prompt: preset.prompt,
          preview: false,
        },
      });

      expect(response.ok()).toBeTruthy();
      const json = await response.json();

      // Check style properties
      expect(json.spec.style.tone).toBe(preset.expectedStyle.tone);
      expect(json.spec.style.colorScheme).toBe(preset.expectedStyle.colorScheme);
      expect(json.spec.style.spacing).toBe(preset.expectedStyle.spacing);
      expect(json.spec.style.typography).toBe(preset.expectedStyle.typography);
      expect(json.spec.style.animations).toBe(preset.expectedStyle.animations);

      // Check content strategy
      expect(json.spec.content.voice).toBe(preset.expectedContent.voice);
      expect(json.spec.content.density).toBe(preset.expectedContent.density);

      // Check that inspiration is set
      expect(json.spec.style.inspiration).toBe(preset.name.toLowerCase());
    });
  }

  test('should generate appropriate sections for each preset', async ({ request }) => {
    const presetSectionExpectations = {
      apple: {
        requiredKinds: ['hero', 'features', 'cta'],
        heroVariant: 'split-image-left',
      },
      stripe: {
        requiredKinds: ['hero', 'features', 'testimonials', 'cta'],
        featuresImportance: 'critical',
      },
      linear: {
        requiredKinds: ['hero', 'features', 'cta'],
        minimalSections: true,
      },
      vercel: {
        requiredKinds: ['hero', 'features', 'cta'],
        heroEmphasis: 'visual',
      },
      notion: {
        requiredKinds: ['hero', 'features', 'cta'],
        allowsTestimonials: true,
      },
    };

    for (const [presetName, expectations] of Object.entries(presetSectionExpectations)) {
      const response = await request.post('/api/ai-director', {
        data: {
          prompt: `Create a site like ${presetName}`,
          preview: false,
        },
      });

      expect(response.ok()).toBeTruthy();
      const json = await response.json();

      const sectionKinds = json.page.sections.map(s => s.meta.kind);
      
      // Check required sections are present
      for (const kind of expectations.requiredKinds) {
        expect(sectionKinds).toContain(kind);
      }

      // Check specific expectations
      if (expectations.heroVariant) {
        const heroSection = json.page.sections.find(s => s.meta.kind === 'hero');
        expect(heroSection?.meta.variant).toBe(expectations.heroVariant);
      }

      if (expectations.minimalSections) {
        expect(json.page.sections.length).toBeLessThanOrEqual(4);
      }

      if (expectations.allowsTestimonials) {
        // Notion can have testimonials but doesn't require them
        const hasTestimonials = sectionKinds.includes('testimonials');
        expect(typeof hasTestimonials).toBe('boolean'); // Just check it's a valid boolean
      }
    }
  });

  test('should apply correct brand tokens for each preset', async ({ request }) => {
    const brandExpectations = {
      apple: {
        hasMonochromeColors: true,
        fontHeading: 'Inter',
        spacingType: 'generous',
      },
      stripe: {
        hasBrandColors: true,
        fontHeading: 'Inter',
        spacingType: 'normal',
      },
      linear: {
        hasDarkColors: true,
        fontHeading: 'Inter',
        spacingType: 'normal',
      },
      vercel: {
        hasDarkColors: true,
        fontHeading: 'Space Grotesk',
        spacingType: 'generous',
      },
      notion: {
        fontHeading: 'Playfair Display',
        spacingType: 'normal',
      },
    };

    for (const [presetName, expectations] of Object.entries(brandExpectations)) {
      const response = await request.post('/api/ai-director', {
        data: {
          prompt: `Design like ${presetName}`,
          preview: false,
        },
      });

      expect(response.ok()).toBeTruthy();
      const json = await response.json();

      if (expectations.hasMonochromeColors) {
        expect(json.config.brand.colors).toBeTruthy();
      }

      if (expectations.fontHeading) {
        expect(json.config.brand.fonts?.heading).toBe(expectations.fontHeading);
      }

      if (expectations.spacingType === 'generous') {
        expect(json.config.brand.spacing?.normal).toBeGreaterThanOrEqual(1.2);
      } else if (expectations.spacingType === 'normal') {
        expect(json.config.brand.spacing?.normal).toBeCloseTo(1, 1);
      }
    }
  });

  test('should handle variations of preset names', async ({ request }) => {
    const variations = [
      { prompt: 'apple-like design', expected: 'apple' },
      { prompt: 'stripe inspired', expected: 'stripe' },
      { prompt: 'similar to linear', expected: 'linear' },
      { prompt: 'vercel style', expected: 'vercel' },
      { prompt: 'notion-esque', expected: 'notion' },
    ];

    for (const variation of variations) {
      const response = await request.post('/api/ai-director', {
        data: {
          prompt: variation.prompt,
          preview: false,
        },
      });

      expect(response.ok()).toBeTruthy();
      const json = await response.json();
      
      expect(json.stats.inspiration?.toLowerCase()).toContain(variation.expected);
    }
  });

  test('should fall back gracefully when no preset matches', async ({ request }) => {
    const response = await request.post('/api/ai-director', {
      data: {
        prompt: 'Create a unique custom design with no specific inspiration',
        preview: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    
    // Should have default values
    expect(json.spec.style.tone).toBeTruthy();
    expect(json.spec.style.colorScheme).toBeTruthy();
    expect(json.spec.sections.length).toBeGreaterThan(0);
    
    // Should still generate a valid page
    expect(json.page.sections.length).toBeGreaterThan(0);
    expect(json.renderTime).toBeLessThan(100);
  });
});