import { describe, it, expect } from 'vitest';
import { Policy } from './policy.js';

const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });
const dmg = (itemType: string, amount: number) => ({ itemType, amount });

describe('policy claims', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([item('sword'), item('amulet')]);
    const result = policy.claim({ cause: 'dragon', damages: [dmg('sword', 500), dmg('amulet', 300)] });
    expect(result.payout).toBe(600);
  });

  it('exhausts the cap across successive claims', () => {
    const policy = new Policy([item('sword')]);
    const first = policy.claim({ cause: 'fire', damages: [dmg('sword', 1500)] });
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = policy.claim({ cause: 'fire', damages: [dmg('sword', 1500)] });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('treats two entries of one type as separate damages', () => {
    const policy = new Policy([item('sword'), item('sword')]);
    const result = policy.claim({ cause: 'dragon', damages: [dmg('sword', 500), dmg('sword', 500)] });
    expect(result.payout).toBe(800);
    expect(policy.insuranceSum).toBe(2000);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = new Policy([item('sword')]);
    expect(() => policy.claim({ cause: 'dragon', damages: [dmg('sword', 100), dmg('sword', 100)] }))
      .toThrow();
  });

  it('rejects a damage to an item outside the policy', () => {
    const policy = new Policy([item('sword')]);
    expect(() => policy.claim({ cause: 'fire', damages: [dmg('amulet', 200)] })).toThrow();
  });

  it('rejects a damage with an unknown item type', () => {
    const policy = new Policy([item('sword')]);
    expect(() => policy.claim({ cause: 'fire', damages: [dmg('broomstick', 200)] })).toThrow();
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([item('sword')]);
    expect(() => policy.claim({ cause: 'fire', damages: [dmg('sword', -200)] })).toThrow();
  });

  it('matches damages to the specific insured item, honouring its clauses', () => {
    const policy = new Policy([item('sword', { material: 'dragon', enchantment: 8 })]);
    expect(policy.claim({ cause: 'fire', damages: [dmg('sword', 1000)] }).payout).toBe(400);
  });
});
