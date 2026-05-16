import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("runScenario", () => {
  it("processes example 1 - single sword quote", () => {
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
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("processes example 2 - amulet quote + two claims", () => {
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
    expect(result.results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
      { payout: 150, remainingCap: 950 },
    ]);
  });

  it("contracts count increments only on quotes", () => {
    // Two quotes: first +10%, second -15% (loyal customer 5y)
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
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
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // Quote 1: sword 100, factor = 1 - 0.2 + 0.1 = 0.9 -> 90; +5 = 95
    // Quote 2: amulet 60, factor = 1 - 0.2 - 0.15 = 0.65 -> 39; +5 = 44
    expect(result.results).toEqual([{ premium: 95 }, { premium: 44 }]);
  });
});
