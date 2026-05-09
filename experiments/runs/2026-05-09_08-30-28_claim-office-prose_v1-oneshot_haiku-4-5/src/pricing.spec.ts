import { describe, it, expect } from 'vitest';
import { calculatePremium, calculateBasePremium, calculateInsuranceSum } from './pricing.js';
import { Item, Customer } from './types.js';

describe('Pricing - Insurance Sum', () => {
  it('calculates insurance sum for a single sword', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    expect(calculateInsuranceSum(items)).toBe(1000);
  });

  it('calculates insurance sum for a single amulet', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    expect(calculateInsuranceSum(items)).toBe(600);
  });

  it('calculates insurance sum for components', () => {
    const items: Item[] = [
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'silver', enchantment: 0, cursed: false },
    ];
    expect(calculateInsuranceSum(items)).toBe(500); // 250 + 250
  });

  it('calculates insurance sum for mixed items', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    expect(calculateInsuranceSum(items)).toBe(1600); // 1000 + 600
  });
});

describe('Pricing - Base Premium', () => {
  it('calculates base premium for a single sword', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    expect(calculateBasePremium(items)).toBe(100);
  });

  it('calculates base premium for a single amulet', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    expect(calculateBasePremium(items)).toBe(60);
  });

  it('calculates base premium for components individually', () => {
    const items: Item[] = [
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'silver', enchantment: 0, cursed: false },
    ];
    expect(calculateBasePremium(items)).toBe(50); // 25 + 25
  });

  it('calculates base premium for 3 alike components', () => {
    const items: Item[] = [
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
    ];
    expect(calculateBasePremium(items)).toBe(60); // group of 3
  });

  it('calculates base premium for 4 components (1 group of 3 + 1 single)', () => {
    const items: Item[] = [
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
    ];
    expect(calculateBasePremium(items)).toBe(85); // 60 + 25
  });

  it('calculates base premium for mixed components', () => {
    const items: Item[] = [
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'silver', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'silver', enchantment: 0, cursed: false },
    ];
    expect(calculateBasePremium(items)).toBe(110); // 60 (runes) + 50 (moonstones)
  });
});

describe('Pricing - Modifiers', () => {
  it('applies cursed item surcharge (+50%)', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
    ];
    const customer: Customer = { yearsWithMHPCO: 0 };
    // Base: 100, cursed: 100 * 1.5 = 150, first insurance: 150 * 1.1 = 165, fee: 165 + 5 = 170
    expect(calculatePremium(items, customer, true)).toBe(170);
  });

  it('applies highly enchanted surcharge (+30%) for enchantment >= 5', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 5, cursed: false },
    ];
    const customer: Customer = { yearsWithMHPCO: 0 };
    // Base: 100, enchanted: 100 * 1.3 = 130, first insurance: 130 * 1.1 = 143, fee: 143 + 5 = 148
    expect(calculatePremium(items, customer, true)).toBe(148);
  });

  it('applies first insurance surcharge (+10%)', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const customer: Customer = { yearsWithMHPCO: 0 };
    // Base: 100, first insurance: 100 * 1.1 = 110, fee: 110 + 5 = 115
    expect(calculatePremium(items, customer, true)).toBe(115);
  });

  it('applies loyalty discount (-20%) for customers with >= 2 years', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const customer: Customer = { yearsWithMHPCO: 2 };
    // Base: 100, first insurance: 100 * 1.1 = 110, loyalty: 110 * 0.8 = 88, fee: 88 + 5 = 93
    expect(calculatePremium(items, customer, true)).toBe(93);
  });

  it('applies repeat customer discount (-15%) for non-first contracts', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const customer: Customer = { yearsWithMHPCO: 0 };
    // Base: 100, repeat: 100 * 0.85 = 85, fee: 85 + 5 = 90
    expect(calculatePremium(items, customer, false)).toBe(90);
  });

  it('applies all modifiers correctly (cursed, enchanted, loyal, repeat)', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 5, cursed: true },
    ];
    const customer: Customer = { yearsWithMHPCO: 2 };
    // Base: 100
    // Cursed: 100 * 1.5 = 150
    // Enchanted: 150 * 1.3 = 195
    // Repeat: 195 * 0.85 = 165.75
    // Loyalty: 165.75 * 0.8 = 132.6
    // Fee: 132.6 + 5 = 137.6
    // Rounded up: 138
    expect(calculatePremium(items, customer, false)).toBe(138);
  });

  it('rounds up in MHPCO favor', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const customer: Customer = { yearsWithMHPCO: 0 };
    // Base: 100, first insurance: 100 * 1.1 = 110, fee: 110 + 5 = 115
    const result = calculatePremium(items, customer, true);
    expect(result).toEqual(115);
  });
});

describe('Pricing - Example 1', () => {
  it('calculates correct premium for unenchanted steel sword (new customer)', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const customer: Customer = { yearsWithMHPCO: 0 };
    // Base: 100, first insurance: 100 * 1.1 = 110, fee: 110 + 5 = 115
    expect(calculatePremium(items, customer, true)).toBe(115);
  });
});
