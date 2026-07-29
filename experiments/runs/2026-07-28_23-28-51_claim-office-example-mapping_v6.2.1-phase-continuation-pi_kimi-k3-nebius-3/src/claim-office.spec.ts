import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const cliPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "cli.ts");

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliResult {
  const result = spawnSync(process.execPath, ["--import", "tsx", cliPath], {
    input: JSON.stringify(scenario),
    encoding: "utf-8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums and processing fee ---
  it("should charge only the 5 G processing fee for an empty item list -> premium 5", () => {
    const r = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("should quote 115 G for a single plain sword (100 base + 10 first insurance + 5 fee)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote 71 G for a single plain amulet (60 base + 6 first insurance + 5 fee)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote 93 G for a single plain staff (80 base + 8 first insurance + 5 fee)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote 49 G for a single plain potion (40 base + 4 first insurance + 5 fee)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", cursed: false }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components and building blocks ---
  it("should quote 60 G for 2 runes (50 base + 5 first insurance + 5 fee)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 60 }] });
  });
  it("should quote 73 G for 3 runes (block base 60 + 7.5 first insurance + 5 fee = 72.5, rounded up)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 73 }] });
  });
  it("should quote 115 G for 4 runes (no block -- block requires exactly 3)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote 198 G for 7 runes (197.5 rounded up in the MHPCO's favor)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 198 }] });
  });
  it("should quote 88 G for 2 runes + 1 moonstone (no block across types; 87.5 rounded up)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 88 }] });
  });
  it("should quote 140 G for 3 runes + 3 moonstones (two separate blocks)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 140 }] });
  });

  // --- Quote: item-specific modifiers ---
  it("should quote 165 G for a cursed sword for a newcomer (integration example)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should apply the high-enchantment surcharge at exactly enchantment 5 -> sword 145 G", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 145 }] });
  });
  it("should not apply the high-enchantment surcharge at enchantment 4 -> sword 115 G", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply both surcharges to a cursed sword with enchantment 5 -> 195 G", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 195 }] });
  });
  it("should apply only the curse surcharge to a cursed sword with enchantment 4 -> 165 G", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: true }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Quote: policy-wide modifiers ---
  it("should apply the loyalty discount at exactly 2 years -> plain sword 95 G", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 95 }] });
  });
  it("should scope the cursed surcharge to the cursed item only: cursed sword + plain amulet -> 231 G", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
      }],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 231 }] });
  });
  it("should give a 15% follow-up discount on the second quote -> [115, 62]", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 115 }, { premium: 62 }] });
  });
  it("should quote 160 G for the long-standing customer's second contract (integration example)", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // --- Claim: standard reimbursement and deductible ---
  it("should pay 400 G for regular sword damage of 500 G (full - 100 deductible), remainingCap 1600", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should pay 100 G for rune damage of 200 G, remainingCap 400", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "carelessness", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("should apply the deductible per damaged item: sword 500 + amulet 300 -> payout 600, remainingCap 2600", () => {
    const r = runCli({
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
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: special clauses ---
  it("should reimburse 50% for enchantment 8 even with dragon material: damage 1000 -> 400, remainingCap 1600", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should let the 50% rule win for a dragon sword with enchantment 9 -> 400", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should fully reimburse dragon material with enchantment 5: damage 800 -> 700, remainingCap 1300", () => {
    const r = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it.todo("should apply only the high-enchantment clause to a steel sword with enchantment 9 -> 400");
  it.todo("should round payouts down in the MHPCO's favor: damage 901 at enchantment 9 -> 350, remainingCap 1650");

  // --- Claim: insurance sum and cap ---
  it.todo("should treat two sword damage entries as separate damages with own deductibles -> 600, remainingCap 3400");
  it.todo("should base the cap on the unmodified insurance value: cursed sword damage 2000 -> 1900, remainingCap 100");
  it.todo("should not let the block discount affect the insurance sum: sword + 3 runes -> cap 3500, remainingCap 3400");
  it.todo("should exhaust the cap across successive claims -> [1400/600] then [600/0]");

  // --- End-to-end schema example ---
  it.todo("should process the schema example end-to-end -> premium 59, payout 100, remainingCap 1100");

  // --- Error handling ---
  it.todo("should exit non-zero with stderr and no results for an unknown item type in a quote");
  it.todo("should exit non-zero with stderr when a damaged item is not part of the policy");
  it.todo("should exit non-zero when damage entries of a type exceed the covered count");
  it.todo("should exit non-zero with stderr for a negative damage amount");
});
