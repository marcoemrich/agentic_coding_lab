import { describe, expect, test } from 'vitest';
import { createPolicy, claim } from './claim.js';

describe('claim', () => {
  test('a standard item is reimbursed in full, less the 100 G deductible', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    const result = claim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });

  test('a component has no enchantment or material, so no special clause applies', () => {
    const policy = createPolicy([{ type: 'rune' }]);
    const result = claim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'rune', amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });

  describe('special clauses', () => {
    test('enchantment 9 is reimbursed at 50 %, then the deductible applies', () => {
      const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
      const result = claim(policy, {
        cause: 'dragon',
        damages: [{ itemType: 'sword', amount: 1000 }],
      });
      expect(result.payout).toBe(400); // 1000 → 500 → −100
    });

    test('enchantment 8 already reaches the half-reimbursement threshold', () => {
      const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
      const result = claim(policy, {
        cause: 'dragon',
        damages: [{ itemType: 'sword', amount: 1000 }],
      });
      expect(result.payout).toBe(400);
    });

    test('dragon material below the enchantment threshold is fully reimbursed', () => {
      const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
      const result = claim(policy, {
        cause: 'dragon',
        damages: [{ itemType: 'sword', amount: 800 }],
      });
      expect(result.payout).toBe(700); // full 800 − 100
    });
  });

  test('the deductible is taken once per damaged item', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const result = claim(policy, {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(result.payout).toBe(600); // (500−100) + (300−100)
  });

  test('two damages to two insured swords each carry their own deductible', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    const result = claim(policy, {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });

  describe('payout cap', () => {
    test('the cap is twice the sum of the insured values', () => {
      // sword 1000 + amulet 600 = 1600 insurance sum → cap 3200
      const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
      expect(policy.remainingCap).toBe(3200);
    });

    test('the block discount lowers the premium but not the insurance sum', () => {
      // sword 1000 + 3 runes × 250 = 1750 → cap 3500
      const policy = createPolicy([
        { type: 'sword' },
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
      ]);
      expect(policy.remainingCap).toBe(3500);
    });

    test('premium modifiers do not raise the cap', () => {
      const policy = createPolicy([{ type: 'sword', cursed: true }]);
      expect(policy.remainingCap).toBe(2000);
    });

    test('successive claims draw down the cap until it is exhausted', () => {
      const policy = createPolicy([{ type: 'sword' }]); // cap 2000
      const incident = {
        cause: 'dragon',
        damages: [{ itemType: 'sword', amount: 1500 }],
      };

      const first = claim(policy, incident);
      expect(first.payout).toBe(1400);
      expect(first.remainingCap).toBe(600);

      const second = claim(policy, incident);
      expect(second.payout).toBe(600); // desired 1400, limited to the cap
      expect(second.remainingCap).toBe(0);
    });
  });

  test('a fractional payout is rounded down, in the MHPCO favour', () => {
    // enchantment 9 halves the damage: 901 → 450.5, − 100 deductible
    // = 350.5 → 350, not 351
    const policy = createPolicy([{ type: 'sword', enchantment: 9 }]);
    const result = claim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });

  describe('rejected claims', () => {
    test('a damage to an item the policy does not cover is rejected', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() =>
        claim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
      ).toThrow(/amulet/);
    });

    test('a damage to an unknown item type is rejected', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() =>
        claim(policy, { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] }),
      ).toThrow(/broomstick/);
    });

    test('more damages of a type than the policy insures is rejected', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() =>
        claim(policy, {
          cause: 'dragon',
          damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 500 },
          ],
        }),
      ).toThrow(/sword/);
    });

    test('a negative damage amount is rejected', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() =>
        claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
      ).toThrow(/negative|amount/i);
    });

    test('a rejected claim leaves the cap untouched', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() =>
        claim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
      ).toThrow();
      expect(policy.remainingCap).toBe(2000);
    });
  });
});
