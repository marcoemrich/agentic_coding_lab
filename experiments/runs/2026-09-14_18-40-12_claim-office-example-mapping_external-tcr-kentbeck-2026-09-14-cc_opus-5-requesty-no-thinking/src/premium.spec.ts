import { describe, it, expect } from 'vitest';
import { itemBasePremium, policyBasePremium, quotePremium } from './premium';

describe('item base premium', () => {
  it('uses the MHPCO price list', () => {
    expect(itemBasePremium({ type: 'sword' })).toBe(100);
    expect(itemBasePremium({ type: 'amulet' })).toBe(60);
    expect(itemBasePremium({ type: 'staff' })).toBe(80);
    expect(itemBasePremium({ type: 'potion' })).toBe(40);
    expect(itemBasePremium({ type: 'rune' })).toBe(25);
    expect(itemBasePremium({ type: 'moonstone' })).toBe(25);
  });

  it('rejects unknown types', () => {
    expect(() => itemBasePremium({ type: 'broomstick' })).toThrow();
  });
});

describe('policy base premium', () => {
  const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

  it('applies the block of 3 alike components', () => {
    expect(policyBasePremium(runes(2))).toBe(50);
    expect(policyBasePremium(runes(3))).toBe(60);
    expect(policyBasePremium(runes(4))).toBe(100);
    expect(policyBasePremium(runes(7))).toBe(175);
  });

  it('treats alike as the same component type', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
    expect(
      policyBasePremium([...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))]),
    ).toBe(120);
  });

  it('sums main items', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
    expect(policyBasePremium([{ type: 'sword' }, ...runes(3)])).toBe(160);
  });

  it('is zero for an empty item list', () => {
    expect(policyBasePremium([])).toBe(0);
  });
});

describe('quote premium', () => {
  const newcomer = { yearsWithMHPCO: 0 };

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  it('prices a newcomer with a cursed sword', () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(quotePremium([sword], newcomer, 0)).toBe(165);
  });

  it("prices a long-standing customer's second contract", () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quotePremium([sword], { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });

  it('applies item surcharges only to the affected item', () => {
    const items = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    // 160 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium(items, newcomer, 0)).toBe(231);
  });

  it('applies the loyalty discount at exactly 2 years', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  it('applies the high enchantment surcharge at exactly 5', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, 0)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, 0)).toBe(115);
  });

  it('rounds up in the MHPCO favour', () => {
    // amulet base 60: 60 + 30 curse (50%) + 18 high ench (30%) + 6 first = 114 + 5 = 119
    expect(quotePremium([{ type: 'staff', cursed: true, enchantment: 6 }], newcomer, 0)).toBe(157);
    // potion 40 base, loyalty -8, first +4 => 36 + 5 = 41
    expect(quotePremium([{ type: 'potion' }], { yearsWithMHPCO: 5 }, 0)).toBe(41);
  });
});
