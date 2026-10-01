import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

function run(input: unknown): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = execFile('npx', ['tsx', CLI], (error, stdout, stderr) => {
      resolve({ code: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
    });
    child.stdin!.end(typeof input === 'string' ? input : JSON.stringify(input));
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', async () => {
    const { code, stdout } = await run({
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
  }, 30000);

  it('exits non-zero and writes to stderr for an unknown item type, with no results on stdout', async () => {
    const { code, stdout, stderr } = await run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
    expect(stdout).not.toContain('results');
  }, 30000);

  it('exits non-zero for a negative damage amount', async () => {
    const { code, stderr } = await run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  }, 30000);

  it('exits non-zero for malformed JSON', async () => {
    const { code, stderr } = await run('{ not json');
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  }, 30000);
});
