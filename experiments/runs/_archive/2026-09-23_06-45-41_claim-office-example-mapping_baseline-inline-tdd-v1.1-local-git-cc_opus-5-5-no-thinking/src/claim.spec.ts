import { describe, it, expect } from 'vitest';
import { Policy } from './claim';
import { ValidationError } from './catalog';

const sword = (extra = {}) => ({ type: 'sword', material: 'steel', enchantment: 3, ...extra });

describe('claim processing', () => {
  it('standard reimbursement minus deductible', () => {
    expect(new Policy([sword()]).claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
    expect(new Policy([{ type: 'rune' }]).claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('deductible applies per damaged item', () => {
    const policy = new Policy([sword(), { type: 'amulet' }]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]).payout,
    ).toBe(600);
  });

  it.each([
    ['dragon', 9, 1000, 400],
    ['dragon', 8, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword enchantment %i damage %i -> %i', (material, enchantment, amount, expected) => {
    const policy = new Policy([sword({ material, enchantment })]);
    expect(policy.claim([{ itemType: 'sword', amount }]).payout).toBe(expected);
  });

  it('damage below deductible pays nothing', () => {
    expect(new Policy([sword()]).claim([{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });

  it('cap is twice the unmodified insurance sum', () => {
    expect(new Policy([sword(), { type: 'amulet' }]).cap).toBe(3200);
    expect(new Policy([sword({ cursed: true })]).cap).toBe(2000);
    expect(new Policy([sword(), { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]).cap).toBe(3500);
    expect(new Policy([sword(), sword()]).cap).toBe(4000);
  });

  it('successive claims exhaust the cap', () => {
    const policy = new Policy([sword()]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('two insured swords can each be damaged with separate deductibles', () => {
    const policy = new Policy([sword(), sword({ material: 'dragon', enchantment: 9 })]);
    expect(
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 1000 },
      ]).payout,
    ).toBe(800);
  });

  it('rounds the final payout down', () => {
    const policy = new Policy([sword({ enchantment: 9 })]);
    // 301 / 2 - 100 = 50.5 -> 50
    expect(policy.claim([{ itemType: 'sword', amount: 301 }]).payout).toBe(50);
  });

  it.each([
    ['more damages of a type than insured', [{ itemType: 'sword', amount: 100 }, { itemType: 'sword', amount: 100 }]],
    ['item not in the policy', [{ itemType: 'amulet', amount: 100 }]],
    ['unknown item type', [{ itemType: 'broomstick', amount: 100 }]],
    ['negative amount', [{ itemType: 'sword', amount: -200 }]],
  ])('rejects %s without changing the cap', (_, damages) => {
    const policy = new Policy([sword()]);
    expect(() => policy.claim(damages)).toThrow(ValidationError);
    expect(policy.remainingCap).toBe(2000);
  });
});
