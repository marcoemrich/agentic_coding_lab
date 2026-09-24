import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const run = (input: unknown) => spawnSync('./node_modules/.bin/tsx', ['src/cli.ts'], {
  input: JSON.stringify(input), encoding: 'utf8',
});

describe('claim-office CLI', () => {
  it('can be launched as the claim-office executable', () => {
    const result = spawnSync('./claim-office', [], {input: JSON.stringify({customer: {yearsWithMHPCO: 0}, steps: []}), encoding: 'utf8'});
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({results: []});
  });
  it('reads a scenario and writes only JSON results to stdout', () => {
    const result = run({customer: {yearsWithMHPCO: 5}, steps: [
      {op: 'quote', items: [{type: 'amulet', material: 'silver', enchantment: 2, cursed: false}]},
      {op: 'claim', policy: 0, incident: {cause: 'fire', damages: [{itemType: 'amulet', amount: 200}]}},
    ]});
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({results: [{premium: 59}, {payout: 100, remainingCap: 1100}]});
  });
  it.each([
    {customer: {yearsWithMHPCO: 0}, steps: [{op: 'quote', items: [{type: 'broomstick'}]}]},
    {customer: {yearsWithMHPCO: 0}, steps: [{op: 'quote', items: [{type: 'sword'}]},
      {op: 'claim', policy: 0, incident: {cause: 'fire', damages: [{itemType: 'amulet', amount: 200}]}}]},
    {customer: {yearsWithMHPCO: 0}, steps: [{op: 'quote', items: [{type: 'sword'}]},
      {op: 'claim', policy: 0, incident: {cause: 'fire', damages: [{itemType: 'sword', amount: -200}]}}]},
  ])('rejects the entire invalid scenario with a stderr description', (scenario) => {
    const result = run(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).not.toBe('');
  });
});
