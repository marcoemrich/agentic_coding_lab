import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";
import type { ScenarioInput } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("quote: empty item list → premium 5 G (only processing fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("quote: single plain sword → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote: single plain amulet → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote: single plain staff → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("quote: single plain potion → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 49 });
  });
  it("quote: single rune → premium 33 G (25 base + 2.5 first insurance → 27.5 → ceil 28 + 5 fee = 33)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("quote: single moonstone → premium 33 G (same as rune)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("quote: sword and amulet → premium 181 G (160 base + 16 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 181 });
  });

  it("quote: 2 runes → premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("quote: 3 runes (block of exactly 3) → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote: 4 runes (no block) → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote: 7 runes (no block) → premium 198 G (175 base + 17.5 first insurance = 192.5 → ceil 193 + 5 = 198)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("quote: 2 runes + 1 moonstone (different types, no block) → premium 88 G (75 base + 7.5 first insurance = 82.5 → ceil 83 + 5 = 88)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("quote: 3 runes + 3 moonstones (two blocks) → premium 137 G (120 base + 12 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  it("quote: cursed sword (enchantment 3) → premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("quote: sword with enchantment 5 → premium 145 G (100 + 30 high enchant + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("quote: cursed sword with enchantment 5 (both surcharges) → premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  it("quote: sword with enchantment 4 (below threshold) → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote: cursed sword with enchantment 4 (only curse) → premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 4 }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("quote: cursed sword + plain amulet → premium 231 G (160 base + 50 curse on sword + 16 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }, { type: "amulet" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  it("quote: customer with exactly 2 years → loyalty applies → premium 95 G (100 - 20 loyalty + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("quote: customer with 1 year (below loyalty threshold) → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote: follow-up contract (second quote in scenario) with sword → premium 100 G (100 + 10 first insurance - 15 follow-up + 5 fee)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  it("quote: newcomer with cursed sword (0 years, first quote) → premium 165 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3, material: "steel" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("quote: long-standing customer's second contract (3 years, second quote, cursed sword enchantment 7) → premium 160 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7, material: "steel" }] },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it("quote: premium calculation yielding 197.5 G → rounded up to 198 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    const result = processScenario(input);
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  it("claim: regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: damage to a rune, damage 200 G → payout 100 G, remainingCap 400 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim: dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G, remainingCap 2600 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claim: dragon-material sword, enchantment 9, damage 1000 G → payout 400 G, remainingCap 1600 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword, enchantment 5, damage 800 G → payout 700 G, remainingCap 1300 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim: steel sword, enchantment 9, damage 1000 G → payout 400 G, remainingCap 1600 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword, enchantment 8, damage 1000 G → payout 400 G, remainingCap 1600 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: two swords insured, both damaged (400 G each) → payout 600 G, remainingCap 3400 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 400 }, { itemType: "sword", amount: 400 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("claim: more damage entries of a type than insured → error thrown", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 400 }, { itemType: "sword", amount: 300 }] } },
      ],
    };
    expect(() => processScenario(input)).toThrow();
  });
  it("claim: sword + amulet policy → cap 3200 G verified via claim", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("claim: cursed sword → cap 2000 G (based on unmodified insurance value)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("claim: sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("claim: two swords → insurance sum 2000 G, cap 4000 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("claim: two successive claims of 1500 G on sword → first payout 1400 G (cap rem 600), second payout 600 G (cap rem 0)", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("claim: payout calculation yielding 350.5 G → rounded down to 350 G", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 801 }] } },
      ],
    };
    const result = processScenario(input);
    expect(result.results[1].payout).toBe(300);
  });
  it("quote: unknown item type → error thrown", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => processScenario(input)).toThrow();
  });
  it("claim: damage to item not in policy → error thrown", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(() => processScenario(input)).toThrow();
  });
  it("claim: damage entry with negative amount → error thrown", () => {
    const input: ScenarioInput = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => processScenario(input)).toThrow();
  });
});
