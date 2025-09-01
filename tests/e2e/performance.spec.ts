import { test, expect } from '@playwright/test';

// ==========================================
// PERFORMANCE TESTS
// ==========================================

test.describe('Performance - Page Load Times', () => {
  test('measure home page load metrics', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Get Core Web Vitals
    const metrics = await page.evaluate((): Promise<any> => {
      return new Promise((resolve) => {
        const data: any = {
          FCP: 0,
          LCP: 0,
          CLS: 0,
          FID: 0,
          TTFB: 0
        };

        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) data.FCP = fcp.startTime;

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          data.LCP = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Time to First Byte
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (nav) {
          data.TTFB = nav.responseStart - nav.requestStart;
        }

        setTimeout(() => resolve(data), 1000);
      });
    });

    console.log('Performance Metrics:', metrics);
    
    // Assert reasonable thresholds
    expect(loadTime).toBeLessThan(3000); // Total load under 3s
    expect((metrics as any).FCP).toBeLessThan(1800); // FCP under 1.8s
    expect((metrics as any).TTFB).toBeLessThan(600); // TTFB under 600ms
  });

  test('measure editor page performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Measure interactive time
    const timeToInteractive = await page.evaluate(() => {
      return performance.timing.domInteractive - performance.timing.navigationStart;
    });

    expect(loadTime).toBeLessThan(3000);
    expect(timeToInteractive).toBeLessThan(2000);
  });

  test('measure lucky page performance', async ({ page }) => {
    const metrics = await page.goto('/lucky').then(async () => {
      return await page.evaluate(() => ({
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
      }));
    });

    expect(metrics.domContentLoaded).toBeLessThan(1500);
    expect(metrics.loadComplete).toBeLessThan(2500);
  });
});

test.describe('Performance - API Response Times', () => {
  test('measure /api/generate response time', async ({ request }) => {
    const iterations = 5;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      await request.post('/api/generate', {
        data: {
          mode: 'tone',
          tone: 'minimal'
        }
      });
      
      times.push(Date.now() - startTime);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);

    console.log(`API Performance - Avg: ${avgTime}ms, Max: ${maxTime}ms`);
    
    expect(avgTime).toBeLessThan(500);
    expect(maxTime).toBeLessThan(1000);
  });

  test('measure /api/preview response time', async ({ request }) => {
    // Init session
    const initStart = Date.now();
    const initResponse = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: [{ id: 'hero-1', kind: 'hero', variant: 'centered' }]
      }
    });
    const initTime = Date.now() - initStart;
    
    const { sessionId } = await initResponse.json();

    // Measure preview
    const previewStart = Date.now();
    await request.post('/api/preview', {
      data: {
        action: 'preview',
        sessionId: sessionId,
        input: 'make it bold'
      }
    });
    const previewTime = Date.now() - previewStart;

    expect(initTime).toBeLessThan(200);
    expect(previewTime).toBeLessThan(300);
  });
});

test.describe('Performance - Memory Usage', () => {
  test('check for memory leaks during navigation', async ({ page }) => {
    // Navigate between pages multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/editor');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/lucky');
      await page.waitForLoadState('networkidle');
    }

    // Check memory usage
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });

    if (memoryUsage) {
      const usedMB = memoryUsage.usedJSHeapSize / 1024 / 1024;
      console.log(`Memory usage: ${usedMB.toFixed(2)} MB`);
      
      // Should not exceed reasonable threshold
      expect(usedMB).toBeLessThan(100);
    }
  });

  test('check for DOM node leaks', async ({ page }) => {
    await page.goto('/editor');
    
    // Perform multiple operations
    for (let i = 0; i < 10; i++) {
      const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
      await textarea.fill(`test command ${i}`);
      
      const applyBtn = page.locator('button:has-text("Apply")');
      await applyBtn.click();
      await page.waitForTimeout(100);
    }

    // Count DOM nodes
    const nodeCount = await page.evaluate(() => {
      return document.querySelectorAll('*').length;
    });

    console.log(`DOM nodes after operations: ${nodeCount}`);
    
    // Should not have excessive DOM nodes
    expect(nodeCount).toBeLessThan(5000);
  });
});

test.describe('Performance - Rendering', () => {
  test('measure frame rate during animations', async ({ page }) => {
    await page.goto('/');
    
    // Start monitoring frames
    const fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        let lastTime = performance.now();
        const fpsValues: number[] = [];

        function measureFrame() {
          frames++;
          const currentTime = performance.now();
          
          if (currentTime >= lastTime + 1000) {
            fpsValues.push(frames);
            frames = 0;
            lastTime = currentTime;
            
            if (fpsValues.length >= 3) {
              resolve(fpsValues);
              return;
            }
          }
          
          requestAnimationFrame(measureFrame);
        }
        
        requestAnimationFrame(measureFrame);
      });
    });

    const avgFps = (fps as number[]).reduce((a, b) => a + b, 0) / (fps as number[]).length;
    console.log(`Average FPS: ${avgFps}`);
    
    // Should maintain smooth 60 FPS
    expect(avgFps).toBeGreaterThan(30);
  });

  test('measure paint and layout times', async ({ page }) => {
    await page.goto('/editor');
    
    // Trigger repaints
    await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        (el as HTMLElement).style.opacity = '0.99';
      });
    });

    const paintMetrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('measure');
      return entries.filter(entry => 
        entry.name.includes('paint') || entry.name.includes('layout')
      );
    });

    console.log('Paint metrics:', paintMetrics);
  });
});

