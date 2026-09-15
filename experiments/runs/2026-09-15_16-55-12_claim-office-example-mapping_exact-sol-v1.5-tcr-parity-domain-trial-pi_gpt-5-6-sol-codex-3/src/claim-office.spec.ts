import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes sword, amulet, staff, and potion base premiums at 100, 60, 80, and 40 G plus policy modifiers and fee", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      executeScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type }] }] }).results[0].premium,
    );
    expect(premiums).toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at a 50 G component base premium", () => {
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the special 60 G block base premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at a 100 G base premium because blocks require exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at a 175 G base premium", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes and 1 moonstone at 75 G base because alike means identical type", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones as two blocks totaling 120 G base", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("adds a cursed surcharge only to the cursed sword: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years with MHPCO", () => {
    expect(executeScenario({ customer: customer(2), steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both high-enchantment and curse surcharges to a cursed sword at enchantment 5", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("rounds a final premium of 197.5 G up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes a newcomer’s first cursed sword policy at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer’s second cursed enchanted sword contract at 160 G, including per-item first-insurance surcharge and follow-up discount", () => {
    const steps = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(executeScenario({ customer: customer(3), steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("reimburses a regular steel enchantment-3 sword damaged for 500 G at 400 G after deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("reimburses a rune damaged for 200 G at 100 G after deductible without item clauses", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("reimburses an enchantment-8 dragon sword damaged for 1000 G at 400 G because the 50% clause wins before deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses an enchantment-9 dragon sword damaged for 1000 G at 400 G because the 50% clause wins", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses an enchantment-5 dragon sword damaged for 800 G at 700 G in full before deductible", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("reimburses an enchantment-9 steel sword damaged for 1000 G at 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one 100 G deductible to each of a sword and amulet damage, paying 600 G total", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords for 2000 G and gives their policy a 4000 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles when two swords are covered", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("rejects the whole claim with Error when sword damages outnumber insured swords", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    expect(() => executeScenario({ customer: customer(), steps })).toThrow(Error);
  });
  it("caps a sword-and-amulet policy at 3200 G from their 1600 G insurance sum", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("caps a cursed sword policy at 2000 G from unmodified insurance value rather than premium", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("values a sword and 3-rune block at 1750 G insurance sum despite the premium block discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("pays 1400 G then 600 G for two successive 1500 G sword claims, exhausting the 2000 G cap", () => {
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident }, { op: "claim", policy: 0, incident }];
    expect(executeScenario({ customer: customer(), steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a final payout of 350.5 G down to 350 G while retaining fractional intermediates", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(executeScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects a quote containing unknown type broomstick with Error", () => {
    const scenario = { customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    expect(() => executeScenario(scenario)).toThrow(Error);
  });
  it("rejects a claim for an item type absent from the policy with Error", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(() => executeScenario({ customer: customer(), steps })).toThrow(Error);
  });
  it("rejects a claim containing a negative damage amount with Error", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ];
    expect(() => executeScenario({ customer: customer(), steps })).toThrow(Error);
  });
  it("processes steps sequentially and returns quote and claim results in input order with the normative field names", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(executeScenario({ customer: customer(5), steps })).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI reads JSON on stdin and writes result JSON on stdout", () => {
    const input = JSON.stringify({ customer: customer(), steps: [{ op: "quote", items: [] }] });
    const result = spawnSync("./claim-office", [], { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("CLI reports invalid scenarios on stderr with non-zero status and no results on stdout", () => {
    const input = JSON.stringify({ customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    const result = spawnSync("./claim-office", [], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type");
    expect(result.stdout).toBe("");
  });
});
