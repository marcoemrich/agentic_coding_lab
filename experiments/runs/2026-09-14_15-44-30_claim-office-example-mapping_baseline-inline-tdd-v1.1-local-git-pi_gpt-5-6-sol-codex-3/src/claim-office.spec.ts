import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });

describe('quotes', () => {
  it('prices each main item and the processing fee', () => {
    expect(processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }, { type: 'staff' }, { type: 'potion' }] },
    ] })).toEqual({ results: [{ premium: 313 }] });
  });

  it.each([
    [0, 5], [2, 60], [3, 71], [4, 115], [7, 198],
  ])('prices %i alike components, with a block only for exactly three', (count, premium) => {
    expect(processScenario({ customer: customer(), steps: [
      { op: 'quote', items: Array.from({ length: count }, () => ({ type: 'rune' as const })) },
    ] })).toEqual({ results: [{ premium }] });
  });

  it('groups component blocks by exact component type', () => {
    expect(processScenario({ customer: customer(), steps: [{ op: 'quote', items: [
      ...Array.from({ length: 3 }, () => ({ type: 'rune' as const })),
      ...Array.from({ length: 3 }, () => ({ type: 'moonstone' as const })),
    ] }] })).toEqual({ results: [{ premium: 137 }] });
  });

  it('applies item risks only to affected item base, and policy modifiers to base', () => {
    expect(processScenario({ customer: customer(), steps: [{ op: 'quote', items: [
      { type: 'sword', cursed: true }, { type: 'amulet' },
    ] }] })).toEqual({ results: [{ premium: 231 }] });
  });

  it('applies enchantment at five and stacks it with curse', () => {
    expect(processScenario({ customer: customer(), steps: [{ op: 'quote', items: [
      { type: 'sword', enchantment: 5, cursed: true },
    ] }] })).toEqual({ results: [{ premium: 195 }] });
  });

  it('applies loyalty and the follow-up discount while assessing every quote', () => {
    expect(processScenario({ customer: customer(3), steps: [
      { op: 'quote', items: [] },
      { op: 'quote', items: [{ type: 'sword', enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });

  it('rejects unknown item types', () => {
    expect(() => processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'broomstick' as 'sword' }] },
    ] })).toThrow(/unknown item type/i);
  });
});

describe('claims', () => {
  it('fully reimburses standard damage and deducts 100 per damaged item', () => {
    const output = processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }, { type: 'amulet' }] },
      { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
        { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it.each([
    [{ type: 'sword' as const, material: 'dragon', enchantment: 9 }, 1000, 400],
    [{ type: 'sword' as const, material: 'dragon', enchantment: 5 }, 800, 700],
    [{ type: 'sword' as const, material: 'steel', enchantment: 9 }, 1000, 400],
    [{ type: 'rune' as const }, 200, 100],
  ])('applies enchantment and dragon clauses before the deductible', (item, amount, payout) => {
    const output = processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [item] },
      { op: 'claim', policy: 0, incident: { cause: 'accident', damages: [{ itemType: item.type, amount }] } },
    ] });
    expect(output.results[1]).toMatchObject({ payout });
  });

  it('tracks and exhausts a cap of twice the unmodified insurance sum', () => {
    const output = processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'sword', cursed: true }] },
      { op: 'claim', policy: 0, incident: { cause: 'first', damages: [{ itemType: 'sword', amount: 1500 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'second', damages: [{ itemType: 'sword', amount: 1500 }] } },
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('counts duplicate insured items separately and rejects excess damages', () => {
    const valid = processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
        { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 300 },
      ] } },
    ] });
    expect(valid.results[1]).toEqual({ payout: 300, remainingCap: 3700 });
    expect(() => processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
        { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 300 },
      ] } },
    ] })).toThrow(/uninsured/i);
  });

  it('rounds only the final payout down', () => {
    const output = processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
      { op: 'claim', policy: 0, incident: { cause: 'accident', damages: [{ itemType: 'sword', amount: 901 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('rejects negative, unknown, uninsured, and invalid-policy damages', () => {
    const scenario = (itemType: 'sword', amount: number, policy = 0) => ({ customer: customer(), steps: [
      { op: 'quote' as const, items: [{ type: 'sword' as const }] },
      { op: 'claim' as const, policy, incident: { cause: 'accident', damages: [{ itemType, amount }] } },
    ] });
    expect(() => processScenario(scenario('sword', -200))).toThrow(/invalid damage/i);
    expect(() => processScenario(scenario('sword', 200, 7))).toThrow(/policy/i);
    expect(() => processScenario({ customer: customer(), steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'accident', damages: [{ itemType: 'amulet', amount: 20 }] } },
    ] })).toThrow(/uninsured/i);
    expect(() => processScenario(scenario('broomstick' as 'sword', 20))).toThrow(/unknown item/i);
  });
});
