import { describe, it, expect } from 'vitest';
import { processScenario, type Scenario } from './engine.js';

function run(scenario: Scenario) {
  return processScenario(scenario).results;
}

describe('errors', () => {
  it('throws on quote with unknown item type (e.g. broomstick)', () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' } as never] }],
      }),
    ).toThrow();
  });

  it('throws when a claim references a damage item not in the policy', () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('throws on negative damage amount', () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('throws when damages contain more entries of a type than insured', () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [
                { itemType: 'sword', amount: 100 },
                { itemType: 'sword', amount: 100 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});

describe('quote — base premiums and modifiers', () => {
  it('empty item list → 5 G processing fee only', () => {
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] })).toEqual([
      { premium: 5 },
    ]);
  });

  it('newcomer with a plain sword → 100 base + 10 first-ins + 5 fee = 115 G', () => {
    expect(
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }] },
        ],
      }),
    ).toEqual([{ premium: 115 }]);
  });

  it('newcomer with a cursed sword (steel, enchantment 3) → 165 G', () => {
    expect(
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        ],
      }),
    ).toEqual([{ premium: 165 }]);
  });

  describe('components: building block of 3 alike (newcomer, first contract)', () => {
    // base prem only, then +10% first-ins, +5 fee.
    // Block applies only when count of alike components is EXACTLY 3.
    // 2 runes: 50 base, +5 first, +5 fee = 60
    // 3 runes (block): 60 base, +6, +5 = 71
    // 4 runes: 100 base (no block), +10, +5 = 115
    // 7 runes: 175 base (no block), +17.5, +5 = 197.5 → rounded up = 198
    it.each([
      [2, 60],
      [3, 71],
      [4, 115],
      [7, 198],
    ])('%i runes → premium %i G', (n, expected) => {
      const items = Array.from({ length: n }, () => ({ type: 'rune' }));
      expect(
        run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }] }),
      ).toEqual([{ premium: expected }]);
    });
  });

  describe('components: "alike" means same type, not same family', () => {
    it('2 runes + 1 moonstone → 88 G (75 base + 7.5 first + 5 fee, rounded up)', () => {
      const items = [
        { type: 'rune' },
        { type: 'rune' },
        { type: 'moonstone' },
      ];
      expect(
        run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }] }),
      ).toEqual([{ premium: 88 }]);
    });

    it('3 runes + 3 moonstones → 137 G (120 base + 12 first + 5 fee)', () => {
      const items = [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
      ];
      expect(
        run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }] }),
      ).toEqual([{ premium: 137 }]);
    });
  });

  it('multi-item: cursed sword + plain amulet, newcomer → 231 G (210 + 16 first-ins + 5 fee)', () => {
    expect(
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [
              { type: 'sword', material: 'steel', enchantment: 1, cursed: true },
              { type: 'amulet', material: 'silver', enchantment: 1, cursed: false },
            ],
          },
        ],
      }),
    ).toEqual([{ premium: 231 }]);
  });

  describe('modifier thresholds (boundary values)', () => {
    it('exactly 2 years → loyalty applies; sword enchantment 5 → high-enchant applies', () => {
      // 100 base + 30 high-enchant + 10 first-ins - 20 loyalty + 5 fee = 125
      expect(
        run({
          customer: { yearsWithMHPCO: 2 },
          steps: [
            { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }] },
          ],
        }),
      ).toEqual([{ premium: 125 }]);
    });

    it('enchantment 4 → no high-enchant surcharge', () => {
      // 100 base + 10 first-ins + 5 fee = 115
      expect(
        run({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }] },
          ],
        }),
      ).toEqual([{ premium: 115 }]);
    });
  });

  describe('claim — standard reimbursement', () => {
    it('dragon-material sword ench 5, damage 800 → payout 700 (full minus deductible)', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 800 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });

    it('dragon-material sword ench 9, damage 1000 → payout 400 (50% rule wins, then deductible)', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it('deductible per damage event: sword 500 + amulet 300 → payout 600', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [
              { type: 'sword', material: 'steel', enchantment: 1, cursed: false },
              { type: 'amulet', material: 'silver', enchantment: 1, cursed: false },
            ],
          },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon attack',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'amulet', amount: 300 },
              ],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });

    it('cap exhaustion: two successive 1500 claims on sword → 1400 then 600', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
          },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });

    it('two swords on policy, dragon damages both at 500 each → payout 800, remaining cap 3200', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [
              { type: 'sword', material: 'steel', enchantment: 1, cursed: false },
              { type: 'sword', material: 'steel', enchantment: 1, cursed: false },
            ],
          },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon attack',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'sword', amount: 500 },
              ],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });

    it('cap uses unmodified insurance value: sword + 3 runes → cap = 2 × 1750 = 3500', () => {
      // Damage 4000 G claimed on the sword; with steel and ench 1, full reimbursement minus 100.
      // Payout would be 3900, but cap is 3500.
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'quote',
            items: [
              { type: 'sword', material: 'steel', enchantment: 1, cursed: false },
              { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
            ],
          },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 4000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });

    it('payout rounds DOWN (MHPCO favor): 901 damage on ench-9 sword → 901*0.5-100 = 350.5 → 350', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });

    it('high-enchantment ≥8: steel sword ench 9, damage 1000 → payout 400 (50% then deductible)', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it('damage 200 G on a rune → payout 100 G, remaining cap 400 G', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'rune' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });

    it('damage 500 G on plain sword → payout 400 G, remaining cap 1600 G', () => {
      const results = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  it('long-standing customer (3y), second contract, cursed enchantment-7 sword → 160 G', () => {
    const results = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 1, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
});
