import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office';

describe('claim office', () => {
  it('quotes a sword at its base premium plus first insurance and fee', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 115 }] });
  });

  it.each([
    [[], 5],
    [[{ type: 'amulet' }], 71],
    [[{ type: 'staff' }], 93],
    [[{ type: 'potion' }], 49],
    [[{ type: 'rune' }], 33],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 71],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 115],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }], 88],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }], 137],
  ])('prices items and exact blocks of three alike components', (items, premium) => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }] }))
      .toEqual({ results: [{ premium }] });
  });

  it('stacks item and policy modifiers at their thresholds across contracts', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{
      op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }],
    }] })).toEqual({ results: [{ premium: 231 }] });

    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 5 }] },
    ] })).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  it('processes standard item and component damage with one deductible each', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });

    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'rune' }] },
      { op: 'claim', policy: 0, incident: { cause: 'crack', damages: [{ itemType: 'rune', amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });

  it('applies the high-enchantment reimbursement before the deductible, overriding dragon material', () => {
    const claimFor = (material: string, enchantment: number, amount: number) => processScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword', material, enchantment }] },
        { op: 'claim', policy: 0, incident: { cause: 'battle', damages: [{ itemType: 'sword', amount }] } },
      ],
    }).results[1];
    expect(claimFor('dragon', 8, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claimFor('dragon', 5, 800)).toEqual({ payout: 700, remainingCap: 1300 });
    expect(claimFor('steel', 9, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('rejects unknown or uninsured items, excess duplicate damages, and negative damage', () => {
    const scenario = (damages: Array<{ itemType: string; amount: number }>) => ({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'claim' as const, policy: 0, incident: { cause: 'mishap', damages } },
      ],
    });
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'broomstick' }] },
    ] })).toThrow(/unknown item/i);
    expect(() => processScenario(scenario([{ itemType: 'amulet', amount: 200 }]))).toThrow(/uninsured/i);
    expect(() => processScenario(scenario([{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }]))).toThrow(/uninsured/i);
    expect(() => processScenario(scenario([{ itemType: 'sword', amount: -200 }]))).toThrow(/negative/i);
  });
});
