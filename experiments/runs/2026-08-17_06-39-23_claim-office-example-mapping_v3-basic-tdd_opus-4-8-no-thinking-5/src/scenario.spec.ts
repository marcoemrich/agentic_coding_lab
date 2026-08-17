import { describe, it, expect } from 'vitest';
import { runScenario, type Scenario } from './scenario';

describe('scenario orchestration', () => {
  it('schema example: quote then claim', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    };
    const results = runScenario(scenario);
    expect(results).toHaveLength(2);
    // amulet base 60; loyalty -20% (=-12), first +10% (=+6) => 60 -12 +6 = 54 +5 = 59
    expect(results[0]).toEqual({ premium: 59 });
    // amulet damage 200 -> 200-100 = 100; cap = 2*600 = 1200 -> remaining 1100
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('follow-up contract discount applies to the second quote', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', enchantment: 7, cursed: true }] },
      ],
    };
    const results = runScenario(scenario);
    // second quote matches the integration example → 160
    expect(results[1]).toEqual({ premium: 160 });
  });

  it('successive claims consume the cap', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    };
    const results = runScenario(scenario);
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});
