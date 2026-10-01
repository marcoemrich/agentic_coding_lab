import { describe, it, expect } from 'vitest';
import { Policy } from './policy';

const sword = (extra = {}) => ({ type: 'sword', material: 'steel', enchantment: 3, ...extra });
const claimOne = (policy: Policy, itemType: string, amount: number) => policy.claim([{ itemType, amount }]);

describe('Policy', () => {
  describe('cap', () => {
    it.each([
      [[sword(), sword()], 4000],
      [[sword(), { type: 'amulet' }], 3200],
      [[sword({ cursed: true })], 2000],
      [[sword(), { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    ])('is twice the insurance sum (%#)', (items, cap) => {
      expect(new Policy(items).remainingCap).toBe(cap);
    });
  });

  describe('reimbursement', () => {
    it('reimburses a regular sword fully minus deductible', () => {
      expect(claimOne(new Policy([sword()]), 'sword', 500)).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it('reimburses a rune fully minus deductible', () => {
      expect(claimOne(new Policy([{ type: 'rune' }]), 'rune', 200).payout).toBe(100);
    });

    it('applies the 50% clause at exactly enchantment 8 even for dragon material', () => {
      expect(claimOne(new Policy([sword({ material: 'dragon', enchantment: 8 })]), 'sword', 1000).payout).toBe(400);
    });

    it('lets the 50% rule win over dragon material', () => {
      expect(claimOne(new Policy([sword({ material: 'dragon', enchantment: 9 })]), 'sword', 1000).payout).toBe(400);
    });

    it('reimburses dragon material fully below enchantment 8', () => {
      expect(claimOne(new Policy([sword({ material: 'dragon', enchantment: 5 })]), 'sword', 800).payout).toBe(700);
    });

    it('applies the 50% clause to a steel sword with enchantment 9', () => {
      expect(claimOne(new Policy([sword({ enchantment: 9 })]), 'sword', 1000).payout).toBe(400);
    });

    it('applies the deductible once per damaged item', () => {
      const policy = new Policy([sword(), { type: 'amulet' }]);
      expect(
        policy.claim([
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ]).payout,
      ).toBe(600);
    });

    it('treats two damages to two insured swords separately', () => {
      const policy = new Policy([sword(), sword()]);
      expect(
        policy.claim([
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ]),
      ).toEqual({ payout: 800, remainingCap: 3200 });
    });

    it('never pays negative amounts for damage below the deductible', () => {
      expect(claimOne(new Policy([sword()]), 'sword', 50).payout).toBe(0);
    });

    it('rounds the payout down in the MHPCO favor', () => {
      // 50% of 901 = 450.5 - 100 = 350.5 -> 350
      expect(claimOne(new Policy([sword({ enchantment: 8 })]), 'sword', 901).payout).toBe(350);
    });
  });

  describe('cap exhaustion', () => {
    it('limits successive claims to the remaining cap', () => {
      const policy = new Policy([sword()]);
      expect(claimOne(policy, 'sword', 1500)).toEqual({ payout: 1400, remainingCap: 600 });
      expect(claimOne(policy, 'sword', 1500)).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe('rejections', () => {
    it('rejects damage to an item not on the policy', () => {
      expect(() => claimOne(new Policy([sword()]), 'amulet', 100)).toThrow();
    });

    it('rejects damage to an unknown item type', () => {
      expect(() => claimOne(new Policy([sword()]), 'broomstick', 100)).toThrow();
    });

    it('rejects more damages of a type than insured items', () => {
      const policy = new Policy([sword()]);
      expect(() =>
        policy.claim([
          { itemType: 'sword', amount: 100 },
          { itemType: 'sword', amount: 100 },
        ]),
      ).toThrow();
      expect(policy.remainingCap).toBe(2000);
    });

    it('rejects negative damage amounts', () => {
      expect(() => claimOne(new Policy([sword()]), 'sword', -200)).toThrow();
    });
  });
});
