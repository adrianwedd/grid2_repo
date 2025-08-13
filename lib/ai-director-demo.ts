// lib/ai-director-demo.ts
// Demo mode for AI Director - simulates Claude responses for testing

import type { DesignSpec } from '@/lib/ai-director';

interface DemoPattern {
  keywords: string[];
  spec: DesignSpec;
}

const DEMO_PATTERNS: DemoPattern[] = [
  {
    keywords: ['pricing', 'convert', 'urgency', 'trust'],
    spec: {
      style: {
        tone: 'corporate',
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
            headline: 'Pricing that scales with your business',
            subheadline: 'Start free, upgrade when you need more power',
            bullets: ['No credit card required', '14-day free trial', 'Cancel anytime'],
          },
        },
        {
          kind: 'features',
          variant: 'cards-3up',
          priority: 'critical',
          content: {
            headline: 'Everything you need to succeed',
            features: [
              'Enterprise-grade security',
              '99.99% uptime SLA',
              '24/7 dedicated support',
            ],
          },
        },
        {
          kind: 'testimonials',
          variant: 'grid-2x2',
          priority: 'critical',
          content: {
            headline: 'Trusted by 10,000+ companies',
          },
        },
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical',
          content: {
            headline: 'Limited time: 50% off annual plans',
            subheadline: 'Offer expires in 48 hours',
          },
        },
      ],
      content: {
        voice: 'bold',
        density: 'detailed',
      },
      layout: {
        firstImpression: 'value-first',
        flow: 'linear',
        ctaStrategy: 'multiple-soft',
      },
    },
  },
  {
    keywords: ['portfolio', 'designer', 'creative', 'showcase'],
    spec: {
      style: {
        tone: 'minimal',
        inspiration: 'apple',
        colorScheme: 'monochrome',
        spacing: 'airy',
        typography: 'elegant',
        animations: 'subtle',
      },
      sections: [
        {
          kind: 'hero',
          variant: 'split-image-left',
          priority: 'critical',
          content: {
            headline: 'Design that speaks',
            subheadline: 'Creating meaningful digital experiences',
          },
          visual: {
            imagery: 'product',
            layout: 'centered',
            emphasis: 'visual',
          },
        },
        {
          kind: 'features',
          variant: 'cards-3up',
          priority: 'important',
          content: {
            headline: 'Selected works',
            features: [
              'Brand Identity Systems',
              'Digital Product Design',
              'Motion & Interaction',
            ],
          },
        },
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical',
          content: {
            headline: "Let's create something beautiful",
          },
        },
      ],
      content: {
        voice: 'inspirational',
        density: 'minimal',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'exploratory',
        ctaStrategy: 'single-strong',
      },
    },
  },
  {
    keywords: ['developer', 'api', 'documentation', 'technical'],
    spec: {
      style: {
        tone: 'corporate',
        inspiration: 'stripe',
        colorScheme: 'dark',
        spacing: 'tight',
        typography: 'sans',
        animations: 'none',
      },
      sections: [
        {
          kind: 'hero',
          variant: 'split-image-left',
          priority: 'critical',
          content: {
            headline: 'Build with confidence',
            subheadline: 'Powerful APIs for modern applications',
            bullets: ['RESTful & GraphQL', 'Real-time webhooks', 'SDK in 10+ languages'],
          },
        },
        {
          kind: 'features',
          variant: 'cards-3up',
          priority: 'critical',
          content: {
            headline: 'Developer-first platform',
            features: [
              'Comprehensive documentation',
              'Interactive API explorer',
              'Sandbox environment',
            ],
          },
        },
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical',
          content: {
            headline: 'Start building in minutes',
            subheadline: 'npm install @company/sdk',
          },
        },
      ],
      content: {
        voice: 'technical',
        density: 'detailed',
      },
      layout: {
        firstImpression: 'value-first',
        flow: 'linear',
        ctaStrategy: 'progressive',
      },
    },
  },
  {
    keywords: ['startup', 'innovative', 'disrupt', 'future', 'ai'],
    spec: {
      style: {
        tone: 'bold',
        inspiration: 'vercel',
        colorScheme: 'dark',
        spacing: 'generous',
        typography: 'bold',
        animations: 'dramatic',
      },
      sections: [
        {
          kind: 'hero',
          variant: 'split-image-left',
          priority: 'critical',
          content: {
            headline: 'The future is here',
            subheadline: 'AI that transforms your business overnight',
          },
          visual: {
            imagery: 'abstract',
            layout: 'asymmetric',
            emphasis: 'visual',
          },
        },
        {
          kind: 'features',
          variant: 'cards-3up',
          priority: 'important',
          content: {
            headline: 'Revolutionary capabilities',
            features: [
              'Self-learning algorithms',
              'Predictive analytics',
              'Autonomous optimization',
            ],
          },
        },
        {
          kind: 'testimonials',
          variant: 'grid-2x2',
          priority: 'nice-to-have',
        },
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical',
          content: {
            headline: 'Join the revolution',
            subheadline: 'Be among the first 100 pioneers',
          },
        },
      ],
      content: {
        voice: 'bold',
        density: 'balanced',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'linear',
        ctaStrategy: 'single-strong',
      },
    },
  },
  {
    keywords: ['playful', 'fun', 'creative', 'colorful'],
    spec: {
      style: {
        tone: 'playful',
        inspiration: 'notion',
        colorScheme: 'vibrant',
        spacing: 'normal',
        typography: 'mixed',
        animations: 'playful',
      },
      sections: [
        {
          kind: 'hero',
          variant: 'split-image-left',
          priority: 'critical',
          content: {
            headline: 'Work should be fun',
            subheadline: 'Tools that spark joy and creativity',
          },
          visual: {
            imagery: 'illustration',
            layout: 'asymmetric',
            emphasis: 'balanced',
          },
        },
        {
          kind: 'features',
          variant: 'cards-3up',
          priority: 'important',
          content: {
            headline: 'Everything in one happy place',
            features: [
              'Collaborative workspace',
              'Beautiful templates',
              'Delightful animations',
            ],
          },
        },
        {
          kind: 'testimonials',
          variant: 'grid-2x2',
          priority: 'nice-to-have',
        },
        {
          kind: 'cta',
          variant: 'gradient-slab',
          priority: 'critical',
          content: {
            headline: 'Start your creative journey',
          },
        },
      ],
      content: {
        voice: 'friendly',
        density: 'balanced',
      },
      layout: {
        firstImpression: 'hero-focused',
        flow: 'exploratory',
        ctaStrategy: 'single-strong',
      },
    },
  },
];

