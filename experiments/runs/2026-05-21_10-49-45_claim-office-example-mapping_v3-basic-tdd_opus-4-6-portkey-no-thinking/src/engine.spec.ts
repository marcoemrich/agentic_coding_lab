import { describe, it, expect } from 'vitest';
import { runScenario } from './engine.js';
import { execSync } from 'child_process';
import { resolve } from 'path';

const CLI_PATH = resolve(import.meta.dirname, 'cli.ts');

function runCli(input: object): { results: any[] } {
  const output = execSync(`npx tsx ${CLI_PATH}`, {
    input: JSON.stringify(input),
    encoding: 'utf-8',
    cwd: resolve(import.meta.dirname, '..'),
  });
  return JSON.parse(output);
}

function runCliExpectError(input: object): string {
  try {
    execSync(`npx tsx ${CLI_PATH}`, {
      input: JSON.stringify(input),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: resolve(import.meta.dirname, '..'),
    });
    throw new Error('Expected CLI to fail');
  } catch (err: any) {
    if (err.message === 'Expected CLI to fail') throw err;
    return err.stderr?.toString() ?? '';
  }
}

describe('Engine - schema example from prompt', () => {
  it('processes the schema example correctly', () => {
    const results = runScenario({
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
            damages: [
              { itemType: 'amulet', amount: 200 },
            ],
          },
        },
      ],
    });

    // amulet: 60 base
    // first insurance: 10% of 60 = 6
    // loyalty (5 years): -20% of 60 = -12
    // total: 60 + 6 - 12 + 5 = 59
    expect((results[0] as any).premium).toBe(59);

    // claim: 200 - 100 deductible = 100
    // insurance sum = 600, cap = 1200
    expect((results[1] as any).payout).toBe(100);
    expect((results[1] as any).remainingCap).toBe(1100);
  });
});

describe('Engine - newcomer with cursed sword', () => {
  it('premium is 165 G', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect((results[0] as any).premium).toBe(165);
  });
});

describe('Engine - long-standing customer second contract', () => {
  it('premium is 160 G', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect((results[1] as any).premium).toBe(160);
  });
});

describe('Engine - cap exhaustion across claims', () => {
  it('successive claims exhaust the cap', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [{ itemType: 'sword', amount: 1500 }],
          },
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'another dragon attack',
            damages: [{ itemType: 'sword', amount: 1500 }],
          },
        },
      ],
    });

    expect((results[1] as any).payout).toBe(1400);
    expect((results[1] as any).remainingCap).toBe(600);

    expect((results[2] as any).payout).toBe(600);
    expect((results[2] as any).remainingCap).toBe(0);
  });
});

describe('Engine - dragon material + enchantment claim examples', () => {
  it('dragon-material sword, enchantment 9, 1000 G → 400 G', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'battle',
            damages: [{ itemType: 'sword', amount: 1000 }],
          },
        },
      ],
    });
    expect((results[1] as any).payout).toBe(400);
  });

  it('dragon-material sword, enchantment 5, 800 G → 700 G', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'battle',
            damages: [{ itemType: 'sword', amount: 800 }],
          },
        },
      ],
    });
    expect((results[1] as any).payout).toBe(700);
  });

  it('steel sword, enchantment 9, 1000 G → 400 G', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'battle',
            damages: [{ itemType: 'sword', amount: 1000 }],
          },
        },
      ],
    });
    expect((results[1] as any).payout).toBe(400);
  });
});

describe('Engine - dragon-material sword, enchantment 8, 1000 G', () => {
  it('payout is 400 G', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'battle',
            damages: [{ itemType: 'sword', amount: 1000 }],
          },
        },
      ],
    });
    expect((results[1] as any).payout).toBe(400);
  });
});

describe('Engine - empty item list', () => {
  it('premium is 5 G (only processing fee)', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect((results[0] as any).premium).toBe(5);
  });
});

describe('Engine - error cases', () => {
  it('throws on unknown item type in quote', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow();
  });

  it('throws when claim damage references item not in policy', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    })).toThrow();
  });

  it('throws on negative damage amount', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    })).toThrow();
  });

  it('throws when more damages than insured items', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [
              { itemType: 'sword', amount: 200 },
              { itemType: 'sword', amount: 300 },
            ],
          },
        },
      ],
    })).toThrow();
  });
});

describe('Engine - two swords with separate damages', () => {
  it('each damage has its own deductible', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 300 },
            ],
          },
        },
      ],
    });
    // sword 1: 500 - 100 = 400
    // sword 2: 300 - 100 = 200
    // total: 600
    expect((results[1] as any).payout).toBe(600);
  });
});

describe('CLI integration', () => {
  it('processes the schema example via CLI', () => {
    const result = runCli({
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
      ],
    });

    expect(result.results[0].premium).toBe(59);
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(1100);
  });

  it('exits with non-zero on unknown item type', () => {
    const stderr = runCliExpectError({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    });
    expect(stderr).toContain('Error');
  });

  it('exits with non-zero on negative damage', () => {
    const stderr = runCliExpectError({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    });
    expect(stderr).toContain('Error');
  });

  it('exits with non-zero on damage to uninsured item', () => {
    const stderr = runCliExpectError({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(stderr).toContain('Error');
  });
});

describe('Engine - interleaved steps with correct policy reference', () => {
  it('claim references second quote by step index', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        // step 0: quote a sword
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        // step 1: claim against step 0
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 300 }] },
        },
        // step 2: quote an amulet
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] },
        // step 3: claim against step 2 (the amulet policy)
        {
          op: 'claim',
          policy: 2,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    // step 1: sword 300 - 100 deductible = 200
    expect((results[1] as any).payout).toBe(200);
    // step 3: amulet 200 - 100 deductible = 100
    expect((results[3] as any).payout).toBe(100);
    // amulet policy: insurance sum 600, cap 1200, paid 100, remaining 1100
    expect((results[3] as any).remainingCap).toBe(1100);
  });
});

describe('CLI - newcomer cursed sword integration', () => {
  it('returns 165 G via CLI', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0].premium).toBe(165);
  });
});

describe('CLI - long-standing customer second contract', () => {
  it('returns 160 G via CLI', () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1].premium).toBe(160);
  });
});
