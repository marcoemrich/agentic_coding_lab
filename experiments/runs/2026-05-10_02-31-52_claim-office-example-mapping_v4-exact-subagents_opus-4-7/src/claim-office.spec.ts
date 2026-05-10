// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: empty and single base items ---
  it("should return premium of 5 G for empty item list (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(5);
  });
  it("should quote a sword at 100 base + 10 first insurance + 5 fee = 115 G for newcomer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should quote an amulet at 60 + 6 + 5 = 71 G for newcomer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should quote a staff at 80 + 8 + 5 = 93 G for newcomer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(93);
  });
  it("should quote a potion at 40 + 4 + 5 = 49 G for newcomer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(49);
  });
  it("should quote a single component (rune) at 25 + 3 + 5 = 33 G (round up) for newcomer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(33);
  });
  it("should quote a single moonstone at 25 + 3 + 5 = 33 G for newcomer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(33);
  });

  // --- Quote: multiple items ---
  it("should sum base premiums for two distinct items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(181);
  });
  it("should sum base premiums for multiple distinct items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "staff", material: "wood", enchantment: 1, cursed: false },
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(247);
  });

  // --- Quote: components block rule ---
  it("should price 3 alike components as a 60 G block instead of 3 x 25 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should not apply block rule to 2 alike components", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(60);
  });
  it("should not apply block rule to 4 alike components (only exact 3)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should not mix component types when forming a block of 3", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(88);
  });

  // --- Quote: per-item surcharges ---
  it("should apply +50% cursed surcharge to a cursed sword's base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(165);
  });
  it("should apply +30% high-enchantment surcharge for enchantment >= 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(145);
  });
  it("should not apply high-enchantment surcharge for enchantment < 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should apply both cursed and high-enchantment surcharges to the same item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(195);
  });

  // --- Quote: policy-level modifiers ---
  it("should apply +10% first-insurance surcharge per item for a newcomer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(225);
  });
  it("should apply -20% loyalty discount when customer has >= 2 years with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(95);
  });
  it("should not apply loyalty discount when customer has < 2 years with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should apply -15% follow-up discount on the second quote in a scenario", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].premium).toBe(100);
  });
  it("should still apply per-item first-insurance surcharge on a follow-up quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1].premium).toBe(195);
  });

  // --- Quote: rounding and fee ---
  it("should add the 5 G processing fee at the end of every quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(137);
  });
  it("should round the final premium up (in MHPCO's favor)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(143);
  });

  // --- Quote: integration examples from spec ---
  it("should quote newcomer cursed steel sword (ench 3) at 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(165);
  });
  it("should quote 3-year customer 2nd contract cursed steel sword (ench 7) at 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1].premium).toBe(160);
  });

  // --- Claim: payouts ---
  it("should pay out damage minus 100 G deductible for a normal claim", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(400);
  });
  it("should reimburse 50% of damage amount for items with enchantment >= 8, then deduct 100 G", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(400);
  });
  it("should fully reimburse damage amount for dragon-material items, then deduct 100 G", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(700);
  });
  it("should apply the 50% rule (not full reimbursement) when both high enchantment and dragon material apply", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(400);
  });
  it("should round payouts down", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(350);
  });
  it("should cap total payouts at 2x the policy's insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] },
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(2000);
  });
  it("should report the remaining cap after each claim", () => {
    const scenario = {
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
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // --- CLI / scenario errors ---
  it("should error when an unknown item type is quoted", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should error when claiming damage on an item not in the policy", () => {
    const scenario = {
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should error on a negative damage amount", () => {
    const scenario = {
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
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should error when more damage entries are filed than items of that type in the policy", () => {
    const scenario = {
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
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "sword", amount: 200 },
            ],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});
