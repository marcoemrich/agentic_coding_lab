import { describe, it, expect } from 'vitest';
import { settleClaim } from './claim.js';

describe('settleClaim', () => {
  it('reimburses damage in full minus a 100 G deductible', () => {
    const policy = { items: [{ type: 'sword', material: 'steel', enchantment: 3 }] };
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] };
    expect(settleClaim(policy, incident).payout).toBe(400);
  });

  it('halves the damage for items with enchantment level 8 or higher', () => {
    const policy = { items: [{ type: 'sword', material: 'steel', enchantment: 9 }] };
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] };
    expect(settleClaim(policy, incident).payout).toBe(400);
  });

  it('reports the remaining cap of twice the insurance sum', () => {
    const policy = { items: [{ type: 'sword' }] };
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] };
    expect(settleClaim(policy, incident).remainingCap).toBe(1600);
  });

  it('limits the payout to the cap remaining on the policy', () => {
    const policy = { items: [{ type: 'sword' }], remainingCap: 600 };
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] };
    const result = settleClaim(policy, incident);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  it('rounds the payout down, in the MHPCO favour', () => {
    const policy = { items: [{ type: 'sword', enchantment: 9 }] };
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] };
    expect(settleClaim(policy, incident).payout).toBe(350);
  });

  it('rejects damage to an item the policy does not cover', () => {
    const policy = { items: [{ type: 'sword' }] };
    const incident = { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] };
    expect(() => settleClaim(policy, incident)).toThrow(/amulet/);
  });

  it('rejects more damages of a type than the policy covers items', () => {
    const policy = { items: [{ type: 'sword' }] };
    const incident = {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 300 },
      ],
    };
    expect(() => settleClaim(policy, incident)).toThrow(/sword/);
  });

  it('rejects a negative damage amount', () => {
    const policy = { items: [{ type: 'sword' }] };
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] };
    expect(() => settleClaim(policy, incident)).toThrow(/negative/);
  });
});
