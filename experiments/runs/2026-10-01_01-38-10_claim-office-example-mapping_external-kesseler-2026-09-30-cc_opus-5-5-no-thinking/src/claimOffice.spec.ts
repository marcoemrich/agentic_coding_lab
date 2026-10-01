import { describe, expect, it } from 'vitest';
import { basePremium, Damage, Item, QuoteResult, runScenario, Scenario } from './claimOffice';

describe('base premium', () => {
  it('is 0 for no items', () => {
    const items: Item[] = [];

    const premium = basePremium(items);

    expect(premium).toBe(0);
  });

  it('is 100 for a sword', () => {
    const items: Item[] = [{ type: 'sword' }];

    const premium = basePremium(items);

    expect(premium).toBe(100);
  });

  it('is 60 for an amulet', () => {
    const items: Item[] = [{ type: 'amulet' }];

    const premium = basePremium(items);

    expect(premium).toBe(60);
  });

  it('is 80 for a staff', () => {
    const items: Item[] = [{ type: 'staff' }];

    const premium = basePremium(items);

    expect(premium).toBe(80);
  });

  it('is 40 for a potion', () => {
    const items: Item[] = [{ type: 'potion' }];

    const premium = basePremium(items);

    expect(premium).toBe(40);
  });

  it('is 25 per component for 2 runes', () => {
    const items: Item[] = [{ type: 'rune' }, { type: 'rune' }];

    const premium = basePremium(items);

    expect(premium).toBe(50);
  });

  it('is 60 for a building block of 3 runes', () => {
    const items: Item[] = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];

    const premium = basePremium(items);

    expect(premium).toBe(60);
  });

  it('applies no block to 4 runes', () => {
    const items: Item[] = Array.from({ length: 4 }, () => ({ type: 'rune' }));

    const premium = basePremium(items);

    expect(premium).toBe(100);
  });

  it('applies no block to 7 runes', () => {
    const items: Item[] = Array.from({ length: 7 }, () => ({ type: 'rune' }));

    const premium = basePremium(items);

    expect(premium).toBe(175);
  });

  it('applies no block to components of different types', () => {
    const items: Item[] = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];

    const premium = basePremium(items);

    expect(premium).toBe(75);
  });

  it('applies a separate block to each component type', () => {
    const runes: Item[] = Array.from({ length: 3 }, () => ({ type: 'rune' }));
    const moonstones: Item[] = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));

    const premium = basePremium([...runes, ...moonstones]);

    expect(premium).toBe(120);
  });

  it('applies no block to 3 main items', () => {
    const items: Item[] = Array.from({ length: 3 }, () => ({ type: 'sword' }));

    const premium = basePremium(items);

    expect(premium).toBe(300);
  });
});

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
});

function quoteFor(yearsWithMHPCO: number, items: Item[]): number {
  const scenario: Scenario = { customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] };
  return (runScenario(scenario).results[0] as QuoteResult).premium;
}

describe('quote premium modifiers', () => {
  it('adds a 10 % first insurance surcharge', () => {
    const items: Item[] = [{ type: 'sword' }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(115);
  });

  it('adds a 50 % curse surcharge for a newcomer with a cursed sword', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(165);
  });

  it('adds a 30 % high enchantment surcharge at exactly enchantment 5', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 5 }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(145);
  });

  it('adds no high enchantment surcharge at enchantment 4', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 4 }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(115);
  });

  it('adds both curse and high enchantment surcharges', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 5, cursed: true }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(195);
  });

  it('subtracts a 20 % loyalty discount for exactly 2 years with MHPCO', () => {
    const items: Item[] = [{ type: 'sword' }];

    const premium = quoteFor(2, items);

    expect(premium).toBe(95);
  });

  it('applies the curse surcharge only to the cursed item of a multi-item policy', () => {
    const items: Item[] = [{ type: 'sword', cursed: true }, { type: 'amulet' }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(231);
  });

  it('subtracts a 15 % follow-up discount on the second contract of a long-standing customer', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ premium: 160 });
  });

  it('applies an item surcharge to the share of a component in a building block', () => {
    const items: Item[] = [{ type: 'rune', cursed: true }, { type: 'rune' }, { type: 'rune' }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(81);
  });

  it('rounds a fractional premium up', () => {
    const items: Item[] = [{ type: 'rune' }];

    const premium = quoteFor(0, items);

    expect(premium).toBe(33);
  });

  it('does not round up a whole premium because of fractional rates', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ premium: 100 });
  });
});

function claimFor(items: Item[], damages: Damage[]) {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: 'quote', items },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages } },
    ],
  };
  return runScenario(scenario).results[1];
}

