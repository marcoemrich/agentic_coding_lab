import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office';

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: unknown[]) => ({ op: 'quote', items });
const item = (type: string, extra = {}) => ({ type, ...extra });

function run(steps: unknown[], years = 0) {
  return processScenario({ customer: customer(years), steps });
}

describe('quotes', () => {
  it('prices every main item and the empty policy', () => {
    const premiums = [[], [item('sword')], [item('amulet')], [item('staff')], [item('potion')]]
      .map((items) => run([quote(items)]).results[0]);
    expect(premiums).toEqual([
      { premium: 5 }, { premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 },
    ]);
  });

  it('only discounts an exact block of three alike components', () => {
    const itemLists = [
      [item('rune'), item('rune')],
      [item('rune'), item('rune'), item('rune')],
      [item('rune'), item('rune'), item('rune'), item('rune')],
      [...Array(7)].map(() => item('rune')),
      [item('rune'), item('rune'), item('moonstone')],
      [...Array(3)].map(() => item('rune')).concat([...Array(3)].map(() => item('moonstone'))),
    ];
    expect(itemLists.map((items) => run([quote(items)]).results[0])).toEqual([
      { premium: 60 }, { premium: 71 }, { premium: 115 }, { premium: 198 }, { premium: 88 }, { premium: 137 },
    ]);
  });

  it('stacks item surcharges and policy modifiers additively', () => {
    const enchantedCursed = item('sword', { cursed: true, enchantment: 5 });
    expect(run([quote([enchantedCursed, item('amulet')])], 2)).toEqual({ results: [{ premium: 229 }] });
  });

  it('applies the follow-up discount after the first quote', () => {
    const sword = item('sword', { cursed: true, enchantment: 7 });
    expect(run([quote([]), quote([sword])], 3)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });

  it('rounds a fractional premium upward only at the end', () => {
    expect(run([quote([...Array(7)].map(() => item('rune')))])).toEqual({ results: [{ premium: 198 }] });
  });
});

describe('claims', () => {
  it('deducts 100 per damage and tracks a cap based on insurance value', () => {
    const steps = [
      quote([item('sword'), item('amulet')]),
      { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
        { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
      ] } },
    ];
    expect(run(steps)).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });

  it('halves reimbursement at enchantment 8 even for dragon material', () => {
    const steps = [
      quote([item('sword', { material: 'dragon', enchantment: 8 })]),
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
    ];
    expect(run(steps)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  it('fully reimburses ordinary and lower-enchantment dragon items before deductible', () => {
    const steps = [
      quote([item('sword', { material: 'steel', enchantment: 3 }), item('staff', { material: 'dragon', enchantment: 5 })]),
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
        { itemType: 'sword', amount: 500 }, { itemType: 'staff', amount: 800 },
      ] } },
    ];
    expect(run(steps)).toEqual({ results: [{ premium: 227 }, { payout: 1100, remainingCap: 2500 }] });
  });

  it('floors the final fractional payout', () => {
    const steps = [quote([item('sword', { enchantment: 9 })]), {
      op: 'claim', policy: 0, incident: { cause: 'fall', damages: [{ itemType: 'sword', amount: 901 }] },
    }];
    expect(run(steps)).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });

  it('limits successive claims to twice the unmodified insurance sum', () => {
    const claim = { op: 'claim', policy: 0, incident: { cause: 'battle', damages: [{ itemType: 'sword', amount: 1500 }] } };
    expect(run([quote([item('sword', { cursed: true })]), claim, claim])).toEqual({ results: [
      { premium: 165 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ] });
  });

  it('supports duplicate insured types with a deductible for each occurrence', () => {
    const steps = [quote([item('sword'), item('sword')]), { op: 'claim', policy: 0, incident: {
      cause: 'attack', damages: [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }],
    } }];
    expect(run(steps)).toEqual({ results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }] });
  });
});

describe('invalid scenarios', () => {
  const invalidScenarios: [unknown[]][] = [
    [[quote([item('broomstick')])]],
    [[quote([item('sword')]), { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 2 }] } }]],
    [[quote([item('sword')]), { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] } }]],
    [[quote([item('sword')]), { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 2 }, { itemType: 'sword', amount: 2 }] } }]],
    [[{ op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } }]],
  ];

  it.each(invalidScenarios)('rejects invalid input %#', (steps) => {
    expect(() => run(steps)).toThrow();
  });
});
