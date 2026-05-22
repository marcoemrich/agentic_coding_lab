import { describe, it, expect } from 'vitest';
import { computeClaim } from './claim.js';

describe('computeClaim', () => {
  it('regular sword damage 500 -> 400', () => {
    expect(computeClaim({
      policyItems: [{ type: 'sword', material: 'steel', enchantment: 3 }],
      damages: [{ itemType: 'sword', amount: 500 }],
    })).toBe(400);
  });

  it('rune damage 200 -> 100', () => {
    expect(computeClaim({
      policyItems: [{ type: 'rune' }],
      damages: [{ itemType: 'rune', amount: 200 }],
    })).toBe(100);
  });

  it('dragon sword enchant 9 damage 1000 -> 400 (50% rule wins)', () => {
    expect(computeClaim({
      policyItems: [{ type: 'sword', material: 'dragon', enchantment: 9 }],
      damages: [{ itemType: 'sword', amount: 1000 }],
    })).toBe(400);
  });

  it('dragon sword enchant 5 damage 800 -> 700 (dragon only)', () => {
    expect(computeClaim({
      policyItems: [{ type: 'sword', material: 'dragon', enchantment: 5 }],
      damages: [{ itemType: 'sword', amount: 800 }],
    })).toBe(700);
  });

  it('steel sword enchant 9 damage 1000 -> 400 (50% only)', () => {
    expect(computeClaim({
      policyItems: [{ type: 'sword', material: 'steel', enchantment: 9 }],
      damages: [{ itemType: 'sword', amount: 1000 }],
    })).toBe(400);
  });

  it('dragon sword enchant 8 damage 1000 -> 400 (high enchant)', () => {
    expect(computeClaim({
      policyItems: [{ type: 'sword', material: 'dragon', enchantment: 8 }],
      damages: [{ itemType: 'sword', amount: 1000 }],
    })).toBe(400);
  });

  it('dragon attack on sword(500) + amulet(300) -> 600 (deductible per item)', () => {
    expect(computeClaim({
      policyItems: [
        { type: 'sword', material: 'steel', enchantment: 3 },
        { type: 'amulet', material: 'silver', enchantment: 2 },
      ],
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    })).toBe(600);
  });

  it('rounds payout down (350.5 -> 350)', () => {
    // 50% of 901 = 450.5 - 100 = 350.5
    expect(computeClaim({
      policyItems: [{ type: 'sword', enchantment: 9 }],
      damages: [{ itemType: 'sword', amount: 901 }],
    })).toBe(350);
  });

  it('rejects more damages of a type than policy covers', () => {
    expect(() => computeClaim({
      policyItems: [{ type: 'sword' }],
      damages: [
        { itemType: 'sword', amount: 100 },
        { itemType: 'sword', amount: 100 },
      ],
    })).toThrow();
  });

  it('rejects damage to item not in policy', () => {
    expect(() => computeClaim({
      policyItems: [{ type: 'sword' }],
      damages: [{ itemType: 'amulet', amount: 100 }],
    })).toThrow();
  });

  it('rejects negative damage amount', () => {
    expect(() => computeClaim({
      policyItems: [{ type: 'sword' }],
      damages: [{ itemType: 'sword', amount: -200 }],
    })).toThrow();
  });

  it('two swords, both damaged -> separate deductibles', () => {
    expect(computeClaim({
      policyItems: [{ type: 'sword' }, { type: 'sword' }],
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ],
    })).toBe(600);
  });
});
