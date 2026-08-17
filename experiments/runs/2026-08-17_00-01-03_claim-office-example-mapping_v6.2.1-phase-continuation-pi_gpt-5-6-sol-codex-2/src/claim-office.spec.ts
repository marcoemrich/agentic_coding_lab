import { describe, expect, it } from "vitest";
import { executeScenario, type Scenario } from "./claim-office.js";

const run = (scenario: Scenario) => executeScenario(scenario);
const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Scenario["steps"][number] extends never ? never : any[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: Array<{ itemType: string; amount: number }>) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "test incident", damages },
});

function premium(items: any[], yearsWithMHPCO = 0): number {
  return (run({ customer: customer(yearsWithMHPCO), steps: [quote(items)] }).results[0] as { premium: number }).premium;
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(premium([])).toBe(5);
  });
  it("uses the price list for sword, amulet, staff, potion, and individual components", () => {
    expect(["sword", "amulet", "staff", "potion", "rune", "moonstone"].map((type) => premium([{ type }]))).toEqual([115, 71, 93, 49, 33, 33]);
  });
  it("quotes 2 runes at 50 G base premium", () => {
    expect(premium([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes at the special 60 G block premium", () => {
    expect(premium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(71);
  });
  it("quotes 4 runes at 100 G because blocks require exactly 3", () => {
    expect(premium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes at 175 G because no block applies", () => {
    expect(premium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes plus 1 moonstone at 75 G because alike means exact type", () => {
    expect(premium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes plus 3 moonstones at 120 G as two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(premium(items)).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy (210 G before policy modifiers and fee)", () => {
    expect(premium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    expect(premium([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    expect(premium([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(premium([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("pays 400 G for a dragon-material enchantment-8 sword damaged for 1000 G", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword", material: "dragon", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 100 G deductible once per damaged item, paying 600 G for sword 500 plus amulet 300", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for ordinary sword damage of 500 G", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim(0, [{ itemType: "sword", amount: 500 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G without special clauses", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the enchantment-9 50% clause win for a dragon sword damaged for 1000 G, paying 400 G", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword", material: "dragon", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });
  it("fully reimburses dragon-material enchantment-5 damage of 800 G before deductible, paying 700 G", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim(0, [{ itemType: "sword", amount: 800 }])] });
    expect((result.results[1] as { payout: number }).payout).toBe(700);
  });
  it("half reimburses steel enchantment-9 damage of 1000 G before deductible, paying 400 G", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });
  it("gives two insured swords an insurance sum of 2000 G and cap of 4000 G", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [])] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles when two swords are insured", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])] })).toThrow();
  });
  it("caps a sword-and-amulet policy at 3200 G from its 1600 G insurance sum", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [])] });
    expect((result.results[1] as { remainingCap: number }).remainingCap).toBe(3200);
  });
  it("caps a cursed sword policy at 2000 G based on unmodified insurance value", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword", cursed: true }]), claim(0, [])] });
    expect((result.results[1] as { remainingCap: number }).remainingCap).toBe(2000);
  });
  it("gives sword plus 3 runes an insurance sum of 1750 G despite the block premium", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]), claim(0, [])] });
    expect((result.results[1] as { remainingCap: number }).remainingCap).toBe(3500);
  });
  it("exhausts a sword cap across two 1500 G claims with payouts 1400 then 600 G", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 1500 }]), claim(0, [{ itemType: "sword", amount: 1500 }])] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 197.5 G premium up to 198 G only at the end", () => {
    expect(premium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("rounds a 350.5 G payout down to 350 G only at the end", () => {
    const result = run({ customer: customer(), steps: [quote([{ type: "sword", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 901 }])] });
    expect((result.results[1] as { payout: number }).payout).toBe(350);
  });
  it("rejects an unknown quote item without producing results", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "broomstick" }])] })).toThrow(/unknown item type/i);
  });
  it("rejects a claim for an item not covered by the policy", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "amulet", amount: 200 }])] })).toThrow(/not covered/i);
  });
  it("rejects a negative damage amount", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])] })).toThrow(/negative damage/i);
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(premium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second-contract cursed enchantment-7 sword at 160 G", () => {
    const result = run({ customer: customer(3), steps: [quote([{ type: "potion" }]), quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});
