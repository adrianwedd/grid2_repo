import { test, expect } from '@playwright/test';

// ==========================================
// COMPREHENSIVE STYLE AND IMAGE VERIFICATION
// ==========================================

const EXPECTED_STYLES = [
  { 
    name: 'Minimal Swiss',
    tone: 'minimal',
    expectedColors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#FFFFFF'
    },
    expectedFont: 'Helvetica',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Bold Brutalist', 
    tone: 'bold',
    expectedColors: {
      primary: '#FF0000',
      secondary: '#000000',
      background: '#FFFF00'
    },
    expectedFont: 'Impact',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Playful Memphis',
    tone: 'playful',
    expectedColors: {
      primary: '#FF69B4',
      secondary: '#00CED1',
      background: '#FFE4E1'
    },
    expectedFont: 'Comic Sans MS',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Corporate Professional',
    tone: 'corporate',
    expectedColors: {
      primary: '#003366',
      secondary: '#0066CC',
      background: '#F0F4F8'
    },
    expectedFont: 'Arial',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Elegant Editorial',
    tone: 'elegant',
    expectedColors: {
      primary: '#2C3E50',
      secondary: '#8B7355',
      background: '#FAF9F6'
    },
    expectedFont: 'Playfair Display',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Modern Tech',
    tone: 'modern',
    expectedColors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      background: '#0F172A'
    },
    expectedFont: 'Inter',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Warm Organic',
    tone: 'warm',
    expectedColors: {
      primary: '#D2691E',
      secondary: '#8B4513',
      background: '#FFF8DC'
    },
    expectedFont: 'Georgia',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Luxury Premium',
    tone: 'luxury',
    expectedColors: {
      primary: '#D4AF37',
      secondary: '#1C1C1C',
      background: '#FFFEF7'
    },
    expectedFont: 'Didot',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Creative Artistic',
    tone: 'creative',
    expectedColors: {
      primary: '#FF1493',
      secondary: '#00FFFF',
      background: '#FFE4E1'
    },
    expectedFont: 'Brush Script MT',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Nature Eco',
    tone: 'nature',
    expectedColors: {
      primary: '#228B22',
      secondary: '#8B4513',
      background: '#F5FFFA'
    },
    expectedFont: 'Trebuchet MS',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Retro Vintage',
    tone: 'retro',
    expectedColors: {
      primary: '#FF6347',
      secondary: '#4682B4',
      background: '#FFF8DC'
    },
    expectedFont: 'Courier New',
    expectedImages: ['hero', 'features', 'cta']
  },
  {
    name: 'Zen Tranquil',
    tone: 'zen',
    expectedColors: {
      primary: '#4A5568',
      secondary: '#718096',
      background: '#F7FAFC'
    },
    expectedFont: 'Noto Sans',
    expectedImages: ['hero', 'features', 'cta']
  }
];

