import { describe, it, expect } from 'vitest';
import { computePremium } from './quote.js';

describe('computePremium - base premiums', () => {
  const customer = { yearsWithMHPCO: 0 };
  const opts = { isFirstContract: true };

  it('empty item list → 5 G (processing fee only)', () => {
    expect(computePremium([], customer, opts)).toBe(5);
  });

  it('sword base premium 100 G + 10 G first insurance + 5 G fee = 115 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(115);
  });

  it('amulet base premium 60 G + 6 G first insurance + 5 G fee = 71 G', () => {
    const items = [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(71);
  });

  it('staff base premium 80 G + 8 G first insurance + 5 G fee = 93 G', () => {
    const items = [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(93);
  });

  it('potion base premium 40 G + 4 G first insurance + 5 G fee = 49 G', () => {
    const items = [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(49);
  });

  it('unknown item type → throws error', () => {
    const items = [{ type: 'broomstick', material: 'wood', enchantment: 0, cursed: false }];
    expect(() => computePremium(items, customer, opts)).toThrow();
  });
});

describe('computePremium - component base premiums (runes, moonstones)', () => {
  const customer = { yearsWithMHPCO: 0 };
  const opts = { isFirstContract: true };

  it('1 rune → 25 G + 10% first insurance (2.5 → ceil = 3) + 5 fee = 33 G', () => {
    // base = 25, firstInsurance = ceil(25*0.1) = 3, total = 25+3+5 = 33
    const items = [{ type: 'rune' }];
    expect(computePremium(items, customer, opts)).toBe(33);
  });

  it('2 runes → 50 G base', () => {
    // base = 50, firstInsurance = ceil(50*0.1) = 5, total = 50+5+5 = 60
    const items = [{ type: 'rune' }, { type: 'rune' }];
    expect(computePremium(items, customer, opts)).toBe(60);
  });

  it('3 runes → 60 G base (block applies)', () => {
    // base = 60, firstInsurance = ceil(60*0.1) = 6, total = 60+6+5 = 71
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
    expect(computePremium(items, customer, opts)).toBe(71);
  });

  it('4 runes → 100 G base (no block - block requires exactly 3)', () => {
    // base = 4*25 = 100, firstInsurance = ceil(100*0.1) = 10, total = 100+10+5 = 115
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
    expect(computePremium(items, customer, opts)).toBe(115);
  });

  it('7 runes → 175 G base', () => {
    // 7 runes: 2 groups of 3? No: 7 = 2*3 + 1. block of 3 applies once → 60 + 60 + 25*1 = 145?
    // Wait: "block of 3 alike components offered at 60 G" - 4 runes = no block, 7 runes:
    // 7 = floor(7/3) groups... but 4 runes has no block.
    // Looking at examples: 7 runes → 175 G = 7*25 G, no blocks apply.
    // Block applies ONLY when you have EXACTLY 3 components (the set of 3 = 60G vs 3*25=75G)
    // Wait re-read: "2 runes → 50 G, 3 runes → 60 G (block), 4 runes → 100 G (no block — exactly 3)"
    // So block only applies when count is exactly 3? That gives 7*25=175
    // BUT: "3 runes + 3 moonstones → 120 G base (two separate blocks)"
    // So each type independently can have the block if count=3 exactly.
    // 7 runes = 7 * 25 = 175 G (no block since not exactly 3)
    const items = Array(7).fill({ type: 'rune' });
    expect(computePremium(items, customer, opts)).toBe(
      // base=175, firstInsurance=ceil(175*0.1)=18 (175*0.1=17.5 → ceil=18), total=175+18+5=198
      198
    );
  });

  it('2 runes + 1 moonstone → 75 G base (no block: different types)', () => {
    // base = 75, firstInsurance = ceil(75*0.1) = 8 (7.5 → 8), total = 75+8+5 = 88
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];
    expect(computePremium(items, customer, opts)).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 G base (two separate blocks)', () => {
    // base = 120, firstInsurance = ceil(120*0.1) = 12, total = 120+12+5 = 137
    const items = [
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }
    ];
    expect(computePremium(items, customer, opts)).toBe(137);
  });
});

