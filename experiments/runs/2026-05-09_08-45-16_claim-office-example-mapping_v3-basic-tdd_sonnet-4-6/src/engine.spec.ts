import { describe, it, expect } from 'vitest';
import { processScenario, AppError } from './engine.js';

// Helper: new customer (0 years), single step scenario
function newCustomerQuote(items: object[]) {
  return processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: 'quote', items }],
  });
}

describe('quote – empty items', () => {
  it('returns only the processing fee (5 G) for an empty item list', () => {
    const results = newCustomerQuote([]);
    expect(results[0]).toEqual({ premium: 5 });
  });
});

describe('quote – single main items (new customer, first contract)', () => {
  // New customer, first contract: +10% first insurance surcharge, +5 fee
  it('sword: 100 base + 10 first-insurance + 5 fee = 115 G', () => {
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
    expect(results[0]).toEqual({ premium: 115 });
  });

  it('amulet: 60 base + 6 first-insurance + 5 fee = 71 G', () => {
    const results = newCustomerQuote([{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }]);
    expect(results[0]).toEqual({ premium: 71 });
  });

  it('staff: 80 base + 8 first-insurance + 5 fee = 93 G', () => {
    const results = newCustomerQuote([{ type: 'staff', material: 'oak', enchantment: 0, cursed: false }]);
    expect(results[0]).toEqual({ premium: 93 });
  });

  it('potion: 40 base + 4 first-insurance + 5 fee = 49 G', () => {
    const results = newCustomerQuote([{ type: 'potion', enchantment: 0, cursed: false }]);
    expect(results[0]).toEqual({ premium: 49 });
  });
});

describe('quote – component base premiums (building blocks)', () => {
  // For a new customer (first contract): base * 1.1 + 5, ceil
  it('2 runes → 50 G base → ceil(50*1.1 + 5) = 60 G', () => {
    const results = newCustomerQuote([{ type: 'rune' }, { type: 'rune' }]);
    expect(results[0]).toEqual({ premium: 60 });
  });

  it('3 runes → 60 G base (block) → ceil(60*1.1 + 5) = 71 G', () => {
    const results = newCustomerQuote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }]);
    expect(results[0]).toEqual({ premium: 71 });
  });

  it('4 runes → 100 G base (no block) → ceil(100*1.1 + 5) = 115 G', () => {
    const results = newCustomerQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ]);
    expect(results[0]).toEqual({ premium: 115 });
  });

  it('7 runes → 175 G base → ceil(175*1.1 + 5) = 198 G (rounding example)', () => {
    const results = newCustomerQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ]);
    expect(results[0]).toEqual({ premium: 198 });
  });

  it('2 runes + 1 moonstone → 75 G base (no block: different types)', () => {
    const results = newCustomerQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' },
    ]);
    // 75 * 1.1 + 5 = 82.5 + 5 = 87.5 → ceil = 88
    expect(results[0]).toEqual({ premium: 88 });
  });

  it('3 runes + 3 moonstones → 120 G base (two separate blocks)', () => {
    const results = newCustomerQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ]);
    // 120 * 1.1 + 5 = 132 + 5 = 137
    expect(results[0]).toEqual({ premium: 137 });
  });
});

describe('quote – cursed item surcharge', () => {
  it('cursed sword adds 50% of sword base premium to policy', () => {
    // New customer, first contract, cursed sword
    // policy base = 100, item surcharge = 50, policy modifier = +10% of 100 = +10
    // total = 100 + 50 + 10 + 5 = 165 G
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]);
    expect(results[0]).toEqual({ premium: 165 });
  });

  it('cursed applies to affected item only, not whole policy', () => {
    // cursed sword (base 100) + plain amulet (base 60) → policy base 160
    // cursed surcharge = 50% of 100 = 50 → policy after item modifiers = 160 + 50 = 210
    // first insurance = +10% of policy base (160) = +16
    // total before fee = 210 + 16 = 226, + 5 fee = 231
    const results = newCustomerQuote([
      { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ]);
    expect(results[0]).toEqual({ premium: 231 });
  });
});