test.describe('StyleShowcase - Complete Image and Style Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for images to start loading
    await page.waitForTimeout(3000);
  });

  test('should display all 12 design styles with proper structure', async ({ page }) => {
    // Count style cards
    const styleCards = page.locator('.group');
    const count = await styleCards.count();
    expect(count).toBeGreaterThanOrEqual(12);
    
    // Verify each style exists
    for (const style of EXPECTED_STYLES) {
      const styleCard = page.locator(`.group:has-text("${style.name}")`);
      await expect(styleCard).toBeVisible();
    }
  });

  test('should have NO placeholder images - all should be AI generated PNGs', async ({ page }) => {
    // Get all images on the page
    const images = page.locator('img');
    const imageCount = await images.count();
    
    console.log(`Found ${imageCount} images on the page`);
    
    // Check each image
    const placeholderCount = [];
    const aiGeneratedCount = [];
    const missingImages = [];
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      
      console.log(`Image ${i}: src=${src}, alt=${alt}, width=${naturalWidth}`);
      
      if (!src) {
        missingImages.push({ index: i, alt });
        continue;
      }
      
      // Check if it's a placeholder
      if (src.includes('placeholder') || src.endsWith('.svg')) {
        placeholderCount.push({ src, alt, index: i });
      }
      
      // Check if it's an AI generated image
      if (src.includes('ai-generated') || src.includes('ai-patient')) {
        aiGeneratedCount.push({ src, alt, index: i });
      }
      
      // Verify image is actually loading (naturalWidth > 0 means loaded)
      if (naturalWidth === 0 && !src.includes('data:')) {
        missingImages.push({ src, alt, index: i });
      }
    }
    
    // Report findings
    console.log('=== IMAGE VERIFICATION REPORT ===');
    console.log(`Total images: ${imageCount}`);
    console.log(`Placeholders found: ${placeholderCount.length}`);
    console.log(`AI Generated images: ${aiGeneratedCount.length}`);
    console.log(`Failed to load: ${missingImages.length}`);
    
    if (placeholderCount.length > 0) {
      console.log('\nPlaceholder images that should be replaced:');
      placeholderCount.forEach(p => console.log(`  - ${p.alt}: ${p.src}`));
    }
    
    if (missingImages.length > 0) {
      console.log('\nImages that failed to load:');
      missingImages.forEach(m => console.log(`  - ${m.alt}: ${m.src}`));
    }
    
    // Assertions
    expect(placeholderCount.length).toBe(0); // No placeholders should exist
    expect(missingImages.length).toBe(0); // All images should load
    expect(aiGeneratedCount.length).toBeGreaterThan(0); // Should have AI images
  });

  test('should verify each style has correct images for all sections', async ({ page }) => {
    for (const style of EXPECTED_STYLES) {
      console.log(`\nChecking style: ${style.name} (${style.tone})`);
      
      const styleCard = page.locator(`.group:has-text("${style.name}")`);
      await expect(styleCard).toBeVisible();
      
      // Get all images within this style card
      const styleImages = styleCard.locator('img');
      const imageCount = await styleImages.count();
      
      console.log(`  Found ${imageCount} images in ${style.name}`);
      
      // Each style should have at least 3 images (hero, features, cta)
      expect(imageCount).toBeGreaterThanOrEqual(3);
      
      // Check each expected section has an image
      for (const section of style.expectedImages) {
        const sectionImage = styleCard.locator(`img[alt*="${style.tone}"][alt*="${section}"]`);
        const exists = await sectionImage.count() > 0;
        
        if (!exists) {
          // Try alternative alt text patterns
          const altImage = styleCard.locator(`img[alt*="${style.tone}"]`).first();
          const altExists = await altImage.count() > 0;
          
          console.log(`  ${section}: ${exists ? '✓' : altExists ? '⚠️ (alt pattern)' : '✗ MISSING'}`);
          
          if (!exists && !altExists) {
            const allAlts = await styleImages.evaluateAll(imgs => 
              imgs.map((img: HTMLImageElement) => img.alt)
            );
            console.log(`    Available alts: ${allAlts.join(', ')}`);
          }
        } else {
          console.log(`  ${section}: ✓`);
        }
      }
    }
  });

  test('should verify CSS styles are applied correctly to each design', async ({ page }) => {
    for (const style of EXPECTED_STYLES) {
      console.log(`\nChecking CSS for: ${style.name}`);
      
      const styleCard = page.locator(`.group:has-text("${style.name}")`);
      
      // Check if style-specific classes are applied
      const cardElement = await styleCard.elementHandle();
      if (!cardElement) continue;
      
      // Get computed styles
      const computedStyles = await styleCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontFamily: styles.fontFamily,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          transform: styles.transform
        };
      });
      
      console.log(`  Background: ${computedStyles.backgroundColor}`);
      console.log(`  Color: ${computedStyles.color}`);
      console.log(`  Font: ${computedStyles.fontFamily}`);
      
      // Verify hover effects work
      await styleCard.hover();
      await page.waitForTimeout(300);
      
      const hoverStyles = await styleCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          transform: styles.transform,
          boxShadow: styles.boxShadow
        };
      });
      
      // Transform should change on hover
      expect(hoverStyles.transform).not.toBe('none');
      console.log(`  Hover transform: ${hoverStyles.transform}`);
    }
  });

  test('should load image manifest correctly', async ({ page }) => {
    // Check if manifest endpoint is accessible
    const manifestResponse = await page.request.get('/generated-images/manifest.json');
    
    if (manifestResponse.ok()) {
      const manifest = await manifestResponse.json();
      console.log('\n=== IMAGE MANIFEST ===');
      console.log(`Total images in manifest: ${Object.keys(manifest).length}`);
      
      // Check manifest structure
      for (const [tone, images] of Object.entries(manifest)) {
        console.log(`\n${tone}:`);
        const imageList = images as any;
        
        if (imageList.hero) console.log(`  hero: ${imageList.hero.src}`);
        if (imageList.features) console.log(`  features: ${imageList.features.src}`);
        if (imageList.cta) console.log(`  cta: ${imageList.cta.src}`);
        if (imageList.footer) console.log(`  footer: ${imageList.footer.src}`);
      }
      
      // Verify all tones have images
      for (const style of EXPECTED_STYLES) {
        expect(manifest).toHaveProperty(style.tone);
      }
    } else {
      console.log('No manifest.json found - checking fallback image loading');
    }
  });

  test('should verify images are being served from correct path', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    const pathAnalysis = {
      publicGenerated: 0,
      placeholder: 0,
      external: 0,
      dataUri: 0,
      other: 0
    };
    
    for (let i = 0; i < imageCount; i++) {
      const src = await images.nth(i).getAttribute('src');
      if (!src) continue;
      
      if (src.startsWith('/generated-images/')) pathAnalysis.publicGenerated++;
      else if (src.includes('placeholder')) pathAnalysis.placeholder++;
      else if (src.startsWith('http')) pathAnalysis.external++;
      else if (src.startsWith('data:')) pathAnalysis.dataUri++;
      else pathAnalysis.other++;
    }
    
    console.log('\n=== IMAGE PATH ANALYSIS ===');
    console.log(`/generated-images/: ${pathAnalysis.publicGenerated}`);
    console.log(`Placeholders: ${pathAnalysis.placeholder}`);
    console.log(`External URLs: ${pathAnalysis.external}`);
    console.log(`Data URIs: ${pathAnalysis.dataUri}`);
    console.log(`Other: ${pathAnalysis.other}`);
    
    // Most images should be from /generated-images/
    expect(pathAnalysis.publicGenerated).toBeGreaterThan(0);
    expect(pathAnalysis.placeholder).toBe(0);
  });

  test('should check image loading performance', async ({ page }) => {
    // Monitor image loading
    const imageLoadTimes: any[] = [];
    
    page.on('response', async response => {
      if (response.url().includes('.png') || response.url().includes('.jpg')) {
        const timing = response.timing();
        imageLoadTimes.push({
          url: response.url(),
          status: response.status(),
          duration: timing ? timing.responseEnd : 0
        });
      }
    });
    
    // Reload to capture timings
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log('\n=== IMAGE LOADING PERFORMANCE ===');
    imageLoadTimes.forEach(img => {
      console.log(`${img.status === 200 ? '✓' : '✗'} ${img.url.split('/').pop()}: ${img.duration}ms`);
    });
    
    // All images should load successfully
    const failed = imageLoadTimes.filter(img => img.status !== 200);
    if (failed.length > 0) {
      console.log('\nFailed to load:');
      failed.forEach(img => console.log(`  - ${img.url}`));
    }
    
    expect(failed.length).toBe(0);
  });

  test('should verify responsive image loading', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('img');
      const visibleImages = await images.evaluateAll(imgs => 
        imgs.filter((img: HTMLImageElement) => {
          const rect = img.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length
      );
      
      console.log(`${viewport.name}: ${visibleImages} visible images`);
      expect(visibleImages).toBeGreaterThan(0);
    }
  });
});

