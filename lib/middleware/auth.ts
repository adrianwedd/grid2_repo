// lib/middleware/auth.ts
// Authentication middleware for API protection

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface AuthConfig {
  requireAuth: boolean;
  allowedOrigins?: string[];
  apiKeyHeader?: string;
}

// Simple API key validation (can be extended to JWT, OAuth, etc.)
class Authenticator {
  private validApiKeys: Set<string>;
  
  constructor() {
    // In production, these would come from a secure database
    // For now, using environment variables
    this.validApiKeys = new Set();
    
    // Load API keys from environment
    const apiKeys = process.env.API_KEYS?.split(',') || [];
    apiKeys.forEach(key => {
      if (key.trim()) {
        this.validApiKeys.add(key.trim());
      }
    });
    
    // Add a default development key if no keys configured
    if (this.validApiKeys.size === 0 && process.env.NODE_ENV === 'development') {
      this.validApiKeys.add('dev-key-please-change');
    }
  }

  validateApiKey(key: string): boolean {
    return this.validApiKeys.has(key);
  }

  generateApiKey(): string {
    return `grd2_${crypto.randomBytes(32).toString('hex')}`;
  }
}

// Singleton instance
let authenticatorInstance: Authenticator | null = null;

export function getAuthenticator(): Authenticator {
  if (!authenticatorInstance) {
    authenticatorInstance = new Authenticator();
  }
  return authenticatorInstance;
}

// Authentication middleware
export async function withAuth(
  request: NextRequest,
  config: AuthConfig = {
    requireAuth: true,
    apiKeyHeader: 'x-api-key',
  }
): Promise<NextResponse | null> {
  // Skip auth in development if configured
  if (
    process.env.NODE_ENV === 'development' && 
    process.env.SKIP_AUTH === 'true'
  ) {
    return null;
  }

  // Check CORS origin if configured
  if (config.allowedOrigins) {
    const origin = request.headers.get('origin');
    if (origin && !config.allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { 
          error: 'Forbidden',
          message: 'Origin not allowed',
        },
        { status: 403 }
      );
    }
  }

  // If auth not required, continue
  if (!config.requireAuth) {
    return null;
  }

  // Extract API key from header or query param
  const apiKey = 
    request.headers.get(config.apiKeyHeader || 'x-api-key') ||
    new URL(request.url).searchParams.get('apiKey');

  if (!apiKey) {
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        message: 'API key required',
      },
      { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'API-Key',
        },
      }
    );
  }

  // Validate API key
  const auth = getAuthenticator();
  if (!auth.validateApiKey(apiKey)) {
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        message: 'Invalid API key',
      },
      { status: 401 }
    );
  }

  // Add user context to request (can be used for logging, etc.)
  // In a real app, this would include user ID, permissions, etc.
  (request as any).user = {
    apiKey: apiKey.substring(0, 8) + '...', // Masked for logging
    authenticated: true,
  };

  return null; // Continue to handler
}

// Per-endpoint authentication configurations
export const AUTH_CONFIG = {
  // Public endpoints (no auth required)
  public: {
    requireAuth: false,
  },
  
  // Protected endpoints (auth required)
  protected: {
    requireAuth: true,
  },
  
  // Admin endpoints (strict auth + origin check)
  admin: {
    requireAuth: true,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
};

// Helper to combine rate limiting and auth
export async function withSecurityMiddleware(
  request: NextRequest,
  options: {
    rateLimit?: { interval: number; maxRequests: number };
    auth?: AuthConfig;
  } = {}
): Promise<NextResponse | null> {
  // First check authentication
  if (options.auth) {
    const authResponse = await withAuth(request, options.auth);
    if (authResponse) return authResponse;
  }

  // Then check rate limiting
  if (options.rateLimit) {
    const { withRateLimit } = await import('./rate-limiter');
    const rateLimitResponse = await withRateLimit(request, options.rateLimit);
    if (rateLimitResponse) return rateLimitResponse;
  }

  return null; // Continue to handler
}