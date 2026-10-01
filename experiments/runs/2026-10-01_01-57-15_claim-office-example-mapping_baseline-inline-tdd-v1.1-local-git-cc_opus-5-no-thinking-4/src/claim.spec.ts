import { describe, it, expect } from 'vitest';
import { openPolicy, processClaim } from './claim.js';
import type { Item } from './premium.js';

const sword: Item = { type: 'sword', material: 'steel', enchantment: 3 };

const claimOn = (items: Item[], damages: { itemType: string; amount: number }[]) =>
  processClaim(openPolicy(items), { cause: 'fire', damages });

describe('standard reimbursement', () => {
  it('reimburses the damage in full minus the deductible', () => {
    expect(claimOn([sword], [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('applies no special clause to a component', () => {
    expect(claimOn([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('applies the deductible once per damaged item', () => {
    expect(
      claimOn(
        [sword, { type: 'amulet' }],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ],
      ).payout,
    ).toBe(600);
  });

  it('never pays out less than nothing for a damage below the deductible', () => {
    expect(claimOn([sword], [{ itemType: 'sword', amount: 60 }]).payout).toBe(0);
  });
});

describe('special clauses', () => {
  it('halves the damage for enchantment level 8 and above, before the deductible', () => {
    expect(
      claimOn([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }]).payout,
    ).toBe(400);
  });

  it('reimburses dragon material in full', () => {
    expect(
      claimOn([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }]).payout,
    ).toBe(700);
  });

  it('lets the 50 % clause win when both clauses apply', () => {
    expect(
      claimOn([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }]).payout,
    ).toBe(400);
    expect(
      claimOn([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }]).payout,
    ).toBe(400);
  });
});

describe('the payout cap', () => {
  it('caps the policy at twice the sum of the insurance values', () => {
    expect(openPolicy([sword, { type: 'amulet' }]).remainingCap).toBe(3200);
    expect(openPolicy([sword, sword]).remainingCap).toBe(4000);
  });

  it('ignores premium modifiers and block discounts when forming the cap', () => {
    expect(openPolicy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
    expect(
      openPolicy([sword, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]).remainingCap,
    ).toBe(3500);
  });

  it('reduces the payout to the remaining cap and draws the cap down', () => {
    const policy = openPolicy([sword]);
    const first = processClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    const second = processClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rounds the final payout down, in the MHPCO\'s favour', () => {
    // enchantment 9 halves 801 to 400.5, then the deductible leaves 300.5
    expect(
      claimOn([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 801 }]).payout,
    ).toBe(300);
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item that is not part of the policy', () => {
    expect(() => claimOn([sword], [{ itemType: 'amulet', amount: 300 }])).toThrow(/amulet/);
  });

  it('rejects a damage to an item of an unknown type', () => {
    expect(() => claimOn([sword], [{ itemType: 'broomstick', amount: 300 }])).toThrow(/broomstick/);
  });

  it('rejects more damages of a type than the policy covers', () => {
    expect(() =>
      claimOn([sword], [
        { itemType: 'sword', amount: 300 },
        { itemType: 'sword', amount: 300 },
      ]),
    ).toThrow(/sword/);
  });

  it('rejects a negative damage amount', () => {
    expect(() => claimOn([sword], [{ itemType: 'sword', amount: -200 }])).toThrow(/-200/);
  });

  it('treats each damage entry as a separate damage with its own deductible', () => {
    expect(
      claimOn([sword, sword], [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ]).payout,
    ).toBe(600);
  });
});

describe('an incident that damages several items', () => {
  it('matches two damages of one type to two insured items of that type', () => {
    const policy = openPolicy([sword, sword]);
    expect(policy.remainingCap).toBe(4000);
    expect(
      processClaim(policy, {
        cause: 'dragon',
        damages: [
          { itemType: 'sword', amount: 1000 },
          { itemType: 'sword', amount: 1000 },
        ],
      }),
    ).toEqual({ payout: 1800, remainingCap: 2200 });
  });
});
