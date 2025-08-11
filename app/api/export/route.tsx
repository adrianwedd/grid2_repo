// app/api/export/route.ts
// ZIP export route with multiple format support

import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { renderPageToHTML } from '@/lib/html-renderer';
import { extractTailwindClasses, generateTailwindCSS } from '@/lib/tailwind-extractor';
import { componentRegistry } from '@/components/sections/registry';
import {
  generateStaticHTML,
  generateStaticREADME,
  generateNextJSPackageJSON,
  generateTailwindConfig,
  generateNextJSLayout,
  generateNextJSPage,
  generateGlobalsCSS,
  generateNextJSREADME,
  generateRemixREADME,
  type ExportOptions
} from '@/lib/export-templates';
import type { PageNode } from '@/types/section-system';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, format = 'static', includeSource = false } = body as {
      page: PageNode;
      format?: 'static' | 'nextjs' | 'remix';
      includeSource?: boolean;
    };

    if (!page || !page.sections || page.sections.length === 0) {
      return NextResponse.json(
        { error: 'Valid page with sections is required' },
        { status: 400 }
      );
    }

    const zip = new JSZip();
    const projectName = page.meta.title || 'Grid2-Export';

    // Generate the page HTML
    const pageHTML = renderPageToHTML(page);
    
    // Extract Tailwind classes and generate CSS
    const extractedClasses = extractTailwindClasses(pageHTML);
    const { css } = generateTailwindCSS(extractedClasses, page.brand);

    switch (format) {
      case 'static':
        await generateStaticExport(zip, pageHTML, css, page);
        break;
        
      case 'nextjs':
        await generateNextJSExport(zip, page, pageHTML, css, projectName, includeSource);
        break;
        
      case 'remix':
        await generateRemixExport(zip);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid export format. Use: static, nextjs, or remix' },
          { status: 400 }
        );
    }

    // Generate ZIP buffer with maximum compression
    const zipBuffer = await zip.generateAsync({
      type: 'arraybuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName.toLowerCase().replace(/\s+/g, '-')}-${format}.zip"`,
        'Content-Length': zipBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateStaticExport(
  zip: JSZip, 
  html: string, 
  css: string, 
  page: PageNode
): Promise<void> {
  // Main HTML file
  const staticHTML = generateStaticHTML(html, css, page.meta.title);
  zip.file('index.html', staticHTML);
  
  // README with deployment instructions
  zip.file('README.md', generateStaticREADME());
  
  // Basic package.json for easy dependency management if needed
  zip.file('package.json', JSON.stringify({
    name: page.meta.title.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: page.meta.description,
    scripts: {
      serve: 'python -m http.server 8000'
    }
  }, null, 2));
}

async function generateNextJSExport(
  zip: JSZip,
  page: PageNode,
  html: string,
  css: string,
  projectName: string,
  includeSource: boolean
): Promise<void> {
  // Root files
  zip.file('package.json', generateNextJSPackageJSON(projectName));
  zip.file('README.md', generateNextJSREADME(projectName));
  zip.file('next.config.js', `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`);
  
  zip.file('tailwind.config.js', generateTailwindConfig());
  zip.file('postcss.config.js', `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`);

  // TypeScript configuration
  zip.file('tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'es6'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      baseUrl: '.',
      paths: {
        '@/*': ['./*']
      }
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules']
  }, null, 2));

  // Next.js app directory structure
  zip.file('app/layout.tsx', generateNextJSLayout(page));
  zip.file('app/page.tsx', generateNextJSPage(page, includeSource));
  zip.file('app/globals.css', generateGlobalsCSS(css));

  // If including source code, add component files
  if (includeSource) {
    const usedComponents = new Set(
      page.sections.map(section => `${section.meta.kind}-${section.meta.variant}`)
    );

    for (const [key, entry] of Object.entries(componentRegistry)) {
      if (usedComponents.has(key)) {
        const componentName = `${entry.meta.kind.charAt(0).toUpperCase()}${entry.meta.kind.slice(1)}${
          entry.meta.variant.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('')
        }`;
        
        // Generate a basic React component (simplified)
        const componentCode = generateReactComponent(entry.meta, componentName);
        zip.file(`app/components/${componentName}.tsx`, componentCode);
      }
    }

    // Add type definitions
    zip.file('types/index.ts', `export interface SectionProps {
  id: string;
  content: Record<string, any>;
  tone?: 'minimal' | 'bold' | 'playful' | 'corporate';
  className?: string;
}

export interface Action {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
}`);
  }

  // Environment file template
  zip.file('.env.local', `# Environment variables
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000`);

  // Git ignore
  zip.file('.gitignore', `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts`);
}

async function generateRemixExport(zip: JSZip): Promise<void> {
  // Stub implementation - just a README for now
  zip.file('README.md', generateRemixREADME());
}

function generateReactComponent(meta: any, componentName: string): string {
  return `'use client';

import { type SectionProps } from '@/types';

export default function ${componentName}(props: SectionProps) {
  const { content, tone = 'minimal', className = '' } = props;
  
  return (
    <section className={\`\${className}\`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Component implementation based on ${meta.kind} ${meta.variant} */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {content.headline || 'Headline'}
          </h2>
          {content.description && (
            <p className="text-lg text-gray-600 mb-8">
              {content.description}
            </p>
          )}
        </div>
        
        {/* Tone-specific styling */}
        <div className={\`
          \${tone === 'bold' ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white' : ''}
          \${tone === 'minimal' ? 'bg-white' : ''}
          \${tone === 'playful' ? 'bg-gradient-to-br from-brand-50 to-brand-100' : ''}
          \${tone === 'corporate' ? 'bg-gray-50' : ''}
        \`}>
          {/* Add your custom implementation here */}
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              Generated by Grid 2.0 • Customize this component
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}`;
}