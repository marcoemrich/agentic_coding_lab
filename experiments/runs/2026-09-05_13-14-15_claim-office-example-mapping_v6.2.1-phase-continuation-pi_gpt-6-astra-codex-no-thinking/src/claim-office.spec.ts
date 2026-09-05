import { describe, it, expect } from "vitest";
import { quote, runScenario } from "./claim-office.js";
import { spawnSync } from "node:child_process";

describe("MHPCO", () => {
  it("empty items cost only 5 G", () => {
    expect(quote([]).premium).toBe(5);
  });
  it("sword value 1000 and base 100, first premium 115", () => {
    expect(quote([{ type: "sword" }])).toEqual({ basePremium: 100, insuranceSum: 1000, premium: 115 });
  });
  it("amulet value 600 and base 60, first premium 71", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ basePremium: 60, insuranceSum: 600, premium: 71 });
  });
  it("staff value 800 and base 80, first premium 93", () => {
    expect(quote([{ type: "staff" }])).toEqual({ basePremium: 80, insuranceSum: 800, premium: 93 });
  });
  it("potion value 400 and base 40, first premium 49", () => {
    expect(quote([{ type: "potion" }])).toEqual({ basePremium: 40, insuranceSum: 400, premium: 49 });
  });
  it("two runes base 50, value 500", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toMatchObject({ basePremium: 50, insuranceSum: 500 });
  });
  it("three runes base 60, value 750", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toMatchObject({ basePremium: 60, insuranceSum: 750 });
  });
  it("four runes base 100, no block", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" }))).basePremium).toBe(100);
  });
  it("seven runes base 175, no blocks", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" }))).basePremium).toBe(175);
  });
  it("two runes and one moonstone base 75", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]).basePremium).toBe(75);
  });
  it("three runes and three moonstones base 120", () => {
    expect(quote([ ...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" })) ]).basePremium).toBe(120);
  });
  it("newcomer cursed sword premium 165", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]).premium).toBe(165);
  });
  it("cursed sword and plain amulet base 160, risk-adjusted 210, premium 231", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toMatchObject({ basePremium: 160, premium: 231 });
  });
  it("exactly two years earns loyalty discount, sword premium 95", () => {
    expect(quote([{ type: "sword" }], 2).premium).toBe(95);
    expect(quote([{ type: "sword" }], 1).premium).toBe(115);
  });
  it("exactly enchantment five earns surcharge, sword premium 145", () => {
    expect(quote([{ type: "sword", enchantment: 5 }]).premium).toBe(145);
  });
  it("cursed enchantment five stacks surcharges, premium 195", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }]).premium).toBe(195);
  });
  it("enchantment four has no surcharge, curse only when cursed", () => {
    expect(quote([{ type: "sword", enchantment: 4 }]).premium).toBe(115);
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }]).premium).toBe(165);
  });
  it("premium 197.5 rounds up to 198 only at end", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" }))).premium).toBe(198);
    expect(quote([{ type: "rune", cursed: true }]).premium).toBe(45);
  });
  it("long-standing second quote cursed enchantment seven sword premium 160", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", cursed: true, enchantment: 7 }] }
    ] })).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });
  it("standard steel enchantment three sword damage 500 pays 400", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("rune damage 200 pays 100", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
    ] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon enchantment eight damage 1000 pays 400", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment nine damage 1000 pays 400", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment five damage 800 pays 700", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
    ] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel enchantment nine damage 1000 pays 400", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon attack sword 500 and amulet 300 pays 600 with separate deductibles", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords value 2000 cap 4000, each damage has deductible", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(quote(items).insuranceSum).toBe(2000);
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("sword and amulet value 1600 cap 3200", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(quote(items).insuranceSum).toBe(1600);
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword premium 165 does not raise cap 2000", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sword and three runes value 1750 cap 3500", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(quote(items)).toMatchObject({ basePremium: 160, insuranceSum: 1750 });
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive 1500 sword claims pay 1400 then 600 and exhaust cap", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }] });
  });
  it("payout 350.5 rounds down to 350", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("fractional item payouts combine before final rounding", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 9 }, { type: "amulet", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }, { itemType: "amulet", amount: 901 }] } }
    ] }).results[1]).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it("damage below deductible never creates negative payout", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 50 }] } }
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy references use step indices, not quote indices", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "claim", policy: 2, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [] } }
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 0, remainingCap: 1600 }] });
  });
  it("CLI schema example reads stdin and writes quote 59 and payout 100 cap 1100", () => {
    const result = spawnSync("./claim-office", [], { encoding: "utf8", input: JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
    ] }) });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI rejects unknown quote type with stderr and no results", () => {
    const result = spawnSync("./claim-office", [], { encoding: "utf8", input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects uninsured amulet damage", () => {
    const result = spawnSync("./claim-office", [], { encoding: "utf8", input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
    ] }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*amulet/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects unknown damage type", () => {
    const result = spawnSync("./claim-office", [], { encoding: "utf8", input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }
    ] }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects negative damage amount -200", () => {
    const result = spawnSync("./claim-office", [], { encoding: "utf8", input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
    ] }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative.*-200/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects whole claim with excess sword damage entries", () => {
    const result = spawnSync("./claim-office", [], { encoding: "utf8", input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
    ] }) });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured.*sword/i);
    expect(result.stdout).toBe("");
  });
});
