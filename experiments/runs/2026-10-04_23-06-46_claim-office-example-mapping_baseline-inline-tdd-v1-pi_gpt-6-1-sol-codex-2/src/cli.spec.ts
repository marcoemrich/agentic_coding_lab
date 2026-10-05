import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const run = (input: unknown) => spawnSync('./claim-office', [], {
  input: typeof input === 'string' ? input : JSON.stringify(input), encoding: 'utf8',
});

describe('claim-office CLI', () => {
  it.each([
    ['unknown quote type', [{ op: 'quote', items: [{ type: 'broomstick' }] }]],
    ['prototype property as type', [{ op: 'quote', items: [{ type: 'toString' }] }]],
    ['uninsured item', [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ]],
    ['unknown damage type', [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } },
    ]],
    ['too many same-type damages', [
      { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
        { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 },
      ] } },
    ]],
    ['negative damage', [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
    ]],
  ])('rejects %s without partial stdout results', (_name, steps) => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr.trim()).not.toBe('');
    expect(result.stdout).toBe('');
  });
  it.each([
    'not json', null, [], {},
    { customer: {}, steps: [] },
    { customer: { yearsWithMHPCO: 1.5 }, steps: [] },
    { customer: { yearsWithMHPCO: '2' }, steps: [] },
    { customer: { yearsWithMHPCO: 0 }, steps: [ { op: 'renew', items: [] } ] },
    { customer: { yearsWithMHPCO: 0 }, steps: [ { op: 'quote', items: [{ type: 'sword', cursed: 'yes' }] } ] },
    { customer: { yearsWithMHPCO: 0 }, steps: [ { op: 'quote', items: [{ type: 'sword', enchantment: 2.5 }] } ] },
    { customer: { yearsWithMHPCO: 0 }, steps: [ { op: 'quote', items: [{ type: 'sword', material: 123 }] } ] },
    { customer: { yearsWithMHPCO: 0 }, steps: [ { op: 'quote', items: [] }, { op: 'claim', policy: 0, incident: { damages: [] } } ] },
  ])('rejects malformed input %j with an error and no stdout', input => {
    const result = run(input);
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim()).not.toBe('');
  });
  it.each([-1, 1, 0.5])('rejects a policy reference that is not an earlier quote: %i', policy => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy, incident: { cause: 'fire', damages: [] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/policy/i);
  });
  it('reads a scenario from stdin and writes only the normative JSON results', () => {
    const result = run({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
