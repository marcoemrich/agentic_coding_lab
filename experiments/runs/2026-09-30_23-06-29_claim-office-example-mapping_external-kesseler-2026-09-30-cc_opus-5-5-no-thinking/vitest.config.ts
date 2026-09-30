import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    globals: true,
    // 'default' must stay first — a custom reporter replaces the built-in one
    // instead of adding to it, and the agent needs the normal output to work.
    // tdd-reporter.mjs appends one event per invocation to tdd-events.jsonl and
    // writes nothing to stdout/stderr; see the header there for why both matter.
    reporters: ['default', './tdd-reporter.mjs'],
    coverage: {
      provider: 'v8',
      reporter: ['json-summary', 'text'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts'],
    },
  },
});
