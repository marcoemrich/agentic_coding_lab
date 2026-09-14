import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

describe('quotes', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });

  it('quotes a new customer for a plain sword', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 115 }] });
  });

  it('uses the price list for every item type', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'amulet' }, { type: 'staff' }, { type: 'potion' },
        { type: 'rune' }, { type: 'moonstone' },
      ] }],
    })).toEqual({ results: [{ premium: 258 }] });
  });

  it('prices exactly three alike components as a block', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
      ] }],
    })).toEqual({ results: [{ premium: 137 }] });
  });

  it('adds the curse surcharge only to the cursed item', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', cursed: true }, { type: 'amulet' },
      ] }],
    })).toEqual({ results: [{ premium: 231 }] });
  });

  it('stacks curse and high-enchantment surcharges at level five', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 5 }] }],
    })).toEqual({ results: [{ premium: 195 }] });
  });

  it('applies loyalty from exactly two years', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 95 }] });
  });

  it('discounts contracts after the first while retaining item assessment', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });

  it('rejects unknown quoted item types', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow(/unknown item type/i);
  });
});

describe('claims', () => {
  it('fully reimburses ordinary damage after one deductible', () => {
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

  it('halves damage at enchantment eight even for dragon material', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'curse', damages: [{ itemType: 'sword', amount: 1000 }],
        } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  it('rejects more damages of a type than the policy covers', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'battle', damages: [
          { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 },
        ] } },
      ],
    })).toThrow(/not insured/i);
  });

  it('rejects negative damage amounts', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'mishap', damages: [{ itemType: 'rune', amount: -200 }],
        } },
      ],
    })).toThrow(/negative damage/i);
  });
});
