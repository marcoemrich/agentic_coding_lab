import { describe, it, expect } from 'vitest';
import { calculateQuote } from './quote';

describe('calculateQuote', () => {
  describe('single items', () => {
    it('should calculate premium for a sword', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 100 (base) + 10 (10% first insurance) + 5 (fee) = 115
      expect(result).toBe(115);
    });

    it('should calculate premium for an amulet', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 60 (base) + 6 (10% first insurance) + 5 (fee) = 71
      expect(result).toBe(71);
    });

    it('should calculate premium for a staff', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 80 (base) + 8 (10% first insurance) + 5 (fee) = 93
      expect(result).toBe(93);
    });

    it('should calculate premium for a potion', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'potion', material: 'liquid', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 40 (base) + 4 (10% first insurance) + 5 (fee) = 49
      expect(result).toBe(49);
    });

    it('should calculate premium for a rune component', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 25 (base) + 2.5 (10% first insurance) + 5 (fee) = 32.5 -> 33 (round up)
      expect(result).toBe(33);
    });

    it('should calculate premium for a moonstone component', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'moonstone', material: 'stone', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 25 (base) + 2.5 (10% first insurance) + 5 (fee) = 32.5 -> 33 (round up)
      expect(result).toBe(33);
    });
  });

  describe('cursed items', () => {
    it('should apply 50% curse surcharge to base premium', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }],
        isFirstInsurance: true,
      });
      // 100 (base) + 50 (curse 50% of base) + 10 (10% first insurance of 150) + 5 (fee) = 165
      expect(result).toBe(165);
    });
  });

  describe('highly enchanted items', () => {
    it('should apply 30% surcharge for enchantment >= 5', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        isFirstInsurance: true,
      });
      // 100 (base) + 30 (30% of base) + 10 (10% first insurance of base) + 5 (fee) = 145
      expect(result).toBe(145);
    });

    it('should not apply surcharge for enchantment < 5', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }],
        isFirstInsurance: true,
      });
      // 100 (base) + 10 (10% first insurance) + 5 (fee) = 115
      expect(result).toBe(115);
    });
  });

  describe('component blocks', () => {
    it('should apply block discount for exactly 3 alike components', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        ],
        isFirstInsurance: true,
      });
      // 60 (block) + 6 (10% first insurance) + 5 (fee) = 71
      expect(result).toBe(71);
    });

    it('should not apply block discount for 2 components', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        ],
        isFirstInsurance: true,
      });
      // 50 (2 * 25) + 5 (10% first insurance) + 5 (fee) = 60
      expect(result).toBe(60);
    });

    it('should not apply block discount for 4 components', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        ],
        isFirstInsurance: true,
      });
      // 100 (4 * 25) + 10 (10% first insurance) + 5 (fee) = 115
      expect(result).toBe(115);
    });
  });

  describe('multiple items', () => {
    it('should sum base premiums for multiple items', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ],
        isFirstInsurance: true,
      });
      // 100 + 60 = 160 (base) + 16 (10% first insurance) + 5 (fee) = 181
      expect(result).toBe(181);
    });

    it('should apply item-specific modifiers to each item', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ],
        isFirstInsurance: true,
      });
      // 100 + 60 = 160 (base) + 50 (curse on sword) = 210
      // + 16 (10% first insurance on 160) + 5 (fee) = 231
      expect(result).toBe(231);
    });
  });

  describe('first insurance surcharge', () => {
    it('should apply 10% first insurance surcharge for first contract', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 100 (base) + 10 (first insurance) + 5 (fee) = 115
      expect(result).toBe(115);
    });

    it('should apply first insurance surcharge even for follow-up contracts, but also apply follow-up discount', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        isFirstInsurance: false,
      });
      // 100 (base) + 10 (first insurance) - 15 (follow-up contract 15%) + 5 (fee) = 100
      expect(result).toBe(100);
    });
  });

  describe('loyalty discount', () => {
    it('should apply 20% loyalty discount for customers with >= 2 years', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 2 },
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 100 (base) - 20 (20% loyalty on base) + 10 (first insurance) + 5 (fee) = 95
      expect(result).toBe(95);
    });

    it('should not apply loyalty discount for customers with < 2 years', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 1 },
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        isFirstInsurance: true,
      });
      // 100 (base) + 10 (first insurance) + 5 (fee) = 115
      expect(result).toBe(115);
    });
  });

  describe('empty item list', () => {
    it('should return 5G for empty item list (processing fee only)', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [],
        isFirstInsurance: true,
      });
      // 5 (fee only)
      expect(result).toBe(5);
    });
  });

  describe('integration examples', () => {
    it('newcomer with cursed sword', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        isFirstInsurance: true,
      });
      // 100 + 50 (curse) + 10 (first insurance) + 5 (fee) = 165
      expect(result).toBe(165);
    });

    it('long-standing customer second contract with cursed enchanted sword', () => {
      const result = calculateQuote({
        customer: { yearsWithMHPCO: 3 },
        items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        isFirstInsurance: false,
      });
      // 100 + 50 (curse) + 30 (high enchantment) = 180
      // 180 - 15% follow-up = 152.99... -> wait, this doesn't match the prompt

      // Actually re-reading the prompt example:
      // "100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee = 160 G"
      // That's: 100 + 50 + 30 - 20 + 10 - 15 = 155, so 155 + 5 = 160
      // But wait, that has BOTH first insurance and follow-up? That contradicts what we just learned

      // Let me re-read: "this is the customer's second `quote`"
      // and "The first insurance surcharge still applies to the new sword, even though the customer is on a follow-up contract — each item in a `quote` is treated as a first insurance, regardless of customer history."

      // So for a second quote (isFirstInsurance: false in terms of customer's first contract, but items get first insurance):
      // Actually, looking at the prompt: items always get first insurance, but the POLICY gets follow-up discount if it's not the customer's first policy.
      // But the description says: "Customers receive a 15 % discount on each contract after their first."
      // And: "A first insurance carries a 10 % initial assessment surcharge."

      // So if this is the customer's second contract (isFirstInsurance: false), then:
      // - Items still get first insurance surcharge? NO, the integration example shows the follow-up contract applies instead
      // - Looking more carefully at the integration example, it shows BOTH first insurance AND follow-up discount, which seems contradictory

      // Let me re-read the integration example more carefully:
      // "100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee = 160 G"

      // Wait, the minus signs. Let me parse it as:
      // 100 + 50 + 30 = 180 (base + modifiers)
      // -20 G loyalty discount
      // +10 G first insurance (this is for the items in this quote)
      // -15 G follow-up contract discount
      // This doesn't make sense...

      // Let me re-read: "customer: 3 years with MHPCO; this is the customer's second `quote` in the scenario"
      // "The first insurance surcharge still applies to the new sword, even though the customer is on a follow-up contract — each item in a `quote` is treated as a first insurance, regardless of customer history."

      // So:
      // - 100 G base + 50 G curse + 30 G high enchantment = 180 G
      // - -20 G loyalty (20% of 100 or 180?)
      // - +10 G first insurance (10% of the policy base before loyalty is applied? or 10% of 180?)
      // - -15 G follow-up (15% of the policy after first insurance? or 15% of 180?)

      // The example says "155 G + 5 G fee = 160 G", so 155 is the base before fee.
      // 180 - 20 + 10 - 15 = 155. So loyalty discount applies first on the 180, making it 160. Then first insurance adds 10 to 160? No, that's 170.
      // Let me try: 180 - 20 = 160. Then +10 = 170. Then -15 = 155. Yes! That works.

      // So the order is:
      // 1. Base + item modifiers
      // 2. Loyalty discount (20% of base or of base+modifiers?)
      // 3. First insurance surcharge (10% of remaining or of original base?)
      // 4. Follow-up contract discount (15% of remaining?)

      // The math: 180 - 20 + 10 - 15 = 155
      // If loyalty is 20% of 180: 180 * 0.2 = 36, not 20
      // If loyalty is 20% of 100 (just the base): 100 * 0.2 = 20. This works!

      // So loyalty is 20% of the item's BASE PREMIUM, not the total with modifiers.
      // But wait, that doesn't match the quote rules which say "policy-wide modifiers apply to the policy base premium"

      // Let me look at the prompt again: "item-specific modifiers (cursed, high enchantment) apply to the base premium of the affected item; policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium (the sum of all item base premiums)"

      // So loyalty is 20% of 100 (the policy base before any modifiers) = 20. Correct!
      // First insurance is 10% of... the policy base before loyalty? Or 10% of the policy base + modifiers?
      // After loyalty is applied, we have: 100 + 50 + 30 - 20 = 160
      // Then first insurance adds 10, making it 170
      // Then follow-up discount removes 15%, so 170 * 0.15 = 25.5, and 170 - 25.5 = 144.5
      // But that doesn't match 155.

      // Let me re-think the order. What if first insurance comes BEFORE loyalty?
      // 100 + 50 + 30 = 180
      // First insurance: +10 (10% of 100) = 190
      // Loyalty: -20 (20% of 100) = 170
      // Follow-up: -15 (15% of 170)? = 170 - 25.5 = 144.5. No.

      // What if follow-up is 15% of the base, not the remaining?
      // 100 + 50 + 30 = 180
      // Loyalty: -20 = 160
      // First insurance: +10 = 170
      // Follow-up: -15 (15% of 100) = 155. YES!

      // So the order and calculation are:
      // 1. Base + item modifiers = 180
      // 2. Apply loyalty (if applicable): -20% of base = -20 → 160
      // 3. Apply first insurance surcharge (if applicable): +10% of base = +10 → 170
      // 4. Apply follow-up contract discount (if not first insurance): -15% of base = -15 → 155

      // But this contradicts my implementation which applies first insurance before loyalty. Let me fix it.

      // For isFirstInsurance: false, we apply both first insurance (for items) AND follow-up (for contract)
      // 100 + 50 + 30 = 180
      // Loyalty: -20 (20% of 100) = 160
      // First insurance: +10 (10% of 100) = 170
      // Follow-up: -15 (15% of 100) = 155
      // + fee = 160
      expect(result).toBe(160);
    });
  });
});
