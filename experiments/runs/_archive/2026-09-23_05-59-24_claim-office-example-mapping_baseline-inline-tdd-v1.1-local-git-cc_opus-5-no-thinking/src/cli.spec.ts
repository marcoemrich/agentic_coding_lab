import { describe, it, expect } from 'vitest';
import { execFile, ExecFileException } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

const exitCodeOf = (error: ExecFileException | null): number =>
  error ? (typeof error.code === 'number' ? error.code : 1) : 0;

function runCli(input: unknown): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = execFile(
      'node_modules/.bin/tsx',
      [cliPath],
      (error, stdout, stderr) => {
        resolve({ code: exitCodeOf(error), stdout, stderr });
      },
    );
    child.stdin!.end(JSON.stringify(input));
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', async () => {
    const { code, stdout } = await runCli({
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
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 20000);

  it('exits non-zero with an error on stderr for an unknown item type', async () => {
    const { code, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  }, 20000);

  it('exits non-zero for a negative damage amount', async () => {
    const { code, stderr } = await runCli({
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
    expect(stderr).toMatch(/negative/i);
  }, 20000);

  it('exits non-zero for malformed JSON input', async () => {
    const child = await new Promise<{ code: number; stderr: string }>((resolve) => {
      const proc = execFile('node_modules/.bin/tsx', [cliPath], (error, _stdout, stderr) => {
        resolve({ code: exitCodeOf(error), stderr });
      });
      proc.stdin!.end('not json');
    });
    expect(child.code).not.toBe(0);
    expect(child.stderr).not.toBe('');
  }, 20000);
});

describe('claim-office CLI, policy coverage', () => {
  it('rejects two sword damages when only one sword is insured', async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/sword/);
  }, 20000);

  it('settles both swords when two swords are insured', async () => {
    const { code, stdout } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  }, 20000);
});
