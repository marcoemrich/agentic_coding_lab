import { describe, it, expect } from 'vitest';
import { runScenario, Item, QuoteStep, ClaimStep, Damage } from './scenario';

const newcomer = { yearsWithMHPCO: 0 };

const rune: Item = { type: 'rune' };
const moonstone: Item = { type: 'moonstone' };

function quote(...items: Item[]): QuoteStep {
  return { op: 'quote', items };
}

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    const scenario = { customer: newcomer, steps: [{ op: 'quote' as const, items: [] }] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 5 }]);
  });

  it('adds the first insurance surcharge and fee to a plain sword', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'sword', material: 'steel', enchantment: 3 })] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 115 }]);
  });

  it.each([
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('uses the price list base premium for a %s', (type, premium) => {
    const scenario = { customer: newcomer, steps: [quote({ type })] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium }]);
  });

  it('charges 25 G base premium per component', () => {
    const scenario = { customer: newcomer, steps: [quote(rune, rune)] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 60 }]);
  });

  it('offers a block of exactly 3 alike components at 60 G base premium', () => {
    const scenario = { customer: newcomer, steps: [quote(rune, rune, rune)] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 71 }]);
  });

  it.each([
    [4, 115],
    [7, 198],
  ])('applies no block to %i runes and rounds the premium up', (count, premium) => {
    const scenario = { customer: newcomer, steps: [quote(...Array(count).fill(rune))] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium }]);
  });

  it.each([
    ['2 runes + 1 moonstone', [rune, rune, moonstone], 88],
    ['3 runes + 3 moonstones', [rune, rune, rune, moonstone, moonstone, moonstone], 137],
  ])('forms blocks only from components of the same type: %s', (_name, items, premium) => {
    const scenario = { customer: newcomer, steps: [quote(...items)] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium }]);
  });

  it('adds a 50 % curse surcharge for a newcomer with a cursed sword', () => {
    const scenario = {
      customer: newcomer,
      steps: [quote({ type: 'sword', material: 'steel', enchantment: 3, cursed: true })],
    };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 165 }]);
  });

  it('applies the curse surcharge only to the cursed item of a multi-item policy', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'sword', cursed: true }, { type: 'amulet' })] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 231 }]);
  });

  it.each([
    [5, false, 145],
    [4, false, 115],
    [5, true, 195],
    [4, true, 165],
  ])('sword with enchantment %i (cursed: %s) costs %i', (enchantment, cursed, premium) => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'sword', enchantment, cursed })] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium }]);
  });

  it.each([
    [2, 95],
    [1, 115],
  ])('customer with %i years with MHPCO pays %i for a sword', (yearsWithMHPCO, premium) => {
    const scenario = { customer: { yearsWithMHPCO }, steps: [quote({ type: 'sword' })] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium }]);
  });

  it('gives a long-standing customer a follow-up discount on the second contract', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [quote({ type: 'amulet' }), quote({ type: 'sword', material: 'steel', enchantment: 7, cursed: true })],
    };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });

  it('rejects an item of unknown type', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'broomstick' })] };

    const run = () => runScenario(scenario);

    expect(run).toThrow(/broomstick/);
  });

  it('adds the curse surcharge to a cursed component', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'rune', cursed: true })] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 45 }]);
  });

  it('bases the surcharge of a cursed component in a block on its share of the block premium', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'rune', cursed: true }, rune, rune)] };

    const output = runScenario(scenario);

    expect(output.results).toEqual([{ premium: 81 }]);
  });
});

function claim(policy: number, ...damages: Damage[]): ClaimStep {
  return { op: 'claim', policy, incident: { cause: 'dragon attack', damages } };
}

