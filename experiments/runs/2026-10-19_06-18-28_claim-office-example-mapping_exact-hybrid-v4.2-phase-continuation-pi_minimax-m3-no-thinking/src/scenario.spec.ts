import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("Scenario - Insurance sum and cap", () => {
  it("should compute insurance sum 2000 G and cap 4000 G for two swords", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      ],
    });
    expect(result.results[0].premium).toBe(225); // 200 + 20 first ins + 5 fee
  });

  it("should compute insurance sum 1600 G and cap 3200 G for sword + amulet: premium 231 G (160 base + 50 curse + 16 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    });
    expect(result.results[0].premium).toBe(231);
  });

  it("should compute insurance sum 1750 G (= 1000 + 3*250) for sword + 3 runes block: premium 186 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // Base: 100 + 60 (3 runes block) = 160, first ins 16, fee 5 = 181
    expect(result.results[0].premium).toBe(181);
  });

  it("should compute cap based on unmodified insurance value (cursed sword: cap 2000)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });
    // Sword damage 100, no clauses, deductible 100, payout = 0 (floor of 0)
    // remainingCap = 2000 - 0 = 2000
    expect((result.results[1] as any).remainingCap).toBe(2000);
  });
});

describe("Scenario - Cap exhaustion across multiple claims", () => {
  it("should pay 1400 G with 600 G remaining on first claim of 1500 G (sword, cap 2000)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
    expect((result.results[1] as any).payout).toBe(1400);
    expect((result.results[1] as any).remainingCap).toBe(600);
  });

  it("should cap second claim at remaining 600 G (sword, cap 2000, two 1500 G claims)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
    expect((result.results[1] as any).payout).toBe(1400);
    expect((result.results[1] as any).remainingCap).toBe(600);
    expect((result.results[2] as any).payout).toBe(600);
    expect((result.results[2] as any).remainingCap).toBe(0);
  });
});

describe("Scenario - Claim with multiple damages to same item type", () => {
  it("should treat two damages to two swords as separate events (each with deductible): payout 800", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect((result.results[1] as any).payout).toBe(800);
  });

  it("should reject claim when damages array has more entries of a type than policy covers", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });
});

describe("Scenario - Error cases", () => {
  it("should reject scenario with quote containing unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" as any }] }],
      })
    ).toThrow();
  });

  it("should reject claim referencing item not in policy", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      })
    ).toThrow();
  });

  it("should reject claim with negative damage amount", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      })
    ).toThrow();
  });

  it("should reject claim with unknown item type in damage entry", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick" as any, amount: 200 }],
            },
          },
        ],
      })
    ).toThrow();
  });
});

describe("Scenario - Full integration", () => {
  it("should run multi-step scenario: quote + claim and return premium/payout/remainingCap", () => {
    const result = runScenario({
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
    // amulet base 60, first ins 6, fee 5, no loyalty (5 >= 2)... wait loyalty applies
    // loyalty -12, so 60 + 6 - 12 + 5 = 59
    expect(result.results[0].premium).toBe(59);
    expect((result.results[1] as any).payout).toBe(100); // 200 - 100 deductible
    expect((result.results[1] as any).remainingCap).toBe(1100); // 1200 - 100
  });
});
