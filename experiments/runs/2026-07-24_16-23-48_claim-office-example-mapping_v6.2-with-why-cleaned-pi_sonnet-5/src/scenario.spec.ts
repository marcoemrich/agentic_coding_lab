import { describe, it, expect } from "vitest";
import { runScenario, type ScenarioInput } from "./scenario.js";

describe("Scenario runner - schema example", () => {
  it("schema example scenario (amulet quote then claim) -- produces premium and payout/remainingCap results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const output = runScenario(scenario as ScenarioInput);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("payout");
    expect(output.results[1]).toHaveProperty("remainingCap");
  });
});

describe("Scenario runner - multi-step scenarios", () => {
  it("quote step followed by claim step referencing policy index 0 -- payout uses that policy's insurance sum for the cap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const output = runScenario(scenario as ScenarioInput);
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("two successive claim steps against the same policy -- second claim's remaining cap reflects the first claim's payout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    const output = runScenario(scenario as ScenarioInput);
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("Scenario runner - error cases surface as thrown errors", () => {
  it("a quote step with an unknown item type -- throws an error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario as ScenarioInput)).toThrow();
  });
  it("a claim step referencing a damage item not part of the policy -- throws an error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };
    expect(() => runScenario(scenario as ScenarioInput)).toThrow();
  });
  it("a claim step with a negative damage amount -- throws an error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario as ScenarioInput)).toThrow();
  });
});
