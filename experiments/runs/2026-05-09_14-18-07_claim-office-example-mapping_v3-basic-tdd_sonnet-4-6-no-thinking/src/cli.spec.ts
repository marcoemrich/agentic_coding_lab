import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario - quote', () => {
  it('schema example: amulet for 5-year customer → premium computed correctly', () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
          ]
        }
      ]
    };
    const result = runScenario(input);
    // amulet base = 60, loyalty (5yrs) = -12, firstInsurance = +6, fee = 5
    // policy base = 60, loyalty discount = -12, firstInsurance surcharge = +6
    // = 60 - 12 + 6 = 54 + 5 = 59
    // But wait: first contract (first call) so isFirstContract = true
    // Also: "each item in a quote is treated as first insurance" AND follow-up for non-first-contract
    // For first step: isFirstContract = true (no previous quote)
    // no follow-up discount
    // loyalty: 5 >= 2 years → -20% = -12
    // firstInsurance: +10% = +6
    // total = 60 - 12 + 6 + 5 = 59
    expect(result.results[0]).toEqual({ premium: 59 });
  });

  it('schema example: claim after amulet quote', () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
          ]
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'amulet', amount: 200 }
            ]
          }
        }
      ]
    };
    const result = runScenario(input);
    // payout = 200 - 100 = 100, cap = 600*2 = 1200, remainingCap = 1100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('two successive quotes: second is a follow-up contract', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
        }
      ]
    };
    const result = runScenario(input);
    // First: 100 + 10 + 5 = 115
    // Second: 100 + 10 - 15 + 5 = 100
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  it('cap is based on unmodified insurance sum, not premium modifiers', () => {
    // cursed sword: insurance value 1000, cap should be 2000
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }]
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 2500 }]
          }
        }
      ]
    };
    const result = runScenario(input);
    // payout = min(2500-100, 2000) = min(2400, 2000) = 2000
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  it('sword + 3 runes policy: insurance sum = 1000 + 3*250 = 1750, cap = 3500', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'rune' },
            { type: 'rune' },
            { type: 'rune' }
          ]
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [{ itemType: 'sword', amount: 1000 }]
          }
        }
      ]
    };
    const result = runScenario(input);
    // cap = 1750*2 = 3500
    // payout = 1000 - 100 = 900, remainingCap = 3500 - 900 = 2600
    expect(result.results[1]).toEqual({ payout: 900, remainingCap: 2600 });
  });

  it('unknown item type in quote → throws error', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'broomstick' }]
        }
      ]
    };
    expect(() => runScenario(input)).toThrow();
  });

  it('negative damage amount in claim → throws error', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: -200 }]
          }
        }
      ]
    };
    expect(() => runScenario(input)).toThrow();
  });
});
