import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function runCli(input: unknown) {
  return spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input: JSON.stringify(input), encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes the results to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };

    const result = runCli(scenario);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('reports an invalid scenario on stderr with a non-zero exit status and no results', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] };

    const result = runCli(scenario);

    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim()).toBe('Unknown item type: broomstick');
  });

  it('is exposed as the claim-office executable', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] };

    const result = spawnSync('./claim-office', { input: JSON.stringify(scenario), encoding: 'utf8' });

    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
