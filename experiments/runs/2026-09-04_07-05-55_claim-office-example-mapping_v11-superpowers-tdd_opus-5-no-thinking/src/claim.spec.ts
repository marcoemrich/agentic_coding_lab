import { describe, test, expect } from 'vitest';
import { createPolicy } from './policy.js';
import { claim } from './claim.js';

describe('claim', () => {
  test('a regular sword is fully reimbursed minus the deductible', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(claim(policy, [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  test('a rune without enchantment or material triggers no special clause', () => {
    const policy = createPolicy([{ type: 'rune' }]);
    expect(claim(policy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  test('enchantment 8 halves the damage before the deductible', () => {
    const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    expect(claim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  test('the 50% enchantment clause beats dragon material', () => {
    const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
    expect(claim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  test('dragon material alone reimburses fully', () => {
    const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    expect(claim(policy, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  test('high enchantment on steel halves the damage', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(claim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  test('the deductible applies once per damaged item', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(claim(policy, damages).payout).toBe(600);
  });

  test('each entry for a duplicated item type carries its own deductible', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 300 },
    ];
    expect(claim(policy, damages).payout).toBe(600);
  });

  describe('cap exhaustion', () => {
    test('successive claims draw down the shared cap', () => {
      const policy = createPolicy([{ type: 'sword' }]);

      const first = claim(policy, [{ itemType: 'sword', amount: 1500 }]);
      expect(first).toEqual({ payout: 1400, remainingCap: 600 });

      const second = claim(policy, [{ itemType: 'sword', amount: 1500 }]);
      expect(second).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  test('a payout of 350.5 G is rounded down in the MHPCO favour', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 8 }]);
    // 901 damage -> 450.5 after the 50% clause -> 350.5 after the deductible
    expect(claim(policy, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  test('the reported remaining cap is a whole number', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 8 }]);
    // 901 damage -> 450.5 -> 350.5 payout, reported as 350
    const result = claim(policy, [{ itemType: 'sword', amount: 901 }]);
    expect(Number.isInteger(result.remainingCap)).toBe(true);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  describe('rejected claims', () => {
    test('rejects a damage to an item that is not part of the policy', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() => claim(policy, [{ itemType: 'amulet', amount: 200 }])).toThrow(
        /amulet.*not.*insured/i,
      );
    });

    test('rejects a damage to an item of unknown type', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() => claim(policy, [{ itemType: 'broomstick', amount: 200 }])).toThrow(
        /broomstick.*not.*insured/i,
      );
    });

    test('rejects more damages of a type than the policy covers', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      const damages = [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ];
      expect(() => claim(policy, damages)).toThrow(/sword.*not.*insured/i);
    });

    test('rejects a negative damage amount', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() => claim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow(/negative/i);
    });

    test('leaves the cap untouched when a claim is rejected', () => {
      const policy = createPolicy([{ type: 'sword' }]);
      expect(() => claim(policy, [{ itemType: 'amulet', amount: 200 }])).toThrow();
      expect(policy.remainingCap).toBe(2000);
    });
  });
});
