import { describe, expect, test } from 'vitest';
import { runScenario } from './scenario.js';

function componentsOfType(type: string, count: number) {
  return Array.from({ length: count }, () => ({ type }));
}

describe('quote', () => {
  test('an empty item list costs only the processing fee', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });

  test('a plain sword costs its base premium plus first insurance and fee', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });

  test.each([
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('a plain %s is priced from the MHPCO price list', (type, premium) => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type }] }],
    });

    expect(results).toEqual([{ premium }]);
  });

  test('components cost 25 G base premium each', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }] },
      ],
    });

    // base 2 x 25 = 50, + 5 first insurance + 5 fee
    expect(results).toEqual([{ premium: 60 }]);
  });

  test('three alike components form a block at a special base premium', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        },
      ],
    });

    // block base 60, + 6 first insurance + 5 fee
    expect(results).toEqual([{ premium: 71 }]);
  });

  test('four alike components form no block — a block is exactly three', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: componentsOfType('rune', 4) }],
    });

    // base 4 x 25 = 100, + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  test('seven alike components form no block either', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: componentsOfType('rune', 7) }],
    });

    // base 7 x 25 = 175, + 17.5 first insurance + 5 fee = 197.5, rounded up
    expect(results).toEqual([{ premium: 198 }]);
  });

  test('components of different types do not form a block together', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [...componentsOfType('rune', 2), { type: 'moonstone' }],
        },
      ],
    });

    // base 3 x 25 = 75, + 7.5 first insurance + 5 fee = 87.5, rounded up
    expect(results).toEqual([{ premium: 88 }]);
  });

  test('each component type forms its own block', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            ...componentsOfType('rune', 3),
            ...componentsOfType('moonstone', 3),
          ],
        },
      ],
    });

    // two blocks: base 120, + 12 first insurance + 5 fee
    expect(results).toEqual([{ premium: 137 }]);
  });

  test('a cursed item carries a 50 % risk surcharge', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    // 100 base + 50 curse + 10 first insurance = 160, + 5 fee
    expect(results).toEqual([{ premium: 165 }]);
  });

  test('the curse surcharge applies to the cursed item, not the whole policy', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
            { type: 'amulet', material: 'silver', enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // policy base 160, + 50 curse (on the sword's 100) = 210,
    // + 16 first insurance (on the policy base) + 5 fee
    expect(results).toEqual([{ premium: 231 }]);
  });

  test('enchantment 5 attracts the high-enchantment surcharge', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 5, cursed: false },
          ],
        },
      ],
    });

    // 100 base + 30 high enchantment + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 145 }]);
  });

  test('enchantment 4 attracts no high-enchantment surcharge', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 4, cursed: false },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });

  test('a cursed, highly enchanted item carries both surcharges', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 5, cursed: true },
          ],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 195 }]);
  });

  test('exactly two years with MHPCO earns the loyalty discount', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 95 }]);
  });

  test('one year with MHPCO earns no loyalty discount', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });

  test('every contract after the first earns a follow-up discount', () => {
    const cursedSword = {
      type: 'sword',
      material: 'steel',
      enchantment: 7,
      cursed: true,
    };

    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [cursedSword] },
        { op: 'quote', items: [cursedSword] },
      ],
    });

    // second contract: 100 base + 50 curse + 30 high enchantment
    //   - 20 loyalty + 10 first insurance - 15 follow-up = 155, + 5 fee
    expect(results[1]).toEqual({ premium: 160 });
  });
});

const PLAIN_SWORD = {
  type: 'sword',
  material: 'steel',
  enchantment: 3,
  cursed: false,
};

describe('claim', () => {
  test('damage without a special clause is reimbursed less the deductible', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [PLAIN_SWORD] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 500 }],
          },
        },
      ],
    });

    // 500 damage - 100 deductible; cap 2 x 1000 insurance sum
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('damage to a component is reimbursed less the deductible', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'rune', amount: 200 }],
          },
        },
      ],
    });

    // 200 damage - 100 deductible; cap 2 x 250
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  test('the deductible applies once per damaged item', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            PLAIN_SWORD,
            { type: 'amulet', material: 'silver', enchantment: 1, cursed: false },
          ],
        },
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

    // (500 - 100) + (300 - 100); cap 2 x 1600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  test('damage to a highly enchanted item is reimbursed at 50 %', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 9, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 1000 }],
          },
        },
      ],
    });

    // 50 % of 1000 = 500, then - 100 deductible
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test.each([
    ['below the enchantment threshold', 5, 800, 700],
    ['at the enchantment threshold', 8, 1000, 400],
    ['above the enchantment threshold', 9, 1000, 400],
  ])(
    'dragon material is fully reimbursed unless the 50 %% clause applies (%s)',
    (_case, enchantment, amount, payout) => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [
              { type: 'sword', material: 'dragon', enchantment, cursed: false },
            ],
          },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon attack',
              damages: [{ itemType: 'sword', amount }],
            },
          },
        ],
      });

      expect(results[1]).toEqual({ payout, remainingCap: 2000 - payout });
    },
  );

  test('payouts are capped at twice the insurance sum across claims', () => {
    const claimOf1500 = {
      op: 'claim' as const,
      policy: 0,
      incident: {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 1500 }],
      },
    };

    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [PLAIN_SWORD] },
        claimOf1500,
        claimOf1500,
      ],
    });

    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  test('the block discount does not reduce the insurance sum', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [PLAIN_SWORD, ...componentsOfType('rune', 3)],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 200 }],
          },
        },
      ],
    });

    // insurance sum 1000 + 3 x 250 = 1750, cap 3500, minus 100 payout
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  test('two items of the same type are insured and damaged separately', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [PLAIN_SWORD, PLAIN_SWORD] },
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

    // insurance sum 2000, cap 4000; (500 - 100) + (300 - 100)
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  test('a payout is rounded down in the MHPCO favour', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 9, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 901 }],
          },
        },
      ],
    });

    // 50 % of 901 = 450.5, - 100 deductible = 350.5, rounded down
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
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

  test('a claim for an item not covered by the policy is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [PLAIN_SWORD] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'amulet', amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });

  test('a claim for more items of a type than are insured is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [PLAIN_SWORD] },
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

  test('a claim with a negative damage amount is rejected', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [PLAIN_SWORD] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'sword', amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(/-200/);
  });
});
