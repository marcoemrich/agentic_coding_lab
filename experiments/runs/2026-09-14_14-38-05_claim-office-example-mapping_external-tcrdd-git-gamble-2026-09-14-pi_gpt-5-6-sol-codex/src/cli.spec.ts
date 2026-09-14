import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const run = (input: unknown) => spawnSync('./node_modules/.bin/tsx', ['src/cli.ts'], {
  input: JSON.stringify(input), encoding: 'utf8',
});

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and emits only JSON results', () => {
    const execution = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 5 }] });
    expect(execution.stderr).toBe('');
  });

  it('is directly executable as claim-office', () => {
    const execution = spawnSync('./src/cli.ts', [], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] }), encoding: 'utf8',
    });
    expect(execution.status).toBe(0);
    expect(execution.stdout).toBe('{"results":[]}');
  });
});
