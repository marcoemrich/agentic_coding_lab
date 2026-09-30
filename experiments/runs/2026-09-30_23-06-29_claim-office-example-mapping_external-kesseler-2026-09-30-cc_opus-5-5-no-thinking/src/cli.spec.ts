import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function runCli(input: string) {
  return spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input, encoding: 'utf8' });
}

describe('cli', () => {
  it('reads scenario from stdin and writes results JSON to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };

    const run = runCli(JSON.stringify(scenario));

    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('invalid scenario exits non-zero, writes error to stderr and nothing to stdout', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] };

    const run = runCli(JSON.stringify(scenario));

    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toBe('Unknown item type: broomstick\n');
  });
});
