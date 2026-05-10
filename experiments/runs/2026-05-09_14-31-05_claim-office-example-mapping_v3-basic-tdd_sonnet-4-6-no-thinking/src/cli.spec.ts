import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI = join(__dirname, '../src/cli.ts');

function runCLI(input: string): { stdout: string; stderr: string; status: number } {
  const result = spawnSync(process.execPath, ['--import', 'tsx/esm', CLI], {
    input,
    encoding: 'utf8',
    env: { ...process.env },
  });
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    status: result.status ?? 1,
  };
}

describe('CLI – schema example', () => {
  it('returns premium and payout for the schema example', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    const { stdout, status } = runCLI(input);
    expect(status).toBe(0);
    const output = JSON.parse(stdout);
    expect(output.results[0].premium).toBe(59);
    expect(output.results[1].payout).toBe(100);
    expect(output.results[1].remainingCap).toBe(1100);
  });
});

describe('CLI – integration examples', () => {
  it('newcomer with cursed sword → 165 G', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0, contractCount: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    const { stdout, status } = runCLI(input);
    expect(status).toBe(0);
    expect(JSON.parse(stdout).results[0].premium).toBe(165);
  });

  it('long-standing second contract cursed high-ench sword → 160 G', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 3, contractCount: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] }],
    });
    const { stdout, status } = runCLI(input);
    expect(status).toBe(0);
    expect(JSON.parse(stdout).results[0].premium).toBe(160);
  });
});

describe('CLI – error cases', () => {
  it('unknown item type exits non-zero and writes to stderr', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick', material: 'wood', enchantment: 0, cursed: false }] }],
    });
    const { stdout, stderr, status } = runCLI(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe('');
  });

  it('damage to uncovered item exits non-zero', () => {
    // First get a policy (sword), then claim on amulet
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    const { stderr, status } = runCLI(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it('negative damage amount exits non-zero', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    });
    const { stderr, status } = runCLI(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});

describe('CLI – cap tracking across multiple claims', () => {
  it('tracks remaining cap across successive claims', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    const { stdout, status } = runCLI(input);
    expect(status).toBe(0);
    const output = JSON.parse(stdout);
    expect(output.results[1].payout).toBe(1400);
    expect(output.results[1].remainingCap).toBe(600);
    expect(output.results[2].payout).toBe(600);
    expect(output.results[2].remainingCap).toBe(0);
  });
});