describe('claim', () => {
  it('pays nothing and keeps the cap for a claim without damages', () => {
    const items: Item[] = [{ type: 'sword' }];

    const result = claimFor(items, []);

    expect(result).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('reimburses a regular sword fully minus the deductible', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3 }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 500 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses a rune fully minus the deductible', () => {
    const items: Item[] = [{ type: 'rune' }];

    const result = claimFor(items, [{ itemType: 'rune', amount: 200 }]);

    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  it('reimburses half the damage of a highly enchanted steel sword before the deductible', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 9 }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('lets the 50 % rule win over dragon material', () => {
    const items: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 9 }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('applies the 50 % rule at exactly enchantment 8', () => {
    const items: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 8 }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses fully at enchantment 7', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 7 }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 1000 }]);

    expect(result).toEqual({ payout: 900, remainingCap: 1100 });
  });

  it('reimburses dragon material fully minus the deductible', () => {
    const items: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 5 }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 800 }]);

    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });

  it('applies the deductible once per damaged item', () => {
    const items: Item[] = [{ type: 'sword' }, { type: 'amulet' }];

    const result = claimFor(items, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);

    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('caps a staff at twice its 800 G insurance value', () => {
    const items: Item[] = [{ type: 'staff' }];

    const result = claimFor(items, [{ itemType: 'staff', amount: 300 }]);

    expect(result).toEqual({ payout: 200, remainingCap: 1400 });
  });

  it('caps a potion at twice its 400 G insurance value', () => {
    const items: Item[] = [{ type: 'potion' }];

    const result = claimFor(items, [{ itemType: 'potion', amount: 300 }]);

    expect(result).toEqual({ payout: 200, remainingCap: 600 });
  });

  it('caps a moonstone at twice its 250 G insurance value', () => {
    const items: Item[] = [{ type: 'moonstone' }];

    const result = claimFor(items, [{ itemType: 'moonstone', amount: 200 }]);

    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  it('treats each damage entry of the same type as a separate damage to a separate item', () => {
    const items: Item[] = [
      { type: 'sword', enchantment: 9 },
      { type: 'sword', enchantment: 3 },
    ];

    const result = claimFor(items, [
      { itemType: 'sword', amount: 1000 },
      { itemType: 'sword', amount: 1000 },
    ]);

    expect(result).toEqual({ payout: 1300, remainingCap: 2700 });
  });

  it('reduces the payout of a later claim to the remaining cap', () => {
    const fire = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: fire },
        { op: 'claim', policy: 0, incident: fire },
      ],
    };

    const output = runScenario(scenario);

    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('bases the cap on the unmodified insurance value of a cursed sword', () => {
    const items: Item[] = [{ type: 'sword', cursed: true }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 2500 }]);

    expect(result).toEqual({ payout: 2000, remainingCap: 0 });
  });

  it('bases the cap on the full insurance value of a component block', () => {
    const items: Item[] = [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 500 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 3100 });
  });

  it('rounds a fractional payout down', () => {
    const items: Item[] = [{ type: 'sword', enchantment: 9 }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 901 }]);

    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('pays nothing for a damage below the deductible', () => {
    const items: Item[] = [{ type: 'sword' }];

    const result = claimFor(items, [{ itemType: 'sword', amount: 50 }]);

    expect(result).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('does not let a damage below the deductible reduce the payout for other damages', () => {
    const items: Item[] = [{ type: 'sword' }, { type: 'amulet' }];

    const result = claimFor(items, [
      { itemType: 'sword', amount: 50 },
      { itemType: 'amulet', amount: 300 },
    ]);

    expect(result).toEqual({ payout: 200, remainingCap: 3000 });
  });
});

describe('invalid scenarios', () => {
  it('rejects a quote with an unknown item type', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };

    const run = () => runScenario(scenario);

    expect(run).toThrow('Unknown item type: broomstick');
  });

  it('rejects an item type that only exists on the object prototype', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'constructor' }] }],
    };

    const run = () => runScenario(scenario);

    expect(run).toThrow('Unknown item type: constructor');
  });

  it('rejects a damage to an item the policy does not cover', () => {
    const items: Item[] = [{ type: 'sword' }];

    const run = () => claimFor(items, [{ itemType: 'amulet', amount: 200 }]);

    expect(run).toThrow('Damaged item is not covered by the policy: amulet');
  });

  it('rejects more damages of a type than the policy covers', () => {
    const items: Item[] = [{ type: 'sword' }];

    const run = () =>
      claimFor(items, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]);

    expect(run).toThrow('Damaged item is not covered by the policy: sword');
  });

  it('rejects a damage with an unknown item type', () => {
    const items: Item[] = [{ type: 'sword' }];

    const run = () => claimFor(items, [{ itemType: 'broomstick', amount: 500 }]);

    expect(run).toThrow('Damaged item is not covered by the policy: broomstick');
  });

  it('rejects a negative damage amount', () => {
    const items: Item[] = [{ type: 'sword' }];

    const run = () => claimFor(items, [{ itemType: 'sword', amount: -200 }]);

    expect(run).toThrow('Damage amount must not be negative: -200');
  });

  it('rejects a claim against a step that did not create a policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 5, incident: { cause: 'fire', damages: [] } }],
    };

    const run = () => runScenario(scenario);

    expect(run).toThrow('No policy was created at step 5');
  });
});
