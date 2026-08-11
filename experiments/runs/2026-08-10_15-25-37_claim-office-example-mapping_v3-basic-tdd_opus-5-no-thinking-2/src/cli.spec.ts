import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface Run {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): Promise<Run> {
  return new Promise((resolve) => {
    const child = execFile('npx', ['tsx', CLI], (error, stdout, stderr) => {
      const status = error && typeof error.code === 'number' ? error.code : 0;
      resolve({ status, stdout, stderr });
    });
    child.stdin!.end(JSON.stringify(input));
  });
}

describe('claim-office CLI', () => {
  it('writes a result per step to stdout', async () => {
    const { status, stdout } = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30_000);

  it('quotes an empty item list at the processing fee alone', async () => {
    const { status, stdout } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  }, 30_000);

  it('fails without writing results when an item type is unknown', async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  }, 30_000);

  it('fails when a claim references an item outside the policy', async () => {
    const { status, stderr } = await runCli({
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

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
  }, 30_000);

  it('fails when more items of a type are damaged than are insured', async () => {
    const { status, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 100 },
              { itemType: 'sword', amount: 100 },
            ],
          },
        },
      ],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/sword/);
  }, 30_000);

  it('fails on a negative damage amount', async () => {
    const { status, stderr } = await runCli({
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

    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
  }, 30_000);

  it('fails on malformed JSON input', async () => {
    const { status, stderr } = await new Promise<Run>((resolve) => {
      const child = execFile('npx', ['tsx', CLI], (error, stdout, stderr) => {
        resolve({ status: error && typeof error.code === 'number' ? error.code : 0, stdout, stderr });
      });
      child.stdin!.end('{ not json');
    });

    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
  }, 30_000);
});
