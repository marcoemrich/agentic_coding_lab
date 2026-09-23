import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsx = path.join(root, 'node_modules', '.bin', 'tsx');

function run(input: unknown) {
  const result = spawnSync(tsx, [path.join(root, 'src', 'cli.ts')], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('claim-office CLI', () => {
  it('processes the schema example', () => {
    const { status, stdout } = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    // 60 - 12 + 6 + 5 = 59
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('applies the follow-up discount to later quotes', () => {
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const { stdout } = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [cursedSword] },
      ],
    });
    expect(JSON.parse(stdout).results[1]).toEqual({ premium: 160 });
  });

  it('fails on unknown item types without writing results', () => {
    const { status, stdout, stderr } = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/broomstick/);
  });

  it('fails on invalid claims', () => {
    const { status, stderr } = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).not.toBe('');
  });

  it('fails when a claim references a step that is not a quote', () => {
    const { status } = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 3, incident: { cause: 'x', damages: [] } }],
    });
    expect(status).not.toBe(0);
  });

  it('fails on malformed JSON', () => {
    expect(run('not json').status).not.toBe(0);
  });
});
