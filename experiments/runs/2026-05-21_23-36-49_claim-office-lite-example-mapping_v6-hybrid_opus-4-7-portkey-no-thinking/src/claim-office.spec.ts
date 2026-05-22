import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Base premium calculation - simplest cases
  it("empty item list yields premium of only the 5 G processing fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("quote for a single plain sword for a newcomer yields 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote for a single plain amulet for a newcomer yields 71 G (60 + 6 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote for a single plain staff for a newcomer yields 93 G (80 + 8 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("quote for a single plain potion for a newcomer yields 49 G (40 + 4 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });
  it("quote for a single rune component for a newcomer yields 33 G (25 + 2.5 first-ins + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  // Multiple items
  it("quote for two plain swords for a newcomer yields 225 G (2*(100+10) + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 225 });
  });

  // Component block discount
  it("quote for 2 runes for a newcomer yields 60 G (2*25 + 5 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("quote for exactly 3 runes uses 60 G block base premium (60 + 6 first-ins + 5 fee = 71 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote for 4 runes for a newcomer yields 115 G (4*25 + 10 first-ins + 5 fee; no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote for 3 runes + 3 moonstones applies two separate blocks (120 + 12 + 5 = 137 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Item-specific modifiers
  it("cursed sword + plain amulet (newcomer) → only sword gets curse surcharge", () => {
    // sword: 100 + 50 curse + 10 first-ins = 160
    // amulet: 60 + 6 first-ins = 66
    // total: 226 + 5 fee = 231
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet", cursed: false },
      ] }],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("highly enchanted (level 5) sword (newcomer) adds 30% surcharge → 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("cursed AND highly enchanted (level 5) sword (newcomer) stacks both → 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // Policy-wide modifiers
  it("long-standing customer (2 years) with plain sword → 95 G (100 + 10 first-ins - 20 loyalty + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it.todo("first quote in scenario adds 10% first-insurance surcharge (covered by earlier tests)");
  it("second quote in scenario gets 15% follow-up contract discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // quote 1: 100 + 10 first-ins + 5 fee = 115
    // quote 2: 100 + 10 first-ins - 15 follow-up + 5 fee = 100
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // Rounding
  it("premium rounds up - 197.5 G → 198 G per spec", () => {
    // construct: 3 swords newcomer (3*(100+10)+5 = 335, integer). need .5 result.
    // Use 1 amulet + 1 rune (newcomer): 60+6 + 25+2.5 + 5 = 98.5 → 99
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 99 });
  });

  // Newcomer integration example: cursed sword -> 165 G
  it("newcomer cursed sword integration example yields 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // Long-standing customer's second contract: 160 G
  it("long-standing customer's second contract integration yields 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claims - basic
  it("claim with standard damage subtracts 100 G deductible (regular sword damage 500 → 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("claim on highly enchanted (>= 8) item reimburses 50% then deductible (steel ench 9, damage 1000 → 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("dragon-material sword ench 5, damage 800 G → payout 700 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700 });
  });
  it("dragon material AND high enchantment - 50% rule wins, then deductible (dragon ench 9, damage 1000 → 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });
  it("multiple damage entries each get their own deductible (sword 500 + amulet 300 → 400 + 200 = 600)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600 });
  });
  it("payout rounds down in MHPCO's favor (ench 8 sword damage 1001 → 500.5 - 100 = 400.5 → 400)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1001 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400 });
  });

  // Error/edge cases
  it("quote with unknown item type throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/unknown item type.*broomstick/i);
  });
  it("claim referencing item not in policy throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow(/not.*polic|policy.*amulet/i);
  });
  it("claim with negative damage amount throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow(/negative.*damage|damage.*negative/i);
  });
  it("claim with more damage entries of a type than policy covers throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 300 },
            { itemType: "sword", amount: 400 },
          ] } },
        ],
      }),
    ).toThrow(/more.*damage|exceed|sword/i);
  });
});
