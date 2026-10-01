import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('./cli.ts', import.meta.url));

function runCli(input: string) {
  return spawnSync('npx', ['tsx', cliPath], { input, encoding: 'utf8' });
}

describe('claim-office CLI', () => {
  test('writes results for a quote and a claim as JSON to stdout', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };
    const result = runCli(JSON.stringify(scenario));
    // premium: 60 - 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 - 100; cap 1200 - 100
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  test('rejects an unknown item type with a non-zero exit, an stderr message and no stdout', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] };
    const result = runCli(JSON.stringify(scenario));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stderr).not.toMatch(/at runScenario/);
    expect(result.stdout).toBe('');
  });
});
