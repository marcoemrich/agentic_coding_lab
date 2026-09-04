import { describe, expect, test } from 'vitest';
import { quote } from './quote.js';

const newCustomer = { yearsWithMHPCO: 0 };

describe('quote', () => {
  test('an empty item list costs only the 5 G processing fee', () => {
    expect(quote({ items: [] }, newCustomer, 0).premium).toBe(5);
  });

  // base premium + 10 % first insurance + 5 G fee, e.g. sword: 100 + 10 + 5
  test.each([
    ['sword', 115],
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('a plain %s costs %i G', (type, premium) => {
    expect(quote({ items: [{ type }] }, newCustomer, 0).premium).toBe(premium);
  });

  describe('components', () => {
    const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

    // base premium + 10 % first insurance + 5 G fee
    test.each([
      [2, 60], // 50 base + 5 = 55 + 5
      [3, 71], // block: 60 base + 6 = 66 + 5
      [4, 115], // no block (needs exactly 3): 100 base + 10 = 110 + 5
      [7, 198], // 175 base + 17.5 + 5 fee = 197.5 → rounded up, MHPCO's favour
    ])('%i runes cost %i G', (count, premium) => {
      expect(quote({ items: runes(count) }, newCustomer, 0).premium).toBe(premium);
    });

    test('components of different types do not form a block together', () => {
      // 2 runes + 1 moonstone = 75 base; 75 + 7.5 = 82.5 → 83 + 5
      const items = [...runes(2), { type: 'moonstone' }];
      expect(quote({ items }, newCustomer, 0).premium).toBe(88);
    });

    test('two groups of 3 alike components form two separate blocks', () => {
      // 3 runes + 3 moonstones = 60 + 60 = 120 base; 120 + 12 = 132 + 5
      const items = [
        ...runes(3),
        { type: 'moonstone' },
        { type: 'moonstone' },
        { type: 'moonstone' },
      ];
      expect(quote({ items }, newCustomer, 0).premium).toBe(137);
    });
  });

  describe('item-specific modifiers', () => {
    test('a cursed item adds a 50 % surcharge on its own base premium', () => {
      // 100 base + 50 curse + 10 first insurance = 160 + 5
      const items = [{ type: 'sword', cursed: true, enchantment: 3 }];
      expect(quote({ items }, newCustomer, 0).premium).toBe(165);
    });

    test('enchantment 5 reaches the high-enchantment threshold', () => {
      // 100 base + 30 enchantment + 10 first insurance = 140 + 5
      const items = [{ type: 'sword', enchantment: 5 }];
      expect(quote({ items }, newCustomer, 0).premium).toBe(145);
    });

    test('enchantment 4 is below the high-enchantment threshold', () => {
      const items = [{ type: 'sword', enchantment: 4 }];
      expect(quote({ items }, newCustomer, 0).premium).toBe(115);
    });

    test('a cursed, highly enchanted item carries both surcharges', () => {
      // 100 base + 50 curse + 30 enchantment + 10 first insurance = 190 + 5
      const items = [{ type: 'sword', enchantment: 5, cursed: true }];
      expect(quote({ items }, newCustomer, 0).premium).toBe(195);
    });

    test('surcharges apply per item, not to the whole policy', () => {
      // cursed sword 100 + amulet 60 = 160 policy base; curse adds 50 (half
      // the sword only, not half of 160); first insurance is 10 % of the
      // 160 base = 16 → 160 + 50 + 16 = 226 + 5
      const items = [
        { type: 'sword', cursed: true },
        { type: 'amulet' },
      ];
      expect(quote({ items }, newCustomer, 0).premium).toBe(231);
    });
  });

  describe('policy-wide modifiers', () => {
    test('2 years with MHPCO already earns the loyalty discount', () => {
      // 100 base − 20 loyalty + 10 first insurance = 90 + 5
      const items = [{ type: 'sword' }];
      expect(quote({ items }, { yearsWithMHPCO: 2 }, 0).premium).toBe(95);
    });

    test('1 year with MHPCO does not earn the loyalty discount', () => {
      const items = [{ type: 'sword' }];
      expect(quote({ items }, { yearsWithMHPCO: 1 }, 0).premium).toBe(115);
    });

    test('every contract after the first gets a 15 % discount', () => {
      // 100 base − 15 follow-up + 10 first insurance = 95 + 5
      const items = [{ type: 'sword' }];
      expect(quote({ items }, newCustomer, 1).premium).toBe(100);
    });

    test("a long-standing customer's second contract stacks all modifiers", () => {
      // 100 base + 50 curse + 30 enchantment − 20 loyalty + 10 first
      // insurance − 15 follow-up = 155 + 5 fee
      const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
      expect(quote({ items }, { yearsWithMHPCO: 3 }, 1).premium).toBe(160);
    });
  });

  test('a fractional premium is always rounded up, in the MHPCO favour', () => {
    // 2 runes + 1 moonstone = 75 base; 75 + 7.5 first insurance
    // − 11.25 follow-up = 71.25 + 5 fee = 76.25 → 77, not 76
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];
    expect(quote({ items }, newCustomer, 1).premium).toBe(77);
  });

  test('an item of unknown type is rejected', () => {
    expect(() => quote({ items: [{ type: 'broomstick' }] }, newCustomer, 0)).toThrow(
      /broomstick/,
    );
  });
});
