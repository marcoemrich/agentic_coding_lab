import { describe, it, expect } from 'vitest';
import { quote } from './quote.js';
import type { Customer, Item } from './types.js';

const NEW_CUSTOMER: Customer = { yearsWithMHPCO: 0 };
const LOYAL_CUSTOMER: Customer = { yearsWithMHPCO: 3 };

function sword(overrides: Partial<Item> = {}): Item {
  return { type: 'sword', material: 'steel', enchantment: 0, cursed: false, ...overrides };
}
function amulet(overrides: Partial<Item> = {}): Item {
  return { type: 'amulet', material: 'silver', enchantment: 0, cursed: false, ...overrides };
}
function staff(overrides: Partial<Item> = {}): Item {
  return { type: 'staff', material: 'oak', enchantment: 0, cursed: false, ...overrides };
}
function potion(overrides: Partial<Item> = {}): Item {
  return { type: 'potion', material: 'glass', enchantment: 0, cursed: false, ...overrides };
}
function rune(overrides: Partial<Item> = {}): Item {
  return { type: 'rune', material: 'stone', enchantment: 0, cursed: false, ...overrides };
}
function moonstone(overrides: Partial<Item> = {}): Item {
  return { type: 'moonstone', material: 'crystal', enchantment: 0, cursed: false, ...overrides };
}

describe('quote — single main items, new customer, first contract', () => {
  // Base premiums: sword 100, amulet 60, staff 80, potion 40
  // First contract: +10%  →  multiplier 1.1
  // Processing fee: +5

  it('quotes a sword', () => {
    // 100 * 1.1 + 5 = 115
    const { premium } = quote([sword()], NEW_CUSTOMER, 1);
    expect(premium).toBe(115);
  });

  it('quotes an amulet', () => {
    // 60 * 1.1 + 5 = 71
    const { premium } = quote([amulet()], NEW_CUSTOMER, 1);
    expect(premium).toBe(71);
  });

  it('quotes a staff', () => {
    // 80 * 1.1 + 5 = 93
    const { premium } = quote([staff()], NEW_CUSTOMER, 1);
    expect(premium).toBe(93);
  });

  it('quotes a potion', () => {
    // 40 * 1.1 + 5 = 49
    const { premium } = quote([potion()], NEW_CUSTOMER, 1);
    expect(premium).toBe(49);
  });
});

describe('quote — item surcharges', () => {
  it('applies 50% surcharge for a cursed sword', () => {
    // 100 * 1.5 = 150 base; 150 * 1.1 + 5 = 170
    const { premium } = quote([sword({ cursed: true })], NEW_CUSTOMER, 1);
    expect(premium).toBe(170);
  });

  it('applies 30% surcharge for highly enchanted sword (enchantment 5)', () => {
    // 100 * 1.3 = 130; 130 * 1.1 + 5 = 148
    const { premium } = quote([sword({ enchantment: 5 })], NEW_CUSTOMER, 1);
    expect(premium).toBe(148);
  });

  it('stacks cursed and high-enchantment surcharges additively', () => {
    // 100 * (1 + 0.5 + 0.3) = 180; 180 * 1.1 + 5 = 203
    const { premium } = quote([sword({ cursed: true, enchantment: 7 })], NEW_CUSTOMER, 1);
    expect(premium).toBe(203);
  });

  it('does not apply high-enchantment surcharge below threshold (enchantment 4)', () => {
    const { premium } = quote([sword({ enchantment: 4 })], NEW_CUSTOMER, 1);
    expect(premium).toBe(115); // no surcharge
  });
});

describe('quote — customer modifiers', () => {
  it('applies 20% loyalty discount for long-standing customer (first contract)', () => {
    // amulet: 60 * (1 + 0.1 - 0.2) + 5 = 60 * 0.9 + 5 = 59
    const { premium } = quote([amulet()], LOYAL_CUSTOMER, 1);
    expect(premium).toBe(59);
  });

  it('applies 15% repeat-customer discount on second contract', () => {
    // amulet: 60 * (1 - 0.15) + 5 = 51 + 5 = 56
    const { premium } = quote([amulet()], NEW_CUSTOMER, 2);
    expect(premium).toBe(56);
  });

  it('stacks loyalty + repeat discount', () => {
    // amulet: 60 * (1 - 0.15 - 0.2) + 5 = 60 * 0.65 + 5 = 39 + 5 = 44
    const { premium } = quote([amulet()], LOYAL_CUSTOMER, 2);
    expect(premium).toBe(44);
  });

  it('rounds up fractional premiums in MHPCO favour', () => {
    // amulet (60) + staff (80) = 140; 140 * 1.1 + 5 = 159
    // (no rounding needed here, but let's verify exact integer)
    const { premium } = quote([amulet(), staff()], NEW_CUSTOMER, 1);
    expect(premium).toBe(159);
  });
});

describe('quote — components', () => {
  it('quotes a single component (rune)', () => {
    // 25 * 1.1 + 5 = 32.5 → ceil = 33
    const { premium } = quote([rune()], NEW_CUSTOMER, 1);
    expect(premium).toBe(33);
  });

  it('quotes exactly 3 alike components at trio price', () => {
    // trio base 60; 60 * 1.1 + 5 = 71
    const { premium } = quote([rune(), rune(), rune()], NEW_CUSTOMER, 1);
    expect(premium).toBe(71);
  });

  it('quotes 4 alike components as one trio + one single', () => {
    // trio 60 + single 25 = 85; 85 * 1.1 + 5 = 98.5 → ceil 99
    const { premium } = quote([rune(), rune(), rune(), rune()], NEW_CUSTOMER, 1);
    expect(premium).toBe(99);
  });

  it('applies surcharges to trio components', () => {
    // cursed rune trio: 60 * 1.5 = 90; 90 * 1.1 + 5 = 104
    const { premium } = quote([rune({ cursed: true }), rune({ cursed: true }), rune({ cursed: true })], NEW_CUSTOMER, 1);
    expect(premium).toBe(104);
  });

  it('mixes two component types correctly', () => {
    // 1 rune (25) + 1 moonstone (25) = 50; 50 * 1.1 + 5 = 60
    const { premium } = quote([rune(), moonstone()], NEW_CUSTOMER, 1);
    expect(premium).toBe(60);
  });

  it('computes correct insurance sum for components', () => {
    const { policy } = quote([rune(), rune(), rune()], NEW_CUSTOMER, 1);
    expect(policy.insuranceSum).toBe(750);
    expect(policy.remainingCap).toBe(1500);
  });
});

describe('quote — policy output', () => {
  it('sets insurance sum correctly for main items', () => {
    const { policy } = quote([sword(), amulet()], NEW_CUSTOMER, 1);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });
});
