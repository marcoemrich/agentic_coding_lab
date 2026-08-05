import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";

interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): Promise<CliResult> {
  return new Promise((resolve) => {
    const proc = spawn("node_modules/.bin/tsx", ["src/cli.ts"], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d));
    proc.stderr.on("data", (d) => (stderr += d));
    proc.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
    proc.on("error", (err) => resolve({ code: 1, stdout, stderr: String(err) }));
    proc.stdin.write(JSON.stringify(scenario));
    proc.stdin.end();
  });
}

function quoteScenario(
  items: unknown[],
  yearsWithMHPCO = 0,
  extraSteps: unknown[] = [],
) {
  return {
    customer: { yearsWithMHPCO },
    steps: [...extraSteps, { op: "quote", items }],
  };
}

describe("Claim Office - quote: base premiums", () => {
  it("empty item list -> premium 5 G (only the processing fee)", async () => {
    const result = await runCli(quoteScenario([]));
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword, new customer -> 100 base + 10 first insurance + 5 fee = 115 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("amulet/staff/potion base premiums -> 71 / 93 / 49 G (base + 10% first insurance + 5 fee)", async () => {
    const cases: [string, number][] = [
      ["amulet", 71],
      ["staff", 93],
      ["potion", 49],
    ];
    for (const [type, expected] of cases) {
      const result = await runCli(quoteScenario([{ type }]));
      expect(result.code).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: expected }] });
    }
  });
  it("2 runes -> 50 G base premium -> 50 + 5 + 5 = 60 G total", async () => {
    const result = await runCli(quoteScenario([{ type: "rune" }, { type: "rune" }]));
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> block premium 60 G base -> 60 + 6 + 5 = 71 G total", async () => {
    const result = await runCli(
      quoteScenario([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> no block, 100 G base -> 100 + 10 + 5 = 115 G total", async () => {
    const result = await runCli(
      quoteScenario(Array.from({ length: 4 }, () => ({ type: "rune" }))),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> 175 G base -> 175 + 17.5 + 5 = 197.5 -> rounded up to 198 G", async () => {
    const result = await runCli(
      quoteScenario(Array.from({ length: 7 }, () => ({ type: "rune" }))),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> no block (different types), 75 G base -> 75 + 7.5 + 5 = 87.5 -> 88 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> two separate blocks, 120 G base -> 120 + 12 + 5 = 137 G", async () => {
    const result = await runCli(
      quoteScenario([
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 137 }] });
  });
});

describe("Claim Office - quote: item-specific modifiers", () => {
  it("cursed sword -> 100 + 50 curse + 10 first insurance + 5 fee = 165 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5 -> high-enchantment surcharge: 100 + 30 + 10 + 5 = 145 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "sword", material: "steel", enchantment: 5, cursed: false }]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> 115 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "sword", material: "steel", enchantment: 4, cursed: false }]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 7 -> both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 195 }] });
  });
  it("cursed sword + plain amulet -> curse applies only to sword: 160 base + 50 + 16 + 5 = 231 G", async () => {
    const result = await runCli(
      quoteScenario([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 231 }] });
  });
});

describe("Claim Office - quote: policy-wide modifiers", () => {
  it("customer with exactly 2 years -> loyalty discount applies: 100 - 20 + 10 + 5 = 95 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 2),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year -> no loyalty discount -> 115 G", async () => {
    const result = await runCli(
      quoteScenario([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 1),
    );
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote in scenario -> 15% follow-up discount: 100 + 10 - 15 + 5 = 100 G", async () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  it("long-standing customer's second contract, cursed sword enchant 7 -> 160 G (first insurance still applies)", async () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = await runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 175 }, { premium: 160 }],
    });
  });
});

describe("Claim Office - claim: standard reimbursement", () => {
  it("steel sword enchant 3, damage 500 -> payout 400, remainingCap 1600", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune damage 200 -> payout 100 (no special clause for components)", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("dragon attack damages sword 500 and amulet 300 -> deductible per item, payout 600", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("enchant 8 steel sword, damage 901 -> 450.5 - 100 = 350.5 -> rounded down to 350", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
});

describe("Claim Office - claim: special clauses", () => {
  it("dragon-material sword enchant exactly 8, damage 1000 -> 50% rule wins: payout 400", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword enchant 9, damage 1000 -> both clauses, 50% wins: payout 400", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    const results = JSON.parse(result.stdout).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchant 5, damage 800 -> full reimbursement: payout 700", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    const results = JSON.parse(result.stdout).results;
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchant 9, damage 1000 -> 50% then deductible: payout 400", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    const results = JSON.parse(result.stdout).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("Claim Office - claim: caps and multiple items", () => {
  it("two swords -> insurance sum 2000, cap 4000; two sword damage entries each get own deductible", async () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.code).toBe(0);
    const results = JSON.parse(result.stdout).results;
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("cursed sword -> cap 2000 based on unmodified insurance value (modifiers do not raise cap)", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("sword + 3 runes (block) -> insurance sum 1750, cap 3500 (block affects premium only)", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("cap exhaustion: two successive claims of 1500 -> payouts 1400 then 600, remainingCap 600 then 0", async () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claim,
        claim,
      ],
    });
    expect(result.code).toBe(0);
    const results = JSON.parse(result.stdout).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("Claim Office - error handling", () => {
  it("quote with unknown item type (broomstick) -> non-zero exit, stderr error, no results on stdout", async () => {
    const result = await runCli(quoteScenario([{ type: "broomstick" }]));
    expect(result.code).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim damage entry for item not in policy -> non-zero exit, stderr error", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("more damage entries of a type than the policy covers -> non-zero exit", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("damage entry with negative amount -> non-zero exit, stderr error", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(result.code).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
});

describe("Claim Office - schema example end-to-end", () => {
  it("amulet quote (5 years) then fire claim of 200 -> premium 59, payout 100, remainingCap 1100", async () => {
    const result = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
