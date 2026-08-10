import { describe, expect, it } from "vitest";
import { processScenario, type Item, type Scenario } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0, priorItems?: Item[]): number => {
  const steps: Scenario["steps"] = [];
  if (priorItems) steps.push({ op: "quote", items: priorItems });
  steps.push({ op: "quote", items });
  const result = processScenario({ customer: { yearsWithMHPCO }, steps }).results.at(-1);
  if (!result || !("premium" in result)) throw new Error("Expected quote result");
  return result.premium;
};

const claimScenario = (items: Item[], damages: Array<{ itemType: string; amount: number }>, yearsWithMHPCO = 0) =>
  processScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "test incident", damages } },
    ],
  });

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at 5 G", () => expect(quote([])).toBe(5));
  it("quotes one plain sword at 115 G", () => expect(quote([{ type: "sword" }])).toBe(115));

  it.each([
    ["amulet", 71], ["staff", 93], ["potion", 49], ["rune", 33], ["moonstone", 33],
  ])("uses the price list for %s", (type, premium) => expect(quote([{ type }])).toBe(premium));

  it.each([
    [Array(2).fill({ type: "rune" }), 60, "2 runes have base 50"],
    [Array(3).fill({ type: "rune" }), 71, "3 runes have block base 60"],
    [Array(4).fill({ type: "rune" }), 115, "4 runes have base 100"],
    [Array(7).fill({ type: "rune" }), 198, "7 runes have base 175 and round 197.5 up"],
    [[{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 88, "mixed types do not form block"],
    [[...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })], 137, "separate types form two blocks"],
  ] as Array<[Item[], number, string]>)("prices components: %s", (items, premium) => expect(quote(items)).toBe(premium));

  it("scopes curse surcharge to affected item", () =>
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231));
  it("applies loyalty at exactly 2 years", () => expect(quote([{ type: "sword" }], 2)).toBe(95));
  it("applies curse and high enchantment at threshold 5", () =>
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195));
  it("does not apply high enchantment at 4", () =>
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165));
  it("quotes newcomer cursed sword at 165 G", () =>
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165));
  it("quotes long-standing second-contract cursed enchanted sword at 160 G", () =>
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, [])).toBe(160));

  it.each([
    [[{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }], 400],
    [[{ type: "rune" }], [{ itemType: "rune", amount: 200 }], 100],
    [[{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }], 600],
    [[{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }], 400],
    [[{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }], 400],
    [[{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }], 700],
    [[{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }], 400],
    [[{ type: "sword", material: "steel", enchantment: 8 }], [{ itemType: "sword", amount: 901 }], 350],
  ] as Array<[Item[], Array<{ itemType: string; amount: number }>, number]>)("calculates claim payout %#", (items, damages, payout) => {
    expect(claimScenario(items, damages).results[1]).toMatchObject({ payout });
  });

  it("gives two swords cap 4000 and separate deductibles", () => {
    const result = claimScenario([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]);
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects excess damage entries of one type", () =>
    expect(() => claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])).toThrow());
  it.each([
    [[{ type: "sword" }, { type: "amulet" }], 3200],
    [[{ type: "sword", cursed: true }], 2000],
    [[{ type: "sword" }, ...Array(3).fill({ type: "rune" })], 3500],
  ] as Array<[Item[], number]>)("bases cap on insurance value %#", (items, cap) => {
    const result = claimScenario(items, []);
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: cap });
  });
  it("exhausts cap across claims", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "one", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "two", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });

  it("rejects unknown quote types", () => expect(() => quote([{ type: "broomstick" }])).toThrow(/Unknown/));
  it("rejects absent or unknown damage types", () => {
    expect(() => claimScenario([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow();
    expect(() => claimScenario([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(/Unknown/);
  });
  it("rejects negative damage", () =>
    expect(() => claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/negative/));
  it("returns sequential quote and claim results in normative shape", () => {
    expect(claimScenario([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }], [{ itemType: "amulet", amount: 200 }], 5))
      .toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
