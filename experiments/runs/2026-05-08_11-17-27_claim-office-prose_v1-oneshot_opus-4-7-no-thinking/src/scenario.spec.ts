import { describe, expect, it } from "vitest";
import { runScenario } from "./scenario.js";

describe("runScenario", () => {
  it("handles schema example 1: a single quote", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("handles schema example 2: quote then two claims", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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
    // Damages to a low-enchantment, non-dragon amulet are not reimbursed.
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
    expect(result.results[2]).toEqual({ payout: 0, remainingCap: 1200 });
  });

  it("treats subsequent quotes as repeat contracts", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", enchantment: 0, cursed: false }] },
      ],
    });
    // first: 100 * 1.1 + 5 = 115
    // second: 100 * 0.85 + 5 = 90
    expect(result.results).toEqual([{ premium: 115 }, { premium: 90 }]);
  });
});
