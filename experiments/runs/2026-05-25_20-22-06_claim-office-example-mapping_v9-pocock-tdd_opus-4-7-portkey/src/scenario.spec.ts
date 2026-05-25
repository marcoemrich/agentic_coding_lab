import { describe, expect, test } from 'vitest';
import { runScenario } from './scenario';

describe('quote: empty items', () => {
  test('empty item list yields premium 5 (processing fee only)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(out.results).toEqual([{ premium: 5 }]);
  });
});

describe('quote: single item base premiums', () => {
  test('newcomer with a regular sword: 100 base + 10 first insurance + 5 fee = 115', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  test.each([
    ['amulet', 71], // 60 + 6 + 5
    ['staff', 93],  // 80 + 8 + 5
    ['potion', 49], // 40 + 4 + 5
  ])('newcomer with a single %s: premium %i', (type, expected) => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type }] }],
    });
    expect(out.results).toEqual([{ premium: expected }]);
  });
});

describe('quote: item modifiers', () => {
  test('cursed sword adds 50% of item base premium: 100 + 50 + 10 first ins + 5 = 165', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
      ],
    });
    // policy base = 100, item premium = 100 + 50 = 150
    // first insurance = 10% of 100 = 10
    // total = 150 + 10 + 5 = 165
    expect(out.results).toEqual([{ premium: 165 }]);
  });

  test('sword with exactly enchantment 5 triggers +30% high-enchantment surcharge', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        },
      ],
    });
    // item: 100 + 30 = 130; first ins 10; fee 5 → 145
    expect(out.results).toEqual([{ premium: 145 }]);
  });

  test('sword with enchantment 4 does NOT trigger high-enchantment surcharge', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }],
        },
      ],
    });
    // item: 100; first ins 10; fee 5 → 115
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  test('cursed + high enchantment stack: 100 + 50 + 30 = 180; +10 first ins + 5 fee = 195', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(out.results).toEqual([{ premium: 195 }]);
  });

  test('cursed sword + plain amulet: curse only on the cursed item; policy base 160 → 210 before policy mods', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
            { type: 'amulet', material: 'silver', enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // sword: 100 + 50 = 150; amulet: 60. items total = 210
    // policy base = 160; first insurance = 16; fee = 5
    // total = 210 + 16 + 5 = 231
    expect(out.results).toEqual([{ premium: 231 }]);
  });
});

describe('quote: policy modifiers', () => {
  test('long-standing customer (exactly 2 years) gets 20% loyalty discount on policy base', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });
    // item: 100; first ins: +10 (10% of 100); loyalty: -20 (20% of 100); fee 5
    // total = 100 + 10 - 20 + 5 = 95
    expect(out.results).toEqual([{ premium: 95 }]);
  });

  test('second quote step gets 15% follow-up contract discount on policy base', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
      ],
    });
    // First quote: item 100 + first ins 10 + fee 5 = 115
    // Second quote: item 100 + first ins 10 - follow-up 15 + fee 5 = 100
    expect(out.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  test('integration: long-standing customer (3 years), second quote, cursed sword (enchantment 7) → 160', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'staff' }] }, // dummy first quote
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });
    // Per prompt: 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 fee = 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });
});

describe('claim: standard reimbursement', () => {
  test('regular sword (steel, enchantment 3) damage 500 → payout 400, remainingCap 1600', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 500 }],
          },
        },
      ],
    });
    // cap = 2 * 1000 = 2000; payout = 500 - 100 = 400; remainingCap = 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('rune (no enchantment, no material) damage 200 → payout 100', () => {
    const out = runScenario({
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
    // cap = 2*250 = 500; payout = 200 - 100 = 100; remainingCap = 400
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  test('multiple damages in one incident: deductible per item', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3 },
            { type: 'amulet', material: 'silver', enchantment: 1 },
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
    // sword 500-100=400; amulet 300-100=200 → total 600
    // cap = 2*(1000+600) = 3200; remaining = 2600
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe('errors', () => {
  test('quote with unknown item type throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick/);
  });

  test('claim references item type not in policy → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });

  test('claim with negative damage amount throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/negative|amount/i);
  });

  test('claim with more damages of a type than insured → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [
                { itemType: 'sword', amount: 200 },
                { itemType: 'sword', amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
});

describe('rounding in MHPCO favor', () => {
  test('premium rounded up (e.g. 197.5 → 198 — covered by 7 runes scenario)', () => {
    const items = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items }],
    });
    // 7 * 25 = 175; +17.5 first ins; +5 fee = 197.5 → 198
    expect(out.results).toEqual([{ premium: 198 }]);
  });

  test('payout rounded down (350.5 → 350)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] },
        },
      ],
    });
    // 901 * 0.5 = 450.5; -100 = 350.5 → 350
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe('claim: special reimbursement clauses', () => {
  test('high-enchantment (≥8) item is reimbursed at 50% before deductible', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // 1000*0.5 = 500; -100 deductible = 400
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('dragon-material item gets full reimbursement (then deductible)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] },
        },
      ],
    });
    // dragon full: 800; -100 = 700
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  test('dragon-material AND enchantment ≥8: the 50% rule wins', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // 1000*0.5 = 500; -100 = 400
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  test('cap exhaustion: two 1500 G claims on a sword (cap 2000) → 1400 then 600', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
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
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  test('two swords insured: insurance sum 2000, cap 4000; two sword damages = two deductibles', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3 },
            { type: 'sword', material: 'steel', enchantment: 3 },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 400 },
            ],
          },
        },
      ],
    });
    // (500-100) + (400-100) = 700; cap 4000 → 3300
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 3300 });
  });

  test('dragon-material with exactly enchantment 8: 50% clause wins', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // 1000*0.5 = 500; -100 = 400
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe('quote: components and blocks', () => {
  test('2 runes (no block): 50 base + 5 first ins + 5 fee = 60', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }] }],
    });
    expect(out.results).toEqual([{ premium: 60 }]);
  });

  test('3 runes (block): 60 base + 6 first ins + 5 fee = 71', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] }],
    });
    expect(out.results).toEqual([{ premium: 71 }]);
  });

  test('4 runes (no block — block requires exactly 3): 100 + 10 + 5 = 115', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        },
      ],
    });
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  test('7 runes (no block — only exactly 3 qualifies): 175 + 17.5 + 5 = 197.5 → 198', () => {
    const items = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items }],
    });
    expect(out.results).toEqual([{ premium: 198 }]);
  });

  test('2 runes + 1 moonstone (no block — different types): 75 + 7.5 + 5 = 87.5 → 88', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        },
      ],
    });
    expect(out.results).toEqual([{ premium: 88 }]);
  });

  test('3 runes + 3 moonstones (two separate blocks): 120 + 12 + 5 = 137', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
            { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
          ],
        },
      ],
    });
    expect(out.results).toEqual([{ premium: 137 }]);
  });
});
