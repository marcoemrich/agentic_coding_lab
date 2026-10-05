import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const run = (input: unknown) => spawnSync('./claim-office', [], {
  input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8',
});

describe('claim-office executable', () => {
  it('reads the normative schema and writes ordered JSON results', () => {
    const result = run({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it.each([
    [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }],
    [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } }],
    [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }],
    [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }] } }],
  ])('rejects the whole invalid scenario without partial stdout %j', (...steps) => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim().length).toBeGreaterThan(0);
  });
  it.each([
    {},
    { customer: {}, steps: [] },
    { customer: { yearsWithMHPCO: 1.5 }, steps: [] },
    { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword', cursed: 'yes' }] }] },
    { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 2.5 }] }] },
    { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { damages: [] } }] },
    { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200.5 }] } }] },
  ])('rejects schema-invalid input %j', input => {
    const result = run(input);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).not.toBe('');
  });
  it('reports invalid JSON to stderr', () => {
    const result = run('{');
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim().length).toBeGreaterThan(0);
  });
});
