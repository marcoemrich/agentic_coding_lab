import { describe, expect, it } from 'vitest';
import { policyBasePremium, itemSurcharges } from './premium.js';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('policy base premium', () => {
  it('sums main item base premiums', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });

  it('charges components individually below a block', () => {
    expect(policyBasePremium(runes(2))).toBe(50);
  });

  it('applies the block premium for exactly 3 alike components', () => {
    expect(policyBasePremium(runes(3))).toBe(60);
  });

  it('does not apply the block for 4 components', () => {
    expect(policyBasePremium(runes(4))).toBe(100);
  });

  it('does not apply the block for 7 components', () => {
    expect(policyBasePremium(runes(7))).toBe(175);
  });

  it('treats different component types separately', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms one block per component type', () => {
    expect(
      policyBasePremium([...runes(3), { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }]),
    ).toBe(120);
  });

  it('is zero for an empty item list', () => {
    expect(policyBasePremium([])).toBe(0);
  });

  it('rejects unknown item types', () => {
    expect(() => policyBasePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

describe('item surcharges', () => {
  it('is zero for a plain item', () => {
    expect(itemSurcharges({ type: 'sword', enchantment: 3 })).toBe(0);
  });

  it('adds 50 % for a cursed item', () => {
    expect(itemSurcharges({ type: 'sword', cursed: true, enchantment: 3 })).toBe(50);
  });

  it('adds 30 % from enchantment 5', () => {
    expect(itemSurcharges({ type: 'sword', enchantment: 5 })).toBe(30);
  });

  it('adds nothing at enchantment 4', () => {
    expect(itemSurcharges({ type: 'sword', enchantment: 4 })).toBe(0);
  });

  it('stacks curse and high enchantment', () => {
    expect(itemSurcharges({ type: 'sword', enchantment: 5, cursed: true })).toBe(80);
  });
});
