import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';

describe('quotePremium - base prices', () => {
  it('quotes a sword for a brand new customer (first contract)', () => {
    // base 100, +10% first insurance = 110, +5 processing = 115
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]
    );
    expect(premium).toBe(115);
  });

  it('quotes an amulet for a brand new customer', () => {
    // base 60, +10% first = 66, +5 = 71
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]
    );
    expect(premium).toBe(71);
  });

  it('quotes a staff for a brand new customer', () => {
    // base 80, +10% first = 88, +5 = 93
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'staff', material: 'oak', enchantment: 2, cursed: false }]
    );
    expect(premium).toBe(93);
  });

  it('quotes a potion for a brand new customer', () => {
    // base 40, +10% first = 44, +5 = 49
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }]
    );
    expect(premium).toBe(49);
  });

  it('quotes a single rune component', () => {
    // base 25, +10% first = 27.5, ceil = 28, +5 = 33
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }]
    );
    expect(premium).toBe(33);
  });

  it('quotes 3 alike components as a building block (60 G base)', () => {
    // base 60 (for 3 alike), +10% first = 66, +5 = 71
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ]
    );
    expect(premium).toBe(71);
  });

  it('quotes 4 alike components as building block + 1 single', () => {
    // 3 runes block: 60, plus 1 rune: 25 = 85, +10% first = 93.5 -> 94, +5 = 99
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
        { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      ]
    );
    expect(premium).toBe(99);
  });
});

describe('quotePremium - modifiers', () => {
  it('applies cursed surcharge of 50%', () => {
    // sword cursed: 100 * 1.5 = 150, +10% first = 165, +5 = 170
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]
    );
    expect(premium).toBe(170);
  });

  it('applies high enchantment surcharge of 30%', () => {
    // sword enchantment 5: 100 * 1.3 = 130, +10% first = 143, +5 = 148
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }]
    );
    expect(premium).toBe(148);
  });

  it('applies cursed and high enchantment together', () => {
    // sword cursed and ench 7: 100 * 1.5 * 1.3 = 195, +10% first = 214.5 -> 215, +5 = 220
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }]
    );
    expect(premium).toBe(220);
  });

  it('applies loyalty discount for long-standing customers', () => {
    // sword for 5-year customer, first contract: 100 * 0.8 = 80, +10% first = 88, +5 = 93
    const premium = quotePremium(
      { yearsWithMHPCO: 5, contractCount: 0 },
      [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]
    );
    expect(premium).toBe(93);
  });

  it('does not apply loyalty discount for less than 2 years', () => {
    // sword for 1-year customer: 100, +10% first = 110, +5 = 115
    const premium = quotePremium(
      { yearsWithMHPCO: 1, contractCount: 0 },
      [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]
    );
    expect(premium).toBe(115);
  });

  it('applies subsequent contract discount (15%) and skips first insurance surcharge', () => {
    // sword, 2nd contract: 100 * 0.85 = 85, +5 = 90
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 1 },
      [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }]
    );
    expect(premium).toBe(90);
  });

  it('applies all modifiers together', () => {
    // sword, cursed, ench 6, loyal customer (5 yr), 2nd contract
    // base 100 * 1.5 (cursed) * 1.3 (ench) * 0.8 (loyalty) * 0.85 (subsequent)
    // = 100 * 1.5 = 150 * 1.3 = 195 * 0.8 = 156 * 0.85 = 132.6, ceil = 133, +5 = 138
    const premium = quotePremium(
      { yearsWithMHPCO: 5, contractCount: 1 },
      [{ type: 'sword', material: 'steel', enchantment: 6, cursed: true }]
    );
    expect(premium).toBe(138);
  });
});

describe('quotePremium - multiple items', () => {
  it('sums premiums of multiple items', () => {
    // sword (100) + amulet (60) = 160, +10% first = 176, +5 = 181
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
      ]
    );
    expect(premium).toBe(181);
  });

  it('applies modifiers per-item', () => {
    // cursed sword (100*1.5=150) + plain amulet (60) = 210, +10% first = 231, +5 = 236
    const premium = quotePremium(
      { yearsWithMHPCO: 0, contractCount: 0 },
      [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
      ]
    );
    expect(premium).toBe(236);
  });
});
