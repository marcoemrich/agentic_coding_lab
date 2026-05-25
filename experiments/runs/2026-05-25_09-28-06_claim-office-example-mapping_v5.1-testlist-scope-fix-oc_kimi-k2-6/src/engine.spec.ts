import { describe, it, expect } from "vitest";
import { processScenario } from "./engine.js";

describe("MHPCO Claim Office - Quote", () => {
  // Base premiums
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual([{ premium: 5 }]);
  });

  it("single sword → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual([{ premium: 115 }]);
  });

  it("single amulet → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual([{ premium: 71 }]);
  });

  it("single staff → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual([{ premium: 93 }]);
  });

  it("single potion → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual([{ premium: 49 }]);
  });

  it("single rune → premium 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual([{ premium: 33 }]);
  });

  it("single moonstone → premium 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual([{ premium: 33 }]);
  });

  // Component blocks
  it("2 runes → premium 60 G (50 base + 5 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual([{ premium: 60 }]);
  });

  it("3 runes → premium 71 G (60 block base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual([{ premium: 71 }]);
  });

  it("4 runes → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual([{ premium: 115 }]);
  });

  it("7 runes → premium 198 G (175 base + 17.5 first-insurance + 5 fee, rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual([{ premium: 198 }]);
  });

  it("2 runes + 1 moonstone → premium 88 G (75 base + 7.5 first-insurance + 5 fee, rounded up, no block)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual([{ premium: 88 }]);
  });

  it("3 runes + 3 moonstones → premium 137 G (120 base + 12 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual([{ premium: 137 }]);
  });

  // Item-specific modifiers
  it("cursed sword → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual([{ premium: 165 }]);
  });

  it("sword with enchantment 5 → premium 145 G (100 base + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual([{ premium: 145 }]);
  });

  it("cursed sword with enchantment 5 → premium 195 G (100 base + 50 curse + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual([{ premium: 195 }]);
  });

  it("sword with enchantment 4 → premium 115 G (no high-enchantment surcharge)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual([{ premium: 115 }]);
  });

  // Policy-wide modifiers
  it("sword for customer with exactly 2 years → premium 95 G (100 base + 10 first-insurance - 20 loyalty + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual([{ premium: 95 }]);
  });

  it("sword for customer with 0 years → premium 115 G (no loyalty discount)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual([{ premium: 115 }]);
  });

  it("second quote for sword → premium 100 G (100 base + 10 first-insurance - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  it("second quote for sword with 2 years loyalty → premium 80 G (100 base + 10 first-insurance - 20 loyalty - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual([{ premium: 95 }, { premium: 80 }]);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet for new customer → premium 231 G (160 policy-base + 50 curse + 16 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    });
    expect(result).toEqual([{ premium: 231 }]);
  });

  it("cursed sword + plain amulet for 2-year customer → premium 199 G (160 policy-base + 50 curse - 32 loyalty + 16 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    });
    expect(result).toEqual([{ premium: 199 }]);
  });

  // Integration examples
  it("newcomer with cursed sword (enchantment 3) → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3, material: "steel" }] }],
    });
    expect(result).toEqual([{ premium: 165 }]);
  });

  it("long-standing customer's second contract: cursed sword (enchantment 7), 3 years → premium 160 G (100 base + 50 curse + 30 high-enchantment - 20 loyalty + 10 first-insurance - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7, material: "steel" }] },
      ],
    });
    expect(result).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  // Rounding
  it("premium calculation yielding 197.5 G → rounds up to 198 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    // 7 runes = 175 base + 17.5 first-insurance + 5 fee = 197.5 → 198
    expect(result).toEqual([{ premium: 198 }]);
  });

  // Error cases
  it("unknown item type (e.g. broomstick) → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
});

describe("MHPCO Claim Office - Claim", () => {
  // Standard reimbursement
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("rune damage 200 G → payout 100 G (full reimbursement minus 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });

  // High enchantment
  it("steel sword enchantment 9, damage 1000 G → payout 400 G (50% rule: 500 - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins over dragon material: 500 - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("dragon-material sword enchantment 5, damage 800 G → payout 700 G (dragon material full reimbursement: 800 - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });

  // Multiple items damaged
  it("sword 500 G + amulet 300 G in one incident → payout 600 G (100 deductible per damaged item)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword" },
          { type: "amulet" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });

  // Cap
  it("policy with sword + amulet, insurance sum 1600 G, cap 3200 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      ],
    });
    expect(result).toEqual([{ premium: 181 }]);
  });

  it("cursed sword, insurance sum 1000 G, cap 2000 G (premium modifiers do not raise cap)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
      ],
    });
    expect(result).toEqual([{ premium: 165 }]);
  });

  it("sword + 3 runes, insurance sum 1750 G, cap 3500 G (block discount affects premium only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual([{ premium: 181 }]);
  });

  it("two swords, insurance sum 2000 G, cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      ],
    });
    expect(result).toEqual([{ premium: 225 }]);
  });

  // Cap exhaustion
  it("sword insured, first claim 1500 G → payout 1400 G, remaining cap 600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }]);
  });

  it("sword insured, second claim 1500 G after first → payout 600 G, remaining cap 0 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });

  // Multiple items of same type
  it("two swords insured, two sword damages → each treated as separate damage with own deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ] } },
      ],
    });
    expect(result).toEqual([{ premium: 225 }, { payout: 700, remainingCap: 3300 }]);
  });

  it("two damages for item type but only one insured → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ] } },
      ],
    })).toThrow();
  });

  // Rounding
  it("payout calculation yielding 350.5 G → rounds down to 350 G", () => {
    // Sword with enchantment 8, damage 901 G: 50% rule -> 450.5, minus 100 deductible -> 350.5 -> 350
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });

  // Error cases
  it("claim for item not in policy → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });

  it("claim with unknown item type → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    })).toThrow();
  });

  it("claim with negative damage amount → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});

describe("MHPCO Claim Office - Full Scenarios", () => {
  it("quote then claim: amulet quoted then damaged by fire → premium and payout correct", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
});
