import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CACHE_DIR = '.claude-cache';

export async function GET() {
  try {
    const cacheDir = join(process.cwd(), CACHE_DIR);
    
    // Read all JSON files from cache directory
    const files = await readdir(cacheDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const specs = await Promise.all(
      jsonFiles.map(async (filename) => {
        try {
          const filePath = join(cacheDir, filename);
          const content = await readFile(filePath, 'utf8');
          const data = JSON.parse(content);
          
          return {
            id: data.id,
            philosophy: data.philosophy,
            personality: data.personality,
            spec: {
              brandTokens: data.spec?.brandTokens || {},
              visualStyle: data.spec?.visualStyle || {}
            },
            tags: data.tags || [],
            timestamp: data.timestamp
          };
        } catch (error) {
          console.error(`Failed to parse ${filename}:`, error);
          return null;
        }
      })
    );
    
    // Filter out null entries and sort by timestamp (newest first)
    const validSpecs = specs
      .filter(spec => spec !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json(validSpecs);
  } catch (error) {
    console.error('Failed to read cache directory:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array if cache doesn't exist
  }
}