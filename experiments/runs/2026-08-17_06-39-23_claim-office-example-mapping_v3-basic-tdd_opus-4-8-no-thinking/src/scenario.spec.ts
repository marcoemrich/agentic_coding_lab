import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import type { ClaimResult, QuoteResult, Scenario } from './types.js';

describe('runScenario', () => {
  it('schema example: quote then claim', () => {
    const scenario: Scenario = {
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
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toHaveLength(2);
    // amulet base 60; loyalty(5yrs) -12; first insurance +6; fee +5 = 59
    expect((results[0] as QuoteResult).premium).toBe(59);
    // amulet cap = 1200; damage 200 - 100 = 100
    const claim = results[1] as ClaimResult;
    expect(claim.payout).toBe(100);
    expect(claim.remainingCap).toBe(1100);
  });

  it('follow-up discount applies to the second quote', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    // second quote is the long-standing customer's second contract → 160
    expect((results[1] as QuoteResult).premium).toBe(160);
  });

  it('first quote for long-standing customer has no follow-up discount', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    };
    const { results } = runScenario(scenario);
    // sword 100; loyalty -20; first insurance +10; fee +5 = 95
    expect((results[0] as QuoteResult).premium).toBe(95);
  });

  it('claim references the policy created by an earlier quote by index', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'amulet' }] },
        {
          op: 'claim',
          policy: 1,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 300 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    const claim = results[2] as ClaimResult;
    expect(claim.payout).toBe(200);
    expect(claim.remainingCap).toBe(1000); // cap 1200 - 200
  });

  it('unknown item type in a quote throws', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it('claim against a non-quote/invalid policy index throws', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 200 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
