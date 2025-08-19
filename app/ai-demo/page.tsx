'use client';

import { useState } from 'react';
import { freeImageGenerator } from '@/lib/free-image-generator';
import type { Tone } from '@/types/section-system';

const TONES: Tone[] = ['minimal', 'bold', 'playful', 'corporate', 'elegant', 'modern', 'warm', 'luxury', 'creative', 'nature', 'retro', 'monochrome', 'techno', 'zen'];

export default function AIDemo() {
  const [selectedTone, setSelectedTone] = useState<Tone>('playful');
  const [imagePrompt, setImagePrompt] = useState('futuristic website hero banner');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Generate image instantly (no API needed!)
  const generateImage = () => {
    const url = freeImageGenerator.generateForToneSection(selectedTone, 'hero', imagePrompt);
    setGeneratedImage(url);
  };

  // Generate text with OpenRouter
  const generateText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hero',
          tone: selectedTone,
          context: imagePrompt
        })
      });
      const data = await response.json();
      setGeneratedText(data.data);
    } catch (error) {
      console.error('Failed to generate text:', error);
      setGeneratedText({ error: 'Failed to generate text' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">🎨 AI Content Generator Demo</h1>
        <p className="text-xl mb-8 opacity-80">Free image generation + Free text models = Unlimited creativity!</p>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">🎯 Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Select Tone:</label>
                  <select 
                    value={selectedTone} 
                    onChange={(e) => setSelectedTone(e.target.value as Tone)}
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {TONES.map(tone => (
                      <option key={tone} value={tone} className="bg-gray-800">{tone}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Image Prompt:</label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Describe what you want to see..."
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={generateImage}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
                  >
                    🖼️ Generate Image (Free!)
                  </button>
                  
                  <button
                    onClick={generateText}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50"
                  >
                    {loading ? '⏳ Generating...' : '📝 Generate Text'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Generated Text */}
            {generatedText && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">📝 Generated Content</h2>
                <div className="space-y-3">
                  {generatedText.headline && (
                    <div>
                      <span className="text-sm opacity-60">Headline:</span>
                      <p className="text-xl font-bold">{generatedText.headline}</p>
                    </div>
                  )}
                  {generatedText.subheadline && (
                    <div>
                      <span className="text-sm opacity-60">Subheadline:</span>
                      <p>{generatedText.subheadline}</p>
                    </div>
                  )}
                  {generatedText.bullets && (
                    <div>
                      <span className="text-sm opacity-60">Bullets:</span>
                      <ul className="list-disc list-inside">
                        {generatedText.bullets.map((bullet: string, i: number) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Generated Image */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">🎨 Generated Image</h2>
            {generatedImage ? (
              <div className="space-y-4">
                <img 
                  src={generatedImage} 
                  alt="Generated AI Image"
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs font-mono opacity-60 break-all">{generatedImage}</p>
                </div>
                <p className="text-sm opacity-60">
                  Powered by Pollinations.ai - Completely free, no API key required! 🎉
                </p>
              </div>
            ) : (
              <div className="h-96 bg-white/5 rounded-lg flex items-center justify-center">
                <p className="opacity-50">Click "Generate Image" to create AI art instantly!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Examples */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">⚡ Quick Examples</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'cyberpunk city at night',
              'peaceful zen garden',
              'abstract geometric patterns',
              'retro 80s synthwave sunset',
              'minimalist white architecture',
              'colorful explosion of paint',
              'futuristic holographic interface',
              'cozy autumn cabin'
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => {
                  setImagePrompt(prompt);
                  setGeneratedImage(freeImageGenerator.generateImageUrl(prompt));
                }}
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
        {/* Info */}
        <div className="mt-8 text-center opacity-60">
          <p>🚀 Text Generation: OpenRouter (Free models with :free suffix)</p>
          <p>🎨 Image Generation: Pollinations.ai (100% free, no limits!)</p>
        </div>
      </div>
    </div>
  );
}