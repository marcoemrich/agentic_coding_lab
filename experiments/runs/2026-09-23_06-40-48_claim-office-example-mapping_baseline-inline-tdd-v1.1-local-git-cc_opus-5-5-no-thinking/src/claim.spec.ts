import { describe, it, expect } from 'vitest';
import { Policy } from './claim';

describe('claim processing', () => {
  it('standard reimbursement minus deductible', () => {
    const p = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(p.claim([{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('rune damage', () => {
    const p = new Policy([{ type: 'rune' }]);
    expect(p.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('deductible applies per damaged item', () => {
    const p = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(p.claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword enchantment %i damage %i -> %i', (material, enchantment, amount, payout) => {
    const p = new Policy([{ type: 'sword', material, enchantment }]);
    expect(p.claim([{ itemType: 'sword', amount }]).payout).toBe(payout);
  });

  it('damage below deductible pays nothing', () => {
    const p = new Policy([{ type: 'sword' }]);
    expect(p.claim([{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });

  it('rounds payout down', () => {
    const p = new Policy([{ type: 'sword', enchantment: 9 }]);
    // 901 * 0.5 = 450.5 - 100 = 350.5 -> 350
    expect(p.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('two swords are two separate damages with own enchantment', () => {
    const p = new Policy([{ type: 'sword', enchantment: 9 }, { type: 'sword' }]);
    // (500-100) + (1000-100)
    expect(p.claim([{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 }])).toEqual({
      payout: 1300,
      remainingCap: 2700,
    });
  });

  it('cap is exhausted across successive claims', () => {
    const p = new Policy([{ type: 'sword', cursed: true }]);
    expect(p.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(p.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('insurance sum ignores block discount', () => {
    const p = new Policy([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]);
    expect(p.remainingCap).toBe(3500);
  });

  it('rejects damage to uninsured item', () => {
    const p = new Policy([{ type: 'sword' }]);
    expect(() => p.claim([{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(() => p.claim([{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects more damages of a type than insured, without consuming cap', () => {
    const p = new Policy([{ type: 'sword' }]);
    expect(() =>
      p.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]),
    ).toThrow();
    expect(p.remainingCap).toBe(2000);
  });

  it('rejects negative amount', () => {
    const p = new Policy([{ type: 'sword' }]);
    expect(() => p.claim([{ itemType: 'sword', amount: -200 }])).toThrow();
  });
});
