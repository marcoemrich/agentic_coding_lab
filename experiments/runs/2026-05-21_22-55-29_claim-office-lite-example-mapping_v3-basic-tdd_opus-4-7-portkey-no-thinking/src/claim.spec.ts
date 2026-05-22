import { describe, it, expect } from 'vitest';
import { claim } from './claim.js';
import type { Item, Incident } from './types.js';

describe('claim — standard reimbursement', () => {
  it('regular steel sword (ench 3), damage 500 → 400', () => {
    const policy: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3 }];
    const incident: Incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] };
    expect(claim(policy, incident)).toBe(400);
  });

  it('rune, damage 200 → 100', () => {
    const policy: Item[] = [{ type: 'rune' }];
    const incident: Incident = { cause: 'flood', damages: [{ itemType: 'rune', amount: 200 }] };
    expect(claim(policy, incident)).toBe(100);
  });
});

describe('claim — high enchantment ≥ 8 → 50%', () => {
  it('steel sword ench 9, damage 1000 → 400', () => {
    const policy: Item[] = [{ type: 'sword', material: 'steel', enchantment: 9 }];
    const incident: Incident = { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1000 }] };
    expect(claim(policy, incident)).toBe(400);
  });

  it('steel sword exactly ench 8, damage 1000 → 400 (50% then deductible)', () => {
    const policy: Item[] = [{ type: 'sword', material: 'steel', enchantment: 8 }];
    const incident: Incident = { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1000 }] };
    expect(claim(policy, incident)).toBe(400);
  });

  it('dragon-material sword ench 8, damage 1000 → 400 (high-ench wins, then deductible)', () => {
    const policy: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 8 }];
    const incident: Incident = { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1000 }] };
    expect(claim(policy, incident)).toBe(400);
  });
});

describe('claim — dragon material full reimburse', () => {
  it('dragon sword ench 5, damage 800 → 700', () => {
    const policy: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 5 }];
    const incident: Incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] };
    expect(claim(policy, incident)).toBe(700);
  });

  it('dragon sword ench 9, damage 1000 → 400 (50% rule wins)', () => {
    const policy: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 9 }];
    const incident: Incident = { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1000 }] };
    expect(claim(policy, incident)).toBe(400);
  });
});

describe('claim — multi-damage event, per-damage deductible', () => {
  it('dragon attack: sword 500 + amulet 300 → 600', () => {
    const policy: Item[] = [{ type: 'sword' }, { type: 'amulet' }];
    const incident: Incident = {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    };
    expect(claim(policy, incident)).toBe(600);
  });
});

describe('claim — rounding', () => {
  it('rounds down (in MHPCO favor)', () => {
    // dragon sword ench 8, damage 1001 → 500.5 → after deductible 400.5 → round down to 400
    const policy: Item[] = [{ type: 'sword', material: 'dragon', enchantment: 8 }];
    const incident: Incident = { cause: 'x', damages: [{ itemType: 'sword', amount: 1001 }] };
    expect(claim(policy, incident)).toBe(400);
  });
});

describe('claim — errors', () => {
  it('rejects damage on item not in policy', () => {
    const policy: Item[] = [{ type: 'sword' }];
    const incident: Incident = { cause: 'x', damages: [{ itemType: 'amulet', amount: 100 }] };
    expect(() => claim(policy, incident)).toThrow();
  });

  it('rejects more damages of a type than policy covers', () => {
    const policy: Item[] = [{ type: 'sword' }];
    const incident: Incident = {
      cause: 'x',
      damages: [
        { itemType: 'sword', amount: 100 },
        { itemType: 'sword', amount: 100 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow();
  });

  it('rejects negative damage', () => {
    const policy: Item[] = [{ type: 'sword' }];
    const incident: Incident = { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] };
    expect(() => claim(policy, incident)).toThrow();
  });

  it('rejects unknown item type', () => {
    const policy: Item[] = [{ type: 'sword' }];
    const incident: Incident = { cause: 'x', damages: [{ itemType: 'broomstick', amount: 100 }] };
    expect(() => claim(policy, incident)).toThrow();
  });

  it('two swords insured, two sword damages → ok', () => {
    const policy: Item[] = [{ type: 'sword' }, { type: 'sword' }];
    const incident: Incident = {
      cause: 'x',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    };
    // each: 500 - 100 = 400; total 800
    expect(claim(policy, incident)).toBe(800);
  });
});

describe('claim — damage less than deductible', () => {
  it('damage 50 → payout 0 (not negative)', () => {
    const policy: Item[] = [{ type: 'sword' }];
    const incident: Incident = { cause: 'x', damages: [{ itemType: 'sword', amount: 50 }] };
    expect(claim(policy, incident)).toBe(0);
  });
});
