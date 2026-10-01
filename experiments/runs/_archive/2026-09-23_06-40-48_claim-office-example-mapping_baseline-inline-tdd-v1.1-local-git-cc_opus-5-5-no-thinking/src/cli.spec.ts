import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runScenario } from './scenario';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: string) {
  return spawnSync('npx', ['tsx', cli], { input, encoding: 'utf8' });
}

describe('scenario', () => {
  it('schema example', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    // 60 - 12 + 6 + 5 = 59
    expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('second quote gets follow-up discount', () => {
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [cursedSword] },
        { op: 'quote', items: [cursedSword] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('claims against the same policy share the cap', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('rejects claim referencing a non-quote step', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } }],
      }),
    ).toThrow();
  });

  it('rejects unknown op', () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'cancel' }] })).toThrow();
  });
});

describe('cli', () => {
  it('writes results JSON to stdout', () => {
    const out = runCli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] }));
    expect(out.status).toBe(0);
    expect(JSON.parse(out.stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it('fails with non-zero status and stderr for unknown item type', () => {
    const out = runCli(
      JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }),
    );
    expect(out.status).not.toBe(0);
    expect(out.stderr).toMatch(/broomstick/);
    expect(out.stdout).toBe('');
  });

  it('fails on invalid JSON', () => {
    const out = runCli('not json');
    expect(out.status).not.toBe(0);
    expect(out.stdout).toBe('');
  });
}, 20000);