/**
 * Simulate Claude's interpretation of natural language to design specs
 * This demonstrates the power of the architecture even without API key
 */
export function simulateClaudeDirector(prompt: string): any {
  let spec = simulateClaudeInterpretation(prompt);
  
  // Handle case where spec might be undefined
  if (!spec || !spec.style) {
    spec = generateDynamicSpec(prompt);
  }
  
  // Enhanced with Claude Director structure
  return {
    philosophy: {
      inspiration: spec.style?.inspiration ? 
        `${spec.style.inspiration.charAt(0).toUpperCase() + spec.style.inspiration.slice(1)}'s design philosophy with modern execution` :
        "Modern web design principles with user-first thinking",
      principles: [
        "Clarity over complexity",
        "User needs before business needs", 
        "Performance is a feature",
        "Accessibility is not optional"
      ],
      antipatterns: [
        "No dark patterns",
        "No unnecessary friction",
        "No overwhelming choices"
      ]
    },
    style: {
      ...spec.style,
      personality: getPersonalityFromPrompt(prompt),
      colorStrategy: {
        approach: "Strategic color use for conversion",
        primary: "#2563eb",
        semantic: {
          success: "#10b981",
          warning: "#f59e0b", 
          error: "#ef4444",
          info: "#3b82f6"
        }
      },
      typography: {
        philosophy: "Readable first, beautiful second",
        headingFont: "Inter",
        bodyFont: "Inter",
        scale: 'normal' as const,
        weights: [400, 500, 600, 700]
      },
      spacing: {
        approach: "Comfortable breathing room",
        unit: 1,
        scale: [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16]
      },
      motion: {
        philosophy: "Subtle feedback, no decoration",
        duration: 'fast' as const,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        triggers: ["hover", "focus", "page-transition"]
      }
    },
    experience: {
      firstImpression: "Professional capability without stuffiness",
      emotionalJourney: ["Curiosity", "Understanding", "Trust", "Action"],
      frictionPoints: ["Too many options", "Unclear next steps"],
      microCopy: {
        philosophy: "Helpful, not clever",
        examples: {
          "404": "Page not found. Let's get you back on track.",
          "error": "Something went wrong. We're fixing it.",
          "loading": "Just a moment..."
        }
      }
    },
    optimization: {
      primaryGoal: inferGoalFromPrompt(prompt),
      secondaryGoals: ["Brand awareness", "User engagement"],
      successMetrics: ["Conversion rate", "Time on page", "User satisfaction"],
      conversionStrategy: "Build trust through clear value demonstration"
    },
    sections: spec.sections.map((s: any) => ({
      ...s,
      purpose: getSectionPurpose(s.kind),
      variant: {
        suggestion: s.variant,
        reasoning: getSectionReasoning(s.kind, s.variant)
      },
      content: {
        ...s.content,
        headline: s.content?.headline ? {
          text: s.content.headline,
          tone: "Clear and compelling"
        } : undefined,
        subheadline: s.content?.subheadline ? {
          text: s.content.subheadline,
          tone: "Supportive clarification"
        } : undefined
      },
      visual: {
        requirements: getVisualRequirements(s.kind),
        avoid: ["Stock photos", "Generic imagery"]
      }
    }))
  };
}

