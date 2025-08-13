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