import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));

function run(input: unknown) {
  return spawnSync('npx', ['tsx', cli], { input: JSON.stringify(input), encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes the results as JSON to stdout', () => {
    const result = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    // 60 - 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 - 100, cap 1200
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('exits non-zero with an error on stderr and no results on stdout for invalid input', () => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe('');
  });
});
