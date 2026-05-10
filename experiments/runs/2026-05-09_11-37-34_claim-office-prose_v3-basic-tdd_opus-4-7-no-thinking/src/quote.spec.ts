import { describe, it, expect } from 'vitest';
import { computeQuote } from './quote.js';
import type { Customer, Item } from './types.js';

describe('computeQuote', () => {
  describe('base premiums by item type', () => {
    it('quotes a single sword for a brand-new customer', () => {
      // base 100 + 10% first-insurance = 110, +5 fee = 115
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(115);
    });

    it('quotes a single amulet for a 5-year customer', () => {
      // 60 * 0.8 (loyalty) = 48, * 1.10 (first) = 52.8, +5 = 57.8 -> round up = 58
      const customer: Customer = { yearsWithMHPCO: 5 };
      const items: Item[] = [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(58);
    });

    it('quotes a single staff for a brand-new customer', () => {
      // 80 * 1.10 = 88, +5 = 93
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'staff', material: 'oak', enchantment: 1, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(93);
    });

    it('quotes a single potion for a brand-new customer', () => {
      // 40 * 1.10 = 44, +5 = 49
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(49);
    });
  });

  describe('component bundles', () => {
    it('charges 25G per single rune', () => {
      // 1 rune: 25 * 1.10 = 27.5 + 5 = 32.5 -> 33
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(33);
    });

    it('charges 60G for a bundle of 3 alike runes', () => {
      // 60 * 1.10 = 66 + 5 = 71
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ];
      expect(computeQuote(customer, items, 0)).toBe(71);
    });

    it('charges 60G + 25G for 4 alike runes', () => {
      // 60 + 25 = 85, * 1.10 = 93.5 + 5 = 98.5 -> 99
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ];
      expect(computeQuote(customer, items, 0)).toBe(99);
    });

    it('charges 60G for 3 alike moonstones', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'moonstone', material: 'moonstone', enchantment: 0, cursed: false },
        { type: 'moonstone', material: 'moonstone', enchantment: 0, cursed: false },
        { type: 'moonstone', material: 'moonstone', enchantment: 0, cursed: false },
      ];
      // 60 * 1.10 = 66 + 5 = 71
      expect(computeQuote(customer, items, 0)).toBe(71);
    });
  });

  describe('modifiers', () => {
    it('applies 50% cursed surcharge per item', () => {
      // sword 100 cursed: 100 * 1.5 = 150, * 1.10 = 165 + 5 = 170
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }];
      expect(computeQuote(customer, items, 0)).toBe(170);
    });

    it('applies 30% high enchantment surcharge for enchantment >= 5', () => {
      // sword 100, enchant 5: 100 * 1.3 = 130, * 1.10 = 143 + 5 = 148
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(148);
    });

    it('stacks cursed and high enchantment surcharges multiplicatively', () => {
      // 100 * 1.5 * 1.3 = 195, * 1.10 = 214.5 + 5 = 219.5 -> 220
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
      expect(computeQuote(customer, items, 0)).toBe(220);
    });

    it('applies 20% loyalty discount for >= 2 years', () => {
      // 100, * 0.8 = 80, * 1.10 = 88 + 5 = 93
      const customer: Customer = { yearsWithMHPCO: 2 };
      const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(93);
    });

    it('does not apply loyalty discount for < 2 years', () => {
      const customer: Customer = { yearsWithMHPCO: 1 };
      const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
      // 100 * 1.10 + 5 = 115
      expect(computeQuote(customer, items, 0)).toBe(115);
    });

    it('applies 15% subsequent contract discount on contracts after first', () => {
      // contract index 1: 100 * 0.85 = 85 + 5 = 90
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
      expect(computeQuote(customer, items, 1)).toBe(90);
    });

    it('rounds up to whole G in MHPCOs favor', () => {
      // 60 * 0.8 = 48, * 1.10 = 52.8 + 5 = 57.8 -> 58 (round up)
      const customer: Customer = { yearsWithMHPCO: 5 };
      const items: Item[] = [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }];
      expect(computeQuote(customer, items, 0)).toBe(58);
    });
  });
});
