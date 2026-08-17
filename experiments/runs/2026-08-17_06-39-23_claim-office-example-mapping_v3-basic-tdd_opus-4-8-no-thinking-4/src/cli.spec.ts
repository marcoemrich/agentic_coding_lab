import { describe, it, expect } from 'vitest';
import { handleScenario } from './cli';

describe('handleScenario', () => {
  it('serialises quote and claim results', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    const out = JSON.parse(handleScenario(input));
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('throws on an unknown item type so the CLI can exit non-zero', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(() => handleScenario(input)).toThrow();
  });
});

describe('modifier scope integration', () => {
  it('applies the curse surcharge to the whole policy correctly', () => {
    // cursed sword (100) + plain amulet (60): base 160 + 50 curse = 210
    // before further modifiers/fee. With 0 years, first quote:
    // + 16 first insurance + 5 fee = 231
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] }],
    });
    const out = JSON.parse(handleScenario(input));
    expect(out.results[0]).toEqual({ premium: 231 });
  });
});
