import { describe, expect, it } from "vitest";
import { runScenario } from "./scenario.js";

describe("runScenario", () => {
  it("handles a quote-only scenario (example 1)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // Sword 100 * 1.1 (first ins) + 5 = 115
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("handles a quote followed by two claims (example 2 shape)", () => {
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
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "amulet", amount: 250 }],
          },
        },
      ],
    });
    expect(result.results).toHaveLength(3);
    expect(result.results[0]).toEqual({ premium: 58 });
    // Amulet isn't dragon and enchantment 2 < 8, so neither claim pays out.
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
    expect(result.results[2]).toEqual({ payout: 0, remainingCap: 1200 });
  });

  it("applies subsequent-contract discount on the second quote", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // First: 100 * 1.1 + 5 = 115
    // Second: 100 * 0.85 + 5 = 90
    expect(result.results).toEqual([{ premium: 115 }, { premium: 90 }]);
  });
});
