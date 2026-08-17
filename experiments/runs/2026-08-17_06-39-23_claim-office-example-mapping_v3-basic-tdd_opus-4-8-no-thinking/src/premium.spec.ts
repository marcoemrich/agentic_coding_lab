import { describe, it, expect } from 'vitest';
import { computePremium, roundPremium } from './premium.js';
import type { Customer, Item } from './types.js';

const newCustomer: Customer = { yearsWithMHPCO: 0 };

function quote(items: Item[], customer: Customer, contractIndex = 0): number {
  return computePremium(items, customer, contractIndex);
}

describe('base premiums for main items', () => {
  it('empty item list → 5 G (only processing fee)', () => {
    expect(quote([], newCustomer)).toBe(5);
  });

  it('plain sword for newcomer: 100 base + 10 first insurance + 5 fee = 115', () => {
    expect(quote([{ type: 'sword' }], newCustomer)).toBe(115);
  });
});

describe('component building blocks', () => {
  // For a newcomer with a single first-contract quote the full formula is:
  //   total = ceil( base + base*0.10 (first insurance) ) + 5 (fee)
  // Expected integers are computed by hand to avoid FP artifacts.
  it('2 runes → base 50 → premium 60', () => {
    // 50 + 5 + 5 = 60
    expect(quote([{ type: 'rune' }, { type: 'rune' }], newCustomer)).toBe(60);
  });

  it('3 runes → base 60 (block applies) → premium 71', () => {
    // 60 + 6 + 5 = 71
    expect(
      quote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }], newCustomer),
    ).toBe(71);
  });

  it('4 runes → base 100 (no block) → premium 115', () => {
    // 100 + 10 + 5 = 115
    expect(
      quote(
        [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        newCustomer,
      ),
    ).toBe(115);
  });

  it('7 runes → base 175 → premium 198', () => {
    // 175 + 17.5 + 5 = 197.5 → ceil 198
    const runes = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    expect(quote(runes, newCustomer)).toBe(198);
  });

  it('2 runes + 1 moonstone → base 75 (no block: different types) → premium 88', () => {
    // 75 + 7.5 + 5 = 87.5 → ceil 88
    expect(
      quote(
        [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        newCustomer,
      ),
    ).toBe(88);
  });

  it('3 runes + 3 moonstones → base 120 (two separate blocks) → premium 137', () => {
    // 120 + 12 + 5 = 137
    const items = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'moonstone' },
      { type: 'moonstone' },
      { type: 'moonstone' },
    ];
    expect(quote(items, newCustomer)).toBe(137);
  });
});

describe('modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet: base 160, +50 curse → 210 before further modifiers', () => {
    // newcomer, first insurance +10% of policy base (160)=16, fee 5
    // (160 + 50)*1.1 + 5 ... wait: policy modifiers apply to policy base 160.
    // item surcharge (curse 50) is added to the running total, policy modifiers
    // are % of policy base. Order: base + item surcharges +/- policy% + fee.
    // = 160 + 50 (curse) + 16 (first insurance 10% of 160) + 5 = 231
    const items: Item[] = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    expect(quote(items, newCustomer)).toBe(231);
  });
});

describe('integration examples', () => {
  it('newcomer with a cursed sword (steel, ench 3) → 165', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
    ];
    expect(quote(items, { yearsWithMHPCO: 0 })).toBe(165);
  });

  it("long-standing customer's second contract → 160", () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
    ];
    // 3 years (loyalty), contractIndex 1 (follow-up)
    expect(quote(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });
});

describe('modifier thresholds', () => {
  it('exactly 2 years → loyalty discount applies', () => {
    // sword base 100; loyalty -20% of 100 = 20; first insurance +10 = 10; fee 5
    // 100 - 20 + 10 + 5 = 95
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 2 })).toBe(95);
  });

  it('sword with exactly enchantment 5 → high-enchantment surcharge applies', () => {
    // 100 base + 30 high-ench + 10 first insurance + 5 = 145
    expect(
      quote([{ type: 'sword', enchantment: 5 }], newCustomer),
    ).toBe(145);
  });

  it('sword with enchantment 4 → no high-enchantment surcharge', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }], newCustomer)).toBe(115);
  });

  it('enchantment 5 and cursed → both surcharges apply', () => {
    // 100 + 50 curse + 30 high-ench + 10 first + 5 = 195
    expect(
      quote([{ type: 'sword', enchantment: 5, cursed: true }], newCustomer),
    ).toBe(195);
  });
});

describe('rounding in MHPCO favor', () => {
  it('premium that yields 197.5 → 198 (rounded up)', () => {
    expect(roundPremium(197.5)).toBe(198);
  });

  it('premium that yields 197.1 → 198 (rounded up)', () => {
    expect(roundPremium(197.1)).toBe(198);
  });

  it('already-integer premium is unchanged', () => {
    expect(roundPremium(200)).toBe(200);
  });
});
