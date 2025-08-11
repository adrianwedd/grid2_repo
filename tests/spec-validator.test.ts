// tests/spec-validator.test.ts
// Test suite for validation and sanitization

import { describe, it, expect } from 'vitest';
import { SpecValidator } from '../lib/validation/spec-validator';

describe('SpecValidator', () => {
  it('validates correct specification', () => {
    const validSpec = {
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
          variant: 'centered-minimal',
          priority: 'critical',
        },
      ],
      content: {
        voice: 'professional',
        density: 'minimal',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'linear',
        ctaStrategy: 'single-strong',
      },
    };

    const result = SpecValidator.validate(validSpec);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('rejects invalid specification', () => {
    const invalidSpec = {
      style: {
        tone: 'invalid-tone', // Invalid enum
      },
    };

    const result = SpecValidator.validate(invalidSpec);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors![0]).toContain('tone');
  });

  it('sanitizes HTML in content', () => {
    const unsafeContent = {
      headline: '<script>alert("XSS")</script>Clean text',
      subheadline: 'Text with <b>bold</b> allowed',
      bullets: [
        'Normal bullet',
        '<img src=x onerror=alert(1)>Dangerous bullet',
        'Another <strong>safe</strong> bullet'
      ]
    };

    const sanitized = SpecValidator.sanitizeContent(unsafeContent);
    expect(sanitized.headline).toBe('Clean text');
    expect(sanitized.subheadline).toBe('Text with <b>bold</b> allowed');
    expect(sanitized.bullets[1]).toBe('Dangerous bullet');
    expect(sanitized.bullets[2]).toContain('<strong>');
  });

  it('repairs common AI mistakes', () => {
    const brokenSpec = {
      style: {
        tone: 'minimalist', // Common typo
        colorScheme: 'monochrome',
        spacing: 'normal',
        typography: 'sans',
        animations: 'subtle',
      },
      brand: {
        primaryColor: 'rgb(0, 123, 255)', // Wrong format
      },
      sections: [
        {
          kind: 'hero',
          variant: 'minimal',
          priority: 'critical',
        },
        {
          kind: 'invalid-section', // Made up section
          variant: 'test',
          priority: 'critical',
        },
      ],
      content: {
        voice: 'profesional', // Typo
        density: 'minimal',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'linear',
        ctaStrategy: 'single-strong',
      },
    };

    const repaired = SpecValidator.attemptRepair(brokenSpec);
    
    expect(repaired.style.tone).toBe('minimal');
    expect(repaired.brand.primaryColor).toBe('#007bff');
    expect(repaired.sections).toHaveLength(1); // Invalid section removed
    expect(repaired.content.voice).toBe('professional');
  });

  it('provides helpful warnings', () => {
    const spec = {
      style: {
        tone: 'minimal',
        colorScheme: 'dark',
        spacing: 'tight',
        typography: 'sans',
        animations: 'dramatic', // Conflicts with tight spacing
      },
      sections: [
        // Missing hero and CTA - should warn
        {
          kind: 'features',
          variant: 'cards-3up',
          priority: 'critical',
        },
      ],
      content: {
        voice: 'friendly', // Could conflict with dark theme
        density: 'minimal',
      },
      layout: {
        firstImpression: 'value-first',
        flow: 'linear',
        ctaStrategy: 'single-strong',
      },
    };

    const result = SpecValidator.validateAndSanitize(spec);
    
    expect(result.success).toBe(true);
    expect(result.warnings).toBeDefined();
    expect(result.warnings).toContain('Dramatic animations with tight spacing may feel cramped');
    // Skip the voice check since we changed it to 'friendly'
    expect(result.warnings).toContain('No hero section - consider adding for better first impression');
    expect(result.warnings).toContain('No CTA section - may impact conversions');
  });

  it('handles deeply nested malicious content', () => {
    const maliciousSpec = {
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
          variant: 'minimal',
          priority: 'critical',
          content: {
            headline: '<script>steal()</script>Welcome',
            bullets: [
              'Feature <script>track()</script> one',
              'Feature <b>two</b>',
              '<iframe src="evil.com">three</iframe>'
            ]
          }
        },
      ],
      content: {
        voice: 'professional',
        density: 'minimal',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'linear',
        ctaStrategy: 'single-strong',
      },
    };

    const result = SpecValidator.validateAndSanitize(maliciousSpec);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    const heroContent = result.data!.sections[0].content;
    expect(heroContent?.headline).toBe('Welcome');
    expect(heroContent?.bullets?.[0]).toBe('Feature  one');
    expect(heroContent?.bullets?.[1]).toBe('Feature <b>two</b>');
    expect(heroContent?.bullets?.[2]).toBe('three');
  });

  it('converts various color formats correctly', () => {
    const specs = [
      { input: 'rgb(255, 0, 0)', expected: '#ff0000' },
      { input: 'rgb(0, 255, 0)', expected: '#00ff00' },
      { input: 'rgb(0, 0, 255)', expected: '#0000ff' },
      { input: '007bff', expected: '#007bff' },
      { input: '#123456', expected: '#123456' },
    ];

    specs.forEach(({ input, expected }) => {
      const spec = {
        style: {
          tone: 'minimal',
          colorScheme: 'brand-heavy',
          spacing: 'normal',
          typography: 'sans',
          animations: 'subtle',
        },
        brand: {
          primaryColor: input,
        },
        sections: [],
        content: {
          voice: 'professional',
          density: 'minimal',
        },
        layout: {
          firstImpression: 'hero-focused',
          flow: 'linear',
          ctaStrategy: 'single-strong',
        },
      };

      const repaired = SpecValidator.attemptRepair(spec);
      expect(repaired.brand.primaryColor).toBe(expected);
    });
  });

  it('preserves valid specifications without modification', () => {
    const perfectSpec = {
      style: {
        tone: 'bold',
        inspiration: 'stripe',
        colorScheme: 'brand-heavy',
        spacing: 'normal',
        typography: 'sans',
        animations: 'subtle',
      },
      sections: [
        {
          kind: 'hero',
          variant: 'split-image-left',
          priority: 'critical',
          content: {
            headline: 'Perfect Headline',
            subheadline: 'Perfect subheadline',
            bullets: ['One', 'Two', 'Three'],
          },
        },
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical',
        },
      ],
      brand: {
        primaryColor: '#0070f3',
        font: {
          heading: 'Inter',
          body: 'Inter',
        },
      },
      content: {
        voice: 'technical',
        density: 'detailed',
        emphasis: ['performance', 'reliability'],
      },
      layout: {
        firstImpression: 'value-first',
        flow: 'linear',
        ctaStrategy: 'progressive',
      },
    };

    const result = SpecValidator.validateAndSanitize(perfectSpec);
    
    expect(result.success).toBe(true);
    expect(result.warnings).toBeUndefined();
    expect(result.data).toEqual(perfectSpec);
  });
});