import { describe, expect, test } from 'vitest';

import { insuranceSum } from './policy.js';

describe('insurance sum', () => {
  test('a sword is insured at 1000 G', () => {
    expect(insuranceSum([{ type: 'sword' }])).toBe(1000);
  });

  test('an amulet is insured at 600 G', () => {
    expect(insuranceSum([{ type: 'amulet' }])).toBe(600);
  });

  test('a staff is insured at 800 G', () => {
    expect(insuranceSum([{ type: 'staff' }])).toBe(800);
  });

  test('a potion is insured at 400 G', () => {
    expect(insuranceSum([{ type: 'potion' }])).toBe(400);
  });

  test('a component is insured at 250 G', () => {
    expect(insuranceSum([{ type: 'rune' }])).toBe(250);
  });

  test('two swords are insured at 2000 G', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  test('a sword and an amulet are insured at 1600 G', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  test('the block discount does not reduce the insurance sum', () => {
    expect(
      insuranceSum([
        { type: 'sword' },
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
      ]),
    ).toBe(1750);
  });

  test('premium modifiers do not raise the insurance sum', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });
});
