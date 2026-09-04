import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

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
          status: error && 'code' in error ? (error.code as number) : 0,
          stdout,
          stderr,
        });
      },
    );
    child.stdin!.end(JSON.stringify(input));
  });
}

const EXECUTABLE = fileURLToPath(new URL('../bin/claim-office', import.meta.url));

describe('claim-office executable', () => {
  it('is runnable under its published name', async () => {
    const result = await new Promise<CliRun>((resolve) => {
      const child = execFile(EXECUTABLE, [], (error, stdout, stderr) => {
        resolve({
          status: error && 'code' in error ? (error.code as number) : 0,
          stdout,
          stderr,
        });
      });
      child.stdin!.end(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: 'quote', items: [] }],
        }),
      );
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', async () => {
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
    // 60 base - 12 loyalty + 6 first insurance = 54 + 5 fee = 59
    // payout 200 - 100 = 100; cap 1200 - 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('rejects a quote containing an item of unknown type', async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe('');
  });

  const swordPolicyWithDamages = (damages: unknown[]) => ({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      {
        op: 'quote',
        items: [
          { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
        ],
      },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages } },
    ],
  });

  it('rejects a claim for an item that is not part of the policy', async () => {
    const { status, stdout, stderr } = await runCli(
      swordPolicyWithDamages([{ itemType: 'amulet', amount: 200 }]),
    );

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
    expect(stdout).toBe('');
  });

  it('rejects a claim with more damages of a type than the policy covers', async () => {
    const { status, stdout, stderr } = await runCli(
      swordPolicyWithDamages([
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ]),
    );

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/sword/);
    expect(stdout).toBe('');
  });

  it('rejects a claim with a negative damage amount', async () => {
    const { status, stdout, stderr } = await runCli(
      swordPolicyWithDamages([{ itemType: 'sword', amount: -200 }]),
    );

    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
    expect(stdout).toBe('');
  });
});
