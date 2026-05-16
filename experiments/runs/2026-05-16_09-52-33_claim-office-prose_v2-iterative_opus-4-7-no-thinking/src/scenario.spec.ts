import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("runScenario", () => {
  it("schema example 1: quote-only sword", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }],
    });
  });

  it("schema example 2: quote then two claims", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote" as const,
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
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "amulet", amount: 250 }],
          },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 58 });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    expect(result.results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });

  it("applies after-first discount on subsequent contracts", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 1 }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 1 }],
        },
      ],
    };
    const result = runScenario(scenario);
    // 1st: 100 ×1.1 +5 = 115
    // 2nd: 100 ×0.85 +5 = 90
    expect(result.results).toEqual([{ premium: 115 }, { premium: 90 }]);
  });
});
