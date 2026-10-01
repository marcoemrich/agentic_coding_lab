import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function runCli(input: string) {
  return spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input, encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes the results as JSON to stdout', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });

    const result = runCli(input);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('exits with a non-zero status and reports the error on stderr for an invalid scenario', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    const result = runCli(input);

    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('Error: Unknown item type: broomstick\n');
  });
});
