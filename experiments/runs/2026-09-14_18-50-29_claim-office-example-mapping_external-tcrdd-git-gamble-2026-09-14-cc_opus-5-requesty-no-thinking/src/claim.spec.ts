import { describe, it, expect } from 'vitest';
import { settleClaim } from './claim';

describe('settleClaim', () => {
  it('reimburses damage in full minus the 100 G deductible', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it('reimburses damage to items with enchantment >= 8 at 50%, then deducts', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it('caps the payout at the remaining cap', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 600,
    };
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 1500 }])).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('rounds the payout down, in the MHPCO favour', () => {
    // 901 halved = 450.5, minus 100 deductible = 350.5 -> 350
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    expect(settleClaim(policy, [{ itemType: 'sword', amount: 901 }])).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  it('rejects a claim damaging an item the policy does not cover', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    expect(() => settleClaim(policy, [{ itemType: 'amulet', amount: 200 }])).toThrow();
  });

  it('rejects a claim with a negative damage amount', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    expect(() => settleClaim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow();
  });

  it('applies the deductible once per damaged item', () => {
    const policy = {
      items: [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
      ],
      remainingCap: 3200,
    };
    expect(
      settleClaim(policy, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('treats each damage entry as a separate item of that type', () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 3, cursed: false };
    const policy = { items: [sword, sword], remainingCap: 4000 };
    expect(
      settleClaim(policy, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('rejects more damage entries of a type than the policy covers', () => {
    const policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    expect(() =>
      settleClaim(policy, [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]),
    ).toThrow();
  });
});
