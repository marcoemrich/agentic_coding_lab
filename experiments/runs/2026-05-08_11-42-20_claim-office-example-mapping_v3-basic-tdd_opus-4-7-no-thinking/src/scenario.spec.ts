import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario - quote then claim', () => {
  it('amulet quote + amulet claim', () => {
    const r = runScenario({
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
    // amulet 60 base, 5 years (loyalty -12), first +6, contract 0 -> 54+5 = 59
    // 60 - 12 + 6 = 54 + 5 fee = 59
    expect(r.results[0]).toEqual({ premium: 59 });
    // claim: amulet damage 200 -> 100 payout (200-100), cap 1200 -> remaining 1100
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});

describe('runScenario - errors', () => {
  it('unknown item type throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' as 'sword' }] }],
    })).toThrow();
  });

  it('claim referencing item not in policy throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
        { op: 'claim', policy: 0, incident: { damages: [{ itemType: 'amulet', amount: 100 }] } },
      ],
    })).toThrow();
  });
});

describe('runScenario - integration examples', () => {
  it('newcomer with cursed sword -> 165', () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
      ],
    });
    expect(r.results[0]).toEqual({ premium: 165 });
  });

  it('long-standing customer second contract -> 160', () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // first quote (some quote, doesn't matter for our purposes)
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 1, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(r.results[1]).toEqual({ premium: 160 });
  });
});

describe('runScenario - empty', () => {
  it('empty items -> premium 5', () => {
    const r = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(r.results[0]).toEqual({ premium: 5 });
  });
});
