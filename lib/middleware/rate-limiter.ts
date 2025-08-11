// lib/middleware/rate-limiter.ts
// Rate limiting middleware for API protection

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  private getKey(request: NextRequest): string {
    // Use IP address as key (with fallback to a default for local dev)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               'localhost';
    
    // Include path to allow different limits per endpoint
    const path = new URL(request.url).pathname;
    return `${ip}:${path}`;
  }

  async checkLimit(
    request: NextRequest, 
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.getKey(request);
    const now = Date.now();
    
    // Get or create rate limit entry
    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 0,
        resetTime: now + config.interval,
      };
    }

    const entry = this.store[key];
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;
    
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter();
  }
  return rateLimiterInstance;
}

// Middleware wrapper
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    interval: 60000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  }
): Promise<NextResponse | null> {
  const limiter = getRateLimiter();
  const { allowed, remaining, resetTime } = await limiter.checkLimit(request, config);

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    
    return NextResponse.json(
      { 
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter,
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          'Retry-After': retryAfter.toString(),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  return null; // Continue to handler
}

// Per-endpoint configurations
export const RATE_LIMITS = {
  // AI Director endpoints - more restrictive
  aiDirector: {
    interval: 60000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  
  // Validation endpoint
  validation: {
    interval: 60000,
    maxRequests: 20,
  },
  
  // Preview endpoint - less restrictive
  preview: {
    interval: 60000,
    maxRequests: 60,
  },
  
  // Export endpoint - very restrictive
  export: {
    interval: 300000, // 5 minutes
    maxRequests: 5, // 5 exports per 5 minutes
  },
  
  // Default for other endpoints
  default: {
    interval: 60000,
    maxRequests: 30,
  },
};