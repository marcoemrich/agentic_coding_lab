import { describe, it, expect } from 'vitest';
import { Policy } from './policy';

const sword = (extra = {}) => ({ type: 'sword', ...extra });

describe('policy cap', () => {
  it('is twice the sum of insurance values', () => {
    expect(new Policy([sword(), { type: 'amulet' }]).remainingCap).toBe(3200);
    expect(new Policy([sword(), sword()]).remainingCap).toBe(4000);
    expect(new Policy([sword({ cursed: true })]).remainingCap).toBe(2000);
    const runes = Array.from({ length: 3 }, () => ({ type: 'rune' }));
    expect(new Policy([sword(), ...runes]).remainingCap).toBe(3500);
  });
});

describe('claim payout', () => {
  it('reimburses fully minus deductible without special clauses', () => {
    const policy = new Policy([sword({ material: 'steel', enchantment: 3 })]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses runes fully minus deductible', () => {
    const policy = new Policy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([sword(), { type: 'amulet' }]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword enchantment %i, damage %i → payout %i', (material, enchantment, amount, expected) => {
    const policy = new Policy([sword({ material, enchantment })]);
    expect(policy.claim([{ itemType: 'sword', amount }]).payout).toBe(expected);
  });

  it('treats each damage to same-type items separately', () => {
    const policy = new Policy([sword(), sword({ enchantment: 9 })]);
    // 1000 − 100 + 500 − 100
    expect(policy.claim([
      { itemType: 'sword', amount: 1000 },
      { itemType: 'sword', amount: 1000 },
    ]).payout).toBe(1300);
  });

  it('never pays a negative amount for damage below the deductible', () => {
    const policy = new Policy([sword()]);
    expect(policy.claim([{ itemType: 'sword', amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('exhausts the cap over successive claims', () => {
    const policy = new Policy([sword()]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rounds payouts down', () => {
    const policy = new Policy([sword({ enchantment: 8 })]);
    // 50 % of 901 = 450.5 − 100 = 350.5 → 350
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('rejects damage to items not covered', () => {
    expect(() => new Policy([sword()]).claim([{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(() => new Policy([sword()]).claim([{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects more damages of a type than covered items', () => {
    const policy = new Policy([sword()]);
    expect(() => policy.claim([
      { itemType: 'sword', amount: 100 },
      { itemType: 'sword', amount: 100 },
    ])).toThrow();
  });

  it('rejects negative damage amounts', () => {
    expect(() => new Policy([sword()]).claim([{ itemType: 'sword', amount: -200 }])).toThrow();
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = new Policy([sword()]);
    expect(() => policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 100 },
    ])).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });
});
