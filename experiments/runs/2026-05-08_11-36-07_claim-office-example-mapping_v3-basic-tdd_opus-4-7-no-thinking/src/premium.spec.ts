import { describe, it, expect } from 'vitest';
import { computePremium } from './premium.js';

describe('computePremium - basics', () => {
  it('empty items list yields only the processing fee', () => {
    expect(
      computePremium({
        items: [],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(5);
  });

  it('single plain sword with no history', () => {
    // base 100 + first insurance 10 + fee 5 = 115
    expect(
      computePremium({
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(115);
  });

  it('single plain amulet (60 base + 6 first + 5 fee = 71)', () => {
    expect(
      computePremium({
        items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(71);
  });

  it('single plain staff (80 base + 8 first + 5 fee = 93)', () => {
    expect(
      computePremium({
        items: [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(93);
  });

  it('single plain potion (40 base + 4 first + 5 fee = 49)', () => {
    expect(
      computePremium({
        items: [{ type: 'potion', cursed: false }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(49);
  });

  it('throws on unknown item type', () => {
    expect(() =>
      computePremium({
        items: [{ type: 'broomstick' as any }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toThrow();
  });
});

describe('computePremium - components and 3-block', () => {
  it('2 runes → base 50, +5 first +5 fee = 60', () => {
    // base premium 25*2 = 50; first insurance applies per-policy on policy base
    // 50 base + first 5 = 55 + 5 fee = 60
    expect(
      computePremium({
        items: [
          { type: 'rune' },
          { type: 'rune' },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(60);
  });

  it('3 runes → base 60 (block applies)', () => {
    // 60 base + 6 first + 5 fee = 71
    expect(
      computePremium({
        items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(71);
  });

  it('4 runes → base 100 (no block)', () => {
    // 100 base + 10 first + 5 fee = 115
    expect(
      computePremium({
        items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(115);
  });

  it('7 runes → base 175 (block requires exactly 3 alike)', () => {
    // 175 + 17.5 first ins + 5 fee = 197.5 → 198
    expect(
      computePremium({
        items: Array(7).fill({ type: 'rune' }),
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(198);
  });

  it('2 runes + 1 moonstone → 75 base (no block, different types)', () => {
    // 75 + 7.5 first ins + 5 fee = 87.5 → 88
    expect(
      computePremium({
        items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 base (two separate blocks)', () => {
    // 120 + 12 first ins + 5 fee = 137
    expect(
      computePremium({
        items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'moonstone' },
          { type: 'moonstone' },
          { type: 'moonstone' },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(137);
  });
});

describe('computePremium - modifiers', () => {
  it('newcomer with cursed sword → 165', () => {
    expect(
      computePremium({
        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(165);
  });

  it('long-standing customer, second contract, cursed sword enchantment 7 → 160', () => {
    expect(
      computePremium({
        items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        customer: { yearsWithMHPCO: 3 },
        isFollowUp: true,
      }),
    ).toBe(160);
  });

  it('cursed sword + plain amulet: policy base 160, cursed adds 50 to sword → 210 before fees/modifiers', () => {
    // policy base 100+60 = 160. Cursed adds 50. = 210.
    // first insurance: 10% of policy base = 16 → 226
    // fee 5 → 231
    expect(
      computePremium({
        items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(231);
  });

  it('exactly enchantment 5 triggers high-enchantment surcharge', () => {
    // sword base 100, +30 high ench, +10 first ins, +5 fee = 145
    expect(
      computePremium({
        items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      }),
    ).toBe(145);
  });

  it('exactly 2 years yields loyalty discount', () => {
    // base 100, loyalty -20, first ins +10, fee +5 = 95
    expect(
      computePremium({
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        customer: { yearsWithMHPCO: 2 },
        isFollowUp: false,
      }),
    ).toBe(95);
  });

  it('rounds in MHPCO favor (up: 123.75 → 124)', () => {
    // 5 runes: base 125 + 12.5 first ins - 18.75 follow-up + 5 fee = 123.75 → 124
    expect(
      computePremium({
        items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: true,
      }),
    ).toBe(124);
  });
});
