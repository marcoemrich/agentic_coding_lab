import { describe, expect, it } from "vitest";
import { processScenario, type Item } from "./claim-office.js";

type Scenario = Parameters<typeof processScenario>[0];

const scenario = (yearsWithMHPCO: number, steps: Scenario["steps"]): Scenario => ({
  customer: { yearsWithMHPCO },
  steps,
});

const quote = (items: Item[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: Array<{ itemType: string; amount: number }>) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "test incident", damages },
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(processScenario(scenario(0, [quote([])]))).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion base premiums", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      processScenario(scenario(0, [quote([{ type }])])).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes 2 runes at 50 G base plus policy modifiers and fee", () => {
    expect(processScenario(scenario(0, [quote([{ type: "rune" }, { type: "rune" }])])).results[0]).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes using the 60 G component block premium", () => {
    expect(processScenario(scenario(0, [quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])])).results[0]).toEqual({ premium: 71 });
  });
  it("does not apply the block to 4 or 7 alike components", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    const premiums = [4, 7].map((count) => processScenario(scenario(0, [quote(runes(count))])).results[0]);
    expect(premiums).toEqual([{ premium: 115 }, { premium: 198 }]);
  });
  it("requires exact component type: 2 runes plus 1 moonstone has 75 G base premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario(scenario(0, [quote(items)])).results[0]).toEqual({ premium: 88 });
  });
  it("applies two separate blocks to 3 runes plus 3 moonstones for 120 G base premium", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(processScenario(scenario(0, [quote(items)])).results[0]).toEqual({ premium: 137 });
  });
  it("scopes a cursed surcharge to the affected item in a multi-item policy", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario(scenario(0, [quote(items)])).results[0]).toEqual({ premium: 231 });
  });
  it("applies loyalty at exactly 2 years to the policy base premium", () => {
    expect(processScenario(scenario(2, [quote([{ type: "sword" }])])).results[0]).toEqual({ premium: 95 });
  });
  it("applies high-enchantment and curse surcharges together at enchantment 5", () => {
    expect(processScenario(scenario(0, [quote([{ type: "sword", cursed: true, enchantment: 5 }])])).results[0]).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(processScenario(scenario(0, [quote([{ type: "sword", cursed: true, enchantment: 4 }])])).results[0]).toEqual({ premium: 165 });
  });
  it("rounds a 197.5 G premium up to 198 G, only at the end", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario(scenario(0, [quote(items)])).results[0]).toEqual({ premium: 198 });
  });
  it("quotes a newcomer cursed sword at the integrated premium of 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(processScenario(scenario(0, [quote([item])])).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const first = quote([{ type: "potion" }]);
    const second = quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]);
    expect(processScenario(scenario(3, [first, second])).results[1]).toEqual({ premium: 160 });
  });
  it("rejects a quote containing an unknown item type", () => {
    expect(() => processScenario(scenario(0, [quote([{ type: "broomstick" }])]))).toThrow(/unknown item type/i);
  });
  it("pays 400 G for standard 500 G sword damage after one deductible", () => {
    const input = scenario(0, [quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim(0, [{ itemType: "sword", amount: 500 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage with no item special clauses", () => {
    const input = scenario(0, [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies a separate 100 G deductible to each damaged item, paying 600 G total", () => {
    const input = scenario(0, [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("high enchantment wins over dragon material at level 8 and pays 400 G on 1000 G damage", () => {
    const input = scenario(0, [quote([{ type: "sword", material: "dragon", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 1000 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below level 8, paying 700 G on 800 G damage", () => {
    const input = scenario(0, [quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim(0, [{ itemType: "sword", amount: 800 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves level 9 steel sword damage before deductible, paying 400 G", () => {
    const input = scenario(0, [quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("supports two insured swords with 2000 G insurance sum and 4000 G cap", () => {
    const input = scenario(0, [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages when two swords are insured", () => {
    const input = scenario(0, [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [{ itemType: "sword", amount: 400 }, { itemType: "sword", amount: 400 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    const input = scenario(0, [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])]);
    expect(() => processScenario(input)).toThrow(/not insured/i);
  });
  it("calculates cap from unmodified values and component counts, not premiums or blocks", () => {
    const swordPolicy = scenario(0, [quote([{ type: "sword", cursed: true }]), claim(0, [])]);
    const blockPolicy = scenario(0, [quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]), claim(0, [])]);
    expect(processScenario(swordPolicy).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    expect(processScenario(blockPolicy).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across successive claims: 1400 G then 600 G", () => {
    const damages = [{ itemType: "sword", amount: 1500 }];
    const results = processScenario(scenario(0, [quote([{ type: "sword" }]), claim(0, damages), claim(0, damages)])).results;
    expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional payout down in MHPCO's favor", () => {
    const input = scenario(0, [quote([{ type: "sword", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 901 }])]);
    expect(processScenario(input).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects damage to an uninsured or unknown item type", () => {
    const policy = quote([{ type: "sword" }]);
    expect(() => processScenario(scenario(0, [policy, claim(0, [{ itemType: "amulet", amount: 200 }])]))).toThrow(/not insured/i);
    expect(() => processScenario(scenario(0, [policy, claim(0, [{ itemType: "broomstick", amount: 200 }])]))).toThrow(/not insured/i);
  });
  it("rejects a negative damage amount", () => {
    const input = scenario(0, [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])]);
    expect(() => processScenario(input)).toThrow(/negative damage amount/i);
  });
});
