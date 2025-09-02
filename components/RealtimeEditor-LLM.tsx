// components/RealtimeEditor-LLM.tsx
'use client';

import React, { useState } from 'react';
import { useRealtimePreview } from '@/lib/hooks/useRealtimePreview';
import { useLLM } from '@/lib/hooks/useLLM';
import type { SectionNode } from '@/types/section-system';
import { PageRenderer } from '@/components/PageRenderer';
import { demoBrand } from '@/lib/generate-page';

export function RealtimeEditorLLM({ initialSections }: { initialSections: SectionNode[] }) {
  const [activeTab, setActiveTab] = useState<'edit' | 'generate'>('edit');
  const [userInput, setUserInput] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
  const {
    input, setInput,
    sections, preview,
    loading, error, sessionReady,
    apply, undo, redo,
  } = useRealtimePreview(initialSections);

  const {
    generateContent,
    transformCommand,
    isLoading: llmLoading,
    error: llmError,
    result: llmResult
  } = useLLM();

  const current = preview ?? sections;

  // Handle transform command with LLM
  const handleTransform = async () => {
    if (!userInput.trim()) return;

    // First, try to get a transformation command from LLM
    const result = await transformCommand(userInput, current);
    
    if (result.command && !result.error) {
      // Use the LLM-suggested command
      setInput(result.command);
    } else {
      // Fallback to direct input
      setInput(userInput);
    }
  };

  // Handle content generation with LLM
  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    const context = {
      currentSections: current.length,
      sectionTypes: current.map(s => s.meta.kind).join(', ')
    };

    const prompt = `
User Request: ${userInput}

Current page has ${context.currentSections} sections: ${context.sectionTypes}

Please provide specific suggestions for:
1. What sections to add/remove/modify
2. Content recommendations
3. Visual style suggestions
4. User experience improvements

Be specific and actionable.`;

    setGeneratedPrompt(prompt);
    setShowPrompt(true);
  };

  const sendToLLM = async () => {
    const result = await generateContent(generatedPrompt || userInput, {
      sections: current
    });

    if (result.content && !result.error) {
      // Show the LLM response in a modal or apply suggestions
      console.log('LLM Response:', result.content);
      // TODO: Parse and apply suggestions
    }
    
    setShowPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Grid 2.0 Editor</h1>
              <p className="text-sm text-gray-600">
                {sessionReady ? (
                  <span className="text-green-600">✅ Ready</span>
                ) : (
                  <span className="text-yellow-600">⏳ Initializing...</span>
                )}
                {llmError && (
                  <span className="text-orange-500 ml-2">
                    ⚠️ LLM: {llmError}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={undo}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                ↶ Undo
              </button>
              <button
                onClick={redo}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                ↷ Redo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Mode Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'generate'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✨ Generate
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {activeTab === 'edit' ? 'Transform Page' : 'Generate Content'}
              </h3>
              
              <textarea
                value={activeTab === 'edit' ? input : userInput}
                onChange={(e) => activeTab === 'edit' ? setInput(e.target.value) : setUserInput(e.target.value)}
                placeholder={
                  activeTab === 'edit'
                    ? 'e.g., "make it more professional", "add testimonials", "change to dark mode"'
                    : 'e.g., "SaaS landing page with pricing", "Portfolio for photographer"'
                }
                className="w-full h-24 rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-3 space-y-2">
                {activeTab === 'edit' ? (
                  <>
                    <button
                      onClick={handleTransform}
                      disabled={loading || llmLoading || !input.trim()}
                      className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 text-sm"
                    >
                      {llmLoading ? 'Processing...' : 'Transform with AI'}
                    </button>
                    <button
                      onClick={apply}
                      disabled={loading || !preview}
                      className="w-full px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 text-sm"
                    >
                      Apply Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={llmLoading || !userInput.trim()}
                    className="w-full px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 text-sm"
                  >
                    {llmLoading ? 'Generating...' : 'Generate with AI'}
                  </button>
                )}
              </div>
            </div>

            {/* Prompt Preview */}
            {showPrompt && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">AI Prompt</h3>
                  <button
                    onClick={() => setShowPrompt(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {generatedPrompt}
                  </pre>
                </div>
                <button
                  onClick={sendToLLM}
                  disabled={llmLoading}
                  className="w-full px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 text-sm"
                >
                  {llmLoading ? 'Sending...' : 'Send to AI'}
                </button>
              </div>
            )}

            {/* LLM Result */}
            {llmResult && llmResult.content && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">AI Suggestions</h3>
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">
                    {llmResult.content}
                  </p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">{current.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Changes:</span>
                  <span className="font-medium">{preview ? 'Pending' : 'None'}</span>
                </div>
                {error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b px-4 py-2 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-700">
                  {preview ? '👁 Preview (not saved)' : '📄 Current Page'}
                </h2>
              </div>
              <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
                <PageRenderer 
                  page={{ 
                    sections: current,
                    meta: {
                      title: 'Preview',
                      description: 'Page preview'
                    },
                    brand: demoBrand,
                    audits: {
                      a11y: [],
                      seo: [],
                      performance: [],
                      passed: true
                    }
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