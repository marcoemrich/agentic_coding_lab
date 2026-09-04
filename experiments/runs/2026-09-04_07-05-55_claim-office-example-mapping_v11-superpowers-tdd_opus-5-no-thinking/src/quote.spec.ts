import { describe, test, expect } from 'vitest';
import { quote } from './quote.js';

describe('quote', () => {
  test('empty item list yields only the processing fee', () => {
    expect(quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [])).toBe(5);
  });

  // base premium + 10% first insurance + 5G fee
  test.each([
    ['sword', 115],
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
    ['rune', 33],
    ['moonstone', 33],
  ])('a single %s costs %i G', (type, expected) => {
    expect(quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type }])).toBe(expected);
  });

  describe('building block of 3 alike components', () => {
    const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));
    const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

    // base premium, then +10% first insurance and +5G fee, rounded up
    test.each([
      [2, 60], // 50 base
      [3, 71], // 60 base — block applies
      [4, 115], // 100 base — block requires exactly 3
      [7, 198], // 175 base
    ])('%i runes cost %i G', (count, expected) => {
      expect(quote(newcomer, runes(count))).toBe(expected);
    });

    test('different component types do not form a block', () => {
      // 3 x 25 = 75 base
      expect(quote(newcomer, [...runes(2), { type: 'moonstone' }])).toBe(88);
    });

    test('each component type forms its own block', () => {
      // 60 + 60 = 120 base
      const moonstones = [{ type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }];
      expect(quote(newcomer, [...runes(3), ...moonstones])).toBe(137);
    });
  });

  describe('item-specific modifiers', () => {
    const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

    test('a cursed sword adds a 50% surcharge on its own base premium', () => {
      // 100 base + 50 curse + 10 first insurance (10% of 100) = 160; +5 fee = 165
      expect(quote(newcomer, [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]))
        .toBe(165);
    });

    test('enchantment 5 triggers the high-enchantment surcharge', () => {
      // 100 + 30 + 10 first insurance = 140; +5 = 145
      expect(quote(newcomer, [{ type: 'sword', enchantment: 5 }])).toBe(145);
    });

    test('enchantment 4 does not trigger the high-enchantment surcharge', () => {
      expect(quote(newcomer, [{ type: 'sword', enchantment: 4 }])).toBe(115);
    });

    test('cursed and highly enchanted stack on the same item', () => {
      // 100 + 50 + 30 + 10 first insurance = 190; +5 = 195
      expect(quote(newcomer, [{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
    });

    test('the curse surcharge uses the cursed item base, not the policy total', () => {
      // sword 100 + amulet 60 = 160 base; curse adds 50 => 210;
      // first insurance 10% of the 160 policy base = 16 => 226; +5 fee = 231
      const items = [
        { type: 'sword', cursed: true },
        { type: 'amulet', cursed: false },
      ];
      expect(quote(newcomer, items)).toBe(231);
    });
  });

  describe('policy-wide modifiers', () => {
    test('exactly 2 years with MHPCO earns the loyalty discount', () => {
      // 100 base - 20 loyalty + 10 first insurance = 90; +5 fee = 95
      expect(quote({ yearsWithMHPCO: 2, previousContracts: 0 }, [{ type: 'sword' }])).toBe(95);
    });

    test('1 year with MHPCO earns no loyalty discount', () => {
      expect(quote({ yearsWithMHPCO: 1, previousContracts: 0 }, [{ type: 'sword' }])).toBe(115);
    });

    test('each contract after the first gets a 15% discount', () => {
      // 100 base + 10 first insurance - 15 follow-up = 95; +5 fee = 100
      expect(quote({ yearsWithMHPCO: 0, previousContracts: 1 }, [{ type: 'sword' }])).toBe(100);
    });

    test("long-standing customer's second contract with a cursed, enchanted sword", () => {
      // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance
      //   - 15 follow-up = 155; +5 fee = 160
      const customer = { yearsWithMHPCO: 3, previousContracts: 1 };
      const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
      expect(quote(customer, [sword])).toBe(160);
    });

    test('a premium of 197.5 G is rounded up in the MHPCO favour', () => {
      // 7 runes: 175 base + 17.5 first insurance = 192.5; +5 fee = 197.5 -> 198
      const runes = Array.from({ length: 7 }, () => ({ type: 'rune' }));
      expect(quote({ yearsWithMHPCO: 0, previousContracts: 0 }, runes)).toBe(198);
    });

    test('a premium with a fraction below one half is still rounded up', () => {
      // amulet 60 + 7 runes 175 = 235 base; follow-up contract nets -5%
      //   (10% first insurance - 15% follow-up) = -11.75 => 223.25; +5 fee = 228.25 -> 229
      const customer = { yearsWithMHPCO: 0, previousContracts: 1 };
      const runes = Array.from({ length: 7 }, () => ({ type: 'rune' }));
      expect(quote(customer, [{ type: 'amulet' }, ...runes])).toBe(229);
    });
  });

  test('an item of unknown type is rejected', () => {
    expect(() => quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: 'broomstick' }]))
      .toThrow(/broomstick/i);
  });
});
