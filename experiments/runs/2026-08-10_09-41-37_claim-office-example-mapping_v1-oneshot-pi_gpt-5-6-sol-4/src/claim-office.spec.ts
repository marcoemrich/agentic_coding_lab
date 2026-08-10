import { describe, expect, it } from "vitest";
import { processScenario, quotePremium, type Item, type Scenario } from "./claim-office.js";
const quote = (items: Item[], years = 0, previous = 0): number =>
  quotePremium({ yearsWithMHPCO: years }, items, previous);

function run(steps: Scenario["steps"], yearsWithMHPCO = 0) {
  return processScenario({ customer: { yearsWithMHPCO }, steps }).results;
}

describe("premium", () => {
  it("prices an empty policy and each main item", () => {
    expect(quote([])).toBe(5);
    expect(quote([{ type: "sword" }])).toBe(115);
    expect(quote([{ type: "amulet" }])).toBe(71);
    expect(quote([{ type: "staff" }])).toBe(93);
    expect(quote([{ type: "potion" }])).toBe(49);
  });

  it("applies component blocks only to exactly three alike components", () => {
    const components = (type: "rune" | "moonstone", count: number): Item[] =>
      Array.from({ length: count }, () => ({ type }));
    expect(quote(components("rune", 2))).toBe(60);
    expect(quote(components("rune", 3))).toBe(71);
    expect(quote(components("rune", 4))).toBe(115);
    expect(quote([...components("rune", 3), ...components("moonstone", 3)])).toBe(137);
  });

  it("scopes item and policy modifiers correctly", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
    expect(quote([{ type: "sword", cursed: true, enchantment: 7 }], 3, 1)).toBe(160);
  });

  it("rounds a final fractional premium upward", () => {
    expect(quote([{ type: "rune", cursed: true }], 0, 1)).toBe(42);
  });
});

describe("claims", () => {
  it("applies one deductible to every damage", () => {
    const results = run([
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ]);
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it("halves highly enchanted damage even for dragon material", () => {
    const results = run([
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1001 }] } },
    ]);
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("tracks and exhausts the unmodified insurance-value cap", () => {
    const results = run([
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "one", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "two", damages: [{ itemType: "sword", amount: 1500 }] } },
    ]);
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });

  it("rejects more damages than insured items", () => {
    expect(() => run([
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "x", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ])).toThrow(/uninsured sword/);
  });
});
