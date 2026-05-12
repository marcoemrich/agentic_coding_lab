import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office - Premium Quoting", () => {
  it("should quote a single sword with base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should quote a single amulet with base premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should quote a single component (rune/moonstone)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "mithril", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(32);
  });
  it("should apply special premium for 3 alike components", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "mithril", enchantment: 0, cursed: false },
            { type: "rune", material: "mithril", enchantment: 0, cursed: false },
            { type: "rune", material: "mithril", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
  it("should add 50% surcharge for cursed items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "cursed steel", enchantment: 3, cursed: true }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(172);
  });
  it("should add 30% surcharge for highly enchanted items (level >= 5)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(149);
  });
  it("should apply 10% initial assessment surcharge for first insurance", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(115);
  });
  it("should apply 15% discount for repeat insurance contracts", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(89);
  });
  it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(84);
  });
  it("should add 5 G processing fee to every premium", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false }
          ]
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(71);
  });
});

describe("MHPCO Claim Office - Claims Processing", () => {
  it("should process a basic claim with single damage item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 200 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toHaveProperty("premium", 115);
    expect(result.results[1]).toHaveProperty("payout", 100);
    expect(result.results[1]).toHaveProperty("remainingCap", 130);
  });
  it("should apply 100 G deductible per damage event", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "rust",
            damages: [
              { itemType: "sword", amount: 50 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(0);
  });
  it("should reimburse at 50% for items with enchantment level >= 8", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false }
          ]
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "magic",
            damages: [
              { itemType: "sword", amount: 200 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(0);
  });
  it("should fully reimburse damage to dragon material items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 3, cursed: false }
          ]
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "impact",
            damages: [
              { itemType: "sword", amount: 200 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(100);
  });
  it("should cap total payout at 2x the insurance sum across multiple claims", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 200 }
            ]
          }
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "water",
            damages: [
              { itemType: "sword", amount: 200 }
            ]
          }
        }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(130);
    expect(result.results[2].payout).toBe(100);
    expect(result.results[2].remainingCap).toBe(30);
  });
});
