import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));

const run = (input: unknown) =>
  spawnSync('npx', ['tsx', cli], { input: JSON.stringify(input), encoding: 'utf8' });

describe('claim-office CLI', () => {
  it('processes the schema example scenario', () => {
    const result = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });

    expect(result.status).toBe(0);
    // 60 base + 6 first insurance - 12 loyalty = 54 + 5 = 59
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('counts follow-up contracts across quote steps', () => {
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'potion' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).results[1]).toEqual({ premium: 160 });
  });

  it('fails on an unknown item type without writing results', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stdout).not.toContain('results');
    expect(result.stderr.trim()).not.toBe('');
  });

  it('fails on a damage to an item outside the policy', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr.trim()).not.toBe('');
  });

  it('fails on a negative damage amount', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr.trim()).not.toBe('');
  });
});
