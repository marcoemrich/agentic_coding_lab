import { describe, expect, it } from "vitest";
import { ClaimOfficeError } from "./claim-office-error.js";
import { runScenario } from "./scenario.js";

describe("Scenario", () => {
  it("schema example: 5 years, silver amulet quote then fire claim of 200 G -> premium 59, payout 100, remainingCap 1100", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("results keep the order and length of the steps", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "potion" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "potion", amount: 250 }] },
        },
        { op: "quote" as const, items: [] },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toHaveLength(3);
    expect(results[0]).toEqual({ premium: 49 });
    expect(results[1]).toEqual({ payout: 150, remainingCap: 650 });
    expect(Object.keys(results[2])).toEqual(["premium"]);
  });

  it("second quote step gets the follow-up discount; claim steps do not count as contracts", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
        { op: "quote" as const, items: [{ type: "sword" }] },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[0]).toEqual({ premium: 115 });
    expect(results[2]).toEqual({ premium: 100 });
  });

  it("two successive claims on one policy share the remaining cap", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it("claim referencing a policy index that is not a quote step -> throws ClaimOfficeError (chosen reading)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(ClaimOfficeError);
  });
});
