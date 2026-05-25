import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- QUOTE TESTS ---

  it("Empty item list should result in premium of 5 G (only the processing fee) -- 5 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [] }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 5 }
      ]
    });
  });

  it("Single item: plain Sword (base 100 G) with newcomer customer should result in 115 G (100 base + 10 first insurance + 5 fee) -- 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 115 }
      ]
    });
  });

  it("Single item: plain Amulet (base 60 G) with newcomer customer should result in 71 G (60 base + 6 first insurance + 5 fee) -- 71 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 71 }
      ]
    });
  });

  it("Single item: plain Staff (base 80 G) with newcomer customer should result in 93 G (80 base + 8 first insurance + 5 fee) -- 93 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 93 }
      ]
    });
  });

  it("Single item: plain Potion (base 40 G) with newcomer customer should result in 49 G (40 base + 4 first insurance + 5 fee) -- 49 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 49 }
      ]
    });
  });

  it("Single component: 1 rune should result in base 25 G, premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5 G, rounded up) -- 33 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 33 }
      ]
    });
  });

  it("Single component: 1 moonstone should result in base 25 G, premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5 G, rounded up) -- 33 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "moonstone" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 33 }
      ]
    });
  });

  it("2 alike components: 2 runes should result in 60 G (50 base + 5 first insurance + 5 fee) -- 60 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 60 }
      ]
    });
  });

  it("3 alike components: 3 runes should result in 71 G (60 base + 6 first insurance + 5 fee) -- 71 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 71 }
      ]
    });
  });

  it("4 alike components: 4 runes should result in 115 G (100 base + 10 first insurance + 5 fee) -- 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 115 }
      ]
    });
  });

  it("7 alike components: 7 runes should result in 198 G (175 base + 17.5 first insurance + 5 fee = 197.5 G, rounded up) -- 198 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "rune" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 198 }
      ]
    });
  });

  it("Different component types: 2 runes + 1 moonstone should result in 88 G (75 base + 7.5 first insurance + 5 fee = 87.5 G, rounded up) -- 88 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" }, { type: "rune" }, { type: "moonstone" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 88 }
      ]
    });
  });

  it("Multiple blocks: 3 runes + 3 moonstones should result in 137 G (120 base + 12 first insurance + 5 fee) -- 137 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 137 }
      ]
    });
  });

  it("Cursed sword with newcomer should result in 165 G (100 G base + 50 G curse + 10 G first insurance + 5 G fee) -- 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 165 }
      ]
    });
  });

  it("Highly enchanted item: sword with enchantment 5 should add 30 % risk surcharge -- 30 G surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 145 } // 100 G base + 30 G enchantment + 10 G first insurance (10% of 100 G) + 5 fee = 145 G
      ]
    });
  });

  it("Highly enchanted item threshold: sword with enchantment 4 should not add surcharge -- 0 G surcharge", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 115 }
      ]
    });
  });

  it("Long-standing customer (exactly 2 years) should receive 20 % loyalty discount -- 20 % loyalty", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results).toEqual({
      results: [
        { premium: 95 } // 100 base + 10 first insurance - 20 loyalty (20% of 100 G) = 90 G + 5 G fee = 95 G
      ]
    });
  });

  it("Long-standing customer (3 years) second contract with cursed sword (enchantment 7) should result in 160 G -- 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [] // dummy first quote
        },
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true }
          ]
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      premium: 160
    });
  });

  // --- CLAIM TESTS ---

  it("Claim: standard reimbursement (no special clauses) sword (enchantment 3) with damage 500 G should result in 400 G payout (500 - 100 deductible) -- 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 400,
      remainingCap: 1600 // sword sum is 1000 G, cap is twice the sum = 2000 G. Remaining cap = 2000 - 400 = 1600 G
    });
  });

  it("Claim: damage to a rune (value 250 G) with damage 200 G should result in 100 G payout (200 - 100 deductible) -- 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "loss",
            damages: [
              { itemType: "rune", amount: 200 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 100,
      remainingCap: 400 // rune sum is 250 G, cap is 500 G. Remaining cap = 500 - 100 = 400 G
    });
  });

  it("Claim: damage to item with enchantment level >= 8 (steel sword, enchantment 9) with damage 1000 G should result in 400 G payout (50% first, then deductible: 500 - 100) -- 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 1000 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 400,
      remainingCap: 1600 // sword sum is 1000 G, cap is 2000 G. Remaining cap = 2000 - 400 = 1600 G
    });
  });

  it("Claim: dragon material with enchantment 5 with damage 800 G should result in 700 G payout (full reimbursement, then deductible: 800 - 100) -- 700 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 800 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 700,
      remainingCap: 1300 // sword sum is 1000 G, cap is 2000 G. Remaining cap = 2000 - 700 = 1300 G
    });
  });

  it("Claim: dragon material with enchantment 9 with damage 1000 G should result in 400 G payout (both clauses apply; 50% rule wins, then deductible: 500 - 100) -- 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 1000 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 400,
      remainingCap: 1600 // sword sum is 1000 G, cap is 2000 G. Remaining cap = 2000 - 400 = 1600 G
    });
  });

  it("Claim: deductible per damage event with multiple items (sword 500 G and amulet 300 G) should result in 600 G payout -- 600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 600, // (500 - 100) + (300 - 100) = 400 + 200 = 600 G
      remainingCap: 2600 // total sum is 1000 + 600 = 1600 G. Cap is 3200 G. Remaining = 3200 - 600 = 2600 G
    });
  });

  it("Claim: multiple items of same type should have correct insurance sum and cap (2 swords -> insurance sum 2000 G, cap 4000 G) -- 4000 G cap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 1500 },
              { itemType: "sword", amount: 1500 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 2800, // (1500 - 100) + (1500 - 100) = 1400 + 1400 = 2800 G
      remainingCap: 1200 // Cap is 4000 G. Remaining = 4000 - 2800 = 1200 G
    });
  });

  it("Claim: cap exhaustion successive claims (1st claim -> payout 1400 G, remaining cap 600 G) -- 1400 G payout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "loss",
            damages: [
              { itemType: "sword", amount: 1500 }
            ]
          }
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "loss",
            damages: [
              { itemType: "sword", amount: 1500 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[1]).toEqual({
      payout: 1400,
      remainingCap: 600
    });
  });

  it("Claim: cap exhaustion successive claims (2nd claim -> payout 600 G, remaining cap 0 G) -- 600 G payout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "loss",
            damages: [
              { itemType: "sword", amount: 1500 }
            ]
          }
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "loss",
            damages: [
              { itemType: "sword", amount: 1500 }
            ]
          }
        }
      ]
    };
    const results = runScenario(scenario);
    expect(results.results[2]).toEqual({
      payout: 600,
      remainingCap: 0
    });
  });

  // --- EDGE CASES & ERROR HANDLING ---

  it("Quote should reject if unknown item type is provided -- should reject", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "broomstick" }
          ]
        }
      ]
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("Claim should reject if damages contains more entries than policy covers -- should reject", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword" }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 }
            ]
          }
        }
      ]
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("Claim should reject if damage amount is negative -- should reject", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword" }
          ]
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: -200 }
            ]
          }
        }
      ]
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
