import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface CliOutcome {
  code: number;
  stdout: string;
  stderr: string;
}

function runCli(input: string): Promise<CliOutcome> {
  return new Promise((resolve) => {
    const child = execFile('npx', ['tsx', CLI], (error, stdout, stderr) => {
      resolve({ code: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
    });
    child.stdin!.end(input);
  });
}

describe('claim-office CLI', () => {
  test('reads a scenario from stdin and writes results to stdout', async () => {
    const outcome = await runCli(
      JSON.stringify({
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
      }),
    );

    expect(outcome.code).toBe(0);
    // 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee = 59 G;
    // payout 200 − 100 deductible, cap 2 × 600 G
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  test('rejects an uninsurable item with a non-zero exit and a message on stderr', async () => {
    const outcome = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    );

    expect(outcome.code).not.toBe(0);
    expect(outcome.stderr).toMatch(/broomstick/);
    expect(outcome.stdout).toBe('');
  }, 30000);
});
