import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));
const run = promisify(execFile);

async function cli(input: unknown) {
  const child = run('node', ['--import', 'tsx', CLI]);
  child.child.stdin!.end(JSON.stringify(input));
  return child;
}

describe('the claim-office CLI', () => {
  it('writes the results for a scenario to stdout', async () => {
    const { stdout } = await cli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it.each([
    [
      'an unknown item type in a quote',
      { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] },
    ],
    [
      'a damage to an item outside the policy',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
        ],
      },
    ],
    [
      'a negative damage amount',
      {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      },
    ],
  ])('exits non-zero and explains %s on stderr', async (_case, input) => {
    const failure = await cli(input).catch((error) => error);

    expect(failure.code).not.toBe(0);
    expect(failure.stderr).not.toBe('');
    expect(failure.stdout).toBe('');
  });
});
