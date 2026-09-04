import { describe, expect, it } from 'vitest';
import { runScenario } from './scenario.js';

describe('claim', () => {
  it('reimburses damage in full minus the deductible when no clause applies', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
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

    // 500 damage - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  const claimOnSword = (
    sword: Record<string, unknown>,
    amount: number,
  ) =>
    runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', ...sword }] },
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

  it('reimburses damage to items of enchantment 8 or above at 50%', () => {
    // 1000 * 50% = 500 - 100 deductible = 400
    expect(
      claimOnSword({ material: 'steel', enchantment: 9 }, 1000).results[1],
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('applies the high-enchantment clause at exactly enchantment 8', () => {
    expect(
      claimOnSword({ material: 'dragon', enchantment: 8 }, 1000).results[1],
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses dragon-material damage in full below the enchantment threshold', () => {
    // full 800 - 100 deductible = 700
    expect(
      claimOnSword({ material: 'dragon', enchantment: 5 }, 800).results[1],
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });

  it('lets the 50% rule win when both clauses apply', () => {
    expect(
      claimOnSword({ material: 'dragon', enchantment: 9 }, 1000).results[1],
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('applies the deductible once per damaged item', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
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

    // (500 - 100) + (300 - 100) = 600; cap 3200 - 600 = 2600
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('caps the payout at the remaining cap across successive claims', () => {
    const claim = {
      op: 'claim' as const,
      policy: 0,
      incident: {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 1500 }],
      },
    };

    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
        claim,
        claim,
      ],
    });

    // cap 2000; first claim 1500 - 100 = 1400, leaving 600
    // second claim wants 1400 but only 600 remains
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('treats each damage entry as a separate damage when two alike items are insured', () => {
    const sword = {
      type: 'sword',
      material: 'steel',
      enchantment: 3,
      cursed: false,
    };

    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [sword, sword] },
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

    // insurance sum 2000, cap 4000
    // (500 - 100) + (300 - 100) = 600
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  it('bases the cap on insurance value, unaffected by premium modifiers', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 100 }],
          },
        },
      ],
    });

    // premium reflects the curse (165) but the cap stays 2 x 1000
    expect(output.results[0]).toEqual({ premium: 165 });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('bases the cap on insurance value, unaffected by the block discount', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: 'rune' })),
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 100 }],
          },
        },
      ],
    });

    // insurance sum 1750 (1000 + 3 x 250) despite the block premium discount
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it('rounds a fractional payout down, in the MHPCO favor', () => {
    // 901 * 50% = 450.5 - 100 deductible = 350.5 -> 350
    expect(
      claimOnSword({ material: 'steel', enchantment: 9 }, 901).results[1],
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('applies no special clause to a component', () => {
    const output = runScenario({
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

    // 200 - 100 deductible = 100; cap 500 - 100 = 400
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe('quote: component blocks', () => {
  const quoteComponents = (count: number, type = 'rune') =>
    runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: Array.from({ length: count }, () => ({ type })),
        },
      ],
    });

  it('charges 25 G per component when no block applies', () => {
    // 2 runes -> 50 base + 5 first insurance + 5 fee
    expect(quoteComponents(2)).toEqual({ results: [{ premium: 60 }] });
  });

  it('offers a block price of 60 G for exactly 3 alike components', () => {
    // 3 runes -> 60 base + 6 first insurance + 5 fee
    expect(quoteComponents(3)).toEqual({ results: [{ premium: 71 }] });
  });

  it('charges the per-component rate for 4 alike components (block needs exactly 3)', () => {
    // 4 runes -> 100 base + 10 first insurance + 5 fee
    expect(quoteComponents(4)).toEqual({ results: [{ premium: 115 }] });
  });

  it('charges the per-component rate for 7 alike components', () => {
    // 7 runes -> 175 base + 17.5 first insurance = 192.5 + 5 fee, rounded up
    expect(quoteComponents(7)).toEqual({ results: [{ premium: 198 }] });
  });

  it('forms no block from components of different types', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'rune' },
            { type: 'rune' },
            { type: 'moonstone' },
          ],
        },
      ],
    });

    // 75 base (no block: 2 runes + 1 moonstone) + 7.5 = 82.5 + 5 fee, rounded up
    expect(output).toEqual({ results: [{ premium: 88 }] });
  });

  it('forms a separate block per component type', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            ...Array.from({ length: 3 }, () => ({ type: 'rune' })),
            ...Array.from({ length: 3 }, () => ({ type: 'moonstone' })),
          ],
        },
      ],
    });

    // 120 base (two blocks of 60) + 12 first insurance + 5 fee
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });
});

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });

    expect(output).toEqual({ results: [{ premium: 5 }] });
  });

  it('charges base premium plus first-insurance surcharge and fee for a plain sword', () => {
    const output = runScenario({
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

    // 100 base + 10 first insurance = 110 + 5 fee
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });

  it('adds a 50% curse surcharge (newcomer with a cursed sword)', () => {
    const output = runScenario({
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

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });

  it('adds the high-enchantment surcharge at exactly enchantment 5', () => {
    const output = runScenario({
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

    // 100 base + 30 high enchantment + 10 first insurance = 140 + 5 fee
    expect(output).toEqual({ results: [{ premium: 145 }] });
  });

  it('does not add the high-enchantment surcharge at enchantment 4', () => {
    const output = runScenario({
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

    // 100 base + 10 first insurance = 110 + 5 fee
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });

  it("discounts every contract after the customer's first by 15%", () => {
    const cursedSword = {
      type: 'sword',
      material: 'steel',
      enchantment: 7,
      cursed: true,
    };

    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [cursedSword] },
        { op: 'quote', items: [cursedSword] },
      ],
    });

    // second quote: 100 base + 50 curse + 30 enchantment - 20 loyalty
    //               + 10 first insurance - 15 follow-up = 155 + 5 fee
    expect(output.results[1]).toEqual({ premium: 160 });
  });

  it('applies the curse surcharge only to the cursed item, not the policy total', () => {
    const output = runScenario({
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

    // policy base 160 (100 + 60); curse adds 50 (50% of the sword only) = 210
    // first insurance 16 (10% of policy base 160) = 226 + 5 fee
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });

  it('grants the loyalty discount at exactly 2 years with MHPCO', () => {
    const output = runScenario({
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

    // 100 base - 20 loyalty + 10 first insurance = 90 + 5 fee
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });

  it('grants no loyalty discount at 1 year with MHPCO', () => {
    const output = runScenario({
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

    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
});
