import { describe, it, expect } from 'vitest';
import { claim } from './claim.js';
import type { Item } from './quote.js';

describe('claim — basic reimbursement', () => {
  it('regular item: full damage minus 100 G deductible', () => {
    const items: Item[] = [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }];
    expect(
      claim(items, {
        cause: 'fire',
        damages: [{ itemType: 'amulet', amount: 200 }],
      }),
    ).toBe(100);
  });

  it('high-enchantment item (>=8): 50% of damage, then deductible', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }];
    expect(
      claim(items, {
        cause: 'goblin attack',
        damages: [{ itemType: 'sword', amount: 500 }],
      }),
      // 500 × 0.5 - 100 = 150
    ).toBe(150);
  });

  it('dragon-material item: fully reimbursed minus deductible', () => {
    const items: Item[] = [{ type: 'amulet', material: 'dragon', enchantment: 2, cursed: false }];
    expect(
      claim(items, {
        cause: 'fire',
        damages: [{ itemType: 'amulet', amount: 300 }],
      }),
      // full 300 - 100 = 200
    ).toBe(200);
  });

  it('dragon overrides high-enchantment rule', () => {
    const items: Item[] = [{ type: 'sword', material: 'dragonscale', enchantment: 10, cursed: false }];
    expect(
      claim(items, {
        cause: 'lava',
        damages: [{ itemType: 'sword', amount: 400 }],
      }),
      // dragon → full 400 - 100 = 300
    ).toBe(300);
  });
});

describe('claim — deductible behavior', () => {
  it('deductible is per event, not per damage line', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ];
    expect(
      claim(items, {
        cause: 'house fire',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'amulet', amount: 150 },
        ],
      }),
      // 200 + 150 = 350 - 100 = 250
    ).toBe(250);
  });

  it('payout cannot go negative when damage is below deductible', () => {
    const items: Item[] = [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }];
    expect(
      claim(items, {
        cause: 'spill',
        damages: [{ itemType: 'potion', amount: 50 }],
      }),
    ).toBe(0);
  });
});

describe('claim — rounding favors MHPCO', () => {
  it('half-reimbursement of odd damage rounds down', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }];
    expect(
      claim(items, {
        cause: 'duel',
        damages: [{ itemType: 'sword', amount: 301 }],
      }),
      // 301 × 0.5 = 150.5 → floor 150 - 100 = 50
    ).toBe(50);
  });
});
