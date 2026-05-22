import { describe, it, expect } from 'vitest';
import { quote } from './quote.js';

describe('quote — main items, single new customer', () => {
  it('sword steel ench 3 not cursed, new customer first contract', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        { contractIndex: 0 },
      ),
    ).toBe(115);
  });

  it('amulet for 5-year loyal customer, first contract', () => {
    expect(
      quote(
        { yearsWithMHPCO: 5 },
        [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        { contractIndex: 0 },
      ),
    ).toBe(58);
  });

  it('staff base premium', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'staff', material: 'oak', enchantment: 0, cursed: false }],
        { contractIndex: 0 },
      ),
      // base 80 × 1.10 + 5 = 93
    ).toBe(93);
  });

  it('potion base premium', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }],
        { contractIndex: 0 },
      ),
      // base 40 × 1.10 + 5 = 49
    ).toBe(49);
  });
});

describe('quote — surcharges', () => {
  it('cursed sword: +50%', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }],
        { contractIndex: 0 },
      ),
      // 100 × 1.5 × 1.10 + 5 = 170
    ).toBe(170);
  });

  it('high enchantment sword (>=5): +30%', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        { contractIndex: 0 },
      ),
      // 100 × 1.30 × 1.10 + 5 = 148
    ).toBe(148);
  });

  it('cursed AND high-enchantment staff: both surcharges stack', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'staff', material: 'oak', enchantment: 7, cursed: true }],
        { contractIndex: 0 },
      ),
      // 80 × 1.5 × 1.3 × 1.10 + 5 = 176.6 → 177
    ).toBe(177);
  });
});

describe('quote — loyalty and contract sequencing', () => {
  it('loyal customer (>=2 yrs) first contract: 20% loyalty discount and 10% initial surcharge', () => {
    expect(
      quote(
        { yearsWithMHPCO: 2 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { contractIndex: 0 },
      ),
      // 100 × 0.8 × 1.10 + 5 = 93
    ).toBe(93);
  });

  it('non-loyal customer second contract: no loyalty, no initial surcharge, 15% repeat-customer discount', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { contractIndex: 1 },
      ),
      // 100 × 0.85 + 5 = 90
    ).toBe(90);
  });

  it('loyal customer second contract: loyalty + repeat discount', () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { contractIndex: 1 },
      ),
      // 100 × 0.8 × 0.85 + 5 = 73
    ).toBe(73);
  });

  it('cursed high-ench staff, loyal customer, 2nd contract', () => {
    expect(
      quote(
        { yearsWithMHPCO: 5 },
        [{ type: 'staff', material: 'oak', enchantment: 6, cursed: true }],
        { contractIndex: 1 },
      ),
      // 80 × 1.5 × 1.3 × 0.8 × 0.85 + 5 = 111.08 → 112
    ).toBe(112);
  });
});

describe('quote — components and block pricing', () => {
  it('one rune (singleton): base 25', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }],
        { contractIndex: 0 },
      ),
      // 25 × 1.10 + 5 = 32.5 → 33
    ).toBe(33);
  });

  it('three alike runes: block base 60', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        ],
        { contractIndex: 0 },
      ),
      // 60 × 1.10 + 5 = 71
    ).toBe(71);
  });

  it('four runes: one block + one singleton', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        ],
        { contractIndex: 0 },
      ),
      // (60 + 25) × 1.10 + 5 = 98.5 → 99
    ).toBe(99);
  });

  it('six runes: two blocks', () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        Array(6).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false }),
        { contractIndex: 0 },
      ),
      // 120 × 1.10 + 5 = 137
    ).toBe(137);
  });

  it('three runes plus two moonstones: rune block plus two singleton moonstones', () => {
    const items = [
      ...Array(3).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false }),
      ...Array(2).fill({ type: 'moonstone', material: 'stone', enchantment: 0, cursed: false }),
    ];
    expect(
      quote({ yearsWithMHPCO: 0 }, items, { contractIndex: 0 }),
      // (60 + 25 + 25) × 1.10 + 5 = 126
    ).toBe(126);
  });
});

describe('quote — rounding always favors MHPCO (ceil)', () => {
  it('fractional G rounds up', () => {
    expect(
      quote(
        { yearsWithMHPCO: 5 },
        [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        { contractIndex: 0 },
      ),
      // 60 × 0.8 × 1.10 + 5 = 57.8 → 58
    ).toBe(58);
  });
});
