import { Policy } from './policy';

describe('Policy claim', () => {
  it('pays damage minus deductible for a regular sword and reduces the cap', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);

    const result = policy.claim([{ itemType: 'sword', amount: 500 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it.each([
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('pays for a %s sword with enchantment %i and damage %i: %i', (material, enchantment, amount, payout) => {
    const policy = new Policy([{ type: 'sword', material, enchantment }]);

    const result = policy.claim([{ itemType: 'sword', amount }]);

    expect(result.payout).toBe(payout);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);

    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);

    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('treats damages to two insured swords as separate damages', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'sword' }]);

    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);

    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('bases the cap on unblocked insurance values for a sword and 3 runes', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]);

    const result = policy.claim([]);

    expect(result.remainingCap).toBe(3500);
  });

  it('reduces a successive claim to the remaining cap', () => {
    const policy = new Policy([{ type: 'sword' }]);
    const first = policy.claim([{ itemType: 'sword', amount: 1500 }]);

    const second = policy.claim([{ itemType: 'sword', amount: 1500 }]);

    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rounds the payout down from 350.5 to 350', () => {
    const policy = new Policy([{ type: 'amulet', enchantment: 9 }]);

    const result = policy.claim([{ itemType: 'amulet', amount: 901 }]);

    expect(result).toEqual({ payout: 350, remainingCap: 850 });
  });

  it('pays nothing for damage below the deductible', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const result = policy.claim([{ itemType: 'sword', amount: 50 }]);

    expect(result).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('rejects damage to an item that is not part of the policy', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claiming = () => policy.claim([{ itemType: 'amulet', amount: 300 }]);

    expect(claiming).toThrow(/not covered: amulet/i);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claiming = () =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]);

    expect(claiming).toThrow(/not covered: sword/i);
  });

  it('rejects damage to an item with an unknown type', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claiming = () => policy.claim([{ itemType: 'broomstick', amount: 300 }]);

    expect(claiming).toThrow(/not covered: broomstick/i);
  });

  it('bases the cap of a cursed sword on its unmodified insurance value', () => {
    const policy = new Policy([{ type: 'sword', cursed: true }]);

    const result = policy.claim([]);

    expect(result.remainingCap).toBe(2000);
  });

  it('rejects a negative damage amount', () => {
    const policy = new Policy([{ type: 'sword' }]);

    const claiming = () => policy.claim([{ itemType: 'sword', amount: -200 }]);

    expect(claiming).toThrow(/invalid damage amount: -200/i);
  });

  it('keeps the cap untouched after a rejected claim', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]),
    ).toThrow();

    const result = policy.claim([{ itemType: 'sword', amount: 500 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('pays damage minus deductible for a rune whose cap is twice its insurance value of 250', () => {
    const policy = new Policy([{ type: 'rune' }]);

    const result = policy.claim([{ itemType: 'rune', amount: 200 }]);

    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  it.each([
    ['sword', 2000],
    ['amulet', 1200],
    ['staff', 1600],
    ['potion', 800],
    ['rune', 500],
    ['moonstone', 500],
  ])('pays nothing for a claim without damages and keeps the full cap of a %s', (type, cap) => {
    const policy = new Policy([{ type }]);

    const result = policy.claim([]);

    expect(result).toEqual({ payout: 0, remainingCap: cap });
  });

  it('reimburses half the damage for a dragon sword with exactly enchantment 8', () => {
    const policy = new Policy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);

    const result = policy.claim([{ itemType: 'sword', amount: 1000 }]);

    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
});
