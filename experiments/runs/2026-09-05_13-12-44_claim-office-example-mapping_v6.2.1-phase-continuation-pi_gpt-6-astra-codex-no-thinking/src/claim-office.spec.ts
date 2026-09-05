import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, processScenario } from "./claim-office.js";

describe("MHPCO", () => {
  it("empty items cost 5 G", () => {
    expect(quote([], 0, 0)).toEqual({ premium: 5, basePremium: 0, insuranceSum: 0 });
  });
  it("sword value 1000 and base 100 G", () => {
    expect(quote([{ type: "sword" }], 0, 0)).toEqual({ premium: 115, basePremium: 100, insuranceSum: 1000 });
  });
  it("amulet value 600 and base 60 G", () => {
    expect(quote([{ type: "amulet" }], 0, 0)).toEqual({ premium: 71, basePremium: 60, insuranceSum: 600 });
  });
  it("staff value 800 and base 80 G", () => {
    expect(quote([{ type: "staff" }], 0, 0)).toEqual({ premium: 93, basePremium: 80, insuranceSum: 800 });
  });
  it("potion value 400 and base 40 G", () => {
    expect(quote([{ type: "potion" }], 0, 0)).toEqual({ premium: 49, basePremium: 40, insuranceSum: 400 });
  });
  it("rune value 250 and base 25 G", () => {
    expect(quote([{ type: "rune" }], 0, 0)).toEqual({ premium: 33, basePremium: 25, insuranceSum: 250 });
  });
  it("moonstone value 250 and base 25 G", () => {
    expect(quote([{ type: "moonstone" }], 0, 0)).toEqual({ premium: 33, basePremium: 25, insuranceSum: 250 });
  });
  it("2 runes base 50 G", () => {
    expect(quote(Array.from({ length: 2 }, () => ({ type: "rune" })), 0, 0).basePremium).toBe(50);
  });
  it("3 runes base 60 G", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })), 0, 0)).toEqual({ basePremium: 60, premium: 71, insuranceSum: 750 });
  });
  it("4 runes base 100 G without block", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })), 0, 0).basePremium).toBe(100);
  });
  it("7 runes base 175 G without blocks", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })), 0, 0).basePremium).toBe(175);
  });
  it("2 runes and 1 moonstone base 75 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0, 0).basePremium).toBe(75);
  });
  it("3 runes and 3 moonstones base 120 G", () => {
    const items = ["rune", "moonstone"].flatMap(type => Array.from({ length: 3 }, () => ({ type })));
    expect(quote(items, 0, 0)).toEqual({ basePremium: 120, premium: 137, insuranceSum: 1500 });
  });
  it("newcomer cursed sword premium 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0, 0).premium).toBe(165);
  });
  it("cursed sword and plain amulet base 160, risk-adjusted 210 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }], 0, 0)).toEqual({ basePremium: 160, premium: 231, insuranceSum: 1600 });
  });
  it("exactly 2 years earns 20 percent loyalty", () => {
    expect(quote([{ type: "sword" }], 2, 0).premium).toBe(95);
    expect(quote([{ type: "sword" }], 1, 0).premium).toBe(115);
  });
  it("enchantment 5 earns 30 percent risk", () => {
    expect(quote([{ type: "sword", enchantment: 5 }], 0, 0).premium).toBe(145);
  });
  it("cursed enchantment 5 adds both risks", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }], 0, 0).premium).toBe(195);
  });
  it("enchantment 4 has no enchantment risk", () => {
    expect(quote([{ type: "sword", enchantment: 4 }], 0, 0).premium).toBe(115);
  });
  it("cursed enchantment 4 has only curse risk", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }], 0, 0).premium).toBe(165);
  });
  it("second contract cursed enchanted sword premium 160 G including first insurance", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items }, { op: "quote", items }
    ] })).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
  });
  it("premium 197.5 rounds up to 198 G only at end", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })), 0, 0).premium).toBe(198);
    expect(quote([{ type: "rune", cursed: true }], 0, 0).premium).toBe(45);
  });
  it("regular steel enchantment 3 sword damage 500 pays 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("rune damage 200 pays 100 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
    ] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon enchantment 8 damage 1000 pays 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment 9 damage 1000 pays 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment 5 damage 800 pays 700 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
    ] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel enchantment 9 damage 1000 pays 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword 500 and amulet 300 damage pays 600 with separate deductibles", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords value 2000 cap 4000 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(quote(items, 0, 0).insuranceSum).toBe(2000);
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two sword damages each receive a deductible", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("sword and amulet value 1600 cap 3200 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(quote(items, 0, 0).insuranceSum).toBe(1600);
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword premium 165 has cap 2000 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sword and 3 runes value 1750 cap 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(quote(items, 0, 0).insuranceSum).toBe(1750);
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive 1500 damages pay 1400 then 600 exhausting cap", () => {
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident }, { op: "claim", policy: 0, incident }, { op: "claim", policy: 0, incident }
    ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it("payout 350.5 rounds down to 350 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("fractional reimbursements combine before final rounding", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }, { type: "amulet", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }, { itemType: "amulet", amount: 901 }] } }
    ] }).results[1]).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it("schema example runs via claim-office CLI in order", () => {
    const result = spawnSync("./claim-office", { encoding: "utf8", input: JSON.stringify({
      customer: { yearsWithMHPCO: 5 }, steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    }) });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("unknown quote type rejects CLI with stderr and no stdout", () => {
    const result = spawnSync("./claim-office", { encoding: "utf8", input: JSON.stringify({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
    }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("uninsured amulet rejects whole CLI claim", () => {
    const result = spawnSync("./claim-office", { encoding: "utf8", input: JSON.stringify({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*amulet/i);
    expect(result.stdout).toBe("");
  });
  it("unknown damage type rejects CLI claim", () => {
    const result = spawnSync("./claim-office", { encoding: "utf8", input: JSON.stringify({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }
      ]
    }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("negative damage -200 rejects CLI claim", () => {
    const result = spawnSync("./claim-office", { encoding: "utf8", input: JSON.stringify({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative.*damage/i);
    expect(result.stdout).toBe("");
  });
  it("excess sword damage entries reject whole CLI claim", () => {
    const result = spawnSync("./claim-office", { encoding: "utf8", input: JSON.stringify({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
      ]
    }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*sword/i);
    expect(result.stdout).toBe("");
  });
  it("policy references use step index rather than quote count", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "claim", policy: 2, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
    ] }).results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 400, remainingCap: 1200 }]);
  });
});
