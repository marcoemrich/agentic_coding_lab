import { describe, it, expect } from 'vitest';
import { Policy, insuranceSum, InvalidClaimError } from './claim';
import { type Item } from './premium';

describe('insurance sum and cap', () => {
  it('two swords → sum 2000, cap 4000', () => {
    const p = new Policy([{ type: 'sword' }, { type: 'sword' }]);
    expect(insuranceSum(p.items)).toBe(2000);
    expect(p.cap).toBe(4000);
  });

  it('sword + amulet → sum 1600, cap 3200', () => {
    const p = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(p.cap).toBe(3200);
  });

  it('cursed sword → cap based on unmodified insurance value 1000 → cap 2000', () => {
    const p = new Policy([{ type: 'sword', cursed: true }]);
    expect(p.cap).toBe(2000);
  });

  it('sword + 3 runes → insurance sum 1750 (block discount does not affect sum)', () => {
    const p = new Policy([
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ]);
    expect(insuranceSum(p.items)).toBe(1750);
    expect(p.cap).toBe(3500);
  });
});

function claim(items: Item[], damages: { itemType: string; amount: number }[]) {
  const p = new Policy(items);
  return p.processClaim({ cause: 'test', damages });
}

describe('standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, ench 3), damage 500 → payout 400', () => {
    const r = claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [
      { itemType: 'sword', amount: 500 },
    ]);
    expect(r.payout).toBe(400);
  });

  it('rune (value 250), damage 200 → payout 100', () => {
    const r = claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]);
    expect(r.payout).toBe(100);
  });
});

describe('enchantment threshold vs dragon material', () => {
  it('dragon sword, ench 8, damage 1000 → payout 400 (50% then deductible)', () => {
    const r = claim(
      [{ type: 'sword', material: 'dragon', enchantment: 8 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(r.payout).toBe(400);
  });

  it('dragon sword, ench 9, damage 1000 → payout 400 (50% wins)', () => {
    const r = claim(
      [{ type: 'sword', material: 'dragon', enchantment: 9 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(r.payout).toBe(400);
  });

  it('dragon sword, ench 5, damage 800 → payout 700 (full then deductible)', () => {
    const r = claim(
      [{ type: 'sword', material: 'dragon', enchantment: 5 }],
      [{ itemType: 'sword', amount: 800 }],
    );
    expect(r.payout).toBe(700);
  });

  it('steel sword, ench 9, damage 1000 → payout 400 (50% then deductible)', () => {
    const r = claim(
      [{ type: 'sword', material: 'steel', enchantment: 9 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(r.payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('sword (500) + amulet (300) → payout 600 (deductible per item)', () => {
    const r = claim(
      [{ type: 'sword' }, { type: 'amulet' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    );
    expect(r.payout).toBe(600);
  });
});

describe('multiple items of the same type', () => {
  it('two swords, both damaged → separate deductibles', () => {
    const r = claim(
      [{ type: 'sword' }, { type: 'sword' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    );
    // (500-100) + (500-100) = 800
    expect(r.payout).toBe(800);
  });

  it('more damages of a type than covered → InvalidClaimError', () => {
    expect(() =>
      claim(
        [{ type: 'sword' }],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ],
      ),
    ).toThrow(InvalidClaimError);
  });
});

describe('cap exhaustion across successive claims', () => {
  it('sword cap 2000; two 1500 claims → 1400 then 600', () => {
    const p = new Policy([{ type: 'sword' }]);
    const first = p.processClaim({
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    // 1500 - 100 = 1400
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const second = p.processClaim({
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    // desired 1400 reduced to remaining cap 600
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('claim validation errors', () => {
  it('damaged item not in policy → InvalidClaimError', () => {
    expect(() =>
      claim([{ type: 'sword' }], [{ itemType: 'amulet', amount: 200 }]),
    ).toThrow(InvalidClaimError);
  });

  it('unknown damaged item type → InvalidClaimError', () => {
    expect(() =>
      claim([{ type: 'sword' }], [{ itemType: 'broomstick', amount: 200 }]),
    ).toThrow(InvalidClaimError);
  });

  it('negative damage amount → InvalidClaimError', () => {
    expect(() =>
      claim([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }]),
    ).toThrow(InvalidClaimError);
  });
});

describe('rounding payout down (MHPCO favor)', () => {
  it('payout 350.5 → 350', () => {
    // dragon-clause not applicable; use 50% clause to get a .5:
    // steel sword ench 8, damage 901 → 901*0.5 = 450.5 - 100 = 350.5 -> 350
    const r = claim(
      [{ type: 'sword', material: 'steel', enchantment: 8 }],
      [{ itemType: 'sword', amount: 901 }],
    );
    expect(r.payout).toBe(350);
  });
});
