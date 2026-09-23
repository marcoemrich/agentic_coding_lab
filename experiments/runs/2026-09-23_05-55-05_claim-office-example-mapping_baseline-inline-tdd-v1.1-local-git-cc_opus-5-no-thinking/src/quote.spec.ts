import { describe, it, expect } from 'vitest';
import { quote } from './quote';

const newcomer = { yearsWithMHPCO: 0 };

const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });

describe('base premiums', () => {
  it('prices a plain sword', () => {
    expect(quote(newcomer, [item('sword')], 0).premium).toBe(100 + 10 + 5);
  });

  it('prices each main item type', () => {
    const base = (t: string) => quote({ yearsWithMHPCO: 0 }, [item(t)], 0).premium - 5;
    expect(base('sword')).toBe(110);
    expect(base('amulet')).toBe(66);
    expect(base('staff')).toBe(88);
    expect(base('potion')).toBe(44);
  });

  it('charges 5 G for an empty item list', () => {
    expect(quote(newcomer, [], 0).premium).toBe(5);
  });

  it('rejects unknown item types', () => {
    expect(() => quote(newcomer, [item('broomstick')], 0)).toThrow();
  });
});

describe('component building blocks', () => {
  const runes = (n: number) => Array.from({ length: n }, () => item('rune'));

  it('2 runes -> 50 G base', () => {
    expect(quote(newcomer, runes(2), 0).basePremium).toBe(50);
  });
  it('3 runes -> 60 G base (block)', () => {
    expect(quote(newcomer, runes(3), 0).basePremium).toBe(60);
  });
  it('4 runes -> 100 G base (no block)', () => {
    expect(quote(newcomer, runes(4), 0).basePremium).toBe(100);
  });
  it('7 runes -> 175 G base', () => {
    expect(quote(newcomer, runes(7), 0).basePremium).toBe(175);
  });
  it('2 runes + 1 moonstone -> 75 G base', () => {
    expect(quote(newcomer, [...runes(2), item('moonstone')], 0).basePremium).toBe(75);
  });
  it('3 runes + 3 moonstones -> 120 G base (two blocks)', () => {
    const items = [...runes(3), item('moonstone'), item('moonstone'), item('moonstone')];
    expect(quote(newcomer, items, 0).basePremium).toBe(120);
  });
});

describe('modifier scope', () => {
  it('applies curse surcharge to the cursed item only', () => {
    const items = [item('sword', { cursed: true }), item('amulet')];
    const r = quote(newcomer, items, 0);
    expect(r.basePremium).toBe(160);
    // 160 + 50 curse + 16 first insurance (10% of 160) + 5 fee
    expect(r.premium).toBe(160 + 50 + 16 + 5);
  });
});

describe('modifier thresholds', () => {
  it('applies loyalty discount at exactly 2 years', () => {
    const r = quote({ yearsWithMHPCO: 2 }, [item('sword')], 0);
    // 100 - 20 loyalty + 10 first = 90 + 5
    expect(r.premium).toBe(95);
  });
  it('applies high-enchantment surcharge at exactly 5', () => {
    const r = quote(newcomer, [item('sword', { enchantment: 5 })], 0);
    expect(r.premium).toBe(100 + 30 + 10 + 5);
  });
  it('stacks curse and high enchantment', () => {
    const r = quote(newcomer, [item('sword', { enchantment: 5, cursed: true })], 0);
    expect(r.premium).toBe(100 + 50 + 30 + 10 + 5);
  });
  it('no high-enchantment surcharge at 4', () => {
    const r = quote(newcomer, [item('sword', { enchantment: 4 })], 0);
    expect(r.premium).toBe(100 + 10 + 5);
  });
});

describe('integration examples', () => {
  it('newcomer with a cursed sword -> 165 G', () => {
    const r = quote(newcomer, [item('sword', { material: 'steel', enchantment: 3, cursed: true })], 0);
    expect(r.premium).toBe(165);
  });

  it("long-standing customer's second contract -> 160 G", () => {
    const r = quote(
      { yearsWithMHPCO: 3 },
      [item('sword', { material: 'steel', enchantment: 7, cursed: true })],
      1,
    );
    expect(r.premium).toBe(160);
  });
});

describe('rounding', () => {
  it('rounds the premium up', () => {
    const r = quote({ yearsWithMHPCO: 0 }, [item('rune', { cursed: true }), item('rune')], 0);
    // base 50, curse 12.5, first insurance 5, fee 5 => 72.5 -> 73
    expect(r.premium).toBe(73);
  });
});

describe('insurance sum', () => {
  it('sums item insurance values', () => {
    expect(quote(newcomer, [item('sword'), item('amulet')], 0).insuranceSum).toBe(1600);
  });
  it('is unaffected by the component block discount', () => {
    const items = [item('sword'), item('rune'), item('rune'), item('rune')];
    expect(quote(newcomer, items, 0).insuranceSum).toBe(1750);
  });
  it('counts two swords', () => {
    expect(quote(newcomer, [item('sword'), item('sword')], 0).insuranceSum).toBe(2000);
  });
});
