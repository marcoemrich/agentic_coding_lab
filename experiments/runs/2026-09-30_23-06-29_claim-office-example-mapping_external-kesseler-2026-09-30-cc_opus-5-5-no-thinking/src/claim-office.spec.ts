import { describe, it, expect } from 'vitest';
import { runScenario, Item, Damage, QuoteResult } from './claim-office';

function premiumFor(items: Item[], yearsWithMHPCO = 0): number {
  const output = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] });
  return (output.results[0] as QuoteResult).premium;
}

describe('quote', () => {
  it('empty item list costs only the 5 G processing fee', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote' as const, items: [] }] };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
  it('plain sword costs 100 base + 10 first insurance + 5 fee', () => {
    const items = [{ type: 'sword' }];

    const premium = premiumFor(items);

    expect(premium).toBe(115);
  });
  it.each([
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('%s uses its base premium', (type, expected) => {
    const items = [{ type }];

    const premium = premiumFor(items);

    expect(premium).toBe(expected);
  });
  it('2 runes have a 50 G base premium', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }];

    const premium = premiumFor(items);

    expect(premium).toBe(50 + 5 + 5);
  });
  it('3 runes form a block with a 60 G base premium', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];

    const premium = premiumFor(items);

    expect(premium).toBe(60 + 6 + 5);
  });
  it('4 runes have no block, 100 G base premium', () => {
    const items = Array.from({ length: 4 }, () => ({ type: 'rune' }));

    const premium = premiumFor(items);

    expect(premium).toBe(100 + 10 + 5);
  });
  it('7 runes cost 175 G base, premium 197.5 rounds up to 198', () => {
    const items = Array.from({ length: 7 }, () => ({ type: 'rune' }));

    const premium = premiumFor(items);

    expect(premium).toBe(198);
  });
  it('2 runes + 1 moonstone form no block', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];

    const premium = premiumFor(items);

    expect(premium).toBe(88);
  });
  it('3 runes + 3 moonstones form two blocks', () => {
    const items = [...Array(3).fill({ type: 'rune' }), ...Array(3).fill({ type: 'moonstone' })];

    const premium = premiumFor(items);

    expect(premium).toBe(120 + 12 + 5);
  });
  it('cursed sword adds 50 % surcharge', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];

    const premium = premiumFor(items);

    expect(premium).toBe(100 + 50 + 10 + 5);
  });
  it("cursed surcharge applies only to the cursed item's base premium", () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet', cursed: false }];

    const premium = premiumFor(items);

    expect(premium).toBe(160 + 50 + 16 + 5);
  });
  it('sword with enchantment exactly 5 adds 30 % surcharge', () => {
    const items = [{ type: 'sword', enchantment: 5 }];

    const premium = premiumFor(items);

    expect(premium).toBe(100 + 30 + 10 + 5);
  });
  it('cursed sword with enchantment 5 gets both surcharges', () => {
    const items = [{ type: 'sword', enchantment: 5, cursed: true }];

    const premium = premiumFor(items);

    expect(premium).toBe(100 + 50 + 30 + 10 + 5);
  });
  it('sword with enchantment 4 gets no high enchantment surcharge', () => {
    const items = [{ type: 'sword', enchantment: 4 }];

    const premium = premiumFor(items);

    expect(premium).toBe(100 + 10 + 5);
  });
  it('customer with exactly 2 years gets loyalty discount', () => {
    const items = [{ type: 'sword' }];

    const premium = premiumFor(items, 2);

    expect(premium).toBe(100 - 20 + 10 + 5);
  });
  it('customer with 1 year gets no loyalty discount', () => {
    const items = [{ type: 'sword' }];

    const premium = premiumFor(items, 1);

    expect(premium).toBe(100 + 10 + 5);
  });
  it('second quote in scenario gets follow-up discount', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'quote' as const, items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });
  it('cursed rune gets 50 % surcharge on its 25 G base premium', () => {
    const items = [{ type: 'rune', cursed: true }];

    const premium = premiumFor(items);

    expect(premium).toBe(45);
  });
  it('cursed rune within a block gets 50 % surcharge on its 20 G share of the block', () => {
    const items = [{ type: 'rune', cursed: true }, { type: 'rune' }, { type: 'rune' }];

    const premium = premiumFor(items);

    expect(premium).toBe(60 + 10 + 6 + 5);
  });

  it('unknown item type is rejected', () => {
    const items = [{ type: 'broomstick' }];

    const quoting = () => premiumFor(items);

    expect(quoting).toThrow(/broomstick/);
  });
  it('item type named like an object property is rejected', () => {
    const items = [{ type: 'constructor' }];

    const quoting = () => premiumFor(items);

    expect(quoting).toThrow(/constructor/);
  });
});

