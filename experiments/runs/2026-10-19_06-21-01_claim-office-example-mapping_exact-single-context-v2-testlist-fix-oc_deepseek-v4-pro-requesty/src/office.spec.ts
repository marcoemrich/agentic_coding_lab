import { describe, it, expect } from "vitest";
import { processScenario } from "./office.js";

describe("MHPCO Claim Office", () => {
  it("should quote an empty item list at 5 G (only the processing fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });

  it("should quote a single sword at 115 G (100 base + 10% first insurance + 5 fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });

  it("should quote a single amulet at 71 G (60 base + 10% first insurance + 5 fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });

  it("should quote a single staff at 93 G (80 base + 10% first insurance + 5 fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });

  it("should quote a single potion at 49 G (40 base + 10% first insurance + 5 fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  it("should quote 2 runes at 60 G (50 base + 10% first insurance + 5 fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });

  it("should quote 3 runes at 71 G (60 block base + 10% first insurance + 5 fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });

  it("should quote 4 runes at 115 G (100 base, no block + 10% first insurance + 5 fee)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });

  it("should quote 7 runes at 198 G (175 base + 17.5 first insurance + 5 fee, rounded up)", () => {
    const items = Array(7).fill({ type: "rune" });
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });

  it("should quote 2 runes + 1 moonstone at 88 G (75 base, no block + 10% + 5 fee)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });

  it("should quote 3 runes + 3 moonstones at 137 G (two blocks = 120 base + 10% + 5 fee)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  it("should apply cursed surcharge only to the cursed item in a multi-item policy", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  it("should apply loyalty discount at exactly 2 years with MHPCO", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });

  it("should apply high-enchantment surcharge at exactly enchantment 5", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });

  it("should apply both curse and high-enchantment surcharges to a cursed enchanted-5 sword", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });

  it("should not apply high-enchantment surcharge at enchantment 4", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });

  it("should apply 15% follow-up discount on a second contract", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  it("should quote a newcomer's cursed sword at 165 G (integration)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });

  it("should quote a long-standing customer's second contract cursed sword at 160 G (integration)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  it("should compute cap from unmodified insurance value regardless of premium modifiers", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });

  it("should exclude the block discount from the insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });

  it("should pay 400 for dragon sword enchantment 8, damage 1000 (50% then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  it("should pay 600 for a dragon attack damaging a sword (500) and amulet (300) with per-item deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  it("should pay 400 for a regular steel sword enchantment 3, damage 500", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  it("should pay 100 for a rune, damage 200 (full minus deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  it("should pay 400 for dragon sword enchantment 9, damage 1000 (50% wins then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  it("should pay 700 for dragon sword enchantment 5, damage 800 (dragon clause only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });

  it("should pay 400 for steel sword enchantment 9, damage 1000 (high-enchantment clause only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  it("should round payout 350.5 down to 350", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  it("should treat two sword damages as separate entries with own deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });

  it("should reject a claim with more damages of a type than the policy covers", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  it("should reduce payout to remaining cap on an exhausted policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }],
    });
  });

  it("should reject a quote with an unknown item type", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    expect(() => processScenario(scenario)).toThrow();
  });

  it("should reject a claim referencing a damage item not in the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  it("should reject a claim with a negative damage amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
});