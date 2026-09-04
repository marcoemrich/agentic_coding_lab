import { describe, test, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  test('returns one result per step, in order', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });

    // quote: 60 base - 12 loyalty + 6 first insurance = 54; +5 fee = 59
    // claim: 200 damage - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  test('each quote after the first counts as a follow-up contract', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });

    // first:  100 + 50 curse + 30 ench - 20 loyalty + 10 first insurance = 170; +5 = 175
    // second: the same minus the 15 follow-up discount = 155; +5 = 160
    expect(results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  test('a claim draws on the policy created by the referenced quote step', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });

    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  test('newcomer with a cursed sword pays 165 G', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
      ],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });

  test('a dragon attack on two insured swords deducts once per sword', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 300 },
            ],
          },
        },
      ],
    });

    // 400 + 200 = 600 payout; cap 4000 - 600 = 3400
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  test('rejects a claim that references a step which is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
        ],
      }),
    ).toThrow(/policy/i);
  });
});
