import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['**/*.spec.ts', 'node_modules/', 'dist/']
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  }
});
