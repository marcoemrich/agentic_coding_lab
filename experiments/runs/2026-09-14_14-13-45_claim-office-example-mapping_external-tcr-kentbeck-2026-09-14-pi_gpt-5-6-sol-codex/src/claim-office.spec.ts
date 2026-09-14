import { describe, expect, it } from 'vitest';
import { createPolicy, itemPrice, processClaim, quotePremium } from './claim-office';

describe('price list', () => {
  it.each([
    ['sword', 1000, 100],
    ['amulet', 600, 60],
    ['staff', 800, 80],
    ['potion', 400, 40],
    ['rune', 250, 25],
    ['moonstone', 250, 25],
  ])('prices a %s', (type, value, premium) => {
    expect(itemPrice({ type })).toEqual({ value, premium });
  });

  it('rejects an unknown item type', () => {
    expect(() => itemPrice({ type: 'broomstick' })).toThrow('Unknown item type');
  });
});

describe('quotes', () => {
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('prices %i alike runes', (count, premium) => {
    expect(quotePremium(Array.from({ length: count }, () => ({ type: 'rune' })), 0)).toBe(premium);
  });

  it('forms separate blocks only from exactly alike components', () => {
    const twoBlocks = [
      ...Array.from({ length: 3 }, () => ({ type: 'rune' })),
      ...Array.from({ length: 3 }, () => ({ type: 'moonstone' })),
    ];
    expect(quotePremium(twoBlocks, 0)).toBe(137);
    expect(quotePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }], 0)).toBe(88);
  });

  it('scopes item modifiers and stacks policy modifiers', () => {
    expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }], 0)).toBe(231);
    expect(quotePremium([{ type: 'sword', cursed: true, enchantment: 3 }], 0)).toBe(165);
    expect(quotePremium([{ type: 'sword', cursed: true, enchantment: 7 }], 3, 1)).toBe(160);
  });

  it('applies modifiers at their exact thresholds', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], 2)).toBe(125);
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], 1)).toBe(115);
  });

  it('charges only the processing fee for an empty policy', () => {
    expect(quotePremium([], 0)).toBe(5);
  });
});

describe('claims', () => {
  it('applies a deductible to every damaged item', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(processClaim(policy, [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('halves highly enchanted damage before the deductible even for dragon material', () => {
    const enchanted = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    expect(processClaim(enchanted, [{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
    const dragon = createPolicy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    expect(processClaim(dragon, [{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
  });

  it('rounds payout down only after adding damage amounts', () => {
    const policy = createPolicy([
      { type: 'sword', enchantment: 9 },
      { type: 'sword', enchantment: 9 },
    ]);
    expect(processClaim(policy, [
      { itemType: 'sword', amount: 1001 },
      { itemType: 'sword', amount: 1002 },
    ]).payout).toBe(801);
  });

  it('tracks and exhausts the policy cap over successive claims', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(processClaim(policy, [{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(processClaim(policy, [{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('uses item values, including every component, for the cap', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]);
    expect(policy.remainingCap).toBe(3500);
  });

  it('rejects negative and uncovered damage', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() => processClaim(policy, [{ itemType: 'sword', amount: -200 }])).toThrow('negative');
    expect(() => processClaim(policy, [{ itemType: 'amulet', amount: 100 }])).toThrow('not covered');
    expect(() => processClaim(policy, [
      { itemType: 'sword', amount: 100 },
      { itemType: 'sword', amount: 100 },
    ])).toThrow('not covered');
  });
});
