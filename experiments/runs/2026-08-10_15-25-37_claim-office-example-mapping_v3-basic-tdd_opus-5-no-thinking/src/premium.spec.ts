import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';
import type { Item } from './types.js';

const sword: Item = { type: 'sword' };
const amulet: Item = { type: 'amulet' };

/** Premium with no policy-wide modifiers other than the mandatory ones. */
function basePremiumOf(items: Item[]): number {
  // isolate the item base premium sum by subtracting fee and first-insurance surcharge
  return quotePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 }).basePremium;
}

describe('base premiums from the price list', () => {
  it('prices the four main item types', () => {
    expect(basePremiumOf([sword])).toBe(100);
    expect(basePremiumOf([amulet])).toBe(60);
    expect(basePremiumOf([{ type: 'staff' }])).toBe(80);
    expect(basePremiumOf([{ type: 'potion' }])).toBe(40);
  });

  it('prices components at 25 G each', () => {
    expect(basePremiumOf([{ type: 'rune' }])).toBe(25);
    expect(basePremiumOf([{ type: 'moonstone' }])).toBe(25);
  });

  it('sums the base premiums of all items', () => {
    expect(basePremiumOf([sword, amulet])).toBe(160);
  });

  it('rejects unknown item types', () => {
    expect(() => basePremiumOf([{ type: 'broomstick' }])).toThrow();
  });
});

describe('building block of 3 alike components', () => {
  it('gives no discount for 2 runes', () => {
    expect(basePremiumOf([{ type: 'rune' }, { type: 'rune' }])).toBe(50);
  });

  it('charges 60 G for exactly 3 runes', () => {
    expect(basePremiumOf([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('gives no discount for 4 runes', () => {
    expect(basePremiumOf(Array(4).fill({ type: 'rune' }))).toBe(100);
  });

  it('gives no discount for 7 runes', () => {
    expect(basePremiumOf(Array(7).fill({ type: 'rune' }))).toBe(175);
  });

  it('requires alike components: 2 runes + 1 moonstone form no block', () => {
    expect(basePremiumOf([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(75);
  });

  it('counts two separate blocks for 3 runes + 3 moonstones', () => {
    const items: Item[] = [
      ...Array(3).fill({ type: 'rune' }),
      ...Array(3).fill({ type: 'moonstone' }),
    ];
    expect(basePremiumOf(items)).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  it('adds a 50 % curse surcharge on the affected item only', () => {
    const result = quotePremium([{ type: 'sword', cursed: true }, amulet], {
      yearsWithMHPCO: 0,
      contractIndex: 0,
    });
    expect(result.basePremium).toBe(160);
    expect(result.afterItemModifiers).toBe(210);
  });

  it('adds a 30 % surcharge at exactly enchantment 5', () => {
    const result = quotePremium([{ type: 'sword', enchantment: 5 }], {
      yearsWithMHPCO: 0,
      contractIndex: 0,
    });
    expect(result.afterItemModifiers).toBe(130);
  });

  it('adds no enchantment surcharge below level 5', () => {
    const result = quotePremium([{ type: 'sword', enchantment: 4 }], {
      yearsWithMHPCO: 0,
      contractIndex: 0,
    });
    expect(result.afterItemModifiers).toBe(100);
  });

  it('stacks curse and high enchantment on the same item', () => {
    const result = quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], {
      yearsWithMHPCO: 0,
      contractIndex: 0,
    });
    expect(result.afterItemModifiers).toBe(180);
  });
});

describe('policy-wide modifiers and fee', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], { yearsWithMHPCO: 0, contractIndex: 0 }).premium).toBe(5);
  });

  it('applies the 10 % first insurance surcharge and the 5 G fee', () => {
    expect(quotePremium([sword], { yearsWithMHPCO: 0, contractIndex: 0 }).premium).toBe(115);
  });

  it('applies the loyalty discount at exactly 2 years', () => {
    expect(quotePremium([sword], { yearsWithMHPCO: 2, contractIndex: 0 }).premium).toBe(95);
  });

  it('applies no loyalty discount below 2 years', () => {
    expect(quotePremium([sword], { yearsWithMHPCO: 1, contractIndex: 0 }).premium).toBe(115);
  });

  it('applies the 15 % follow-up discount on contracts after the first', () => {
    // 100 base + 10 first insurance − 15 follow-up + 5 fee
    expect(quotePremium([sword], { yearsWithMHPCO: 0, contractIndex: 1 }).premium).toBe(100);
  });

  it('computes policy-wide modifiers from the policy base premium', () => {
    // amulet 60 base + 30 % enchantment = 78; first insurance is 10 % of the
    // base premium (6), not of the modified amount; 78 + 6 + 5 fee = 89
    expect(
      quotePremium([{ type: 'amulet', enchantment: 6 }], {
        yearsWithMHPCO: 0,
        contractIndex: 0,
      }).premium,
    ).toBe(89);
  });

  it('rounds a fractional final premium up, in the MHPCO favour', () => {
    // 5 runes: base 125 (no block); first insurance +12.5 => 137.5; +5 fee = 142.5 -> 143
    expect(
      quotePremium(Array(5).fill({ type: 'rune' }), {
        yearsWithMHPCO: 0,
        contractIndex: 0,
      }).premium,
    ).toBe(143);
  });
});

describe('integration examples from the specification', () => {
  it('prices a newcomer with a cursed sword at 165 G', () => {
    const premium = quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], {
      yearsWithMHPCO: 0,
      contractIndex: 0,
    }).premium;
    expect(premium).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    const premium = quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], {
      yearsWithMHPCO: 3,
      contractIndex: 1,
    }).premium;
    expect(premium).toBe(160);
  });
});

describe('insurance sum', () => {
  it('sums the insurance values of all items', () => {
    const result = quotePremium([sword, amulet], { yearsWithMHPCO: 0, contractIndex: 0 });
    expect(result.insuranceSum).toBe(1600);
  });

  it('counts two swords twice', () => {
    expect(quotePremium([sword, sword], { yearsWithMHPCO: 0, contractIndex: 0 }).insuranceSum).toBe(2000);
  });

  it('is unaffected by the block discount', () => {
    const items: Item[] = [sword, ...Array(3).fill({ type: 'rune' })];
    expect(quotePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 }).insuranceSum).toBe(1750);
  });

  it('is unaffected by premium modifiers', () => {
    const result = quotePremium([{ type: 'sword', cursed: true }], {
      yearsWithMHPCO: 0,
      contractIndex: 0,
    });
    expect(result.premium).toBe(165);
    expect(result.insuranceSum).toBe(1000);
  });
});