function getPersonalityFromPrompt(prompt: string): string {
  if (prompt.includes('professional')) return 'Confident and trustworthy';
  if (prompt.includes('friendly')) return 'Approachable and warm';
  if (prompt.includes('modern')) return 'Forward-thinking and sleek';
  if (prompt.includes('premium')) return 'Sophisticated and refined';
  return 'Professional yet approachable';
}

function inferGoalFromPrompt(prompt: string): string {
  if (prompt.includes('convert') || prompt.includes('sales')) return 'Lead generation';
  if (prompt.includes('portfolio') || prompt.includes('showcase')) return 'Brand awareness';
  if (prompt.includes('documentation') || prompt.includes('api')) return 'User education';
  return 'User engagement';
}

function getSectionPurpose(kind: string): string {
  const purposes = {
    hero: 'Immediate value proposition and first impression',
    features: 'Demonstrate key capabilities and benefits',
    testimonials: 'Build trust through social proof',
    cta: 'Convert interest into action',
    footer: 'Provide navigation and legal compliance'
  };
  return purposes[kind as keyof typeof purposes] || 'Support user journey';
}

function getSectionReasoning(kind: string, variant: string): string {
  return `${variant} creates optimal visual hierarchy for ${kind} content while maintaining readability and conversion focus`;
}

function getVisualRequirements(kind: string): string[] {
  const requirements = {
    hero: ['High-contrast imagery', 'Clear focal point'],
    features: ['Consistent iconography', 'Scannable layout'],
    testimonials: ['Authentic photography', 'Readable quotes'],
    cta: ['Strong contrast', 'Clear button hierarchy'],
    footer: ['Organized information', 'Subtle styling']
  };
  return requirements[kind as keyof typeof requirements] || ['Clear visual hierarchy'];
}

