import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results as JSON', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    const result = spawnSync('pnpm', ['--silent', 'claim-office'], {
      input,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
    expect(result.stderr).toBe('');
  });

  it('reports invalid scenarios on stderr without writing results', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    const result = spawnSync('pnpm', ['exec', 'tsx', 'src/cli.ts'], {
      input,
      encoding: 'utf8',
    });

    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/unknown item type/i);
  });
});
