import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

describe('claim', () => {
  it('lets the high-enchantment reimbursement clause override dragon material', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'dragon', enchantment: 9 },
          { type: 'amulet', material: 'dragon', enchantment: 5 },
          { type: 'staff', material: 'steel', enchantment: 9 },
        ] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
          { itemType: 'sword', amount: 1000 },
          { itemType: 'amulet', amount: 800 },
          { itemType: 'staff', amount: 1000 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 341 }, { payout: 1500, remainingCap: 3300 }] });
  });

  it('reimburses standard damage after a per-event deductible', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fall', damages: [
          { itemType: 'sword', amount: 500 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
});

describe('validation', () => {
  it('rejects damage entries beyond the policy item multiplicity', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
          { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 },
        ] } },
      ],
    })).toThrow(/not covered/i);
  });

  it('rejects negative damage amounts', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fall', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    })).toThrow(/negative damage/i);
  });

  it('rejects an unknown item in a quote', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow(/unknown item type/i);
  });
});

describe('quote', () => {
  it('stacks item and policy modifiers in their proper scopes', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', cursed: true, enchantment: 3 }, { type: 'amulet' },
      ] }],
    })).toEqual({ results: [{ premium: 231 }] });

    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });

  it('discounts only groups of exactly three alike components', () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: 'rune' }));
    const premiumFor = (items: Array<{ type: string }>) => processScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }],
    }).results[0].premium;
    expect([
      premiumFor(runes(2)), premiumFor(runes(3)), premiumFor(runes(4)), premiumFor(runes(7)),
      premiumFor([...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))]),
    ]).toEqual([60, 71, 115, 198, 137]);
  });

  it('uses the price list for main items', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'amulet' }, { type: 'staff' }, { type: 'potion' },
      ] }],
    })).toEqual({ results: [{ premium: 203 }] });
  });

  it('charges the sword base premium, initial assessment, and fee', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 115 }] });
  });

  it('charges only the processing fee for an empty policy', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });
});
