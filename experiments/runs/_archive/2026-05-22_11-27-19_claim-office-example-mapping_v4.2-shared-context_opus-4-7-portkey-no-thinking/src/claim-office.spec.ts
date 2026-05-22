import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

function runCli(input: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums, empty list, processing fee ---
  it("empty items list with 0-year customer yields premium 5 (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single amulet (0 years) yields premium 71 (60 base * 1.10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (0 years) yields premium 93 (80 base * 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (0 years) yields premium 49 (40 base * 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("single sword (0 years) yields premium 115 (100 base * 1.10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single rune (0 years) yields premium 33 (25 * 1.10 = 27.5 rounded up to 28, + 5)", () => {
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

  // --- Quote: component building blocks (R2) ---
  it("2 runes (no block) yields base 50, premium 60 (50 * 1.10 = 55, + 5)", () => {
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
  it("3 runes (block applies) yields base 60, premium 71 (60 * 1.10 = 66, + 5)", () => {
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
  it("4 runes (no block, block requires exactly 3) yields base 100, premium 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes (no block) yields base 175, premium 198 (175 * 1.10 = 192.5 rounded up to 193, + 5)", () => {
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

  // --- Quote: alike means same type (Q1) ---
  it("2 runes + 1 moonstone yields base 75 (no block: different types), premium 88 (75*1.10=82.5→83, +5)", () => {
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
  it("3 runes + 3 moonstones yields base 120 (two separate blocks), premium 137 (120*1.10=132, +5)", () => {
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

  // --- Quote: item-level modifiers (R3) ---
  it("cursed sword (steel, ench 3), 0 years, first quote → premium 165 (integration example 1: 100 + 50 curse + 10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment exactly 5, 0 years → premium 145 (100 + 30 high-ench + 10 first-ins + 5 = 145)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4, 0 years → premium 115 (no high-ench surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword enchantment 5, 0 years → premium 195 (100 + 50 + 30 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Quote: policy-level modifiers (R4) ---
  it("single sword, customer with exactly 2 years (loyalty applies) → premium 95 (100 + 10 first-ins − 20 loyalty + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("long-standing customer (3 years), second quote in scenario, cursed sword ench 7 → premium 160 (integration example 2)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: modifier scope on multi-item policies (R3 vs R4) ---
  it("cursed sword + plain amulet (0 years, first quote) → premium 231 (sword 100*1.6=160, amulet 60*1.1=66, first-ins per item already in; total 226, +5 fee = 231)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Quote: rounding in MHPCO's favor (R6) ---
  it("premium calculation yielding 197.5 rounds UP to 198 (e.g., 7 runes case)", () => {
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

  // --- Claim: standard reimbursement (R8, R9) ---
  it("sword policy (insurance 1000, cap 2000), 500 G damage on regular steel sword (ench 3) → payout 400, remainingCap 1600", () => {
    const result = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("rune policy (insurance 250, cap 500), 200 G damage on rune (no enchantment/material) → payout 100, remainingCap 400", () => {
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
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

  // --- Claim: multi-item deductible per damage entry (R8) ---
  it("sword + amulet policy, dragon damages sword 500 and amulet 300 → payout 600 (400+200, each minus own deductible), remainingCap 2600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 0, cursed: false },
            { type: "amulet", material: "dragon", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });

  // --- Claim: enchantment threshold vs dragon material (R9) ---
  it("dragon-material sword, enchantment exactly 8, dmg 1000 G → payout 400 (50% high-ench wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
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
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon-material sword, enchantment 9, dmg 1000 G → payout 400 (both apply; 50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
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
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon-material sword, enchantment 5, dmg 800 G → payout 700 (only dragon clause: full minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
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
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("steel sword, enchantment 9, dmg 1000 G → payout 400 (only high-enchantment clause: 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
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
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // --- Claim: payout rounding DOWN (R6) ---
  it("payout calculation yielding 350.5 G rounds DOWN to 350 (e.g., dragon sword ench 8, dmg 901 → 901/2 − 100 = 350.5 → 350)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
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
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  // --- Claim: multiple items of same type (Q2) ---
  it("policy with two swords → insurance sum 2000, cap 4000 (claim with 0-payout damage reveals remainingCap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 0,
      remainingCap: 4000,
    });
  });
  it("two swords insured, dragon damages both swords (500 each) → payout 800 (each with own deductible), remainingCap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 0, cursed: false },
            { type: "sword", material: "dragon", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 800,
      remainingCap: 3200,
    });
  });

  // --- Claim: cap derivation (R7) ---
  it("cursed sword policy (premium with mods 165 G) → cap 2000 G (based on unmodified insurance value, premium modifiers do not raise cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 0,
      remainingCap: 2000,
    });
  });
  it("sword + 3 runes policy (block discount on premium) → insurance sum 1750 G (= 1000 + 3*250), cap 3500 G (block does not reduce insurance sum)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 0,
      remainingCap: 3500,
    });
  });

  // --- Claim: cap exhaustion across successive claims (R10) ---
  it("sword policy (cap 2000), two successive 1500 G claims: first → payout 1400 remaining 600; second → payout 600 (reduced from 1400 to cap) remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect((result as { results: Array<unknown> }).results[1]).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect((result as { results: Array<unknown> }).results[2]).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // --- CLI scenario interface (multi-step, policy by index) ---
  it("scenario with quote step 0 then claim referencing policy 0 → results array matches steps order and length", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
    expect(result).toEqual({
      results: [
        { premium: 71 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });

  // --- Error cases (CLI exits non-zero, stderr, no results stdout) ---
  it("quote with unknown item type (e.g. broomstick) → CLI exits non-zero, writes error to stderr, no results written to stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).not.toContain("results");
  });
  it("claim damage referring to item type not insured in policy (e.g. amulet damaged when only sword insured) → CLI exits non-zero, writes error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
    expect(result.stdout).not.toContain("results");
  });
  it("claim damage with unknown item type → CLI exits non-zero, writes error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).not.toContain("results");
  });
  it("claim damages array has more entries of a type than policy covers (e.g. two sword damages when only one sword insured) → CLI exits non-zero, writes error to stderr, whole claim rejected", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/sword/);
    expect(result.stdout).not.toContain("results");
  });
  it("claim damage with negative amount (e.g. amount: -200) → CLI exits non-zero, writes error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
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
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative/);
    expect(result.stdout).not.toContain("results");
  });
});
