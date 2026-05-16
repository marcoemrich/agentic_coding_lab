import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(__dirname, 'cli.ts');

function runCli(input: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync('npx', ['tsx', cliPath], {
    input,
    encoding: 'utf-8',
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

describe('cli', () => {
  it('runs the schema example', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }
      ]
    });
    const r = runCli(input);
    expect(r.status).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty('premium');
    expect(out.results[1]).toMatchObject({ payout: 100, remainingCap: 1100 });
  });

  it('exits non-zero on unknown item type', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }]
    });
    const r = runCli(input);
    expect(r.status).not.toBe(0);
    expect(r.stderr.length).toBeGreaterThan(0);
  });

  it('exits non-zero on negative damage', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
        { op: 'claim', policy: 0, incident: { damages: [{ itemType: 'sword', amount: -200 }] } }
      ]
    });
    const r = runCli(input);
    expect(r.status).not.toBe(0);
  });
});
