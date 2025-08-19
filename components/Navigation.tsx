// components/Navigation.tsx
// Navigation to connect all parts of Grid 2.0

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', description: 'Grid 2.0 Overview' },
  { href: '/editor', label: 'Editor', description: 'Realtime Claude Director' },
  { href: '/lucky', label: 'I\'m Feeling Lucky', description: 'Showcase Claude specs' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G2</span>
            </div>
            <span className="font-semibold text-gray-900">Grid 2.0</span>
            <span className="text-xs text-gray-500 hidden sm:block">
              AI Director + Deterministic Engine
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={item.description}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-3">
            <ClaudeStatus />
            <div className="text-xs text-gray-500 hidden lg:block">
              Port 7429
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex space-x-1 pb-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function ClaudeStatus() {
  const [status, setStatus] = React.useState<'checking' | 'available' | 'demo'>('checking');
  
  React.useEffect(() => {
    // Check API status
    fetch('/api/generate')
      .then(res => res.json())
      .then(data => {
        setStatus(data.version ? 'available' : 'demo');
      })
      .catch(() => setStatus('demo'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center text-xs text-gray-500">
        <div className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
        Checking...
      </div>
    );
  }

  if (status === 'available') {
    return (
      <div className="flex items-center text-xs text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
        Claude Live
      </div>
    );
  }

  return (
    <div className="flex items-center text-xs text-blue-600">
      <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
      Demo Mode
    </div>
  );
}