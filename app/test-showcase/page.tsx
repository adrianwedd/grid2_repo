'use client';

import React, { useState, useEffect } from 'react';
import { generatePage, demoBrand } from '@/lib/generate-page';
import { generateToneSpecificContent } from '@/lib/tone-content-generator';
import type { PageNode, Tone } from '@/types/section-system';

export default function TestShowcase() {
  const [status, setStatus] = useState('Starting...');
  const [page, setPage] = useState<PageNode | null>(null);
  
  useEffect(() => {
    async function test() {
      try {
        setStatus('Generating content...');
        const content = generateToneSpecificContent('minimal');
        
        setStatus('Building page...');
        const result = await generatePage(content, demoBrand, 'minimal', ['hero', 'features', 'cta']);
        
        setStatus('Done!');
        setPage(result.primary);
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
        console.error('Test error:', error);
      }
    }
    
    test();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Showcase</h1>
      <p className="mb-4">Status: {status}</p>
      {page && (
        <div className="border p-4">
          <p>Sections: {page.sections.length}</p>
          <p>Brand: {page.brand.fonts.heading}</p>
          <p>Audits passed: {page.audits.passed ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}