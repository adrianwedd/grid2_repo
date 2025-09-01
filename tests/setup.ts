// tests/setup.ts
// Test setup and global mocks

import { vi, beforeEach } from 'vitest';

// Mock globalThis.performance for Node environment
if (typeof globalThis.performance === 'undefined') {
  globalThis.performance = {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
  } as any;
}

// Mock crypto.randomUUID for deterministic testing
const mockUUID = vi.fn(() => 'test-uuid-12345') as any;
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {
    randomUUID: mockUUID,
  } as any;
} else if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = mockUUID;
}

// Reset UUID counter for deterministic tests
let uuidCounter = 0;
vi.mocked(mockUUID).mockImplementation(() => `test-uuid-${++uuidCounter}`);

// Reset counter before each test
beforeEach(() => {
  uuidCounter = 0;
  vi.mocked(mockUUID).mockClear();
});

// Mock fetch for test environment
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = vi.fn() as any;
}

// Setup fetch mock implementation for manifest files
(globalThis.fetch as any) = vi.fn().mockImplementation(async (url: string | Request | URL) => {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  // Mock manifest.json files
  if (urlString.includes('manifest.json')) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        styles: [],
        generated: 'test',
        provider: 'test-provider',
        version: '1.0.0'
      }),
      text: async () => JSON.stringify({
        styles: [],
        generated: 'test',
        provider: 'test-provider',
        version: '1.0.0'
      })
    } as Response;
  }
  
  // Mock image files
  if (urlString.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
    return {
      ok: true,
      status: 200,
      blob: async () => new Blob(['mock-image-data'], { type: 'image/jpeg' }),
      arrayBuffer: async () => new ArrayBuffer(0)
    } as Response;
  }
  
  // Default mock for other URLs
  return Promise.reject(new Error(`Unmocked fetch: ${urlString}`));
});