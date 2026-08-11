import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

interface RunResult {
  stdout: string;
  stderr: string;
  code: number;
}

async function runCli(input: unknown): Promise<RunResult> {
  const child = execFileAsync('npx', ['tsx', CLI]);
  child.child.stdin?.end(JSON.stringify(input));
  try {
    const { stdout, stderr } = await child;
    return { stdout, stderr, code: 0 };
  } catch (error) {
    const failure = error as { stdout: string; stderr: string; code?: number };
    return {
      stdout: failure.stdout,
      stderr: failure.stderr,
      code: failure.code ?? 1,
    };
  }
}

describe('claim-office CLI', () => {
  it('quotes and claims through a scenario', async () => {
    const { stdout, code } = await runCli({
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

    expect(code).toBe(0);
    // 60 base + 6 first insurance − 12 loyalty + 5 fee = 59
    // payout 200 − 100 deductible = 100; cap 1200 − 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('applies the follow-up discount from the second quote on', async () => {
    const { stdout } = await runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });

    const { results } = JSON.parse(stdout);
    expect(results[1]).toEqual({ premium: 160 });
  });

  it('fails on an unknown item type without writing results', async () => {
    const { stdout, stderr, code } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });

    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  });

  it('fails on a damage to an uninsured item', async () => {
    const { code, stderr } = await runCli({
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

    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('fails on a negative damage amount', async () => {
    const { code } = await runCli({
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

    expect(code).not.toBe(0);
  });
});
