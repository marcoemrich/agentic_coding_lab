import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("CLI scenario runner", () => {
  it("returns empty results for a scenario with no steps", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    expect(out).toEqual({ results: [] });
  });
  it("processes a single quote step and returns its premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("processes a quote followed by a claim referring to that policy", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    // Quote: amulet 60 * 1.10 first-insurance = 66; * 0.80 loyalty = 52.8 -> ceil 53 + 5 = 58
    // Claim: 200 - 100 = 100
    expect(out).toEqual({ results: [{ premium: 58 }, { payout: 100 }] });
  });
});
