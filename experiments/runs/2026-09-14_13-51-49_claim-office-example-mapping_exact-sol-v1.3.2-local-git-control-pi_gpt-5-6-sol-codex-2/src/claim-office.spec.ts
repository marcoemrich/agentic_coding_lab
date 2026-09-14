import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { calculateBasePremium, calculateInsuranceSum, calculateRiskAdjustedPremium, processScenario } from "./claim-office.js";

const runCli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("empty item list produces premium 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("main-item price list gives sword 1000/100, amulet 600/60, staff 800/80, potion 400/40", () => {
    const itemTypes = ["sword", "amulet", "staff", "potion"];
    expect(itemTypes.map((type) => calculateBasePremium([{ type }]))).toEqual([100, 60, 80, 40]);
    expect(itemTypes.map((type) => calculateInsuranceSum([{ type }]))).toEqual([1000, 600, 800, 400]);
  });
  it("2 runes have base premium 50 G", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("exactly 3 runes use the 60 G block premium", () => {
    expect(calculateBasePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("4 runes do not use a block and have base premium 100 G", () => {
    expect(calculateBasePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("7 runes do not use a block and have base premium 175 G", () => {
    expect(calculateBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("2 runes plus 1 moonstone have base premium 75 G because types differ", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes plus 3 moonstones form two blocks with base premium 120 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(calculateBasePremium(items)).toBe(120);
  });
  it("cursed surcharge applies only to the cursed sword: sword plus amulet is 210 G before policy adjustments and fee", () => {
    expect(calculateRiskAdjustedPremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(210);
  });
  it("exactly 2 years qualifies for the 20 percent loyalty discount", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("enchantment 5 and curse both surcharge a sword", () => {
    expect(calculateRiskAdjustedPremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(180);
  });
  it("enchantment 4 has no enchantment surcharge while curse still applies", () => {
    expect(calculateRiskAdjustedPremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(150);
  });
  it("newcomer cursed steel enchantment-3 sword quote is 165 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second quote for cursed enchantment-7 sword is 160 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("premium result 197.5 rounds up to 198 G only at the end", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("regular steel enchantment-3 sword damage 500 G pays 400 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G pays 100 G without item-only clauses", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon enchantment-8 sword damage 1000 G pays 400 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment-9 sword damage 1000 G pays 400 G because the 50 percent clause wins", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon enchantment-5 sword damage 800 G pays 700 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel enchantment-9 sword damage 1000 G pays 400 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("one incident damaging sword 500 G and amulet 300 G pays 600 G with one deductible per entry", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords create insurance sum 2000 G and cap 4000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two sword damage entries are separate damages with separate deductibles", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more sword damages than insured swords rejects the whole claim at the CLI boundary", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    const invalid = runCli(scenario);
    expect(invalid.status).not.toBe(0);
    expect(invalid.stderr.length).toBeGreaterThan(0);
    expect(invalid.stdout).toBe("");
  });
  it("sword plus amulet creates cap 3200 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword cap remains 2000 G from unmodified insurance value", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword plus three-rune block creates insurance sum 1750 G and cap 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive sword claims of 1500 G pay 1400 G then 600 G and exhaust the cap", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim] };
    expect(processScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("payout result 350.5 rounds down to 350 G only at the end", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "magic", damages: [{ itemType: "sword", amount: 901 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("invalid quote type, uninsured or unknown claim item, and negative damage reject at CLI; valid output preserves result order and schema", () => {
    const valid = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(valid.status).toBe(0);
    expect(valid.stderr).toBe("");
    expect(JSON.parse(valid.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });

    const invalidScenarios = [
      { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] },
      { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] },
      { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] },
      { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] },
    ];
    for (const scenario of invalidScenarios) {
      const invalid = runCli(scenario);
      expect(invalid.status).not.toBe(0);
      expect(invalid.stderr.length).toBeGreaterThan(0);
      expect(invalid.stdout).toBe("");
    }
  });
});
