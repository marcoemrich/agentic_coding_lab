import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '..');
const TSX = resolve(ROOT, 'node_modules/.bin/tsx');
const CLI = resolve(ROOT, 'src/cli.ts');

function runCli(input: string): { stdout: string; stderr: string; status: number | null } {
  const proc = spawnSync(TSX, [CLI], {
    input,
    encoding: 'utf8',
  });
  return { stdout: proc.stdout, stderr: proc.stderr, status: proc.status };
}

describe('cli', () => {
  it('runs example 1 from the prompt', () => {
    const stdin = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    const { stdout, status } = runCli(stdin);
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed).toEqual({ results: [{ premium: 115 }] });
  });

  it('runs example 2 from the prompt', () => {
    const stdin = JSON.stringify({
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
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'spell mishap',
            damages: [{ itemType: 'amulet', amount: 250 }],
          },
        },
      ],
    });
    const { stdout, status } = runCli(stdin);
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results.length).toBe(3);
    expect(parsed.results[0]).toEqual({ premium: 58 });
    expect(parsed.results[1]).toHaveProperty('payout');
    expect(parsed.results[1]).toHaveProperty('remainingCap');
    expect(parsed.results[2]).toHaveProperty('payout');
    expect(parsed.results[2]).toHaveProperty('remainingCap');
  });
});
