import { describe, it, expect } from 'vitest';
import { quote } from './quote.js';
import type { Customer, Item } from './types.js';

const newcomer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };
const loyal: Customer = { yearsWithMHPCO: 3, contractCount: 0 };

describe('quote — base premiums for main items', () => {
  it('sword newcomer: 100 + 10 first-ins + 5 fee = 115', () => {
    expect(quote(newcomer, [{ type: 'sword' }])).toBe(115);
  });

  it('amulet, loyal customer first contract', () => {
    // base 60. first-ins +6. loyalty -12. +5 fee = 59
    expect(quote(loyal, [{ type: 'amulet' }])).toBe(59);
  });

  it('staff newcomer: 80 + 8 + 5 = 93', () => {
    expect(quote(newcomer, [{ type: 'staff' }])).toBe(93);
  });

  it('potion newcomer: 40 + 4 + 5 = 49', () => {
    expect(quote(newcomer, [{ type: 'potion' }])).toBe(49);
  });
});

describe('quote — example: newcomer with cursed sword (steel, ench 3)', () => {
  it('produces 165 G', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0, contractCount: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]
      )
    ).toBe(165);
  });
});

describe('quote — example: long-standing 2nd contract with cursed sword (steel, ench 7)', () => {
  it('produces 160 G', () => {
    expect(
      quote(
        { yearsWithMHPCO: 3, contractCount: 1 },
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }]
      )
    ).toBe(160);
  });
});

describe('quote — empty', () => {
  it('only fee', () => {
    expect(quote(newcomer, [])).toBe(5);
  });
});

describe('quote — components & blocks', () => {
  it('2 runes → 50 base + 5 first-insurance? No, runes are components without enchantment/material/cursed; first-insurance is per item', () => {
    // 2 runes: 2*25 = 50 base. per item first-insurance +10% of each base 25 → +2.5 each = +5 total. policy +5 fee
    // total = 50 + 5 + 5 = 60. round up → 60
    expect(quote(newcomer, [{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('3 runes → block 60 base; with first-insurance and fee', () => {
    // 3 runes form block: base = 60. first-insurance per-item still applies on each item base 25 → +2.5*3 = +7.5
    // total = 60 + 7.5 + 5 = 72.5. round up → 73
    expect(quote(newcomer, [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(73);
  });

  it('4 runes → no block: 100 base', () => {
    // 4*25=100 base. first-insurance +2.5*4=10. +5 fee = 115.
    expect(quote(newcomer, [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(115);
  });

  it('7 runes → 2 blocks + 1 = 60+60+25 = 145? No: "block requires exactly 3"; spec says 7 runes → 175 base', () => {
    // Per spec example: 7 runes → 175 G base premium. So blocks don't pack greedily.
    // 7*25 = 175. So with 7 runes, no blocks applied (since 7≠3).
    // Hmm but 3 runes gives 60 (block applies). So block is "exactly 3 alike components".
    // Therefore, for 7, no block: 7*25=175 base. Confirmed.
    // total = 175 + 17.5 first-ins + 5 fee = 197.5 → round up → 198
    expect(quote(newcomer, Array(7).fill({ type: 'rune' }))).toBe(198);
  });

  it('2 runes + 1 moonstone → 75 base (different types)', () => {
    // 3*25 = 75. first-ins +7.5. +5 = 87.5 → 88
    expect(quote(newcomer, [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 base (two blocks)', () => {
    // 60 + 60 = 120 base. first-ins +2.5*6 = 15. +5 fee = 140
    expect(
      quote(newcomer, [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
      ])
    ).toBe(140);
  });
});

describe('quote — modifier scope', () => {
  it('cursed sword + plain amulet, newcomer first contract', () => {
    // base: 100 + 60 = 160. curse surcharge 50% of sword base = 50.
    // first-insurance per item: +10% of each item base. sword 10 + amulet 6 = 16.
    // total: 160 + 50 + 16 + 5 fee = 231
    expect(
      quote(newcomer, [
        { type: 'sword', cursed: true },
        { type: 'amulet' },
      ])
    ).toBe(231);
  });

  it('high enchantment threshold at exactly 5', () => {
    // sword enchantment 5: high-ench +30% of 100 = 30. first ins 10. fee 5. = 145
    expect(quote(newcomer, [{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('high enchantment threshold below at 4', () => {
    // sword enchantment 4: no surcharge. 100 + 10 + 5 = 115
    expect(quote(newcomer, [{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('cursed + high enchantment both apply', () => {
    // sword cursed, ench 5: +50 +30 +10 +5 = 195
    expect(quote(newcomer, [{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(195);
  });

  it('loyalty at exactly 2 years applies', () => {
    // sword, ench 3, customer 2 yrs, first contract.
    // base 100. first-ins +10. loyalty -20. fee +5. = 95
    expect(quote({ yearsWithMHPCO: 2, contractCount: 0 }, [{ type: 'sword' }])).toBe(95);
  });
});

describe('quote — unknown item type throws', () => {
  it('throws', () => {
    expect(() => quote(newcomer, [{ type: 'broomstick' as any }])).toThrow();
  });
});
