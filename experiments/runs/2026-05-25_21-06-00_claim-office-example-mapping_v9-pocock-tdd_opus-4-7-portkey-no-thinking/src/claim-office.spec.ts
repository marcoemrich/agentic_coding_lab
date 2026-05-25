import { describe, it, expect } from 'vitest';
import { runScenario } from './claim-office.js';

describe('quote: edge cases', () => {
  it('empty item list → premium 5 G (only processing fee)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
});

describe('quote: single item base premium', () => {
  it('plain sword for newcomer → 115 G (100 base + 10 first-ins + 5 fee)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
});

describe('quote: item-specific modifiers', () => {
  it('cursed sword for newcomer → 165 G (100 + 50 curse + 10 first-ins + 5 fee)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  it('sword enchantment 5 (newcomer) → 145 G (100 + 30 high-ench + 10 first-ins + 5 fee)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });

  it('sword enchantment 4 (newcomer) → 115 G (no high-ench surcharge)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
});

describe('quote: policy-wide modifiers', () => {
  it('plain sword, customer with exactly 2 years → 95 G (100 - 20 loyalty + 10 first-ins + 5 fee)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });

  it('newcomer 3 runes → 71 G (60 base + 6 first-ins + 5 fee, block applies)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });

  it('newcomer 4 runes → 115 G (100 base + 10 first-ins + 5 fee, no block)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  it('newcomer 7 runes → 198 G (175 base [2 blocks + 1 single] + 17.5 first-ins + 5 fee = 197.5, round up)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: Array.from({ length: 7 }, () => ({ type: 'rune' })),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  it('newcomer 2 runes + 1 moonstone → 88 G (75 base + 7.5 first-ins + 5 fee = 87.5, round up)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });

  it('newcomer 3 runes + 3 moonstones → 137 G (120 base [two blocks] + 12 first-ins + 5 fee)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
            { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  it('multi-item: cursed sword + plain amulet (newcomer) → 231 G (160 base + 50 curse + 16 first-ins + 5 fee)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  it('claim: standard sword reimbursement (500 damage → 400 payout, cap 2000 → 1600)', () => {
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

  it('claim: high enchantment ≥8 reimburses 50% then deductible', () => {
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
          incident: { cause: 'blast', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('claim: dragon material, enchant 5, dmg 800 → payout 700 (full minus deductible)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fall', damages: [{ itemType: 'sword', amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  it('claim: dragon + enchant 9 → 50% rule wins, dmg 1000 → payout 400', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'storm', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('claim: dragon + enchant exactly 8, dmg 1000 → payout 400 (50% rule applies, then deductible)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'storm', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('claim: deductible applies per damage event (sword 500 + amulet 300 → 600)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 2, cursed: false },
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'amulet', amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('claim: cap exhausts across successive claims (sword, 2x dmg 1500)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('claim: two swords each damaged 500 → payout 800 (deductible per entry)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 2, cursed: false },
            { type: 'sword', material: 'steel', enchantment: 2, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('claim: more damages of a type than insured → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [{ type: 'sword', material: 'steel', enchantment: 2, cursed: false }],
          },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'sword', amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  it('claim: damage of item not in policy → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 2, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('claim: negative damage amount → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 2, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('claim: rune damage 200 → payout 100, cap 500 → 400', () => {
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

  it('quote: unknown item type throws an error', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick|unknown/i);
  });

  it('rounding: 1 rune newcomer → 33 G (25 + 2.5 + 5 = 32.5, round up)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  it('integration: long-standing 2nd contract, cursed enchant-7 sword → 160 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 1, cursed: false }],
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('second quote applies 15% follow-up discount; newcomer plain sword: q1=115, q2=100', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });
});
