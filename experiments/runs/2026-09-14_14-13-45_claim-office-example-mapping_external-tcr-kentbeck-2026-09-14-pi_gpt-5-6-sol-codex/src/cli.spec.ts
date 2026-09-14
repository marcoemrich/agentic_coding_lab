import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function invoke(input: unknown) {
  return spawnSync('./claim-office', [], {
    cwd: process.cwd(),
    input: JSON.stringify(input),
    encoding: 'utf8',
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const result = invoke({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }] }],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }] });
    expect(result.stderr).toBe('');
  });

  it('reports invalid input on stderr without writing results', () => {
    const result = invoke({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Unknown item type');
  });
});
