import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const execute = (input: unknown) => spawnSync(process.execPath, ['--import', 'tsx', 'src/cli.ts'], {
  input: JSON.stringify(input), encoding: 'utf8',
});

describe('claim-office CLI', () => {
  it('reads a scenario and emits only JSON results', () => {
    const run = execute({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('reports failures on stderr without leaking partial results to stdout', () => {
    for (const steps of [
      [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }],
    ]) {
      const run = execute({ customer: { yearsWithMHPCO: 0 }, steps });
      expect(run.status).not.toBe(0);
      expect(run.stderr).not.toBe('');
      expect(run.stdout).toBe('');
    }
  });
});
