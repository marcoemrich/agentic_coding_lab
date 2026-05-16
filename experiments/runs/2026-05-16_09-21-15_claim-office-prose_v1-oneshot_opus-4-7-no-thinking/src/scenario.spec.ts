import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("runScenario", () => {
  it("processes example 1: single sword quote for new customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "steel",
              enchantment: 3,
              cursed: false,
            },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("processes example 2: quote followed by two claims", () => {
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
    // amulet 60 * 0.8 (loyalty) = 48 * 1.1 (first) = 52.8, +5 = 57.8 => 58
    // claim 1: 200-100 = 100 payout; cap was 1200, now 1100
    // claim 2: 250-100 = 150 payout; cap 950.
    expect(result.results).toEqual([
      { premium: 58 },
      { payout: 100, remainingCap: 1100 },
      { payout: 150, remainingCap: 950 },
    ]);
  });

  it("treats second quote as subsequent contract", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "steel",
              enchantment: 0,
              cursed: false,
            },
          ],
        },
        {
          op: "quote",
          items: [
            {
              type: "potion",
              material: "glass",
              enchantment: 0,
              cursed: false,
            },
          ],
        },
      ],
    });
    // 1st: sword 100 * 1.1 + 5 = 115
    // 2nd: potion 40 * 0.85 + 5 = 39
    expect(result.results).toEqual([{ premium: 115 }, { premium: 39 }]);
  });
});
