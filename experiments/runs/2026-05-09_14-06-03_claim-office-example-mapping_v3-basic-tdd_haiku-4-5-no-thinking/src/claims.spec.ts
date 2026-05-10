import { describe, it, expect } from 'vitest';
import { calculateClaim } from './claims';

describe('calculateClaim', () => {
  describe('standard reimbursement', () => {
    it('reimburses regular sword with deductible', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 500 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it('reimburses rune damage with deductible', () => {
      const policy = {
        items: [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }],
      };
      const damages = [{ itemType: 'rune', amount: 200 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 100, remainingCap: 400 });
      // Rune insurance: 250, Cap: 500, Payout: 200 - 100 = 100, Remaining: 500 - 100 = 400
    });
  });

  describe('high enchantment clause (50% reimbursement)', () => {
    it('applies 50% reimbursement for enchantment level >= 8', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 1000 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
      // 50% of 1000 = 500, minus 100 deductible = 400
    });

    it('does not apply for enchantment level < 8', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 1000 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 900, remainingCap: 1100 });
      // Full reimbursement: 1000 - 100 deductible = 900, Cap: 2000, Remaining: 2000 - 900 = 1100
    });
  });

  describe('dragon material clause (full reimbursement)', () => {
    it('reimburses full damage for dragon material', () => {
      const policy = {
        items: [{ type: 'sword', material: 'dragon', enchantment: 0, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 1000 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 900, remainingCap: 1100 });
      // Full reimbursement: 1000 - 100 deductible = 900
    });

    it('applies 50% rule over dragon rule when enchantment >= 8', () => {
      const policy = {
        items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 1000 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
      // 50% of 1000 = 500, minus 100 deductible = 400
    });

    it('applies dragon rule when enchantment < 8', () => {
      const policy = {
        items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 800 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
      // Full reimbursement: 800 - 100 deductible = 700
    });
  });

  describe('deductible', () => {
    it('applies 100G deductible per damage event', () => {
      const policy = {
        items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ],
      };
      const damages = [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
      // Sword: 500 - 100 = 400, Amulet: 300 - 100 = 200, Total: 600
      // Insurance: 1000 + 600 = 1600, Cap: 3200, Remaining: 3200 - 600 = 2600
    });
  });

  describe('cap exhaustion', () => {
    it('caps payout at twice the insurance sum', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 3000 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 2000, remainingCap: 0 });
      // Insurance: 1000, Cap: 2000, Damage: 3000 - 100 = 2900, but capped at 2000
    });

    it('applies deductible before cap', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: 1500 }];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 1400, remainingCap: 600 });
      // 1500 - 100 = 1400, which is less than cap (2000)
    });

    it('tracks remaining cap across multiple claims', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
      };
      const damages1 = [{ itemType: 'sword', amount: 1500 }];
      const result1 = calculateClaim(policy, damages1);
      expect(result1).toEqual({ payout: 1400, remainingCap: 600 });

      // Second claim with updated policy cap
      const damages2 = [{ itemType: 'sword', amount: 1500 }];
      const result2 = calculateClaim(
        { ...policy, remainingCap: 600 },
        damages2
      );
      expect(result2).toEqual({ payout: 600, remainingCap: 0 });
      // 1500 - 100 = 1400, but only 600 cap remaining
    });
  });

  describe('multiple items of same type', () => {
    it('allows multiple items of same type', () => {
      const policy = {
        items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
        ],
      };
      const damages = [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ];
      const result = calculateClaim(policy, damages);
      expect(result).toEqual({ payout: 800, remainingCap: 3200 });
      // Each damage: 500 - 100 = 400, Total: 800, Cap: 2*2000 = 4000
    });

    it('rejects damages for items not in policy', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
      };
      const damages = [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ];
      expect(() => {
        calculateClaim(policy, damages);
      }).toThrow();
      // More sword damages than swords in policy
    });
  });

  describe('error handling', () => {
    it('rejects negative damage amounts', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
      };
      const damages = [{ itemType: 'sword', amount: -200 }];
      expect(() => {
        calculateClaim(policy, damages);
      }).toThrow();
    });

    it('rejects damage for items not in policy', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
      };
      const damages = [{ itemType: 'amulet', amount: 200 }];
      expect(() => {
        calculateClaim(policy, damages);
      }).toThrow();
    });

    it('rejects damage for unknown item types', () => {
      const policy = {
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
      };
      const damages = [{ itemType: 'broomstick', amount: 200 }];
      expect(() => {
        calculateClaim(policy, damages);
      }).toThrow();
    });
  });
});
