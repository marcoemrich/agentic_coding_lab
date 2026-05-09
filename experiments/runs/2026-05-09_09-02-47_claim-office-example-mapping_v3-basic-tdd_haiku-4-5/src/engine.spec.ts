import { describe, it, expect } from 'vitest';
import { Engine } from './engine';

describe('MHPCO Claim Office Engine', () => {
  const engine = new Engine();

  describe('Basic item values and base premiums', () => {
    it('should quote a sword', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword' }],
        isFirstInsurance: true,
      });
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result).toBe(115);
    });

    it('should quote an amulet', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'amulet' }],
        isFirstInsurance: true,
      });
      // 60 base + 10 first insurance + 5 fee = 75
      expect(result).toBe(75);
    });

    it('should quote a staff', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'staff' }],
        isFirstInsurance: true,
      });
      // 80 base + 10 first insurance + 5 fee = 95
      expect(result).toBe(95);
    });

    it('should quote a potion', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'potion' }],
        isFirstInsurance: true,
      });
      // 40 base + 10 first insurance + 5 fee = 55
      expect(result).toBe(55);
    });

    it('should quote a single component', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'rune' }],
        isFirstInsurance: true,
      });
      // 25 base + 10 first insurance + 5 fee = 40
      expect(result).toBe(40);
    });
  });

  describe('Component blocks', () => {
    it('should quote 2 runes at regular rate', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'rune' }, { type: 'rune' }],
        isFirstInsurance: true,
      });
      // 25 + 25 = 50 base + 10 first insurance + 5 fee = 65
      expect(result).toBe(65);
    });

    it('should quote 3 runes with block discount', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        isFirstInsurance: true,
      });
      // 60 block base + 10 first insurance + 5 fee = 75
      expect(result).toBe(75);
    });

    it('should quote 4 runes without block', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
        ],
        isFirstInsurance: true,
      });
      // 25 + 25 + 25 + 25 = 100 base + 10 first insurance + 5 fee = 115
      expect(result).toBe(115);
    });

    it('should quote 7 runes with no block (not multiple of 3)', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
        ],
        isFirstInsurance: true,
      });
      // 25 * 7 = 175 base + 10 first insurance + 5 fee = 190
      expect(result).toBe(190);
    });

    it('should handle mixed components (2 runes + 1 moonstone)', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        isFirstInsurance: true,
      });
      // 25 + 25 + 25 = 75 base (no block: different types) + 10 first insurance + 5 fee = 90
      expect(result).toBe(90);
    });

    it('should handle two separate blocks', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'moonstone' },
          { type: 'moonstone' },
          { type: 'moonstone' },
        ],
        isFirstInsurance: true,
      });
      // 60 + 60 = 120 base + 10 first insurance + 5 fee = 135
      expect(result).toBe(135);
    });
  });

  describe('Cursed items', () => {
    it('should apply 50% curse surcharge to a cursed sword', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', cursed: true }],
        isFirstInsurance: true,
      });
      // 100 base + 50 curse = 150 + 10 first insurance + 5 fee = 165
      expect(result).toBe(165);
    });

    it('should apply curse surcharge only to the cursed item', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [
          { type: 'sword', cursed: true },
          { type: 'amulet', cursed: false },
        ],
        isFirstInsurance: true,
      });
      // 100 base sword + 50 curse = 150
      // 60 base amulet = 60
      // 210 + 10 first insurance + 5 fee = 225
      expect(result).toBe(225);
    });
  });

  describe('Enchantment levels', () => {
    it('should apply 30% surcharge for enchantment >= 5', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', enchantment: 5 }],
        isFirstInsurance: true,
      });
      // 100 base + 30 enchantment surcharge = 130 + 10 first insurance + 5 fee = 145
      expect(result).toBe(145);
    });

    it('should not apply surcharge for enchantment < 5', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', enchantment: 4 }],
        isFirstInsurance: true,
      });
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result).toBe(115);
    });

    it('should apply both curse and enchantment surcharges', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', cursed: true, enchantment: 5 }],
        isFirstInsurance: true,
      });
      // 100 base + 50 curse + 30 enchantment = 180 + 10 first insurance + 5 fee = 195
      expect(result).toBe(195);
    });
  });

  describe('Customer history and modifiers', () => {
    it('should apply loyalty discount for 2+ years', () => {
      const result = engine.quote({
        yearsWithMHPCO: 2,
        items: [{ type: 'sword' }],
        isFirstInsurance: false,
      });
      // 100 base - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 80
      expect(result).toBe(80);
    });

    it('should not apply loyalty discount for < 2 years', () => {
      const result = engine.quote({
        yearsWithMHPCO: 1,
        items: [{ type: 'sword' }],
        isFirstInsurance: true,
      });
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result).toBe(115);
    });

    it('should apply follow-up contract discount', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword' }],
        isFirstInsurance: false,
      });
      // 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
      expect(result).toBe(100);
    });
  });

  describe('Integration examples', () => {
    it('should quote newcomer with a cursed sword', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', cursed: true, enchantment: 3 }],
        isFirstInsurance: true,
      });
      // 100 + 50 curse + 10 first insurance + 5 fee = 165
      expect(result).toBe(165);
    });

    it('should quote long-standing customer second contract', () => {
      const result = engine.quote({
        yearsWithMHPCO: 3,
        items: [{ type: 'sword', cursed: true, enchantment: 7 }],
        isFirstInsurance: false,
      });
      // 100 + 50 curse + 30 enchantment - 20 loyalty - 15 follow-up + 5 fee = 150
      // Wait, checking the example: it says 160 G total.
      // Let me recalculate: 100 base + 50 curse + 30 enchantment = 180
      // - 20 loyalty = 160
      // - 15 follow-up = 145
      // But the example shows 160. Let me reread...
      // "(100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee = 160 G)"
      // Oh! The first insurance surcharge STILL applies to new items, even on follow-up contracts!
      // "each item in a quote is treated as a first insurance"
      // So: 100 + 50 + 30 - 20 + 10 - 15 = 155, +5 fee = 160
      expect(result).toBe(160);
    });

    it('should handle empty item list', () => {
      const result = engine.quote({
        yearsWithMHPCO: 0,
        items: [],
        isFirstInsurance: true,
      });
      // Only the processing fee (no items, so no first insurance)
      expect(result).toBe(5);
    });
  });

  describe('Claims processing', () => {
    it('should process a simple damage claim', () => {
      const policy = engine.createPolicy({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword' }],
        isFirstInsurance: true,
      });

      const result = engine.claim(policy, [
        { itemType: 'sword', amount: 500 },
      ]);
      // Insurance value: 1000, Cap: 2000
      // Damage: 500 - 100 deductible = 400
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it('should apply 50% reimbursement for enchantment >= 8', () => {
      const policy = engine.createPolicy({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', enchantment: 8 }],
        isFirstInsurance: true,
      });

      const result = engine.claim(policy, [
        { itemType: 'sword', amount: 1000 },
      ]);
      // 1000 * 0.5 = 500, - 100 deductible = 400
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it('should fully reimburse dragon material items', () => {
      const policy = engine.createPolicy({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', material: 'dragon' }],
        isFirstInsurance: true,
      });

      const result = engine.claim(policy, [
        { itemType: 'sword', amount: 800 },
      ]);
      // Full reimbursement: 800 - 100 deductible = 700
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });

    it('should handle both dragon material and high enchantment (high enchantment wins)', () => {
      const policy = engine.createPolicy({
        yearsWithMHPCO: 0,
        items: [
          { type: 'sword', material: 'dragon', enchantment: 9 },
        ],
        isFirstInsurance: true,
      });

      const result = engine.claim(policy, [
        { itemType: 'sword', amount: 1000 },
      ]);
      // Both apply, but 50% wins: 1000 * 0.5 = 500 - 100 = 400
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it('should apply deductible per damage event', () => {
      const policy = engine.createPolicy({
        yearsWithMHPCO: 0,
        items: [
          { type: 'sword' },
          { type: 'amulet' },
        ],
        isFirstInsurance: true,
      });

      const result = engine.claim(policy, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]);
      // Sword: 500 - 100 = 400
      // Amulet: 300 - 100 = 200
      // Total: 600
      // Cap: 1600 * 2 = 3200
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });

    it('should cap payout at 2x insurance sum', () => {
      const policy = engine.createPolicy({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword' }],
        isFirstInsurance: true,
      });

      // First claim
      const result1 = engine.claim(policy, [
        { itemType: 'sword', amount: 1500 },
      ]);
      // 1500 - 100 = 1400, cap at 2000 = 1400
      expect(result1).toEqual({ payout: 1400, remainingCap: 600 });

      // Second claim
      const result2 = engine.claim(policy, [
        { itemType: 'sword', amount: 1500 },
      ]);
      // 1500 - 100 = 1400, but only 600 cap remaining = 600
      expect(result2).toEqual({ payout: 600, remainingCap: 0 });
    });

    it('should handle rounding down for payouts', () => {
      const policy = engine.createPolicy({
        yearsWithMHPCO: 0,
        items: [{ type: 'sword', enchantment: 8 }],
        isFirstInsurance: true,
      });

      // Damage that yields fractional payout
      // 801 * 0.5 = 400.5, round down to 400, - 100 = 300
      const result = engine.claim(policy, [
        { itemType: 'sword', amount: 801 },
      ]);
      expect(result).toEqual({ payout: 300, remainingCap: 1700 });
    });
  });
});
