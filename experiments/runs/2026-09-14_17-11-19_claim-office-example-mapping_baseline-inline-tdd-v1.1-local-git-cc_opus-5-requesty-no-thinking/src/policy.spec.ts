import { describe, it, expect } from 'vitest';
import { Policy } from './policy.js';
import { ClaimError } from './errors.js';

const sword = { type: 'sword', material: 'steel', enchantment: 3 };
const amulet = { type: 'amulet' };

describe('insurance sum and cap', () => {
  it('sums the insurance values of the items', () => {
    const policy = new Policy([sword, amulet]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it('counts two swords twice', () => {
    const policy = new Policy([sword, sword]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
  });

  it('ignores the block discount for the insurance sum', () => {
    const policy = new Policy([sword, ...Array(3).fill({ type: 'rune' })]);
    expect(policy.insuranceSum).toBe(1750);
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    const policy = new Policy([{ ...sword, cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });
});

describe('reimbursement clauses', () => {
  it('reimburses a plain item in full, minus the deductible', () => {
    const policy = new Policy([sword]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('reimburses a rune in full, minus the deductible', () => {
    const policy = new Policy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('halves the damage from enchantment level 8', () => {
    const policy = new Policy([{ ...sword, enchantment: 8 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('reimburses dragon material in full', () => {
    const policy = new Policy([
      { type: 'sword', material: 'dragon', enchantment: 5 },
    ]);
    expect(policy.claim([{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('lets the 50 % rule win over dragon material', () => {
    const policy = new Policy([
      { type: 'sword', material: 'dragon', enchantment: 9 },
    ]);
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('applies the 50 % rule at exactly enchantment 8 on dragon material', () => {
    const policy = new Policy([
      { type: 'sword', material: 'dragon', enchantment: 8 },
    ]);
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('deducts 100 G per damaged item', () => {
    const policy = new Policy([sword, amulet]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it('treats two damages of the same type as separate events', () => {
    const policy = new Policy([sword, sword]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result.payout).toBe(800);
  });

  it('never pays out a negative amount for a small damage', () => {
    const policy = new Policy([sword]);
    expect(policy.claim([{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });
});

describe('cap exhaustion', () => {
  it('limits successive claims to the remaining cap', () => {
    const policy = new Policy([sword]);

    const first = policy.claim([{ itemType: 'sword', amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = policy.claim([{ itemType: 'sword', amount: 1500 }]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rounding', () => {
  it('rounds the payout down, in the MHPCO favour', () => {
    // enchantment 8 halves 901 to 450.5, then the deductible -> 350.5 -> 350
    const policy = new Policy([{ ...sword, enchantment: 8 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item that is not insured', () => {
    const policy = new Policy([sword]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 200 }])).toThrow(
      ClaimError,
    );
  });

  it('rejects a damage to an unknown item type', () => {
    const policy = new Policy([sword]);
    expect(() =>
      policy.claim([{ itemType: 'broomstick', amount: 200 }]),
    ).toThrow(ClaimError);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = new Policy([sword]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow(ClaimError);
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([sword]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow(
      ClaimError,
    );
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = new Policy([sword]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 200 }])).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });
});
