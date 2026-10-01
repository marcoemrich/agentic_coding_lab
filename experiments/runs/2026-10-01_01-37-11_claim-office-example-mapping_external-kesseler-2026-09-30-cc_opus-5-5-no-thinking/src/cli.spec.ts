import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function runCli(input: unknown) {
  return spawnSync('bin/claim-office', [], { input: JSON.stringify(input), encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('writes the results of a scenario read from stdin to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };

    const run = runCli(scenario);

    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('reports a rejected scenario on stderr with a non-zero exit code and no results', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] };

    const run = runCli(scenario);

    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe('');
    expect(run.stderr).toBe('Unknown item type: broomstick\n');
  });
});
