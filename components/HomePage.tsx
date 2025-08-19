'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, BeakerIcon, CpuChipIcon, SparklesIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <SparklesIcon className="w-4 h-4 mr-2" />
              AI Director meets Deterministic Engine
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Grid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">2.0</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The future of website building: <strong>AI for understanding, algorithms for execution</strong>. 
              No hallucinations in the hot path, just pure deterministic beauty.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/editor"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Launch Editor
                <ChevronRightIcon className="ml-2 w-5 h-5" />
              </Link>
              
              <Link 
                href="/style-gallery"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Explore Styles
                <SparklesIcon className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built on First Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Grid 2.0 separates concerns: LLMs parse intent, pure algorithms execute flawlessly
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Beam Search */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <CpuChipIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Beam Search Engine</h3>
              <p className="text-gray-600 mb-6">
                Deterministic section selection using beam search algorithm. Scores on content fit, 
                tone match, accessibility, and performance metrics.
              </p>
              <div className="text-sm text-blue-700 font-medium">
                Same inputs → Same outputs, always
              </div>
            </div>
            
            {/* Transform System */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <CodeBracketIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transform System</h3>
              <p className="text-gray-600 mb-6">
                Pure functions for editing section arrays. Natural language maps to transform operations 
                with full undo/redo support.
              </p>
              <div className="text-sm text-purple-700 font-medium">
                "Make it bold" → Algorithmic transforms
              </div>
            </div>
            
            {/* AI Integration */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <BeakerIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Claude Integration</h3>
              <p className="text-gray-600 mb-6">
                AI handles the creative interpretation while algorithms ensure 
                consistent, high-quality execution. Best of both worlds.
              </p>
              <div className="text-sm text-emerald-700 font-medium">
                AI understanding + Deterministic results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Architecture That Works
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Traditional website builders struggle with consistency and quality. 
                Grid 2.0 solves this with a hybrid approach that combines AI creativity 
                with algorithmic precision.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Typed Component System</h4>
                    <p className="text-gray-600">Every component has metadata: constraints, content slots, performance characteristics</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Accessibility First</h4>
                    <p className="text-gray-600">WCAG AA compliance built into scoring algorithm, not an afterthought</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mobile-First Design</h4>
                    <p className="text-gray-600">All components work perfectly on mobile, desktop is the enhancement</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-sm font-mono text-gray-500 mb-4">Data Flow</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-mono text-xs">1</div>
                  <div>
                    <div className="font-medium text-gray-900">User Chat Input</div>
                    <div className="text-gray-500">Natural language intent</div>
                  </div>
                </div>
                
                <div className="ml-4 border-l-2 border-gray-200 pl-6 py-2">
                  <div className="text-gray-400">↓ AI Interpretation</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-mono text-xs">2</div>
                  <div>
                    <div className="font-medium text-gray-900">Transform Functions</div>
                    <div className="text-gray-500">Pure algorithmic operations</div>
                  </div>
                </div>
                
                <div className="ml-4 border-l-2 border-gray-200 pl-6 py-2">
                  <div className="text-gray-400">↓ Beam Search</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-mono text-xs">3</div>
                  <div>
                    <div className="font-medium text-gray-900">Optimized Sections</div>
                    <div className="text-gray-500">Consistent, high-quality output</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Experience the next generation of website building. Where AI creativity meets algorithmic precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/editor"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Building
              <ChevronRightIcon className="ml-2 w-5 h-5" />
            </Link>
            
            <Link 
              href="/style-gallery"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl border border-blue-500 hover:bg-blue-600 transition-all duration-200"
            >
              Explore Styles
              <SparklesIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G2</span>
                </div>
                <span className="font-semibold text-white">Grid 2.0</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The deterministic AI website builder that combines Claude's understanding 
                with pure algorithmic execution for consistent, high-quality results.
              </p>
              <div className="text-sm text-gray-500">
                AI Director + Deterministic Engine = The Future
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>Beam Search Engine</li>
                <li>Transform System</li>
                <li>Claude Integration</li>
                <li>Typed Components</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/editor" className="hover:text-white transition-colors">Editor</Link></li>
                <li><Link href="/style-gallery" className="hover:text-white transition-colors">Style Gallery</Link></li>
                <li><Link href="/api/health" className="hover:text-white transition-colors">API Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© 2024 Grid 2.0. Built with deterministic precision and AI creativity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}