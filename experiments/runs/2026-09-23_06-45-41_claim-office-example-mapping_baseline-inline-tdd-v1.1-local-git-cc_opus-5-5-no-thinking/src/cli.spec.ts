import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runScenario } from './scenario';

function cli(input: unknown) {
  const result = spawnSync('npx', ['tsx', 'src/cli.ts'], { input: JSON.stringify(input), encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };

describe('scenario', () => {
  it('counts earlier quotes as previous contracts', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [cursedSword] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('claims against a policy created by an earlier quote', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });

  it.each([
    ['missing step', 5],
    ['non-quote step', 0],
  ])('rejects claims referencing a %s', (_, policy) => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy, incident: { cause: 'x', damages: [] } }],
      }),
    ).toThrow();
  });
});

describe('claim-office CLI', () => {
  it('writes results for the schema example', () => {
    const { status, stdout } = cli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    // 60 - 12 + 6 + 5 = 59
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('fails with stderr and no stdout on unknown item type', () => {
    const { status, stdout, stderr } = cli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/broomstick/);
  });

  it('fails on invalid JSON', () => {
    const result = spawnSync('npx', ['tsx', 'src/cli.ts'], { input: 'nope', encoding: 'utf8' });
    expect(result.status).not.toBe(0);
  });
});
