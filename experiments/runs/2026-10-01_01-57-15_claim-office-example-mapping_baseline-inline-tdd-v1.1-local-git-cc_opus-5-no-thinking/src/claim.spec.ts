import { describe, it, expect } from 'vitest';
import { createPolicy, claim } from './claim.js';
import type { Item } from './quote.js';

const policyOf = (items: Item[]) => createPolicy(items);
const sword: Item = { type: 'sword', material: 'steel', enchantment: 3 };

describe('standard reimbursement', () => {
  it('reimburses in full minus the 100 G deductible', () => {
    const policy = policyOf([sword]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it('applies no special clause to a rune', () => {
    const policy = policyOf([{ type: 'rune' }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] }).payout).toBe(
      100,
    );
  });
});

describe('special clauses', () => {
  it('reimburses high-enchantment items at 50 % before the deductible', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] }).payout).toBe(
      400,
    );
  });

  it('reimburses dragon material in full', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] }).payout).toBe(
      700,
    );
  });

  it('lets the 50 % rule win when both clauses apply', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] }).payout).toBe(
      400,
    );
  });

  it('applies the 50 % rule at exactly enchantment 8', () => {
    const policy = policyOf([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] }).payout).toBe(
      400,
    );
  });
});

describe('deductible per damaged item', () => {
  it('deducts 100 G once per damaged item', () => {
    const policy = policyOf([sword, { type: 'amulet' }]);
    const payout = claim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    }).payout;
    expect(payout).toBe(600);
  });

  it('treats two entries of the same type as separate damages', () => {
    const policy = policyOf([sword, sword]);
    const payout = claim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    }).payout;
    expect(payout).toBe(800);
  });
});

describe('cap exhaustion', () => {
  it('reduces a claim to the remaining cap', () => {
    const policy = policyOf([sword]);
    const first = claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    const second = claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item outside the policy', () => {
    const policy = policyOf([sword]);
    expect(() =>
      claim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow(/not covered/i);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = policyOf([sword]);
    expect(() =>
      claim(policy, {
        cause: 'fire',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      }),
    ).toThrow(/not covered/i);
  });

  it('rejects a negative damage amount', () => {
    const policy = policyOf([sword]);
    expect(() =>
      claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow(/negative/i);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional payout of 350.5 G down to 350 G', () => {
    const policy = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    // 901 G damage, halved by the high-enchantment clause to 450.5 G,
    // minus the 100 G deductible = 350.5 G
    expect(claim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] }).payout).toBe(
      350,
    );
  });
});
