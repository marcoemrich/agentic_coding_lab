import { describe, expect, it } from 'vitest';
import { runScenario, type Scenario } from './scenario';

describe('worked examples from the MHPCO handbook', () => {
  it('does not let premium modifiers raise the cap', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 165 },
      { payout: 0, remainingCap: 2000 },
    ]);
  });

  it('adds the curse surcharge from the cursed item base premium only', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', cursed: true }, { type: 'amulet' }],
        },
      ],
    };
    // 160 base + 50 curse = 210; -32 loyalty + 16 first insurance + 5 fee
    expect(runScenario(scenario)).toEqual([{ premium: 199 }]);
  });

  it('keeps the insurance sum unaffected by the block discount', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword' },
            { type: 'rune' },
            { type: 'rune' },
            { type: 'rune' },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 250 }] },
        },
      ],
    };
    // base 100 + 60 = 160, +16 first insurance, +5 fee = 181; cap 2 * 1750
    expect(runScenario(scenario)).toEqual([
      { premium: 181 },
      { payout: 150, remainingCap: 3350 },
    ]);
  });
});
