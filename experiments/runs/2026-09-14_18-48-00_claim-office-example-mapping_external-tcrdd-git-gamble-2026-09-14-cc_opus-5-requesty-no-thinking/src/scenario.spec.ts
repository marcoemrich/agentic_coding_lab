import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it('quotes a plain sword with the first insurance surcharge', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it('adds a 50% risk surcharge for a cursed item', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it('adds a 30% risk surcharge at enchantment 5', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  it('applies the loyalty discount from exactly 2 years with MHPCO', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it('discounts each contract after the customer first one', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('insures components at 25 G base premium each', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  it('offers a block premium for exactly 3 alike components', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it('treats only identical component types as alike', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
});

describe('claim', () => {
  it('reimburses the damage minus the 100 G deductible', () => {
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

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('halves the damage for items with enchantment 8 or higher', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('rounds a fractional payout down', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 901 }] },
        },
      ],
    });

    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe('validation', () => {
  it('rejects a quote with an unknown item type', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick/);
  });

  it('rejects a damage for an item outside the policy', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
          },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });

  it('rejects a negative damage amount', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
          },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/negative/);
  });
});
