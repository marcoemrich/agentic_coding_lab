import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): Promise<CliRun> {
  return new Promise((resolve) => {
    const child = execFile(
      'node_modules/.bin/tsx',
      [CLI],
      (error, stdout, stderr) => {
        resolve({
          status: error && 'code' in error ? Number(error.code) : 0,
          stdout,
          stderr,
        });
      },
    );

    child.stdin!.end(JSON.stringify(input));
  });
}

describe('claim-office CLI', () => {
  test('reads a scenario from stdin and writes results to stdout', async () => {
    const { status, stdout } = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            {
              type: 'amulet',
              material: 'silver',
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    });

    expect(status).toBe(0);
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59;
    // payout 200 - 100, cap 2 x 600
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  test('rejects an uninsurable item with a non-zero status and no results', async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(status).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/broomstick/);
  });
});
