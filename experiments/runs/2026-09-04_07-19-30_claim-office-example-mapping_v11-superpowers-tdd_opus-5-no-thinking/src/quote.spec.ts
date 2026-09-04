import { describe, expect, test } from 'vitest';
import { policyBasePremium, premiumBeforePolicyModifiers, quote } from './quote.js';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('base premiums', () => {
  test('empty item list yields only the processing fee', () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0).premium).toBe(5);
  });

  // A new customer's single plain item: base + 10% first insurance + 5 G fee.
  test.each([
    ['sword', 100, 115],
    ['amulet', 60, 71],
    ['staff', 80, 93],
    ['potion', 40, 49],
  ])('a plain %s has base premium %d', (type, _base, expected) => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type }], 0).premium).toBe(expected);
  });
});

describe('component blocks', () => {
  test('a single component costs 25 G', () => {
    expect(policyBasePremium(runes(1))).toBe(25);
  });

  test('two runes are priced per component', () => {
    expect(policyBasePremium(runes(2))).toBe(50);
  });

  test('exactly three alike components form a block at 60 G', () => {
    expect(policyBasePremium(runes(3))).toBe(60);
  });

  test('four runes get no block — a block requires exactly three', () => {
    expect(policyBasePremium(runes(4))).toBe(100);
  });

  test('seven runes get no block', () => {
    expect(policyBasePremium(runes(7))).toBe(175);
  });

  test('components of different types do not form a block', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  test('two groups of three alike components form two blocks', () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(policyBasePremium([...runes(3), ...moonstones])).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  test('a cursed item adds 50 % of its own base premium', () => {
    expect(premiumBeforePolicyModifiers([{ type: 'sword', cursed: true }])).toBe(150);
  });

  test('the curse surcharge is based on the cursed item only, not the policy total', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(premiumBeforePolicyModifiers(items)).toBe(210);
  });

  test('enchantment of exactly 5 adds the high-enchantment surcharge', () => {
    expect(premiumBeforePolicyModifiers([{ type: 'sword', enchantment: 5 }])).toBe(130);
  });

  test('enchantment of 4 adds no high-enchantment surcharge', () => {
    expect(premiumBeforePolicyModifiers([{ type: 'sword', enchantment: 4 }])).toBe(100);
  });

  test('a cursed and highly enchanted item takes both surcharges', () => {
    const items = [{ type: 'sword', cursed: true, enchantment: 5 }];
    expect(premiumBeforePolicyModifiers(items)).toBe(180);
  });
});

describe('policy-wide modifiers', () => {
  test('a customer of exactly two years receives the loyalty discount', () => {
    // 100 base − 20 loyalty + 10 first insurance + 5 fee
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: 'sword' }], 0).premium).toBe(95);
  });

  test('a customer of one year receives no loyalty discount', () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: 'sword' }], 0).premium).toBe(115);
  });

  test('each contract after the first receives a 15 % discount', () => {
    // 100 base + 10 first insurance − 15 follow-up + 5 fee
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: 'sword' }], 1).premium).toBe(100);
  });

  test('the loyalty discount is based on the policy base, not on surcharges', () => {
    // base 100 + 50 curse − 20 loyalty + 10 first insurance + 5 fee
    const items = [{ type: 'sword', cursed: true }];
    expect(quote({ yearsWithMHPCO: 2 }, items, 0).premium).toBe(145);
  });
});

describe('integration examples', () => {
  test('newcomer with a cursed sword pays 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(165);
  });

  test("long-standing customer's second contract for a cursed enchanted sword pays 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, items, 1).premium).toBe(160);
  });
});

describe('unknown item types', () => {
  test('quoting an unknown item type is rejected', () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: 'broomstick' }], 0)).toThrow(
      /broomstick/,
    );
  });
});

describe('rounding', () => {
  test('a fractional premium is rounded up, in the MHPCO favour', () => {
    // base 250 (10 runes) + 25 first insurance − 37.5 follow-up + 5 fee
    // = 242.5, which must round up to 243.
    const tenRunes = Array.from({ length: 10 }, () => ({ type: 'rune' }));
    expect(quote({ yearsWithMHPCO: 0 }, tenRunes, 1).premium).toBe(243);
  });
});
