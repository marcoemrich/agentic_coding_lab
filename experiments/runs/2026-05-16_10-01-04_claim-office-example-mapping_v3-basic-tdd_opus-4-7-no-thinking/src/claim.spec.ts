import { describe, it, expect } from 'vitest';
import { processClaim, Policy } from './claim.js';

function makePolicy(items: any[]): Policy {
  return {
    items,
    insuranceSum: 0, // will compute
    remainingCap: 0,
  };
}

describe('processClaim - standard reimbursement', () => {
  it('regular sword damage 500 => payout 400', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 500 }] });
    expect(r.payout).toBe(400);
    expect(r.remainingCap).toBe(1600);
  });

  it('rune damage 200 => payout 100', () => {
    const items = [{ type: 'rune' }];
    const policy: Policy = { items, insuranceSum: 250, remainingCap: 500 };
    const r = processClaim(policy, { damages: [{ itemType: 'rune', amount: 200 }] });
    expect(r.payout).toBe(100);
    expect(r.remainingCap).toBe(400);
  });
});

describe('processClaim - high enchantment', () => {
  it('steel sword enchant 9, damage 1000 => 400', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(r.payout).toBe(400);
    expect(r.remainingCap).toBe(1600);
  });

  it('dragon sword enchant 8 (exactly), damage 1000 => 400 (high-enchant first then deductible)', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(r.payout).toBe(400);
  });

  it('dragon sword enchant 9, damage 1000 => 400 (50% rule wins)', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1000 }] });
    expect(r.payout).toBe(400);
  });
});

describe('processClaim - dragon material', () => {
  it('dragon sword enchant 5, damage 800 => 700', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 800 }] });
    expect(r.payout).toBe(700);
  });
});

describe('processClaim - multiple damage items', () => {
  it('sword and amulet damaged in one incident', () => {
    const items = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
    ];
    const policy: Policy = { items, insuranceSum: 1600, remainingCap: 3200 };
    const r = processClaim(policy, { damages: [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 }
    ]});
    expect(r.payout).toBe(600); // (500-100) + (300-100)
    expect(r.remainingCap).toBe(2600);
  });
});

describe('processClaim - cap exhaustion', () => {
  it('two successive 1500 G claims on a 1000 G sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    const r1 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim(policy, { damages: [{ itemType: 'sword', amount: 1500 }] });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });
});

describe('processClaim - rounding', () => {
  it('payout rounds down (350.5 => 350)', () => {
    // dragon sword enchant 9, damage 901 => 50% = 450.5, -100 = 350.5 => 350
    const items = [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    const r = processClaim(policy, { damages: [{ itemType: 'sword', amount: 901 }] });
    expect(r.payout).toBe(350);
  });
});

describe('processClaim - validation errors', () => {
  it('throws on damage entry for item not in policy', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    expect(() => processClaim(policy, { damages: [{ itemType: 'amulet', amount: 200 }] })).toThrow();
  });

  it('throws on negative damage amount', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    expect(() => processClaim(policy, { damages: [{ itemType: 'sword', amount: -200 }] })).toThrow();
  });

  it('throws when too many damage entries for one item type', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }];
    const policy: Policy = { items, insuranceSum: 1000, remainingCap: 2000 };
    expect(() => processClaim(policy, { damages: [
      { itemType: 'sword', amount: 100 }, { itemType: 'sword', amount: 100 }
    ]})).toThrow();
  });
});
