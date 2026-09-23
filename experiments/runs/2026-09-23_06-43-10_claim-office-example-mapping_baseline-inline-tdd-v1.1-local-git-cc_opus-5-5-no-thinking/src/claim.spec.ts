import { describe, it, expect } from 'vitest';
import { Policy } from './claim';

const sword = (extra = {}) => ({ type: 'sword', ...extra });

describe('policy cap', () => {
  it.each([
    [[sword(), sword()], 4000],
    [[sword(), { type: 'amulet' }], 3200],
    [[sword({ cursed: true })], 2000],
    [[sword(), { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
  ])('cap is twice the insurance sum', (items, cap) => {
    expect(new Policy(items).remainingCap).toBe(cap);
  });
});

describe('claim payouts', () => {
  it('standard reimbursement minus deductible', () => {
    const policy = new Policy([sword({ material: 'steel', enchantment: 3 })]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('rune damage is reimbursed minus deductible', () => {
    const policy = new Policy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('applies deductible once per damaged item', () => {
    const policy = new Policy([sword(), { type: 'amulet' }]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it('damage below the deductible pays nothing', () => {
    const policy = new Policy([sword()]);
    expect(policy.claim([{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword enchantment %i damage %i -> %i', (material, enchantment, amount, payout) => {
    const policy = new Policy([sword({ material, enchantment })]);
    expect(policy.claim([{ itemType: 'sword', amount }]).payout).toBe(payout);
  });

  it('rounds payouts down in the MHPCO favor', () => {
    const policy = new Policy([sword({ enchantment: 8 })]);
    // 901 * 0.5 = 450.5 - 100 = 350.5 -> 350
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('treats each damage entry of the same type separately', () => {
    const policy = new Policy([sword(), sword()]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('exhausts the cap across successive claims', () => {
    const policy = new Policy([sword()]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('invalid claims', () => {
  it('rejects damage to an item not in the policy', () => {
    const policy = new Policy([sword()]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(() => policy.claim([{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects more damages of a type than insured, without consuming cap', () => {
    const policy = new Policy([sword()]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]),
    ).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });

  it('rejects negative damage amounts', () => {
    const policy = new Policy([sword()]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow();
  });
});
