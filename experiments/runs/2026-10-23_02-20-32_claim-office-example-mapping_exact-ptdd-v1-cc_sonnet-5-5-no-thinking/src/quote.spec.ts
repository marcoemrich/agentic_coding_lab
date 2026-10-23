import { describe, expect, it } from "vitest";
import type { Item } from "./item.js";
import { runScenario } from "./scenario.js";

function firstQuotePremium(items: Item[], yearsWithMHPCO = 0): unknown {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return results[0];
}

describe("quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(firstQuotePremium([])).toEqual({ premium: 5 });
  });

  it("newcomer, plain amulet -> 60 + 6 first insurance + 5 fee = 71 G", () => {
    expect(firstQuotePremium([{ type: "amulet" }])).toEqual({ premium: 71 });
  });

  it("newcomer, cursed sword (steel, enchantment 3) -> 165 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(firstQuotePremium([cursedSword])).toEqual({ premium: 165 });
  });

  it("sword with enchantment 5 -> high-enchantment surcharge: 100 + 30 + 10 + 5 = 145 G", () => {
    expect(firstQuotePremium([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });

  it("sword with enchantment 4 -> no high-enchantment surcharge: 115 G", () => {
    expect(firstQuotePremium([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
  });

  it("cursed sword with enchantment 4 -> curse only: 165 G", () => {
    const item = { type: "sword", enchantment: 4, cursed: true };
    expect(firstQuotePremium([item])).toEqual({ premium: 165 });
  });

  it("cursed sword with enchantment 5 -> both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const item = { type: "sword", enchantment: 5, cursed: true };
    expect(firstQuotePremium([item])).toEqual({ premium: 195 });
  });

  it("customer with exactly 2 years -> loyalty discount: 100 + 10 - 20 + 5 = 95 G", () => {
    expect(firstQuotePremium([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });

  it("customer with 1 year -> no loyalty discount: 115 G", () => {
    expect(firstQuotePremium([{ type: "sword" }], 1)).toEqual({ premium: 115 });
  });

  it("cursed sword + plain amulet, newcomer -> curse on the sword only: 210 + 16 + 5 = 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(firstQuotePremium(items)).toEqual({ premium: 231 });
  });

  it("loyalty discount applies to the policy base premium: cursed sword + amulet, 3 years -> 199 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(firstQuotePremium(items, 3)).toEqual({ premium: 199 });
  });

  it("second quote of a newcomer -> follow-up discount: 100 + 10 - 15 + 5 = 100 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 100 });
  });

  it("later quotes keep the follow-up discount, claim steps in between do not matter", () => {
    const damages = [{ itemType: "sword", amount: 500 }];
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages } },
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[0]).toEqual({ premium: 115 });
    expect(results[2]).toEqual({ premium: 100 });
    expect(results[3]).toEqual({ premium: 100 });
  });

  it("long-standing customer's second quote, cursed sword enchantment 7 -> 160 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  it("7 runes, newcomer -> 197.5 G rounds up to 198 G", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(firstQuotePremium(runes)).toEqual({ premium: 198 });
  });

  it("unknown item type (broomstick) -> quote is rejected with an error", () => {
    expect(() => firstQuotePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
  });

});
