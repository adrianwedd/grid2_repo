// components/PageRenderer.tsx
// React component for rendering a PageNode as HTML

import React from 'react';
import { componentRegistry } from '@/components/sections/registry';
import type { PageNode } from '@/types/section-system';

/**
 * Render a PageNode as React components
 */
export function PageRenderer({ page }: { page: PageNode }) {
  return (
    <>
      {page.sections.map((section) => {
        const registryKey = `${section.meta.kind}-${section.meta.variant}`;
        const entry = componentRegistry[registryKey as keyof typeof componentRegistry];
        
        if (!entry) {
          console.warn(`Component not found: ${registryKey}`);
          return null;
        }

        const Component = entry.component as any;
        
        return <Component key={section.id} {...section.props} />;
      })}
    </>
  );
}