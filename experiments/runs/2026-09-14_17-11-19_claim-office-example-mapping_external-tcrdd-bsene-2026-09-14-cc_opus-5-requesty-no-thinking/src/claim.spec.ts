import { describe, it, expect } from 'vitest';
import { settleClaim } from './claim.js';

describe('claim', () => {
  it('reimburses the damage minus the 100 G deductible', () => {
    const policy = { items: [{ type: 'sword', material: 'steel', enchantment: 3 }] };
    const damages = [{ itemType: 'sword', amount: 500 }];
    expect(settleClaim(policy, damages).payout).toBe(400);
  });

  it('reimburses only 50% of damage to an item with enchantment 8 or more', () => {
    const policy = { items: [{ type: 'sword', material: 'steel', enchantment: 9 }] };
    const damages = [{ itemType: 'sword', amount: 1000 }];
    expect(settleClaim(policy, damages).payout).toBe(400);
  });

  it('reports the remaining cap of twice the insurance sum', () => {
    const policy = { items: [{ type: 'sword' }] };
    const damages = [{ itemType: 'sword', amount: 500 }];
    expect(settleClaim(policy, damages).remainingCap).toBe(1600);
  });

  it('limits a later claim to the cap remaining on the policy', () => {
    const policy = { items: [{ type: 'sword' }] };
    const first = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    const second = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rounds a fractional payout down, in the MHPCO favour', () => {
    const policy = { items: [{ type: 'sword', enchantment: 9 }] };
    const damages = [{ itemType: 'sword', amount: 901 }];
    expect(settleClaim(policy, damages).payout).toBe(350);
  });

  it('rejects a damage to an item the policy does not cover', () => {
    const policy = { items: [{ type: 'sword' }] };
    const damages = [{ itemType: 'amulet', amount: 300 }];
    expect(() => settleClaim(policy, damages)).toThrow(/amulet/);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = { items: [{ type: 'sword' }] };
    const damages = [
      { itemType: 'sword', amount: 300 },
      { itemType: 'sword', amount: 300 },
    ];
    expect(() => settleClaim(policy, damages)).toThrow(/sword/);
  });

  it('settles two damages when two items of the type are insured', () => {
    const policy = { items: [{ type: 'sword' }, { type: 'sword' }] };
    const damages = [
      { itemType: 'sword', amount: 300 },
      { itemType: 'sword', amount: 300 },
    ];
    expect(settleClaim(policy, damages)).toEqual({ payout: 400, remainingCap: 3600 });
  });

  it('rejects a negative damage amount', () => {
    const policy = { items: [{ type: 'sword' }] };
    const damages = [{ itemType: 'sword', amount: -200 }];
    expect(() => settleClaim(policy, damages)).toThrow(/negative/);
  });

  it('never lets a damage below the deductible reduce the payout', () => {
    const policy = { items: [{ type: 'sword' }, { type: 'amulet' }] };
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 20 },
    ];
    expect(settleClaim(policy, damages).payout).toBe(400);
  });
});