test.describe('Performance - Bundle Size', () => {
  test('measure JavaScript bundle sizes', async ({ page }) => {
    const coverage = await page.coverage.startJSCoverage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const jsCoverage = await page.coverage.stopJSCoverage();
    
    let totalBytes = 0;
    let usedBytes = 0;
    
    for (const entry of jsCoverage) {
      if ('text' in entry && entry.text) {
        totalBytes += entry.text.length;
      } else if ('source' in entry && entry.source) {
        totalBytes += entry.source.length;
      }
      
      const ranges = 'ranges' in entry ? entry.ranges : 
                     'functions' in entry ? entry.functions.flatMap(f => f.ranges) : [];
      
      for (const range of ranges) {
        usedBytes += range.endOffset - range.startOffset;
      }
    }

    const unusedPercentage = ((totalBytes - usedBytes) / totalBytes) * 100;
    console.log(`JS Bundle - Total: ${(totalBytes / 1024).toFixed(2)}KB, Unused: ${unusedPercentage.toFixed(2)}%`);
    
    // Bundle should be reasonably sized
    expect(totalBytes).toBeLessThan(2 * 1024 * 1024); // Under 2MB
    expect(unusedPercentage).toBeLessThan(60); // Less than 60% unused
  });

  test('measure CSS bundle sizes', async ({ page }) => {
    const coverage = await page.coverage.startCSSCoverage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const cssCoverage = await page.coverage.stopCSSCoverage();
    
    let totalBytes = 0;
    let usedBytes = 0;
    
    for (const entry of cssCoverage) {
      if (entry.text) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges) {
          usedBytes += range.end - range.start;
        }
      }
    }

    const unusedPercentage = ((totalBytes - usedBytes) / totalBytes) * 100;
    console.log(`CSS Bundle - Total: ${(totalBytes / 1024).toFixed(2)}KB, Unused: ${unusedPercentage.toFixed(2)}%`);
    
    expect(totalBytes).toBeLessThan(500 * 1024); // Under 500KB
  });
});

test.describe('Performance - Network', () => {
  test('measure total network requests', async ({ page }) => {
    const requests: any[] = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const stats = {
      total: requests.length,
      images: requests.filter(r => r.resourceType === 'image').length,
      scripts: requests.filter(r => r.resourceType === 'script').length,
      stylesheets: requests.filter(r => r.resourceType === 'stylesheet').length,
      xhr: requests.filter(r => r.resourceType === 'xhr' || r.resourceType === 'fetch').length
    };

    console.log('Network stats:', stats);
    
    // Should have reasonable number of requests
    expect(stats.total).toBeLessThan(100);
    expect(stats.xhr).toBeLessThan(10);
  });

  test('measure network payload size', async ({ page }) => {
    let totalSize = 0;
    
    page.on('response', response => {
      const headers = response.headers();
      const contentLength = headers['content-length'];
      if (contentLength) {
        totalSize += parseInt(contentLength);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const totalMB = totalSize / 1024 / 1024;
    console.log(`Total network payload: ${totalMB.toFixed(2)} MB`);
    
    // Should be under reasonable threshold
    expect(totalMB).toBeLessThan(5);
  });
});

test.describe('Performance - Stress Testing', () => {
  test('rapid navigation stress test', async ({ page }) => {
    const startTime = Date.now();
    const iterations = 20;
    
    for (let i = 0; i < iterations; i++) {
      await page.goto('/');
      await page.goto('/editor');
      await page.goto('/lucky');
    }

    const totalTime = Date.now() - startTime;
    const avgTime = totalTime / (iterations * 3);
    
    console.log(`Rapid navigation - Avg time: ${avgTime}ms`);
    expect(avgTime).toBeLessThan(500);
  });

  test('rapid transform application', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    const applyBtn = page.locator('button:has-text("Apply")');
    
    const startTime = Date.now();
    
    for (let i = 0; i < 20; i++) {
      await textarea.fill(`test command ${i}`);
      await applyBtn.click();
    }

    const totalTime = Date.now() - startTime;
    console.log(`20 transforms in ${totalTime}ms`);
    
    expect(totalTime).toBeLessThan(10000); // Under 10 seconds for 20 transforms
  });

  test('concurrent API load test', async ({ request }) => {
    const concurrentRequests = 10;
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        request.post('/api/generate', {
          data: {
            mode: 'random'
          }
        })
      );
    }

    const responses = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    console.log(`${concurrentRequests} concurrent requests in ${totalTime}ms`);
    
    // All should succeed
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });
    
    // Should handle concurrent load
    expect(totalTime).toBeLessThan(5000);
  });
});

test.describe('Performance - Resource Optimization', () => {
  test('check image optimization', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        loading: img.loading,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight
      }));
    });

    images.forEach(img => {
      // Check for lazy loading
      if (img.src.includes('placeholder')) {
        expect(img.loading).toBe('lazy');
      }
      
      // Check for reasonable dimensions
      if (img.naturalWidth > 0) {
        const ratio = img.naturalWidth / img.displayWidth;
        expect(ratio).toBeLessThan(3); // Not serving images > 3x display size
      }
    });
  });

  test('check font loading optimization', async ({ page }) => {
    const fontLoadTime = await page.goto('/').then(async () => {
      return await page.evaluate(() => {
        return new Promise((resolve) => {
          if (document.fonts && document.fonts.ready) {
            const startTime = performance.now();
            document.fonts.ready.then(() => {
              resolve(performance.now() - startTime);
            });
          } else {
            resolve(0);
          }
        });
      });
    });

    console.log(`Font load time: ${fontLoadTime}ms`);
    expect(fontLoadTime).toBeLessThan(1000);
  });
});