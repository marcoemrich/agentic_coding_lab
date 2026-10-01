import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runScenario } from './scenario';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: string) {
  return spawnSync('npx', ['tsx', cliPath], { input, encoding: 'utf8' });
}

describe('runScenario', () => {
  it('processes quotes and claims in order', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    // 60 − 12 loyalty + 6 first insurance + 5 fee = 59
    expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('applies the follow-up discount to the second quote', () => {
    const item = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: 'quote', items: [item] }, { op: 'quote', items: [item] }],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('rejects claims against a step that is not a quote', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }],
    })).toThrow();
  });
});

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    };
    const { status, stdout } = runCli(JSON.stringify(scenario));
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  it('exits non-zero with stderr message for unknown item types', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] };
    const { status, stdout, stderr } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/broomstick/);
  });

  it('exits non-zero for malformed JSON', () => {
    const { status, stdout } = runCli('not json');
    expect(status).not.toBe(0);
    expect(stdout).toBe('');
  });
});
