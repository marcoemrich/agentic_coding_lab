import { describe, it, expect } from 'vitest';
import { createPolicy, processClaim } from './claim.js';
import type { Item } from './types.js';

describe('createPolicy - insurance sum and cap', () => {
  it('single sword: sum 1000, cap 2000', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }];
    const policy = createPolicy(items);
    expect(policy.insuranceSum).toBe(1000);
    expect(policy.cap).toBe(2000);
    expect(policy.remainingCap).toBe(2000);
  });

  it('sword + amulet: sum 1600, cap 3200', () => {
    const items: Item[] = [
      { type: 'sword' },
      { type: 'amulet' },
    ];
    const policy = createPolicy(items);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
  });

  it('sword + 3 runes: sum 1750 (block discount only affects premium)', () => {
    const items: Item[] = [
      { type: 'sword' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ];
    const policy = createPolicy(items);
    expect(policy.insuranceSum).toBe(1750);
    expect(policy.cap).toBe(3500);
  });

  it('cursed sword: cap based on unmodified insurance value', () => {
    const items: Item[] = [{ type: 'sword', cursed: true }];
    const policy = createPolicy(items);
    expect(policy.cap).toBe(2000);
  });

  it('two swords: sum 2000, cap 4000', () => {
    const items: Item[] = [{ type: 'sword' }, { type: 'sword' }];
    const policy = createPolicy(items);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });
});

describe('processClaim - standard reimbursement', () => {
  it('regular sword (steel, enchantment 3), damage 500 → payout 400', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it('rune (250 G), damage 200 → payout 100', () => {
    const items: Item[] = [{ type: 'rune' }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [{ itemType: 'rune', amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });
});

describe('processClaim - high enchantment threshold', () => {
  it('steel sword, enchantment 9, damage 1000 → payout 400', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it('dragon-material sword, enchantment 8, damage 1000 → payout 400 (high-ench applies, then deductible)', () => {
    const items: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it('dragon-material sword, enchantment 9, damage 1000 → payout 400 (50% rule wins)', () => {
    const items: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it('dragon-material sword, enchantment 5, damage 800 → payout 700 (dragon-only)', () => {
    const items: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });
});

describe('processClaim - deductible per damage event', () => {
  it('dragon attack on sword and amulet, payout 600', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 1, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 1, cursed: false },
    ];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    // 500-100 + 300-100 = 400 + 200 = 600
    expect(result.payout).toBe(600);
  });
});

describe('processClaim - cap exhaustion', () => {
  it('sword, two successive claims of 1500 G each', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }];
    const policy = createPolicy(items);
    const r1 = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);

    const r2 = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });
});

describe('processClaim - multiple items of the same type', () => {
  it('two swords damaged → two separate damages with own deductibles', () => {
    const items: Item[] = [{ type: 'sword' }, { type: 'sword' }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    // (500-100) + (500-100) = 800
    expect(result.payout).toBe(800);
  });

  it('damages contains more sword entries than insured → throws', () => {
    const items: Item[] = [{ type: 'sword' }];
    const policy = createPolicy(items);
    expect(() =>
      processClaim(policy, items, {
        damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ],
      })
    ).toThrow();
  });
});

describe('processClaim - error cases', () => {
  it('claim references item not part of policy → throws', () => {
    const items: Item[] = [{ type: 'sword' }];
    const policy = createPolicy(items);
    expect(() =>
      processClaim(policy, items, {
        damages: [{ itemType: 'amulet', amount: 200 }],
      })
    ).toThrow();
  });

  it('damage amount negative → throws', () => {
    const items: Item[] = [{ type: 'sword' }];
    const policy = createPolicy(items);
    expect(() =>
      processClaim(policy, items, {
        damages: [{ itemType: 'sword', amount: -200 }],
      })
    ).toThrow();
  });

  it('unknown item type in damages → throws', () => {
    const items: Item[] = [{ type: 'sword' }];
    const policy = createPolicy(items);
    expect(() =>
      processClaim(policy, items, {
        damages: [{ itemType: 'broomstick', amount: 200 }],
      })
    ).toThrow();
  });
});

describe('processClaim - payout rounding in MHPCO favor (down)', () => {
  it('payout 350.5 → 350 (rounded down)', () => {
    // dragon-material sword, ench 8, damage 801 → 0.5 * 801 = 400.5 - 100 = 300.5 → 300
    // Let me find a case that yields 350.5
    // dragon sword ench 9, damage 901 → 450.5 - 100 = 350.5 → 350
    const items: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }];
    const policy = createPolicy(items);
    const result = processClaim(policy, items, {
      damages: [{ itemType: 'sword', amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });
});
