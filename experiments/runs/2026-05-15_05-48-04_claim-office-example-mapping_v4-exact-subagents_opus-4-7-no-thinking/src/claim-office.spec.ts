// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: empty / single base items ---
  it("should quote 5 G for an empty item list (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 5 }]);
  });
  it("should quote 115 G for a single plain sword (100 base + 10 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("should quote 71 G for a single plain amulet (60 base + 6 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("should quote 93 G for a single plain staff (80 base + 8 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("should quote 49 G for a single plain potion (40 base + 4 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: components (runes/moonstones) ---
  it("should quote 33 G for a single rune (25 base + 2.5 first-insurance + 5 fee = 32.5 -> 33)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("should quote 60 G for 2 runes (50 base + 5 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("should quote 71 G for 3 runes as a block (60 block base + 6 first-insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("should quote 99 G for 4 runes (block of 3 + 1 = 60 + 6 + 25 + 2.5 + 5 fee = 98.5 -> 99)", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 99 }]);
  });
  it("should quote 165 G for 7 runes (2 blocks of 3 + 1 single = 120 + 25 + 14.5 first-insurance + 5 fee = 164.5 -> 165)", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("should quote 88 G for 2 runes + 1 moonstone (no block, different types: 50 + 5 + 25 + 2.5 + 5 fee = 87.5 -> 88)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("should quote 137 G for 3 runes + 3 moonstones (two blocks: 60 + 60 + 12 first-insurance + 5 fee)", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Quote: per-item surcharges ---
  it("should add 50% surcharge to a cursed item's base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("should add 30% surcharge to an item with enchantment level >= 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("should stack cursed and high-enchantment surcharges on the same item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Quote: policy-wide modifiers ---
  it("should add 10% first-insurance surcharge per item for a newcomer customer", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 181 }]);
  });
  it("should apply 20% loyalty discount when customer has >= 2 years with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("should apply 15% follow-up contract discount on the second and later contracts", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // --- Quote: rounding and fee ---
  it("should round premium up (ceil) when fractional - e.g. single moonstone 32.5 -> 33", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "moonstone" }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("should add the 5 G processing fee at the end of premium calculation (2 plain swords: 200 base + 20 first-insurance + 5 fee = 225)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 225 }]);
  });

  // --- Quote: worked examples from the spec ---
  it("should quote 165 G for newcomer cursed steel sword ench 3 (100 + 50 + 10 + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("should quote 160 G for 3-year customer's 2nd quote cursed sword ench 7 (100 + 50 + 30 - 20 + 10 - 15 + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });

  // --- Claim: basic payout ---
  it("should pay out damage minus 100 G deductible per damage event", () => {
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
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("should report remainingCap after a claim against the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 115 },
      { payout: 100, remainingCap: 1900 },
      { payout: 100, remainingCap: 1800 },
    ]);
  });
  it("should cap total payout per policy at 2x insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 3000 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 115 }, { payout: 2000, remainingCap: 0 }]);
  });
  it("should round payout down to whole G in MHPCO's favor (e.g. 350.5 -> 350)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 145 },
      { payout: 350, remainingCap: 1650 },
    ]);
  });

  // --- Claim: enchantment and material rules ---
  it("should reimburse 50% of damage (then deductible) for items with enchantment >= 8", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("should reimburse damage in full (then deductible) for dragon-material items", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 145 },
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("should apply the 50% rule (not full reimbursement) when both dragon material and enchantment >= 8 apply", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });

  // --- Claim: worked examples from the spec ---
  it("should pay 400 G for dragon sword ench 8 with 1000 G damage (50% wins, then deductible)", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("should pay 700 G for dragon sword ench 5 with 800 G damage (full reimbursement minus deductible)", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 145 },
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("should pay 400 G for steel sword ench 9 with 1000 G damage (50% rule, then deductible)", () => {
    const scenario = {
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });

  // --- Claim: cap across multiple claims ---
  it("should pay 1400 G with remainingCap 600 for first 1500 G claim on a sword policy (cap 2000)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }]);
  });
  it("should pay 600 G with remainingCap 0 for a second 1500 G claim that hits the cap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
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
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- Claim: multiple items of same type ---
  it("should treat each damage entry separately (each gets its own deductible) for two damaged swords", () => {
    const scenario = {
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 225 },
      { payout: 600, remainingCap: 3400 },
    ]);
  });

  // --- Errors ---
  it("should exit non-zero and write to stderr for an unknown item type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow(/unknown/i);
  });
  it("should exit non-zero and write to stderr when damage references an unknown item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 100 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("should exit non-zero and write to stderr for a negative amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
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
    expect(() => runScenario(scenario)).toThrow();
  });
  it("should exit non-zero and write to stderr when more damage entries of a type are reported than were insured", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
