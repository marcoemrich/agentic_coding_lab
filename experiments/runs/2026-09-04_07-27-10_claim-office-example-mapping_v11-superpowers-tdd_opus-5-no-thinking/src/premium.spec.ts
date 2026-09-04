import { describe, expect, test } from 'vitest';
import { basePremium, quotePremium } from './premium.js';

describe('base premium per item', () => {
  test('a sword has a base premium of 100 G', () => {
    expect(basePremium([{ type: 'sword' }])).toBe(100);
  });

  test('an amulet has a base premium of 60 G', () => {
    expect(basePremium([{ type: 'amulet' }])).toBe(60);
  });

  test('a staff has a base premium of 80 G', () => {
    expect(basePremium([{ type: 'staff' }])).toBe(80);
  });

  test('a potion has a base premium of 40 G', () => {
    expect(basePremium([{ type: 'potion' }])).toBe(40);
  });
});

describe('component blocks', () => {
  const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

  test('2 runes cost 50 G — no block', () => {
    expect(basePremium(runes(2))).toBe(50);
  });

  test('3 runes cost 60 G — the block price applies', () => {
    expect(basePremium(runes(3))).toBe(60);
  });

  test('4 runes cost 100 G — a block requires exactly 3', () => {
    expect(basePremium(runes(4))).toBe(100);
  });

  test('7 runes cost 175 G', () => {
    expect(basePremium(runes(7))).toBe(175);
  });

  test('2 runes and 1 moonstone cost 75 G — different types form no block', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  test('3 runes and 3 moonstones cost 120 G — two separate blocks', () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(basePremium([...runes(3), ...moonstones])).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  const newcomer = { yearsWithMHPCO: 0 };

  test('a cursed sword adds a 50 % surcharge on that item', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', cursed: true }], newcomer, 0)).toBe(165);
  });

  test('the cursed surcharge applies only to the cursed item, not the policy total', () => {
    // base 160; curse adds 50 (50 % of the sword only) => 210;
    // first insurance is 10 % of the 160 policy base = 16; +5 fee
    const items = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    expect(quotePremium(items, newcomer, 0)).toBe(231);
  });

  test('enchantment 5 adds the 30 % high-enchantment surcharge', () => {
    // 100 base + 30 enchantment; first insurance 10 % of 100 = 10; +5 fee
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, 0)).toBe(145);
  });

  test('enchantment 4 adds no high-enchantment surcharge', () => {
    // 100 base; +10 first insurance; +5 fee
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, 0)).toBe(115);
  });

  test('a cursed sword with enchantment 5 gets both surcharges', () => {
    // 100 + 50 curse + 30 enchantment; first insurance 10 % of 100 = 10; +5 fee
    expect(quotePremium([{ type: 'sword', cursed: true, enchantment: 5 }], newcomer, 0)).toBe(195);
  });
});

describe('policy-wide modifiers', () => {
  test('exactly 2 years with MHPCO earns the loyalty discount', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  test('1 year with MHPCO earns no loyalty discount', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  test('a follow-up contract earns a 15 % discount', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 0 }, 1)).toBe(100);
  });

  test('an empty item list costs only the processing fee', () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });
});

describe('integration examples', () => {
  test('newcomer with a cursed sword pays 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(165);
  });

  test("long-standing customer's second contract for a cursed sword pays 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });
});

describe('rounding in the MHPCO favour', () => {
  test('a fractional premium is rounded up', () => {
    // 2 runes => base 50. first insurance +5, follow-up -7.5 => 47.5; +5 fee => 52.5
    // the MHPCO rounds premiums up => 53
    const items = [{ type: 'rune' }, { type: 'rune' }];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, 1)).toBe(53);
  });
});

describe('unknown item types', () => {
  test('quoting an unknown item type is rejected', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], { yearsWithMHPCO: 0 }, 0)).toThrow(
      /broomstick/,
    );
  });
});
