// lib/claude-cache.ts
// Cache and showcase Claude's actual design specifications

import fs from 'fs/promises';
import path from 'path';

interface CachedClaudeSpec {
  id: string;
  prompt: string;
  spec: any; // The full Claude response
  timestamp: string;
  philosophy: string;
  personality: string;
  tags: string[];
}

const CACHE_DIR = path.join(process.cwd(), '.claude-cache');
const CACHE_INDEX = path.join(CACHE_DIR, 'index.json');

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

/**
 * Save Claude's response to cache
 */
export async function cacheClaudeSpec(
  prompt: string, 
  spec: any
): Promise<string> {
  await ensureCacheDir();
  
  const id = generateSpecId(prompt, spec);
  const cached: CachedClaudeSpec = {
    id,
    prompt,
    spec,
    timestamp: new Date().toISOString(),
    philosophy: spec.philosophy?.inspiration || 'Unknown philosophy',
    personality: spec.style?.personality || 'Unknown personality',
    tags: extractTags(prompt, spec),
  };
  
  // Save individual spec file
  const specPath = path.join(CACHE_DIR, `${id}.json`);
  await fs.writeFile(specPath, JSON.stringify(cached, null, 2));
  
  // Update index
  await updateCacheIndex(cached);
  
  console.log(`💾 Cached Claude spec: ${id} - "${cached.philosophy}"`);
  return id;
}

/**
 * Get random spec for "I'm Feeling Lucky"
 */
export async function getRandomClaudeSpec(): Promise<CachedClaudeSpec | null> {
  try {
    const index = await getCacheIndex();
    if (index.length === 0) return null;
    
    const randomSpec = index[Math.floor(Math.random() * index.length)];
    return await getClaudeSpec(randomSpec.id);
  } catch (error) {
    console.warn('Failed to get random spec:', error);
    return null;
  }
}

/**
 * Get spec by ID
 */
export async function getClaudeSpec(id: string): Promise<CachedClaudeSpec | null> {
  try {
    const specPath = path.join(CACHE_DIR, `${id}.json`);
    const data = await fs.readFile(specPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Search specs by tags or text
 */
export async function searchClaudeSpecs(query: string): Promise<CachedClaudeSpec[]> {
  try {
    const index = await getCacheIndex();
    const queryLower = query.toLowerCase();
    
    return index
      .filter(spec => 
        spec.prompt.toLowerCase().includes(queryLower) ||
        spec.philosophy.toLowerCase().includes(queryLower) ||
        spec.personality.toLowerCase().includes(queryLower) ||
        spec.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .slice(0, 10); // Limit results
  } catch {
    return [];
  }
}

/**
 * Get all cached specs with metadata
 */
export async function getAllClaudeSpecs(): Promise<CachedClaudeSpec[]> {
  try {
    return await getCacheIndex();
  } catch {
    return [];
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalSpecs: number;
  philosophies: string[];
  personalities: string[];
  tags: string[];
  oldestSpec: string;
  newestSpec: string;
}> {
  try {
    const index = await getCacheIndex();
    
    if (index.length === 0) {
      return {
        totalSpecs: 0,
        philosophies: [],
        personalities: [],
        tags: [],
        oldestSpec: '',
        newestSpec: '',
      };
    }
    
    const sorted = index.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    
    return {
      totalSpecs: index.length,
      philosophies: [...new Set(index.map(s => s.philosophy))],
      personalities: [...new Set(index.map(s => s.personality))],
      tags: [...new Set(index.flatMap(s => s.tags))],
      oldestSpec: sorted[0].timestamp,
      newestSpec: sorted[sorted.length - 1].timestamp,
    };
  } catch {
    return {
      totalSpecs: 0,
      philosophies: [],
      personalities: [],
      tags: [],
      oldestSpec: '',
      newestSpec: '',
    };
  }
}

/**
 * Generate unique ID for spec
 */
function generateSpecId(prompt: string, spec: any): string {
  const hash = prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = Date.now().toString(36);
  const philosophy = spec.philosophy?.inspiration?.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '') || 'unknown';
  
  return `${hash}-${philosophy}-${timestamp}`.toLowerCase();
}

/**
 * Extract searchable tags from prompt and spec
 */
function extractTags(prompt: string, spec: any): string[] {
  const tags = new Set<string>();
  
  // Extract from prompt
  const promptWords = prompt.toLowerCase().match(/\w+/g) || [];
  promptWords.forEach(word => {
    if (word.length > 3 && !['this', 'that', 'with', 'like', 'make'].includes(word)) {
      tags.add(word);
    }
  });
  
  // Extract from spec
  if (spec.style?.tone) tags.add(spec.style.tone);
  if (spec.style?.personality) {
    spec.style.personality.toLowerCase().split(' ').forEach((word: string) => {
      if (word.length > 3) tags.add(word);
    });
  }
  
  // Extract design principles
  if (spec.philosophy?.principles) {
    spec.philosophy.principles.forEach((principle: string) => {
      principle.toLowerCase().split(' ').forEach(word => {
        if (word.length > 4) tags.add(word);
      });
    });
  }
  
  return Array.from(tags).slice(0, 10); // Limit tags
}

/**
 * Get cache index
 */
async function getCacheIndex(): Promise<CachedClaudeSpec[]> {
  try {
    const data = await fs.readFile(CACHE_INDEX, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Update cache index
 */
async function updateCacheIndex(newSpec: CachedClaudeSpec) {
  const index = await getCacheIndex();
  
  // Remove existing spec with same ID
  const filtered = index.filter(spec => spec.id !== newSpec.id);
  
  // Add new spec
  filtered.unshift(newSpec);
  
  // Keep only latest 100 specs
  const limited = filtered.slice(0, 100);
  
  await fs.writeFile(CACHE_INDEX, JSON.stringify(limited, null, 2));
}

/**
 * Seed cache with demo specs (for initial demo)
 */
export async function seedCacheWithDemoSpecs() {
  const demoSpecs = [
    {
      prompt: "Create a modern SaaS landing page like Linear but warmer",
      philosophy: "Linear's precision with human warmth",
      personality: "Systematically approachable",
    },
    {
      prompt: "Design a meditation app like Headspace but more premium",
      philosophy: "Headspace's accessibility with luxury spa refinement",
      personality: "Calmly sophisticated",
    },
    {
      prompt: "Build a developer tool site like Vercel but more playful",
      philosophy: "Vercel's technical excellence with creative energy",
      personality: "Expertly delightful",
    },
  ];
  
  for (const demo of demoSpecs) {
    const { simulateClaudeDirector } = await import('./ai-director-demo');
    const spec = simulateClaudeDirector(demo.prompt);
    await cacheClaudeSpec(demo.prompt, spec);
  }
}