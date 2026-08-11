import { describe, expect, it } from 'vitest';
import { openPolicy } from './policy.js';

const sword = { type: 'sword', material: 'steel', enchantment: 3 };
const dragonSword = (enchantment: number) => ({
  type: 'sword',
  material: 'dragon',
  enchantment,
});

describe('insurance sum and cap', () => {
  it('sums the items’ insurance values and caps at twice the sum', () => {
    const policy = openPolicy([sword, { type: 'amulet' }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it('bases the cap on unmodified insurance values', () => {
    const policy = openPolicy([{ type: 'sword', cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });

  it('ignores the block discount in the insurance sum', () => {
    const policy = openPolicy([
      sword,
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ]);
    expect(policy.insuranceSum).toBe(1750);
  });

  it('counts two swords twice', () => {
    const policy = openPolicy([sword, sword]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
  });
});

describe('standard reimbursement', () => {
  it('pays the damage minus the 100 G deductible', () => {
    const policy = openPolicy([sword]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('applies no special clause to a component', () => {
    const policy = openPolicy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });
});

describe('special clauses', () => {
  it('halves damage to items with enchantment >= 8, then deducts', () => {
    const policy = openPolicy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('fully reimburses dragon material, then deducts', () => {
    const policy = openPolicy([dragonSword(5)]);
    expect(policy.claim([{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('lets the 50 % rule win when both clauses apply', () => {
    const policy = openPolicy([dragonSword(9)]);
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('applies the high-enchantment clause at exactly 8', () => {
    const policy = openPolicy([dragonSword(8)]);
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('deducts 100 G once per damaged item', () => {
    const policy = openPolicy([sword, { type: 'amulet' }]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it('treats two damages of the same type as separate events', () => {
    const policy = openPolicy([sword, sword]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result.payout).toBe(800);
  });
});

describe('cap exhaustion', () => {
  it('reduces the payout to the remaining cap', () => {
    const policy = openPolicy([sword]);

    const first = policy.claim([{ itemType: 'sword', amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = policy.claim([{ itemType: 'sword', amount: 1500 }]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item that is not insured', () => {
    const policy = openPolicy([sword]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 200 }])).toThrow();
  });

  it('rejects an unknown item type', () => {
    const policy = openPolicy([sword]);
    expect(() => policy.claim([{ itemType: 'broomstick', amount: 200 }])).toThrow();
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = openPolicy([sword]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const policy = openPolicy([sword]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow();
  });
});
