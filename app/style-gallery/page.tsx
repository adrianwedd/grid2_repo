import { StyleShowcaseGrid } from '@/components/StyleShowcaseGrid';

export default function StyleGalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Generated Style Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our collection of AI-generated design styles. Each style was created by different AI models
            including Mistral, DeepSeek, Qwen, and more. Click any style to see it in action.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="text-sm text-gray-500">
              <span className="font-semibold">20+</span> Unique Styles
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">8</span> AI Models
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">∞</span> Possibilities
            </div>
          </div>
        </div>
        
        <StyleShowcaseGrid />
      </div>
    </main>
  );
}