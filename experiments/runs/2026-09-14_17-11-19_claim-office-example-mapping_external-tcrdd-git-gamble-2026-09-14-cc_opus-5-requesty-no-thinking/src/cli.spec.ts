import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: unknown) {
  return execFileSync('npx', ['tsx', cli], {
    input: JSON.stringify(input),
    encoding: 'utf8',
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const output = runCli({
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
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(JSON.parse(output)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
