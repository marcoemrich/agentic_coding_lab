import { describe, it, expect } from 'vitest';
import { computePremium, UnknownItemTypeError, type Item } from './premium';

const newCustomer = { customer: { yearsWithMHPCO: 0 }, priorContracts: 0 };

function quote(items: Item[], ctx = newCustomer): number {
  return computePremium(items, ctx);
}

describe('base premiums for main items', () => {
  it('empty item list → 5 G (only processing fee)', () => {
    // first insurance +10% of 0 base = 0, so just the fee
    expect(quote([])).toBe(5);
  });

  it('single sword', () => {
    // base 100 + first insurance 10 + fee 5 = 115
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('single amulet', () => {
    // 60 + 6 + 5 = 71
    expect(quote([{ type: 'amulet' }])).toBe(71);
  });

  it('single staff', () => {
    // 80 + 8 + 5 = 93
    expect(quote([{ type: 'staff' }])).toBe(93);
  });

  it('single potion', () => {
    // 40 + 4 + 5 = 49
    expect(quote([{ type: 'potion' }])).toBe(49);
  });
});

describe('component blocks (base premiums)', () => {
  // These verify the base-premium arithmetic; premium here also has the
  // first-insurance +10% applied. We isolate base via a helper below.
  function baseOf(items: Item[]): number {
    // premium = ceil(base * 1.1 + 5); recover base by construction.
    // Instead, assert full premium values computed by hand.
    return quote(items);
  }

  it('2 runes → 50 base', () => {
    // 50 * 1.1 + 5 = 60
    expect(baseOf([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('3 runes → 60 base (block applies)', () => {
    // 60 * 1.1 + 5 = 71
    expect(
      baseOf([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(71);
  });

  it('4 runes → 100 base (no block, block requires exactly 3 per block)', () => {
    // 100 * 1.1 + 5 = 115
    expect(
      baseOf([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
      ]),
    ).toBe(115);
  });

  it('7 runes → 175 base (no block: only an exact group of 3 discounts)', () => {
    const items = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    // 175 * 1.1 + 5 = 197.5 -> ceil 198
    expect(baseOf(items)).toBe(198);
  });

  it('2 runes + 1 moonstone → 75 base (no block: different types)', () => {
    // 75 * 1.1 + 5 = 87.5 -> 88
    expect(
      baseOf([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }]),
    ).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 base (two separate blocks)', () => {
    // 120 * 1.1 + 5 = 137
    const items = [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'moonstone' },
      { type: 'moonstone' },
      { type: 'moonstone' },
    ];
    expect(baseOf(items)).toBe(137);
  });
});

describe('unknown item type', () => {
  it('throws UnknownItemTypeError', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(UnknownItemTypeError);
  });
});

describe('integration examples', () => {
  it('newcomer with a cursed sword → 165 G', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
    ];
    expect(
      computePremium(items, { customer: { yearsWithMHPCO: 0 }, priorContracts: 0 }),
    ).toBe(165);
  });

  it("long-standing customer's second contract → 160 G", () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
    ];
    expect(
      computePremium(items, { customer: { yearsWithMHPCO: 3 }, priorContracts: 1 }),
    ).toBe(160);
  });
});

describe('modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet, curse applies to sword base only', () => {
    // policy base 160; curse adds 50 (50% of sword 100) => 210 before further
    // modifiers and fee. Newcomer: +10% first insurance of policy base 160 = 16.
    // total = 160 + 50 + 16 + 5 = 231
    const items: Item[] = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    expect(quote(items)).toBe(231);
  });
});

describe('modifier thresholds', () => {
  it('exactly enchantment 5 → high-enchantment surcharge applies', () => {
    // sword base 100 + 30 high-ench + 10 first + 5 = 145
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('enchantment 4 → no high-enchantment surcharge', () => {
    // 100 + 10 + 5 = 115
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('enchantment 5 and cursed → both surcharges', () => {
    // 100 + 50 curse + 30 ench + 10 first + 5 = 195
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });

  it('exactly 2 years → loyalty discount applies', () => {
    // sword: base 100; loyalty -20, first +10 => net -10 on base 100 = -10
    // 100 - 20 + 10 + 5 = 95
    expect(
      computePremium([{ type: 'sword' }], {
        customer: { yearsWithMHPCO: 2 },
        priorContracts: 0,
      }),
    ).toBe(95);
  });
});

describe('rounding in MHPCO favor (premium rounds up)', () => {
  it('197.5 → 198 (7 runes: 175 base × 1.1 + 5)', () => {
    const items = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    expect(quote(items)).toBe(198);
  });
});
