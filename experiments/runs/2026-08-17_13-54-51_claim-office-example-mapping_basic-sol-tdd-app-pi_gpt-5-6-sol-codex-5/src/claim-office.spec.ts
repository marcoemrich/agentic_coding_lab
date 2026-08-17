import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G -- processing fee only", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes the main price list base premiums -- sword 115, amulet 71, staff 93, potion 49 G including first-insurance surcharge and fee", () => {
    const cases = [["sword", 115], ["amulet", 71], ["staff", 93], ["potion", 49]] as const;
    for (const [type, premium] of cases) {
      expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] })).toEqual({ results: [{ premium }] });
    }
  });
  it("prices alike component quantities -- 2 runes 50, 3 runes 60, 4 runes 100, and 7 runes 175 G before modifiers and fee", () => {
    const premiums = [2, 3, 4, 7].map((count) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }],
    }).results[0]);
    expect(premiums).toEqual([{ premium: 60 }, { premium: 71 }, { premium: 115 }, { premium: 198 }]);
  });
  it("groups only exactly three components of the same type -- mixed trio 75 and rune plus moonstone trios 120 G before modifiers and fee", () => {
    const premiumFor = (types: string[]) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: types.map((type) => ({ type })) }] }).results[0];
    expect(premiumFor(["rune", "rune", "moonstone"])).toEqual({ premium: 88 });
    expect(premiumFor(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toEqual({ premium: 137 });
  });
  it("applies cursed surcharge only to affected item -- cursed sword plus plain amulet totals 231 G after first-insurance surcharge and fee", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword", cursed: true }, { type: "amulet" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("honors modifier boundaries -- loyalty at 2 years, enchantment surcharge at 5 with curse, and no enchantment surcharge at 4", () => {
    const premium = (yearsWithMHPCO: number, item: { type: string; enchantment?: number; cursed?: boolean }) => processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items: [item] }] }).results[0];
    expect([premium(2, { type: "sword" }), premium(0, { type: "sword", enchantment: 5, cursed: true }), premium(0, { type: "sword", enchantment: 4, cursed: true })]).toEqual([{ premium: 95 }, { premium: 195 }, { premium: 165 }]);
  });
  it("pays 400 G for dragon-material sword at enchantment 8 damaged for 1000 G -- half reimbursement wins then deductible", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("applies a 100 G deductible to each damaged item -- 500 G sword plus 300 G amulet pays 600 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] });
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("uses standard reimbursement for ordinary sword and rune -- damages 500 and 200 G pay 400 and 100 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }, { itemType: "rune", amount: 200 }] } },
    ] });
    expect(result).toEqual({ results: [{ premium: 143 }, { payout: 500, remainingCap: 2000 }] });
  });
  it("resolves enchantment versus dragon material -- dragon level 9 pays 400, dragon level 5 pays 700, steel level 9 pays 400 G", () => {
    const payout = (material: string, enchantment: number, amount: number) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material, enchantment }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
    ] }).results[1];
    expect([payout("dragon", 9, 1000), payout("dragon", 5, 800), payout("steel", 9, 1000)]).toEqual([
      { payout: 400, remainingCap: 1600 }, { payout: 700, remainingCap: 1300 }, { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("supports repeated insured item types -- two swords give 2000 G sum, 4000 G cap, and separate deductibles", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("rejects the whole claim when damage entries outnumber insured items of that type -- CLI exits non-zero with stderr and no stdout result", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("damage entries exceed insured items");
    expect(run.stdout).toBe("");
  });
  it("bases cap on unmodified insurance values -- sword plus amulet 3200, cursed sword 2000, sword plus three runes 3500 G", () => {
    const capFor = (items: Array<{ type: string; cursed?: boolean }>) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1];
    expect([capFor([{ type: "sword" }, { type: "amulet" }]), capFor([{ type: "sword", cursed: true }]), capFor([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])]).toEqual([
      { payout: 0, remainingCap: 3200 }, { payout: 0, remainingCap: 2000 }, { payout: 0, remainingCap: 3500 },
    ]);
  });
  it("tracks cap exhaustion across claims -- successive 1500 G sword damages pay 1400 then 600 G, leaving zero", () => {
    const damage = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: damage }, { op: "claim", policy: 0, incident: damage },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });
  it("rounds final premium up and payout down while retaining fractional intermediates -- 197.5 to 198 and 350.5 to 350 G", () => {
    const premium = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] }).results[0];
    const claim = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results[1];
    expect([premium, claim]).toEqual([{ premium: 198 }, { payout: 350, remainingCap: 1650 }]);
  });
  it("rejects an unknown quoted item -- CLI exits non-zero, writes stderr, and writes no results to stdout", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("unknown item type: broomstick");
    expect(run.stdout).toBe("");
  });
  it("rejects uninsured or unknown damaged items -- CLI exits non-zero and writes stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(run.status).not.toBe(0);
      expect(run.stderr.length).toBeGreaterThan(0);
      expect(run.stdout).toBe("");
    }
  });
  it("rejects negative damage -- CLI exits non-zero and writes stderr", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("damage amount cannot be negative");
    expect(run.stdout).toBe("");
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed level-7 sword at 160 G -- first insurance still applies per item", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("implements the normative CLI JSON shape and sequential policy reference -- outputs quote then claim results", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(run.status).toBe(0);
    expect(run.stderr).toBe("");
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
