import { describe, expect, it } from 'vitest';
import { openPolicy } from './policy.js';
import { quotePremium } from './premium.js';

describe("rounding in the MHPCO's favor", () => {
  it('rounds a fractional premium up', () => {
    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33
    expect(quotePremium({ yearsWithMHPCO: 0 }, 0, [{ type: 'rune' }])).toBe(33);
  });

  it('rounds a fractional payout down', () => {
    // enchantment 9 halves the damage: 901 / 2 = 450.5, − 100 deductible
    // = 350.5 → 350.
    const policy = openPolicy([{ type: 'sword', enchantment: 9 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});