describe('quote – high enchantment surcharge', () => {
  it('enchantment 5 on sword adds 30% of sword base premium', () => {
    // policy base = 100, item surcharge = 30, first insurance = +10
    // total = 100 + 30 + 10 + 5 = 145
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }]);
    expect(results[0]).toEqual({ premium: 145 });
  });

  it('enchantment 4 does not trigger high-enchantment surcharge', () => {
    // policy base = 100, no surcharge, first insurance = +10
    // total = 100 + 10 + 5 = 115
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }]);
    expect(results[0]).toEqual({ premium: 115 });
  });

  it('both cursed and high-enchantment apply when sword is cursed and enchantment >= 5', () => {
    // policy base = 100, curse = +50, high enchant = +30, first insurance = +10
    // total = 100 + 50 + 30 + 10 + 5 = 195
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }]);
    expect(results[0]).toEqual({ premium: 195 });
  });
});

describe('quote – loyalty discount (≥ 2 years)', () => {
  it('customer with exactly 2 years gets 20% loyalty discount', () => {
    // sword, 2 years, first contract: base 100, loyalty -20, first insurance +10, fee +5 = 95
    const results = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }],
    });
    expect(results[0]).toEqual({ premium: 95 });
  });

  it('customer with 1 year does not get loyalty discount', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }],
    });
    // base 100 + first insurance 10 + fee 5 = 115
    expect(results[0]).toEqual({ premium: 115 });
  });
});

describe('quote – follow-up contract discount', () => {
  it('second quote gets 15% follow-up discount alongside first insurance surcharge', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
      ],
    });
    // First quote: 100 + 10 + 5 = 115
    expect(results[0]).toEqual({ premium: 115 });
    // Second quote: base 100, +10% first insurance, -15% follow-up = net -5%, so 100 - 5 + 5 = 100
    expect(results[1]).toEqual({ premium: 100 });
  });
});

describe('quote – integration examples from spec', () => {
  it('newcomer with a cursed sword: 165 G', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    expect(results[0]).toEqual({ premium: 165 });
  });

  it("long-standing customer's second contract: 160 G", () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] }, // first contract
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] }, // second contract
      ],
    });
    // Second quote: base 100, curse +50, high enchant +30, loyalty -20, first insurance +10, follow-up -15 = 155 + 5 fee = 160
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe('quote – insurance sum and cap calculation', () => {
  it('sword + amulet insurance sum is 1600 G, cap 3200 G', () => {
    // We verify this via claim cap behavior
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'sword', amount: 3000 },
              { itemType: 'amulet', amount: 3000 },
            ],
          },
        },
      ],
    });
    // Max payout = cap 3200. Desired: (3000-100) + (3000-100) = 5800. Capped at 3200.
    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });

  it('block of 3 runes does not affect insurance sum (only premium)', () => {
    // sword + 3 runes: insurance sum = 1000 + 3*250 = 1750, cap = 3500
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'sword', amount: 5000 },
            ],
          },
        },
      ],
    });
    // Desired payout: 5000 - 100 = 4900, capped at 3500
    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
});

