import { describe, it, expect } from "vitest";
import { runScenario } from "./cli.js";

describe("CLI scenario runner", () => {
  it("should process a complete scenario with a quote step followed by a claim step", () => {
    // Customer 5 years: loyalty discount applies (>= 2 years)
    // Quote: amulet (base 60) + 5 fee + 6 first insurance - 12 loyalty = 59
    // Claim: amulet 200 - 100 deductible = 100 payout; remainingCap = 2*600 - 100 = 1100
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
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
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ premium: 59 });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it("should reject unknown item type in a quote step (exit non-zero, error to stderr)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" }],
          },
        ],
      }),
    ).toThrow();
  });

  it("should reject damage to item not in policy (exit non-zero, error to stderr)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
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
      }),
    ).toThrow();
  });

  it("should process a multi-quote scenario applying follow-up discount to subsequent contracts", () => {
    // First contract: 100 base + 10 first insurance + 5 fee = 115
    // Second contract (follow-up): 100 base - 15 follow-up + 10 first insurance + 5 fee = 100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
      ],
    });
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });
});
