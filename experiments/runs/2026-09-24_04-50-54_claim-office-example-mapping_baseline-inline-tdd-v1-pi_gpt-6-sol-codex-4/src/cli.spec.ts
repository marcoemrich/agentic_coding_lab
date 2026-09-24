import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function cli(input: unknown) {
  return spawnSync(process.execPath, ['--import', 'tsx', 'src/cli.ts'], {
    input: JSON.stringify(input), encoding: 'utf8', cwd: process.cwd(),
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario and writes only JSON results to stdout', () => {
    const output = cli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(output.status).toBe(0);
    expect(JSON.parse(output.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('returns an error on stderr without results on stdout for invalid inputs', () => {
    for (const steps of [
      [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 100 }] } }],
      [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }],
      [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }] } }],
    ]) {
      const output = cli({ customer: { yearsWithMHPCO: 0 }, steps });
      expect(output.status).not.toBe(0);
      expect(output.stdout).toBe('');
      expect(output.stderr).not.toBe('');
    }
  });
});
