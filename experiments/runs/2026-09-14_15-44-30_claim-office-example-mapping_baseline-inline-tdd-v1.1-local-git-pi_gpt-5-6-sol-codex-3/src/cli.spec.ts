import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const runCli = (input: string) => spawnSync(process.execPath, ['--import', 'tsx', 'src/cli.ts'], {
  input,
  encoding: 'utf8',
});

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes only JSON results to stdout', () => {
    const run = runCli(JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    }));
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
    expect(run.stderr).toBe('');
  });

  it.each([
    ['unknown quote item', { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }],
    ['negative damage', { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
    ] }],
  ])('reports %s on stderr with no results', (_name, scenario) => {
    const run = runCli(JSON.stringify(scenario));
    expect(run.status).not.toBe(0);
    expect(run.stderr).not.toBe('');
    expect(run.stdout).toBe('');
  });
});
