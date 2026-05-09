import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('schema example: quote then claim', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(result.results.length).toBe(2);
    expect('premium' in result.results[0]).toBe(true);
    expect('payout' in result.results[1]).toBe(true);
    expect('remainingCap' in result.results[1]).toBe(true);
  });

  it('first quote always uses first-insurance, second is follow-up', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    // For a customer with yearsWithMHPCO 0 and follow-up, sword cursed ench 7:
    // base 100, +50 cursed, +30 high ench, +10 first ins (10%), -15 follow-up
    // = 100 + 50 + 30 + 10 - 15 + 5 fee = 180
    expect(result.results[1]).toEqual({ premium: 180 });
  });

  it('long-standing customer second contract integration example', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('claim references unknown policy index → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 0,
            incident: { damages: [{ itemType: 'sword', amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('unknown item type in quote → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' as any }] }],
      }),
    ).toThrow();
  });
});
