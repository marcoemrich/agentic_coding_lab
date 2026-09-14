import { describe, it, expect } from 'vitest';
import { createPolicy, insuranceSum, policyCap, reimbursement, settleClaim } from './claim';

describe('insurance sum and cap', () => {
  it('sums the items insurance values', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
    expect(policyCap([{ type: 'sword' }, { type: 'amulet' }])).toBe(3200);
  });

  it('ignores the block discount', () => {
    const items = [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
    expect(insuranceSum(items)).toBe(1750);
  });

  it('counts each item of the same type', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
    expect(policyCap([{ type: 'sword' }, { type: 'sword' }])).toBe(4000);
  });

  it('is unaffected by premium modifiers', () => {
    expect(policyCap([{ type: 'sword', cursed: true }])).toBe(2000);
  });
});

describe('reimbursement per damage', () => {
  it('fully reimburses a regular item minus the deductible', () => {
    expect(reimbursement({ type: 'sword', material: 'steel', enchantment: 3 }, 500)).toBe(400);
    expect(reimbursement({ type: 'rune' }, 200)).toBe(100);
  });

  it('halves damage for enchantment 8 or more, then deducts', () => {
    expect(reimbursement({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
    expect(reimbursement({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
    expect(reimbursement({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
  });

  it('fully reimburses dragon material below the enchantment threshold', () => {
    expect(reimbursement({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
  });

  it('never goes below zero', () => {
    expect(reimbursement({ type: 'potion' }, 50)).toBe(0);
  });
});

describe('settling a claim', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const payout = settleClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(payout).toBe(600);
  });

  it('treats two damages of the same type separately', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    const payout = settleClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    expect(payout).toBe(800);
  });

  it('exhausts the cap across successive claims', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] })).toBe(1400);
    expect(policy.remainingCap).toBe(600);
    expect(settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] })).toBe(600);
    expect(policy.remainingCap).toBe(0);
  });

  it('rounds the payout down', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] })).toBe(801);
    const halved = createPolicy([{ type: 'sword', enchantment: 9 }]);
    expect(settleClaim(halved, { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] })).toBe(350);
  });

  it('rejects damage to items not covered by the policy', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow();
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] }),
    ).toThrow();
  });

  it('rejects more damages of a type than are insured', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      settleClaim(policy, {
        cause: 'fire',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      }),
    ).toThrow(/more damages/);
  });

  it('rejects negative damage amounts', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      settleClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow();
  });
});
