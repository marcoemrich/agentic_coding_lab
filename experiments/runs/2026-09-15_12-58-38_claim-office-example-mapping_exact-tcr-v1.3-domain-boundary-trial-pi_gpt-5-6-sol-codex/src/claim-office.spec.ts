import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { calculateBasePremium, calculateInsuranceSum, calculateItemAdjustedPremium, calculatePremium, processClaim, runScenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync("./claim-office", [], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(calculatePremium([], 0, 0)).toBe(5);
  });
  it("uses the price list for sword 100 G, amulet 60 G, staff 80 G, and potion 40 G base premiums", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => calculateBasePremium([{ type }]))).toEqual([100, 60, 80, 40]);
  });
  it("uses insurance values of sword 1000 G, amulet 600 G, staff 800 G, potion 400 G, and components 250 G each", () => {
    expect(["sword", "amulet", "staff", "potion", "rune", "moonstone"].map((type) => calculateInsuranceSum([{ type }]))).toEqual([1000, 600, 800, 400, 250, 250]);
  });
  it("prices 2 runes at a 50 G base premium", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes as one 60 G building block", () => {
    expect(calculateBasePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("prices 4 runes at 100 G because a block requires exactly 3", () => {
    expect(calculateBasePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G because quantities other than exactly 3 do not form a block", () => {
    expect(calculateBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes plus 1 moonstone at 75 G because unlike component types do not form a block", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes plus 3 moonstones as two separate blocks totaling 120 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(calculateBasePremium(items)).toBe(120);
  });
  it("applies a cursed surcharge only to the cursed sword, producing 210 G before policy modifiers and fee", () => {
    expect(calculateItemAdjustedPremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
  });
  it("applies the loyalty discount at exactly 2 years, producing a 95 G plain-sword premium", () => {
    expect(calculatePremium([{ type: "sword" }], 2, 0)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, producing a 195 G sword premium", () => {
    expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 5 }], 0, 0)).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4, producing a 165 G cursed-sword premium", () => {
    expect(calculatePremium([{ type: "sword", cursed: true, enchantment: 4 }], 0, 0)).toBe(165);
  });
  it("reimburses an enchantment-8 dragon sword damage of 1000 G at 400 G after the deductible", () => {
    expect(processClaim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }], 2000).payout).toBe(400);
  });
  it("applies one 100 G deductible to each of two damaged items, producing a 600 G payout", () => {
    const items = [{ type: "sword", material: "dragon" }, { type: "amulet", material: "dragon" }];
    expect(processClaim(items, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }], 3200).payout).toBe(600);
  });
  it("reimburses regular steel enchantment-3 sword damage of 500 G at 400 G", () => {
    expect(processClaim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }], 2000).payout).toBe(400);
  });
  it("reimburses rune damage of 200 G at 100 G without item-only special clauses", () => {
    expect(processClaim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }], 500).payout).toBe(100);
  });
  it("lets the 50 percent enchantment rule win for a dragon enchantment-9 sword, paying 400 G on 1000 G damage", () => {
    expect(processClaim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }], 2000).payout).toBe(400);
  });
  it("fully reimburses a dragon enchantment-5 sword, paying 700 G on 800 G damage", () => {
    expect(processClaim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }], 2000).payout).toBe(700);
  });
  it("pays 400 G on 1000 G damage to a steel enchantment-9 sword", () => {
    expect(processClaim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }], 2000).payout).toBe(400);
  });
  it("gives a two-sword policy an insurance sum of 2000 G and cap of 4000 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(calculateInsuranceSum(items) * 2).toBe(4000);
    expect(processClaim(items, [], 4000).remainingCap).toBe(4000);
  });
  it("treats two sword damage entries as separate insured items with separate deductibles", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(processClaim(items, damages, 4000).payout).toBe(800);
  });
  it("rejects the whole claim through an Error when sword damages outnumber insured swords", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(() => processClaim([{ type: "sword" }], damages, 2000)).toThrow(Error);
  });
  it("gives a sword-and-amulet policy a 3200 G cap from its 1600 G insurance sum", () => {
    expect(calculateInsuranceSum([{ type: "sword" }, { type: "amulet" }]) * 2).toBe(3200);
  });
  it("bases a cursed sword cap on unmodified value, leaving a 2000 G cap", () => {
    expect(calculateInsuranceSum([{ type: "sword", cursed: true }]) * 2).toBe(2000);
  });
  it("gives sword plus a 3-rune block a 1750 G insurance sum and 3500 G cap", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(calculateInsuranceSum(items)).toBe(1750);
    expect(calculateInsuranceSum(items) * 2).toBe(3500);
  });
  it("limits two successive 1500 G sword claims to payouts of 1400 G then 600 G, exhausting the cap", () => {
    const first = processClaim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }], 2000);
    const second = processClaim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }], first.remainingCap);
    expect([first, second]).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 52.5 G final premium up to 53 G in the office's favor", () => {
    expect(calculatePremium([{ type: "rune" }, { type: "rune" }], 0, 1)).toBe(53);
  });
  it("rounds a 350.5 G raw final payout down to 350 G in the office's favor", () => {
    expect(processClaim([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }], 2000).payout).toBe(350);
  });
  it("rejects an unknown quote item via non-zero CLI status, stderr description, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type: broomstick");
    expect(result.stdout).toBe("");
  });
  it("rejects a claim for an uninsured or unknown item via non-zero CLI status and stderr description", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Damage item is not insured: amulet");
  });
  it("rejects negative damage via non-zero CLI status and stderr description", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Damage amount must not be negative");
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(calculatePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0, 0)).toBe(165);
  });
  it("quotes a long-standing customer's second contract for a new cursed enchantment-7 sword at 160 G", () => {
    const first = { op: "quote" as const, items: [] };
    const second = { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] };
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [first, second] }).results[1]).toEqual({ premium: 160 });
  });
  it("reads the normative scenario schema from stdin and writes ordered quote and claim result objects to stdout", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
