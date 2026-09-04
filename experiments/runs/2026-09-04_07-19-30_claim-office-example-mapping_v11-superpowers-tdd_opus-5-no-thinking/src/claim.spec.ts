import { describe, expect, test } from 'vitest';
import { claim } from './claim.js';

const sword = { type: 'sword', material: 'steel', enchantment: 3 };

function payoutFor(items: { type: string; material?: string; enchantment?: number }[],
                   damages: { itemType: string; amount: number }[]) {
  return claim(items, { cause: 'dragon attack', damages }, Infinity).payout;
}

describe('standard reimbursement', () => {
  test('a plain item is reimbursed in full minus the deductible', () => {
    expect(payoutFor([sword], [{ itemType: 'sword', amount: 500 }])).toBe(400);
  });

  test('a component has no enchantment or material, so no special clause applies', () => {
    expect(payoutFor([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toBe(100);
  });
});

describe('special clauses', () => {
  test('damage to a highly enchanted item is reimbursed at 50 %, then the deductible', () => {
    const item = { type: 'sword', material: 'steel', enchantment: 9 };
    expect(payoutFor([item], [{ itemType: 'sword', amount: 1000 }])).toBe(400);
  });

  test('enchantment of exactly 8 triggers the 50 % clause', () => {
    const item = { type: 'sword', material: 'dragon', enchantment: 8 };
    expect(payoutFor([item], [{ itemType: 'sword', amount: 1000 }])).toBe(400);
  });

  test('enchantment of 7 is below the threshold and is reimbursed in full', () => {
    const item = { type: 'sword', material: 'steel', enchantment: 7 };
    expect(payoutFor([item], [{ itemType: 'sword', amount: 1000 }])).toBe(900);
  });

  test('a dragon-material item is fully reimbursed, then the deductible', () => {
    const item = { type: 'sword', material: 'dragon', enchantment: 5 };
    expect(payoutFor([item], [{ itemType: 'sword', amount: 800 }])).toBe(700);
  });

  test('when both clauses apply the 50 % rule wins', () => {
    const item = { type: 'sword', material: 'dragon', enchantment: 9 };
    expect(payoutFor([item], [{ itemType: 'sword', amount: 1000 }])).toBe(400);
  });
});

describe('deductible per damage event', () => {
  test('the deductible applies once per damaged item', () => {
    const items = [sword, { type: 'amulet' }];
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(payoutFor(items, damages)).toBe(600);
  });

  test('two damages to two insured swords each carry their own deductible', () => {
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 300 },
    ];
    expect(payoutFor([sword, sword], damages)).toBe(600);
  });
});

describe('cap exhaustion', () => {
  test('a payout within the cap leaves the remainder available', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] };
    expect(claim([sword], incident, 2000)).toEqual({ payout: 1400, remainingCap: 600 });
  });

  test('a payout is reduced to the remaining cap', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] };
    expect(claim([sword], incident, 600)).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rounding', () => {
  test('a fractional payout is rounded down, in the MHPCO favour', () => {
    // enchantment 9 halves 901 to 450.5, then the deductible: 350.5 → 350
    const item = { type: 'sword', material: 'steel', enchantment: 9 };
    expect(payoutFor([item], [{ itemType: 'sword', amount: 901 }])).toBe(350);
  });
});

describe('invalid claims', () => {
  test('a damage to an item outside the policy is rejected', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] };
    expect(() => claim([sword], incident, 2000)).toThrow(/amulet/);
  });

  test('more damages of a type than the policy covers are rejected', () => {
    const incident = {
      cause: 'fire',
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ],
    };
    expect(() => claim([sword], incident, 2000)).toThrow(/sword/);
  });

  test('a damage with an unknown item type is rejected', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] };
    expect(() => claim([sword], incident, 2000)).toThrow(/broomstick/);
  });

  test('a negative damage amount is rejected', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] };
    expect(() => claim([sword], incident, 2000)).toThrow(/negative/i);
  });
});
