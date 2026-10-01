import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runScenario } from './scenario';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: string) {
  return spawnSync('npx', ['tsx', cliPath], { input, encoding: 'utf8' });
}

describe('runScenario', () => {
  it('counts earlier quotes as previous contracts', () => {
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [cursedSword] },
      ],
    });
    expect(result.results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });

  it('claims reference policies by step index and track remaining cap', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('rejects claims against a non-quote step', () => {
    const steps = [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow();
  });
});

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };
    const proc = runCli(JSON.stringify(scenario));
    expect(proc.status).toBe(0);
    // 60 - 12 + 6 + 5 = 59
    expect(JSON.parse(proc.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('exits non-zero with stderr message and no stdout on unknown item type', () => {
    const proc = runCli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }));
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).toMatch(/broomstick/);
    expect(proc.stdout).toBe('');
  });

  it('exits non-zero on invalid JSON', () => {
    const proc = runCli('not json');
    expect(proc.status).not.toBe(0);
    expect(proc.stdout).toBe('');
  });
});
