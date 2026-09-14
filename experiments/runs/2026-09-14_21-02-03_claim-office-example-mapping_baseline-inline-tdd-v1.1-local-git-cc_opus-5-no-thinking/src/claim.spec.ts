import { describe, it, expect } from 'vitest';
import { Policy, openPolicy, settleClaim } from './claim.js';

const policyOf = (...items: Parameters<typeof openPolicy>[0]) => openPolicy(items);

const claim = (policy: Policy, ...damages: { itemType: string; amount: number }[]) =>
  settleClaim(policy, { cause: 'dragon attack', damages });

describe('standard reimbursement', () => {
  it('reimburses damage in full minus the deductible', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 3 });
    expect(claim(policy, { itemType: 'sword', amount: 500 }).payout).toBe(400);
  });

  it('reimburses a component in full minus the deductible', () => {
    const policy = policyOf({ type: 'rune' });
    expect(claim(policy, { itemType: 'rune', amount: 200 }).payout).toBe(100);
  });
});

describe('special clauses', () => {
  it('halves damage at exactly enchantment 8, then applies the deductible', () => {
    const policy = policyOf({ type: 'sword', material: 'dragon', enchantment: 8 });
    expect(claim(policy, { itemType: 'sword', amount: 1000 }).payout).toBe(400);
  });

  it('lets the 50% rule win over dragon material', () => {
    const policy = policyOf({ type: 'sword', material: 'dragon', enchantment: 9 });
    expect(claim(policy, { itemType: 'sword', amount: 1000 }).payout).toBe(400);
  });

  it('reimburses dragon material in full below the enchantment threshold', () => {
    const policy = policyOf({ type: 'sword', material: 'dragon', enchantment: 5 });
    expect(claim(policy, { itemType: 'sword', amount: 800 }).payout).toBe(700);
  });

  it('halves damage for a highly enchanted steel item', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 9 });
    expect(claim(policy, { itemType: 'sword', amount: 1000 }).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = policyOf(
      { type: 'sword', material: 'steel', enchantment: 1 },
      { type: 'amulet', material: 'silver', enchantment: 1 },
    );
    const result = claim(
      policy,
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    );
    expect(result.payout).toBe(600);
  });

  it('never pays a negative amount when damage is below the deductible', () => {
    const policy = policyOf({ type: 'rune' });
    expect(claim(policy, { itemType: 'rune', amount: 40 }).payout).toBe(0);
  });
});

describe('insurance sum and cap', () => {
  it('caps at twice the insurance sum of all items', () => {
    const policy = policyOf(
      { type: 'sword', material: 'steel', enchantment: 1 },
      { type: 'amulet', material: 'silver', enchantment: 1 },
    );
    expect(policy.cap).toBe(3200);
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', cursed: true, enchantment: 1 });
    expect(policy.cap).toBe(2000);
  });

  it('counts the full insurance value of blocked components', () => {
    const policy = policyOf(
      { type: 'sword', material: 'steel', enchantment: 1 },
      ...Array(3).fill({ type: 'rune' }),
    );
    expect(policy.cap).toBe(3500);
  });

  it('exhausts the cap across successive claims', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 1 });

    const first = claim(policy, { itemType: 'sword', amount: 1500 });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = claim(policy, { itemType: 'sword', amount: 1500 });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('multiple items of the same type', () => {
  it('treats each damage entry as a separate damage with its own deductible', () => {
    const policy = policyOf(
      { type: 'sword', material: 'steel', enchantment: 1 },
      { type: 'sword', material: 'steel', enchantment: 1 },
    );
    expect(policy.insuranceSum).toBe(2000);

    const result = claim(
      policy,
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 300 },
    );
    expect(result.payout).toBe(600);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 1 });
    expect(() =>
      claim(policy, { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }),
    ).toThrow(/sword/);
  });
});

describe('rejected claims', () => {
  it('rejects damage to an item that is not part of the policy', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 1 });
    expect(() => claim(policy, { itemType: 'amulet', amount: 200 })).toThrow(/amulet/);
  });

  it('rejects damage to an unknown item type', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 1 });
    expect(() => claim(policy, { itemType: 'broomstick', amount: 200 })).toThrow(/broomstick/);
  });

  it('rejects a negative damage amount', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 1 });
    expect(() => claim(policy, { itemType: 'sword', amount: -200 })).toThrow(/-200|negative/);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional payout down', () => {
    // enchantment >= 8 halves an odd damage amount: 901 / 2 = 450.5 - 100 = 350.5
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 8 });
    expect(claim(policy, { itemType: 'sword', amount: 901 }).payout).toBe(350);
  });
});
