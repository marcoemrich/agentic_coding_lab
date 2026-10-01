import { describe, it, expect } from 'vitest';
import { createPolicy, processClaim } from './claim';

describe('processClaim', () => {
  it('reimburses a regular sword fully minus the 100 G deductible', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(processClaim(policy, [{ itemType: 'sword', amount: 500 }]).payout).toBe(400);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ];
    expect(processClaim(policy, damages).payout).toBe(600);
  });

  it('reimburses a damaged rune fully minus the deductible', () => {
    const policy = createPolicy([{ type: 'rune' }]);
    expect(processClaim(policy, [{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it.each([
    ['steel', 9, 1000, 400], // 50 % clause: 500 - 100
    ['dragon', 9, 1000, 400], // 50 % clause wins over dragon material
    ['dragon', 8, 1000, 400], // exactly 8: 50 % clause applies
    ['dragon', 5, 800, 700], // dragon material only: full reimbursement
  ])('%s sword with enchantment %i and damage %i pays out %i G', (material, enchantment, amount, expected) => {
    const policy = createPolicy([{ type: 'sword', material, enchantment }]);
    expect(processClaim(policy, [{ itemType: 'sword', amount }]).payout).toBe(expected);
  });

  it('reduces a claim to the remaining cap across successive claims', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    const damage = [{ itemType: 'sword', amount: 1500 }];
    expect(processClaim(policy, damage)).toEqual({ payout: 1400, remainingCap: 600 });
    expect(processClaim(policy, damage)).toEqual({ payout: 600, remainingCap: 0 });
  });

  it.each([
    ['two swords', [{ type: 'sword' }, { type: 'sword' }], 4000],
    ['a sword and an amulet', [{ type: 'sword' }, { type: 'amulet' }], 3200],
    ['a sword and a block of 3 runes', [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    ['a cursed sword', [{ type: 'sword', cursed: true }], 2000],
    ['a staff and a potion', [{ type: 'staff' }, { type: 'potion' }], 2400],
  ])('caps a policy covering %s at %i G', (_label, items, cap) => {
    const policy = createPolicy(items);
    // a claim without damages pays nothing, so the full cap remains
    expect(processClaim(policy, []).remainingCap).toBe(cap);
  });

  it('rounds a fractional payout down to whole G', () => {
    const policy = createPolicy([{ type: 'sword', enchantment: 9 }]);
    expect(processClaim(policy, [{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('never lets a damage below the deductible reduce the payout for other damages', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 40 },
    ];
    expect(processClaim(policy, damages).payout).toBe(400);
  });

  it.each([
    ['an item type not on the policy', [{ itemType: 'amulet', amount: 200 }]],
    ['an unknown item type', [{ itemType: 'broomstick', amount: 200 }]],
    ['more damages of a type than insured items', [
      { itemType: 'sword', amount: 200 },
      { itemType: 'sword', amount: 200 },
    ]],
    ['a negative amount', [{ itemType: 'sword', amount: -200 }]],
  ])('rejects a claim with %s and leaves the cap untouched', (_label, damages) => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() => processClaim(policy, damages)).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });

  it('treats damages to two insured swords as separate damages, each with its own deductible', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword', enchantment: 9 }]);
    const damages = [
      { itemType: 'sword', amount: 500 }, // first sword: 500 - 100
      { itemType: 'sword', amount: 1000 }, // second sword (enchantment 9): 500 - 100
    ];
    expect(processClaim(policy, damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });
});
