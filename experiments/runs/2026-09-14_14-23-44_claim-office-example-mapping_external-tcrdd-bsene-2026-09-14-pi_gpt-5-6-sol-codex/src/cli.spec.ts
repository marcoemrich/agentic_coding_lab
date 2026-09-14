import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

describe('claim-office CLI', () => {
  it('is exposed as the claim-office package executable', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { bin?: Record<string, string> };
    expect(packageJson.bin).toEqual({ 'claim-office': 'src/cli.ts' });
  });

  it('reads a scenario from stdin and writes its results as JSON', () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'potion' }] }],
    });
    const result = spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input: scenario, encoding: 'utf8' });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 49 }] });
    expect(result.stderr).toBe('');
  });
});
