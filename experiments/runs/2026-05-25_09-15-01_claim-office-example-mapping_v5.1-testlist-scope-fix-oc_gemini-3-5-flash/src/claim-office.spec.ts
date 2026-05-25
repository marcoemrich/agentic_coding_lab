import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office - Premium Quote", () => {
  // 1. Empty item list
  it("should charge 5 G for empty item list (only processing fee) -- 5 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 5 });
  });

  // 2. Single standard items (base premiums)
  it("should charge 115 G for a standard sword (100 G base + 10 G first insurance + 5 G fee) -- 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 115 });
  });
  it("should charge 71 G for a standard amulet (60 G base + 6 G first insurance + 5 G fee) -- 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 71 });
  });
  it("should charge 93 G for a standard staff (80 G base + 8 G first insurance + 5 G fee) -- 93 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 93 });
  });
  it("should charge 49 G for a standard potion (40 G base + 4 G first insurance + 5 G fee) -- 49 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 49 });
  });
  // 3. Components (base premiums and blocks of 3)
  it("should charge 60 G for 2 runes (50 G base + 5 G first insurance + 5 G fee) -- 60 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 60 });
  });
  it("should charge 71 G for 3 runes as a block (60 G base + 6 G first insurance + 5 G fee) -- 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 71 });
  });
  it("should charge 115 G for 4 runes without a block (100 G base + 10 G first insurance + 5 G fee) -- 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 115 });
  });
  it("should charge 198 G for 7 runes (175 G base + 17.5 G first insurance + 5 G fee, rounded up) -- 198 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array(7).fill({ type: "rune" }) }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 198 });
  });
  it("should charge 88 G for 2 runes + 1 moonstone (75 G base + 7.5 G first insurance + 5 G fee, rounded up) -- 88 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 88 });
  });
  it("should charge 137 G for 3 runes + 3 moonstones as two blocks (120 G base + 12 G first insurance + 5 G fee) -- 137 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 137 });
  });

  // 4. Item-specific modifiers (cursed, enchantment >= 5)
  it("should charge 165 G for newcomer with a cursed sword (100 G base + 50 G curse + 10 G first insurance + 5 G fee) -- 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 165 });
  });
  it("should charge 145 G for a highly enchanted sword with enchantment level 5 (100 G base + 30 G enchantment + 10 G first insurance + 5 G fee) -- 145 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5 }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 145 });
  });
  it("should charge 115 G for a sword with enchantment level 4 (100 G base + 10 G first insurance + 5 G fee) -- 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 4 }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 115 });
  });
  it("should charge 195 G for a cursed and highly enchanted sword (100 G base + 50 G curse + 30 G enchantment + 10 G first insurance + 5 G fee) -- 195 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 195 });
  });

  // 5. Policy-wide modifiers (loyalty, follow-up contract)
  it("should charge 95 G for a loyal customer of 2 years with a regular sword (100 G base + 10 G first insurance - 20 G loyalty + 5 G fee) -- 95 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 95 });
  });
  it("should charge 100 G for a first-year customer's second contract with a regular sword (100 G base + 10 G first insurance - 15 G follow-up + 5 G fee) -- 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ premium: 100 });
  });
  it("should charge 160 G for a long-standing customer's second contract with cursed sword of enchantment level 7 -- 160 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // First quote to make the second a follow-up
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ premium: 160 });
  });
  it("should charge 210 G before modifiers and fee for a cursed sword and plain amulet policy -- 210 G", () => {
    // base policy 160 G, cursed adds 50% of the cursed sword's base (50 G), total = 210 G (before other modifiers & fee)
    // Here we'll calculate final premium of a policy covering cursed sword (100 G) and standard amulet (60 G)
    // Base premium = 160 G. Surcharge = 50 G (cursed sword). First insurance on base (10% * 160 = 16 G). Processing fee = 5 G.
    // Total = 160 + 50 + 16 + 5 = 231 G.
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[0]).toEqual({ premium: 231 });
  });
});

