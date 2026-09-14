import { describe, it, expect } from 'vitest';
import { settleDamage, insuranceSum, roundPayout } from './claim.js';

const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });

describe('insurance sum', () => {
  it('sums the unmodified insurance values', () => {
    expect(insuranceSum([item('sword'), item('amulet')])).toBe(1600);
  });

  it('ignores the block discount, which affects the premium only', () => {
    expect(insuranceSum([item('sword'), item('rune'), item('rune'), item('rune')])).toBe(1750);
  });

  it('is unaffected by premium modifiers such as a curse', () => {
    expect(insuranceSum([item('sword', { cursed: true })])).toBe(1000);
  });
});

describe('single damage settlement', () => {
  it('reimburses a regular item in full, minus the deductible', () => {
    expect(settleDamage(item('sword', { material: 'steel', enchantment: 3 }), 500)).toBe(400);
  });

  it('reimburses a component in full, minus the deductible', () => {
    expect(settleDamage(item('rune'), 200)).toBe(100);
  });

  it('halves damage at exactly enchantment 8, then applies the deductible', () => {
    expect(settleDamage(item('sword', { material: 'dragon', enchantment: 8 }), 1000)).toBe(400);
  });

  it('lets the 50% rule win over dragon material', () => {
    expect(settleDamage(item('sword', { material: 'dragon', enchantment: 9 }), 1000)).toBe(400);
  });

  it('reimburses dragon material in full below the enchantment threshold', () => {
    expect(settleDamage(item('sword', { material: 'dragon', enchantment: 5 }), 800)).toBe(700);
  });

  it('halves damage for a highly enchanted non-dragon item', () => {
    expect(settleDamage(item('sword', { material: 'steel', enchantment: 9 }), 1000)).toBe(400);
  });

  it('never pays out below zero', () => {
    expect(settleDamage(item('rune'), 50)).toBe(0);
  });
});

describe('payout rounding', () => {
  it('rounds a payout of 350.5 G down to 350 G', () => {
    expect(roundPayout(350.5)).toBe(350);
  });
});
