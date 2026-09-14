import { describe, it, expect } from 'vitest';
import { quote } from './quote';

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toBe(5);
  });

  it('charges base premium plus first insurance surcharge for a plain sword', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('knows the amulet base premium', () => {
    expect(quote([{ type: 'amulet' }])).toBe(71);
  });

  it('knows the staff and potion base premiums', () => {
    expect(quote([{ type: 'staff' }])).toBe(93);
    expect(quote([{ type: 'potion' }])).toBe(49);
  });

  it('adds a 50% curse surcharge on the cursed item base premium', () => {
    expect(quote([{ type: 'sword', cursed: true }])).toBe(165);
  });

  it('adds a 30% surcharge from enchantment level 5 upwards', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('grants a 20% loyalty discount from 2 years with MHPCO', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 2 })).toBe(95);
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 1 })).toBe(115);
  });

  it('grants a 15% discount on each contract after the first', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 0 }, 1)).toBe(100);
  });

  it('charges 25 G base premium per component', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('prices a block of exactly 3 alike components at 60 G', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(71);
  });

  it('rounds the final premium up, in the MHPCO favour', () => {
    expect(quote([{ type: 'rune' }])).toBe(33);
  });

  it('rejects an unknown item type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });

  it('applies a curse surcharge only to the cursed item on a multi-item policy', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(quote(items)).toBe(231);
  });

  it('applies both surcharges to an item that is cursed and highly enchanted', () => {
    expect(quote([{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(195);
  });

  it('prices the block only per type and only at exactly 3', () => {
    const fourRunes = Array.from({ length: 4 }, () => ({ type: 'rune' }));
    expect(quote(fourRunes)).toBe(115);
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    expect(quote(sevenRunes)).toBe(198);
    const twoBlocks = [
      ...Array.from({ length: 3 }, () => ({ type: 'rune' })),
      ...Array.from({ length: 3 }, () => ({ type: 'moonstone' })),
    ];
    expect(quote(twoBlocks)).toBe(137);
    const mixed = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];
    expect(quote(mixed)).toBe(88);
  });

  it("prices a long-standing customer's second contract", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quote(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });
});
