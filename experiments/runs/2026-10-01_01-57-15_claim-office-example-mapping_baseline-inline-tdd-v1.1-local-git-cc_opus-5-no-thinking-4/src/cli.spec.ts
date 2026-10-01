import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: unknown): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = execFile('npx', ['tsx', CLI], (error, stdout, stderr) => {
      resolve({ code: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
    });
    child.stdin!.end(JSON.stringify(input));
  });
}

describe('the claim-office CLI', () => {
  it('writes the results of a scenario to stdout', async () => {
    const { code, stdout } = await runCli({
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
  }, 30_000);

  it('exits non-zero and describes the error on stderr for an unknown item type', async () => {
    const { code, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  }, 30_000);

  it('exits non-zero for a damage that the policy does not cover', async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
  }, 30_000);

  it('exits non-zero for a negative damage amount', async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/-200/);
  }, 30_000);
});
