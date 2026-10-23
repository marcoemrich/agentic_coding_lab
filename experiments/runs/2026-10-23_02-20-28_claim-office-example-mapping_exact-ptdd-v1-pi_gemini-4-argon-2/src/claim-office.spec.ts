import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Base premiums and single main items
  it("should quote empty item list -- premium 5 G (only the processing fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
  it("should quote a regular sword for a newcomer -- premium 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a plain amulet for a newcomer -- premium 71 G (60 G base + 6 G first insurance + 5 G fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a plain staff for a newcomer -- premium 93 G (80 G base + 8 G first insurance + 5 G fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote a plain potion for a newcomer -- premium 49 G (40 G base + 4 G first insurance + 5 G fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 49 }] });
  });

  // Components and building blocks of 3 alike components
  it("should quote 1 rune -- 25 G base premium (33 G total for newcomer after 10% first insurance + 5 G fee, rounded up from 32.5)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote 2 runes -- 50 G base premium (60 G total for newcomer: 50 + 5 first insurance + 5 fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  it("should quote 3 runes -- 60 G base premium with building block applied (71 G total for newcomer: 60 + 6 first insurance + 5 fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote 4 runes -- 100 G base premium with no block as block requires exactly 3 (115 G total for newcomer)", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote 7 runes -- 175 G base premium (198 G total for newcomer: 175 + 17.5 first insurance + 5 fee = 197.5 rounded up to 198 G)", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });
  it("should quote 2 runes + 1 moonstone -- 75 G base premium with no block for different types (88 G total for newcomer: 75 + 7.5 + 5 = 87.5 -> 88 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 88 }] });
  });
  it("should quote 3 runes + 3 moonstones -- 120 G base premium with two separate blocks (137 G total for newcomer: 120 + 12 + 5 = 137 G)", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers and thresholds
  it("should quote newcomer with a cursed sword (steel, enchantment 3) -- premium 165 G (100 G base + 50 G curse + 10 G first insurance + 5 G fee)", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote sword with enchantment 4 -- no high-enchantment surcharge (115 G for uncursed newcomer, 165 G if cursed)", () => {
    const uncursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(uncursedOutput).toEqual({ results: [{ premium: 115 }] });

    const cursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 4, cursed: true }],
        },
      ],
    });
    expect(cursedOutput).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote sword with exactly enchantment 5 -- high-enchantment 30% surcharge applies (145 G for uncursed newcomer; 195 G if cursed with both surcharges)", () => {
    const uncursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(uncursedOutput).toEqual({ results: [{ premium: 145 }] });

    const cursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(cursedOutput).toEqual({ results: [{ premium: 195 }] });
  });
  it("should apply item-specific modifiers only to affected item on multi-item policy -- cursed sword (100 G) and plain amulet (60 G) has 160 G base + 50 G curse = 210 G before policy modifiers and fee (231 G total for newcomer)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });

  // Policy-wide modifiers and customer history
  it("should apply 20% loyalty discount for customer with exactly 2 years with MHPCO -- sword quote yields 95 G (100 G base - 20 G loyalty + 10 G first insurance + 5 G fee)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  it("should apply 15% follow-up contract discount and still apply 10% first insurance on long-standing customer's second contract -- 3 years with MHPCO, second quote with cursed sword (enchantment 7) yields 160 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet" }],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(output.results[1]).toEqual({ premium: 160 });
  });

  // Claim processing: standard reimbursement, deductibles, materials, and enchantment thresholds
  it("should process claim for regular sword (steel, enchantment 3) with damage 500 G -- payout 400 G, remainingCap 1600 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should process claim for damage to a rune (insurance value 250 G) with damage 200 G -- payout 100 G, remainingCap 400 G", () => {
    const output = processScenario({
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
            cause: "drop",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("should process claim for dragon-material sword with enchantment 5 and damage 800 G -- payout 700 G (full reimbursement then deductible)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
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
    expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should process claim for steel sword with enchantment 9 and damage 1000 G -- payout 400 G (50% high-enchantment clause first, then 100 G deductible)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "lightning",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should process claim for dragon-material sword with exactly enchantment 8 and damage 1000 G -- payout 400 G (50% rule wins over dragon material, then deductible)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
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
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should process claim for dragon-material sword with enchantment 9 and damage 1000 G -- payout 400 G (both clauses apply, 50% rule wins, then deductible)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
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
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should round payout down in MHPCO's favor when fractional -- high-enchantment sword with damage 901 G yields 350.5 G rounded down to 350 G payout", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "lightning",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("should not produce negative payout when damage is less than deductible -- regular sword with damage 50 G yields 0 G payout", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // Multiple damages, multiple items of same type, and cap exhaustion
  it("should apply 100 G deductible per damage event -- dragon attack damaging sword (500 G) and amulet (300 G) yields payout 600 G and remainingCap 2600 G (from 3200 G cap)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("should insure two swords with insurance sum 2000 G and cap 4000 G, treating two sword damage entries with separate deductibles -- two 500 G sword damages yield payout 800 G and remainingCap 3200 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("should compute insurance sum and cap from unmodified insurance values across all item types -- staff (800 G), potion (400 G), 3 runes block (750 G), and moonstone (250 G) have insurance sum 2200 G and cap 4400 G, unaffected by curse or block discount", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", cursed: true },
            { type: "potion" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "accident",
            damages: [
              { itemType: "staff", amount: 300 },
              { itemType: "potion", amount: 200 },
              { itemType: "moonstone", amount: 150 },
            ],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 4050 });
  });
  it("should cap total payout across successive claims at twice the insurance sum -- sword (cap 2000 G) with two claims of 1500 G yields first payout 1400 G (remainingCap 600 G) and second payout 600 G (remainingCap 0 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle 1",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle 2",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Error handling and CLI contract
  it("should reject quote containing an item with an unknown type (e.g. broomstick) -- throws Error in domain and CLI exits non-zero writing error to stderr with nothing on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }],
    };
    expect(() => processScenario(scenario)).toThrow(/unknown item type/i);

    const cliResult = spawnSync(
      process.execPath,
      ["--import", "tsx", "src/cli.ts"],
      {
        input: JSON.stringify(scenario),
        encoding: "utf8",
      },
    );
    expect(cliResult.status).not.toBe(0);
    expect(cliResult.stdout).toBe("");
    expect(cliResult.stderr.trim().length).toBeGreaterThan(0);
  });
  it("should reject claim referencing an item not insured by the policy or unknown type -- throws Error in domain and CLI exits non-zero writing error to stderr", () => {
    const uninsuredScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    expect(() => processScenario(uninsuredScenario)).toThrow(
      /not covered by policy/i,
    );

    const unknownTypeScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    };
    expect(() => processScenario(unknownTypeScenario)).toThrow(
      /not covered by policy|unknown item type/i,
    );

    const cliResult = spawnSync(
      process.execPath,
      ["--import", "tsx", "src/cli.ts"],
      {
        input: JSON.stringify(uninsuredScenario),
        encoding: "utf8",
      },
    );
    expect(cliResult.status).not.toBe(0);
    expect(cliResult.stdout).toBe("");
    expect(cliResult.stderr.trim().length).toBeGreaterThan(0);
  });
  it("should reject claim with more damage entries of a given type than the policy covers (e.g. two sword damages when one sword insured) -- throws Error in domain and CLI exits non-zero writing error to stderr", () => {
    const excessDamageScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    expect(() => processScenario(excessDamageScenario)).toThrow(
      /not covered by policy|more damages than insured/i,
    );

    const cliResult = spawnSync(
      process.execPath,
      ["--import", "tsx", "src/cli.ts"],
      {
        input: JSON.stringify(excessDamageScenario),
        encoding: "utf8",
      },
    );
    expect(cliResult.status).not.toBe(0);
    expect(cliResult.stdout).toBe("");
    expect(cliResult.stderr.trim().length).toBeGreaterThan(0);
  });
  it("should reject claim containing a damage entry with negative amount (e.g. -200) -- throws Error in domain and CLI exits non-zero writing error to stderr", () => {
    const negativeDamageScenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fraud",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    expect(() => processScenario(negativeDamageScenario)).toThrow(
      /negative|invalid damage amount/i,
    );

    const cliResult = spawnSync(
      process.execPath,
      ["--import", "tsx", "src/cli.ts"],
      {
        input: JSON.stringify(negativeDamageScenario),
        encoding: "utf8",
      },
    );
    expect(cliResult.status).not.toBe(0);
    expect(cliResult.stdout).toBe("");
    expect(cliResult.stderr.trim().length).toBeGreaterThan(0);
  });
  it("should execute CLI end-to-end reading scenario JSON from stdin and writing results JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
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

    const cliResult = spawnSync(
      process.execPath,
      ["--import", "tsx", "src/cli.ts"],
      {
        input: JSON.stringify(scenario),
        encoding: "utf8",
      },
    );
    expect(cliResult.status).toBe(0);
    expect(cliResult.stderr).toBe("");
    expect(JSON.parse(cliResult.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
