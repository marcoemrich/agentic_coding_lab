import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));
const tsx = path.resolve(path.dirname(cli), '..', 'node_modules', '.bin', 'tsx');

function run(input: unknown): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = execFile(tsx, [cli], (error, stdout, stderr) => {
      resolve({ code: error ? ((error as { code?: number }).code ?? 1) : 0, stdout, stderr });
    });
    child.stdin!.end(typeof input === 'string' ? input : JSON.stringify(input));
  });
}

describe('claim-office CLI', () => {
  it('writes results for the schema example', async () => {
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
  });

  it('exits non-zero with a stderr message for an unknown item type', async () => {
    const { code, stdout, stderr } = await run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe('');
  });

  it('exits non-zero when a damaged item is not insured', async () => {
    const { code, stdout, stderr } = await run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
    expect(stdout).toBe('');
  });

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
  });

  it('exits non-zero for more sword damages than insured swords', async () => {
    const { code } = await run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 300 }, { itemType: 'sword', amount: 300 }] },
        },
      ],
    });
    expect(code).not.toBe(0);
  });

  it('exits non-zero for malformed JSON', async () => {
    const { code, stderr } = await run('{not json');
    expect(code).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('prices the newcomer integration example at 165 G', async () => {
    const { stdout } = await run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    expect(JSON.parse(stdout).results[0]).toEqual({ premium: 165 });
  });
});
