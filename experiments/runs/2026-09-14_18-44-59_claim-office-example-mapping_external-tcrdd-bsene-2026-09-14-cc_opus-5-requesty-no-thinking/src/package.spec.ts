import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const packageJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'),
) as { bin?: Record<string, string> };

describe('package', () => {
  it('exposes a claim-office executable pointing at the CLI entry point', () => {
    expect(packageJson.bin?.['claim-office']).toBe('./src/cli.ts');
  });
});
