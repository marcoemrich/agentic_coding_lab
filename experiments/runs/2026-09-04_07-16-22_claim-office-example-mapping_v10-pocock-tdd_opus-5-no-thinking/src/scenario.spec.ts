import { describe, expect, test } from 'vitest';
import { runScenario } from './scenario.js';

describe('quote', () => {
  test('an empty item list costs only the processing fee', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  test('a plain sword for a new customer costs its base premium plus the first-insurance surcharge and fee', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
      ],
    });

    expect(result.results[0]).toEqual({ premium: 115 });
  });

  test.each([
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('a plain %s quotes at %i G', (type, premium) => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type }] }],
    });

    expect(result.results[0]).toEqual({ premium });
  });

  test('two runes have a base premium of 50 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }] }],
    });

    // 50 G base + 5 G first insurance + 5 G fee
    expect(result.results[0]).toEqual({ premium: 60 });
  });

  test('three alike components form a block with a base premium of 60 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
      ],
    });

    // 60 G block base + 6 G first insurance + 5 G fee
    expect(result.results[0]).toEqual({ premium: 71 });
  });

  test.each([
    [4, 115], // 100 G base — no block, it requires exactly 3
    [7, 198], // 175 G base + 17.5 G first insurance + 5 G fee = 197.5, rounded up
  ])('%i runes quote at %i G', (count, premium) => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: Array.from({ length: count }, () => ({ type: 'rune' })) }],
    });

    expect(result.results[0]).toEqual({ premium });
  });

  test('components of different types do not form a block together', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        },
      ],
    });

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5, rounded up
    expect(result.results[0]).toEqual({ premium: 88 });
  });

  test('two groups of three alike components form two separate blocks', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'rune' },
            { type: 'rune' },
            { type: 'rune' },
            { type: 'moonstone' },
            { type: 'moonstone' },
            { type: 'moonstone' },
          ],
        },
      ],
    });

    // 120 G base (two blocks) + 12 G first insurance + 5 G fee
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  test('a newcomer with a cursed sword pays 165 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  test('the curse surcharge is charged on the cursed item alone, not the policy total', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', cursed: true },
            { type: 'amulet', cursed: false },
          ],
        },
      ],
    });

    // 160 G policy base + 50 G curse (50 % of the sword alone) = 210 G,
    // + 16 G first insurance + 5 G fee
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  test('a highly enchanted item adds a 30 % surcharge at exactly enchantment 5', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 5 }] }],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(result.results[0]).toEqual({ premium: 145 });
  });

  test('enchantment 4 is below the high-enchantment threshold', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 4 }] }],
    });

    expect(result.results[0]).toEqual({ premium: 115 });
  });

  test('a cursed, highly enchanted item carries both surcharges', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 5, cursed: true }] }],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  test('exactly two years with MHPCO earns the loyalty discount', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee
    expect(result.results[0]).toEqual({ premium: 95 });
  });

  test('one year with MHPCO is short of the loyalty threshold', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    });

    expect(result.results[0]).toEqual({ premium: 115 });
  });

  test("a long-standing customer's second contract stacks every modifier", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'potion' }] },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
    // + 10 G first insurance − 15 G follow-up = 155 G + 5 G fee
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe('claim', () => {
  test('a regular item is reimbursed in full, less the 100 G deductible', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    });

    // 500 G damage − 100 G deductible; cap is 2 × 1000 G insurance value
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('a component with no enchantment or material is reimbursed in full, less the deductible', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  test('the deductible is taken once per damaged item', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'amulet', amount: 300 },
            ],
          },
        },
      ],
    });

    // (500 − 100) + (300 − 100) = 600; cap 2 × 1600 G
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  test('damage to a highly enchanted item is reimbursed at 50 %, then the deductible', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });

    // 50 % of 1000 G = 500 G, then − 100 G deductible
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('a dragon-material item below the enchantment threshold is reimbursed in full', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] },
        },
      ],
    });

    // full 800 G, then − 100 G deductible
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  test('the 50 % clause wins over dragon material when both apply', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('the 50 % clause applies at exactly enchantment 8, dragon material notwithstanding', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('successive claims draw down a shared cap until it is exhausted', () => {
    const claim = {
      op: 'claim' as const,
      policy: 0,
      incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }, claim, claim],
    });

    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // the desired 1400 G is cut down to the 600 G still available
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  test('the block discount lowers the premium but not the insurance sum', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] },
        },
      ],
    });

    // insurance sum 1750 G (1000 + 3 × 250) → cap 3500 G, undiminished by the block
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  test('premium modifiers do not raise the cap', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] },
        },
      ],
    });

    expect(result.results[0]).toEqual({ premium: 165 });
    // cap stays 2 × 1000 G, based on the unmodified insurance value
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  test('two items of the same type each carry their own insurance value and deductible', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 300 },
            ],
          },
        },
      ],
    });

    // insurance sum 2000 G → cap 4000 G; (500 − 100) + (300 − 100) = 600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  test('a fractional payout is rounded down, in the MHPCO favour', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] },
        },
      ],
    });

    // 50 % of 901 G = 450.5 G, − 100 G deductible = 350.5 G, rounded down
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  test('claiming more items of a type than the policy covers is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon attack',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'sword', amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
});

describe('rejected scenarios', () => {
  test('a quote for an unknown item type is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick/);
  });

  test('a claim against an item the policy does not cover is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });

  test('a claim with a negative damage amount is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200|negative/);
  });

  test('a claim referencing a step that created no policy is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 3,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/policy/);
  });
});
