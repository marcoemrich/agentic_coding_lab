import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Empty / processing fee
  it("empty item list — premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for main items (no modifiers, 0 years, single item)
  it("single sword — base premium 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet — base premium 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff — base premium 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion — base premium 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("single rune — base premium 25 G + first insurance and fee = 33 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes — base premium 50 G (no block), total premium 60 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes — base premium 60 G (building block applies), total premium 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes — base premium 100 G (no block — block requires exactly 3), total 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes — base premium 175 G (no block — not exactly 3), total 198 G (rounded up from 197.5)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: Array(7).fill({ type: "rune" }),
      }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Alike components clarification (❓ alike means same type)
  it("2 runes + 1 moonstone — base premium 75 G (no block: different types), total 88 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones — base premium 120 G (two separate blocks), total 137 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers (in isolation)
  it("cursed sword adds 50% risk surcharge — total 165 G (100+50 curse, +10 first ins, +5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("highly enchanted sword (enchantment 5) adds 30% surcharge — total 145 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("enchantment 4 does not trigger high-enchantment surcharge — total 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed AND highly enchanted sword stacks both surcharges — total 195 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("long-standing customer (3 years) gets 20% loyalty discount — sword premium 95 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with exactly 2 years gets loyalty discount — sword premium 95 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance adds 10% surcharge on policy base — sword+amulet (no other modifiers) 181 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("follow-up contract gets 15% discount — second quote of sword = 100 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Modifier scope (❓ cursed surcharge applies only to cursed item)
  it("multi-item policy: cursed sword + plain amulet — 231 G (cursed surcharge 50 G on sword only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", cursed: true }, { type: "amulet" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Integration examples from spec
  it("newcomer with cursed sword (enchantment 3) — 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract: cursed sword enchantment 7 — 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Rounding
  it("premium that yields 197.5 G — rounded up to 198 G (verified via 7 runes case above)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // Claim — standard reimbursement
  it("regular sword (steel, enchantment 3), damage 500 G — payout 400 G, remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G — payout 100 G, remainingCap 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim — deductible per damage event
  it("dragon attack damages sword (500) and amulet (300) — payout 600 G (deductible per item)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim", policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim — high enchantment clause
  it("steel sword enchantment 9, damage 1000 G — payout 400 G (50% then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim — dragon material clause
  it("dragon-material sword enchantment 5, damage 800 G — payout 700 G (full minus deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Claim — both clauses apply, 50% wins
  it("dragon-material sword enchantment 9, damage 1000 G — payout 400 G (50% wins, then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment exactly 8, damage 1000 — payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim — cap exhaustion
  it("sword and amulet policy — insurance sum 1600 G, cap 3200 G (verified via claim remainingCap)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword — cap 2000 G (modifiers don't affect cap)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("sword + 3 runes — insurance sum 1750 G, cap 3500 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("two successive claims of 1500 G on a sword — first 1400/600, second 600/0", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire2", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multiple items of same type
  it("policy with two swords — insurance sum 2000 G, cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 2600 });
  });
  it("two swords damaged — each entry has its own deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim", policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages contain more entries of a type than insured — throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim", policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }],
          },
        },
      ],
    })).toThrow();
  });

  // Payout rounding (in MHPCO's favor: down)
  it("payout that yields 350.5 G — rounded down to 350 G (ench 8 sword, damage 901)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Edge cases — error handling
  it("quote with unknown item type — processScenario throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item not part of policy — throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "amulet", amount: 100 }] },
        },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount — throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fraud", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    })).toThrow();
  });

  // Multi-step scenarios
  it("follow-up contracts: third quote also gets follow-up discount", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results).toEqual([
      { premium: 115 },
      { premium: 100 },
      { premium: 100 },
    ]);
  });
});
