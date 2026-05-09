import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('processes the schema example: quote then claim', () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote' as const,
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim' as const,
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    };
    const out = runScenario(input);
    expect(out.results).toHaveLength(2);
    expect(typeof out.results[0].premium).toBe('number');
    expect(typeof out.results[1].payout).toBe('number');
    expect(typeof out.results[1].remainingCap).toBe('number');
  });

  it('newcomer cursed sword premium = 165', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote' as const,
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
      ],
    };
    const out = runScenario(input);
    expect(out.results[0].premium).toBe(165);
  });

  it('long-standing customer second contract premium = 160', () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: 'quote' as const,
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        },
        {
          op: 'quote' as const,
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    };
    const out = runScenario(input);
    expect(out.results[1].premium).toBe(160);
  });

  it('claim references prior policy index', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote' as const,
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    };
    const out = runScenario(input);
    expect(out.results[1].payout).toBe(1400);
    expect(out.results[1].remainingCap).toBe(600);
    expect(out.results[2].payout).toBe(600);
    expect(out.results[2].remainingCap).toBe(0);
  });

  it('throws for unknown item type in quote', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote' as const,
          items: [{ type: 'broomstick', material: 'wood', enchantment: 0, cursed: false }],
        },
      ],
    };
    expect(() => runScenario(input)).toThrow();
  });

  it('empty items returns 5 G premium', () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote' as const, items: [] }],
    };
    const out = runScenario(input);
    expect(out.results[0].premium).toBe(5);
  });
});
