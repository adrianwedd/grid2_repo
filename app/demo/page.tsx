// Demo page - Static generated page example
import { generatePage, demoBrand } from '@/lib/generate-page';
import { PageRenderer } from '@/components/PageRenderer';

// Sample content for demo
const DEMO_CONTENT = {
  hero: {
    headline: 'Welcome to Grid 2.0',
    subheadline: 'Deterministic AI website builder that uses AI for understanding, algorithms for execution',
    bullets: [
      'Beam search assembler for optimal section selection',
      'Transform system for natural language editing',
      'AI-powered content generation with GPT integration'
    ]
  },
  features: {
    headline: 'Core Features',
    subheadline: 'Built for speed, precision, and reliability',
    items: [
      'Deterministic page generation',
      'Real-time preview with history',
      'Comprehensive component registry'
    ]
  },
  cta: {
    headline: 'Ready to Build?',
    description: 'Start creating your perfect website with Grid 2.0',
    primaryAction: {
      label: 'Try the Editor',
      href: '/editor'
    },
    secondaryAction: {
      label: 'View Gallery',
      href: '/'
    }
  }
};


export default async function DemoPage() {
  // Generate demo page using the beam search system
  const result = await generatePage(
    DEMO_CONTENT,
    demoBrand,
    'minimal',
    ['hero', 'features', 'cta', 'footer']
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Grid 2.0 Demo
          </h1>
          <div className="flex gap-4">
            <a
              href="/editor"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Try Editor
            </a>
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
            >
              Back to Gallery
            </a>
          </div>
        </div>
      </header>

      <main>
        <PageRenderer page={result.primary} />
      </main>

      <footer className="border-t border-gray-200 px-6 py-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>
            This demo page was generated using Grid 2.0's deterministic beam search algorithm.
          </p>
          <p className="mt-2">
            Generated in {result.renderTime}ms • {result.primary.sections.length} sections • Score: {result.primary.totalScore.toFixed(2)}
          </p>
        </div>
      </footer>
    </div>
  );
}