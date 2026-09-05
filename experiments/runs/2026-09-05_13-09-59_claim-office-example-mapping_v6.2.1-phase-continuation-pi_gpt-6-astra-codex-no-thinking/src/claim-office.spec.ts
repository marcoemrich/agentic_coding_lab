import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

function runCli(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync("./claim-office", [], {input: JSON.stringify({customer: {yearsWithMHPCO}, steps}), encoding: "utf8"});
}
import { basePremium, insuranceSum, quote, processScenario } from "./claim-office.js";

describe("MHPCO", () => {
  it("empty quote costs 5 G", () => { expect(quote([], 0, 0)).toBe(5); });
  it("sword value 1000 G and base 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
    expect(insuranceSum([{ type: "sword" }])).toBe(1000);
  });
  it("amulet value 600 G and base 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
    expect(insuranceSum([{ type: "amulet" }])).toBe(600);
  });
  it("staff value 800 G and base 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
    expect(insuranceSum([{ type: "staff" }])).toBe(800);
  });
  it("potion value 400 G and base 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
    expect(insuranceSum([{ type: "potion" }])).toBe(400);
  });
  it("one component value 250 G and base 25 G", () => {
    for (const type of ["rune", "moonstone"]) {
      expect(basePremium([{ type }])).toBe(25);
      expect(insuranceSum([{ type }])).toBe(250);
    }
  });
  it("2 runes base 50 G", () => { expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50); });
  it("3 runes base 60 G", () => { expect(basePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60); });
  it("4 runes base 100 G", () => { expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100); });
  it("7 runes base 175 G", () => { expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175); });
  it("2 runes and 1 moonstone base 75 G", () => { expect(basePremium([{type: "rune"}, {type: "rune"}, {type: "moonstone"}])).toBe(75); });
  it("3 runes and 3 moonstones base 120 G", () => { expect(basePremium(["rune", "moonstone"].flatMap(type => Array.from({length: 3}, () => ({type}))))).toBe(120); });
  it("first plain sword costs 115 G", () => { expect(quote([{type: "sword"}], 0, 0)).toBe(115); });
  it("newcomer cursed sword enchantment 3 costs 165 G", () => { expect(quote([{type: "sword", material: "steel", enchantment: 3, cursed: true}], 0, 0)).toBe(165); });
  it("enchantment 5 costs 145 G", () => { expect(quote([{type: "sword", enchantment: 5}], 0, 0)).toBe(145); });
  it("cursed enchantment 5 costs 195 G", () => { expect(quote([{type: "sword", enchantment: 5, cursed: true}], 0, 0)).toBe(195); });
  it("enchantment 4 costs 115 G", () => { expect(quote([{type: "sword", enchantment: 4}], 0, 0)).toBe(115); });
  it("cursed enchantment 4 costs 165 G", () => { expect(quote([{type: "sword", enchantment: 4, cursed: true}], 0, 0)).toBe(165); });
  it("exactly 2 years earns loyalty: sword 95 G", () => { expect(quote([{type: "sword"}], 2, 0)).toBe(95); expect(quote([{type: "sword"}], 1, 0)).toBe(115); });
  it("cursed sword and plain amulet base 160 G, risks 210 G, premium 231 G", () => {
    const items = [{type: "sword", cursed: true}, {type: "amulet"}];
    expect(basePremium(items)).toBe(160);
    expect(quote(items, 0, 0)).toBe(231);
  });
  it("premium 197.5 rounds up to 198 G without intermediate rounding", () => {
    expect(quote(Array.from({length: 7}, () => ({type: "rune"})), 0, 0)).toBe(198);
    expect(quote([{type: "rune", cursed: true}], 0, 0)).toBe(45);
  });
  it("regular steel sword enchantment 3 damage 500 pays 400 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword", material: "steel", enchantment: 3}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 500}]}}
    ]})).toEqual({results: [{premium: 115}, {payout: 400, remainingCap: 1600}]});
  });
  it("rune damage 200 pays 100 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "rune"}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "rune", amount: 200}]}}
    ]}).results[1]).toEqual({payout: 100, remainingCap: 400});
  });
  it("dragon sword enchantment 8 damage 1000 pays 400 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword", material: "dragon", enchantment: 8}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 1000}]}}
    ]}).results[1]).toEqual({payout: 400, remainingCap: 1600});
  });
  it("dragon sword enchantment 9 damage 1000 pays 400 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword", material: "dragon", enchantment: 9}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 1000}]}}
    ]}).results[1]).toEqual({payout: 400, remainingCap: 1600});
  });
  it("dragon sword enchantment 5 damage 800 pays 700 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword", material: "dragon", enchantment: 5}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 800}]}}
    ]}).results[1]).toEqual({payout: 700, remainingCap: 1300});
  });
  it("steel sword enchantment 9 damage 1000 pays 400 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword", material: "steel", enchantment: 9}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 1000}]}}
    ]}).results[1]).toEqual({payout: 400, remainingCap: 1600});
  });
  it("dragon attack sword 500 and amulet 300 pays 600 G with separate deductibles", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword"}, {type: "amulet"}]},
      {op: "claim", policy: 0, incident: {cause: "dragon attack", damages: [{itemType: "sword", amount: 500}, {itemType: "amulet", amount: 300}]}}
    ]}).results[1]).toEqual({payout: 600, remainingCap: 2600});
  });
  it("two swords insurance sum 2000 G cap 4000 G", () => {
    const items = [{type: "sword"}, {type: "sword"}];
    expect(insuranceSum(items)).toBe(2000);
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [{op: "quote", items}, {op: "claim", policy: 0, incident: {cause: "fire", damages: []}}]}).results[1]).toEqual({payout: 0, remainingCap: 4000});
  });
  it("two sword damages each receive their own deductible", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword"}, {type: "sword"}]},
      {op: "claim", policy: 0, incident: {cause: "dragon attack", damages: [{itemType: "sword", amount: 500}, {itemType: "sword", amount: 300}]}}
    ]}).results[1]).toEqual({payout: 600, remainingCap: 3400});
  });
  it("sword and amulet insurance sum 1600 G cap 3200 G", () => {
    const items = [{type: "sword"}, {type: "amulet"}];
    expect(insuranceSum(items)).toBe(1600);
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [{op: "quote", items}, {op: "claim", policy: 0, incident: {cause: "fire", damages: []}}]}).results[1]).toEqual({payout: 0, remainingCap: 3200});
  });
  it("cursed sword premium 165 G retains cap 2000 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [{op: "quote", items: [{type: "sword", cursed: true}]}, {op: "claim", policy: 0, incident: {cause: "fire", damages: []}}]})).toEqual({results: [{premium: 165}, {payout: 0, remainingCap: 2000}]});
  });
  it("sword and 3 runes insurance sum 1750 G cap 3500 G", () => {
    const items = [{type: "sword"}, ...Array.from({length: 3}, () => ({type: "rune"}))];
    expect(insuranceSum(items)).toBe(1750);
    expect(basePremium(items)).toBe(160);
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [{op: "quote", items}, {op: "claim", policy: 0, incident: {cause: "fire", damages: []}}]}).results[1]).toEqual({payout: 0, remainingCap: 3500});
  });
  it("successive sword claims 1500 pay 1400 then 600 G exhausting cap", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword"}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 1500}]}},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 1500}]}},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 1500}]}}
    ]}).results).toEqual([{premium: 115}, {payout: 1400, remainingCap: 600}, {payout: 600, remainingCap: 0}, {payout: 0, remainingCap: 0}]);
  });
  it("payout 350.5 rounds down to 350 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword", enchantment: 8}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 901}]}}
    ]}).results[1]).toEqual({payout: 350, remainingCap: 1650});
  });
  it("fractional reimbursements sum before final payout rounding", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword", enchantment: 8}, {type: "amulet", enchantment: 8}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 901}, {itemType: "amulet", amount: 901}]}}
    ]}).results[1]).toEqual({payout: 701, remainingCap: 2499});
  });
  it("damage below deductible pays zero", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword"}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 50}]}}
    ]}).results[1]).toEqual({payout: 0, remainingCap: 2000});
  });
  it("long-standing second quote cursed enchantment 7 sword costs 160 G", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 3}, steps: [
      {op: "quote", items: [{type: "amulet"}]},
      {op: "quote", items: [{type: "sword", material: "steel", enchantment: 7, cursed: true}]},
      {op: "quote", items: [{type: "sword", material: "steel", enchantment: 7, cursed: true}]}
    ]}).results).toEqual([{premium: 59}, {premium: 160}, {premium: 160}]);
  });
  it("claims reference quote step index even after intervening claims", () => {
    expect(processScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: "quote", items: [{type: "sword"}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 500}]}},
      {op: "quote", items: [{type: "amulet"}]},
      {op: "claim", policy: 2, incident: {cause: "fire", damages: [{itemType: "amulet", amount: 200}]}},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 500}]}}
    ]}).results).toEqual([{premium: 115}, {payout: 400, remainingCap: 1600}, {premium: 62}, {payout: 100, remainingCap: 1100}, {payout: 400, remainingCap: 1200}]);
  });
  it("CLI schema example returns premium 59 G and payout 100 G remaining cap 1100 G", () => {
    const result = runCli([
      {op: "quote", items: [{type: "amulet", material: "silver", enchantment: 2, cursed: false}]},
      {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "amulet", amount: 200}]}}
    ], 5);
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({results: [{premium: 59}, {payout: 100, remainingCap: 1100}]});
  });
  it("CLI rejects unknown quote type with stderr and no stdout results", () => {
    const result = runCli([{op: "quote", items: [{type: "broomstick"}]}]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage to uninsured amulet", () => {
    const result = runCli([{op: "quote", items: [{type: "sword"}]}, {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "amulet", amount: 200}]}}]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*amulet/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage to unknown item type", () => {
    const result = runCli([{op: "quote", items: [{type: "sword"}]}, {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "broomstick", amount: 200}]}}]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects excess sword damage entries atomically", () => {
    const result = runCli([{op: "quote", items: [{type: "sword"}]}, {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: 500}, {itemType: "sword", amount: 300}]}}]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*sword/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects negative damage -200", () => {
    const result = runCli([{op: "quote", items: [{type: "sword"}]}, {op: "claim", policy: 0, incident: {cause: "fire", damages: [{itemType: "sword", amount: -200}]}}]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative.*damage|damage.*negative/i);
    expect(result.stdout).toBe("");
  });
});
