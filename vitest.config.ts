/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*', 'components/**/*'],
      exclude: [
        'lib/**/*.test.ts',
        'lib/**/*.spec.ts', 
        'components/**/*.test.tsx',
        'components/**/*.spec.tsx'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
});
