import { describe, it, expect } from 'vitest';
import { calculateQuote } from './quote';

describe('Quote calculation', () => {
  describe('basic items', () => {
    it('should quote a single sword', () => {
      const items = [{ type: 'sword', cursed: false, enchantment: 0 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 base + 10 first insurance + 5 fee = 115
      expect(premium).toBe(115);
    });

    it('should quote a single amulet', () => {
      const items = [{ type: 'amulet', cursed: false, enchantment: 0 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 60 base + 6 first insurance + 5 fee = 71
      expect(premium).toBe(71);
    });

    it('should quote empty item list', () => {
      const items: any[] = [];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // Only processing fee
      expect(premium).toBe(5);
    });

    it('should quote multiple items', () => {
      const items = [
        { type: 'sword', cursed: false, enchantment: 0 },
        { type: 'amulet', cursed: false, enchantment: 0 },
      ];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 + 60 = 160 base
      // 10 + 6 = 16 first insurance
      // 5 fee
      // = 181
      expect(premium).toBe(181);
    });
  });

  describe('components and blocks', () => {
    it('should quote 2 runes', () => {
      const items = [
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
      ];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 25 + 25 = 50 base + 5 first insurance + 5 fee = 60
      expect(premium).toBe(60);
    });

    it('should quote 3 runes as a block', () => {
      const items = [
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
      ];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 60 block + 6 first insurance + 5 fee = 71
      expect(premium).toBe(71);
    });

    it('should quote 4 runes without block', () => {
      const items = [
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
      ];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 base (4 x 25) + 10 first insurance + 5 fee = 115
      expect(premium).toBe(115);
    });

    it('should quote 3 runes + 3 moonstones as two blocks', () => {
      const items = [
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'moonstone', cursed: false, enchantment: 0 },
        { type: 'moonstone', cursed: false, enchantment: 0 },
        { type: 'moonstone', cursed: false, enchantment: 0 },
      ];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 60 + 60 = 120 base (two blocks) + 12 first insurance + 5 fee = 137
      expect(premium).toBe(137);
    });

    it('should quote 2 runes + 1 moonstone without blocks', () => {
      const items = [
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'rune', cursed: false, enchantment: 0 },
        { type: 'moonstone', cursed: false, enchantment: 0 },
      ];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 75 base (3 x 25) + 7.5 first insurance + 5 fee = 87.5 -> 88 (round up)
      expect(premium).toBe(88);
    });
  });

  describe('cursed modifier', () => {
    it('should add 50% surcharge for cursed items', () => {
      const items = [{ type: 'sword', cursed: true, enchantment: 0 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 base + 50 curse + 10 first insurance + 5 fee = 165
      expect(premium).toBe(165);
    });

    it('should apply curse surcharge to specific item only', () => {
      const items = [
        { type: 'sword', cursed: true, enchantment: 0 },
        { type: 'amulet', cursed: false, enchantment: 0 },
      ];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // Policy base: 100 + 60 = 160
      // Item mods: 50 curse on sword
      // Items: 150 + 60 = 210
      // Policy mods: 10% first insurance of 160 = 16
      // Total: 210 + 16 + 5 fee = 231
      expect(premium).toBe(231);
    });
  });

  describe('enchantment modifier', () => {
    it('should add 30% surcharge for enchantment >= 5', () => {
      const items = [{ type: 'sword', cursed: false, enchantment: 5 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 base + 30 enchantment + 10 first insurance + 5 fee = 145
      expect(premium).toBe(145);
    });

    it('should not apply surcharge for enchantment < 5', () => {
      const items = [{ type: 'sword', cursed: false, enchantment: 4 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 base + 10 first insurance + 5 fee = 115
      expect(premium).toBe(115);
    });

    it('should apply both curse and enchantment surcharges', () => {
      const items = [{ type: 'sword', cursed: true, enchantment: 5 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195
      expect(premium).toBe(195);
    });
  });

  describe('customer modifiers', () => {
    it('should apply loyalty discount for customers >= 2 years', () => {
      const items = [{ type: 'sword', cursed: false, enchantment: 0 }];
      const customer = { yearsWithMHPCO: 2 };
      const premium = calculateQuote(items, customer, false);
      // Policy base: 100
      // Loyalty discount (20% of 100): -20
      // Follow-up discount (15% of 100): -15
      // Fee: +5
      // Total: 100 - 20 - 15 + 5 = 70
      expect(premium).toBe(70);
    });

    it('should not apply loyalty discount for customers < 2 years', () => {
      const items = [{ type: 'sword', cursed: false, enchantment: 0 }];
      const customer = { yearsWithMHPCO: 1 };
      const premium = calculateQuote(items, customer, false);
      // 100 base + 10 first insurance + 5 fee = 115
      expect(premium).toBe(115);
    });

    it('should apply first insurance surcharge for first quote', () => {
      const items = [{ type: 'sword', cursed: false, enchantment: 0 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, true);
      // 100 base + 10 first insurance + 5 fee = 115
      // (this is the first quote)
      expect(premium).toBe(115);
    });

    it('should apply follow-up contract discount for subsequent quotes', () => {
      const items = [{ type: 'sword', cursed: false, enchantment: 0 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, false);
      // 100 base - 15 follow-up + 5 fee = 90
      expect(premium).toBe(90);
    });
  });

  describe('integration examples from spec', () => {
    it('should quote newcomer with cursed sword', () => {
      const items = [{ type: 'sword', cursed: true, enchantment: 3 }];
      const customer = { yearsWithMHPCO: 0 };
      const premium = calculateQuote(items, customer, true);
      // 100 base + 50 curse + 10 first insurance + 5 fee = 165
      expect(premium).toBe(165);
    });

    it('should quote long-standing customer second contract', () => {
      const items = [{ type: 'sword', cursed: true, enchantment: 7 }];
      const customer = { yearsWithMHPCO: 3 };
      const premium = calculateQuote(items, customer, false);
      // Policy base: 100
      // Item mods: 50 curse + 30 enchantment
      // Policy mods: -20 loyalty + 10 first insurance - 15 follow-up (all % of policy base 100)
      // 100 + 50 + 30 - 20 + 10 - 15 + 5 fee = 160
      expect(premium).toBe(160);
    });
  });
});
