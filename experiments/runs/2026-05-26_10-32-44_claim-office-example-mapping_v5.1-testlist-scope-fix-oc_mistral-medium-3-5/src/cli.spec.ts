import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("CLI Integration", () => {
  it("should output empty results array for empty steps", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: []
    };
    const result = processScenario(scenario);
    expect(result.results).toEqual([]);
  });
  it("should process quote and claim steps in sequence", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results.length).toBe(2);
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].payout).toBe(400);
  });
  it("should exit with error for unknown item type in quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for damage to uninsured item in claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for negative damage amount in claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for more damage entries than insured items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { 
          cause: "fire", 
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] 
        } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});
