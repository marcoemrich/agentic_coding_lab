import { describe, expect, it } from "vitest";
import { processScenario, type InsuredItem, type Scenario } from "./claim-office.js";

const item = (type: string, overrides: Partial<InsuredItem> = {}): InsuredItem => ({
  type, material: "steel", enchantment: 0, cursed: false, ...overrides,
});

const quotePremium = (items: InsuredItem[], yearsWithMHPCO = 0): number =>
  (processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0] as { premium: number }).premium;

const claimScenario = (items: InsuredItem[], damages: Array<{ itemType: string; amount: number }>) =>
  processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "test", damages } },
  ] }).results[1] as { payout: number; remainingCap: number };

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at the 5 G processing fee", () => expect(quotePremium([])).toBe(5));
  it("uses the price list for sword, amulet, staff, and potion", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quotePremium([item(type)]))).toEqual([115, 71, 93, 49]);
  });
  it("prices two runes at 50 G base premium", () => expect(quotePremium([item("rune"), item("rune")])).toBe(60));
  it("prices exactly three runes as a 60 G block", () => expect(quotePremium(Array.from({ length: 3 }, () => item("rune")))).toBe(71));
  it("prices four runes at 100 G with no block", () => expect(quotePremium(Array.from({ length: 4 }, () => item("rune")))).toBe(115));
  it("prices seven runes at 175 G with no block", () => expect(quotePremium(Array.from({ length: 7 }, () => item("rune")))).toBe(198));
  it("does not combine two runes and one moonstone into a block", () => expect(quotePremium([item("rune"), item("rune"), item("moonstone")])).toBe(88));
  it("prices three runes and three moonstones as two 60 G blocks", () => expect(quotePremium([...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))])).toBe(137));
  it("applies curse surcharge only to the cursed item in a multi-item policy", () => expect(quotePremium([item("sword", { cursed: true }), item("amulet")])).toBe(231));
  it("applies the high-enchantment surcharge at exactly level 5", () => expect(quotePremium([item("sword", { enchantment: 5 })])).toBe(145));
  it("does not apply high-enchantment surcharge at level 4", () => expect(quotePremium([item("sword", { enchantment: 4 })])).toBe(115));
  it("stacks curse and high-enchantment item surcharges", () => expect(quotePremium([item("sword", { enchantment: 5, cursed: true })])).toBe(195));
  it("applies loyalty discount at exactly two years", () => expect(quotePremium([item("sword")], 2)).toBe(95));
  it("rounds a fractional premium up in MHPCO's favor", () => expect(quotePremium(Array.from({ length: 7 }, () => item("rune")))).toBe(198));
  it("quotes a newcomer cursed sword at 165 G", () => expect(quotePremium([item("sword", { cursed: true, enchantment: 3 })])).toBe(165));
  it("applies follow-up discount while first-insurance surcharge still applies to each new item", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [item("sword", { cursed: true, enchantment: 7 })] },
    ] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rejects a quote containing an unknown item type", () => expect(() => quotePremium([item("broomstick")])).toThrow(/Unknown item type/));
  it("standard sword damage 500 G pays 400 G after deductible", () => expect(claimScenario([item("sword", { enchantment: 3 })], [{ itemType: "sword", amount: 500 }]).payout).toBe(400));
  it("rune damage 200 G pays 100 G after deductible", () => expect(claimScenario([item("rune")], [{ itemType: "rune", amount: 200 }]).payout).toBe(100));
  it("applies a separate 100 G deductible to each damaged item", () => expect(claimScenario([item("sword"), item("amulet")], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]).payout).toBe(600));
  it("high enchantment 8 halves dragon sword damage before deductible", () => expect(claimScenario([item("sword", { material: "dragon", enchantment: 8 })], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400));
  it("high enchantment 9 wins over dragon material", () => expect(claimScenario([item("sword", { material: "dragon", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400));
  it("dragon material at enchantment 5 reimburses damage fully before deductible", () => expect(claimScenario([item("sword", { material: "dragon", enchantment: 5 })], [{ itemType: "sword", amount: 800 }]).payout).toBe(700));
  it("steel enchantment 9 reimburses half before deductible", () => expect(claimScenario([item("sword", { enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400));
  it("rounds a fractional payout down in MHPCO's favor", () => expect(claimScenario([item("sword", { enchantment: 9 })], [{ itemType: "sword", amount: 901 }]).payout).toBe(350));
  it("two insured swords establish a 4000 G cap and accept two sword damages", () => expect(claimScenario([item("sword"), item("sword")], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 }));
  it("rejects more damages of a type than the policy covers", () => expect(() => claimScenario([item("sword")], [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])).toThrow(/uninsured/));
  it("rejects damage to a type absent from the policy", () => expect(() => claimScenario([item("sword")], [{ itemType: "amulet", amount: 200 }])).toThrow(/uninsured/));
  it("rejects an unknown damaged item type", () => expect(() => claimScenario([item("sword")], [{ itemType: "broomstick", amount: 200 }])).toThrow(/Unknown damaged/));
  it("rejects a negative damage amount", () => expect(() => claimScenario([item("sword")], [{ itemType: "sword", amount: -200 }])).toThrow(/negative/));
  it("caps successive sword claims at 1400 G then 600 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword")] },
      { op: "claim", policy: 0, incident: { cause: "one", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "two", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("bases a sword and amulet cap on their 1600 G insurance sum", () => expect(claimScenario([item("sword"), item("amulet")], [])).toEqual({ payout: 0, remainingCap: 3200 }));
  it("bases a cursed sword cap on unmodified 1000 G insurance value", () => expect(claimScenario([item("sword", { cursed: true })], [])).toEqual({ payout: 0, remainingCap: 2000 }));
  it("bases sword plus three-rune cap on 1750 G despite block pricing", () => expect(claimScenario([item("sword"), ...Array.from({ length: 3 }, () => item("rune"))], [])).toEqual({ payout: 0, remainingCap: 3500 }));
  it("returns ordered quote and claim results in the normative schema", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [item("amulet", { material: "silver", enchantment: 2 })] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
