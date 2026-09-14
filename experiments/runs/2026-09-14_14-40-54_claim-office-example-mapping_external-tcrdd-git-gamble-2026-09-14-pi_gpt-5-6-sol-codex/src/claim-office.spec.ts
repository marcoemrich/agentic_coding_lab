import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

describe('quotes', () => {
  it('rejects unknown item types', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow('Unknown item type: broomstick');
  });

  it('quotes a plain sword from the price list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 115 }] });
  });

  it('quotes other main items from the price list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'amulet' }, { type: 'staff' }, { type: 'potion' },
      ] }],
    })).toEqual({ results: [{ premium: 203 }] });
  });

  it('stacks the high-enchantment surcharge at level five', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', cursed: true, enchantment: 5 },
      ] }],
    })).toEqual({ results: [{ premium: 195 }] });
  });

  it('applies a curse surcharge only to the affected item', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', cursed: true }, { type: 'amulet', cursed: false },
      ] }],
    })).toEqual({ results: [{ premium: 231 }] });
  });

  it('rewards loyal customers and follow-up contracts', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: 'quote', items: [{ type: 'potion' }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });

  it('uses a block premium only for exactly three alike components', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
        { op: 'quote', items: [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        ] },
        { op: 'quote', items: [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
        ] },
      ],
    })).toEqual({ results: [
      { premium: 71 }, { premium: 100 }, { premium: 119 },
    ] });
  });
});

describe('claims', () => {
  it('rejects claims that do not reference an earlier quote', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 4, incident: { cause: 'fire', damages: [] } }],
    })).toThrow('Policy does not reference an earlier quote: 4');
  });

  it('rejects invalid damage entries', () => {
    const scenario = (damages: Array<{ itemType: string; amount: number }>) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages } },
      ],
    });
    expect(() => processScenario(scenario([{ itemType: 'amulet', amount: 200 }])))
      .toThrow('Damage item is not covered: amulet');
    expect(() => processScenario(scenario([{ itemType: 'sword', amount: -200 }])))
      .toThrow('Damage amount must not be negative');
    expect(() => processScenario(scenario([
      { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 },
    ]))).toThrow('Damage item is not covered: sword');
  });

  it('halves damage to a highly enchanted item even when it is dragon-made', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'battle', damages: [{ itemType: 'sword', amount: 1000 }],
        } },
      ],
    })).toEqual({ results: [
      { premium: 145 }, { payout: 400, remainingCap: 1600 },
    ] });
  });

  it('matches repeated damages to distinct insured items of the same type', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', enchantment: 9 }, { type: 'sword', enchantment: 3 },
        ] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon attack', damages: [
            { itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 },
          ],
        } },
      ],
    })).toEqual({ results: [
      { premium: 255 }, { payout: 1300, remainingCap: 2700 },
    ] });
  });

  it('reimburses ordinary damage after one deductible', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }],
        } },
      ],
    })).toEqual({ results: [
      { premium: 115 }, { payout: 400, remainingCap: 1600 },
    ] });
  });
});
