import { describe, expect, it } from "vitest";
import { runScenario, type Scenario } from "./claim-office.js";

function run(scenario: Scenario) {
  return runScenario(scenario);
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion -- base premiums 100, 60, 80, and 40 G", () => {
    const items = ["sword", "amulet", "staff", "potion"];
    const premiums = items.map((type) => run({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }],
    }).results[0]);
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes 2 runes at 50 G base premium", () => {
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the 60 G building-block premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 100 G base premium because blocks require exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G base premium", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes and 1 moonstone at 75 G base premium because alike means same type", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones at 120 G base premium as two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy -- 210 G before fee and policy modifiers", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    expect(run({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both 50% curse and 30% high-enchantment surcharges at enchantment 5", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("rounds a 197.5 G premium up to 198 G in MHPCO's favor", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes a newcomer’s cursed sword at 165 G including first-insurance surcharge and fee", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed enchanted sword at 160 G", () => {
    const steps = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(run({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 160 });
  });
  it("rejects a quote containing unknown item type broomstick, with no results", () => {
    expect(() => run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] })).toThrow(/unknown item type/i);
  });
  it("pays 400 G for regular sword damage of 500 G after one deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G after one deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G when sword and amulet suffer 500 G and 300 G damage, applying a deductible to each", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for dragon sword at exactly enchantment 8 with 1000 G damage", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for dragon sword at enchantment 9 because the 50% clause wins", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon sword at enchantment 5 with 800 G damage", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel sword at enchantment 9 with 1000 G damage", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a raw payout of 350.5 G down to 350 G in MHPCO's favor", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("sets insurance sum for two swords to 2000 G and cap to 4000 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate insured items with separate deductibles", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(() => run({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/more damage entries|not covered/i);
  });
  it("sets sword-and-amulet cap to 3200 G from their 1600 G insurance sum", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets cursed-sword cap to 2000 G from unmodified insurance value", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", cursed: true }] }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword-and-3-runes cap to 3500 G from 1750 G insurance sum despite block pricing", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across successive 1500 G claims -- payouts 1400 then 600 G", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(run({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects damage to an item type not covered by the policy", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    expect(() => run({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/not covered|more damage entries/i);
  });
  it("rejects a claim containing an unknown item type", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    expect(() => run({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/not covered|unknown|more damage entries/i);
  });
  it("rejects a claim containing a negative damage amount", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    expect(() => run({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/negative damage|non-negative/i);
  });
});