describe('claim – standard reimbursement', () => {
  it('regular sword damage 500 G → payout 400 G', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('rune damage 200 G → payout 100 G', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe('claim – high enchantment (≥ 8) reimbursement at 50%', () => {
  it('steel sword enchantment 9, damage 1000 G → payout 400 G', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // 50% of 1000 = 500, minus 100 deductible = 400
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('dragon sword enchantment 8, damage 1000 G → payout 400 G (high-enchant wins)', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('dragon sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins)', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe('claim – dragon material reimbursement at 100%', () => {
  it('dragon sword enchantment 5, damage 800 G → payout 700 G', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] },
        },
      ],
    });
    // full reimbursement, then deductible: 800 - 100 = 700
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
});

describe('claim – deductible per damage event', () => {
  it('dragon attack: sword (500) + amulet (300) → payout 600 G', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim', policy: 0,
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
    // (500-100) + (300-100) = 400 + 200 = 600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe('claim – cap exhaustion over multiple claims', () => {
  it('two successive claims of 1500 G on sword (cap 2000)', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });
    // first claim: 1500-100=1400, remaining cap 2000-1400=600
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // second claim: desired 1400, but cap 600 → payout 600, remaining 0
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('claim – multiple items of same type', () => {
  it('two swords insured, both damaged → each has own deductible', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim', policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    // (500-100) + (500-100) = 800
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('insurance sum for two swords is 2000 G, cap 4000 G', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim', policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'sword', amount: 3000 },
              { itemType: 'sword', amount: 3000 },
            ],
          },
        },
      ],
    });
    // desired: (3000-100)*2 = 5800, capped at 4000
    expect(results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
});

describe('claim – rounding in MHPCO favor', () => {
  it('payout 350.5 G → rounds down to 350 G', () => {
    // Need a damage that yields 350.5 G payout
    // High enchant (50%): 50% of damage - 100 = 350.5 → damage = 901
    // 50% * 901 = 450.5, 450.5 - 100 = 350.5 → floor = 350
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe('quote – rounding in MHPCO favor', () => {
  it('premium 197.5 G → rounds up to 198 G (7 runes example)', () => {
    // Verified above in the 7 runes test
    const results = newCustomerQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ]);
    expect(results[0]).toEqual({ premium: 198 });
  });
});

describe('error cases – quote', () => {
  it('unknown item type throws AppError', () => {
    expect(() => {
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      });
    }).toThrow(AppError);
  });
});

describe('error cases – claim', () => {
  it('damage to item not in policy throws AppError', () => {
    expect(() => {
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          {
            op: 'claim', policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
          },
        ],
      });
    }).toThrow(AppError);
  });

  it('damage with unknown item type throws AppError', () => {
    expect(() => {
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          {
            op: 'claim', policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] },
          },
        ],
      });
    }).toThrow(AppError);
  });

  it('negative damage amount throws AppError', () => {
    expect(() => {
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          {
            op: 'claim', policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      });
    }).toThrow(AppError);
  });

  it('more damages than insured items of same type throws AppError', () => {
    expect(() => {
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          {
            op: 'claim', policy: 0,
            incident: {
              cause: 'fire',
              damages: [
                { itemType: 'sword', amount: 200 },
                { itemType: 'sword', amount: 200 },
              ],
            },
          },
        ],
      });
    }).toThrow(AppError);
  });
});

describe('modifier thresholds (spec examples)', () => {
  it('customer with exactly 2 years → loyalty discount applies', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }],
    });
    // base 100, loyalty -20, first insurance +10, fee +5 = 95
    expect(results[0]).toEqual({ premium: 95 });
  });

  it('sword with exactly enchantment 5 → high-enchantment surcharge applies', () => {
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }]);
    // base 100, high-enchant +30, first insurance +10, fee +5 = 145
    expect(results[0]).toEqual({ premium: 145 });
  });

  it('cursed sword with enchantment 5 → both surcharges apply', () => {
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }]);
    // base 100, curse +50, high-enchant +30, first insurance +10, fee +5 = 195
    expect(results[0]).toEqual({ premium: 195 });
  });

  it('sword with enchantment 4 → no high-enchantment surcharge', () => {
    const results = newCustomerQuote([{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }]);
    // base 100, first insurance +10, fee +5 = 115
    expect(results[0]).toEqual({ premium: 115 });
  });
});

describe('cap spec – cursed sword cap based on unmodified insurance value', () => {
  it('cursed sword cap is 2000 G (not affected by premium modifiers)', () => {
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 5000 }] },
        },
      ],
    });
    // Desired: 5000-100=4900, capped at 2000
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
});
