import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office';

describe('CLI', () => {
  it('is exposed as the claim-office package executable', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(packageJson.bin).toEqual({ 'claim-office': './src/cli.ts' });
  });

  it('reads a scenario from stdin and writes only its JSON result', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'potion' }] }],
    });
    const run = spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input, encoding: 'utf8' });
    expect(run.status).toBe(0);
    expect(run.stderr).toBe('');
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 49 }] });
  });
});

describe('quotes', () => {
  it('charges only the processing fee for an empty policy', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });

  it('uses the price list for ordinary main items', () => {
    const items = ['sword', 'amulet', 'staff', 'potion'].map(type => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }] }))
      .toEqual({ results: [{ premium: 313 }] });
  });

  it('prices only exact blocks of three alike components at 60 G', () => {
    const premium = (types: string[]) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: types.map(type => ({ type })) }],
    }).results[0].premium;
    expect(premium(['rune', 'rune'])).toBe(60);
    expect(premium(['rune', 'rune', 'rune'])).toBe(71);
    expect(premium(Array(4).fill('rune'))).toBe(115);
    expect(premium(Array(7).fill('rune'))).toBe(198);
    expect(premium(['rune', 'rune', 'moonstone'])).toBe(88);
    expect(premium([...Array(3).fill('rune'), ...Array(3).fill('moonstone')])).toBe(137);
  });

  it('rejects an unknown item type', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow(/unknown item type/i);
  });

  it('adds item risks locally and applies additive policy modifiers to every quote', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { premium: 160 }, { premium: 175 }],
    });
  });
});

describe('claims', () => {
  it('applies the enchantment reimbursement before the deductible, even for dragon material', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] } },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        { op: 'claim', policy: 4, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1001 }] } },
      ],
    };
    expect(processScenario(scenario).results).toEqual([
      { premium: 145 }, { payout: 400, remainingCap: 1600 },
      { premium: 130 }, { payout: 700, remainingCap: 1300 },
      { premium: 130 }, { payout: 400, remainingCap: 1600 },
    ]);
  });

  it('rejects a negative damage amount', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    })).toThrow(/negative damage/i);
  });

  it('rejects damage to an item not covered by the policy', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    })).toThrow(/not covered/i);
  });

  it('reimburses ordinary damage with one deductible per damage entry', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }, { type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
          { itemType: 'rune', amount: 200 },
        ] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 209 }, { payout: 700, remainingCap: 3000 }],
    });
  });
});
