import { describe, it, expect } from 'vitest';
import { insuranceSum, settleClaim } from './claim.js';
import type { Item, Policy } from './types.js';

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra }) as Item;

const policyOf = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * 2,
});

describe('insurance sum', () => {
  it('sums the items insurance values', () => {
    expect(insuranceSum([item('sword'), item('amulet')])).toBe(1600);
  });

  it('counts each of two swords', () => {
    expect(insuranceSum([item('sword'), item('sword')])).toBe(2000);
  });

  it('is unaffected by the component block discount', () => {
    expect(insuranceSum([item('sword'), ...Array(3).fill(item('rune'))])).toBe(1750);
  });
});

describe('settle claim', () => {
  it('reimburses fully minus the deductible', () => {
    const policy = policyOf([item('sword', { material: 'steel', enchantment: 3 })]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('reimburses a rune damage minus the deductible', () => {
    const policy = policyOf([item('rune')]);
    expect(settleClaim(policy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('halves damage for enchantment 8 before the deductible', () => {
    const policy = policyOf([item('sword', { material: 'dragon', enchantment: 8 })]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('lets the 50 % rule win over dragon material', () => {
    const policy = policyOf([item('sword', { material: 'dragon', enchantment: 9 })]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('fully reimburses dragon material below the enchantment threshold', () => {
    const policy = policyOf([item('sword', { material: 'dragon', enchantment: 5 })]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('halves damage for a steel sword at enchantment 9', () => {
    const policy = policyOf([item('sword', { material: 'steel', enchantment: 9 })]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = policyOf([item('sword'), item('amulet')]);
    const result = settleClaim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it('treats two damages of the same type separately', () => {
    const policy = policyOf([item('sword'), item('sword')]);
    const result = settleClaim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(3400);
  });

  it('caps the payout across successive claims', () => {
    const policy = policyOf([item('sword')]);
    const first = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = settleClaim({ ...policy, remainingCap: first.remainingCap }, [
      { itemType: 'sword', amount: 1500 },
    ]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  it('rounds the payout down', () => {
    const policy = policyOf([item('sword', { enchantment: 8 })]);
    // 901 / 2 = 450.5 - 100 = 350.5 -> 350
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('never pays a negative amount for a small damage', () => {
    const policy = policyOf([item('sword')]);
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });

  it('rejects damage to an item that is not insured', () => {
    const policy = policyOf([item('sword')]);
    expect(() => settleClaim(policy, [{ itemType: 'amulet', amount: 200 }])).toThrow();
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = policyOf([item('sword')]);
    expect(() =>
      settleClaim(policy, [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    ).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const policy = policyOf([item('sword')]);
    expect(() => settleClaim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow();
  });
});
