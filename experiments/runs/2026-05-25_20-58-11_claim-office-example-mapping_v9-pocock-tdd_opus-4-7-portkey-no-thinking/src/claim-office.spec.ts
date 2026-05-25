import { describe, it, expect } from 'vitest';
import { runScenario, type ClaimResult } from './claim-office.js';
import { runCli } from './cli.js';

describe('claim-office', () => {
  it('returns only the processing fee for an empty item list', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  it('charges base premium for a single sword (no modifiers)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });
    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it('3 runes: block applies for 60 G base', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        },
      ],
    });
    // base 60, first insurance 6, fee 5 => 71
    expect(result.results).toEqual([{ premium: 71 }]);
  });

  it('4 runes: no block (block requires exactly 3)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        },
      ],
    });
    // base 100, first insurance 10, fee 5 => 115
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it('7 runes: 175 G base (block requires exactly 3)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: Array.from({ length: 7 }, () => ({ type: 'rune' })),
        },
      ],
    });
    // base 175, first insurance 17.5, fee 5 => 197.5 -> ceil 198
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  it('2 runes + 1 moonstone: no block (different types)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        },
      ],
    });
    // base 75, first insurance 7.5, fee 5 => 87.5 -> ceil 88
    expect(result.results).toEqual([{ premium: 88 }]);
  });

  it('3 runes + 3 moonstones: two separate blocks (120 G base)', () => {
    const result = runScenario({
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
    // base 120, first insurance 12, fee 5 => 137
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  it('2 runes: 25 G base premium each (no block)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'rune' }, { type: 'rune' }],
        },
      ],
    });
    // base 50, first insurance 5 (10% of 50), fee 5 => 60
    expect(result.results).toEqual([{ premium: 60 }]);
  });

  it('cursed surcharge applies per-item, not to whole policy', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // base 160 + curse 50 (on sword only) + first insurance 10% on each (10 + 6) + fee 5 = 231
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  it('CLI: unknown item type exits non-zero with error on stderr', () => {
    const stdin = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    const result = runCli(stdin);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe('');
  });

  it('CLI: claim referencing item not in policy exits non-zero', () => {
    const stdin = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 100 }] },
        },
      ],
    });
    const result = runCli(stdin);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  it('CLI: negative damage amount exits non-zero', () => {
    const stdin = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    });
    const result = runCli(stdin);
    expect(result.exitCode).not.toBe(0);
  });

  it('cursed sword: cap based on unmodified insurance value (2000 G)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
      ],
    });
    // (200 - 100) = 100, cap remaining = 2000 - 100 = 1900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });

  it('sword + 3 runes block: cap based on insurance values (3500 G)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
            { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          ],
        },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
      ],
    });
    // insurance sum = 1000 + 3*250 = 1750, cap = 3500; payout 100; remaining 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  it('payout 901 G with 50% rule rounds down to 350 G after deductible', () => {
    // damage 901 → 50% = 450.5 → -100 = 350.5 → floor 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] },
        },
      ],
    });
    expect((result.results[1] as ClaimResult).payout).toBe(350);
  });

  it('CLI: schema example produces correct results JSON', () => {
    const stdin = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    });
    const result = runCli(stdin);
    expect(result.exitCode).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out).toHaveProperty('results');
    expect(Array.isArray(out.results)).toBe(true);
    expect(out.results.length).toBe(2);
    expect(out.results[0]).toHaveProperty('premium');
    expect(out.results[1]).toHaveProperty('payout');
    expect(out.results[1]).toHaveProperty('remainingCap');
  });

  it('two swords damaged: each damage entry has its own deductible', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
        {
          op: 'claim', policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 600 },
              { itemType: 'sword', amount: 400 },
            ],
          },
        },
      ],
    });
    // sum=2000, cap=4000; (600-100)+(400-100)=500+300=800
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('claim with too many damage entries rejects the claim', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
        {
          op: 'claim', policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'sword', amount: 100 },
              { itemType: 'sword', amount: 100 },
            ],
          },
        },
      ],
    })).toThrow();
  });

  it('cap exhaustion: two successive 1500 G claims on a sword', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
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
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('dragon-material sword enchantment 8, damage 1000 → payout 400 (50% wins at boundary)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('dragon-material sword enchantment 5, damage 800 → payout 700 (full reimbursement)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  it('dragon-material sword enchantment 9, damage 1000 → payout 400 (50% wins)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('steel sword enchantment 9, damage 1000 → payout 400 (50% then deductible)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('sword + amulet damaged by dragon: deductible per item, payout 600', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
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
    // sum=1600, cap=3200; (500-100) + (300-100) = 400+200 = 600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('regular sword damage 500 → payout 400 (deductible 100)', () => {
    const result = runScenario({
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('long-standing customer second contract: 160 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // first contract (any quote — premium not checked here)
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 1, cursed: false }],
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });
    // second quote: 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 fee = 160
    expect((result.results[1] as { premium: number }).premium).toBe(160);
  });

  it('newcomer with a cursed sword: 165 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
});
