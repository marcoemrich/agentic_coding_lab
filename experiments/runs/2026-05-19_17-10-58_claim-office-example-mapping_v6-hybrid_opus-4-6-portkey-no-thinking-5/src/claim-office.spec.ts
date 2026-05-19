import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === QUOTE: Base premiums ===
  it("empty item list returns premium of 5 G (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword returns premium of 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet returns premium of 71 G (60 base + 6 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff returns premium of 93 G (80 base + 8 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion returns premium of 49 G (40 base + 4 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("single rune component returns premium of 33 G (25 base + 2.5 first rounded up to 3 + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("two runes returns premium of 60 G (50 base + 5 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }, { type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  // === QUOTE: Component block pricing ===
  it("3 alike runes returns block premium (60 base + 6 first + 5 fee = 71 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes returns non-block premium (100 base + 10 first + 5 fee = 115 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("2 runes + 1 moonstone returns 75 base (no block, different types)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones returns 120 base (two separate blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // === QUOTE: Item-specific modifiers ===
  it("cursed sword adds 50% surcharge to sword base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("highly enchanted sword (enchantment >= 5) adds 30% surcharge to sword base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("cursed and highly enchanted sword has both surcharges applied", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("enchantment 4 does not trigger high-enchantment surcharge", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // === QUOTE: Policy-wide modifiers ===
  it("long-standing customer (>= 2 years) receives 20% loyalty discount on policy base", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with exactly 2 years qualifies for loyalty discount", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("follow-up contract (second quote) receives 15% discount on policy base", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // === QUOTE: Multi-item policies ===
  it("policy with cursed sword and plain amulet applies curse surcharge only to sword", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("policy with multiple items sums item base premiums before policy-wide modifiers", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{
        op: "quote" as const,
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      }],
    });
    // policyBase = 160, loyalty = 32, first insurance = 16
    // premium = ceil(160 - 32 + 16 + 5) = 149
    expect(result).toEqual({ results: [{ premium: 149 }] });
  });

  // === QUOTE: Integration - modifier stacking ===
  it("newcomer with cursed sword: 100 + 50 curse + 10 first + 5 fee = 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer second contract cursed enchanted sword: 155 + 5 fee = 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // First quote: 100 base - 20 loyalty + 10 first + 5 fee = 95
    // Second quote: 100 base + 50 curse + 30 enchant - 20 loyalty + 10 first - 15 follow-up + 5 fee = 160
    expect(result).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });

  // === QUOTE: Rounding ===
  it("premium rounds up (in MHPCO's favor) to whole G", () => {
    // single rune: 25 base + 2.5 first + 5 fee = 32.5, ceil = 33
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote" as const,
        items: [{ type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // === CLAIM: Basic payout ===
  it("regular sword damage 500 G returns payout 400 G (full reimbursement minus 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("component damage 200 G returns payout 100 G (full minus 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  // === CLAIM: Special clauses ===
  it("enchantment >= 8 reimburses at 50% of damage then deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("dragon material fully reimburses then deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });
  it("dragon material with enchantment >= 8: 50% wins then deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // Both clauses apply: 50% wins → 500, then deductible → 400
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("dragon material with enchantment < 8: full reimbursement then deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    // Only dragon clause: full reimbursement → 800 - 100 = 700
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });

  // === CLAIM: Cap ===
  it("policy cap is 2x insurance sum", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // sword insurance 1000, cap 2000, payout 400, remaining 1600
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("successive claims exhaust cap: second claim reduced to remaining cap", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // === CLAIM: Multiple items in one event ===
  it("multiple damaged items each have their own deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
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
    // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
    // insurance sum = 1000 + 600 = 1600, cap = 3200, remaining = 3200 - 600 = 2600
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });

  // === CLAIM: Validation ===
  it("damage to item not in policy rejects the claim", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      })
    ).toThrow();
  });
  it("more damage entries of a type than policy covers rejects the claim", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });
  it("negative damage amount rejects the claim", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -100 }],
            },
          },
        ],
      })
    ).toThrow();
  });

  // === QUOTE: Validation ===
  it("unknown item type in quote rejects with error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote" as const,
          items: [{ type: "wand", material: "wood", enchantment: 0, cursed: false }],
        }],
      })
    ).toThrow();
  });

  // === CLI integration ===
  it("CLI reads scenario from stdin and writes results to stdout", async () => {
    const { execSync } = await import("child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    const result = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
      encoding: "utf-8",
      cwd: process.cwd(),
    });
    expect(JSON.parse(result)).toEqual({ results: [{ premium: 115 }] });
  });
  it("CLI exits with non-zero status on error and writes to stderr", async () => {
    const { execSync } = await import("child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "wand", material: "wood", enchantment: 0, cursed: false }] }],
    });
    try {
      execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
      });
      expect.unreachable("CLI should have exited with non-zero status");
    } catch (err: any) {
      expect(err.status).not.toBe(0);
      expect(err.stderr).toContain("Unknown item type");
    }
  });
});
