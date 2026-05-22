import { describe, it, expect } from 'vitest';
import { quote } from './quote.js';

describe('quote', () => {
  describe('base item premiums', () => {
    it('charges 100 G for a sword (first-time customer, no modifiers)', () => {
      // base 100, +10% first insurance = 110, +5 fee = 115
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { contractIndex: 0 }
      );
      expect(result).toBe(115);
    });

    it('charges 60 G for an amulet base', () => {
      // base 60, +10% first = 66, +5 = 71
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }],
        { contractIndex: 0 }
      );
      expect(result).toBe(71);
    });

    it('charges 80 G for a staff base', () => {
      // base 80, +10% = 88, +5 = 93
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'staff', material: 'oak', enchantment: 0, cursed: false }],
        { contractIndex: 0 }
      );
      expect(result).toBe(93);
    });

    it('charges 40 G for a potion base', () => {
      // base 40, +10% = 44, +5 = 49
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }],
        { contractIndex: 0 }
      );
      expect(result).toBe(49);
    });
  });

  describe('component pricing', () => {
    it('charges 25 G per single component', () => {
      // 1 rune = 25, +10% = 27.5 -> 28, +5 = 33
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'rune' }],
        { contractIndex: 0 }
      );
      expect(result).toBe(33);
    });

    it('charges 60 G for a building block of 3 alike components', () => {
      // 3 runes = 60 special, +10% = 66, +5 = 71
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        { contractIndex: 0 }
      );
      expect(result).toBe(71);
    });

    it('charges 60 G + 25 G = 85 G for 4 alike components', () => {
      // 4 runes = 60 + 25 = 85, +10% = 93.5 -> 94, +5 = 99
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        { contractIndex: 0 }
      );
      expect(result).toBe(99);
    });

    it('charges 120 G for 6 alike components (two building blocks)', () => {
      // 6 runes = 60 + 60 = 120, +10% = 132, +5 = 137
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        ],
        { contractIndex: 0 }
      );
      expect(result).toBe(137);
    });

    it('counts runes and moonstones separately for building blocks', () => {
      // 3 runes (60) + 2 moonstones (50) = 110, +10% = 121, +5 = 126
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'moonstone' }, { type: 'moonstone' },
        ],
        { contractIndex: 0 }
      );
      expect(result).toBe(126);
    });
  });

  describe('per-item surcharges', () => {
    it('adds 50% for cursed items', () => {
      // sword cursed: 100 * 1.5 = 150, +10% first = 165, +5 = 170
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }],
        { contractIndex: 0 }
      );
      expect(result).toBe(170);
    });

    it('adds 30% for highly enchanted items (>=5)', () => {
      // sword ench 5: 100 * 1.3 = 130, +10% = 143, +5 = 148
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        { contractIndex: 0 }
      );
      expect(result).toBe(148);
    });

    it('stacks cursed and high enchantment multiplicatively', () => {
      // sword cursed ench 5: 100 * 1.5 * 1.3 = 195, +10% = 214.5 -> 215, +5 = 220
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }],
        { contractIndex: 0 }
      );
      expect(result).toBe(220);
    });
  });

  describe('customer-level modifiers', () => {
    it('applies 20% loyalty discount for >=2 years', () => {
      // sword 100, loyalty 0.8 = 80, +10% first = 88, +5 = 93
      const result = quote(
        { yearsWithMHPCO: 2 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { contractIndex: 0 }
      );
      expect(result).toBe(93);
    });

    it('does NOT apply first insurance surcharge for later contracts; instead -15%', () => {
      // sword 100, no first surcharge, -15% subsequent = 85, +5 = 90
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { contractIndex: 1 }
      );
      expect(result).toBe(90);
    });

    it('combines loyalty and subsequent discount', () => {
      // sword 100 * 0.8 * 0.85 = 68, +5 = 73
      const result = quote(
        { yearsWithMHPCO: 5 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { contractIndex: 2 }
      );
      expect(result).toBe(73);
    });
  });

  describe('rounding', () => {
    it('rounds up (in MHPCO favor)', () => {
      // amulet 60 * 1.5 cursed = 90, +10% first = 99, +5 = 104 (exact)
      // try: rune 25 * 1.5 cursed = 37.5 -> 38, +10% = 41.8 -> 42, +5 = 47
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: 'rune', cursed: true }],
        { contractIndex: 0 }
      );
      expect(result).toBe(47);
    });
  });
});