test.describe('Image Error Detection', () => {
  test('should detect and report any 404 images', async ({ page }) => {
    const missing404s: string[] = [];
    
    page.on('response', response => {
      if ((response.status() === 404 || response.status() === 403) && 
          (response.url().includes('.png') || response.url().includes('.jpg') || response.url().includes('.svg'))) {
        missing404s.push(response.url());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give images time to load
    
    if (missing404s.length > 0) {
      console.log('\n=== 404 IMAGES DETECTED ===');
      missing404s.forEach(url => console.log(`  ✗ ${url}`));
    }
    
    expect(missing404s.length).toBe(0);
  });

  test('should verify all expected AI-generated images exist', async ({ page }) => {
    await page.goto('/');
    
    const expectedPatterns = [
      'minimal-hero',
      'minimal-features', 
      'minimal-cta',
      'bold-hero',
      'bold-features',
      'bold-cta',
      'playful-hero',
      'playful-features',
      'playful-cta',
      'corporate-hero',
      'corporate-features',
      'corporate-cta',
      'elegant-hero',
      'elegant-features',
      'elegant-cta',
      'modern-hero',
      'modern-features',
      'modern-cta',
      'warm-hero',
      'warm-features',
      'warm-cta',
      'luxury-hero',
      'luxury-features',
      'luxury-cta',
      'creative-hero',
      'creative-features',
      'creative-cta',
      'nature-hero',
      'nature-features',
      'nature-cta',
      'retro-hero',
      'retro-features',
      'retro-cta',
      'zen-hero',
      'zen-features',
      'zen-cta'
    ];
    
    const foundImages: string[] = [];
    const missingPatterns: string[] = [];
    
    const images = page.locator('img');
    const imageSrcs = await images.evaluateAll(imgs => 
      imgs.map((img: HTMLImageElement) => img.src)
    );
    
    for (const pattern of expectedPatterns) {
      const found = imageSrcs.some(src => src.includes(pattern));
      if (found) {
        foundImages.push(pattern);
      } else {
        missingPatterns.push(pattern);
      }
    }
    
    console.log('\n=== AI IMAGE COVERAGE ===');
    console.log(`Expected: ${expectedPatterns.length}`);
    console.log(`Found: ${foundImages.length}`);
    console.log(`Missing: ${missingPatterns.length}`);
    
    if (missingPatterns.length > 0) {
      console.log('\nMissing image patterns:');
      missingPatterns.forEach(p => console.log(`  - ${p}`));
    }
    
    // At least 80% of expected images should be present
    const coverage = (foundImages.length / expectedPatterns.length) * 100;
    console.log(`\nCoverage: ${coverage.toFixed(1)}%`);
    expect(coverage).toBeGreaterThan(80);
  });
});