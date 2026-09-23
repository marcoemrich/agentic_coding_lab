import { describe, it, expect } from 'vitest';
import { settleClaim, ClaimError, type Damage, type Policy } from './claim';
import { type Item } from './premium';

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra });

const policyOf = (items: Item[]): Policy => ({
  items,
  insuranceSum: 0,
  remainingCap: Number.POSITIVE_INFINITY,
});

describe('standard reimbursement', () => {
  it('reimburses damage in full minus the deductible', () => {
    const policy = policyOf([item('sword', { material: 'steel', enchantment: 3 })]);
    const result = settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] });
    expect(result.payout).toBe(400);
  });

  it('reimburses a component with no enchantment or material in full minus the deductible', () => {
    const policy = policyOf([item('rune')]);
    const result = settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] });
    expect(result.payout).toBe(100);
  });
});

describe('special reimbursement clauses', () => {
  const claim = (damagedItem: Item, amount: number) =>
    settleClaim(policyOf([damagedItem]), {
      cause: 'dragon attack',
      damages: [{ itemType: damagedItem.type, amount }],
    }).payout;

  it('halves damage to items with enchantment 8 or above', () => {
    expect(claim(item('sword', { material: 'steel', enchantment: 9 }), 1000)).toBe(400);
  });

  it('applies the high-enchantment clause at exactly 8', () => {
    expect(claim(item('sword', { material: 'dragon', enchantment: 8 }), 1000)).toBe(400);
  });

  it('reimburses dragon material in full', () => {
    expect(claim(item('sword', { material: 'dragon', enchantment: 5 }), 800)).toBe(700);
  });

  it('lets the 50 % rule win when both clauses apply', () => {
    expect(claim(item('sword', { material: 'dragon', enchantment: 9 }), 1000)).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = policyOf([item('sword'), item('amulet')]);
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

describe('cap exhaustion', () => {
  const swordPolicy = (): Policy => ({
    items: [item('sword')],
    insuranceSum: 1000,
    remainingCap: 2000,
  });

  it('pays out successive claims until the cap is exhausted', () => {
    const policy = swordPolicy();
    const first = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = settleClaim(
      { ...policy, remainingCap: first.remainingCap },
      { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
    );
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds the final payout down', () => {
    const policy = policyOf([item('sword', { enchantment: 9 })]);
    const result = settleClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });
});

describe('rejected claims', () => {
  const claimOn = (policyItems: Item[], damages: Damage[]) => () =>
    settleClaim(policyOf(policyItems), { cause: 'fire', damages });

  it('rejects a damage to an item that is not part of the policy', () => {
    expect(claimOn([item('sword')], [{ itemType: 'amulet', amount: 200 }])).toThrow(ClaimError);
  });

  it('rejects a damage to an unknown item type', () => {
    expect(claimOn([item('sword')], [{ itemType: 'broomstick', amount: 200 }])).toThrow(ClaimError);
  });

  it('rejects more damages of a type than the policy covers', () => {
    expect(
      claimOn(
        [item('sword')],
        [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      ),
    ).toThrow(ClaimError);
  });

  it('rejects a negative damage amount', () => {
    expect(claimOn([item('sword')], [{ itemType: 'sword', amount: -200 }])).toThrow(ClaimError);
  });
});

describe('multiple items of the same type', () => {
  it('treats each damage entry as a separate damage with its own deductible', () => {
    const policy = policyOf([item('sword'), item('sword')]);
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
