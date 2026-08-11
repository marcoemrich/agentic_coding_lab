import { describe, it, expect } from 'vitest';
import { createPolicy, settleClaim } from './claim.js';
import type { Item } from './types.js';

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra }) as Item;
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const incident = (...damages: { itemType: string; amount: number }[]) => ({
  cause: 'dragon attack',
  damages,
});

describe('insurance sum and cap', () => {
  it('caps a policy at twice the insurance sum', () => {
    const policy = createPolicy([item('sword'), item('amulet')]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it('bases the cap on unmodified insurance values', () => {
    const policy = createPolicy([item('sword', { cursed: true })]);
    expect(policy.remainingCap).toBe(2000);
  });

  it('counts each of two swords in the insurance sum', () => {
    const policy = createPolicy([item('sword'), item('sword')]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.remainingCap).toBe(4000);
  });

  it('ignores the block discount for the insurance sum', () => {
    const policy = createPolicy([item('sword'), item('rune'), item('rune'), item('rune')]);
    expect(policy.insuranceSum).toBe(1750);
  });
});

describe('standard reimbursement', () => {
  it('reimburses damage in full minus the deductible', () => {
    const policy = createPolicy([item('sword', { material: 'steel', enchantment: 3 })]);
    expect(settleClaim(policy, incident(damage('sword', 500))).payout).toBe(400);
  });

  it('reimburses a rune with no enchantment or material', () => {
    const policy = createPolicy([item('rune')]);
    expect(settleClaim(policy, incident(damage('rune', 200))).payout).toBe(100);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = createPolicy([item('sword'), item('amulet')]);
    const result = settleClaim(policy, incident(damage('sword', 500), damage('amulet', 300)));
    expect(result.payout).toBe(600);
  });

  it('never pays a negative amount for damage below the deductible', () => {
    const policy = createPolicy([item('rune')]);
    expect(settleClaim(policy, incident(damage('rune', 50))).payout).toBe(0);
  });
});

describe('special clauses', () => {
  it('halves damage for enchantment >= 8', () => {
    const policy = createPolicy([item('sword', { material: 'steel', enchantment: 9 })]);
    expect(settleClaim(policy, incident(damage('sword', 1000))).payout).toBe(400);
  });

  it('fully reimburses dragon material', () => {
    const policy = createPolicy([item('sword', { material: 'dragon', enchantment: 5 })]);
    expect(settleClaim(policy, incident(damage('sword', 800))).payout).toBe(700);
  });

  it('lets the 50 % rule win over dragon material', () => {
    const policy = createPolicy([item('sword', { material: 'dragon', enchantment: 9 })]);
    expect(settleClaim(policy, incident(damage('sword', 1000))).payout).toBe(400);
  });

  it('applies the high-enchantment clause at exactly 8', () => {
    const policy = createPolicy([item('sword', { material: 'dragon', enchantment: 8 })]);
    expect(settleClaim(policy, incident(damage('sword', 1000))).payout).toBe(400);
  });
});

describe('cap exhaustion', () => {
  it('reduces a payout to the remaining cap and tracks it across claims', () => {
    const policy = createPolicy([item('sword')]);

    const first = settleClaim(policy, incident(damage('sword', 1500)));
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = settleClaim(policy, incident(damage('sword', 1500)));
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('rounding', () => {
  it('rounds the final payout down', () => {
    // enchantment 9 halves 901 -> 450.5, then deductible -> 350.5 -> 350
    const policy = createPolicy([item('sword', { material: 'steel', enchantment: 9 })]);
    expect(settleClaim(policy, incident(damage('sword', 901))).payout).toBe(350);
  });
});

describe('rejected claims', () => {
  it('rejects damage to an item that is not part of the policy', () => {
    const policy = createPolicy([item('sword')]);
    expect(() => settleClaim(policy, incident(damage('amulet', 200)))).toThrow();
  });

  it('rejects damage to an unknown item type', () => {
    const policy = createPolicy([item('sword')]);
    expect(() => settleClaim(policy, incident(damage('broomstick', 200)))).toThrow();
  });

  it('rejects more damage entries of a type than the policy covers', () => {
    const policy = createPolicy([item('sword')]);
    expect(() =>
      settleClaim(policy, incident(damage('sword', 100), damage('sword', 100))),
    ).toThrow();
  });

  it('accepts one damage entry per insured item of that type', () => {
    const policy = createPolicy([item('sword'), item('sword')]);
    const result = settleClaim(policy, incident(damage('sword', 500), damage('sword', 500)));
    expect(result.payout).toBe(800);
  });

  it('rejects a negative damage amount', () => {
    const policy = createPolicy([item('sword')]);
    expect(() => settleClaim(policy, incident(damage('sword', -200)))).toThrow();
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = createPolicy([item('sword'), item('amulet')]);
    expect(() =>
      settleClaim(policy, incident(damage('sword', 500), damage('staff', 500))),
    ).toThrow();
    expect(policy.remainingCap).toBe(3200);
  });
});
