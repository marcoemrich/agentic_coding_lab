import { describe, expect, test } from 'vitest';
import { createPolicy, settleClaim } from './claim.js';
import type { Item } from './premium.js';

const sword = { type: 'sword', material: 'steel', enchantment: 3 };

describe('standard reimbursement', () => {
  test('a regular sword is reimbursed in full minus the 100 G deductible', () => {
    const policy = createPolicy([sword]);
    const result = settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] });
    expect(result.payout).toBe(400);
  });

  test('a damaged rune is reimbursed in full minus the deductible', () => {
    const policy = createPolicy([{ type: 'rune' }]);
    const result = settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] });
    expect(result.payout).toBe(100);
  });
});

describe('deductible per damage event', () => {
  test('each damaged item carries its own deductible', () => {
    const policy = createPolicy([sword, { type: 'amulet' }]);
    const result = settleClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
});

describe('special reimbursement clauses', () => {
  const claimOn = (item: Item, amount: number) =>
    settleClaim(createPolicy([item]), {
      cause: 'dragon attack',
      damages: [{ itemType: item.type, amount }],
    }).payout;

  test('enchantment 8 is reimbursed at 50 %, then the deductible', () => {
    expect(claimOn({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
  });

  test('dragon material alone is reimbursed in full, then the deductible', () => {
    expect(claimOn({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
  });

  test('the 50 % rule wins when both clauses apply', () => {
    expect(claimOn({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
  });

  test('high enchantment alone is reimbursed at 50 %, then the deductible', () => {
    expect(claimOn({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
  });
});

describe('payout cap', () => {
  test('the cap is twice the insurance sum of the policy', () => {
    expect(createPolicy([sword, { type: 'amulet' }]).remainingCap).toBe(3200);
  });

  test('the block discount does not lower the insurance sum', () => {
    const runes = Array.from({ length: 3 }, () => ({ type: 'rune' }));
    expect(createPolicy([sword, ...runes]).remainingCap).toBe(3500);
  });

  test('premium modifiers do not raise the cap', () => {
    expect(createPolicy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
  });

  test('successive claims exhaust the cap', () => {
    const policy = createPolicy([sword]);
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] };

    const first = settleClaim(policy, incident);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = settleClaim(policy, incident);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('payout rounding in the MHPCO favour', () => {
  test('a fractional payout is rounded down', () => {
    // enchantment 9 => 50 % of 901 = 450.5; -100 deductible => 350.5 => 350
    const item = { type: 'sword', material: 'steel', enchantment: 9 };
    const policy = createPolicy([item]);
    const result = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });
});

describe('invalid claims', () => {
  test('a damage to an item that is not insured is rejected', () => {
    const policy = createPolicy([sword]);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow(/amulet/);
  });

  test('more damages of a type than the policy covers is rejected', () => {
    const policy = createPolicy([sword]);
    expect(() =>
      settleClaim(policy, {
        cause: 'fire',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      }),
    ).toThrow(/sword/);
  });

  test('a negative damage amount is rejected', () => {
    const policy = createPolicy([sword]);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow(/amount/);
  });
});

describe('multiple items of the same type', () => {
  test('two swords are insured separately and each damage has its own deductible', () => {
    const policy = createPolicy([sword, sword]);
    expect(policy.remainingCap).toBe(4000);

    const result = settleClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
});

describe('unknown item type in a claim', () => {
  test('a damage naming an unknown item type is rejected', () => {
    const policy = createPolicy([sword]);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] }),
    ).toThrow(/broomstick/);
  });

  test('a claim rejected on a later damage consumes none of the cap', () => {
    const policy = createPolicy([sword, { type: 'amulet' }]);
    expect(() =>
      settleClaim(policy, {
        cause: 'fire',
        damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'broomstick', amount: 200 },
        ],
      }),
    ).toThrow(/broomstick/);
    expect(policy.remainingCap).toBe(3200);
  });
});
