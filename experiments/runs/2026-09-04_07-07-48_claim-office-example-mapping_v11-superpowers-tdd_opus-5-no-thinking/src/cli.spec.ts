import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, test } from 'vitest';

const execFileAsync = promisify(execFile);
const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

async function runCli(input: unknown): Promise<CliRun> {
  const child = execFileAsync('npx', ['tsx', CLI], { encoding: 'utf8' });
  child.child.stdin?.end(JSON.stringify(input));
  try {
    const { stdout, stderr } = await child;
    return { status: 0, stdout, stderr };
  } catch (error) {
    const failure = error as { code?: number; stdout: string; stderr: string };
    return {
      status: failure.code ?? 1,
      stdout: failure.stdout,
      stderr: failure.stderr,
    };
  }
}

describe('claim-office CLI', () => {
  test('writes a result per step to stdout', async () => {
    const { status, stdout } = await runCli({
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
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    });

    expect(status).toBe(0);
    // amulet: base 60, loyalty -12, first +6 => 54, + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  test('rejects an unknown item type with a non-zero status and no stdout results', async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  }, 30000);

  test('rejects a negative damage amount with a non-zero status', async () => {
    const { status, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: -200 }],
          },
        },
      ],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/-200|negative/);
  }, 30000);
});
