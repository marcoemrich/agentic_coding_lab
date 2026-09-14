import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

describe('quotes', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });

  it('prices a plain sword including its first-insurance surcharge', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 115 }] });
  });

  it('sums the price-list premiums for multiple item types', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'amulet' }, { type: 'staff' }, { type: 'potion' }] }],
    })).toEqual({ results: [{ premium: 203 }] });
  });

  it('applies the component block premium to exactly three alike components', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] }],
    })).toEqual({ results: [{ premium: 71 }] });
  });

  it('keeps component types separate and rounds a fractional premium up', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }] }],
    })).toEqual({ results: [{ premium: 88 }] });

    const sevenRunes = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: sevenRunes }],
    })).toEqual({ results: [{ premium: 198 }] });
  });

  it('adds a curse surcharge only to the cursed item', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] }],
    })).toEqual({ results: [{ premium: 231 }] });
  });

  it('adds the high-enchantment surcharge at level five', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 5 }] }],
    })).toEqual({ results: [{ premium: 145 }] });
  });

  it('applies the loyalty discount from exactly two years', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    })).toEqual({ results: [{ premium: 95 }] });
  });

  it('discounts contracts after the first while assessing each new item', () => {
    const item = { type: 'sword', cursed: true, enchantment: 7 };
    expect(processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: 'quote', items: [item] }, { op: 'quote', items: [item] }],
    })).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
  });

  it('rejects unknown item types', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow('Unknown item type: broomstick');
  });
});

describe('claims', () => {
  it('reimburses standard damage with a per-event deductible', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });

  it('halves reimbursement for enchantment level eight before deducting', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'curse', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  it('matches repeated damage entries to separately insured items', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 3 }, { type: 'sword', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
          { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
        ] } },
      ],
    })).toEqual({ results: [{ premium: 255 }, { payout: 550, remainingCap: 3450 }] });
  });

  it('rejects a negative damage amount', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'spill', damages: [{ itemType: 'rune', amount: -200 }] } },
      ],
    })).toThrow('Damage amount cannot be negative');
  });

  it('rounds a fractional payout down after applying the high-enchantment clause', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] } },
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });

  it('exhausts the insurance-value cap across successive claims', () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    })).toEqual({ results: [
      { premium: 165 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ] });
  });
});
