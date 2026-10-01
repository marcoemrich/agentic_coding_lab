import { describe, it, expect } from 'vitest';
import { Policy } from './claim';

const sword = (material = 'steel', enchantment = 3) => ({ type: 'sword', material, enchantment });

describe('policy cap', () => {
  it('cap is twice the insurance sum', () => {
    expect(new Policy([{ type: 'sword' }, { type: 'sword' }]).remainingCap).toBe(4000);
    expect(new Policy([{ type: 'sword' }, { type: 'amulet' }]).remainingCap).toBe(3200);
    expect(new Policy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
    expect(new Policy([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]).remainingCap).toBe(3500);
  });
});

describe('claim payout', () => {
  it('standard reimbursement minus deductible', () => {
    expect(new Policy([sword()]).claim([{ itemType: 'sword', amount: 500 }])).toBe(400);
    expect(new Policy([{ type: 'rune' }]).claim([{ itemType: 'rune', amount: 200 }])).toBe(100);
  });

  it('deductible applies per damaged item', () => {
    const policy = new Policy([sword(), { type: 'amulet' }]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toBe(600);
  });

  it('damage below deductible yields nothing for that item', () => {
    expect(new Policy([sword()]).claim([{ itemType: 'sword', amount: 50 }])).toBe(0);
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword enchantment %i damage %i -> %i', (material, enchantment, amount, expected) => {
    expect(new Policy([sword(material, enchantment)]).claim([{ itemType: 'sword', amount }])).toBe(expected);
  });

  it('rounds fractional payout down', () => {
    // 901 * 0.5 = 450.5 - 100 = 350.5 -> 350
    expect(new Policy([sword('steel', 8)]).claim([{ itemType: 'sword', amount: 901 }])).toBe(350);
  });

  it('two damages to two insured swords each get a deductible', () => {
    const policy = new Policy([sword(), sword()]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toBe(800);
  });

  it('successive claims exhaust the cap', () => {
    const policy = new Policy([sword()]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toBe(1400);
    expect(policy.remainingCap).toBe(600);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toBe(600);
    expect(policy.remainingCap).toBe(0);
  });

  it('rejects more damages of a type than insured', () => {
    const policy = new Policy([sword()]);
    expect(() => policy.claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });

  it('rejects damage to uninsured or unknown items', () => {
    expect(() => new Policy([sword()]).claim([{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(() => new Policy([sword()]).claim([{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects negative amounts', () => {
    expect(() => new Policy([sword()]).claim([{ itemType: 'sword', amount: -200 }])).toThrow();
  });
});