function claimAgainst(items: Item[], ...claims: Damage[][]) {
  const output = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: 'quote', items },
      ...claims.map((damages) => ({ op: 'claim' as const, policy: 0, incident: { cause: 'dragon attack', damages } })),
    ],
  });
  return output.results.slice(1);
}

describe('claim', () => {
  it('regular sword damage 500 pays 400, remaining cap 1600', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3 }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 500 }]);

    expect(results).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it('rune damage 200 pays 100', () => {
    const items = [{ type: 'rune' }];

    const results = claimAgainst(items, [{ itemType: 'rune', amount: 200 }]);

    expect(results).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it('damage below deductible pays nothing', () => {
    const items = [{ type: 'sword' }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 50 }]);

    expect(results).toEqual([{ payout: 0, remainingCap: 2000 }]);
  });
  it('enchantment 9 steel sword is reimbursed at 50 %', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 9 }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(results).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it('dragon sword with enchantment 8 is reimbursed at 50 %', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 8 }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(results).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it('dragon sword with enchantment 5 is fully reimbursed', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 5 }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 800 }]);

    expect(results).toEqual([{ payout: 700, remainingCap: 1300 }]);
  });
  it('dragon sword with enchantment 9: the 50 % rule wins over dragon material', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 9 }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(results).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });

  it('deductible applies per damaged item', () => {
    const items = [{ type: 'sword' }, { type: 'amulet' }];

    const results = claimAgainst(items, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);

    expect(results).toEqual([{ payout: 600, remainingCap: 2600 }]);
  });
  it.each([
    ['staff', 1600],
    ['potion', 800],
    ['moonstone', 500],
  ])('%s cap is twice its insurance value', (type, expectedCap) => {
    const items = [{ type }];

    const results = claimAgainst(items, []);

    expect(results).toEqual([{ payout: 0, remainingCap: expectedCap }]);
  });
  it('two swords damaged: each damage matches its own insured sword and deductible', () => {
    const items = [
      { type: 'sword', enchantment: 3 },
      { type: 'sword', enchantment: 9 },
    ];

    const results = claimAgainst(items, [
      { itemType: 'sword', amount: 1000 },
      { itemType: 'sword', amount: 1000 },
    ]);

    expect(results).toEqual([{ payout: 900 + 400, remainingCap: 4000 - 1300 }]);
  });
  it('cap for sword with a block of 3 runes is based on insurance values', () => {
    const items = [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }];

    const results = claimAgainst(items, []);

    expect(results).toEqual([{ payout: 0, remainingCap: 2 * 1750 }]);
  });
  it('cursed sword cap is based on unmodified insurance value', () => {
    const items = [{ type: 'sword', enchantment: 3, cursed: true }];

    const results = claimAgainst(items, []);

    expect(results).toEqual([{ payout: 0, remainingCap: 2000 }]);
  });
  it('successive claims exhaust the cap', () => {
    const items = [{ type: 'sword' }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 1500 }], [{ itemType: 'sword', amount: 1500 }]);

    expect(results).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it('each policy has its own cap', () => {
    const sword = { type: 'sword' };
    const damages = [{ itemType: 'sword', amount: 1500 }];
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [sword] },
        { op: 'quote' as const, items: [sword] },
        { op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages } },
        { op: 'claim' as const, policy: 1, incident: { cause: 'fire', damages } },
      ],
    };

    const output = runScenario(scenario);

    expect(output.results.slice(2)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 1400, remainingCap: 600 },
    ]);
  });

  it('payout 350.5 rounds down to 350', () => {
    const items = [{ type: 'sword', enchantment: 9 }];

    const results = claimAgainst(items, [{ itemType: 'sword', amount: 901 }]);

    expect(results).toEqual([{ payout: 350, remainingCap: 1650 }]);
  });
  it('damage to item not in policy is rejected', () => {
    const items = [{ type: 'sword' }];

    const claiming = () => claimAgainst(items, [{ itemType: 'amulet', amount: 200 }]);

    expect(claiming).toThrow(/amulet/);
  });
  it('damage to unknown item type is rejected', () => {
    const items = [{ type: 'sword' }];

    const claiming = () => claimAgainst(items, [{ itemType: 'broomstick', amount: 200 }]);

    expect(claiming).toThrow(/broomstick/);
  });
  it('more damages of a type than insured is rejected', () => {
    const items = [{ type: 'sword' }];

    const claiming = () =>
      claimAgainst(items, [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 300 },
      ]);

    expect(claiming).toThrow(/sword/);
  });
  it('negative damage amount is rejected', () => {
    const items = [{ type: 'sword' }];

    const claiming = () => claimAgainst(items, [{ itemType: 'sword', amount: -200 }]);

    expect(claiming).toThrow(/-200/);
  });
  it('claim referencing a step that is not a quote is rejected', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'claim' as const, policy: 5, incident: { cause: 'fire', damages: [] } },
      ],
    };

    const running = () => runScenario(scenario);

    expect(running).toThrow(/policy 5/);
  });
});
