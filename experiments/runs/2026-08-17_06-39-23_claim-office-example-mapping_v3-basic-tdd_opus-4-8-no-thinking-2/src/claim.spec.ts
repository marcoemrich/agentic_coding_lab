import { describe, it, expect } from 'vitest';
import { createPolicy, processClaim, PolicyError } from './claim.js';
import type { Item, Incident } from './types.js';

function item(type: string, extra: Partial<Item> = {}): Item {
  return { type, ...extra } as Item;
}

function incident(damages: { itemType: string; amount: number }[]): Incident {
  return { cause: 'test', damages };
}

describe('insurance sum and cap', () => {
  it('single sword: sum 1000, cap 2000', () => {
    const p = createPolicy([item('sword')]);
    expect(p.insuranceSum).toBe(1000);
    expect(p.remainingCap).toBe(2000);
  });

  it('two swords: sum 2000, cap 4000', () => {
    const p = createPolicy([item('sword'), item('sword')]);
    expect(p.insuranceSum).toBe(2000);
    expect(p.remainingCap).toBe(4000);
  });

  it('sword + amulet: sum 1600, cap 3200', () => {
    const p = createPolicy([item('sword'), item('amulet')]);
    expect(p.insuranceSum).toBe(1600);
  });

  it('cursed sword: cap based on unmodified insurance value 2000', () => {
    const p = createPolicy([item('sword', { cursed: true, enchantment: 5 })]);
    expect(p.remainingCap).toBe(2000);
  });

  it('sword + 3 runes block: sum 1750 (block affects premium not sum)', () => {
    const p = createPolicy([
      item('sword'),
      item('rune'),
      item('rune'),
      item('rune'),
    ]);
    expect(p.insuranceSum).toBe(1750);
  });
});

describe('standard reimbursement', () => {
  it('regular sword damage 500 -> payout 400', () => {
    const p = createPolicy([item('sword', { material: 'steel', enchantment: 3 })]);
    const r = processClaim(p, incident([{ itemType: 'sword', amount: 500 }]));
    expect(r.payout).toBe(400);
  });

  it('rune damage 200 -> payout 100', () => {
    const p = createPolicy([item('rune')]);
    const r = processClaim(p, incident([{ itemType: 'rune', amount: 200 }]));
    expect(r.payout).toBe(100);
  });
});

describe('deductible per damage event', () => {
  it('two damaged items each get their own deductible', () => {
    const p = createPolicy([item('sword'), item('amulet')]);
    const r = processClaim(
      p,
      incident([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]),
    );
    expect(r.payout).toBe(600);
  });
});

describe('special clauses', () => {
  it('dragon material fully reimbursed, ench 5, damage 800 -> 700', () => {
    const p = createPolicy([item('sword', { material: 'dragon', enchantment: 5 })]);
    const r = processClaim(p, incident([{ itemType: 'sword', amount: 800 }]));
    expect(r.payout).toBe(700);
  });

  it('high enchantment (>=8) reimbursed at 50%, ench 8 dragon damage 1000 -> 400', () => {
    const p = createPolicy([item('sword', { material: 'dragon', enchantment: 8 })]);
    const r = processClaim(p, incident([{ itemType: 'sword', amount: 1000 }]));
    expect(r.payout).toBe(400);
  });

  it('dragon + ench 9: 50% wins, damage 1000 -> 400', () => {
    const p = createPolicy([item('sword', { material: 'dragon', enchantment: 9 })]);
    const r = processClaim(p, incident([{ itemType: 'sword', amount: 1000 }]));
    expect(r.payout).toBe(400);
  });

  it('steel ench 9: 50% clause, damage 1000 -> 400', () => {
    const p = createPolicy([item('sword', { material: 'steel', enchantment: 9 })]);
    const r = processClaim(p, incident([{ itemType: 'sword', amount: 1000 }]));
    expect(r.payout).toBe(400);
  });
});

describe('cap tracking across successive claims', () => {
  it('two 1500 claims exhaust the cap', () => {
    const p = createPolicy([item('sword')]);
    const r1 = processClaim(p, incident([{ itemType: 'sword', amount: 1500 }]));
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim(p, incident([{ itemType: 'sword', amount: 1500 }]));
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });
});

describe('payout rounding (down)', () => {
  it('payout of 350.5 rounds down to 350', () => {
    // ench 9 (50%) sword, damage 901 -> 450.5 reimbursed - 100 = 350.5 -> 350
    const p = createPolicy([item('sword', { material: 'steel', enchantment: 9 })]);
    const r = processClaim(p, incident([{ itemType: 'sword', amount: 901 }]));
    expect(r.payout).toBe(350);
  });
});

describe('claim validation errors', () => {
  it('damage to item not in policy throws', () => {
    const p = createPolicy([item('sword')]);
    expect(() =>
      processClaim(p, incident([{ itemType: 'amulet', amount: 200 }])),
    ).toThrow(PolicyError);
  });

  it('unknown damage item type throws', () => {
    const p = createPolicy([item('sword')]);
    expect(() =>
      processClaim(p, incident([{ itemType: 'broomstick', amount: 200 }])),
    ).toThrow(PolicyError);
  });

  it('more damages of a type than covered throws', () => {
    const p = createPolicy([item('sword')]);
    expect(() =>
      processClaim(
        p,
        incident([
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ]),
      ),
    ).toThrow(PolicyError);
  });

  it('negative damage amount throws', () => {
    const p = createPolicy([item('sword')]);
    expect(() =>
      processClaim(p, incident([{ itemType: 'sword', amount: -200 }])),
    ).toThrow(PolicyError);
  });

  it('unknown item type at policy creation throws', () => {
    expect(() => createPolicy([item('broomstick')])).toThrow(PolicyError);
  });
});
