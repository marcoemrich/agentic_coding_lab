import { describe, expect, it } from 'vitest';
import { processScenario } from './office.js';

describe('quotes', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });

  it('quotes the sword base premium plus first-insurance surcharge and fee', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 115 }] });
  });

  it('uses the price list for every item and component type', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'amulet' }, { type: 'staff' }, { type: 'potion' },
        { type: 'rune' }, { type: 'moonstone' },
      ] }],
    })).toEqual({ results: [{ premium: 258 }] });
  });

  it('discounts exactly three alike components as a building block', () => {
    const premiumFor = (types: string[]) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: types.map(type => ({ type })) }],
    }).results[0];

    expect(premiumFor(['rune', 'rune'])).toEqual({ premium: 60 });
    expect(premiumFor(['rune', 'rune', 'rune'])).toEqual({ premium: 71 });
    expect(premiumFor(['rune', 'rune', 'rune', 'rune'])).toEqual({ premium: 115 });
    expect(premiumFor(Array(7).fill('rune'))).toEqual({ premium: 198 });
    expect(premiumFor([...Array(3).fill('rune'), ...Array(3).fill('moonstone')]))
      .toEqual({ premium: 137 });
  });

  it('applies curse and enchantment surcharges only to affected items', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', cursed: true, enchantment: 5 },
        { type: 'amulet', cursed: false, enchantment: 4 },
      ] }],
    })).toEqual({ results: [{ premium: 261 }] });
  });

  it('rejects an unknown item type', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow(/unknown item type/i);
  });

  it('applies loyalty and follow-up discounts to the policy base', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
});

describe('claims', () => {
  it('reimburses standard damage with a deductible and reports the remaining cap', () => {
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

  it('rejects damage to items beyond the policy coverage', () => {
    for (const damages of [
      [{ itemType: 'amulet', amount: 200 }],
      [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }],
    ]) {
      expect(() => processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages } },
        ],
      })).toThrow(/not covered/i);
    }
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

  it('applies a separate deductible to every damaged item', () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
          { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
        ] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('halves high-enchantment damage even for dragon material', () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'staff', material: 'dragon', enchantment: 9 },
          { type: 'sword', material: 'dragon', enchantment: 5 },
          { type: 'amulet', material: 'steel', enchantment: 9 },
        ] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
          { itemType: 'staff', amount: 1000 },
          { itemType: 'sword', amount: 800 },
          { itemType: 'amulet', amount: 1000 },
        ] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 1500, remainingCap: 3300 });
  });

  it('tracks duplicate insured items and their damages separately', () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
          { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
        ] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('rounds fractional payouts down only after calculation', () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'curse', damages: [{ itemType: 'sword', amount: 901 }],
        } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('exhausts the insurance-value cap across successive claims', () => {
    const claim = { op: 'claim' as const, policy: 0, incident: {
      cause: 'battle', damages: [{ itemType: 'sword', amount: 1500 }],
    } };
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }] }, claim, claim],
    }).results).toEqual([
      { premium: 165 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});
