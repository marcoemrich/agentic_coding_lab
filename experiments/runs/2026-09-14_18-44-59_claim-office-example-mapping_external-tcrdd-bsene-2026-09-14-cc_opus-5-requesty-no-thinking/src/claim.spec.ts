import { describe, it, expect } from 'vitest';
import { settleClaim } from './claim';

describe('settleClaim', () => {
  it('reimburses the damage minus the deductible', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3 }],
      remainingCap: 2000,
    };
    const damages = [{ itemType: 'sword', amount: 500 }];
    expect(settleClaim(policy, damages).payout).toBe(400);
  });

  it('reimburses only 50% of damage to items with enchantment 8 or more', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 9 }],
      remainingCap: 2000,
    };
    const damages = [{ itemType: 'sword', amount: 1000 }];
    expect(settleClaim(policy, damages).payout).toBe(400);
  });

  it('reports the cap remaining after the payout', () => {
    const policy = { items: [{ type: 'sword' }], remainingCap: 2000 };
    const result = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(result).toEqual({ payout: 1400, remainingCap: 600 });
  });

  it('limits the payout to the remaining cap', () => {
    const policy = { items: [{ type: 'sword' }], remainingCap: 600 };
    const result = settleClaim(policy, [{ itemType: 'sword', amount: 1500 }]);
    expect(result).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rounds the payout down, in the MHPCO favour', () => {
    const policy = { items: [{ type: 'sword', enchantment: 8 }], remainingCap: 2000 };
    const result = settleClaim(policy, [{ itemType: 'sword', amount: 901 }]);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('rejects a damage to an item the policy does not cover', () => {
    const policy = { items: [{ type: 'sword' }], remainingCap: 2000 };
    expect(() => settleClaim(policy, [{ itemType: 'amulet', amount: 300 }])).toThrow(/amulet/);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = { items: [{ type: 'sword' }], remainingCap: 2000 };
    const damages = [
      { itemType: 'sword', amount: 300 },
      { itemType: 'sword', amount: 300 },
    ];
    expect(() => settleClaim(policy, damages)).toThrow(/more damages of type sword/);
  });

  it('rejects a negative damage amount', () => {
    const policy = { items: [{ type: 'sword' }], remainingCap: 2000 };
    expect(() => settleClaim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow(/negative/);
  });

  it('fully reimburses dragon material, but the 50% clause still wins', () => {
    const dragonLow = {
      items: [{ type: 'sword', material: 'dragon', enchantment: 5 }],
      remainingCap: 2000,
    };
    expect(settleClaim(dragonLow, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
    const dragonHigh = {
      items: [{ type: 'sword', material: 'dragon', enchantment: 8 }],
      remainingCap: 2000,
    };
    expect(settleClaim(dragonHigh, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = { items: [{ type: 'sword' }, { type: 'amulet' }], remainingCap: 3200 };
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(settleClaim(policy, damages).payout).toBe(600);
  });

  it('reimburses a component, which has no enchantment or material', () => {
    const policy = { items: [{ type: 'rune' }], remainingCap: 500 };
    expect(settleClaim(policy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });
});
