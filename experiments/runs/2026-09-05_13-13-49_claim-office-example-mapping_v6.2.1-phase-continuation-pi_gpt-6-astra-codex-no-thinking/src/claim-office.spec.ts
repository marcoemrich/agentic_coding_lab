import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

function run(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync("./claim-office", { input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: "utf8" });
}
function quote(items: unknown[]) { return { op: "quote", items }; }
function claim(policy: number, damages: unknown[]) { return { op: "claim", policy, incident: { cause: "dragon attack", damages } }; }
function results(steps: unknown[], years = 0) {
  const output = run(steps, years);
  expect(output.status, output.stderr).toBe(0);
  return JSON.parse(output.stdout).results;
}

describe("MHPCO", () => {
  it("empty items cost only 5 G", () => {
    const result = spawnSync("./claim-office", { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("sword base 100 G and insurance value 1000 G", () => {
    expect(results([quote([{ type: "sword" }]), claim(0, [])])).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("amulet base 60 G and insurance value 600 G", () => {
    expect(results([quote([{ type: "amulet" }]), claim(0, [])])).toEqual([{ premium: 71 }, { payout: 0, remainingCap: 1200 }]);
  });
  it("staff base 80 G and insurance value 800 G", () => {
    expect(results([quote([{ type: "staff" }]), claim(0, [])])).toEqual([{ premium: 93 }, { payout: 0, remainingCap: 1600 }]);
  });
  it("potion base 40 G and insurance value 400 G", () => {
    expect(results([quote([{ type: "potion" }]), claim(0, [])])).toEqual([{ premium: 49 }, { payout: 0, remainingCap: 800 }]);
  });
  it("2 runes base 50 G", () => {
    expect(results([quote(Array.from({ length: 2 }, () => ({ type: "rune" })))])).toEqual([{ premium: 60 }]);
  });
  it("3 runes base 60 G", () => {
    expect(results([quote(Array.from({ length: 3 }, () => ({ type: "rune" })))])).toEqual([{ premium: 71 }]);
  });
  it("4 runes base 100 G without block", () => {
    expect(results([quote(Array.from({ length: 4 }, () => ({ type: "rune" })))])).toEqual([{ premium: 115 }]);
  });
  it("7 runes base 175 G without block and premium 198 G", () => {
    expect(results([quote(Array.from({ length: 7 }, () => ({ type: "rune" })))])).toEqual([{ premium: 198 }]);
  });
  it("2 runes and 1 moonstone base 75 G", () => {
    expect(results([quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])])).toEqual([{ premium: 88 }]);
  });
  it("3 runes and 3 moonstones base 120 G", () => {
    expect(results([quote([ ...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" })) ])])).toEqual([{ premium: 137 }]);
  });
  it("newcomer cursed sword enchantment 3 costs 165 G", () => {
    expect(results([quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it("cursed sword and plain amulet base 160 G plus curse 50 G", () => {
    expect(results([quote([{ type: "sword", cursed: true }, { type: "amulet" }])])).toEqual([{ premium: 231 }]);
  });
  it("exactly 2 years earns loyalty discount", () => {
    expect(results([quote([{ type: "sword" }])], 1)).toEqual([{ premium: 115 }]);
    expect(results([quote([{ type: "sword" }])], 2)).toEqual([{ premium: 95 }]);
  });
  it("enchantment exactly 5 adds 30 percent", () => {
    expect(results([quote([{ type: "sword", enchantment: 5 }])])).toEqual([{ premium: 145 }]);
  });
  it("cursed enchantment 5 adds both surcharges", () => {
    expect(results([quote([{ type: "sword", enchantment: 5, cursed: true }])])).toEqual([{ premium: 195 }]);
  });
  it("enchantment 4 has no surcharge", () => {
    expect(results([quote([{ type: "sword", enchantment: 4 }])])).toEqual([{ premium: 115 }]);
  });
  it("cursed enchantment 4 adds only curse surcharge", () => {
    expect(results([quote([{ type: "sword", enchantment: 4, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it("loyal customer's second cursed enchantment 7 sword costs 160 G", () => {
    expect(results([quote([{ type: "amulet" }]), quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])], 3)).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it("regular steel sword enchantment 3 damage 500 pays 400 G", () => {
    expect(results([quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim(0, [{ itemType: "sword", amount: 500 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 pays 100 G with insurance value 250 G", () => {
    expect(results([quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])])[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon enchantment exactly 8 damage 1000 pays 400 G", () => {
    expect(results([quote([{ type: "sword", material: "dragon", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment 9 damage 1000 pays 400 G", () => {
    expect(results([quote([{ type: "sword", material: "dragon", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment 5 damage 800 pays 700 G", () => {
    expect(results([quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim(0, [{ itemType: "sword", amount: 800 }])])[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel enchantment 9 damage 1000 pays 400 G", () => {
    expect(results([quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword damage 500 and amulet damage 300 pay 600 G with cap 3200 G", () => {
    expect(results([quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])])[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords insurance sum 2000 G and cap 4000 G", () => {
    expect(results([quote([{ type: "sword" }, { type: "sword" }]), claim(0, [])])).toEqual([{ premium: 225 }, { payout: 0, remainingCap: 4000 }]);
  });
  it("two sword damage entries each have own deductible", () => {
    expect(results([quote([{ type: "sword" }, { type: "sword" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }])])[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("cursed sword premium 165 G retains cap 2000 G", () => {
    expect(results([quote([{ type: "sword", cursed: true }]), claim(0, [])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword and 3 runes insurance sum 1750 G", () => {
    expect(results([quote([{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))]), claim(0, [])])).toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]);
  });
  it("successive 1500 G claims pay 1400 then 600 and exhaust cap", () => {
    expect(results([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 1500 }]), claim(0, [{ itemType: "sword", amount: 1500 }]), claim(0, [{ itemType: "sword", amount: 500 }])])).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it("fractional payout 350.5 rounds down to 350 G", () => {
    expect(results([quote([{ type: "sword", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 901 }])])[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("intermediate payout fractions are retained until final rounding", () => {
    expect(results([quote([{ type: "sword", enchantment: 8 }, { type: "amulet", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 901 }, { itemType: "amulet", amount: 901 }])])[1]).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it("damage below deductible never yields negative payout", () => {
    expect(results([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 50 }])])[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy references use step index and independent caps", () => {
    expect(results([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 500 }]), quote([{ type: "amulet" }]), claim(2, [{ itemType: "amulet", amount: 200 }]), claim(0, [])])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 0, remainingCap: 1600 }]);
  });
  it("unknown quoted broomstick rejects with stderr and no results", () => {
    const output = run([quote([{ type: "broomstick" }])]);
    expect(output.status).not.toBe(0);
    expect(output.stderr).toMatch(/unknown.*broomstick/i);
    expect(output.stdout).toBe("");
  });
  it("uninsured amulet damage rejects whole claim", () => {
    const output = run([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 200 }])]);
    expect(output.status).not.toBe(0);
    expect(output.stderr).toMatch(/not insured.*amulet/i);
    expect(output.stdout).toBe("");
  });
  it("unknown damage type rejects whole claim", () => {
    const output = run([quote([{ type: "sword" }]), claim(0, [{ itemType: "broomstick", amount: 200 }])]);
    expect(output.status).not.toBe(0);
    expect(output.stderr).toMatch(/not insured.*broomstick/i);
    expect(output.stdout).toBe("");
  });
  it("negative damage -200 rejects whole claim", () => {
    const output = run([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])]);
    expect(output.status).not.toBe(0);
    expect(output.stderr).toMatch(/negative.*damage/i);
    expect(output.stdout).toBe("");
  });
  it("more sword damages than insured swords rejects whole claim", () => {
    const output = run([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }])]);
    expect(output.status).not.toBe(0);
    expect(output.stderr).toMatch(/not insured.*sword/i);
    expect(output.stdout).toBe("");
  });
});
