// Environment Variable Validation
// Ensures all required environment variables are set and validates optional ones

interface EnvConfig {
  required: string[];
  optional: string[];
  validation?: Record<string, (value: string) => boolean>;
}

const ENV_CONFIG: EnvConfig = {
  required: [
    // Currently no strictly required env vars
  ],
  optional: [
    'CLAUDE_COOKIES',  // Browser-based auth
    'CLAUDE_ENABLED',
    'CLAUDE_MODEL',
    'API_KEYS',        // Internal API keys for the app
    'NODE_ENV',
    'SKIP_AUTH',
    'ALLOWED_ORIGINS',
    'RATE_LIMIT_INTERVAL',
    'RATE_LIMIT_MAX_REQUESTS'
  ],
  validation: {
    NODE_ENV: (value) => ['development', 'test', 'production'].includes(value),
    CLAUDE_ENABLED: (value) => ['true', 'false'].includes(value),
    SKIP_AUTH: (value) => ['true', 'false'].includes(value)
  }
};

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  invalid: string[];
  warnings: string[];
  summary: string;
}

export function validateEnvironment(): EnvValidationResult {
  const missing: string[] = [];
  const invalid: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of ENV_CONFIG.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check optional variables and warn if missing
  const missingOptional: string[] = [];
  for (const key of ENV_CONFIG.optional) {
    if (!process.env[key]) {
      missingOptional.push(key);
    }
  }

  if (missingOptional.length > 0) {
    warnings.push(`Optional environment variables not set: ${missingOptional.join(', ')}`);
  }

  // Validate existing variables
  if (ENV_CONFIG.validation) {
    for (const [key, validator] of Object.entries(ENV_CONFIG.validation)) {
      const value = process.env[key];
      if (value && !validator(value)) {
        invalid.push(`${key}="${value}" (invalid value)`);
      }
    }
  }

  // Special checks for Claude browser auth
  if (process.env.CLAUDE_ENABLED === 'true' && !process.env.CLAUDE_COOKIES) {
    warnings.push('CLAUDE_ENABLED is true but CLAUDE_COOKIES not set - Claude features will not work');
  }

  // Check for production readiness
  if (process.env.NODE_ENV === 'production') {
    if (process.env.SKIP_AUTH === 'true') {
      warnings.push('SKIP_AUTH is true in production - this is a security risk!');
    }
    if (!process.env.CLAUDE_COOKIES) {
      warnings.push('No Claude browser cookies configured - AI features will be limited');
    }
  }

  const valid = missing.length === 0 && invalid.length === 0;
  
  let summary = valid ? '✅ Environment configuration valid' : '❌ Environment configuration has issues';
  if (missing.length > 0) {
    summary += `\n  Missing required: ${missing.join(', ')}`;
  }
  if (invalid.length > 0) {
    summary += `\n  Invalid values: ${invalid.join(', ')}`;
  }
  if (warnings.length > 0) {
    summary += `\n  ⚠️  Warnings: ${warnings.join('\n  ⚠️  ')}`;
  }

  return {
    valid,
    missing,
    invalid,
    warnings,
    summary
  };
}

// Log validation on startup (only in development)
if (process.env.NODE_ENV === 'development') {
  const result = validateEnvironment();
  if (!result.valid || result.warnings.length > 0) {
    console.log('\n🔍 Environment Variable Validation:');
    console.log(result.summary);
    console.log('');
  }
}

// Helper to safely get environment variables with fallbacks
export function getEnvVar(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback;
}

// Helper to check if a feature is enabled
export function isFeatureEnabled(feature: 'claude' | 'browser-auth'): boolean {
  switch (feature) {
    case 'claude':
      return process.env.CLAUDE_ENABLED === 'true' && !!process.env.CLAUDE_COOKIES;
    case 'browser-auth':
      return !!process.env.CLAUDE_COOKIES;
    default:
      return false;
  }
}