import { describe, it, expect } from 'vitest';
import { processClaim, createPolicy } from './claim.js';
import { Item } from './types.js';

function makePolicy(items: Item[]) {
  return createPolicy(items);
}

describe('processClaim - standard reimbursement', () => {
  it('regular sword damage 500 -> 400 (full minus 100 deductible)', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]);
    const result = processClaim(policy, { damages: [{ itemType: 'sword', amount: 500 }] });
    expect(result.payout).toBe(400);
  });

  it('rune damage 200 -> 100 (full minus 100 deductible)', () => {
    const policy = makePolicy([{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }]);
    const result = processClaim(policy, { damages: [{ itemType: 'rune', amount: 200 }] });
    expect(result.payout).toBe(100);
  });
});

describe('processClaim - high enchantment 50%', () => {
  it('steel sword ench 9, damage 1000 -> 400 (50% then deductible)', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }]);
    const result = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  it('exact ench 8 triggers high enchantment', () => {
    // dragon-material sword, ench 8, damage 1000: payout 400 (high-ench applies, then deductible)
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }]);
    const result = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
});

describe('processClaim - dragon material full reimbursement', () => {
  it('dragon-material sword, ench 5, damage 800 -> 700', () => {
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }]);
    const result = processClaim(policy, { damages: [{ itemType: 'sword', amount: 800 }] });
    expect(result.payout).toBe(700);
  });

  it('dragon-material sword ench 9 damage 1000 -> 400 (50% wins)', () => {
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }]);
    const result = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
});

describe('processClaim - per-damage deductible', () => {
  it('sword 500 + amulet 300 -> 600 (each minus 100 deductible)', () => {
    const policy = makePolicy([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ]);
    const result = processClaim(policy, {
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
});

describe('processClaim - cap exhaustion', () => {
  it('sword cap 2000; first claim 1500 -> 1400; remaining 600', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    const r1 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
  });

  it('second claim limited to remaining cap', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    const r2 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });
});

describe('processClaim - multiple items of same type', () => {
  it('two swords, damages list has two sword entries -> each treated separately', () => {
    const policy = makePolicy([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
    ]);
    // insurance sum 2000, cap 4000
    const result = processClaim(policy, {
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    expect(result.payout).toBe(800); // (500-100) + (500-100)
    expect(result.remainingCap).toBe(3200);
  });

  it('rejects when more damage entries of a type than insured items', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() =>
      processClaim(policy, {
        damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ],
      })
    ).toThrow();
  });
});

describe('processClaim - error handling', () => {
  it('rejects damage referencing item not in policy', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() =>
      processClaim(policy, { damages: [{ itemType: 'amulet', amount: 100 }] })
    ).toThrow();
  });

  it('rejects damage with negative amount', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() =>
      processClaim(policy, { damages: [{ itemType: 'sword', amount: -200 }] })
    ).toThrow();
  });

  it('rejects unknown item type in damage', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(() =>
      processClaim(policy, { damages: [{ itemType: 'broomstick', amount: 100 }] })
    ).toThrow();
  });
});

describe('createPolicy - insurance sum', () => {
  it('sword + amulet -> 1600', () => {
    const policy = makePolicy([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
    expect(policy.remainingCap).toBe(3200);
  });

  it('sword + 3 runes -> 1750 (block does not affect insurance sum)', () => {
    const policy = makePolicy([
      { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ...Array(3).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false }),
    ]);
    expect(policy.insuranceSum).toBe(1750);
  });

  it('cursed sword cap based on unmodified insurance value', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }]);
    expect(policy.cap).toBe(2000);
  });
});

describe('processClaim - rounding payout in MHPCO favor', () => {
  it('rounds payout down (350.5 -> 350)', () => {
    // Need a scenario producing 350.5 fractional payout. High-ench at 50%: damage 901 -> 450.5 -> -100 = 350.5 -> 350
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }]);
    const result = processClaim(policy, { damages: [{ itemType: 'sword', amount: 901 }] });
    expect(result.payout).toBe(350);
  });
});
