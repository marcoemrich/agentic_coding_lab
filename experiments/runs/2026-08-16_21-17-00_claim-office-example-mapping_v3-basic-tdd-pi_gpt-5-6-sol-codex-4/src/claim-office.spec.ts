import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("quotes", () => {
  it.each([
    [[], 5],
    [[{ type: "sword" }], 115],
    [[{ type: "rune" }, { type: "rune" }], 60],
    [[{ type: "rune" }, { type: "rune" }, { type: "rune" }], 71],
    [[{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 88],
  ])("prices items", (items, premium) => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium }] });
  });

  it("only discounts an exact block of three alike components", () => {
    const quote = (types: string[]) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    });
    expect(quote(["rune", "rune", "rune", "rune"])).toEqual({ results: [{ premium: 115 }] });
    expect(quote(Array(7).fill("rune"))).toEqual({ results: [{ premium: 198 }] });
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toEqual({ results: [{ premium: 137 }] });
  });

  it("scopes and stacks modifiers", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  it("rounds only the final premium upward", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    })).toEqual({ results: [{ premium: 28 }] });
  });
});

describe("claims", () => {
  it("applies clauses, a deductible per damage, and tracks the cap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }, { itemType: "amulet", amount: 300 }] } },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 211 }, { payout: 600, remainingCap: 2600 }, { payout: 2400, remainingCap: 200 }] });
  });

  it("rounds the final payout down and deducts per entry", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }, { itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 750, remainingCap: 3250 });
  });

  it("computes caps from unmodified values including every component", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 3500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3400, remainingCap: 100 });
  });

  it.each([
    [{ op: "quote", items: [{ type: "broomstick" }] }, "unknown item type"],
    [{ op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 2 }] } }, "not covered"],
    [{ op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -2 }] } }, "negative"],
    [{ op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 2 }, { itemType: "sword", amount: 2 }] } }, "not covered"],
  ])("rejects invalid operations", (step, message) => {
    const steps = step.op === "claim" ? [{ op: "quote", items: [{ type: "sword" }] }, step] : [step];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(message);
  });
});
