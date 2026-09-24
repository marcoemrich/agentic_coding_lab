import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const cli = (input: unknown) => spawnSync('./claim-office', { input: JSON.stringify(input), encoding: 'utf8' });

describe('claim-office CLI', () => {
  it('reads a complete scenario from stdin and emits only JSON results to stdout', () => {
    const result = cli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('reports invalid quotes and claims on stderr without results on stdout', () => {
    for (const steps of [
      [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }],
      [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }],
    ]) {
      const result = cli({ customer: { yearsWithMHPCO: 0 }, steps });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toBeTruthy();
      expect(result.stdout).toBe('');
    }
  });
});
