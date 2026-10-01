import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const executable = fileURLToPath(new URL('../bin/claim-office', import.meta.url));

function run(input: unknown) {
  return spawnSync(executable, { input: JSON.stringify(input), encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('writes the scenario results as JSON to stdout', () => {
    const { status, stdout } = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  it('exits non-zero with an error on stderr and no results on stdout for an unknown item type', () => {
    const { status, stdout, stderr } = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe('');
  });

  it('exits non-zero for a claim with a negative damage amount', () => {
    const { status, stderr } = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
  });
});
