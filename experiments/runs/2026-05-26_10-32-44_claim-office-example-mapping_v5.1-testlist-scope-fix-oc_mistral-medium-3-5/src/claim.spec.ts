import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Operation", () => {
  // === Deductible ===
  it("should apply 100 G deductible per damage event to sword damage 500 G -> payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(400);
  });
  it("should apply 100 G deductible per damage event to amulet damage 300 G -> payout 200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(200);
  });
  it("should apply 100 G deductible to rune damage 200 G -> payout 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(100);
  });
  it("should apply 100 G deductible once per damage event (dragon attack: sword 500 + amulet 300 = 600 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { 
          cause: "dragon attack", 
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] 
        } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(600);
  });
  it("should apply 100 G deductible per damage event to amulet damage 300 G -> payout 200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(200);
  });
  it("should apply 100 G deductible to rune damage 200 G -> payout 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(100);
  });
  it("should apply 100 G deductible once per damage event (dragon attack: sword 500 + amulet 300 = 600 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { 
          cause: "dragon attack", 
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] 
        } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(600);
  });

  // === Special Clauses ===
  it("should reimburse 50% for enchantment >= 8: sword enchantment 8 damage 1000 -> payout 400 G (500 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(400);
  });
  it("should fully reimburse dragon material items: dragon sword damage 800 -> payout 700 G (800 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(700);
  });
  it("should apply 50% rule for dragon sword with enchantment 9 damage 1000 -> payout 400 G (500 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(400);
  });
  it("should apply full reimbursement for dragon sword with enchantment 5 damage 800 -> payout 700 G (800 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(700);
  });
  it("should apply 50% rule for steel sword with enchantment 9 damage 1000 -> payout 400 G (500 - 100)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(400);
  });

  // === Cap ===
  it("should cap payout at twice insurance sum: sword (1000) cap 2000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(2000);
  });
  it("should cap payout at twice insurance sum: sword + amulet (1600) cap 3200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2000 }, { itemType: "amulet", amount: 2000 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(3200);
  });
  it("should track remaining cap across multiple claims: first claim 1500 on sword (1000) -> payout 1400, remaining 600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
  });
  it("should track remaining cap across multiple claims: second claim 1500 on sword -> payout 600, remaining 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // === Multiple Items of Same Type ===
  it("should treat each damage entry as separate with own deductible: two swords damaged -> each gets 100 G deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { 
          cause: "dragon attack", 
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] 
        } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(600);
  });
  it("should calculate insurance sum for two swords as 2000 G, cap 4000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(225);
  });

  // === Rounding ===
  it("should round down payout 350.5 G to 350 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
      ]
    };
    const result = processScenario(scenario);
    expect(result.results[1].payout).toBe(350);
  });
  it("should round up premium 197.5 G to 198 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    };
    const result = processScenario(scenario);
    expect(result.results[0].premium).toBe(198);
  });

  // === Error Cases ===
  it("should exit with error for damage to item not in policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for more damage entries of a type than insured", () => {
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
  it("should exit with error for negative damage amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should exit with error for unknown item type in damage", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 500 }] } }
      ]
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});
