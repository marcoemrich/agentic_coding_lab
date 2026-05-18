import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Premium / quote — base item premiums
  it("empty item list → premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword → premium 100 + 5 = 105 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("single plain amulet → premium 60 + 5 = 65 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("single plain staff → premium 80 + 5 = 85 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("single plain potion → premium 40 + 5 = 45 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 45 }] });
  });
  it("two plain items sum their base premiums (sword + amulet → 165 G)", () => {
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
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // Components and block-of-3
  it("single rune component → premium 25 + 5 = 30 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 30 }] });
  });
  it("2 runes → 50 G base premium → 55 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 55 }] });
  });
  it("3 runes → block applies, 60 G base → 65 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("4 runes → no block, 100 G base → 105 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("7 runes → 175 G base → 180 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 180 }] });
  });
  it("2 runes + 1 moonstone → 75 G base (no block, different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 80 }] });
  });
  it("3 runes + 3 moonstones → 120 G base (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 125 }] });
  });

  // Item-specific premium modifiers
  it("cursed sword adds 50% surcharge on that item's base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 5 fee = 155 (no first-insurance yet)
    expect(result).toEqual({ results: [{ premium: 155 }] });
  });
  it("highly enchanted item (enchantment ≥ 5) adds 30% surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 6, cursed: false }],
        },
      ],
    });
    // 100 base + 30 high-ench + 5 fee = 135
    expect(result).toEqual({ results: [{ premium: 135 }] });
  });
  it("enchantment exactly 5 triggers high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 135 }] });
  });
  it("enchantment 4 does NOT trigger high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("cursed AND highly enchanted item stacks both surcharges", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 6, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 30 high-ench + 5 fee = 185
    expect(result).toEqual({ results: [{ premium: 185 }] });
  });

  // Policy-wide modifiers
  it("first insurance adds 10% surcharge on policy base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0, firstInsurance: true },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first-insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("long-standing customer (≥ 2 years) gets 20% loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base - 20 loyalty + 5 fee = 85
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("exactly 2 years with MHPCO triggers loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base - 20 loyalty + 5 fee = 85
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("follow-up contract (after first) gets 15% discount", () => {
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
    // First quote: 100 + 5 = 105
    // Second quote: 100 - 15 follow-up + 5 fee = 90
    expect(result).toEqual({ results: [{ premium: 105 }, { premium: 90 }] });
  });

  // Integration: newcomer with cursed sword
  it("newcomer with cursed sword (enchantment 3) → 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0, firstInsurance: true },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse = 150; +10% first-insurance = 165; + 5 fee = 170? Let me recompute.
    // Per spec: 100 + 50 + 10 = 160, + 5 fee = 165
    // 10 is 10% of (100+50) = 15... but spec says +10. So the 10% applies to the ITEM base only (100), not the item premium (150).
    // 100 base * 1.1 first-ins = 110; cursed adds 50% of 100 = 50; total 160; + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // Integration: long-standing customer's second contract
  it("3-year customer's 2nd contract, cursed sword enchantment 7 → 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3, firstInsurance: true },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // First step: potion 40 base; loyalty -20% applied: 40 - 8 + 5 = 37 (rounded up - epsilon → 37)
    // Wait - first step is NOT follow-up, so policyRate = +0.1 (firstInsurance) + (-0.2) (loyalty) = -0.1
    // 40 + 40*(-0.1) + 5 = 40 - 4 + 5 = 41
    // Second step: 100 base + 50 cursed + 30 high-ench (item surcharges → itemsPremium 180)
    // policyBase = 100; policyRate = 0.1 + (-0.2) + (-0.15) = -0.25
    // 180 + 100*(-0.25) + 5 = 180 - 25 + 5 = 160
    expect(result).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });

  // Rounding
  it("premium rounds up in MHPCO's favor", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "quote", items: [{ type: "rune" }] },
      ],
    });
    // Step 1: rune 25 + 5 fee = 30 (whole)
    // Step 2: rune 25, follow-up -15%: 25 + 25*(-0.15) + 5 = 26.25 → rounds up to 27
    expect(result).toEqual({ results: [{ premium: 30 }, { premium: 27 }] });
  });

  // Errors during quote
  it("unknown item type → CLI error (non-zero exit, stderr message)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/unknown item type/i);
  });

  // Claims — basic
  it("standard sword damage 500 → payout 400 (deductible 100)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // Sword: insurance 1000, cap 2000, damage 500 → payout 400, remaining cap 1600
    expect(result).toEqual({
      results: [{ premium: 105 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (250 G), damage 200 → payout 100", () => {
    const result = runScenario({
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
    // Rune: insurance 250, cap 500, damage 200 → payout 100, remaining cap 400
    expect(result).toEqual({
      results: [{ premium: 30 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("damage smaller than deductible → payout 0 (not negative)", () => {
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
          incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    // Damage 50 < deductible 100 → payout 0, remaining cap 2000
    expect(result).toEqual({
      results: [{ premium: 105 }, { payout: 0, remainingCap: 2000 }],
    });
  });

  // Special clauses
  it("high enchantment (≥ 8) reimburses 50% of damage, then deductible", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // Premium: 100 + 30 high-ench + 5 = 135. Sword cap=2000.
    // Payout: 50% of 1000 = 500, - 100 deductible = 400. Remaining cap = 1600.
    expect(result).toEqual({
      results: [{ premium: 135 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon material gives full reimbursement", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // Premium: 100 + 5 = 105. Sword cap=2000.
    // Payout: dragon → full 800, - 100 deductible = 700. Remaining cap = 1300.
    expect(result).toEqual({
      results: [{ premium: 105 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("dragon material + enchantment 9 → 50% rule wins, then deductible", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // Both clauses apply; 50% wins: 1000 * 0.5 = 500, - 100 deductible = 400. Cap 2000 - 400 = 1600.
    expect(result).toEqual({
      results: [{ premium: 135 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon material + enchantment 5 → full reimbursement (dragon only)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // Premium: 100 + 30 high-ench (≥5 premium surcharge) + 5 = 135.
    // Payout: dragon → full 800, - 100 deductible = 700. Cap 2000 - 700 = 1300.
    expect(result).toEqual({
      results: [{ premium: 135 }, { payout: 700, remainingCap: 1300 }],
    });
  });

  // Deductible per damage event
  it("two damaged items in one incident → deductible applied per item", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
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
    // Payout: (500-100) + (300-100) = 400 + 200 = 600.
    // Insurance sum: 1000+600=1600, cap=3200, remaining = 3200-600=2600.
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Cap
  it("policy cap = 2× insurance sum", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // Insurance sum: 1000 + 600 = 1600; cap = 3200.
    // Payout: 200 - 100 = 100. Remaining cap: 3200 - 100 = 3100.
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cap exhausted across successive claims", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // Cap 2000. Claim1: 1400 → cap 600. Claim2: raw 1400 clamped to 600 → cap 0.
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("multiple items of same type are insured separately", () => {
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    // Insurance sum: 2×1000=2000, cap=4000.
    // Two separate damages, each with own deductible: (500-100) + (300-100) = 600.
    // Remaining cap: 4000 - 600 = 3400.
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("damages array references more items of a type than insured → error", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow();
  });

  // Payout rounding
  it("payout rounds down in MHPCO's favor", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 901 * 0.5 = 450.5; 450.5 - 100 = 350.5 → rounds down to 350. Cap 2000 - 350 = 1650.
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Claim errors
  it("claim references item not in policy → error", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow();
  });
  it("negative damage amount → error", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow();
  });

  // CLI
  it("CLI processes a multi-step scenario from stdin to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 105 }, { payout: 400, remainingCap: 1600 }],
    });
  });
});
