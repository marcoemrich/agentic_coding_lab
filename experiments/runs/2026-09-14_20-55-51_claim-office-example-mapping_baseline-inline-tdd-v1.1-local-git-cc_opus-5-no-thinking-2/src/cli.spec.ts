import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const CLI = new URL('./cli.ts', import.meta.url).pathname;

async function cli(input: unknown): Promise<{ code: number; stdout: string; stderr: string }> {
  const child = run('npx', ['tsx', CLI], { encoding: 'utf8' });
  child.child.stdin?.end(JSON.stringify(input));
  try {
    const { stdout, stderr } = await child;
    return { code: 0, stdout, stderr };
  } catch (err) {
    const e = err as { code?: number; stdout?: string; stderr?: string };
    return { code: e.code ?? 1, stdout: e.stdout ?? '', stderr: e.stderr ?? '' };
  }
}

describe('claim-office CLI', () => {
  it('writes results as JSON to stdout', async () => {
    const { code, stdout } = await cli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('exits non-zero with a stderr message on an unknown item type', async () => {
    const { code, stdout, stderr } = await cli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  });

  it('exits non-zero on a negative damage amount', async () => {
    const { code, stderr } = await cli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('exits non-zero on malformed JSON input', async () => {
    const child = run('npx', ['tsx', CLI], { encoding: 'utf8' });
    child.child.stdin?.end('not json');
    await expect(child).rejects.toMatchObject({ code: expect.any(Number) });
  });
});
