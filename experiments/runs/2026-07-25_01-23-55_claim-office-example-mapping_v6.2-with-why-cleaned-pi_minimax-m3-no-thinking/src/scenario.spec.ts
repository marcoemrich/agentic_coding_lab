import { describe, it, expect } from "vitest";
import { processScenario } from "./scenario.js";

describe("processScenario", () => {
  it("quote then claim produces correct results (spec example)", () => {
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
      ],
    };
    const { results } = processScenario(scenario);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({ premium: expect.any(Number) });
    expect(results[1]).toMatchObject({
      payout: expect.any(Number),
      remainingCap: expect.any(Number),
    });
  });

  it("multi-step scenario with quote and claim - 3-year customer's first quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", cursed: true, enchantment: 7 }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const { results } = processScenario(scenario);
    expect(results).toHaveLength(2);
    // 1st quote (no follow-up discount): 180 (item modifiers) - 20 (loyalty) + 10 (first insurance) + 5 (fee) = 175
    expect(results[0]).toEqual({ premium: 175 });
    // claim: 500 - 100 deductible = 400 payout; cap = 2 * 1000 = 2000, remaining 1600
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("follow-up contract: 2nd quote gets 15% discount on policy base", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", cursed: true, enchantment: 7 }],
        },
      ],
    };
    const { results } = processScenario(scenario);
    expect(results).toHaveLength(2);
    // 1st quote: 100 (base) + 10 (first insurance) - 20 (loyalty) + 5 (fee) = 95
    expect(results[0]).toEqual({ premium: 95 });
    // 2nd quote (follow-up): 180 - 20 (loyalty) + 10 (first insurance) - 15 (follow-up) + 5 (fee) = 160
    expect(results[1]).toEqual({ premium: 160 });
  });
});
