import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function runCli(input: string) {
  return spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], { input, encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('writes the scenario results as JSON to stdout', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });

    const result = runCli(input);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  it('exits non-zero with an error description on stderr and no results on stdout', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    const result = runCli(input);

    expect(result.status).not.toBe(0);
    expect(result.stderr.trim()).toBe('Error: Unknown item type: broomstick');
    expect(result.stdout).toBe('');
  });

  it.each([
    ['more sword damages than insured swords', [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }]],
    ['a damaged amulet that is not insured', [{ itemType: 'amulet', amount: 300 }]],
    ['a negative damage amount', [{ itemType: 'sword', amount: -200 }]],
  ])('rejects the whole claim for %s', (_description, damages) => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
      ],
    });

    const result = runCli(input);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/^Error: /);
    expect(result.stdout).toBe('');
  });
});
