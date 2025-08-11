'use client';

import { useEffect } from 'react';

export function TailwindProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load Tailwind CDN dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}