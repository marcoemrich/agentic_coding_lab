import { describe, it, expect } from 'vitest';
import { Policy } from './policy.js';
import { InvalidDamageError, UninsuredDamageError } from './claim.js';

const policyOf = (...items: { type: string; material?: string; enchantment?: number }[]) =>
  new Policy(items);

describe('standard reimbursement', () => {
  it('reimburses damage in full minus the deductible', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 3 });
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('reimburses a component, which has no enchantment or material', () => {
    const policy = policyOf({ type: 'rune' });
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });
});

describe('special clauses', () => {
  it('halves damage to an item at exactly enchantment 8, then applies the deductible', () => {
    const policy = policyOf({ type: 'sword', material: 'dragon', enchantment: 8 });
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('lets the 50% rule win when both clauses apply', () => {
    const policy = policyOf({ type: 'sword', material: 'dragon', enchantment: 9 });
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('reimburses dragon material in full below the enchantment threshold', () => {
    const policy = policyOf({ type: 'sword', material: 'dragon', enchantment: 5 });
    expect(policy.claim([{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('halves damage to a highly enchanted item of ordinary material', () => {
    const policy = policyOf({ type: 'sword', material: 'steel', enchantment: 9 });
    expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = policyOf({ type: 'sword' }, { type: 'amulet' });
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it('treats two damages to two insured swords as separate damages', () => {
    const policy = policyOf({ type: 'sword' }, { type: 'sword' });
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result.payout).toBe(800);
  });
});

describe('payout cap', () => {
  it('caps the total payout at twice the insurance sum across successive claims', () => {
    const policy = policyOf({ type: 'sword' });
    const first = policy.claim([{ itemType: 'sword', amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = policy.claim([{ itemType: 'sword', amount: 1500 }]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    const policy = policyOf({ type: 'sword', cursed: true } as { type: string });
    expect(policy.remainingCap).toBe(2000);
  });
});

describe('rejected claims', () => {
  it('rejects damage to an item that is not part of the policy', () => {
    const policy = policyOf({ type: 'sword' });
    expect(() => policy.claim([{ itemType: 'amulet', amount: 200 }])).toThrow(UninsuredDamageError);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = policyOf({ type: 'sword' });
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow(UninsuredDamageError);
  });

  it('rejects a negative damage amount', () => {
    const policy = policyOf({ type: 'sword' });
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow(InvalidDamageError);
  });
});

describe('rounding a payout in the MHPCO favor', () => {
  it('rounds a fractional payout down', () => {
    const policy = policyOf({ type: 'sword', enchantment: 9 });
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});
