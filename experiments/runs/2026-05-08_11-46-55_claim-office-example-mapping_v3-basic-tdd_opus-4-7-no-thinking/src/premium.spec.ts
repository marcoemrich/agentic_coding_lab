import { describe, it, expect } from 'vitest';
import { computePremium } from './premium.js';

describe('computePremium - empty', () => {
  it('returns 5G for empty item list (only processing fee)', () => {
    expect(computePremium([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });
});

describe('computePremium - main items, no modifiers, first contract, 0 years', () => {
  // 0 years -> no loyalty; first contract -> no follow-up discount; first insurance per item -> +10% per item base
  it('plain sword with newcomer: 100 + 10 (first ins) + 5 fee = 115', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(115);
  });

  it('plain amulet with newcomer: 60 + 6 + 5 = 71', () => {
    const items = [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(71);
  });
});

describe('computePremium - cursed and enchantment modifiers', () => {
  it('newcomer with cursed sword: 165', () => {
    // 100 base + 50 curse + 10 first ins = 160 + 5 fee = 165
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(165);
  });

  it('long-standing customer second contract, cursed sword ench 7: 160', () => {
    // 100 + 50 curse + 30 high ench - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 = 160
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(computePremium(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });

  it('exact enchantment 5 triggers high enchantment surcharge', () => {
    // sword ench 5, not cursed, 0 years, first contract:
    // 100 base + 30 high ench + 10 first ins = 140 + 5 = 145
    const items = [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(145);
  });

  it('enchantment 4 does not trigger surcharge', () => {
    // 100 + 10 = 110 + 5 = 115
    const items = [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(115);
  });
});

describe('computePremium - components and building blocks', () => {
  it('2 runes: 2 * 25 = 50 base; +5 first ins = 55 + 5 fee = 60', () => {
    const items = [
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(60);
  });

  it('3 runes: 60 base (block); +6 first ins = 66 + 5 = 71', () => {
    const items = [
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(71);
  });

  it('4 runes: 100 base (no block); +10 first ins = 110 + 5 = 115', () => {
    const items = Array(4).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false });
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(115);
  });

  it('7 runes: 175 base; +17.5 first ins = 192.5; +5 fee = 197.5 -> rounded up to 198', () => {
    const items = Array(7).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false });
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(198);
  });

  it('2 runes + 1 moonstone: 75 base (no blocks); +7.5 first ins = 82.5 + 5 = 87.5 -> 88', () => {
    const items = [
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'stone', enchantment: 0, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(88);
  });

  it('3 runes + 3 moonstones: 120 base (two blocks); +12 = 132 + 5 = 137', () => {
    const items = [
      ...Array(3).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false }),
      ...Array(3).fill({ type: 'moonstone', material: 'stone', enchantment: 0, cursed: false }),
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(137);
  });
});

describe('computePremium - rounding in MHPCO favor', () => {
  it('rounds premium up (197.5 -> 198)', () => {
    const items = Array(7).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false });
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(198);
  });
});

describe('computePremium - multi-item modifier scope', () => {
  it('cursed sword + plain amulet: cursed surcharge applies only to sword', () => {
    // base: 100 + 60 = 160
    // cursed: +50 (only sword) -> 210
    // first ins per item base: +10 (sword) + 6 (amulet) = 226
    // + 5 fee = 231
    const items = [
      { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(231);
  });
});
