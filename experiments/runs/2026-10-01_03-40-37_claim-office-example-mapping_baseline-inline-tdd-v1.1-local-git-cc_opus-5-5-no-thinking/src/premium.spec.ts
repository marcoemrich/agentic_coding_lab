import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium';

const newcomer = { yearsWithMHPCO: 0 };
const many = (type: string, n: number) => Array.from({ length: n }, () => ({ type }));

// For a newcomer's first contract: premium = ceil(base * 1.1) + 5
describe('quotePremium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  describe('component building blocks', () => {
    it.each([
      [2, 60], // 50 base
      [3, 71], // 60 base
      [4, 115], // 100 base
      [7, 198], // 175 base -> 192.5 -> 193
    ])('%i runes cost %i', (n, premium) => {
      expect(quotePremium(many('rune', n), newcomer, 0)).toBe(premium);
    });

    it('does not form a block from different component types', () => {
      // 75 base -> 82.5 -> 83 + 5
      expect(quotePremium([...many('rune', 2), { type: 'moonstone' }], newcomer, 0)).toBe(88);
    });

    it('forms separate blocks per component type', () => {
      // 120 base -> 132 + 5
      expect(quotePremium([...many('rune', 3), ...many('moonstone', 3)], newcomer, 0)).toBe(137);
    });
  });

  describe('modifiers', () => {
    it('applies the curse surcharge only to the cursed item', () => {
      // 160 base + 50 curse + 16 first insurance + 5 fee
      expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }], newcomer, 0)).toBe(231);
    });

    it('applies high-enchantment surcharge at exactly enchantment 5', () => {
      // 100 + 30 + 10 + 5
      expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, 0)).toBe(145);
    });

    it('applies both surcharges to a cursed sword with enchantment 5', () => {
      expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer, 0)).toBe(195);
    });

    it('applies no high-enchantment surcharge at enchantment 4', () => {
      expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, 0)).toBe(115);
    });

    it('grants loyalty discount at exactly 2 years', () => {
      // 100 - 20 + 10 + 5
      expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
    });

    it('grants no loyalty discount below 2 years', () => {
      expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
    });

    it('grants follow-up contract discount after the first contract', () => {
      // 100 + 10 - 15 + 5
      expect(quotePremium([{ type: 'sword' }], newcomer, 1)).toBe(100);
    });

    it('rounds the premium up in the MHPCO favor', () => {
      // 3 moonstones (60) + 2 runes (50) + potion (40) = 150, follow-up: 150+15-22.5 = 142.5 -> 143 + 5
      expect(quotePremium([...many('moonstone', 3), ...many('rune', 2), { type: 'potion' }], newcomer, 1)).toBe(148);
    });
  });

  describe('integration', () => {
    it('newcomer with a cursed sword pays 165', () => {
      expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer, 0)).toBe(165);
    });

    it("long-standing customer's second contract pays 160", () => {
      expect(
        quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], { yearsWithMHPCO: 3 }, 1),
      ).toBe(160);
    });
  });

  it('rejects unknown item types', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], newcomer, 0)).toThrow(/broomstick/);
  });
});
