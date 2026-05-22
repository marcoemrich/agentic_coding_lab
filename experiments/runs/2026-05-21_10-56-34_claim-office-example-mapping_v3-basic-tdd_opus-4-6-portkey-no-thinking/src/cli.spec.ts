import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { resolve } from 'path';

const CLI_PATH = resolve(__dirname, 'cli.ts');

function runCli(input: object): any {
  const result = execSync(`npx tsx ${CLI_PATH}`, {
    input: JSON.stringify(input),
    encoding: 'utf-8',
    timeout: 10000,
  });
  return JSON.parse(result);
}

function runCliRaw(input: string): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execSync(`npx tsx ${CLI_PATH}`, {
      input,
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout, stderr: '', status: 0 };
  } catch (err: any) {
    return { stdout: err.stdout || '', stderr: err.stderr || '', status: err.status || 1 };
  }
}

describe('CLI', () => {
  it('processes schema example from prompt', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
          ]
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'amulet', amount: 200 }
            ]
          }
        }
      ]
    });
    expect(result.results).toHaveLength(2);
    expect(result.results[0].premium).toBe(59);
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(1100);
  });

  it('exits with non-zero status for unknown item type', () => {
    const { status, stderr } = runCliRaw(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }]
    }));
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it('exits with non-zero status for negative damage', () => {
    const { status, stderr } = runCliRaw(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }
      ]
    }));
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it('newcomer cursed sword → 165 G', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true }
      ]}]
    });
    expect(result.results[0].premium).toBe(165);
  });

  it('long-standing customer second contract → 160 G', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 7, cursed: true }
        ]}
      ]
    });
    expect(result.results[1].premium).toBe(160);
  });
});
