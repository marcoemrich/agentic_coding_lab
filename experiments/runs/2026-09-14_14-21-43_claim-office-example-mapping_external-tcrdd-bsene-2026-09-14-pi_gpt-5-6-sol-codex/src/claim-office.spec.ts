import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office';

describe('quotes', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });

  it('uses the sword price and first-insurance surcharge', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 115 }] });
  });

  it('sums the price list for main items and components', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword' }, { type: 'amulet' }, { type: 'staff' },
        { type: 'potion' }, { type: 'rune' }, { type: 'moonstone' },
      ] }],
    })).toEqual({ results: [{ premium: 368 }] });
  });

  it('uses the special premium for exactly three alike components', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] }],
    })).toEqual({ results: [{ premium: 71 }] });
  });

  it('adds a curse surcharge to the affected item', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }] }],
    })).toEqual({ results: [{ premium: 165 }] });
  });

  it('adds a high-enchantment surcharge at level five', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 5 }] }],
    })).toEqual({ results: [{ premium: 145 }] });
  });

  it('grants the loyalty discount at exactly two years', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 95 }] });
  });

  it('discounts each contract after the first while retaining item initial assessment', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });

  it('rejects an unknown item type', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow(/unknown item type/i);
  });
});

describe('claims', () => {
  it('reimburses ordinary damage after one deductible and tracks the cap', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }],
        } },
      ],
    })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });

  it('halves damage before the deductible at enchantment level eight', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'crack', damages: [{ itemType: 'sword', amount: 1000 }],
        } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  it('rejects damage to an item absent from the policy', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'theft', damages: [{ itemType: 'amulet', amount: 200 }],
        } },
      ],
    })).toThrow(/not insured/i);
  });

  it('rejects more damage entries than insured items of that type', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon attack', damages: [
            { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 },
          ],
        } },
      ],
    })).toThrow(/more damages than insured/i);
  });

  it('rejects a negative damage amount', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'crack', damages: [{ itemType: 'rune', amount: -200 }],
        } },
      ],
    })).toThrow(/negative damage/i);
  });
});

describe('rule examples', () => {
  it.each([
    [[{ type: 'rune' }, { type: 'rune' }], 60],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 71],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 115],
    [[...Array.from({ length: 7 }, () => ({ type: 'rune' }))], 198],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }], 88],
    [[
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ], 137],
  ] as const)('prices component grouping %#', (items, premium) => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [...items] }],
    })).toEqual({ results: [{ premium }] });
  });

  it('scopes item modifiers and combines exact thresholds', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 5 }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 4 }] },
      ],
    })).toEqual({ results: [{ premium: 231 }, { premium: 180 }, { premium: 150 }] });
  });

  it('applies a deductible to every damaged item', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
          { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
        ] } },
      ],
    }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('lets the high-enchantment clause win over dragon material', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'crack', damages: [{ itemType: 'sword', amount: 1000 }],
        } },
      ],
    }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('fully reimburses dragon material below the claim enchantment threshold', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'crack', damages: [{ itemType: 'sword', amount: 800 }],
        } },
      ],
    }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  it('exhausts the policy cap across successive claims', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'flood', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    })).toEqual({ results: [
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ] });
  });

  it('bases the cap on unmodified item values including every component', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', cursed: true }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        ] },
        { op: 'claim', policy: 0, incident: { cause: 'inspection', damages: [] } },
      ],
    }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it('rounds fractional payout down only after calculation', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'crack', damages: [{ itemType: 'sword', amount: 901 }],
        } },
      ],
    }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe('repeated insured types', () => {
  it('insures and independently deducts damage to each repeated item', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
          { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 },
        ] } },
      ],
    })).toEqual({ results: [
      { premium: 225 },
      { payout: 600, remainingCap: 3400 },
    ] });
  });
});
