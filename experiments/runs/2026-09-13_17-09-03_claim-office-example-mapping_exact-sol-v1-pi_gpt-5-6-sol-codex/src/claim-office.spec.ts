import { describe, expect, it } from "vitest";
import { calculateBasePremium, processScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Record<string, unknown>[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: { itemType: string; amount: number }[]) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "incident", damages },
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: customer(), steps: [quote([])] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("prices sword, amulet, staff, and potion at 280 G base with 2800 G insurance value", () => {
    const items = ["sword", "amulet", "staff", "potion"].map((type) => ({ type }));
    expect(calculateBasePremium(items)).toBe(280);
    expect(processScenario({ customer: customer(), steps: [quote(items), claim(0, [])] }).results[1]).toEqual({ payout: 0, remainingCap: 5600 });
  });
  it("prices 2 runes at 50 G base premium", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes as a 60 G block", () => {
    expect(calculateBasePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("prices 4 runes at 100 G because blocks require exactly 3", () => {
    expect(calculateBasePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G without partitioning into blocks", () => {
    expect(calculateBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes and 1 moonstone at 75 G because unlike types do not form a block", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes and 3 moonstones as two blocks totaling 120 G", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(calculateBasePremium(items)).toBe(120);
  });
  it("applies a curse only to the cursed sword in a sword-and-amulet quote, yielding 231 G total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: customer(), steps: [quote(items)] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years, yielding 95 G for a plain sword", () => {
    expect(processScenario({ customer: customer(2), steps: [quote([{ type: "sword" }])] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies enchantment at exactly 5 and curse together, yielding 195 G for a sword", () => {
    const sword = { type: "sword", enchantment: 5, cursed: true };
    expect(processScenario({ customer: customer(), steps: [quote([sword])] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply enchantment at 4 but applies curse, yielding 165 G for a sword", () => {
    const sword = { type: "sword", enchantment: 4, cursed: true };
    expect(processScenario({ customer: customer(), steps: [quote([sword])] }).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(processScenario({ customer: customer(0), steps: [quote([sword])] }).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract cursed enchanted sword at 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = processScenario({ customer: customer(3), steps: [quote([]), quote([sword])] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rounds a fractional premium of 117.5 G upward to 118 G", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }];
    const result = processScenario({ customer: customer(3), steps: [quote([]), quote(items)] });
    expect(result.results[1]).toEqual({ premium: 118 });
  });
  it("pays 400 G for dragon sword enchantment 8 damaged by 1000 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    const result = processScenario({ customer: customer(), steps: [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("deducts 100 G per damaged item, paying 600 G for sword 500 and amulet 300", () => {
    const items = [{ type: "sword", material: "dragon" }, { type: "amulet", material: "dragon" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const result = processScenario({ customer: customer(), steps: [quote(items), claim(0, damages)] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for a regular steel sword enchantment 3 damaged by 500 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    const result = processScenario({ customer: customer(), steps: [quote([sword]), claim(0, [{ itemType: "sword", amount: 500 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged by 200 G", () => {
    const result = processScenario({ customer: customer(), steps: [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50 percent rule win for dragon sword enchantment 9, paying 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    const result = processScenario({ customer: customer(), steps: [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon sword enchantment 5 before deductible, paying 700 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    const result = processScenario({ customer: customer(), steps: [quote([sword]), claim(0, [{ itemType: "sword", amount: 800 }])] });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("half reimburses steel sword enchantment 9 before deductible, paying 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    const result = processScenario({ customer: customer(), steps: [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("counts two insured swords for a 4000 G cap", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const result = processScenario({ customer: customer(), steps: [quote(items), claim(0, [])] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries separately and pays 800 G for two 500 G damages", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const result = processScenario({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "sword" }]), claim(0, damages)] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects two sword damages when only one sword is insured", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(() => processScenario({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, damages)] })).toThrow(Error);
  });
  it("uses sword plus amulet insurance values for a 3200 G cap", () => {
    const result = processScenario({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [])] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword cap at 2000 G despite its premium modifiers", () => {
    const result = processScenario({ customer: customer(), steps: [quote([{ type: "sword", cursed: true }]), claim(0, [])] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("keeps sword plus 3 runes cap at 3500 G despite the component block discount", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const result = processScenario({ customer: customer(), steps: [quote(items), claim(0, [])] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive sword claims to payouts 1400 G then 600 G and exhausts the cap", () => {
    const damage = [{ itemType: "sword", amount: 1500 }];
    const result = processScenario({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, damage), claim(0, damage)] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional payout of 350.5 G downward to 350 G", () => {
    const sword = { type: "sword", enchantment: 9 };
    const result = processScenario({ customer: customer(), steps: [quote([sword]), claim(0, [{ itemType: "sword", amount: 901 }])] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown broomstick quote item", () => {
    expect(() => processScenario({ customer: customer(), steps: [quote([{ type: "broomstick" }])] })).toThrow(Error);
  });
  it("rejects an uninsured or unknown damage item", () => {
    const scenarioFor = (itemType: string) => ({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType, amount: 200 }])] });
    expect(() => processScenario(scenarioFor("amulet"))).toThrow(Error);
    expect(() => processScenario(scenarioFor("broomstick"))).toThrow(Error);
  });
  it("rejects a negative damage amount", () => {
    const scenario = { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])] };
    expect(() => processScenario(scenario)).toThrow(Error);
  });
});
