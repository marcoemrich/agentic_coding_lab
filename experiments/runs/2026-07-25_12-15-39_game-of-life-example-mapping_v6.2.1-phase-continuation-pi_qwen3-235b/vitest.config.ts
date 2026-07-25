import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./src/setupTest.ts'],
    globals: true,
  },
});