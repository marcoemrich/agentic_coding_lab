import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("Claim Office CLI scenario runner", () => {
  it("processes a single quote step and returns a premium result", () => {
    const output = runScenario({
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
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("processes a quote followed by a claim referencing it by policy index", () => {
    const output = runScenario({
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
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 58 }, { payout: 100 }],
    });
  });
});
