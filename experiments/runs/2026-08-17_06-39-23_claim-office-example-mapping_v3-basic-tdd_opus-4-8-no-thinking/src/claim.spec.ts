import { describe, it, expect } from 'vitest';
import { Policy } from './claim.js';
import { roundPayout } from './claim.js';
import type { Item } from './types.js';

function policyOf(items: Item[]): Policy {
  return new Policy(items);
}

describe('insurance sum and cap', () => {
  it('two swords → insurance sum 2000, cap 4000', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    expect(p.insuranceSum).toBe(2000);
    expect(p.remainingCap).toBe(4000);
  });

  it('sword + amulet → insurance sum 1600, cap 3200', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    expect(p.insuranceSum).toBe(1600);
    expect(p.remainingCap).toBe(3200);
  });

  it('cursed sword → cap based on unmodified insurance value (2000)', () => {
    const p = policyOf([{ type: 'sword', cursed: true }]);
    expect(p.insuranceSum).toBe(1000);
    expect(p.remainingCap).toBe(2000);
  });

  it('sword + 3 runes (block) → insurance sum 1750 (block discount does not affect sum)', () => {
    const p = policyOf([
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ]);
    expect(p.insuranceSum).toBe(1750);
  });
});

describe('standard reimbursement', () => {
  it('regular sword (steel, ench 3), damage 500 → payout 400', () => {
    const p = policyOf([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    const r = p.claim({
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(r.payout).toBe(400);
  });

  it('damage to a rune (value 250), damage 200 → payout 100', () => {
    const p = policyOf([{ type: 'rune' }]);
    const r = p.claim({
      cause: 'fire',
      damages: [{ itemType: 'rune', amount: 200 }],
    });
    expect(r.payout).toBe(100);
  });
});

describe('enchantment threshold vs dragon material', () => {
  it('dragon sword ench 9, damage 1000 → 400 (50% wins, then deductible)', () => {
    const p = policyOf([
      { type: 'sword', material: 'dragon', enchantment: 9 },
    ]);
    const r = p.claim({
      cause: 'dragon',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(r.payout).toBe(400);
  });

  it('dragon sword ench 5, damage 800 → 700 (dragon full, then deductible)', () => {
    const p = policyOf([
      { type: 'sword', material: 'dragon', enchantment: 5 },
    ]);
    const r = p.claim({
      cause: 'dragon',
      damages: [{ itemType: 'sword', amount: 800 }],
    });
    expect(r.payout).toBe(700);
  });

  it('steel sword ench 9, damage 1000 → 400 (high-ench 50%, then deductible)', () => {
    const p = policyOf([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    const r = p.claim({
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(r.payout).toBe(400);
  });

  it('dragon sword exactly ench 8, damage 1000 → 400 (high-ench applies, then deductible)', () => {
    const p = policyOf([
      { type: 'sword', material: 'dragon', enchantment: 8 },
    ]);
    const r = p.claim({
      cause: 'dragon',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(r.payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('dragon attack: sword 500 + amulet 300 → payout 600 (deductible per item)', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    const r = p.claim({
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(r.payout).toBe(600);
  });

  it('two swords both damaged → each has own deductible', () => {
    const p = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    const r = p.claim({
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    // (500-100) + (500-100) = 800
    expect(r.payout).toBe(800);
  });
});

describe('cap exhaustion across successive claims', () => {
  it('sword cap 2000, two 1500 claims → 1400 then 600', () => {
    const p = policyOf([{ type: 'sword' }]);
    const first = p.claim({
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = p.claim({
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('rounding payout in MHPCO favor', () => {
  it('payout that yields 350.5 → 350 (rounded down)', () => {
    expect(roundPayout(350.5)).toBe(350);
  });

  it('payout that yields 350.9 → 350 (rounded down)', () => {
    expect(roundPayout(350.9)).toBe(350);
  });
});

describe('claim validation errors', () => {
  it('damage to item not in policy → throws', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() =>
      p.claim({ cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow();
  });

  it('more damages of a type than insured → throws', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() =>
      p.claim({
        cause: 'dragon',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      }),
    ).toThrow();
  });

  it('negative damage amount → throws', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() =>
      p.claim({ cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow();
  });

  it('unknown damage item type → throws', () => {
    const p = policyOf([{ type: 'sword' }]);
    expect(() =>
      p.claim({
        cause: 'fire',
        damages: [{ itemType: 'broomstick', amount: 200 }],
      }),
    ).toThrow();
  });
});
