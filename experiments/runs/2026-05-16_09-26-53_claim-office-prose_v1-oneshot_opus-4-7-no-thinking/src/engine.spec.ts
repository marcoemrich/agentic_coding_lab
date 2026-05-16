import { describe, expect, it } from 'vitest';
import { runScenario } from './engine.js';
import { Scenario } from './types.js';

describe('runScenario', () => {
  it('processes a quote-only scenario', () => {
    const sc: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    };
    const out = runScenario(sc);
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  it('processes a quote followed by claims', () => {
    const sc: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'spell mishap',
            damages: [{ itemType: 'amulet', amount: 250 }],
          },
        },
      ],
    };
    const out = runScenario(sc);
    // Premium: amulet, 5 yrs, first contract
    // 60 * 0.8 * 1.1 + 5 = 52.8 + 5 = 57.8 -> 58
    // Insurance sum = 600; cap = 1200
    // Claim 1: amulet enchantment 2 < 8, not dragon -> full reimbursement
    //   payout = 200 - 100 = 100; remainingCap = 1100
    // Claim 2: 250 - 100 = 150; remainingCap = 950
    expect(out.results).toEqual([
      { premium: 58 },
      { payout: 100, remainingCap: 1100 },
      { payout: 150, remainingCap: 950 },
    ]);
  });

  it('reimburses 50% for high-enchantment items', () => {
    const sc: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'staff', material: 'oak', enchantment: 8, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'lightning',
            damages: [{ itemType: 'staff', amount: 500 }],
          },
        },
      ],
    };
    const out = runScenario(sc);
    // 500 * 0.5 = 250; -100 deductible = 150
    expect(out.results[1]).toEqual({ payout: 150, remainingCap: 1600 - 150 });
  });

  it('reimburses 100% for dragon-material items', () => {
    const sc: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'dragon', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'sparring',
            damages: [{ itemType: 'sword', amount: 500 }],
          },
        },
      ],
    };
    const out = runScenario(sc);
    // 500 full reimbursement; -100 = 400; cap was 2000 -> 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('caps payout at twice the insurance sum', () => {
    const sc: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'potion', material: 'glass', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'flood',
            damages: [{ itemType: 'potion', amount: 10000 }],
          },
        },
      ],
    };
    const out = runScenario(sc);
    // Insurance sum = 400; cap = 800
    // 10000 - 100 = 9900, capped at 800
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 0 });
  });

  it('returns zero payout when deductible exceeds damage', () => {
    const sc: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'nick',
            damages: [{ itemType: 'sword', amount: 50 }],
          },
        },
      ],
    };
    const out = runScenario(sc);
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('applies subsequent contract discount on second quote', () => {
    const sc: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'quote',
          items: [
            { type: 'potion', material: 'glass', enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const out = runScenario(sc);
    // first: 100 * 1.1 + 5 = 115
    // second: 40 * 0.85 + 5 = 39
    expect(out.results).toEqual([{ premium: 115 }, { premium: 39 }]);
  });
});
