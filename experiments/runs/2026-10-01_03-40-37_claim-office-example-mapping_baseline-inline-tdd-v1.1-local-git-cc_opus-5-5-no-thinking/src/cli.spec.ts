import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsx = path.join(root, 'node_modules', '.bin', 'tsx');

function run(input: unknown) {
  const res = spawnSync(tsx, [path.join(root, 'src', 'cli.ts')], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
  });
  return { status: res.status, stdout: res.stdout, stderr: res.stderr };
}

describe('claim-office CLI', () => {
  it('processes the schema example', () => {
    const res = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(res.status).toBe(0);
    // 60 - 12 + 6 = 54 + 5
    expect(JSON.parse(res.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('applies the follow-up discount to later quotes in the scenario', () => {
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const res = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [cursedSword] },
      ],
    });
    expect(JSON.parse(res.stdout).results[1]).toEqual({ premium: 160 });
  });

  it('tracks remaining cap per policy across claims', () => {
    const damage = { cause: 'troll', damages: [{ itemType: 'sword', amount: 1500 }] };
    const res = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: damage },
        { op: 'claim', policy: 0, incident: damage },
      ],
    });
    expect(JSON.parse(res.stdout).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it.each([
    ['unknown quote item', { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }],
    [
      'damage to uninsured item',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 100 }] } },
        ],
      },
    ],
    [
      'negative damage',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      },
    ],
    [
      'claim against a non-quote step',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } }],
      },
    ],
    ['unknown op', { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'cancel' }] }],
    ['malformed JSON', '{not json'],
  ])('fails with non-zero exit and no results for %s', (_name, input) => {
    const res = run(input);
    expect(res.status).not.toBe(0);
    expect(res.stderr).not.toBe('');
    expect(res.stdout).toBe('');
  });
});
