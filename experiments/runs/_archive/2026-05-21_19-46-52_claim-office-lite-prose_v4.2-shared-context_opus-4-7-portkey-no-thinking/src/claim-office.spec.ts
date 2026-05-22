import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

// The implementation must expose a function that takes a parsed scenario
// object (matching the input JSON schema) and returns the results object
// (matching the output JSON schema). See example-mapping/claim-office.md
// for the binding interface contract and per-test rationale.

describe("MHPCO Claim Office — quote", () => {
  it("single plain sword, customer 0 years (first insurance) → premium 115 (100 × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("single plain amulet, customer 0 years (first insurance) → premium 71 (60 × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("single plain staff, customer 0 years (first insurance) → premium 93 (80 × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  it("single plain potion, customer 0 years (first insurance) → premium 49 (40 × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  it("single cursed sword, customer 0 years → premium 170 (100 × 1.50 × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });

  it("single sword with enchantment 5, customer 0 years → premium 148 (100 × 1.30 × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });

  it("single sword cursed AND enchantment 5, customer 0 years → premium 220 (ceil(100 × 1.50 × 1.30 × 1.10) + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 5 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 220 }] });
  });

  it("single plain sword, customer 2 years (loyal + first insurance) → premium 93 (100 × 0.80 × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  it("single plain amulet, customer 5 years (loyal + first insurance) → premium 58 (ceil(60 × 0.80 × 1.10) + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 58 }] });
  });

  it("single rune, customer 0 years (first insurance) → premium 33 (ceil(25 × 1.10) + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  it("three alike runes form one building block, customer 0 years → premium 71 (60 × 1.10 + 5)", () => {
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

  it("four runes = one building block + one single, customer 0 years → premium 99 (ceil((60 + 25) × 1.10) + 5)", () => {
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
    expect(result).toEqual({ results: [{ premium: 99 }] });
  });

  it("three runes + three moonstones form two building blocks, customer 0 years → premium 137 ((60 + 60) × 1.10 + 5)", () => {
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

  it("sword + amulet in one quote, customer 0 years → premium 181 ((100 + 60) × 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });

  it("two-quote scenario for customer 0 years: first sword quote = 115, second amulet quote = 56 (60 × 0.85 + 5, post-first contract discount)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
        {
          op: "quote",
          items: [{ type: "amulet" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 56 }] });
  });
});

describe("MHPCO Claim Office — claim", () => {
  it("claim on plain amulet (ench 2, not dragon) damaged by fire for 200 → payout 0 (item does not qualify for reimbursement)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", enchantment: 2 }],
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
    });
    expect(result).toEqual({ results: [{ premium: 58 }, { payout: 0 }] });
  });

  it("claim on dragon-material sword for 500 damage → payout 400 (500 at 100% minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 400 }],
    });
  });

  it("claim on sword with enchantment 9 for 500 damage → payout 150 (500 × 0.5 = 250 minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 9 }],
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
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 150 }],
    });
  });

  it("claim on sword with enchantment 9 for 150 damage → payout 0 (150 × 0.5 = 75 minus 100 floored at 0)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 150 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 0 }],
    });
  });

  it("claim on event with dragon sword (300) + enchantment-9 amulet (200) → payout 300 (300 + 200×0.5 = 400 minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon" },
            { type: "amulet", enchantment: 9 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "mixed",
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "amulet", amount: 200 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 300 }],
    });
  });

  it("claim on event with dragon sword (300) + plain potion (80) → payout 200 (300 + 0 = 300 minus 100; non-qualifying item ignored)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon" },
            { type: "potion" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "mixed",
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "potion", amount: 80 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 200 }],
    });
  });

  it("claim on plain potion for 500 damage → payout 0 (non-qualifying item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "potion", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 0 }],
    });
  });

  it("claim on dragon staff with enchantment 10 for 400 damage → payout 300 (dragon 100% wins over high-ench 50%; 400 minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "dragon", enchantment: 10 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "staff", amount: 400 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { payout: 300 }],
    });
  });
});

describe("MHPCO Claim Office — CLI", () => {
  it("CLI reads a JSON scenario from stdin and writes a JSON results object to stdout (schema example 2: customer 5 yr, amulet quote then 200 fire claim → {results: [{premium: 58}, {payout: 0}]})", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", enchantment: 2 }],
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
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8",
    });
    expect(proc.status).toBe(0);
    expect(JSON.parse(proc.stdout)).toEqual({
      results: [{ premium: 58 }, { payout: 0 }],
    });
  });
});
