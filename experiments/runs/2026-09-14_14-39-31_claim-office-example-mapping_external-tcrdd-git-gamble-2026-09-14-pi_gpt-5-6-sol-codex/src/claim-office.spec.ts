import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

describe('CLI', () => {
  it('is exposed as the claim-office executable', () => {
    const execution = spawnSync('./claim-office', [], {
      encoding: 'utf8',
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] }),
    });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [] });
  });

  it('reads a scenario from stdin and writes results to stdout', () => {
    const execution = spawnSync('pnpm', ['exec', 'tsx', 'src/cli.ts'], {
      encoding: 'utf8',
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
      }),
    });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 115 }] });
    expect(execution.stderr).toBe('');
  });
});

describe('quotes', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });

  it('uses the price list and exact blocks of three alike components', () => {
    const premium = (items: Array<{ type: string }>) => processScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }],
    }).results[0];

    expect(premium([{ type: 'sword' }])).toEqual({ premium: 115 });
    expect(premium([{ type: 'amulet' }, { type: 'staff' }, { type: 'potion' }])).toEqual({ premium: 203 });
    expect(premium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toEqual({ premium: 71 });
    expect(premium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toEqual({ premium: 115 });
    expect(premium([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
    expect(premium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ])).toEqual({ premium: 137 });
  });

  it('rejects an unknown item type', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow(/unknown item type/i);
  });

  it('stacks item and policy modifiers at their thresholds', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', cursed: true, enchantment: 5 },
        { type: 'amulet', cursed: false, enchantment: 4 },
      ] }],
    })).toEqual({ results: [{ premium: 261 }] });

    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'potion' }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });
});

describe('claims', () => {
  it('rejects a negative damage amount', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fraud', damages: [
          { itemType: 'sword', amount: -200 },
        ] } },
      ],
    })).toThrow(/negative damage/i);
  });

  it('rejects damage to an item not covered by the policy', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
          { itemType: 'amulet', amount: 200 },
        ] } },
      ],
    })).toThrow(/not covered/i);
  });

  it('applies item reimbursement clauses and a deductible to each damage', () => {
    const claim = (item: Record<string, unknown>, amount: number) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [item as { type: string }] },
        { op: 'claim', policy: 0, incident: { cause: 'accident', damages: [
          { itemType: item.type as string, amount },
        ] } },
      ],
    }).results[1];

    expect(claim({ type: 'sword', material: 'steel', enchantment: 3 }, 500))
      .toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000))
      .toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim({ type: 'sword', material: 'dragon', enchantment: 5 }, 800))
      .toEqual({ payout: 700, remainingCap: 1300 });
    expect(claim({ type: 'rune' }, 200))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
});
