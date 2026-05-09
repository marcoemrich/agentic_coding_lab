import { describe, expect, it } from 'vitest';
import { computePremium, totalInsuranceSum } from './pricing.js';

describe('computePremium', () => {
  it('prices a single sword for a new customer', () => {
    // 100 base * 1.10 (first insurance) + 5 = 115
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        { yearsWithMHPCO: 0, priorContracts: 0 }
      )
    ).toBe(115);
  });

  it('applies cursed surcharge of 50%', () => {
    // 100 * 1.5 = 150, * 1.10 = 165, +5 = 170
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }],
        { yearsWithMHPCO: 0, priorContracts: 0 }
      )
    ).toBe(170);
  });

  it('applies enchantment surcharge of 30% at level >= 5', () => {
    // 100 * 1.30 = 130, *1.10 = 143, +5 = 148
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        { yearsWithMHPCO: 0, priorContracts: 0 }
      )
    ).toBe(148);
  });

  it('stacks cursed and high enchantment additively', () => {
    // 100 * (1 + 0.5 + 0.3) = 180, *1.10 = 198, +5 = 203
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 0, priorContracts: 0 }
      )
    ).toBe(203);
  });

  it('applies loyalty discount for >= 2 years', () => {
    // 100 * 0.8 = 80, *1.10 = 88, +5 = 93
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 5, priorContracts: 0 }
      )
    ).toBe(93);
  });

  it('applies subsequent-contract discount of 15%', () => {
    // 100 * 0.85 = 85, +5 = 90
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 0, priorContracts: 1 }
      )
    ).toBe(90);
  });

  it('groups 3 alike components into a bundle base premium of 60', () => {
    // 3 runes bundle: 60, *1.10 = 66, +5 = 71
    expect(
      computePremium(
        [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        { yearsWithMHPCO: 0, priorContracts: 0 }
      )
    ).toBe(71);
  });

  it('charges 25 G base premium for an unbundled component', () => {
    // 1 rune: 25, *1.10 = 27.5, +5 = 32.5 -> 33
    expect(
      computePremium([{ type: 'rune' }], { yearsWithMHPCO: 0, priorContracts: 0 })
    ).toBe(33);
  });

  it('mixes a bundle of 3 runes with a leftover rune', () => {
    // bundle 60 + leftover 25 = 85, *1.10 = 93.5, +5 = 98.5 -> 99
    expect(
      computePremium(
        [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        { yearsWithMHPCO: 0, priorContracts: 0 }
      )
    ).toBe(99);
  });

  it('rounds up in the MHPCO favor', () => {
    // amulet 60, *0.8 = 48, *0.85 = 40.8, +5 = 45.8 -> 46
    expect(
      computePremium(
        [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 5, priorContracts: 1 }
      )
    ).toBe(46);
  });

  it('prices a staff and a potion correctly', () => {
    // staff 80 + potion 40 = 120, *1.10 = 132, +5 = 137
    expect(
      computePremium(
        [
          { type: 'staff', material: 'oak', enchantment: 0, cursed: false },
          { type: 'potion', material: 'glass', enchantment: 0, cursed: false },
        ],
        { yearsWithMHPCO: 0, priorContracts: 0 }
      )
    ).toBe(137);
  });
});

describe('totalInsuranceSum', () => {
  it('sums insurance values per item', () => {
    expect(
      totalInsuranceSum([
        { type: 'sword' },
        { type: 'amulet' },
        { type: 'rune' },
      ])
    ).toBe(1000 + 600 + 250);
  });
});
