import { describe, it, expect } from "vitest";
import { processScenario } from "./process-scenario.js";

function scenario(customer: { yearsWithMHPCO: number }, steps: any[]) {
  return { customer, steps };
}

describe("Claim Office", () => {
  it("should return premium of 5 G for empty item list (only processing fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [{ op: "quote", items: [] }]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  it("should return premium 115 G for single plain sword (100 base + 10 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should return premium 71 G for single plain amulet (60 base + 6 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should return premium 93 G for single plain staff (80 base + 8 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("should return premium 49 G for single plain potion (40 base + 4 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 49 });
  });
  it("should return premium 33 G for single rune (25 base + 2.5 first insurance + 5 fee = 32.5 rounded up)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  it("should add 50% cursed surcharge to cursed sword — newcomer: 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  it("should add 30% high-enchantment surcharge for enchantment ≥ 5 — sword enchantment 5: 145 G (100 base + 30 high-ench + 10 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("should NOT add high-enchantment surcharge for enchantment 4 — plain sword: 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  it("should apply both cursed and high-enchantment surcharges — cursed sword enchantment 5: 195 G (100 base + 50 curse + 30 high-ench + 10 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  it("should apply 20% loyalty discount for customer with ≥ 2 years — plain sword, 2 years, first quote: 95 G (100 base - 20 loyalty + 10 first insurance + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 2 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 95 });
  });

  it("should apply loyalty discount at exactly 2 years threshold — plain sword, exactly 2 years: 95 G", () => {
    const input = scenario({ yearsWithMHPCO: 2 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 95 });
  });

  it("should apply 15% follow-up contract discount on second quote — two sequential sword quotes: first 115 G, second 100 G (100 base + 10 first insurance - 15 follow-up + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  it("should apply follow-up contract discount from second quote onward — three sequential sword quotes, third gets discount", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
    expect(result.results[2]).toEqual({ premium: 100 });
  });

  it("should apply first insurance surcharge to every item even on follow-up contract — from integration example spec clarification", () => {
    const input = scenario({ yearsWithMHPCO: 3 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 95 });
    expect(result.results[1]).toEqual({ premium: 50 });
  });

  it("should apply all modifiers combined — long-standing customer (3 yrs) second contract, cursed sword enchantment 7: 160 G (100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up + 5 fee)", () => {
    const input = scenario({ yearsWithMHPCO: 3 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it("should compute base premium 50 G for 2 runes (2 × 25, no block)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "rune" }, { type: "rune" },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("should compute base premium 60 G for 3 runes (block applies)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should compute base premium 100 G for 4 runes (4 × 25, no block — block requires exactly 3)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should compute base premium 175 G for 7 runes (7 × 25, no block)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  it("should treat runes and moonstones as different component types — 2 runes + 1 moonstone: 75 G base (3 × 25, no block)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("should form separate blocks for each component type — 3 runes + 3 moonstones: 120 G base (60 + 60, two blocks)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  it("should apply cursed surcharge only to the cursed item, not policy total — cursed sword + plain amulet: policy base 160 G, curse adds 50 G, total before fee 231 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  it("should compute insurance sum for two swords: 2000 G (2 × 1000), cap 4000 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 225 });
  });

  it("should compute insurance sum for sword + amulet: 1600 G (1000 + 600), cap 3200 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 181 });
  });

  it("should pay 400 G for standard sword (steel, enchantment 3) damage 500 G — 500 - 100 deductible = 400 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should pay 100 G for rune damage 200 G — 200 - 100 deductible = 100 G (runes have no enchantment or material)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  it("should apply 100 G deductible per damaged item — dragon attack damages sword (500 G) and amulet (300 G): payout 600 G ((500-100)+(300-100))", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it("should reimburse at 50% for enchantment ≥ 8 — dragon-material sword enchantment 8, damage 1000 G: 50% of 1000 = 500, then -100 deductible = 400 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should fully reimburse dragon material — dragon-material sword enchantment 5, damage 800 G: 800 - 100 deductible = 700 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should apply 50% rule when both clauses applicable — dragon-material sword enchantment 9, damage 1000 G: 50% of 1000 = 500, then -100 deductible = 400 G (50% rule wins over dragon material)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should apply only high-enchantment clause for non-dragon material — steel sword enchantment 9, damage 1000 G: 50% of 1000 = 500, then -100 deductible = 400 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("should treat each damage entry as separate damage with own deductible — two swords damaged by dragon attack", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  it("should cap total payout at 2× insurance sum — first claim 1500 G on 1000 G sword: payout 1400 G, remainingCap 600 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("should reduce second claim to remaining cap — second claim 1500 G on same policy: payout 600 G, remainingCap 0 G", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it("should process full schema example — quote amulet then claim: premium 71 G, payout 100 G (200-100), remainingCap 1100 G (2×600=1200, 1200-100)", () => {
    const input = scenario({ yearsWithMHPCO: 0 }, [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ]);
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 71 });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it("should reject claim if damage count exceeds insured count — 2 sword damages but only 1 sword insured", () => {
    expect(() => {
      const input = scenario({ yearsWithMHPCO: 0 }, [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] } },
      ]);
      processScenario(input);
    }).toThrow();
  });

  it("should reject claim with unknown item type in quote", () => {
    expect(() => {
      const input = scenario({ yearsWithMHPCO: 0 }, [
        { op: "quote", items: [{ type: "broomstick" }] },
      ]);
      processScenario(input);
    }).toThrow();
  });

  it("should reject claim with item not in policy", () => {
    expect(() => {
      const input = scenario({ yearsWithMHPCO: 0 }, [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ]);
      processScenario(input);
    }).toThrow();
  });

  it("should reject claim with negative damage amount", () => {
    expect(() => {
      const input = scenario({ yearsWithMHPCO: 0 }, [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ]);
      processScenario(input);
    }).toThrow();
  });
});