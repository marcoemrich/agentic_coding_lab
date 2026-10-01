import { describe, it, expect } from 'vitest';
import { Policy } from './claim';
import { Item } from './items';

const steelSword = { type: 'sword', material: 'steel', enchantment: 3 };
const dmg = (itemType: string, amount: number) => ({ itemType, amount });

describe('policy cap', () => {
  it('sums insurance values of all items', () => {
    expect(new Policy([steelSword, { type: 'amulet' }]).remainingCap).toBe(3200);
    expect(new Policy([{ type: 'sword' }, { type: 'sword' }]).remainingCap).toBe(4000);
  });

  it('ignores premium modifiers and component blocks', () => {
    expect(new Policy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
    const runes = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
    expect(new Policy([{ type: 'sword' }, ...runes]).remainingCap).toBe(3500);
  });
});

describe('claim payout', () => {
  const payoutFor = (item: Item, amount: number) => new Policy([item]).claim([dmg(item.type, amount)]).payout;

  it('reimburses fully minus deductible without special clauses', () => {
    expect(payoutFor(steelSword, 500)).toBe(400);
    expect(payoutFor({ type: 'rune' }, 200)).toBe(100);
  });

  it('reimburses 50% for enchantment >= 8, then deductible', () => {
    expect(payoutFor({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
    expect(payoutFor({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
    expect(payoutFor({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
  });

  it('reimburses dragon material fully below enchantment 8', () => {
    expect(payoutFor({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
  });

  it('never pays negative amounts for damage below the deductible', () => {
    expect(payoutFor(steelSword, 50)).toBe(0);
  });

  it('rounds payout down', () => {
    // 50% of 901 = 450.5 - 100 = 350.5 -> 350
    expect(payoutFor({ type: 'sword', enchantment: 8 }, 901)).toBe(350);
  });

  it('applies the deductible per damaged item', () => {
    const policy = new Policy([steelSword, { type: 'amulet' }]);
    expect(policy.claim([dmg('sword', 500), dmg('amulet', 300)]).payout).toBe(600);
  });

  it('treats multiple damages of the same type separately', () => {
    const policy = new Policy([steelSword, steelSword]);
    expect(policy.claim([dmg('sword', 500), dmg('sword', 500)])).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('exhausts the cap over successive claims', () => {
    const policy = new Policy([steelSword]);
    expect(policy.claim([dmg('sword', 1500)])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([dmg('sword', 1500)])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rejects more damages of a type than insured', () => {
    const policy = new Policy([steelSword]);
    expect(() => policy.claim([dmg('sword', 500), dmg('sword', 500)])).toThrow();
  });

  it('rejects damages to items not on the policy', () => {
    const policy = new Policy([steelSword]);
    expect(() => policy.claim([dmg('amulet', 500)])).toThrow();
    expect(() => policy.claim([dmg('broomstick', 500)])).toThrow();
  });

  it('rejects negative damage amounts', () => {
    expect(() => new Policy([steelSword]).claim([dmg('sword', -200)])).toThrow();
  });

  it('leaves the cap untouched when a claim is rejected', () => {
    const policy = new Policy([steelSword]);
    expect(() => policy.claim([dmg('sword', 500), dmg('amulet', 1)])).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });
});
