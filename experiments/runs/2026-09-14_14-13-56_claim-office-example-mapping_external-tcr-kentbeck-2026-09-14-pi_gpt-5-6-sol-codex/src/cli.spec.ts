import { execFileSync, spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const CLI = 'node_modules/.bin/tsx';

function run(input: unknown): string {
  return execFileSync(CLI, ['src/cli.ts'], {
    input: JSON.stringify(input),
    encoding: 'utf8',
  });
}

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes ordered JSON results', () => {
    const output = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }],
        } },
      ],
    });
    expect(JSON.parse(output)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('is directly executable as claim-office', () => {
    const result = execFileSync('src/cli.ts', [], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] }),
      encoding: 'utf8',
    });
    expect(JSON.parse(result)).toEqual({ results: [] });
  });

  it.each([
    [{ op: 'quote', items: [{ type: 'broomstick' }] }, 'Unknown item type'],
    [{ op: 'claim', policy: 0, incident: {
      cause: 'fraud', damages: [{ itemType: 'sword', amount: -200 }],
    } }, 'earlier quote'],
  ])('reports invalid input on stderr without writing results', (step, message) => {
    const result = spawnSync(CLI, ['src/cli.ts'], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [step] }),
      encoding: 'utf8',
    });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(message);
  });

  it('rejects negative damage against an existing policy', () => {
    const result = spawnSync(CLI, ['src/cli.ts'], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: {
            cause: 'fraud', damages: [{ itemType: 'sword', amount: -200 }],
          } },
        ],
      }),
      encoding: 'utf8',
    });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('negative');
  });
});
