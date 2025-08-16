// app/api/health/route.ts
// Production health check endpoint

import { NextResponse } from 'next/server';
import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { getSessionStorage } from '@/lib/session-storage';
import { componentRegistry } from '@/components/sections/registry';
import { validateEnvironment } from '@/lib/env-validation';

export const dynamic = 'force-dynamic';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      duration?: number;
      message?: string;
      details?: any;
    };
  };
  summary: {
    total: number;
    passed: number;
    failed: number;
    warned: number;
  };
}

export async function GET() {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();
  
  const health: HealthCheck = {
    status: 'healthy',
    timestamp,
    version: process.env.npm_package_version || '1.0.0',
    checks: {},
    summary: { total: 0, passed: 0, failed: 0, warned: 0 }
  };

  // Check 1: Component Registry
  try {
    const registryStart = performance.now();
    const registryKeys = Object.keys(componentRegistry);
    const registryDuration = performance.now() - registryStart;
    
    if (registryKeys.length === 0) {
      health.checks.componentRegistry = {
        status: 'fail',
        duration: registryDuration,
        message: 'No components registered'
      };
    } else if (registryKeys.length < 5) {
      health.checks.componentRegistry = {
        status: 'warn', 
        duration: registryDuration,
        message: `Only ${registryKeys.length} components registered - low coverage`,
        details: { count: registryKeys.length, components: registryKeys }
      };
    } else {
      health.checks.componentRegistry = {
        status: 'pass',
        duration: registryDuration,
        message: `${registryKeys.length} components registered`,
        details: { count: registryKeys.length }
      };
    }
  } catch (error: any) {
    health.checks.componentRegistry = {
      status: 'fail',
      message: `Component registry error: ${error.message}`
    };
  }

  // Check 2: Beam Search Algorithm
  try {
    const beamStart = performance.now();
    const result = await generatePage(
      demoContent,
      demoBrand, 
      'minimal',
      ['hero', 'features', 'cta']
    );
    const beamDuration = performance.now() - beamStart;
    
    if (!result.primary || result.primary.sections.length === 0) {
      health.checks.beamSearch = {
        status: 'fail',
        duration: beamDuration,
        message: 'Beam search returned no sections'
      };
    } else if (beamDuration > 100) {
      health.checks.beamSearch = {
        status: 'warn',
        duration: beamDuration,
        message: `Beam search slow: ${beamDuration.toFixed(2)}ms`,
        details: { 
          sectionsGenerated: result.primary.sections.length,
          renderTime: result.renderTime 
        }
      };
    } else {
      health.checks.beamSearch = {
        status: 'pass',
        duration: beamDuration,
        message: `Generated ${result.primary.sections.length} sections in ${beamDuration.toFixed(2)}ms`,
        details: { 
          sectionsGenerated: result.primary.sections.length,
          renderTime: result.renderTime 
        }
      };
    }
  } catch (error: any) {
    health.checks.beamSearch = {
      status: 'fail',
      message: `Beam search error: ${error.message}`
    };
  }

  // Check 3: Session Storage
  try {
    const storageStart = performance.now();
    const storage = getSessionStorage();
    
    // Test write/read cycle
    const testKey = `health-check-${Date.now()}`;
    const testData = { 
      id: testKey,
      history: { past: [], present: [], future: [] },
      updatedAt: Date.now(),
      createdAt: Date.now()
    };
    
    await storage.set(testKey, testData);
    const retrieved = await storage.get(testKey);
    await storage.delete(testKey);
    
    const storageDuration = performance.now() - storageStart;
    
    if (!retrieved || retrieved.id !== testKey) {
      health.checks.sessionStorage = {
        status: 'fail',
        duration: storageDuration,
        message: 'Session storage read/write test failed'
      };
    } else if (storageDuration > 50) {
      health.checks.sessionStorage = {
        status: 'warn',
        duration: storageDuration,
        message: `Session storage slow: ${storageDuration.toFixed(2)}ms`
      };
    } else {
      health.checks.sessionStorage = {
        status: 'pass',
        duration: storageDuration,
        message: `Session storage working (${storageDuration.toFixed(2)}ms)`
      };
    }
  } catch (error: any) {
    health.checks.sessionStorage = {
      status: 'fail',
      message: `Session storage error: ${error.message}`
    };
  }

  // Check 4: Environment Configuration
  try {
    const envStart = performance.now();
    const envValidation = validateEnvironment();
    const envDuration = performance.now() - envStart;
    
    if (!envValidation.valid) {
      health.checks.environment = {
        status: 'fail',
        duration: envDuration,
        message: `Environment validation failed`,
        details: {
          missing: envValidation.missing,
          invalid: envValidation.invalid,
          warnings: envValidation.warnings
        }
      };
    } else if (envValidation.warnings.length > 0) {
      health.checks.environment = {
        status: 'warn',
        duration: envDuration,
        message: `Environment configured with warnings`,
        details: {
          nodeEnv: process.env.NODE_ENV,
          warnings: envValidation.warnings
        }
      };
    } else {
      health.checks.environment = {
        status: 'pass',
        duration: envDuration,
        message: `Environment properly configured`,
        details: {
          nodeEnv: process.env.NODE_ENV
        }
      };
    }
  } catch (error: any) {
    health.checks.environment = {
      status: 'fail',
      message: `Environment check error: ${error.message}`
    };
  }

  // Check 5: Memory Usage
  try {
    const memoryStart = performance.now();
    const memUsage = process.memoryUsage();
    const memoryDuration = performance.now() - memoryStart;
    
    // Convert bytes to MB
    const heapUsed = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotal = Math.round(memUsage.heapTotal / 1024 / 1024); 
    const rss = Math.round(memUsage.rss / 1024 / 1024);
    
    // Warn if heap usage is over 500MB or RSS over 1GB
    if (heapUsed > 500 || rss > 1024) {
      health.checks.memory = {
        status: 'warn',
        duration: memoryDuration,
        message: `High memory usage: ${heapUsed}MB heap, ${rss}MB RSS`,
        details: { heapUsed, heapTotal, rss }
      };
    } else {
      health.checks.memory = {
        status: 'pass',
        duration: memoryDuration,
        message: `Memory usage normal: ${heapUsed}MB heap, ${rss}MB RSS`,
        details: { heapUsed, heapTotal, rss }
      };
    }
  } catch (error: any) {
    health.checks.memory = {
      status: 'fail',
      message: `Memory check error: ${error.message}`
    };
  }

  // Calculate summary
  const checkEntries = Object.entries(health.checks);
  health.summary.total = checkEntries.length;
  
  for (const [, check] of checkEntries) {
    switch (check.status) {
      case 'pass':
        health.summary.passed++;
        break;
      case 'fail':
        health.summary.failed++;
        break;
      case 'warn':
        health.summary.warned++;
        break;
    }
  }

  // Determine overall status
  if (health.summary.failed > 0) {
    health.status = 'unhealthy';
  } else if (health.summary.warned > 0) {
    health.status = 'degraded';  
  } else {
    health.status = 'healthy';
  }

  // Add total duration
  const totalDuration = performance.now() - startTime;
  (health as any).totalDuration = `${totalDuration.toFixed(2)}ms`;

  // Return appropriate HTTP status
  const httpStatus = health.status === 'healthy' ? 200 
                   : health.status === 'degraded' ? 200
                   : 503; // Service Unavailable for unhealthy

  return NextResponse.json(health, { 
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json'
    }
  });
}