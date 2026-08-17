import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));
const TSX = fileURLToPath(
  new URL('../node_modules/.bin/tsx', import.meta.url),
);

interface RunResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const child = execFile(
      TSX,
      [CLI],
      { cwd: path.dirname(CLI) },
      (error, stdout, stderr) => {
        resolve({
          code: error && typeof error.code === 'number' ? error.code : error ? 1 : 0,
          stdout,
          stderr,
        });
      },
    );
    child.stdin!.write(input);
    child.stdin!.end();
  });
}

describe('CLI integration', () => {
  it('processes a quote+claim scenario and writes results to stdout', async () => {
    const input = JSON.stringify({
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
    const { code, stdout } = await runCli(input);
    expect(code).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });

  it('empty item list → premium 5', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    const { code, stdout } = await runCli(input);
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it('unknown item type in quote → non-zero exit, stderr, no stdout results', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    const { code, stdout, stderr } = await runCli(input);
    expect(code).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe('');
  });

  it('claim on item not in policy → non-zero exit + stderr', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    const { code, stderr } = await runCli(input);
    expect(code).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it('negative damage amount → non-zero exit + stderr', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    });
    const { code, stderr } = await runCli(input);
    expect(code).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it('more sword damages than covered → non-zero exit', async () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'x',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    const { code } = await runCli(input);
    expect(code).not.toBe(0);
  });
});
