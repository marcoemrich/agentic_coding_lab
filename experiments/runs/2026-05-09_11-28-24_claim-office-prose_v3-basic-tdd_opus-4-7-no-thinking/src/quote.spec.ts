import { describe, it, expect } from 'vitest';
import { quote } from './quote.js';
import type { Customer, Item } from './types.js';

describe('quote', () => {
  describe('basic single item', () => {
    it('quotes a plain sword for a brand-new customer (first contract)', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      ];
      // Base 100, no item modifiers, first insurance +10%, +5G fee
      // 100 * 1.10 = 110, +5 = 115
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(115);
      expect(result.insuranceSum).toBe(1000);
    });

    it('quotes a plain amulet', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
      ];
      // 60 * 1.10 = 66, +5 = 71
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(71);
      expect(result.insuranceSum).toBe(600);
    });

    it('quotes a plain staff', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'staff', material: 'oak', enchantment: 0, cursed: false },
      ];
      // 80 * 1.10 = 88, +5 = 93
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(93);
      expect(result.insuranceSum).toBe(800);
    });

    it('quotes a plain potion', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'potion', material: 'glass', enchantment: 0, cursed: false },
      ];
      // 40 * 1.10 = 44, +5 = 49
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(49);
      expect(result.insuranceSum).toBe(400);
    });
  });

  describe('item modifiers', () => {
    it('applies cursed surcharge (50%)', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
      ];
      // 100 * 1.5 = 150, * 1.10 = 165, +5 = 170
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(170);
    });

    it('applies high-enchantment surcharge (30%) at level 5', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 5, cursed: false },
      ];
      // 100 * 1.3 = 130, * 1.10 = 143, +5 = 148
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(148);
    });

    it('does not apply enchantment surcharge below 5', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 4, cursed: false },
      ];
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(115);
    });

    it('stacks cursed and high-enchantment surcharges', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
      ];
      // 100 * 1.5 * 1.3 = 195, * 1.10 = 214.5, +5 = 219.5 -> ceil = 220
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(220);
    });
  });

  describe('components', () => {
    it('quotes a single rune', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ];
      // 25 * 1.10 = 27.5, +5 = 32.5 -> ceil 33
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(33);
      expect(result.insuranceSum).toBe(250);
    });

    it('bundles 3 alike components at 60G base', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ];
      // Bundle base 60, * 1.10 = 66, +5 = 71
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(71);
      expect(result.insuranceSum).toBe(750); // 3 * 250
    });

    it('does not bundle 2 components', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ];
      // 25 + 25 = 50, * 1.10 = 55, +5 = 60
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(60);
    });

    it('bundles 3 of one kind, leaves singletons of other kinds', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'moonstone', material: 'crystal', enchantment: 0, cursed: false },
      ];
      // 60 (bundle) + 25 (moonstone) = 85, * 1.10 = 93.5, +5 = 98.5 -> ceil 99
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(99);
    });
  });

  describe('customer modifiers', () => {
    it('applies loyalty discount for >=2 years', () => {
      const customer: Customer = { yearsWithMHPCO: 2 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ];
      // 100 * 0.8 * 1.10 = 88, +5 = 93
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(93);
    });

    it('applies repeat-contract discount on second contract', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ];
      // contractIndex=1 (second contract): 100 * 0.85 = 85, +5 = 90
      const result = quote(items, customer, 1);
      expect(result.premium).toBe(90);
    });

    it('combines loyalty discount with repeat discount', () => {
      const customer: Customer = { yearsWithMHPCO: 5 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ];
      // 100 * 0.8 * 0.85 = 68, +5 = 73
      const result = quote(items, customer, 1);
      expect(result.premium).toBe(73);
    });
  });

  describe('rounding', () => {
    it('rounds up in MHPCO favor', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ];
      // 25 * 1.10 = 27.5 + 5 = 32.5 -> 33
      const result = quote(items, customer, 0);
      expect(result.premium).toBe(33);
    });
  });
});
