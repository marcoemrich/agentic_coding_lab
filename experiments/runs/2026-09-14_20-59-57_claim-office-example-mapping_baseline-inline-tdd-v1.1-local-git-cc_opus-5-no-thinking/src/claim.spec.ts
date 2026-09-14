import { describe, it, expect } from 'vitest';
import { Policy, settleClaim } from './claim.js';

const policyOf = (items: Parameters<typeof Policy>[0]) => Policy(items);

describe('standard reimbursement', () => {
  it('reimburses in full minus the deductible', () => {
    const policy = policyOf([
      { type: 'sword', material: 'steel', enchantment: 3 },
    ]);
    expect(
      settleClaim(policy, [{ itemType: 'sword', amount: 500 }]).payout,
    ).toBe(400);
  });

  it('applies no special clause to a component', () => {
    const policy = policyOf([{ type: 'rune' }]);
    expect(settleClaim(policy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(
      100,
    );
  });
});

describe('special clauses', () => {
  it('halves damage at exactly enchantment 8, then deducts', () => {
    const policy = policyOf([
      { type: 'sword', material: 'dragon', enchantment: 8 },
    ]);
    expect(
      settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout,
    ).toBe(400);
  });

  it('lets the 50 % rule win over dragon material', () => {
    const policy = policyOf([
      { type: 'sword', material: 'dragon', enchantment: 9 },
    ]);
    expect(
      settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout,
    ).toBe(400);
  });

  it('reimburses dragon material fully below the enchantment threshold', () => {
    const policy = policyOf([
      { type: 'sword', material: 'dragon', enchantment: 5 },
    ]);
    expect(
      settleClaim(policy, [{ itemType: 'sword', amount: 800 }]).payout,
    ).toBe(700);
  });

  it('halves high-enchantment damage on non-dragon material', () => {
    const policy = policyOf([
      { type: 'sword', material: 'steel', enchantment: 9 },
    ]);
    expect(
      settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout,
    ).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('deducts once per damaged item', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    expect(
      settleClaim(policy, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]).payout,
    ).toBe(600);
  });

  it('treats repeated entries of one type as separate damages', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    expect(
      settleClaim(policy, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ]).payout,
    ).toBe(600);
  });
});

describe('cap', () => {
  it('caps the payout at twice the insurance sum across claims', () => {
    const policy = policyOf([{ type: 'sword' }]);
    const first = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  it('bases the cap on unmodified insurance values', () => {
    const policy = policyOf([{ type: 'sword', cursed: true }]);
    expect(policy.remainingCap).toBe(2000);
  });

  it('ignores block discounts when sizing the cap', () => {
    const policy = policyOf([
      { type: 'sword' },
      ...Array(3).fill({ type: 'rune' }),
    ]);
    expect(policy.remainingCap).toBe(3500);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds the final payout down', () => {
    // dragon sword, enchantment 9: 801 / 2 = 400.5 -> deductible -> 300.5 -> 300
    const policy = policyOf([
      { type: 'sword', material: 'dragon', enchantment: 9 },
    ]);
    expect(
      settleClaim(policy, [{ itemType: 'sword', amount: 801 }]).payout,
    ).toBe(300);
  });
});

describe('rejected claims', () => {
  it('rejects a damage to an item outside the policy', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() =>
      settleClaim(policy, [{ itemType: 'amulet', amount: 200 }]),
    ).toThrow();
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() =>
      settleClaim(policy, [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() =>
      settleClaim(policy, [{ itemType: 'sword', amount: -200 }]),
    ).toThrow();
  });

  it('rejects an unknown item type', () => {
    expect(() => policyOf([{ type: 'broomstick' }])).toThrow();
  });
});
