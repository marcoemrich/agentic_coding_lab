import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const tsx = path.resolve(dir, '../node_modules/.bin/tsx');

function run(input: string) {
  return spawnSync(tsx, [path.join(dir, 'cli.ts')], { input, encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  it('writes results JSON to stdout', () => {
    const res = run(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
      }),
    );
    expect(res.status).toBe(0);
    expect(JSON.parse(res.stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  it('exits non-zero with an error on stderr for invalid scenarios', () => {
    const res = run(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      }),
    );
    expect(res.status).not.toBe(0);
    expect(res.stdout).toBe('');
    expect(res.stderr).toMatch(/amount/);
  });

  it('exits non-zero for invalid JSON', () => {
    const res = run('not json');
    expect(res.status).not.toBe(0);
    expect(res.stdout).toBe('');
  });
});
