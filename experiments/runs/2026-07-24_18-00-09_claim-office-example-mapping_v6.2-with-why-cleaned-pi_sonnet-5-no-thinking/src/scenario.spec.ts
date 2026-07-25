import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("Scenario runner (CLI core logic)", () => {
  it("runScenario returns [{premium: 5}] for a scenario with a single quote step with an empty item list", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });

  it("runScenario matches the schema example: amulet quote followed by a claim referencing policy 0, returning premium and payout/remainingCap", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toHaveProperty("premium");
    expect(result.results[1]).toHaveProperty("payout");
    expect(result.results[1]).toHaveProperty("remainingCap");
  });

  it("runScenario throws when a quote step includes an item with an unknown type (e.g. {type: 'broomstick'})", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("runScenario throws when a claim step's incident references a damage entry whose item is not part of the referenced policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("runScenario throws when a claim step's incident contains a damage entry with amount: -200", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("runScenario processes two successive claims against the same policy, reducing remainingCap correctly across steps (1400 G then 600 G payout, as in the cap exhaustion example)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it("runScenario returns 160 G for a long-standing customer's second quote step in the same scenario (integration example: first-insurance still applies, follow-up discount also applies)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet" }] },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", cursed: true, enchantment: 7 }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});
