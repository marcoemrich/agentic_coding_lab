import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

describe('quotes', () => {
  it('prices main items, component blocks, and an empty policy', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [] },
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 100 }, { premium: 62 }] });
  });

  it('stacks item and policy modifiers before rounding once', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
    ] })).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  it('applies item modifiers only to affected main items', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [
      { type: 'sword', cursed: true }, { type: 'amulet' },
    ] }] })).toEqual({ results: [{ premium: 231 }] });
  });

  it('uses blocks only for exactly three components of each type', () => {
    const items = (type: string, count: number) => Array.from({ length: count }, () => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [...items('rune', 3), ...items('moonstone', 3)] },
      { op: 'quote', items: items('rune', 4) },
      { op: 'quote', items: items('rune', 7) },
    ] })).toEqual({ results: [{ premium: 137 }, { premium: 100 }, { premium: 172 }] });
  });

  it('applies item risk modifiers to components too', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'rune', cursed: true }] },
    ] })).toEqual({ results: [{ premium: 45 }] });
  });

  it('rejects unknown items', () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'broomstick' }] },
    ] })).toThrow(/unknown item type/i);
  });
});

describe('claims', () => {
  it('deducts per damaged item and uses insured item clauses', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [
        { type: 'sword', material: 'dragon', enchantment: 9 },
        { type: 'amulet', enchantment: 2 },
      ] },
      { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
        { itemType: 'sword', amount: 1000 }, { itemType: 'amulet', amount: 300 },
      ] } },
    ] })).toEqual({ results: [{ premium: 211 }, { payout: 600, remainingCap: 2600 }] });
  });

  it('rounds down only the final aggregate payout', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
      { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 901 }] } },
    ] })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });

  it('tracks and exhausts the policy cap across claims', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
    ] })).toEqual({ results: [
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ] });
  });

  it('rejects negative, uninsured, or excess damage entries', () => {
    const base = (damages: unknown[]) => ({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'x', damages } },
    ] });
    expect(() => processScenario(base([{ itemType: 'sword', amount: -1 }]))).toThrow(/amount/i);
    expect(() => processScenario(base([{ itemType: 'amulet', amount: 1 }]))).toThrow(/not covered/i);
    expect(() => processScenario(base([
      { itemType: 'sword', amount: 1 }, { itemType: 'sword', amount: 1 },
    ]))).toThrow(/not covered/i);
  });
});

describe('CLI', () => {
  const run = (input: string) => spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], {
    input,
    encoding: 'utf8',
  });

  it('reads one scenario from stdin and emits JSON', () => {
    const child = run(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'potion' }] }],
    }));
    expect(child.status).toBe(0);
    expect(JSON.parse(child.stdout)).toEqual({ results: [{ premium: 49 }] });
    expect(child.stderr).toBe('');
  });

  it('reports invalid scenarios to stderr without results', () => {
    const child = run(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    }));
    expect(child.status).not.toBe(0);
    expect(child.stdout).toBe('');
    expect(child.stderr).toMatch(/unknown item type/i);
  });
});
