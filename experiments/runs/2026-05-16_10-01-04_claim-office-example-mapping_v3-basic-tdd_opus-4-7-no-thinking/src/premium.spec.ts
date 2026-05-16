import { describe, it, expect } from 'vitest';
import { calculatePremium } from './premium.js';

describe('calculatePremium - base premiums', () => {
  it('empty item list yields only the processing fee', () => {
    expect(calculatePremium({ yearsWithMHPCO: 5, contractIndex: 1 }, [])).toBe(5);
  });

  it('plain sword for long-standing returning customer', () => {
    // base 100, loyalty -20, first ins +10, follow-up -15 = 75, + 5 = 80
    expect(calculatePremium({ yearsWithMHPCO: 3, contractIndex: 1 }, [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false }
    ])).toBe(80);
  });

  it('plain amulet base premium for first contract newcomer', () => {
    // base 60, first ins +6 = 66, +5 fee = 71
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
    ])).toBe(71);
  });
});

describe('calculatePremium - integration examples from prompt', () => {
  it('newcomer with cursed sword => 165', () => {
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: true }
    ])).toBe(165);
  });

  it('long-standing customer second contract with cursed high-enchant sword => 160', () => {
    expect(calculatePremium({ yearsWithMHPCO: 3, contractIndex: 1 }, [
      { type: 'sword', material: 'steel', enchantment: 7, cursed: true }
    ])).toBe(160);
  });
});

describe('calculatePremium - components and blocks', () => {
  it('2 runes => 50 base, +first ins 5 = 55 +5 = 60', () => {
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'rune' },
      { type: 'rune' }
    ])).toBe(60);
  });

  it('3 runes => 60 base (block) +first ins 6 = 66 +5 = 71', () => {
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' }
    ])).toBe(71);
  });

  it('4 runes => 100 base (no block) +first ins 10 = 110 +5 = 115', () => {
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }
    ])).toBe(115);
  });

  it('7 runes => 175 base (no block, exactly-3 rule) +first ins 17.5 -> 193 +5 = 198', () => {
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }
    ])).toBe(198);
  });

  it('2 runes + 1 moonstone => 75 base, +first ins 7.5 -> 83 +5 = 88', () => {
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }
    ])).toBe(88);
  });

  it('3 runes + 3 moonstones => 120 base (two blocks) +first ins 12 = 132 +5 = 137', () => {
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }
    ])).toBe(137);
  });
});

describe('calculatePremium - modifier scope', () => {
  it('cursed sword + plain amulet, newcomer first contract', () => {
    // policy base 160, curse +50 = 210, first ins 0.1*160 = 16 => 226 +5 = 231
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
    ])).toBe(231);
  });
});

describe('calculatePremium - rounding', () => {
  it('rounds up in MHPCO favor (premium)', () => {
    // 1 rune + 1 moonstone, 1yr (no loyalty), 2nd contract
    // base 50, +first ins 5, -follow-up 7.5 = 47.5, ceil 48 + 5 = 53
    expect(calculatePremium({ yearsWithMHPCO: 1, contractIndex: 1 }, [
      { type: 'rune' }, { type: 'moonstone' }
    ])).toBe(53);
  });
});

describe('calculatePremium - thresholds', () => {
  it('customer with exactly 2 years gets loyalty discount', () => {
    // sword base 100, loyalty -20 = 80, first ins +10 = 90, +5 = 95
    expect(calculatePremium({ yearsWithMHPCO: 2, contractIndex: 0 }, [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false }
    ])).toBe(95);
  });

  it('sword exactly enchant 5 gets high-enchant surcharge', () => {
    // base 100, +30 = 130, first ins +10 = 140, +5 = 145
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'sword', material: 'steel', enchantment: 5, cursed: false }
    ])).toBe(145);
  });

  it('sword enchant 4 does NOT get high-enchant surcharge', () => {
    // base 100, first ins +10 = 110, +5 = 115
    expect(calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'sword', material: 'steel', enchantment: 4, cursed: false }
    ])).toBe(115);
  });
});

describe('calculatePremium - unknown items', () => {
  it('throws on unknown item type', () => {
    expect(() => calculatePremium({ yearsWithMHPCO: 0, contractIndex: 0 }, [
      { type: 'broomstick' } as any
    ])).toThrow();
  });
});
