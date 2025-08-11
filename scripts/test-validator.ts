// Quick test script for validator
import { SpecValidator } from '../lib/validation/spec-validator';

const spec = {
  style: {
    tone: 'minimal',
    colorScheme: 'dark',
    spacing: 'tight',
    typography: 'sans',
    animations: 'dramatic',
  },
  sections: [
    {
      kind: 'features',
      variant: 'cards-3up',
      priority: 'critical',
    },
  ],
  content: {
    voice: 'playful',
    density: 'minimal',
  },
  layout: {
    firstImpression: 'value-first',
    flow: 'linear',
    ctaStrategy: 'single-strong',
  },
};

const result = SpecValidator.validateAndSanitize(spec);
console.log('Result:', JSON.stringify(result, null, 2));