describe('claim', () => {
  it('reimburses a standard sword damage minus the deductible', () => {
    const scenario = {
      customer: newcomer,
      steps: [
        quote({ type: 'sword', material: 'steel', enchantment: 3 }),
        claim(0, { itemType: 'sword', amount: 500 }),
      ],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses a rune damage minus the deductible', () => {
    const scenario = { customer: newcomer, steps: [quote(rune), claim(0, { itemType: 'rune', amount: 200 })] };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  it.each([
    ['steel', 9],
    ['dragon', 9],
    ['dragon', 8],
  ])('reimburses half the damage to a %s sword with enchantment %i', (material, enchantment) => {
    const scenario = {
      customer: newcomer,
      steps: [quote({ type: 'sword', material, enchantment }), claim(0, { itemType: 'sword', amount: 1000 })],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('fully reimburses a dragon-material sword below the enchantment threshold', () => {
    const scenario = {
      customer: newcomer,
      steps: [quote({ type: 'sword', material: 'dragon', enchantment: 5 }), claim(0, { itemType: 'sword', amount: 800 })],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  it('applies the deductible once per damaged item', () => {
    const scenario = {
      customer: newcomer,
      steps: [
        quote({ type: 'sword' }, { type: 'amulet' }),
        claim(0, { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }),
      ],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it.each([
    ['staff', 1600],
    ['potion', 800],
    ['moonstone', 500],
  ])('caps a %s policy at twice its insurance value', (type, cap) => {
    const scenario = { customer: newcomer, steps: [quote({ type }), claim(0, { itemType: type, amount: 100 })] };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 0, remainingCap: cap });
  });

  it('pays nothing when the damage is below the deductible', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'sword' }), claim(0, { itemType: 'sword', amount: 50 })] };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('treats each damage of the same item type as a separate damage to the next insured item', () => {
    const scenario = {
      customer: newcomer,
      steps: [
        quote({ type: 'sword', enchantment: 3 }, { type: 'sword', enchantment: 9 }),
        claim(0, { itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 }),
      ],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 1300, remainingCap: 2700 });
  });

  it('limits successive payouts to the remaining cap of the policy', () => {
    const scenario = {
      customer: newcomer,
      steps: [
        quote({ type: 'sword' }),
        claim(0, { itemType: 'sword', amount: 1500 }),
        claim(0, { itemType: 'sword', amount: 1500 }),
      ],
    };

    const output = runScenario(scenario);

    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it.each([
    ['a cursed sword', [{ type: 'sword', cursed: true }], 2000],
    ['a sword and a block of 3 runes', [{ type: 'sword' }, rune, rune, rune], 3500],
  ])('bases the cap of %s on unmodified insurance values', (_name, items, cap) => {
    const scenario = { customer: newcomer, steps: [quote(...items), claim(0, { itemType: 'sword', amount: 100 })] };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 0, remainingCap: cap });
  });

  it('rounds the payout down in the MHPCO\'s favor', () => {
    const scenario = {
      customer: newcomer,
      steps: [quote({ type: 'sword', enchantment: 9 }), claim(0, { itemType: 'sword', amount: 901 })],
    };

    const output = runScenario(scenario);

    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it.each(['amulet', 'broomstick'])('rejects a damage to a %s that the policy does not cover', (itemType) => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'sword' }), claim(0, { itemType, amount: 300 })] };

    const run = () => runScenario(scenario);

    expect(run).toThrow(itemType);
  });

  it('rejects a claim with more damages of a type than the policy covers', () => {
    const scenario = {
      customer: newcomer,
      steps: [
        quote({ type: 'sword' }),
        claim(0, { itemType: 'sword', amount: 300 }, { itemType: 'sword', amount: 300 }),
      ],
    };

    const run = () => runScenario(scenario);

    expect(run).toThrow('sword');
  });

  it('rejects a damage with a negative amount', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'sword' }), claim(0, { itemType: 'sword', amount: -200 })] };

    const run = () => runScenario(scenario);

    expect(run).toThrow('-200');
  });

  it('rejects a claim against a step that did not create a policy', () => {
    const scenario = { customer: newcomer, steps: [quote({ type: 'sword' }), claim(5, { itemType: 'sword', amount: 300 })] };

    const run = () => runScenario(scenario);

    expect(run).toThrow('No policy at step 5');
  });
});
