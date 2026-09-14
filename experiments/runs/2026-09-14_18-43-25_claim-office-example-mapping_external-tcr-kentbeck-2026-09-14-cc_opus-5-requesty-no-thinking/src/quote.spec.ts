import { describe, expect, it } from 'vitest';
import { quotePremium, type Item } from './premium';

const newcomer = { yearsWithMHPCO: 0 };
const loyal = { yearsWithMHPCO: 3 };

describe('quote premium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, false)).toBe(5);
  });

  it('prices a newcomer with a cursed sword', () => {
    const sword: Item = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(quotePremium([sword], newcomer, false)).toBe(165);
  });

  it("prices a long-standing customer's second contract", () => {
    const sword: Item = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quotePremium([sword], loyal, true)).toBe(160);
  });

  it('applies the curse surcharge only to the cursed item', () => {
    const items: Item[] = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    // 160 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium(items, newcomer, false)).toBe(231);
  });

  it('applies loyalty at exactly 2 years', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, false)).toBe(95);
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, false)).toBe(115);
  });

  it('applies the high-enchantment surcharge at exactly level 5', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, false)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, false)).toBe(115);
  });

  it('rounds up in the office favour', () => {
    // 3 runes block = 60 base; +6 first insurance; cursed rune adds 12.5
    const items: Item[] = [
      { type: 'rune', cursed: true },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(quotePremium(items, newcomer, false)).toBe(84);
  });
});