describe("MHPCO Claim Office - Claim Processing", () => {
  // 6. Standard reimbursement
  it("should pay 400 G for damage of 500 G to a regular steel sword -- 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // Policy 0 (Value: 1000 G, Cap: 2000 G)
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "rust",
            damages: [{ itemType: "sword", amount: 500 }]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should pay 100 G for damage of 200 G to a rune -- 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] }, // Policy 0 (Value: 250 G, Cap: 500 G)
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "loss",
            damages: [{ itemType: "rune", amount: 200 }]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  // 7. Special clauses (enchantment >= 8, dragon material)
  it("should pay 700 G for damage of 800 G to a dragon-material sword of enchantment 5 (full reimbursement minus deductible) -- 700 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon-material", enchantment: 5 }] }, // Policy 0 (Value: 1000 G, Cap: 2000 G)
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should pay 400 G for damage of 1000 G to a dragon-material sword of enchantment 9 (50% rate wins, then deductible) -- 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon-material", enchantment: 9 }] }, // Policy 0 (Value: 1000 G, Cap: 2000 G)
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should pay 400 G for damage of 1000 G to a steel sword of enchantment 9 (50% rate wins, then deductible) -- 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, // Policy 0 (Value: 1000 G, Cap: 2000 G)
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // 8. Deductible per damage event
  it("should apply deductible once per damaged item for a policy covering a sword and an amulet -- 600 G", () => {
    // dragon attack damages sword (500 G) and amulet (300 G)
    // payout = (500 - 100) + (300 - 100) = 400 + 200 = 600 G
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon-material" }, { type: "amulet", material: "dragon-material" }] }, // Policy 0 (Value: 1600 G, Cap: 3200 G)
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon-attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 }
            ]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // 9. Multiple items of same type
  it("should treat damages to multiple items of the same type as separate damages with their own deductibles -- 800 G", () => {
    // covers two swords (Steel and Dragon), damages contain two entries of 'sword' (500 G and 500 G)
    // Payout should be (500 - 100) + (500 - 100) = 800 G
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, // Policy 0 (Value: 2000 G, Cap: 4000 G)
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "clash",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 }
            ]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // 10. Cap exhaustion
  it("should cap successive claims to twice the unmodified insurance value of the policy -- 1400 G then 600 G", () => {
    // sword is insured (sum 1000 G, cap 2000 G); two successive claims of 1500 G each
    // first claim payout 1400 G, cap remaining 600 G
    // second claim payout 600 G, cap remaining 0 G
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // Policy 0
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "leak",
            damages: [{ itemType: "sword", amount: 1500 }]
          }
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "breakage",
            damages: [{ itemType: "sword", amount: 1500 }]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // 11. Rounding in claim payouts
  it("should round down final claim payout in MHPCO's favor if it yields a fraction -- 350 G", () => {
    // If payout calculation yields 350.5 G -> final payout 350 G (rounded down)
    // To get a fraction, we can damage a highly enchanted sword (level 9) with odd amount.
    // e.g. Damage 901 G.
    // 50% of 901 G is 450.5 G.
    // Payout = 450.5 - 100 deductible = 350.5 G.
    // Rounded down = 350 G.
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] }, // Policy 0
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "chipped",
            damages: [{ itemType: "sword", amount: 901 }]
          }
        }
      ]
    };
    const output = runScenario(input as any);
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 }); // remainingCap is also reduced by 350
  });

  // 12. Edge cases and errors
  it("should throw an error if quote includes an item with an unknown type -- error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "broomstick" }] }
      ]
    };
    expect(() => runScenario(input as any)).toThrow();
  });
  it("should throw an error if claim references a damage entry whose item is not part of the policy -- error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // Policy 0
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "loss",
            damages: [{ itemType: "amulet", amount: 200 }]
          }
        }
      ]
    };
    expect(() => runScenario(input as any)).toThrow();
  });
  it("should throw an error if claim contains a damage entry with a negative amount -- error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // Policy 0
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "loss",
            damages: [{ itemType: "sword", amount: -200 }]
          }
        }
      ]
    };
    expect(() => runScenario(input as any)).toThrow();
  });
  it("should throw an error if claim contains more damages of a given type than the policy covers -- error", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // Policy 0
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "clash",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 200 }
            ]
          }
        }
      ]
    };
    expect(() => runScenario(input as any)).toThrow();
  });
});
