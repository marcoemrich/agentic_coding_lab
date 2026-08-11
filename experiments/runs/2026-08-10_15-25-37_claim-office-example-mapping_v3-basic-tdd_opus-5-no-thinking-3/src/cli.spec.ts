import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

const runCli = (input: unknown): Promise<CliResult> =>
  new Promise((resolve) => {
    const child = execFile(
      'node_modules/.bin/tsx',
      [CLI],
      (error, stdout, stderr) => {
        resolve({ code: error ? (error as { code?: number }).code ?? 1 : 0, stdout, stderr });
      },
    );
    child.stdin!.end(JSON.stringify(input));
  });

const resultsOf = async (input: unknown): Promise<unknown[]> => {
  const { code, stdout, stderr } = await runCli(input);
  expect(stderr, stderr).toBe('');
  expect(code).toBe(0);
  return JSON.parse(stdout).results;
};

describe('claim-office CLI', () => {
  it('processes the schema example scenario', async () => {
    const results = await resultsOf({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    // 60 base - 12 loyalty + 6 first insurance = 54 + 5 fee = 59
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('counts quote steps to apply the follow-up contract discount', async () => {
    const results = await resultsOf({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });

    // first contract: 100 base + 50 curse - 20 loyalty + 10 first = 140 + 5 = 145
    expect(results).toEqual([{ premium: 145 }, { premium: 160 }]);
  });

  it('keeps a separate cap per policy', async () => {
    const results = await resultsOf({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 1, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] } },
      ],
    });

    expect(results[2]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[3]).toEqual({ payout: 200, remainingCap: 1000 });
  });

  it('fails with a message on stderr for an unknown item type', async () => {
    const { code, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe('');
  });

  it('fails when a claim references an uninsured item', async () => {
    const { code, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] } },
      ],
    });

    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
    expect(stdout).toBe('');
  });

  it('fails on a negative damage amount', async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });

    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });
});
