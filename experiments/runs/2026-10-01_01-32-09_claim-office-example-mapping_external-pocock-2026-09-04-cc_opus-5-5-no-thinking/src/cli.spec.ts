import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

const runCli = (input: unknown) =>
  spawnSync(process.execPath, ['--import', 'tsx', cliPath], { input: JSON.stringify(input), encoding: 'utf8' });

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    // 60 - 12 loyalty + 6 first insurance + 5 fee = 59; payout 100, cap 1200 - 100
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('exits non-zero with an error on stderr and nothing on stdout for an unknown item type', () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe('');
  });

  it('exits non-zero for a negative damage amount', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200/);
    expect(result.stdout).toBe('');
  });
});
