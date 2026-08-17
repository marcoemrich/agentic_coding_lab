import { describe, expect, it } from "vitest";
import { runScenario, type Item, type Scenario } from "./claim-office.js";

const scenario = (yearsWithMHPCO: number, steps: Scenario["steps"]): Scenario => ({
  customer: { yearsWithMHPCO },
  steps,
});

const quote = (items: Item[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: { itemType: string; amount: number }[]) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "test incident", damages },
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(runScenario(scenario(0, [quote([])]))).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes sword 115 G, amulet 71 G, staff 93 G, and potion 49 G for a newcomer's first insurance", () => {
    const premium = (type: string) => runScenario(scenario(0, [quote([{ type }])])).results[0];
    expect([premium("sword"), premium("amulet"), premium("staff"), premium("potion")]).toEqual([
      { premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 },
    ]);
  });
  it("quotes 2 runes from a 50 G component base premium", () => {
    expect(runScenario(scenario(0, [quote([{ type: "rune" }, { type: "rune" }])]))).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes from the special 60 G block base premium", () => {
    expect(runScenario(scenario(0, [quote(Array.from({ length: 3 }, () => ({ type: "rune" })))]))).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes from a 100 G base premium because the block requires exactly 3", () => {
    expect(runScenario(scenario(0, [quote(Array.from({ length: 4 }, () => ({ type: "rune" })))]))).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes from a 175 G base premium", () => {
    expect(runScenario(scenario(0, [quote(Array.from({ length: 7 }, () => ({ type: "rune" })))]))).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes and 1 moonstone from a 75 G base because unlike types do not form a block", () => {
    expect(runScenario(scenario(0, [quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])]))).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones from a 120 G base as two separate blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(runScenario(scenario(0, [quote(items)]))).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a 50 G curse surcharge only to a cursed sword beside a plain amulet", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario(scenario(0, [quote(items)]))).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years", () => {
    expect(runScenario(scenario(2, [quote([{ type: "sword" }])]))).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both 30% enchantment and 50% curse surcharges at enchantment 5", () => {
    expect(runScenario(scenario(0, [quote([{ type: "sword", cursed: true, enchantment: 5 }])]))).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply enchantment surcharge at level 4, while still applying curse", () => {
    expect(runScenario(scenario(0, [quote([{ type: "sword", cursed: true, enchantment: 4 }])]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(runScenario(scenario(0, [quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed enchanted sword at 160 G", () => {
    const steps = [quote([]), quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])];
    expect(runScenario(scenario(3, steps))).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("pays 400 G for 500 G damage to a regular steel sword", () => {
    const steps = [quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim(0, [{ itemType: "sword", amount: 500 }])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to an insured rune", () => {
    const steps = [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to an enchantment-8 dragon sword", () => {
    const item = { type: "sword", material: "dragon", enchantment: 8 };
    const steps = [quote([item]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when one event damages a sword by 500 G and amulet by 300 G", () => {
    const steps = [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [
      { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
    ])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for 1000 G damage to an enchantment-9 dragon sword because the 50% clause wins", () => {
    const steps = [quote([{ type: "sword", material: "dragon", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G damage to an enchantment-5 dragon sword", () => {
    const steps = [quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim(0, [{ itemType: "sword", amount: 800 }])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to an enchantment-9 steel sword", () => {
    const steps = [quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sets the remaining cap for two insured swords to 4000 G", () => {
    const steps = [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two insured sword damage entries separately with a deductible on each", () => {
    const steps = [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [
      { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
    ])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("throws Error and rejects the whole claim when sword damages outnumber insured swords", () => {
    const steps = [quote([{ type: "sword" }]), claim(0, [
      { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
    ])];
    expect(() => runScenario(scenario(0, steps))).toThrow(Error);
  });
  it("sets a sword-and-amulet policy cap to 3200 G", () => {
    const steps = [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword's cap at 2000 G based on unmodified insurance value", () => {
    const steps = [quote([{ type: "sword", cursed: true }]), claim(0, [])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword plus 3-rune block cap to 3500 G because block pricing does not reduce value", () => {
    const steps = [quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]), claim(0, [])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("pays 1400 G then 600 G for successive 1500 G sword claims, exhausting the cap", () => {
    const steps = [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 1500 }]), claim(0, [{ itemType: "sword", amount: 1500 }])];
    expect(runScenario(scenario(0, steps)).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional final premium upward in MHPCO's favor", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario(scenario(0, [quote(runes)]))).toEqual({ results: [{ premium: 198 }] });
  });
  it("rounds a 350.5 G payout down to 350 G in MHPCO's favor", () => {
    const steps = [quote([{ type: "sword", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 901 }])];
    expect(runScenario(scenario(0, steps)).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("throws Error for an unknown quote type, allowing CLI stderr and non-zero exit with no stdout result", () => {
    expect(() => runScenario(scenario(0, [quote([{ type: "broomstick" }])]))).toThrow(Error);
  });
  it("throws Error for absent, unknown, over-counted, or negative claim damage, allowing CLI rejection", () => {
    const invalidDamages = [
      [{ itemType: "amulet", amount: 200 }],
      [{ itemType: "broomstick", amount: 200 }],
      [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }],
      [{ itemType: "sword", amount: -200 }],
    ];
    for (const damages of invalidDamages) {
      const steps = [quote([{ type: "sword" }]), claim(0, damages)];
      expect(() => runScenario(scenario(0, steps))).toThrow(Error);
    }
  });
});
