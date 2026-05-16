import { describe, it, expect } from 'vitest';
import { computePremium } from './premium.js';
import type { Customer, Item } from './types.js';

const newCustomer: Customer = { yearsWithMHPCO: 0 };

describe('computePremium - empty', () => {
  it('empty item list returns 5 (processing fee only)', () => {
    expect(computePremium(newCustomer, [], 0)).toBe(5);
  });
});

describe('computePremium - base premiums', () => {
  it('single plain sword for new customer first contract', () => {
    // 100 base + 10 (first insurance 10%) + 5 fee = 115
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }];
    expect(computePremium(newCustomer, items, 0)).toBe(115);
  });

  it('single plain amulet', () => {
    // 60 + 6 + 5 = 71
    const items: Item[] = [{ type: 'amulet', material: 'silver', enchantment: 1, cursed: false }];
    expect(computePremium(newCustomer, items, 0)).toBe(71);
  });

  it('single plain staff', () => {
    // 80 + 8 + 5 = 93
    const items: Item[] = [{ type: 'staff', material: 'wood', enchantment: 1, cursed: false }];
    expect(computePremium(newCustomer, items, 0)).toBe(93);
  });

  it('single plain potion', () => {
    // 40 + 4 + 5 = 49
    const items: Item[] = [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }];
    expect(computePremium(newCustomer, items, 0)).toBe(49);
  });
});

describe('computePremium - component blocks', () => {
  it('2 runes → 50 base premium → 50 + 5 first + 5 fee = 60', () => {
    const items: Item[] = [
      { type: 'rune' },
      { type: 'rune' },
    ];
    // 50 base * 1.1 first = 55 + 5 fee = 60
    expect(computePremium(newCustomer, items, 0)).toBe(60);
  });

  it('3 runes → 60 base premium', () => {
    const items: Item[] = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
    // 60 * 1.1 = 66 + 5 = 71
    expect(computePremium(newCustomer, items, 0)).toBe(71);
  });

  it('4 runes → 100 base premium', () => {
    const items: Item[] = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
    // 100 * 1.1 = 110 + 5 = 115
    expect(computePremium(newCustomer, items, 0)).toBe(115);
  });

  it('7 runes → 175 base premium', () => {
    const items: Item[] = Array(7).fill({ type: 'rune' });
    // 175 * 1.1 = 192.5 → 193 + 5 = 198
    expect(computePremium(newCustomer, items, 0)).toBe(198);
  });

  it('2 runes + 1 moonstone → 75 base premium', () => {
    const items: Item[] = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];
    // 75 * 1.1 = 82.5 → 83 + 5 = 88
    expect(computePremium(newCustomer, items, 0)).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 base premium (two blocks)', () => {
    const items: Item[] = [
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ];
    // 120 * 1.1 = 132 + 5 = 137
    expect(computePremium(newCustomer, items, 0)).toBe(137);
  });
});

describe('computePremium - integration examples', () => {
  it('newcomer with cursed sword: 165 G', () => {
    const customer: Customer = { yearsWithMHPCO: 0 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(computePremium(customer, items, 0)).toBe(165);
  });

  it("long-standing customer's second contract: 160 G", () => {
    const customer: Customer = { yearsWithMHPCO: 3 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    // priorContracts=1: 100 base + 50 curse + 30 highench = 180; -20% loyalty + 10% first ins -15% followup
    // Actually per spec: 100 base + 50 curse + 30 high = 180 (item totals)
    // -20 loyalty = -36, +10 first ins applies to item base (100), -15 followup applies to policy base 100
    // From example: 100 base + 50 curse + 30 high - 20 loyalty + 10 first ins - 15 followup = 155 + 5 = 160
    expect(computePremium(customer, items, 1)).toBe(160);
  });
});

describe('computePremium - modifier scope on multi-item', () => {
  it('cursed sword + plain amulet → 210 before fee → 215 with fee for newcomer needs check', () => {
    // From the spec: policy base = 160, cursed adds 50 → 210 "before further modifiers and fee"
    // For a newcomer first contract: 210 + first ins 10% on each item base
    // Actually first insurance is per-item base.
    // Let me read more carefully: the example says 210 G before further modifiers and fee.
    // For a brand new customer with no other modifiers: 210 + first insurance (10% on items first insured)
    // first insurance: 10% on item base (100 + 60 = 160) = 16 + 210 = 226 + 5 = 231
    const customer: Customer = { yearsWithMHPCO: 0 };
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 2, cursed: true },
      { type: 'amulet', material: 'silver', enchantment: 1, cursed: false },
    ];
    expect(computePremium(customer, items, 0)).toBe(231);
  });
});

describe('computePremium - thresholds', () => {
  it('exactly 2 years gets loyalty discount', () => {
    const customer: Customer = { yearsWithMHPCO: 2 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }];
    // 100 - 20 loyalty + 10 first ins = 90 + 5 = 95
    expect(computePremium(customer, items, 0)).toBe(95);
  });

  it('exactly enchantment 5 gets high-enchantment surcharge', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }];
    // 100 + 30 high + 10 first ins = 140 + 5 = 145
    expect(computePremium(newCustomer, items, 0)).toBe(145);
  });

  it('enchantment 4 has no high surcharge', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }];
    // 100 + 10 first ins = 110 + 5 = 115
    expect(computePremium(newCustomer, items, 0)).toBe(115);
  });
});

describe('computePremium - rounding in MHPCO favor', () => {
  it('rounds up 197.5 → 198', () => {
    // 7 runes for new customer = 175 * 1.1 = 192.5 → 193 + 5 = 198 (already tested)
    const items: Item[] = Array(7).fill({ type: 'rune' });
    expect(computePremium(newCustomer, items, 0)).toBe(198);
  });
});

describe('computePremium - unknown type', () => {
  it('throws on unknown item type', () => {
    const items: Item[] = [{ type: 'broomstick' } as unknown as Item];
    expect(() => computePremium(newCustomer, items, 0)).toThrow();
  });
});
