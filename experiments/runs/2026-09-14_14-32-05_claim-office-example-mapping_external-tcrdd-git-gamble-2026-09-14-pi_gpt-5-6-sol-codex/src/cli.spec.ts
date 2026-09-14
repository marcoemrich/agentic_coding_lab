import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'potion' }] }],
    });
    const result = spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input, encoding: 'utf8' });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 49 }] });
  });

  it('is exposed as the claim-office executable', () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    const result = spawnSync('./claim-office', { input, encoding: 'utf8' });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [] });
  });
});
