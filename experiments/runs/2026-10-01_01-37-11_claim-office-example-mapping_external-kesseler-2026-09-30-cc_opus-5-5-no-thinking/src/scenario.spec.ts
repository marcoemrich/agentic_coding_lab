import { describe, it, expect } from 'vitest';
import { runScenario, Item } from './scenario';

function quoteFor(yearsWithMHPCO: number, items: Item[]) {
  return runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0];
}

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote' as const, items: [] }] };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 5 }] });
  });

  it('adds the first insurance surcharge and fee for a newcomer with a plain sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];

    const result = quoteFor(0, items);

    expect(result).toEqual({ premium: 115 });
  });

  it('adds the curse surcharge for a newcomer with a cursed sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];

    const result = quoteFor(0, items);

    expect(result).toEqual({ premium: 165 });
  });

  it('applies the curse surcharge only to the cursed item', () => {
    const items = [
      { type: 'sword', cursed: true },
      { type: 'amulet', cursed: false },
    ];

    const result = quoteFor(0, items);

    expect(result).toEqual({ premium: 231 });
  });

  it('adds the high-enchantment surcharge at exactly enchantment 5', () => {
    const items = [{ type: 'sword', enchantment: 5 }];

    const result = quoteFor(0, items);

    expect(result).toEqual({ premium: 145 });
  });

  it('adds no high-enchantment surcharge at enchantment 4', () => {
    const items = [{ type: 'sword', enchantment: 4 }];

    const result = quoteFor(0, items);

    expect(result).toEqual({ premium: 115 });
  });

  it('adds both surcharges for a cursed sword with enchantment 5', () => {
    const items = [{ type: 'sword', enchantment: 5, cursed: true }];

    const result = quoteFor(0, items);

    expect(result).toEqual({ premium: 195 });
  });

  it('grants the loyalty discount to a customer with exactly 2 years', () => {
    const items = [{ type: 'sword' }];

    const result = quoteFor(2, items);

    expect(result).toEqual({ premium: 95 });
  });

  it('grants no loyalty discount to a customer with 1 year', () => {
    const items = [{ type: 'sword' }];

    const result = quoteFor(1, items);

    expect(result).toEqual({ premium: 115 });
  });

  it('grants the follow-up discount on every contract after the first', () => {
    const sword = { op: 'quote' as const, items: [{ type: 'sword' }] };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [sword, sword, sword] };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 115 }, { premium: 100 }, { premium: 100 }] });
  });

  it('stacks all modifiers for a long-standing customer\'s second contract', () => {
    const firstContract = { op: 'quote' as const, items: [{ type: 'amulet' }] };
    const secondContract = { op: 'quote' as const, items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] };
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [firstContract, secondContract] };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ premium: 160 });
  });

  it('rounds a fractional premium up in the MHPCO\'s favor', () => {
    const items = [{ type: 'rune' }];

    const result = quoteFor(0, items);

    expect(result).toEqual({ premium: 33 });
  });

  it('rejects an item of unknown type', () => {
    const items = [{ type: 'broomstick' }];

    const quoting = () => quoteFor(0, items);

    expect(quoting).toThrow(/broomstick/);
  });
});

function claimsAgainst(items: Item[], ...damageLists: { itemType: string; amount: number }[][]) {
  const claims = damageLists.map((damages) => ({
    op: 'claim' as const,
    policy: 0,
    incident: { cause: 'dragon attack', damages },
  }));
  const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote' as const, items }, ...claims] };
  return runScenario(scenario).results.slice(1);
}

describe('claim', () => {
  it('reimburses a regular sword fully minus the deductible', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3 }];

    const [result] = claimsAgainst(items, [{ itemType: 'sword', amount: 500 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses a rune fully minus the deductible', () => {
    const items = [{ type: 'rune' }];

    const [result] = claimsAgainst(items, [{ itemType: 'rune', amount: 200 }]);

    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  it('reimburses half the damage to a highly enchanted steel sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 9 }];

    const [result] = claimsAgainst(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it.each([
    [5, 800, 700],
    [8, 1000, 400],
    [9, 1000, 400],
  ])('applies the enchantment clause before the dragon clause (enchantment %i, damage %i)', (enchantment, amount, payout) => {
    const items = [{ type: 'sword', material: 'dragon', enchantment }];

    const [result] = claimsAgainst(items, [{ itemType: 'sword', amount }]);

    expect(result).toEqual({ payout, remainingCap: 2000 - payout });
  });

  it('applies the deductible once per damaged item', () => {
    const items = [{ type: 'sword' }, { type: 'amulet' }];

    const [result] = claimsAgainst(items, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);

    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it.each([
    ['sword', 2000],
    ['amulet', 1200],
    ['staff', 1600],
    ['potion', 800],
    ['rune', 500],
    ['moonstone', 500],
  ])('pays nothing and leaves the full cap for a %s policy when nothing is damaged', (type, cap) => {
    const items = [{ type }];

    const [result] = claimsAgainst(items, []);

    expect(result).toEqual({ payout: 0, remainingCap: cap });
  });

  it('treats each damage to two insured swords as a separate damage with its own deductible', () => {
    const items = [
      { type: 'sword', enchantment: 3 },
      { type: 'sword', enchantment: 9 },
    ];

    const [result] = claimsAgainst(items, [
      { itemType: 'sword', amount: 1000 },
      { itemType: 'sword', amount: 1000 },
    ]);

    expect(result).toEqual({ payout: 1300, remainingCap: 2700 });
  });

  it('bases the cap on insurance values, unaffected by the component block', () => {
    const items = [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }];

    const [result] = claimsAgainst(items, []);

    expect(result).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it('bases the cap on insurance values, unaffected by premium modifiers', () => {
    const items = [{ type: 'sword', cursed: true }];

    const [result] = claimsAgainst(items, []);

    expect(result).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('reduces a payout to the cap remaining from earlier claims', () => {
    const items = [{ type: 'sword' }];

    const results = claimsAgainst(items, [{ itemType: 'sword', amount: 1500 }], [{ itemType: 'sword', amount: 1500 }]);

    expect(results).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('rounds a fractional payout down in the MHPCO\'s favor', () => {
    const items = [{ type: 'sword', enchantment: 9 }];

    const [result] = claimsAgainst(items, [{ itemType: 'sword', amount: 901 }]);

    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('pays nothing for a damage below the deductible', () => {
    const items = [{ type: 'sword' }, { type: 'amulet' }];

    const [result] = claimsAgainst(items, [
      { itemType: 'sword', amount: 50 },
      { itemType: 'amulet', amount: 300 },
    ]);

    expect(result).toEqual({ payout: 200, remainingCap: 3000 });
  });

  it.each(['amulet', 'broomstick'])('rejects damage to a %s that the policy does not cover', (itemType) => {
    const items = [{ type: 'sword' }];

    const claiming = () => claimsAgainst(items, [{ itemType, amount: 300 }]);

    expect(claiming).toThrow(itemType);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const items = [{ type: 'sword' }];

    const claiming = () => claimsAgainst(items, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);

    expect(claiming).toThrow('sword');
  });

  it('rejects a negative damage amount', () => {
    const items = [{ type: 'sword' }];

    const claiming = () => claimsAgainst(items, [{ itemType: 'sword', amount: -200 }]);

    expect(claiming).toThrow('-200');
  });

  it('rejects a claim against a step that did not create a policy', () => {
    const claim = { op: 'claim' as const, policy: 5, incident: { cause: 'fire', damages: [] } };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [claim] };

    const running = () => runScenario(scenario);

    expect(running).toThrow(/policy 5/);
  });
});
