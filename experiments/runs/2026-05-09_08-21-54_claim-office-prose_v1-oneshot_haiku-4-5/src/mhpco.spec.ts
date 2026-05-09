import { describe, it, expect } from 'vitest';
import { MHPCO } from './mhpco.js';
import { Customer, Item } from './types.js';

describe('MHPCO', () => {
  describe('quoting', () => {
    it('should quote a single sword for a new customer', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Sword: 100G base
      // First insurance: +10% = 110G
      // Processing: +5G = 115G
      expect(premium).toBe(115);
    });

    it('should quote an amulet for a customer with 5 years', () => {
      const customer: Customer = { yearsWithMHPCO: 5 };
      const items: Item[] = [
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Amulet: 60G base
      // Long-standing: -20% = 48G
      // Processing: +5G = 53G
      expect(premium).toBe(53);
    });

    it('should apply cursed item surcharge', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Sword: 100G base
      // Cursed: +50% = 150G
      // First insurance: +10% = 165G
      // Processing: +5G = 170G
      expect(premium).toBe(170);
    });

    it('should apply highly enchanted surcharge for enchantment >= 5', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 5, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Sword: 100G base
      // Highly enchanted: +30% = 130G
      // First insurance: +10% = 143G
      // Processing: +5G = 148G
      expect(premium).toBe(148);
    });

    it('should apply multiple surcharges', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 5, cursed: true }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Sword: 100G base
      // Cursed: +50% = 150G
      // Highly enchanted: +30% = 195G
      // First insurance: +10% = 214.5G
      // Processing: +5G = 219.5G -> 220G (round up)
      expect(premium).toBe(220);
    });

    it('should quote multiple items', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Sword: 100G + Amulet: 60G = 160G
      // First insurance: +10% = 176G
      // Processing: +5G = 181G
      expect(premium).toBe(181);
    });

    it('should apply component group discount for 3 alike components', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'crystal', enchantment: 1, cursed: false },
        { type: 'rune', material: 'crystal', enchantment: 1, cursed: false },
        { type: 'rune', material: 'crystal', enchantment: 1, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // 3 runes as group: 60G
      // First insurance: +10% = 66G
      // Processing: +5G = 71G
      expect(premium).toBe(71);
    });

    it('should quote single components at normal rate', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'rune', material: 'crystal', enchantment: 1, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Single rune: 25G
      // First insurance: +10% = 27.5G
      // Processing: +5G = 32.5G -> 33G (round up)
      expect(premium).toBe(33);
    });

    it('should apply subsequent contract discount', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      mhpco.quote(items); // first quote
      const premium = mhpco.quote(items); // second quote
      // Sword: 100G base
      // Subsequent contract: -15% = 85G
      // Processing: +5G = 90G
      expect(premium).toBe(90);
    });

    it('should round in MHPCO favor (up)', () => {
      const customer: Customer = { yearsWithMHPCO: 5 };
      const items: Item[] = [
        { type: 'staff', material: 'wood', enchantment: 3, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Staff: 80G
      // Long-standing: -20% = 64G
      // Processing: +5G = 69G
      expect(premium).toBe(69);
    });

    it('should quote potion correctly', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'potion', material: 'liquid', enchantment: 1, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      const premium = mhpco.quote(items);
      // Potion: 40G
      // First insurance: +10% = 44G
      // Processing: +5G = 49G
      expect(premium).toBe(49);
    });
  });

  describe('claiming', () => {
    it('should claim damage to an amulet', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      mhpco.quote(items);
      const result = mhpco.claim(0, [
        { itemType: 'amulet', amount: 200 }
      ]);
      // Damage: 200G
      // Deductible: -100G = 100G payout
      // Cap: 2 * 600G (insurance value) = 1200G
      // Remaining: 1200G - 100G = 1100G
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1100);
    });

    it('should apply deductible per claim', () => {
      const customer: Customer = { yearsWithMHPCO: 5 };
      const items: Item[] = [
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      mhpco.quote(items);
      const result1 = mhpco.claim(0, [
        { itemType: 'amulet', amount: 200 }
      ]);
      const result2 = mhpco.claim(0, [
        { itemType: 'amulet', amount: 250 }
      ]);
      expect(result1.payout).toBe(100); // 200 - 100
      expect(result2.payout).toBe(150); // 250 - 100
      expect(result2.remainingCap).toBe(950); // 1200 - 100 - 150
    });

    it('should handle high enchantment damage at 50% reimbursement', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 8, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      mhpco.quote(items);
      const result = mhpco.claim(0, [
        { itemType: 'sword', amount: 500 }
      ]);
      // Damage: 500G
      // High enchantment: 50% = 250G
      // Deductible: -100G = 150G payout
      // Cap: 2 * 1000G = 2000G
      // Remaining: 2000G - 150G = 1850G
      expect(result.payout).toBe(150);
      expect(result.remainingCap).toBe(1850);
    });

    it('should handle dragon material at 100% reimbursement', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'dragon', enchantment: 3, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      mhpco.quote(items);
      const result = mhpco.claim(0, [
        { itemType: 'sword', amount: 400 }
      ]);
      // Damage: 400G
      // Dragon material: 100% = 400G
      // Deductible: -100G = 300G payout
      // Cap: 2 * 1000G = 2000G
      // Remaining: 2000G - 300G = 1700G
      expect(result.payout).toBe(300);
      expect(result.remainingCap).toBe(1700);
    });

    it('should respect the policy cap', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      mhpco.quote(items);
      // Insurance value: 600G, cap: 1200G
      mhpco.claim(0, [{ itemType: 'amulet', amount: 700 }]); // 600 payout
      const result = mhpco.claim(0, [{ itemType: 'amulet', amount: 900 }]); // 600 payout
      // First claim: 700 - 100 = 600 payout
      // Remaining cap: 1200 - 600 = 600G
      // Second claim: 900 - 100 = 800, but capped at 600G
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    });

    it('should handle multiple damages in one claim', () => {
      const customer: Customer = { yearsWithMHPCO: 0 };
      const items: Item[] = [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
      ];
      const mhpco = new MHPCO(customer);
      mhpco.quote(items);
      const result = mhpco.claim(0, [
        { itemType: 'sword', amount: 200 },
        { itemType: 'amulet', amount: 150 }
      ]);
      // Total damage: 350G
      // Deductible: -100G = 250G payout
      expect(result.payout).toBe(250);
    });
  });
});
