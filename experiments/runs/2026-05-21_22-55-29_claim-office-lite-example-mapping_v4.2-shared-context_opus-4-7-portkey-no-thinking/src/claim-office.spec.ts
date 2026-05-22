import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

// Unit-level tests exercise runScenario directly. CLI-level tests at the
// bottom spawn `tsx src/cli.ts` and verify the stdin/stdout/exit-code
// surface end-to-end. See example-mapping/claim-office.md for the
// shared spec, field-name contract, and per-test rationale.

describe("MHPCO Claim Office — quote pricing", () => {
  it("empty items quote: newcomer with no items → premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it("single plain amulet, yearsWithMHPCO 0 → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("single plain sword, yearsWithMHPCO 0 → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("newcomer with cursed sword (steel, enchantment 3) → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it("newcomer with plain sword at exactly enchantment 5 → premium 145 G (100 base + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  it("newcomer with plain sword at enchantment 4 (below threshold) → premium 115 G (no high-enchantment surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("newcomer with cursed sword at exactly enchantment 5 → premium 195 G (100 base + 50 curse + 30 high-ench + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  it("long-standing customer (yearsWithMHPCO 3), single plain sword, only quote → premium 95 G (100 base + 10 first-insurance − 20 loyalty + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("customer at exactly yearsWithMHPCO 2 (loyalty threshold), single plain sword → premium 95 G (loyalty applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("long-standing customer's second quote: cursed sword (steel, enchantment 7) → premium 160 G (100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first-insurance − 15 follow-up + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it("multi-item policy, newcomer: cursed sword + plain amulet → premium 231 G (policy base 160 + 50 curse + 16 first-insurance (10% of 160) + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  it("components: 2 runes, newcomer → premium 60 G (50 base + 5 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  it("components: 3 runes (block applies), newcomer → premium 71 G (60 block base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("components: 4 runes (no block — exactly 3 required), newcomer → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("components: 7 runes, newcomer → premium 198 G (175 base + 17.5 first + 5 fee = 197.5, rounded UP to 198 in MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  it("components: 2 runes + 1 moonstone (different types, no block), newcomer → premium 88 G (75 base + 7.5 first + 5 fee = 87.5, rounded UP to 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  it("components: 3 runes + 3 moonstones (two separate blocks), newcomer → premium 137 G (120 base + 12 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  it("two swords in a single quote, newcomer → premium 225 G (200 base + 20 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });
});

describe("MHPCO Claim Office — claim payouts", () => {
  it("standard claim: steel sword enchantment 3, damage 500 G → payout 400 G (full reimbursement − 100 G deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });

  it("component claim: rune (insurance 250 G), damage 200 G → payout 100 G (full reimbursement − 100 G deductible; no special clause applies to components)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "theft",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100 });
  });

  it("high-enchantment only: steel sword enchantment 9, damage 1000 G → payout 400 G (50% clause then deductible: 500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });

  it("dragon-material only: dragon sword enchantment 5, damage 800 G → payout 700 G (full reimbursement then deductible: 800 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700 });
  });

  it("both clauses apply (50% wins): dragon sword enchantment 9, damage 1000 G → payout 400 G (1000 × 0.5 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });

  it("enchantment exactly 8 threshold: dragon sword enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause kicks in: 500 − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });

  it("deductible applied per damage event: dragon attack on sword (damage 500) + amulet (damage 300) → payout 600 G ((500−100) + (300−100))", () => {
    const result = runScenario({
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
    expect(result.results[1]).toEqual({ payout: 600 });
  });

  it("two swords insured, claim with two sword damages (steel ench 3): damages 400 + 300 → payout 500 G (each damage handled independently with own deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 400 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 500 });
  });

  it("payout rounded DOWN in MHPCO's favor: dragon sword enchantment 8, damage 901 G → payout 350 G (901 × 0.5 − 100 = 350.5, rounded down to 350)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350 });
  });
});

describe("MHPCO Claim Office — CLI (stdin/stdout/exit code)", () => {
  it("happy path: schema example scenario on stdin → results JSON on stdout with same length/order, exit code 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("payout");
  });

  it("quote with unknown item type (e.g. broomstick) → CLI exits non-zero, writes error description to stderr, writes no results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });

  it("claim references an item not in the policy (amulet damage on a sword-only policy) → CLI exits non-zero, writes error description to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });

  it("claim with damage entry whose itemType is unknown → CLI exits non-zero, writes error description to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });

  it("claim with negative damage amount (e.g. amount: -200) → CLI exits non-zero, writes error description to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });

  it("claim contains more sword damages than swords insured → CLI exits non-zero, whole claim rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });

  it("end-to-end scenario with two quotes and a claim referencing policy index 0: follow-up −15 % discount applies to the second quote, results array preserves order and indices", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(3);
    expect(output.results[0]).toEqual({ premium: 115 });
    expect(output.results[1]).toEqual({ payout: 400 });
    expect(output.results[2]).toEqual({ premium: 100 });
  });
});
