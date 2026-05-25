import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Base premiums: single main items ===
  it("should quote a single sword -- premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a single amulet -- premium 71 G (60 base + 10 first-insurance + 5 fee, rounded up from 70.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a single staff -- premium 93 G (80 base + 10 first-insurance + 5 fee, rounded up from 92.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote a single potion -- premium 49 G (40 base + 10 first-insurance + 5 fee, rounded up from 48.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // === Base premiums: single components ===
  it("should quote a single rune -- premium 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up from 32.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote a single moonstone -- premium 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up from 32.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // === Component blocks ===
  it("should quote 2 runes -- premium 60 G (50 base + 10 first-insurance + 5 fee, rounded down from 60.25)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("should quote 3 runes (block applies) -- premium 71 G (60 base + 10 first-insurance + 5 fee, rounded up from 70.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote 4 runes (no block) -- premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote 7 runes -- premium 198 G (175 base + 10 first-insurance + 5 fee, rounded up from 197.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // === Mixed components ===
  it("should quote 2 runes + 1 moonstone (different types, no block) -- premium 88 G (75 base + 7.5 first-insurance + 5 fee, rounded up from 87.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("should quote 3 runes + 3 moonstones (two separate blocks) -- premium 137 G (120 base + 10 first-insurance + 5 fee, rounded up from 136.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // === Item-specific modifiers ===
  it("should quote a cursed sword -- premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote a highly enchanted sword (enchantment 5) -- premium 145 G (100 base + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("should quote a cursed highly enchanted sword (enchantment 5) -- premium 195 G (100 base + 50 curse + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("should quote a sword with enchantment 4 (no high-enchantment surcharge) -- premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // === Policy-wide modifiers ===
  it("should quote for a long-standing customer (exactly 2 years) with a sword -- premium 95 G (100 base - 20 loyalty + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("should quote a second contract (follow-up discount) with a sword -- premium 100 G (100 base + 10 first-insurance - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // === Modifier scope on multi-item policies ===
  it("should apply cursed surcharge only to the cursed item in a multi-item policy -- premium 231 G (160 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("should apply item-specific and policy-wide modifiers correctly -- cursed sword + plain amulet with loyalty = 175 G (160 base + 50 curse - 32 loyalty + 16 first-insurance - 24 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 175 }] });
  });

  // === Empty item list ===
  it("should quote an empty item list -- premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // === Claim: standard reimbursement ===
  it("should process a standard claim on a regular sword -- payout 400 G (500 damage - 100 deductible), remainingCap 1600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("should process a standard claim on a rune -- payout 100 G (200 damage - 100 deductible), remainingCap 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });

  // === Claim: deductible per damage event ===
  it("should apply deductible per damaged item in a single incident -- payout 600 G (500 sword + 300 amulet - 2×100 deductible), remainingCap 2600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });

  // === Claim: enchantment >= 8 (50% reimbursement) ===
  it("should process claim on item with enchantment 8 -- payout 400 G (1000 damage × 50% - 100 deductible), remainingCap 1600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("should process claim on item with enchantment 9 -- payout 400 G (1000 damage × 50% - 100 deductible), remainingCap 1600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  // === Claim: dragon material (full reimbursement) ===
  it("should process claim on dragon-material sword -- payout 700 G (800 damage - 100 deductible), remainingCap 1300 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 700, remainingCap: 1300 }] });
  });

  // === Claim: both clauses (dragon + enchantment >= 8) ===
  it("should process claim on dragon-material sword with enchantment 9 -- payout 400 G (1000 damage × 50% - 100 deductible; 50% rule wins), remainingCap 1600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("should process claim on dragon-material sword with enchantment 5 -- payout 700 G (800 damage - 100 deductible; only dragon applies), remainingCap 1300 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("should process claim on steel sword with enchantment 9 -- payout 400 G (1000 damage × 50% - 100 deductible; only high-enchantment applies), remainingCap 1600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  // === Claim: cap calculation ===
  it("should calculate cap as twice the insurance sum for a sword and amulet -- cap 3200 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }] });
  });
  it("should calculate cap based on unmodified insurance value for cursed sword -- cap 2000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("should calculate cap for sword + 3 runes (block) -- cap 3500 G (insurance sum 1750 G)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }] });
  });

  // === Claim: cap exhaustion across multiple claims ===
  it("should reduce payout when cap is exhausted on second claim -- first claim payout 1400 G, second claim payout 600 G, remainingCap 0 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result).toEqual({ results: [
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ] });
  });

  // === Claim: multiple items of same type ===
  it("should allow two sword damages when two swords are insured -- payout 800 G (2×(500-100)), remainingCap 3200 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("should reject claim with more damages than insured items -- exit non-zero", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toThrow();
  });

  // === Rounding ===
  it("should round premium up in MHPCO's favor -- 197.5 G → 198 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("should round payout down in MHPCO's favor -- 350.5 G → 350 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });

  // === Edge cases: errors ===
  it("should reject quote with unknown item type -- exit non-zero with error to stderr", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("should reject claim for item not in policy -- exit non-zero with error to stderr", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("should reject claim with negative damage amount -- exit non-zero with error to stderr", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // === Integration examples ===
  it("should compute premium for newcomer with cursed sword -- 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should compute premium for long-standing customer's second contract with cursed enchanted sword -- 160 G (100 base + 50 curse + 30 high-enchantment - 20 loyalty + 10 first-insurance - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });
});
