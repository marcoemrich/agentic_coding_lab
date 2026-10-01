import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runScenario } from './scenario';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: unknown) {
  return spawnSync('npx', ['tsx', cliPath], { input: JSON.stringify(input), encoding: 'utf8' });
}

describe('scenario', () => {
  it('runs quote and claim steps in order', () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'claim', policy: 1, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 1, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    })).toEqual({
      results: [
        { premium: 145 },
        { premium: 160 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  it('rejects claims against non-quote steps', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } }],
    })).toThrow();
  });
});

describe('claim-office CLI', () => {
  it('reads a scenario from stdin and writes results to stdout', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    // 60 - 12 + 6 + 5 = 59
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('fails with an error on stderr for unknown item types', () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/broomstick/);
  });

  it('fails for negative damage amounts', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).not.toBe('');
  });

  it('fails for invalid JSON', () => {
    const result = spawnSync('npx', ['tsx', cliPath], { input: 'not json', encoding: 'utf8' });
    expect(result.status).not.toBe(0);
  });
});
