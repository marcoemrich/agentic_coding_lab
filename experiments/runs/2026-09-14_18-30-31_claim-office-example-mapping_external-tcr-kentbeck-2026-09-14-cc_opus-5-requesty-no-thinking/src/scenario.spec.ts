import { describe, expect, it } from 'vitest';
import { runScenario } from './scenario.js';
import { UnknownItemError } from './premium.js';
import { ClaimError } from './claim.js';

describe('scenario runner', () => {
  it('runs a quote followed by a claim', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    // amulet 60, loyalty -12, first +6 => 54 + 5 = 59
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });

  it('treats later quotes as follow-up contracts', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  it('rejects unknown item types in a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(UnknownItemError);
  });

  it('rejects claims against a missing policy', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'claim', policy: 3, incident: { cause: 'fire', damages: [] } },
        ],
      }),
    ).toThrow(ClaimError);
  });
});

describe('worked examples', () => {
  it('keeps intermediate fractions and rounds only the final premium', () => {
    // 2 runes: base 50, high ench on both: 2 * 25 * 0.3 = 15, first insurance 5
    // = 70 + 5 fee = 75 exactly; a half-G case rounds up
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune', enchantment: 9 }, { type: 'rune', enchantment: 9 }] },
        { op: 'quote', items: [{ type: 'moonstone', cursed: true }] },
      ],
    });
    // moonstone 25 + curse 12.5 + first 2.5 - follow-up 3.75 = 36.25 + 5 = 41.25 -> 42
    expect(results).toEqual([{ premium: 75 }, { premium: 42 }]);
  });

  it('bases the cap on unmodified insurance values', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 5000 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 165 }, { payout: 2000, remainingCap: 0 }]);
  });
});