function generateDynamicSpec(prompt: string): DesignSpec {
  const normalized = prompt.toLowerCase();
  
  // Determine tone based on keywords
  let tone: 'minimal' | 'bold' | 'playful' | 'corporate' = 'minimal';
  if (normalized.includes('bold') || normalized.includes('strong') || normalized.includes('impact')) {
    tone = 'bold';
  } else if (normalized.includes('fun') || normalized.includes('playful') || normalized.includes('creative')) {
    tone = 'playful';
  } else if (normalized.includes('business') || normalized.includes('professional') || normalized.includes('enterprise')) {
    tone = 'corporate';
  } else if (normalized.includes('minimal') || normalized.includes('clean') || normalized.includes('simple')) {
    tone = 'minimal';
  }
  
  // Determine color scheme
  let colorScheme: 'monochrome' | 'vibrant' | 'pastel' | 'dark' | 'brand-heavy' = 'brand-heavy';
  if (normalized.includes('dark') || normalized.includes('night')) {
    colorScheme = 'dark';
  } else if (normalized.includes('colorful') || normalized.includes('vibrant')) {
    colorScheme = 'vibrant';
  } else if (normalized.includes('soft') || normalized.includes('pastel')) {
    colorScheme = 'pastel';
  } else if (normalized.includes('black') || normalized.includes('white') || normalized.includes('monochrome')) {
    colorScheme = 'monochrome';
  }
  
  // Determine sections based on content
  const sections: any[] = [
    {
      kind: 'hero',
      variant: 'split-image-left',
      priority: 'critical',
      content: {
        headline: prompt.slice(0, 50),
        subheadline: 'Intelligently generated design',
      },
      visual: {
        imagery: normalized.includes('photo') ? 'people' : 
                 normalized.includes('product') ? 'product' :
                 normalized.includes('abstract') ? 'abstract' : 'none',
        layout: 'centered',
        emphasis: 'balanced',
      },
    }
  ];
  
  // Add features if mentioned
  if (normalized.includes('feature') || normalized.includes('service') || normalized.includes('product')) {
    sections.push({
      kind: 'features',
      variant: 'cards-3up',
      priority: 'important',
      content: {
        headline: 'Key Features',
        features: ['Feature One', 'Feature Two', 'Feature Three'],
      },
    });
  }
  
  // Add testimonials if trust/social proof mentioned
  if (normalized.includes('testimonial') || normalized.includes('review') || normalized.includes('trust')) {
    sections.push({
      kind: 'testimonials',
      variant: 'grid-2x2',
      priority: 'important',
      content: {
        headline: 'What People Say',
      },
    });
  }
  
  // Always add CTA
  sections.push({
    kind: 'cta',
    variant: 'gradient-slab',
    priority: 'critical',
    content: {
      headline: 'Get Started Today',
      subheadline: 'Join thousands of satisfied users',
    },
  });
  
  // Add footer
  sections.push({
    kind: 'footer',
    variant: 'mega',
    priority: 'nice-to-have',
    content: {},
  });
  
  return {
    style: {
      tone,
      inspiration: tone === 'minimal' ? 'apple' : 
                   tone === 'bold' ? 'stripe' :
                   tone === 'playful' ? 'notion' : 'vercel',
      colorScheme,
      spacing: tone === 'minimal' ? 'airy' : 'normal',
      typography: tone === 'corporate' ? 'serif' : 'sans',
      animations: tone === 'playful' ? 'playful' : 'subtle',
    },
    sections,
    content: {
      voice: tone === 'corporate' ? 'professional' : 'friendly',
      density: tone === 'minimal' ? 'minimal' : 'balanced',
    },
    layout: {
      firstImpression: 'hero-focused',
      flow: 'linear',
      ctaStrategy: 'single-strong',
    },
  };
}

export function simulateClaudeInterpretation(prompt: string): DesignSpec {
  const normalized = prompt.toLowerCase();
  
  // Find best matching pattern - be more lenient
  let bestMatch = null;
  let bestScore = 0;
  
  for (const pattern of DEMO_PATTERNS) {
    const matchCount = pattern.keywords.filter(k => normalized.includes(k)).length;
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = pattern;
    }
  }
  
  // If we found a match (even 1 keyword), use it
  if (bestMatch && bestScore > 0) {
    const spec = JSON.parse(JSON.stringify(bestMatch.spec)); // Deep clone
    
    // Customize based on prompt
    if (spec.sections[0].content) {
      spec.sections[0].content.headline = prompt.slice(0, 50);
      spec.sections[0].content.subheadline = "Intelligently generated design";
    }
    
    return spec;
  }
  
  // Otherwise analyze prompt and generate custom spec
  const spec = generateDynamicSpec(prompt);
  
  // Enhance content based on prompt
  if (spec.sections[0].content) {
    spec.sections[0].content.headline = prompt.slice(0, 50);
    spec.sections[0].content.subheadline = "Intelligently generated design"; 
  }
  
  return spec;
}
  
// Default spec - this should not be reached now
function getDefaultSpec(prompt: string = "Website"): DesignSpec {
  return {
    style: {
      tone: 'minimal',
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
          headline: prompt.slice(0, 30),
          subheadline: 'Intelligently generated design',
        },
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
}