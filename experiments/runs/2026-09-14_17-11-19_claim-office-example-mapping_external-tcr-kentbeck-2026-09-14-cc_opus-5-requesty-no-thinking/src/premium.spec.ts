import { describe, expect, it } from 'vitest';
import { quotePremium } from './premium.js';

const newcomer = { yearsWithMHPCO: 0 };
const loyal = { yearsWithMHPCO: 3 };

describe('quote premium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  it('prices a newcomer with a cursed sword', () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(quotePremium([sword], newcomer, 0)).toBe(165);
  });

  it("prices a long-standing customer's second contract", () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quotePremium([sword], loyal, 1)).toBe(160);
  });

  it('applies item surcharges only to the affected item', () => {
    const cursedSword = { type: 'sword', cursed: true };
    const amulet = { type: 'amulet' };
    // 160 base + 50 curse = 210 before further modifiers and fee
    // 210 + 16 first insurance + 5 fee
    expect(quotePremium([cursedSword, amulet], newcomer, 0)).toBe(231);
  });

  it('applies the loyalty discount at exactly two years', () => {
    const sword = { type: 'sword' };
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium([sword], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('applies the high-enchantment surcharge at exactly five', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, 0)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, 0)).toBe(115);
  });

  it('keeps intermediate amounts fractional and rounds only the total up', () => {
    const sevenRunes = Array(7).fill({ type: 'rune' });
    // 175 base - 35 loyalty + 17.5 first insurance - 26.25 follow-up + 5 fee = 136.25
    expect(quotePremium(sevenRunes, loyal, 1)).toBe(137);
  });
});
