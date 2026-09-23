import { describe, it, expect } from 'vitest';
import { Policy } from './policy.js';
import { ClaimError } from './claim.js';

function policyOf(items: { type: string; enchantment?: number; material?: string; cursed?: boolean }[]) {
  return new Policy(items);
}

describe('insurance sum and cap', () => {
  it('sums the item insurance values and caps at twice the sum', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    const policy = policyOf([{ type: 'sword', cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });

  it('ignores the block discount in the insurance sum', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]);
    expect(policy.insuranceSum).toBe(1750);
  });

  it('counts two swords twice', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
  });
});

describe('standard reimbursement', () => {
  it('reimburses a plain sword in full minus the deductible', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] }).payout).toBe(400);
  });

  it('reimburses a rune, which has no enchantment or material', () => {
    const policy = policyOf([{ type: 'rune' }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] }).payout).toBe(100);
  });
});

describe('special clauses', () => {
  it('halves damage at enchantment 9 for a steel sword', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] }).payout).toBe(400);
  });

  it('fully reimburses dragon material below the enchantment threshold', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] }).payout).toBe(700);
  });

  it('lets the 50 % rule win over dragon material at enchantment 9', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] }).payout).toBe(400);
  });

  it('applies the 50 % rule at exactly enchantment 8 with dragon material', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] }).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    const result = policy.claim({
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  it('treats two damages of the same type as separate events', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    const result = policy.claim({
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });

  it('never pays a negative amount for damage below the deductible', () => {
    const policy = policyOf([{ type: 'rune' }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'rune', amount: 50 }] }).payout).toBe(0);
  });
});

describe('cap exhaustion across successive claims', () => {
  it('reduces the second claim to the remaining cap', () => {
    const policy = policyOf([{ type: 'sword' }]);

    const first = policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rejections', () => {
  it('rejects a damage to an item not covered by the policy', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() => policy.claim({ cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] })).toThrow(ClaimError);
  });

  it('rejects a damage with an unknown item type', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() => policy.claim({ cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] })).toThrow(ClaimError);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() =>
      policy.claim({
        cause: 'dragon attack',
        damages: [
          { itemType: 'sword', amount: 300 },
          { itemType: 'sword', amount: 300 },
        ],
      }),
    ).toThrow(ClaimError);
  });

  it('rejects a negative damage amount', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() => policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] })).toThrow(ClaimError);
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() => policy.claim({ cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] })).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional payout down', () => {
    // enchantment 9 halves 901 to 450.5, then the deductible leaves 350.5
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(policy.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] }).payout).toBe(350);
  });
});
