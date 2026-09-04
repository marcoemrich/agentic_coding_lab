import { describe, expect, test } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

/** Runs the real CLI as a child process and captures its streams. */
function runCli(input: string): Promise<CliRun> {
  return new Promise((resolve) => {
    const child = execFile('npx', ['tsx', CLI], (error, stdout, stderr) => {
      resolve({ status: error ? (error as { code?: number }).code ?? 1 : 0, stdout, stderr });
    });
    child.stdin!.end(input);
  });
}

describe('claim-office CLI', () => {
  test('reads a scenario from stdin and writes results to stdout', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    const { status, stdout } = await runCli(input);

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  test('exits non-zero and explains itself on stderr for an unknown item type', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    const { status, stdout, stderr } = await runCli(input);

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe('');
  });

  test('exits non-zero when a claim damages an item outside the policy', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    const { status, stdout, stderr } = await runCli(input);

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
    expect(stdout).toBe('');
  });

  test('exits non-zero for a negative damage amount', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    });

    const { status, stderr } = await runCli(input);

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/negative|amount/i);
  });
});
