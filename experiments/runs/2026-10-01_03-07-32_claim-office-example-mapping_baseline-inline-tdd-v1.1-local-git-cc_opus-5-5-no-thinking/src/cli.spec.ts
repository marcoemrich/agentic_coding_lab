import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(input: unknown) {
  const result = spawnSync(join(root, 'bin', 'claim-office'), {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };

describe('claim-office CLI', () => {
  it('processes the schema example', () => {
    const { status, stdout } = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    // 60 - 12 + 6 + 5 = 59; payout 100, cap 1200 - 100
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('applies follow-up discount to later quotes', () => {
    const { stdout } = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [cursedSword] },
      ],
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });

  it('tracks the cap per policy across claims', () => {
    const claim = { op: 'claim', policy: 0, incident: { cause: 'troll', damages: [{ itemType: 'sword', amount: 1500 }] } };
    const { stdout } = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, claim, claim] });
    expect(JSON.parse(stdout).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it.each([
    ['unknown item type in quote', { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }],
    [
      'damage to uninsured item',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 100 }] } },
        ],
      },
    ],
    [
      'negative damage',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      },
    ],
    [
      'claim on a non-existent policy',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }],
      },
    ],
    ['invalid JSON', '{not json'],
  ])('fails with non-zero status for %s', (_name, input) => {
    const { status, stdout, stderr } = run(input);
    expect(status).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr.length).toBeGreaterThan(0);
  });
});
