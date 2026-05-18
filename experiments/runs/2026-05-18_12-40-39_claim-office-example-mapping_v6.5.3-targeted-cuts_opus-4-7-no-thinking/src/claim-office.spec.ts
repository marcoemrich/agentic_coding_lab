import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums and processing fee
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote for a single plain sword yields 115 G (100 base + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for a single plain amulet yields 71 G (60 base + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for sword + amulet sums base premiums (160 base + 16 + 5 = 181)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });

  // Quote: components and blocks
  it("quote for 2 runes yields 60 G (50 base + 5 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" },
          { type: "rune" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote for 3 runes yields 71 G (60 block base + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes yields 115 G (100 base + 10 first ins + 5 fee, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for 3 runes + 3 moonstones yields 137 G (120 base × 1.1 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Quote: item-level modifiers
  it("cursed sword for newcomer yields 165 G (100 + 50 curse + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("high-enchantment sword (enchantment 5) yields 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 has no high-enchantment surcharge (115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // Quote: policy-level modifiers
  it("long-standing customer (2+ years) plain sword: 95 G (100 - 20 loyalty + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("second quote in scenario gets 15% follow-up discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 1st: 100 + 10 + 5 = 115
    // 2nd: 100 + 10 - 15 + 5 = 100
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // Quote: rounding
  it("rounds final premium up: 1 rune (25 base + 2.5 first ins + 5 fee = 32.5 → 33)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Quote: integration
  it("newcomer with cursed sword: premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    });
    // 100 base + 50 curse + 10 first ins + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer second contract with cursed enchanted sword: 160 G", () => {
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
    // 2nd quote: 100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first ins − 15 follow-up + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim: basic
  it("standard claim: damage 500 G on sword yields payout 400 G (minus deductible)", () => {
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on rune (no enchant/material): damage 200 yields 100 G payout", () => {
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
    // rune insurance value 250, cap = 500; payout = 200 - 100 = 100; remainingCap = 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim: special clauses
  it("dragon-material sword: full reimbursement minus deductible", () => {
    // dragon sword, enchant 5, damage 800 → 700 (per spec: dragon overrides high-ench clause)
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
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("high-enchantment item (>=8): 50% reimbursement then deductible", () => {
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
    // 1000 × 0.5 = 500, then − 100 deductible = 400; cap 2000 − 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon + high-enchantment: 50% wins, then deductible", () => {
    // dragon sword, enchant 9, damage 1000 → 400 (per spec)
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim: cap
  it("payout capped at 2x insurance sum; remaining cap tracked", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("multiple damages: deductible applies per damaged item", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
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
    // 500-100 + 300-100 = 600; insurance sum 1600, cap 3200, remaining 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Errors
  it("unknown item type in quote causes error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy causes error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("negative damage amount causes error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
