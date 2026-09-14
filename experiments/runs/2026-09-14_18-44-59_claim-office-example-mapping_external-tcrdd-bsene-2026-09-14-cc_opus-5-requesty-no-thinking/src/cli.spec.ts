import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

async function runCli(input: unknown): Promise<{ code: number; stdout: string; stderr: string }> {
  const child = execFileAsync('npx', ['tsx', CLI]);
  child.child.stdin?.end(JSON.stringify(input));
  try {
    const { stdout, stderr } = await child;
    return { code: 0, stdout, stderr };
  } catch (error) {
    const failure = error as { code?: number; stdout?: string; stderr?: string };
    return { code: failure.code ?? 1, stdout: failure.stdout ?? '', stderr: failure.stderr ?? '' };
  }
}

describe('claim-office CLI', () => {
  it('writes the scenario results as JSON to stdout', async () => {
    const result = await runCli({
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
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);

  it('fails with a non-zero exit code and a stderr message on an unknown item type', async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe('');
  }, 30000);

  it('rejects a claim on an item the policy does not cover', async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] },
        },
      ],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
    expect(result.stdout).toBe('');
  }, 30000);

  it('rejects a negative damage amount', async () => {
    const result = await runCli({
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
    expect(result.code).not.toBe(0);
    expect(result.stderr).toMatch(/negative/);
    expect(result.stdout).toBe('');
  }, 30000);

  it('quotes an empty item list at the processing fee', async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  }, 30000);
});
