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

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const [availableSpecs, setAvailableSpecs] = useState<CachedSpec[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<CachedSpec | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  // Load available cached specs
  useEffect(() => {
    if (isOpen) {
      async function loadSpecs() {
        try {
          const response = await fetch('/api/claude-cache-list');
          if (response.ok) {
            const specs = await response.json();
            setAvailableSpecs(specs);
            
            // Auto-apply saved theme if it exists
            const saved = localStorage.getItem('selectedTheme');
            if (saved) {
              setCurrentTheme(saved);
              const savedSpec = specs.find((s: CachedSpec) => s.id === saved);
              if (savedSpec) {
                // Load the full spec and apply it
                const response = await fetch('/api/feeling-lucky', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ specId: saved }),
                });
                
                if (response.ok) {
                  const data = await response.json();
                  const spec: CachedSpec = {
                    id: data.cached.id,
                    philosophy: data.cached.philosophy,
                    personality: data.cached.personality,
                    spec: data.spec
                  };
                  applyTheme(spec);
                }
              }
            }
          }
        } catch (error) {
          console.error('Failed to load cached specs:', error);
        }
      }
      
      loadSpecs();
    }
  }, [isOpen]);

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
        const spec: CachedSpec = {
          id: data.cached.id,
          philosophy: data.cached.philosophy,
          personality: data.cached.personality,
          spec: data.spec
        };
        setSelectedSpec(spec);
        // Apply the theme immediately for preview
        applyTheme(spec);
      }
    } catch (error) {
      console.error('Failed to load spec:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (spec: CachedSpec) => {
    console.log('Applying theme:', spec.id);
    if (!spec.spec?.brandTokens) {
      console.log('No brandTokens found in spec');
      return;
    }

    const { colors, typography } = spec.spec.brandTokens;
    const root = document.documentElement;
    
    console.log('Applying colors:', colors);
    console.log('Applying typography:', typography);
    
    // Apply CSS variables (for components that use them)
    if (colors.primary) {
      root.style.setProperty('--color-primary', colors.primary);
      console.log('Set --color-primary to', colors.primary);
    }
    if (colors.secondary) {
      root.style.setProperty('--color-secondary', colors.secondary);
      console.log('Set --color-secondary to', colors.secondary);
    }
    if (colors.accent) {
      root.style.setProperty('--color-accent', colors.accent);
      console.log('Set --color-accent to', colors.accent);
    }
    
    if (typography.headingFont) {
      root.style.setProperty('--font-heading', typography.headingFont);
      console.log('Set --font-heading to', typography.headingFont);
    }
    if (typography.bodyFont) {
      root.style.setProperty('--font-body', typography.bodyFont);
      console.log('Set --font-body to', typography.bodyFont);
    }
    
    // Load Google Fonts FIRST
    const linkId = 'dynamic-fonts';
    let existingLink = document.getElementById(linkId) as HTMLLinkElement;
    
    if (existingLink) {
      existingLink.remove();
    }
    
    const fontsToLoad = [typography.headingFont, typography.bodyFont]
      .filter(Boolean)
      .map(font => font?.replace(/ /g, '+'))
      .join('&family=');
    
    if (fontsToLoad) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}:wght@300;400;500;600;700;900&display=swap`;
      document.head.appendChild(link);
      console.log('Loading Google Fonts:', fontsToLoad);
    }
    
    // FORCE direct style application to bypass Tailwind
    // Apply to all headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((el: any) => {
      el.style.color = colors.primary;
      el.style.fontFamily = `"${typography.headingFont}", serif`;
      el.style.transition = 'all 0.3s ease';
    });
    
    // Apply to all paragraphs (but not all divs/spans to avoid breaking layout)
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((el: any) => {
      el.style.fontFamily = `"${typography.bodyFont}", sans-serif`;
      el.style.transition = 'all 0.3s ease';
    });
    
    // Apply body font to specific text elements
    const textElements = document.querySelectorAll('.text-sm, .text-xs, .text-base, .text-lg');
    textElements.forEach((el: any) => {
      el.style.fontFamily = `"${typography.bodyFont}", sans-serif`;
    });
    
    // Apply to buttons with better targeting
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn: any) => {
      // Apply to primary buttons
      if (btn.classList.contains('bg-black')) {
        btn.style.backgroundColor = colors.primary;
        btn.style.borderColor = colors.primary;
        btn.style.transition = 'all 0.3s ease';
      }
      // Apply to blue buttons
      if (btn.classList.contains('bg-blue-600') || btn.classList.contains('bg-blue-500')) {
        btn.style.backgroundColor = colors.primary;
        btn.style.borderColor = colors.primary;
      }
      // Secondary buttons
      if (btn.classList.contains('border') && !btn.classList.contains('bg-black')) {
        btn.style.borderColor = colors.primary;
        btn.style.color = colors.primary;
      }
    });
    
    // Apply backgrounds to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section: any, index: number) => {
      // Alternate background colors for visual distinction
      if (index % 2 === 0) {
        // Use neutral colors if available
        if (colors.neutral && colors.neutral[0]) {
          section.style.backgroundColor = colors.neutral[0];
        }
      } else if (colors.neutral && colors.neutral[1]) {
        section.style.backgroundColor = colors.neutral[1];
      }
    });
    
    // Apply to specific background elements
    const bgElements = document.querySelectorAll('[class*="bg-gray"], [class*="bg-white"]');
    bgElements.forEach((el: any) => {
      if (el.classList.contains('bg-gray-50') && colors.neutral && colors.neutral[0]) {
        el.style.backgroundColor = colors.neutral[0];
      }
      if (el.classList.contains('bg-gray-100') && colors.neutral && colors.neutral[1]) {
        el.style.backgroundColor = colors.neutral[1];
      }
    });
    
    // Apply accent colors to badges and highlights
    const badges = document.querySelectorAll('[class*="bg-blue-50"], [class*="bg-blue-100"]');
    badges.forEach((badge: any) => {
      if (colors.accent) {
        badge.style.backgroundColor = colors.accent + '20'; // Add transparency
        badge.style.borderColor = colors.accent;
      }
    });
    
    // Apply to links
    const links = document.querySelectorAll('a');
    links.forEach((link: any) => {
      if (!link.closest('nav')) { // Don't change nav links
        link.style.color = colors.accent || colors.primary;
        link.style.transition = 'all 0.3s ease';
      }
    });
    
    // Apply border colors
    const borders = document.querySelectorAll('[class*="border-gray"], [class*="border-blue"]');
    borders.forEach((el: any) => {
      el.style.borderColor = colors.primary + '30'; // Add transparency for borders
    });
    
    console.log('Theme applied with direct styles');
    
    // Save to localStorage
    localStorage.setItem('selectedTheme', spec.id);
    setCurrentTheme(spec.id);
    
    // Force a re-render by toggling a class
    document.body.classList.add('theme-applied');
    setTimeout(() => {
      document.body.classList.remove('theme-applied');
    }, 10);
  };

  const resetTheme = () => {
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-secondary');
    root.style.removeProperty('--color-accent');
    root.style.removeProperty('--font-heading');
    root.style.removeProperty('--font-body');
    
    // Remove direct styles
    const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, a');
    allElements.forEach((el: any) => {
      el.style.removeProperty('color');
      el.style.removeProperty('fontFamily');
      el.style.removeProperty('backgroundColor');
    });
    
    const linkId = 'dynamic-fonts';
    const existingLink = document.getElementById(linkId);
    if (existingLink) {
      existingLink.remove();
    }
    
    localStorage.removeItem('selectedTheme');
    setCurrentTheme(null);
    setSelectedSpec(null);
    
    // Force refresh
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Theme Gallery</h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose a visual style for your website. Themes only change colors and fonts.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {currentTheme && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Current theme:</span>
              <span className="text-sm font-medium">{currentTheme}</span>
              <button
                onClick={resetTheme}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Reset to Default
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSpecs.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading themes...
              </div>
            ) : (
              availableSpecs.map((spec) => (
                <div
                  key={spec.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedSpec?.id === spec.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } ${currentTheme === spec.id ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => previewTheme(spec.id)}
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {spec.philosophy ? spec.philosophy.split(' - ')[0] : spec.id}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {spec.personality || spec.philosophy}
                    </p>
                  </div>
                  
                  {/* Color preview */}
                  {spec.spec?.brandTokens?.colors && (
                    <div className="flex gap-1 mt-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: spec.spec.brandTokens.colors.primary }}
                        title="Primary"
                      />
                      {spec.spec.brandTokens.colors.secondary && (
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: spec.spec.brandTokens.colors.secondary }}
                          title="Secondary"
                        />
                      )}
                      {spec.spec.brandTokens.colors.accent && (
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: spec.spec.brandTokens.colors.accent }}
                          title="Accent"
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Font preview */}
                  {spec.spec?.brandTokens?.typography && (
                    <div className="mt-2 text-xs text-gray-500">
                      <div>Font: {spec.spec.brandTokens.typography.headingFont}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        {selectedSpec && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedSpec.philosophy?.split(' - ')[0]}</h3>
                <p className="text-sm text-gray-600">{selectedSpec.personality}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-green-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Theme Applied
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}