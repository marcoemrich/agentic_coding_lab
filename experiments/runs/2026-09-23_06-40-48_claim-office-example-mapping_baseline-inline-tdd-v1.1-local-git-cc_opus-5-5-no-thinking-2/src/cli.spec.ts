import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runScenario } from './scenario';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: string) {
  return spawnSync(process.execPath, ['--import', 'tsx', cliPath], { input, encoding: 'utf8' });
}

describe('runScenario', () => {
  it('handles the schema example', () => {
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

  it('applies the follow-up discount on the second quote', () => {
    const item = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [item] },
        { op: 'quote', items: [item] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('rejects a claim referencing a non-quote step', () => {
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
    const res = runCli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] }));
    expect(res.status).toBe(0);
    expect(JSON.parse(res.stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it('exits non-zero with stderr on unknown item type', () => {
    const res = runCli(
      JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }),
    );
    expect(res.status).not.toBe(0);
    expect(res.stderr).toMatch(/broomstick/);
    expect(res.stdout).toBe('');
  });

  it('exits non-zero on invalid JSON', () => {
    const res = runCli('not json');
    expect(res.status).not.toBe(0);
    expect(res.stdout).toBe('');
  });
});