describe('computePremium - item-specific modifiers', () => {
  const customer = { yearsWithMHPCO: 0 };
  const opts = { isFirstContract: true };

  it('cursed sword → 50% surcharge on item base premium (100 + 50 = 150 before modifiers)', () => {
    // policy base (raw) = 100, cursed surcharge = 50, firstInsurance = 10% of 100 = 10, total = 100+50+10+5 = 165
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(computePremium(items, customer, opts)).toBe(165);
  });

  it('high-enchantment sword (enchantment=5) → 30% surcharge (100 + 30 before modifiers)', () => {
    // policy base (raw) = 100, enchant surcharge = 30, firstInsurance = 10% of 100 = 10, total = 100+30+10+5 = 145
    const items = [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(145);
  });

  it('sword with enchantment 4 → no high-enchantment surcharge', () => {
    // policy base = 100, firstInsurance = 10, total = 115
    const items = [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(115);
  });

  it('cursed sword with enchantment 5 → both surcharges (100 + 50 + 30 before modifiers)', () => {
    // policy base = 100, cursed=50, enchant=30, firstInsurance=10, total = 100+50+30+10+5 = 195
    const items = [{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }];
    expect(computePremium(items, customer, opts)).toBe(195);
  });
});

describe('computePremium - policy-wide modifiers', () => {
  it('loyalty discount (≥2 years) → 20% off policy base premium', () => {
    const customer = { yearsWithMHPCO: 2 };
    const opts = { isFirstContract: false };
    // sword base = 100, firstInsurance = +10 (always applies), loyalty = -20, follow-up = -15, total = 100+10-20-15+5 = 80
    const items = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(80);
  });

  it('customer with exactly 2 years → loyalty discount applies', () => {
    const customer = { yearsWithMHPCO: 2 };
    const opts = { isFirstContract: false };
    // sword base = 100, firstInsurance = +10, loyalty = -20, follow-up = -15, total = 80
    const items = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(80);
  });

  it('first insurance surcharge: 10% on policy base premium', () => {
    const customer = { yearsWithMHPCO: 0 };
    const opts = { isFirstContract: true };
    // sword base = 100, firstInsurance = 10, total = 115
    const items = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(115);
  });

  it('follow-up contract: 15% discount on policy base premium', () => {
    const customer = { yearsWithMHPCO: 0 };
    const opts = { isFirstContract: false };
    // sword base = 100, firstInsurance = +10 (always), follow-up = -15, total = 100+10-15+5 = 100
    const items = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    expect(computePremium(items, customer, opts)).toBe(100);
  });

  it('cursed sword + plain amulet policy: curse surcharge on item only', () => {
    // policy base (raw) = 100 (sword) + 60 (amulet) = 160
    // cursed surcharge (item-level) = 50 (50% of sword's 100)
    // firstInsurance (policy-wide) = 10% of 160 = 16
    // total = 160 + 50 + 16 + 5 = 231
    // From prompt example: "policy base premium 160 G; the cursed surcharge adds 50 G
    //   (50% of the cursed sword's base premium, not of the policy total) → 210 G before further modifiers and fee"
    // So 210 G is the pre-modifier sum. Then first insurance (10% of 160) = 16 → 210+16+5 = 231
    const customer = { yearsWithMHPCO: 0 };
    const opts = { isFirstContract: true };
    const items = [
      { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false }
    ];
    expect(computePremium(items, customer, opts)).toBe(231);
  });
});

describe('computePremium - integration examples', () => {
  it('newcomer with cursed sword → 165 G', () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    const customer = { yearsWithMHPCO: 0 };
    const opts = { isFirstContract: true };
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(computePremium(items, customer, opts)).toBe(165);
  });

  it('long-standing customer second contract cursed sword enchantment 7 → 160 G', () => {
    // 100 base + 50 curse + 30 high enchantment − 20 loyalty + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
    const customer = { yearsWithMHPCO: 3 };
    const opts = { isFirstContract: false };
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(computePremium(items, customer, opts)).toBe(160);
  });
});

describe('computePremium - rounding', () => {
  it('premium that yields 197.5 G → rounds up to 198 G', () => {
    // Need to construct a scenario yielding 197.5
    // Let's verify via a known scenario: 7 runes, no customer modifiers except first contract
    // base=175, firstInsurance=17.5 → ceil = 18, total = 175+18+5 = 198
    // So 175 + 17.5 = 192.5 before fee → 192.5 + 5 = 197.5 → round up to 198
    // Actually: rounding happens on FINAL premium
    // Let me check: if intermediate=192.5 and fee=5 → 197.5 → ceil = 198
    const customer = { yearsWithMHPCO: 0 };
    const opts = { isFirstContract: true };
    const items = Array(7).fill({ type: 'rune' });
    expect(computePremium(items, customer, opts)).toBe(198);
  });
});
