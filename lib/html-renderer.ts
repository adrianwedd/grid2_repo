// lib/html-renderer.ts
// Simple HTML generation without JSX for API routes

import type { PageNode } from '@/types/section-system';

export function renderPageToHTML(page: PageNode): string {
  let html = '';
  
  for (const section of page.sections) {
    // Generate simple HTML for each section based on kind and variant
    html += generateSectionHTML(section);
  }
  
  return html;
}

function generateSectionHTML(section: any): string {
  const { meta, props } = section;
  const content = props.content || {};
  
  switch (meta.kind) {
    case 'hero':
      return generateHeroHTML(content, meta.variant);
    case 'features':
      return generateFeaturesHTML(content, meta.variant);
    case 'testimonials':
      return generateTestimonialsHTML(content, meta.variant);
    case 'cta':
      return generateCTAHTML(content, meta.variant);
    case 'footer':
      return generateFooterHTML(content, meta.variant);
    default:
      return `<section class="py-16"><div class="max-w-7xl mx-auto px-4"><p>Section: ${meta.kind}</p></div></section>`;
  }
}

function generateHeroHTML(content: any, variant: string): string {
  const headline = content.headline || 'Welcome';
  const subheadline = content.subheadline || '';
  const bullets = content.bullets || [];
  
  return `
    <section class="hero-${variant} py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-gray-900">${headline}</h1>
          ${subheadline ? `<p class="text-xl text-gray-600 mb-8">${subheadline}</p>` : ''}
          ${bullets.length > 0 ? `
            <ul class="text-lg text-gray-700 space-y-2 mb-8">
              ${bullets.map((bullet: string) => `<li class="flex items-center justify-center"><span class="mr-2">✓</span>${bullet}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    </section>
  `;
}

function generateFeaturesHTML(content: any, variant: string): string {
  const headline = content.headline || 'Features';
  const subheadline = content.subheadline || '';
  const features = content.features || content.items || [];
  
  return `
    <section class="features-${variant} py-16 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4 text-gray-900">${headline}</h2>
          ${subheadline ? `<p class="text-lg text-gray-600">${subheadline}</p>` : ''}
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          ${features.map((feature: string) => `
            <div class="text-center p-6 bg-white rounded-lg shadow">
              <h3 class="font-semibold mb-2">${feature}</h3>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function generateTestimonialsHTML(content: any, variant: string): string {
  const headline = content.headline || 'What people say';
  const quotes = content.quotes || [];
  
  return `
    <section class="testimonials-${variant} py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4 text-gray-900">${headline}</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          ${quotes.map((quote: any) => `
            <div class="bg-white p-6 rounded-lg shadow">
              <p class="text-gray-600 mb-4">"${quote.text}"</p>
              <div class="font-semibold">${quote.author}</div>
              ${quote.company ? `<div class="text-sm text-gray-500">${quote.company}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function generateCTAHTML(content: any, variant: string): string {
  const headline = content.headline || 'Get started today';
  const description = content.description || '';
  const disclaimer = content.disclaimer || '';
  
  return `
    <section class="cta-${variant} py-20 px-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-4">${headline}</h2>
        ${description ? `<p class="text-xl mb-8 opacity-90">${description}</p>` : ''}
        <div class="space-x-4">
          <button class="bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Get Started
          </button>
          <button class="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-600">
            Learn More
          </button>
        </div>
        ${disclaimer ? `<p class="text-sm mt-4 opacity-75">${disclaimer}</p>` : ''}
      </div>
    </section>
  `;
}

function generateFooterHTML(content: any, variant: string): string {
  return `
    <footer class="footer-${variant} py-12 px-4 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-semibold mb-4">Company</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white">About</a></li>
              <li><a href="#" class="hover:text-white">Careers</a></li>
              <li><a href="#" class="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Product</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white">Features</a></li>
              <li><a href="#" class="hover:text-white">Pricing</a></li>
              <li><a href="#" class="hover:text-white">Documentation</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Generated by Grid 2.0. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}