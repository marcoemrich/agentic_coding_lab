import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Base premium calculations - quote operation
  it("quote with empty item list returns premium of 5 (just processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote with a single plain sword returns base premium + fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance (10%) + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with a single plain amulet returns base premium + fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    // 60 base + 6 first insurance (10%) + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with a single plain staff returns base premium + fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    });
    // 80 base + 8 first insurance (10%) + 5 fee = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote with a single plain potion returns base premium + fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });
    // 40 base + 4 first insurance (10%) + 5 fee = 49
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("quote with 2 runes returns 50G base + fee (no block)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // 50 base + 5 first insurance (10%) + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote with 3 runes returns 60G base + fee (block applies)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // 60 block base + 6 first insurance (10%) + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with 4 runes returns 100G base + fee (no block)", () => {
    const result = processScenario({
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
    // 100 base (no block) + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with 7 runes returns 175G base + fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // 7*25 = 175 base (no block, requires exactly 3) + 17.5 first ins + 5 fee = 197.5 -> rounded up to 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("quote with 2 runes + 1 moonstone returns 75G base + fee (no block, different types)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    // 75 base (no block: different types) + 7.5 first ins + 5 fee = 87.5 -> 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote with 3 runes + 3 moonstones returns 120G base + fee (two separate blocks)", () => {
    const result = processScenario({
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
    // 120 base (two blocks: 60+60) + 12 first ins + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers
  it("quote with a cursed sword adds 50% surcharge to sword base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("quote with a sword enchantment 5 adds 30% high-enchantment surcharge", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 base + 30 high-enchantment (30%) + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("quote with a sword enchantment 4 does not add high-enchantment surcharge", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance + 5 fee = 115 (no high-ench: 4 < 5)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with a cursed sword enchantment 5 adds both surcharges", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 30 high-ench + 10 first insurance + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("quote for customer with 2 years gets 20% loyalty discount on policy base", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // 100 base - 20 loyalty (20%) + 10 first insurance (10%) + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("quote applies 10% first insurance surcharge on policy base", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // policy base = 100 + 60 = 160; first insurance 10% of 160 = 16; + 5 fee = 181
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("quote for customer's second contract applies 15% follow-up discount", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // First quote: 100 + 10 first ins + 5 fee = 115
    // Second quote: 100 + 10 first ins - 15 follow-up + 5 fee = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Multi-item policies - modifier scope
  it("quote with cursed sword + plain amulet applies cursed surcharge only to sword", () => {
    const result = processScenario({
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
    // policy base = 160; curse surcharge = 50 (on sword only); first ins 10% of 160 = 16; +5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Rounding
  it("quote rounds final premium up (in MHPCO's favor)", () => {
    const result = processScenario({
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
          ],
        },
      ],
    });
    // 5 * 25 = 125 base (no block: not exactly 3) + 12.5 first ins + 5 fee = 142.5 -> rounded up to 143
    expect(result).toEqual({ results: [{ premium: 143 }] });
  });

  // Integration examples
  it("newcomer with cursed sword (steel, enchantment 3) -> premium 165", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first ins + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract with cursed sword enchantment 7 -> premium 160", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // Second contract:
    // 100 base + 50 curse + 30 high-ench + 10 first ins - 20 loyalty - 15 follow-up + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim processing - basic
  it("claim with damage 500 on regular sword (no clauses) returns payout 400 (500 - 100 deductible)", () => {
    const result = processScenario({
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
    // sword damage 500 - 100 deductible = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim with damage 200 on a rune returns payout 100 (200 - 100 deductible)", () => {
    const result = processScenario({
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
    // rune insurance 250, cap 500. damage 200 - 100 deductible = 100. remainingCap = 400.
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim - enchantment threshold
  it("claim on enchantment 9 sword with damage 1000 returns payout 400 (50% then deductible)", () => {
    const result = processScenario({
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
    // ench 9 -> 1000 * 0.5 = 500; then -100 deductible = 400. cap = 2000, remainingCap = 1600.
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim - dragon material
  it("claim on dragon-material sword damage 800 returns payout 700 (full then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
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
    // dragon material, low ench: full reimbursement 800, -100 = 700. cap 2000, remainingCap 1300.
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Claim - both clauses
  it("claim on dragon-material enchantment 9 sword damage 1000 returns payout 400 (50% wins)", () => {
    const result = processScenario({
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
    // ench ≥ 8 wins: 1000 * 0.5 - 100 = 400. cap 2000, remainingCap 1600.
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on dragon-material enchantment 8 sword damage 1000 returns payout 400", () => {
    const result = processScenario({
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
    // ench 8 (≥8) triggers 50% rule: 1000 * 0.5 - 100 = 400. remainingCap 1600.
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim - per-damage deductible
  it("claim with two damaged items applies deductible per damage event", () => {
    const result = processScenario({
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
    // sword 500 - 100 = 400; amulet 300 - 100 = 200; total payout = 600
    // cap = 2 * (1000 + 600) = 3200; remainingCap = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Cap and remaining cap
  it("claim returns remainingCap = cap - payout", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "staff", amount: 300 }],
          },
        },
      ],
    });
    // staff insurance 800, cap = 1600. damage 300 - 100 = 200 payout. remainingCap = 1400.
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1400 });
  });
  it("two successive claims exhaust the cap (1500/1500 on sword: 1400, then 600)", () => {
    const result = processScenario({
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
    // cap = 2000. First: 1500 - 100 = 1400, remainingCap = 600.
    // Second: desired 1400 clamped to remaining 600. remainingCap = 0.
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // CLI scenario with quote then claim
  it("scenario with quote followed by claim returns results in order", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
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
    // Quote: 60 base + 6 first ins - 12 loyalty + 5 fee = 59
    // Claim: 200 - 100 = 100 payout. Cap = 1200, remainingCap = 1100.
    expect(result).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
});
