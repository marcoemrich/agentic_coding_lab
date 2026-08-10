import { describe, it, expect } from "vitest";
import { runScenario, type Item, type Step } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0): { premium: number } =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0] as { premium: number };

const claimScenario = (items: Item[], damages: Array<{ itemType: string; amount: number }>) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "incident", damages } },
    ],
  }).results[1];

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => expect(quote([])).toEqual({ premium: 5 }));

  it("uses the price list for sword, amulet, staff, potion, and components", () => {
    const premiums = ["sword", "amulet", "staff", "potion", "rune", "moonstone"].map((type) => quote([{ type }]).premium);
    expect(premiums).toEqual([115, 71, 93, 49, 33, 33]);
  });

  it("quotes 2 runes from a 50 G base", () => expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 }));
  it("quotes exactly 3 runes from a 60 G block base", () => expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ premium: 71 }));
  it("quotes 4 runes from a 100 G base", () => expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 }));
  it("quotes 7 runes from a 175 G base", () => expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 }));
  it("does not combine 2 runes and 1 moonstone into a block", () => expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 }));
  it("prices 3 runes and 3 moonstones as two separate blocks", () => expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type })))).toEqual({ premium: 137 }));

  it("scopes a cursed surcharge to the affected item", () => expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 }));
  it("applies loyalty at exactly 2 years", () => expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 }));
  it("applies curse and high enchantment at exactly enchantment 5", () => expect(quote([{ type: "sword", cursed: true, enchantment: 5 }], 2)).toEqual({ premium: 175 }));
  it("does not apply high enchantment at level 4", () => expect(quote([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 }));
  it("quotes a newcomer with a cursed sword at 165 G", () => expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 }));

  it("quotes a long-standing customer's second contract at 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const steps: Step[] = [{ op: "quote", items: [] }, { op: "quote", items: [sword] }];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });

  it("rounds a 197.5 G premium up only at the end", () => expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 }));
  it("pays 400 G for regular sword damage of 500 G", () => expect(claimScenario([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("pays 100 G for rune damage of 200 G", () => expect(claimScenario([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 }));
  it("pays 400 G at the enchantment-8 threshold even for dragon material", () => expect(claimScenario([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 }));
  it("lets the half rule win for an enchantment-9 dragon sword", () => expect(claimScenario([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 }));
  it("fully reimburses an enchantment-5 dragon sword before deductible", () => expect(claimScenario([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])).toMatchObject({ payout: 700 }));
  it("halves reimbursement for an enchantment-9 steel sword", () => expect(claimScenario([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 }));
  it("applies one deductible per damaged item", () => expect(claimScenario([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])).toMatchObject({ payout: 600 }));
  it("insures and damages two swords separately", () => expect(claimScenario([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 }));
  it("rejects more damage entries of a type than insured", () => expect(() => claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toThrow(/not covered/i));

  it("sets sword-and-amulet cap to 3200 G", () => expect(claimScenario([{ type: "sword" }, { type: "amulet" }], [])).toEqual({ payout: 0, remainingCap: 3200 }));
  it("sets a cursed sword cap from unmodified 1000 G value", () => expect(claimScenario([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 }));
  it("sets sword-and-3-runes insurance sum to 1750 G despite block pricing", () => expect(claimScenario([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], [])).toEqual({ payout: 0, remainingCap: 3500 }));

  it("exhausts a cap across successive claims", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });

  it("rounds a 350.5 G raw payout down", () => expect(claimScenario([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }])).toMatchObject({ payout: 350 }));
  it("rejects an unknown quote item", () => expect(() => quote([{ type: "broomstick" }])).toThrow(/unknown item type/i));
  it("rejects damage to a type absent from the policy", () => expect(() => claimScenario([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(/not covered/i));
  it("rejects damage with an unknown item type", () => expect(() => claimScenario([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(/not covered/i));
  it("rejects a negative damage amount", () => expect(() => claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/negative damage amount/i));
});
