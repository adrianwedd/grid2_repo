// components/RealtimeEditor-Fixed.tsx
'use client';

import React, { useState } from 'react';
import { useRealtimePreview } from '@/lib/hooks/useRealtimePreview';
import { useClaudeDirector } from '@/lib/hooks/useClaudeDirector';
import type { SectionNode } from '@/types/section-system';
import { PageRenderer } from '@/components/PageRenderer';

interface LLMProvider {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

const LLM_PROVIDERS: LLMProvider[] = [
  { id: 'claude', name: 'Claude', icon: '🤖', available: true },
  { id: 'openai', name: 'ChatGPT', icon: '🧠', available: false },
  { id: 'openrouter', name: 'OpenRouter', icon: '🌐', available: true },
];

export function RealtimeEditor({ initialSections }: { initialSections: SectionNode[] }) {
  const [activeTab, setActiveTab] = useState<'edit' | 'generate'>('edit');
  const [selectedProvider, setSelectedProvider] = useState<string>('claude');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  
  const {
    input, setInput,
    sections, preview,
    loading, error, sessionReady,
    apply, undo, redo,
  } = useRealtimePreview(initialSections);

  const {
    generate: generateWithClaude,
    isLoading: claudeLoading,
    error: claudeError,
    result: claudeResult,
  } = useClaudeDirector();

  const current = preview ?? sections;

  // Generate a draft prompt based on user input
  const generatePrompt = () => {
    const basePrompt = input.trim();
    if (!basePrompt) return;

    // Create a structured prompt for the LLM
    const structuredPrompt = `
Task: ${basePrompt}

Current page context:
- ${current.length} sections
- Tone: ${current[0]?.meta?.tone || 'minimal'}
- Sections: ${current.map(s => s.meta.kind).join(', ')}

Please provide specific design recommendations for:
1. Visual style and aesthetics
2. Content structure and hierarchy
3. User experience improvements
4. Conversion optimization

Be specific and actionable in your suggestions.`;

    setGeneratedPrompt(structuredPrompt);
    setShowPromptPreview(true);
  };

  // Send prompt to selected LLM
  const sendToLLM = async () => {
    const promptToSend = generatedPrompt || userPrompt;
    if (!promptToSend.trim()) return;

    if (selectedProvider === 'claude') {
      await generateWithClaude(promptToSend);
    } else if (selectedProvider === 'openrouter') {
      // TODO: Implement OpenRouter integration
      console.log('Sending to OpenRouter:', promptToSend);
    } else {
      console.log('Provider not yet implemented:', selectedProvider);
    }
    
    setShowPromptPreview(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Grid 2.0 Editor</h1>
              <p className="text-sm text-gray-600">
                {sessionReady ? '✅ Ready' : '⏳ Initializing...'}
              </p>
            </div>
            
            {/* LLM Provider Selection */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">AI Provider:</span>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                {LLM_PROVIDERS.map(provider => (
                  <option 
                    key={provider.id} 
                    value={provider.id}
                    disabled={!provider.available}
                  >
                    {provider.icon} {provider.name} {!provider.available && '(Coming Soon)'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tab Switcher */}
            <div className="bg-white rounded-lg shadow-sm p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ✏️ Edit Mode
                </button>
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'generate'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ✨ Generate
                </button>
              </div>
            </div>

            {/* Main Editor */}
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
              {activeTab === 'edit' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What changes would you like to make?
                    </label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='e.g., "Make the hero section more dramatic" or "Add customer testimonials"'
                      className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={generatePrompt}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={!input.trim()}
                    >
                      📝 Generate Prompt
                    </button>
                    <button
                      onClick={apply}
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                      disabled={loading || !input.trim() || !sessionReady}
                    >
                      {loading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={undo} 
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      ↶ Undo
                    </button>
                    <button 
                      onClick={redo} 
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      ↷ Redo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Generate Mode:</strong> Create an entirely new design from scratch.
                      This will replace your current page.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your ideal website
                    </label>
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder='e.g., "Modern SaaS landing page with pricing table and testimonials"'
                      className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setGeneratedPrompt(userPrompt);
                      setShowPromptPreview(true);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                    disabled={claudeLoading || !userPrompt.trim()}
                  >
                    {claudeLoading ? 'Generating...' : `Generate with ${LLM_PROVIDERS.find(p => p.id === selectedProvider)?.name}`}
                  </button>
                </>
              )}

              {/* Prompt Preview Modal */}
              {showPromptPreview && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Prompt Preview</h3>
                    <button
                      onClick={() => setShowPromptPreview(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                      {generatedPrompt}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setGeneratedPrompt('');
                        setShowPromptPreview(false);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendToLLM}
                      className="flex-1 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                    >
                      Send to {LLM_PROVIDERS.find(p => p.id === selectedProvider)?.name}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {(error || claudeError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">
                    {error || claudeError}
                  </p>
                </div>
              )}
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Page Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">{current.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Tone:</span>
                  <span className="font-medium">{current[0]?.meta?.tone || 'minimal'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session:</span>
                  <span className="font-medium">{sessionReady ? 'Active' : 'Initializing'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b px-4 py-3">
                <h2 className="text-lg font-semibold">
                  {preview ? 'Preview (uncommitted)' : 'Current Page'}
                </h2>
              </div>
              <div className="h-[800px] overflow-y-auto">
                <PageRenderer 
                  page={{ 
                    id: 'preview', 
                    sections: current,
                    audit: { score: 100, issues: [] }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}