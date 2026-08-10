import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const quotedClaim = (items: Item[], damages: Damage[]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "test", damages } },
    ],
  }).results;

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G processing fee", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("quotes one plain sword at 115 G", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("uses the price list for amulet, staff, and potion: 71 G, 93 G, and 49 G", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes two runes with 50 G base premium (60 G total)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly three runes with the 60 G block base premium (71 G total)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ premium: 71 });
  });
  it("quotes four runes without a block at 100 G base premium (115 G total)", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes seven runes without a block at 175 G base premium (198 G total)", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("does not combine 2 runes and 1 moonstone as alike: 75 G base (88 G total)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("applies separate blocks to 3 runes and 3 moonstones: 120 G base (137 G total)", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toEqual({ premium: 137 });
  });
  it("adds a 50% curse surcharge only to the cursed item in a sword-and-amulet policy: 231 G total", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("adds a 30% enchantment surcharge at exactly level 5: 145 G total", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it("does not add enchantment surcharge at level 4 but still adds curse surcharge: 165 G total", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("stacks curse and high-enchantment item surcharges: 195 G total", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("applies the 20% loyalty discount at exactly 2 years: 95 G total", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("rounds a premium of 197.5 G up to 198 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("quotes a newcomer cursed sword at the integration-example premium of 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("applies first-insurance surcharge per item and 15% follow-up-contract discount on the second quote: 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rejects an unknown quote item type such as broomstick", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow(/unknown item type/i);
  });
  it("pays 400 G for standard 500 G sword damage after one deductible", () => {
    expect(quotedClaim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    )[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage after one deductible", () => {
    expect(quotedClaim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for dragon sword enchantment 8 damage of 1000 G because the 50% clause wins", () => {
    expect(quotedClaim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    )[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for dragon sword enchantment 9 damage of 1000 G because the 50% clause wins", () => {
    expect(quotedClaim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    )[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon sword enchantment 5 damage of 800 G at full reimbursement", () => {
    expect(quotedClaim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    )[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel sword enchantment 9 damage of 1000 G at 50% reimbursement", () => {
    expect(quotedClaim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    )[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a separate 100 G deductible to sword and amulet damage, paying 600 G", () => {
    expect(quotedClaim(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    )[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    expect(quotedClaim(
      [{ type: "sword", enchantment: 8 }],
      [{ itemType: "sword", amount: 901 }],
    )[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("gives two insured swords an insurance sum of 2000 G and cap of 4000 G", () => {
    expect(quotedClaim(
      [{ type: "sword" }, { type: "sword" }],
      [],
    )[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two damage entries for two insured swords separately", () => {
    expect(quotedClaim(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    )[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more same-type damage entries than insured items", () => {
    expect(() => quotedClaim(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }],
    )).toThrow(/not insured|exceed/i);
  });
  it("bases a cursed sword cap at 2000 G on unmodified insurance value", () => {
    expect(quotedClaim([{ type: "sword", cursed: true }], [])[1])
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("bases sword plus 3-rune block cap at 3500 G on 1750 G insurance value", () => {
    expect(quotedClaim([
      { type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
    ], [])[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: payouts 1400 G then 600 G, remaining cap 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects damage to an item type absent from the policy", () => {
    expect(() => quotedClaim(
      [{ type: "sword" }], [{ itemType: "amulet", amount: 200 }],
    )).toThrow(/not insured/i);
  });
  it("rejects a claim damage entry with an unknown item type", () => {
    expect(() => quotedClaim(
      [{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }],
    )).toThrow(/not insured/i);
  });
  it("rejects a negative damage amount", () => {
    expect(() => quotedClaim(
      [{ type: "sword" }], [{ itemType: "sword", amount: -200 }],
    )).toThrow(/negative|amount/i);
  });
});
