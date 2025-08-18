// components/RealtimeEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRealtimePreview } from '@/lib/hooks/useRealtimePreview';
import { useClaudeDirector } from '@/lib/hooks/useClaudeDirector';
import type { SectionNode } from '@/types/section-system';
import { PageRenderer } from '@/components/PageRenderer';
// ThemeModal removed - using expanded StyleGallery instead

export function RealtimeEditor({ initialSections }: { initialSections: SectionNode[] }) {
  const [claudePrompt, setClaudePrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'transform' | 'generate'>('transform');
  const [imageGenerating, setImageGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [availableThemes, setAvailableThemes] = useState<any[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [themesLoading, setThemesLoading] = useState(false);
  // Theme modal state removed - using inline gallery instead
  
  const {
    input, setInput,
    sections, preview,
    intents, warnings, analysis,
    loading, error, sessionReady,
    apply, undo, redo,
  } = useRealtimePreview(initialSections);

  // Claude Director integration
  const {
    generate: generateWithClaude,
    isLoading: claudeLoading,
    error: claudeError,
    result: claudeResult,
    checkAvailability,
  } = useClaudeDirector();

  const current = preview ?? sections;

  // Load available themes on component mount
  useEffect(() => {
    loadAvailableThemes();
  }, []);

  const loadAvailableThemes = async () => {
    setThemesLoading(true);
    try {
      const response = await fetch('/api/claude-cache-list');
      if (response.ok) {
        const allSpecs = await response.json();
        // Filter for complete themes only
        const completeThemes = allSpecs.filter((spec: any) => 
          spec.spec?.brandTokens?.colors?.primary && 
          spec.spec?.brandTokens?.typography?.headingFont &&
          spec.spec?.visualStyle?.mood
        );
        setAvailableThemes(completeThemes);
        
        // Auto-apply saved theme if it exists
        const saved = localStorage.getItem('selectedTheme');
        if (saved && completeThemes.find((t: any) => t.id === saved)) {
          setCurrentTheme(saved);
          applyTheme(completeThemes.find((t: any) => t.id === saved));
        }
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
    } finally {
      setThemesLoading(false);
    }
  };

  const applyTheme = async (theme: any) => {
    if (!theme?.spec?.brandTokens) return;
    
    const { colors, typography } = theme.spec.brandTokens;
    const root = document.documentElement;
    
    // Apply CSS variables
    if (colors.primary) root.style.setProperty('--color-primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary);
    if (colors.accent) root.style.setProperty('--color-accent', colors.accent);
    if (typography.headingFont) root.style.setProperty('--font-heading', typography.headingFont);
    if (typography.bodyFont) root.style.setProperty('--font-body', typography.bodyFont);
    
    // Load Google Fonts
    const linkId = 'dynamic-fonts';
    let existingLink = document.getElementById(linkId) as HTMLLinkElement;
    if (existingLink) existingLink.remove();
    
    const fontsToLoad = [typography.headingFont, typography.bodyFont]
      .filter(Boolean)
      .map((font: string) => font?.replace(/ /g, '+'))
      .join('&family=');
    
    if (fontsToLoad) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}:wght@300;400;500;600;700;900&display=swap`;
      document.head.appendChild(link);
    }
    
    // Apply direct styles for immediate effect
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((el: any) => {
      el.style.color = colors.primary;
      el.style.fontFamily = `"${typography.headingFont}", serif`;
      el.style.transition = 'all 0.3s ease';
    });
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn: any) => {
      if (btn.classList.contains('bg-black') || btn.classList.contains('bg-blue-600')) {
        btn.style.backgroundColor = colors.primary;
        btn.style.borderColor = colors.primary;
        btn.style.transition = 'all 0.3s ease';
      }
    });
    
    // Save theme selection
    localStorage.setItem('selectedTheme', theme.id);
    setCurrentTheme(theme.id);
    
    console.log(`Applied theme: ${theme.id}`);
  };

  const handleGenerateWithClaude = async () => {
    if (!claudePrompt.trim()) return;
    
    try {
      await generateWithClaude(claudePrompt);
    } catch (err) {
      console.error('Claude generation failed:', err);
    }
  };

  const handleGenerateImages = async () => {
    setImageGenerating(true);
    try {
      // Get the full spec if we have Claude result
      const spec = claudeResult || null;
      
      const response = await fetch('/api/image-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sections: current,
          spec: spec,
          mode: 'prompts'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Generated prompts:', data);
        
        if (data.prompts) {
          // Create a formatted display of prompts for manual use
          let promptText = `🎨 IMAGE GENERATION PROMPTS\n\n`;
          promptText += `Generated ${data.total} prompts for manual ChatGPT input:\n\n`;
          
          Object.entries(data.prompts).forEach(([sectionId, { prompt, sectionKind }]: [string, any]) => {
            promptText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            promptText += `📍 SECTION: ${sectionKind.toUpperCase()} (${sectionId})\n`;
            promptText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            promptText += `${prompt}\n\n`;
          });
          
          promptText += `🔗 INSTRUCTIONS:\n`;
          promptText += `1. Open https://chatgpt.com in a new tab\n`;
          promptText += `2. Copy each prompt above and paste into ChatGPT\n`;
          promptText += `3. Download the generated images\n`;
          promptText += `4. Images will be integrated automatically in future updates\n\n`;
          promptText += `⚠️  Note: Automated generation is blocked by Cloudflare protection`;
          
          // Show in a modal-like alert for now (could be improved with proper modal)
          const userConfirmed = confirm(
            `Generated ${data.total} image prompts!\n\n` +
            `Due to Cloudflare blocking, you'll need to manually copy prompts to ChatGPT.\n\n` +
            `Click OK to see the prompts in console, or check the browser console now.`
          );
          
          console.log('\n' + promptText);
          
          if (userConfirmed) {
            // Also show a condensed version
            alert('✅ Prompts ready! Check the browser console for full details.');
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Image generation failed:', errorData);
        alert(`Image generation failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Image generation request failed. Check console for details.');
    } finally {
      setImageGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Grid 2.0 Editor</h2>
            <p className="text-xs text-gray-500 mt-1">
              {claudeResult ? '🤖 AI Generated' : '📝 Default Template'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors inline-block"
              title="Theme Gallery"
            >
              🎨
            </a>
            <button
              onClick={handleGenerateImages}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
              disabled={imageGenerating}
            >
              {imageGenerating ? '🔄 Generating...' : '🖼️ Add Images'}
            </button>
            <div className="flex rounded-lg border bg-gray-50 p-1">
              <button
              onClick={() => setActiveTab('transform')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeTab === 'transform' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transform
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeTab === 'generate' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Generate
            </button>
            </div>
          </div>
        </div>

        {activeTab === 'transform' ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✏️</span>
                <span className="text-sm font-semibold text-blue-900">Edit Mode</span>
              </div>
              <p className="text-xs text-blue-800">
                Make incremental changes to the current page. Your edits are reversible with undo/redo.
              </p>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try: "make the hero more dramatic", "add social proof", "increase contrast"'
              className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={apply}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
                disabled={loading || !input.trim() || !sessionReady}
                title={!sessionReady ? "Initializing session..." : "Apply current command"}
              >
                {!sessionReady ? 'Initializing...' : 'Apply'}
              </button>
              <button onClick={undo} className="px-3 py-2 rounded-lg border">Undo</button>
              <button onClick={redo} className="px-3 py-2 rounded-lg border">Redo</button>
              {loading && <span className="text-sm text-gray-500 ml-2">Previewing...</span>}
            </div>
          </>
        ) : (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-semibold text-amber-900">Generate Mode</span>
              </div>
              <p className="text-xs text-amber-800">
                Create an entirely new page design with AI. <strong>Warning:</strong> This will replace your current page.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm font-medium text-blue-900">Claude AI Director</div>
              </div>
              <div className="text-xs text-blue-700">
                Powered by Claude to create unique designs from your description
              </div>
            </div>
            <textarea
              value={claudePrompt}
              onChange={(e) => setClaudePrompt(e.target.value)}
              placeholder='Describe your website: "Create a modern fintech startup landing page with trust indicators and pricing"'
              className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateWithClaude}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700"
                disabled={claudeLoading || !claudePrompt.trim()}
                title="Generate with Claude Director"
              >
                {claudeLoading ? 'Generating...' : 'Generate with Claude'}
              </button>
              {claudeLoading && <span className="text-sm text-gray-500 ml-2">Claude is thinking...</span>}
            </div>
          </>
        )}

        {/* Interpretation / Claude Results */}
        {activeTab === 'transform' ? (
          <div className="rounded-lg border p-3 bg-gray-50">
            <div className="text-sm font-medium">Interpreted intents</div>
            <div className="mt-1 text-sm text-gray-700">{intents.length ? intents.join(', ') : '—'}</div>
            {!!warnings.length && (
              <div className="mt-2 text-xs text-amber-700">
                {warnings.join(' | ')}
              </div>
            )}
          </div>
        ) : null}

        {/* Analysis */}
        {analysis && (
          <div className="rounded-lg border p-3 bg-white">
            <div className="text-sm font-medium mb-1">Change summary</div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {(analysis.summary ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded border p-2">
                <div className="font-semibold">Aesthetics</div>
                <div>{Math.round((analysis.estImpact?.aesthetics ?? 0) * 100)}%</div>
              </div>
              <div className="rounded border p-2">
                <div className="font-semibold">Conversion</div>
                <div>{Math.round((analysis.estImpact?.conversion ?? 0) * 100)}%</div>
              </div>
              <div className="rounded border p-2">
                <div className="font-semibold">Performance</div>
                <div>{Math.round((analysis.estImpact?.performance ?? 0) * 100)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Selection */}
        <div className="rounded-lg border p-3 bg-white">
          <div className="text-sm font-medium mb-2">Visual Themes</div>
          {themesLoading ? (
            <div className="text-xs text-gray-500">Loading themes...</div>
          ) : availableThemes.length === 0 ? (
            <div className="text-xs text-gray-500">No complete themes available</div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme)}
                    className={`p-2 rounded border text-left transition-all hover:shadow-sm ${
                      currentTheme === theme.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-medium line-clamp-1">
                      {theme.philosophy?.split(' - ')[0] || theme.id}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div 
                        className="w-3 h-3 rounded border"
                        style={{ backgroundColor: theme.spec.brandTokens.colors.primary }}
                        title={theme.spec.brandTokens.colors.primary}
                      />
                      {theme.spec.brandTokens.colors.secondary && (
                        <div 
                          className="w-3 h-3 rounded border"
                          style={{ backgroundColor: theme.spec.brandTokens.colors.secondary }}
                          title={theme.spec.brandTokens.colors.secondary}
                        />
                      )}
                      {theme.spec.brandTokens.colors.accent && (
                        <div 
                          className="w-3 h-3 rounded border"
                          style={{ backgroundColor: theme.spec.brandTokens.colors.accent }}
                          title={theme.spec.brandTokens.colors.accent}
                        />
                      )}
                      <span className="text-xs text-gray-500 ml-1 truncate">
                        {theme.spec.brandTokens.typography.headingFont}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {currentTheme && (
                <button
                  onClick={() => {
                    document.documentElement.style.removeProperty('--color-primary');
                    document.documentElement.style.removeProperty('--color-secondary');
                    document.documentElement.style.removeProperty('--color-accent');
                    document.documentElement.style.removeProperty('--font-heading');
                    document.documentElement.style.removeProperty('--font-body');
                    localStorage.removeItem('selectedTheme');
                    setCurrentTheme(null);
                    window.location.reload();
                  }}
                  className="w-full text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                >
                  Reset to Default
                </button>
              )}
            </div>
          )}
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {claudeError && <div className="text-sm text-red-600">Claude Error: {String(claudeError)}</div>}
      </div>

      {/* Preview */}
      <div className="lg:col-span-8 rounded-xl border bg-white">
        <div className="border-b p-3 text-sm text-gray-600">
          Preview {preview ? '(uncommitted)' : '(committed)'}
        </div>
        <div className="p-6">
          <PageRenderer
            page={{
              sections: current,
              meta: { title: 'Preview', description: 'Real-time preview' },
              brand: {} as any,
              audits: { a11y: [], seo: [], performance: [], passed: true },
            }}
          />
        </div>
      </div>
    </div>
  );
}
