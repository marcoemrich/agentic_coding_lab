import { describe, it, expect } from 'vitest';
import { quotePremium, policyBasePremium, itemSurcharges, roundPremium } from './premium.js';

const NEW_CUSTOMER = { yearsWithMHPCO: 0 };
const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });
const repeat = (type: string, n: number) => Array.from({ length: n }, () => item(type));

describe('premium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium(NEW_CUSTOMER, [], 0)).toBe(5);
  });

  describe('base premiums from the price list', () => {
    it.each([
      ['sword', 100],
      ['amulet', 60],
      ['staff', 80],
      ['potion', 40],
    ])('charges %s at %i G', (type, expected) => {
      expect(policyBasePremium([item(type)])).toBe(expected);
    });

    it('sums the base premiums of several main items', () => {
      expect(policyBasePremium([item('sword'), item('amulet')])).toBe(160);
    });
  });

  describe('building block of 3 alike components', () => {
    it.each([
      [2, 50],
      [3, 60],
      [4, 100],
      [7, 175],
    ])('charges %i runes at %i G', (count, expected) => {
      expect(policyBasePremium(repeat('rune', count))).toBe(expected);
    });

    it('does not form a block from different component types', () => {
      expect(policyBasePremium([...repeat('rune', 2), item('moonstone')])).toBe(75);
    });

    it('forms two separate blocks for two component types', () => {
      expect(policyBasePremium([...repeat('rune', 3), ...repeat('moonstone', 3)])).toBe(120);
    });
  });
});

describe('premium modifiers', () => {
  const LOYAL = { yearsWithMHPCO: 3 };

  it('adds a 50% curse surcharge to the cursed item only', () => {
    // cursed sword (100) + plain amulet (60) = 160 base; curse adds 50
    expect(quotePremium(NEW_CUSTOMER, [
      item('sword', { cursed: true }),
      item('amulet'),
    ], 0)).toBe(
      // 160 + 50 curse + 16 first insurance (10% of 160) + 5 fee
      231,
    );
  });

  it('adds a 30% surcharge at exactly enchantment 5', () => {
    // 100 + 30 + 10 first insurance + 5 fee
    expect(quotePremium(NEW_CUSTOMER, [item('sword', { enchantment: 5 })], 0)).toBe(145);
  });

  it('adds no enchantment surcharge below level 5', () => {
    expect(quotePremium(NEW_CUSTOMER, [item('sword', { enchantment: 4 })], 0)).toBe(115);
  });

  it('stacks curse and high enchantment on the same item', () => {
    // 100 + 50 + 30 + 10 first insurance + 5 fee
    expect(quotePremium(NEW_CUSTOMER, [
      item('sword', { enchantment: 5, cursed: true }),
    ], 0)).toBe(195);
  });

  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium({ yearsWithMHPCO: 2 }, [item('sword')], 0)).toBe(95);
  });

  it('grants no loyalty discount below 2 years', () => {
    expect(quotePremium({ yearsWithMHPCO: 1 }, [item('sword')], 0)).toBe(115);
  });

  it('applies a 15% follow-up discount on contracts after the first', () => {
    // 100 - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee
    expect(quotePremium(LOYAL, [item('sword')], 1)).toBe(80);
  });

  it('rounds the final premium up, in the MHPCO favour', () => {
    // potion 40 + 4 first insurance = 44; -15% follow-up = 37.4 -> 42.4 with fee -> 43
    expect(quotePremium(NEW_CUSTOMER, [item('potion')], 1)).toBe(43);
  });
});

describe('integration examples', () => {
  it('prices a newcomer with a cursed sword at 165 G', () => {
    expect(quotePremium({ yearsWithMHPCO: 0 }, [
      item('sword', { material: 'steel', enchantment: 3, cursed: true }),
    ], 0)).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    expect(quotePremium({ yearsWithMHPCO: 3 }, [
      item('sword', { material: 'steel', enchantment: 7, cursed: true }),
    ], 1)).toBe(160);
  });
});

describe('spec examples not yet covered', () => {
  it('applies the curse surcharge to the cursed item, not the policy total', () => {
    // 100 + 60 = 160 base; curse adds 50 (50% of the sword only) -> 210
    const items = [item('sword', { cursed: true }), item('amulet')];
    expect(policyBasePremium(items)).toBe(160);
    expect(policyBasePremium(items) + itemSurcharges(items)).toBe(210);
  });

  it('rounds a premium of 197.5 G up to 198 G', () => {
    expect(roundPremium(197.5)).toBe(198);
  });
});
