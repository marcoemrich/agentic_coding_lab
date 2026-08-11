import { describe, it, expect } from 'vitest';
import { createPolicy, settleClaim } from './claim.js';
import type { Item } from './types.js';

const steelSword: Item ={ type: 'sword', material: 'steel', enchantment: 3 };

describe('policy cap', () => {
  it('caps the payout at twice the insurance sum', () => {
    const policy = createPolicy([steelSword], 1000);
    expect(policy.remainingCap).toBe(2000);
  });
});

describe('standard reimbursement', () => {
  it('reimburses in full minus the 100 G deductible', () => {
    const policy = createPolicy([steelSword], 1000);
    const result = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });

  it('reimburses a damaged rune in full minus the deductible', () => {
    const policy = createPolicy([{ type: 'rune' }], 250);
    const result = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'rune', amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });

  it('never pays out less than nothing for a damage below the deductible', () => {
    const policy = createPolicy([steelSword], 1000);
    const result = settleClaim(policy, {
      cause: 'scratch',
      damages: [{ itemType: 'sword', amount: 40 }],
    });
    expect(result.payout).toBe(0);
  });
});

describe('special clauses', () => {
  it('halves the damage for enchantment 8 before the deductible', () => {
    const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 8 }], 1000);
    const result = settleClaim(policy, {
      cause: 'dragon',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it('lets the 50 % rule win over dragon material at enchantment 9', () => {
    const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 9 }], 1000);
    const result = settleClaim(policy, {
      cause: 'dragon',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it('reimburses dragon material below enchantment 8 in full', () => {
    const policy = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 5 }], 1000);
    const result = settleClaim(policy, {
      cause: 'dragon',
      damages: [{ itemType: 'sword', amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });

  it('halves the damage for a steel sword with enchantment 9', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 9 }], 1000);
    const result = settleClaim(policy, {
      cause: 'dragon',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = createPolicy([steelSword, { type: 'amulet' }], 1600);
    const result = settleClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  it('treats two entries of the same type as separate damages', () => {
    const policy = createPolicy([steelSword, steelSword], 2000);
    const result = settleClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });
});

describe('cap exhaustion across successive claims', () => {
  it('reduces the payout to the remaining cap', () => {
    const policy = createPolicy([steelSword], 1000);

    const first = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('rounding', () => {
  it('rounds a fractional payout down, in the MHPCO favour', () => {
    // 901 halved = 450.5, minus the 100 G deductible = 350.5 -> 350
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 9 }], 1000);
    const result = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item that is not insured', () => {
    const policy = createPolicy([steelSword], 1000);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow();
  });

  it('rejects a damage to an unknown item type', () => {
    const policy = createPolicy([steelSword], 1000);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] }),
    ).toThrow();
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = createPolicy([steelSword], 1000);
    expect(() =>
      settleClaim(policy, {
        cause: 'dragon attack',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      }),
    ).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const policy = createPolicy([steelSword], 1000);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow();
  });
});
