import { describe, it, expect } from 'vitest';
import { Policy, processClaim } from './claim';

function policy(items: Policy['items']): Policy {
  return new Policy(items);
}

describe('Policy cap', () => {
  it('sword + amulet → cap 3200', () => {
    expect(policy([{ type: 'sword' }, { type: 'amulet' }]).remainingCap).toBe(3200);
  });
  it('two swords → cap 4000', () => {
    expect(policy([{ type: 'sword' }, { type: 'sword' }]).remainingCap).toBe(4000);
  });
  it('cursed sword → cap 2000', () => {
    expect(policy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
  });
  it('sword + 3 runes → cap 3500', () => {
    expect(policy([{ type: 'sword' }, ...Array(3).fill({ type: 'rune' })]).remainingCap).toBe(3500);
  });
});

describe('processClaim', () => {
  it('standard reimbursement minus deductible', () => {
    const p = policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(processClaim(p, [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('rune damage 200 → 100', () => {
    expect(processClaim(policy([{ type: 'rune' }]), [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('deductible per damaged item', () => {
    const p = policy([{ type: 'sword' }, { type: 'amulet' }]);
    const r = processClaim(p, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(r.payout).toBe(600);
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword enchantment %i damage %i → %i', (material, enchantment, amount, expected) => {
    const p = policy([{ type: 'sword', material, enchantment }]);
    expect(processClaim(p, [{ itemType: 'sword', amount }]).payout).toBe(expected);
  });

  it('damage below deductible pays nothing', () => {
    expect(processClaim(policy([{ type: 'sword' }]), [{ itemType: 'sword', amount: 50 }]).payout).toBe(0);
  });

  it('rounds payout down', () => {
    // 50% of 901 = 450.5 - 100 = 350.5 → 350
    const p = policy([{ type: 'sword', enchantment: 8 }]);
    expect(processClaim(p, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('cap exhaustion across successive claims', () => {
    const p = policy([{ type: 'sword' }]);
    expect(processClaim(p, [{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(processClaim(p, [{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('two sword damages on two insured swords each get a deductible', () => {
    const p = policy([{ type: 'sword' }, { type: 'sword' }]);
    expect(
      processClaim(p, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]).payout,
    ).toBe(800);
  });

  it('matches damages to items of the same type in order', () => {
    const p = policy([{ type: 'sword', enchantment: 9 }, { type: 'sword' }]);
    expect(
      processClaim(p, [
        { itemType: 'sword', amount: 1000 },
        { itemType: 'sword', amount: 1000 },
      ]).payout,
    ).toBe(400 + 900);
  });

  it('rejects more damages of a type than insured', () => {
    const p = policy([{ type: 'sword' }]);
    expect(() =>
      processClaim(p, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]),
    ).toThrow();
  });

  it('rejects damage to uninsured or unknown item', () => {
    const p = policy([{ type: 'sword' }]);
    expect(() => processClaim(p, [{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(() => processClaim(p, [{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects negative amount', () => {
    expect(() => processClaim(policy([{ type: 'sword' }]), [{ itemType: 'sword', amount: -200 }])).toThrow();
  });

  it('rejected claim does not consume cap', () => {
    const p = policy([{ type: 'sword' }]);
    expect(() =>
      processClaim(p, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 500 },
      ]),
    ).toThrow();
    expect(p.remainingCap).toBe(2000);
  });
});
