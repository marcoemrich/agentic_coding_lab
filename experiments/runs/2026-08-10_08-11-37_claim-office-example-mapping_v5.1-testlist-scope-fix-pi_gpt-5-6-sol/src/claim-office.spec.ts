import { describe, expect, it } from "vitest";
import { basePremium, insuranceSum, ITEM_PRICES, processScenario, quotePremium, type Item, type Scenario } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });

const claim = (items: Item[], damages: Array<{ itemType: string; amount: number }>) =>
  processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "test", damages } },
  ] });

const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra });

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(quote([])).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion base premiums and insurance values", () => {
    expect(ITEM_PRICES).toMatchObject({ sword: { insuranceValue: 1000, basePremium: 100 }, amulet: { insuranceValue: 600, basePremium: 60 }, staff: { insuranceValue: 800, basePremium: 80 }, potion: { insuranceValue: 400, basePremium: 40 } });
  });
  it("prices 2 runes at a 50 G base premium", () => expect(basePremium([item("rune"), item("rune")])).toBe(50));
  it("prices exactly 3 runes as a 60 G building block", () => expect(basePremium(Array.from({ length: 3 }, () => item("rune")))).toBe(60));
  it("prices 4 runes at 100 G because a block requires exactly 3", () => expect(basePremium(Array.from({ length: 4 }, () => item("rune")))).toBe(100));
  it("prices 7 runes at 175 G with no partial building block", () => expect(basePremium(Array.from({ length: 7 }, () => item("rune")))).toBe(175));
  it("prices 2 runes plus 1 moonstone at 75 G because alike means identical type", () => expect(basePremium([item("rune"), item("rune"), item("moonstone")])).toBe(75));
  it("prices 3 runes plus 3 moonstones as two separate blocks totaling 120 G", () => expect(basePremium([...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))])).toBe(120));
  it("applies a cursed surcharge only to the cursed sword, producing 210 G before policy modifiers and fee", () => {
    expect(quotePremium([item("sword", { cursed: true }), item("amulet")], 0)).toBe(231);
    expect(basePremium([item("sword"), item("amulet")]) + 50).toBe(210);
  });
  it("applies the 20% loyalty discount at exactly 2 years", () => expect(quotePremium([item("sword")], 2)).toBe(95));
  it("applies both 50% curse and 30% high-enchantment surcharges at enchantment 5", () => expect(quotePremium([item("sword", { cursed: true, enchantment: 5 })], 0)).toBe(195));
  it("does not apply high-enchantment surcharge at enchantment 4", () => expect(quotePremium([item("sword", { cursed: true, enchantment: 4 })], 0)).toBe(165));
  it("rounds a 197.5 G premium up to 198 G only at the end", () => expect(quotePremium([item("rune", { cursed: true })], 0)).toBe(45));
  it("quotes a newcomer cursed sword at 165 G", () => expect(quote([item("sword", { material: "steel", enchantment: 3, cursed: true })])).toEqual({ results: [{ premium: 165 }] }));
  it("quotes a long-standing customer's second contract cursed enchanted sword at 160 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [item("amulet")] },
      { op: "quote", items: [item("sword", { material: "steel", enchantment: 7, cursed: true })] },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ premium: 160 });
  });
  it("reimburses a regular steel enchantment-3 sword damaged for 500 G with a 400 G payout", () => expect(claim([item("sword", { material: "steel", enchantment: 3 })], [{ itemType: "sword", amount: 500 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("reimburses rune damage of 200 G with a 100 G payout and no item clauses", () => expect(claim([item("rune")], [{ itemType: "rune", amount: 200 }]).results[1]).toEqual({ payout: 100, remainingCap: 400 }));
  it("applies one 100 G deductible to each of sword 500 G and amulet 300 G, paying 600 G", () => expect(claim([item("sword"), item("amulet")], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]).results[1]).toEqual({ payout: 600, remainingCap: 2600 }));
  it("pays 400 G for dragon-material enchantment-8 sword damage of 1000 G", () => expect(claim([item("sword", { material: "dragon", enchantment: 8 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("pays 400 G for dragon-material enchantment-9 sword damage of 1000 G because the 50% clause wins", () => expect(claim([item("sword", { material: "dragon", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("pays 700 G for dragon-material enchantment-5 sword damage of 800 G", () => expect(claim([item("sword", { material: "dragon", enchantment: 5 })], [{ itemType: "sword", amount: 800 }]).results[1]).toEqual({ payout: 700, remainingCap: 1300 }));
  it("pays 400 G for steel enchantment-9 sword damage of 1000 G", () => expect(claim([item("sword", { material: "steel", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("rounds a raw payout of 350.5 G down to 350 G only at the end", () => expect(claim([item("sword", { enchantment: 9 })], [{ itemType: "sword", amount: 901 }]).results[1]).toEqual({ payout: 350, remainingCap: 1650 }));
  it("gives two insured swords an insurance sum of 2000 G and cap of 4000 G", () => expect(insuranceSum([item("sword"), item("sword")]) * 2).toBe(4000));
  it("treats two same-type damage entries as separate insured items with separate deductibles", () => expect(claim([item("sword"), item("sword")], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]).results[1]).toEqual({ payout: 800, remainingCap: 3200 }));
  it("rejects more same-type damage entries than the policy covers", () => expect(() => claim([item("sword")], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toThrow(/not covered/));
  it("caps sword-and-amulet policy payouts at 3200 G", () => expect(claim([item("sword"), item("amulet")], [{ itemType: "sword", amount: 5000 }, { itemType: "amulet", amount: 5000 }]).results[1]).toEqual({ payout: 3200, remainingCap: 0 }));
  it("bases a cursed sword cap on unmodified value, yielding 2000 G", () => expect(claim([item("sword", { cursed: true })], []).results[1]).toEqual({ payout: 0, remainingCap: 2000 }));
  it("gives sword plus 3-rune block an insurance sum of 1750 G, unaffected by block discount", () => expect(insuranceSum([item("sword"), item("rune"), item("rune"), item("rune")])).toBe(1750));
  it("tracks cap exhaustion across claims: 1400 G then 600 G, leaving zero", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword")] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rejects an unknown quote item without producing results", () => expect(() => quote([item("broomstick")])).toThrow(/Unknown item type/));
  it("rejects claim damage for an item absent from the policy", () => expect(() => claim([item("sword")], [{ itemType: "amulet", amount: 200 }])).toThrow(/not covered/));
  it("rejects claim damage with an unknown item type", () => expect(() => claim([item("sword")], [{ itemType: "broomstick", amount: 200 }])).toThrow(/Unknown item type/));
  it("rejects a negative damage amount", () => expect(() => claim([item("sword")], [{ itemType: "sword", amount: -200 }])).toThrow(/must not be negative/));
});
