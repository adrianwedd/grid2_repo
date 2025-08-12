'use client';

import React, { useState, useEffect } from 'react';

interface CachedSpec {
  id: string;
  philosophy: string;
  personality: string;
  spec: {
    brandTokens: {
      colors: {
        primary: string;
        secondary?: string;
        accent?: string;
      };
      typography: {
        headingFont: string;
        bodyFont: string;
      };
    };
    visualStyle: {
      mood: string;
      tone: string;
    };
  };
}

interface ThemePreviewerProps {
  onThemeChange?: (spec: CachedSpec) => void;
}

export function ThemePreviewer({ onThemeChange }: ThemePreviewerProps) {
  const [availableSpecs, setAvailableSpecs] = useState<CachedSpec[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<CachedSpec | null>(null);
  const [loading, setLoading] = useState(false);

  // Load available cached specs
  useEffect(() => {
    async function loadSpecs() {
      try {
        const response = await fetch('/api/claude-cache-list');
        if (response.ok) {
          const specs = await response.json();
          setAvailableSpecs(specs);
        }
      } catch (error) {
        console.error('Failed to load cached specs:', error);
      }
    }
    
    loadSpecs();
  }, []);

  const previewTheme = async (specId: string) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/feeling-lucky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Reconstruct the spec format that ThemePreviewer expects
        const spec: CachedSpec = {
          id: data.cached.id,
          philosophy: data.cached.philosophy,
          personality: data.cached.personality,
          spec: data.spec // The spec is at the root level in feeling-lucky response
        };
        setSelectedSpec(spec);
        onThemeChange?.(spec);
      }
    } catch (error) {
      console.error('Failed to load spec:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (spec: CachedSpec) => {
    if (!spec.spec?.brandTokens) return;

    const { colors, typography } = spec.spec.brandTokens;
    
    // Apply CSS custom properties to root
    const root = document.documentElement;
    
    // Colors
    if (colors.primary) {
      root.style.setProperty('--color-primary', colors.primary);
    }
    if (colors.secondary) {
      root.style.setProperty('--color-secondary', colors.secondary);
    }
    if (colors.accent) {
      root.style.setProperty('--color-accent', colors.accent);
    }
    
    // Typography
    if (typography.headingFont) {
      root.style.setProperty('--font-heading', typography.headingFont);
    }
    if (typography.bodyFont) {
      root.style.setProperty('--font-body', typography.bodyFont);
    }

    // Add Google Fonts dynamically
    const linkId = 'dynamic-fonts';
    let existingLink = document.getElementById(linkId) as HTMLLinkElement;
    
    if (existingLink) {
      existingLink.remove();
    }
    
    const fontsToLoad = [typography.headingFont, typography.bodyFont]
      .filter(Boolean)
      .map(font => font?.replace(/ /g, '+'))
      .join('|');
    
    if (fontsToLoad) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  };

  const resetTheme = () => {
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-secondary');
    root.style.removeProperty('--color-accent');
    root.style.removeProperty('--font-heading');
    root.style.removeProperty('--font-body');
    
    const linkId = 'dynamic-fonts';
    const existingLink = document.getElementById(linkId);
    if (existingLink) {
      existingLink.remove();
    }
    
    setSelectedSpec(null);
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🎨</span>
          <span className="text-sm font-semibold text-purple-900">Theme Switcher</span>
        </div>
        <p className="text-xs text-purple-800">
          Change colors and fonts instantly. Works with any page content.
        </p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Available Themes</h3>
        {selectedSpec && (
          <button
            onClick={resetTheme}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Reset
          </button>
        )}
      </div>

      {selectedSpec && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="text-sm font-medium">{selectedSpec.philosophy}</div>
          <div className="text-xs text-gray-600 mt-1">{selectedSpec.personality}</div>
          <div className="flex gap-2 mt-2">
            {selectedSpec.spec?.brandTokens?.colors && [
              <div 
                key="primary"
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: selectedSpec.spec.brandTokens.colors.primary }}
                title="Primary"
              />,
              selectedSpec.spec.brandTokens.colors.secondary && (
                <div 
                  key="secondary"
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: selectedSpec.spec.brandTokens.colors.secondary }}
                  title="Secondary"
                />
              ),
              selectedSpec.spec.brandTokens.colors.accent && (
                <div 
                  key="accent"
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: selectedSpec.spec.brandTokens.colors.accent }}
                  title="Accent"
                />
              )
            ].filter(Boolean)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
        {availableSpecs.length === 0 ? (
          <div className="text-sm text-gray-500 p-2">Loading themes...</div>
        ) : (
          availableSpecs.map((spec) => (
            <button
              key={spec.id}
              onClick={() => previewTheme(spec.id)}
              onDoubleClick={() => selectedSpec && applyTheme(selectedSpec)}
              disabled={loading}
              className={`text-left p-2 rounded text-sm hover:bg-gray-100 disabled:opacity-50 ${
                selectedSpec?.id === spec.id ? 'bg-blue-50 border-blue-200 border' : 'border border-gray-200'
              }`}
            >
              {spec.philosophy ? (spec.philosophy.split(' - ')[0] || spec.philosophy.substring(0, 50)) : spec.id}
            </button>
          ))
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Click to preview • Double-click to apply theme to page
      </div>
    </div>
  );
}