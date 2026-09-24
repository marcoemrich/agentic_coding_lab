import { describe, expect, it } from 'vitest';
import { runScenario, type Step } from './office.js';

const scenario = (steps: Step[], yearsWithMHPCO = 0) => runScenario({ customer: { yearsWithMHPCO }, steps });

describe('MHPCO', () => {
  it('quotes the price-list items, first insurance, and processing fee', () => {
    expect(scenario([{ op: 'quote', items: [{ type: 'sword' }] }])).toEqual({ results: [{ premium: 115 }] });
    expect(scenario([{ op: 'quote', items: [{ type: 'amulet' }, { type: 'staff' }, { type: 'potion' }] }])).toEqual({ results: [{ premium: 203 }] });
    expect(scenario([{ op: 'quote', items: [] }])).toEqual({ results: [{ premium: 5 }] });
  });

  it('offers blocks only for exactly three components of the same type', () => {
    for (const [types, premium] of [
      [['rune', 'rune'], 60],
      [['rune', 'rune', 'rune'], 71],
      [['rune', 'rune', 'rune', 'rune'], 115],
      [Array(7).fill('rune'), 198],
      [['rune', 'rune', 'moonstone'], 88],
      [['rune', 'rune', 'rune', 'moonstone', 'moonstone', 'moonstone'], 137],
    ] as const) {
      expect(scenario([{ op: 'quote', items: types.map(type => ({ type })) }])).toEqual({ results: [{ premium }] });
    }
  });

  it('stacks item-specific risk and policy-wide history modifiers additively', () => {
    expect(scenario([{ op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] }])).toEqual({ results: [{ premium: 231 }] });
    expect(scenario([{ op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 5 }] }])).toEqual({ results: [{ premium: 195 }] });
    expect(scenario([{ op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 4 }] }])).toEqual({ results: [{ premium: 165 }] });
    expect(scenario([{ op: 'quote', items: [{ type: 'sword' }] }], 2)).toEqual({ results: [{ premium: 95 }] });
    expect(scenario([
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
    ], 3)).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
    expect(scenario([{ op: 'quote', items: [{ type: 'rune', cursed: true }] }])).toEqual({ results: [{ premium: 45 }] });
  });

  it('reimburses each damaged insured item with its own deductible', () => {
    expect(scenario([
      { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }, { type: 'amulet' }, { type: 'rune' }] },
      { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
        { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }, { itemType: 'rune', amount: 200 },
      ] } },
    ])).toEqual({ results: [{ premium: 209 }, { payout: 700, remainingCap: 3000 }] });
  });

  it('applies high-enchantment reimbursement before deductible even for dragon material', () => {
    for (const [material, enchantment, amount, payout] of [
      ['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400],
      ['dragon', 5, 800, 700], ['steel', 9, 1000, 400],
      ['steel', 7, 99, 0], ['steel', 8, 901, 350],
    ] as const) {
      expect(scenario([
        { op: 'quote', items: [{ type: 'sword', material, enchantment }] },
        { op: 'claim', policy: 0, incident: { cause: 'accident', damages: [{ itemType: 'sword', amount }] } },
      ]).results[1]).toEqual({ payout, remainingCap: 2000 - payout });
    }
  });

  it('limits successive payouts to twice the unmodified sum insured', () => {
    expect(scenario([
      { op: 'quote', items: [{ type: 'sword', cursed: true }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
    ])).toEqual({ results: [{ premium: 165 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
    expect(scenario([{ op: 'quote', items: [{ type: 'sword' }, ...Array(3).fill({ type: 'rune' })] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
    ]).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it('matches duplicate damages to distinct covered items and rejects overuse', () => {
    const incident = { cause: 'dragon', damages: [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }] };
    expect(scenario([{ op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
      { op: 'claim', policy: 0, incident },
    ])).toEqual({ results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }] });
    expect(() => scenario([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident }])).toThrow(/Uninsured/);
  });

  it('rejects unsupported items, uninsured damages, negative amounts and unknown policies', () => {
    expect(() => scenario([{ op: 'quote', items: [{ type: 'broomstick' }] }])).toThrow(/Unknown/);
    expect(() => scenario([{ op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ])).toThrow(/Uninsured/);
    expect(() => scenario([{ op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
    ])).toThrow(/negative/);
    expect(() => scenario([{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }])).toThrow(/policy/);
  });
});
