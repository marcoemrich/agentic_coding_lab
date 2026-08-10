import { execFileSync, spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const cli = ['node_modules/.bin/tsx', 'src/cli.ts'];

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes only JSON to stdout', () => {
    const stdout = execFileSync(cli[0], [cli[1]], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: 'quote', items: [{ type: 'amulet', enchantment: 2 }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
        ],
      }),
      encoding: 'utf8',
    });
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it.each([
    JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }),
    JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -1 }] } },
    ] }),
    '{bad json',
  ])('fails without partial stdout for invalid input', (input) => {
    const result = spawnSync(cli[0], [cli[1]], { input, encoding: 'utf8' });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
