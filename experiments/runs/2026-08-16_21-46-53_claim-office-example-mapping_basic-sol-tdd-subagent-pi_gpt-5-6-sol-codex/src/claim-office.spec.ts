import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const runCli = (scenario: unknown) => spawnSync(
  process.execPath,
  ["--import", "tsx", "src/cli.ts"],
  { input: JSON.stringify(scenario), encoding: "utf8" },
);

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("uses the main-item price list: first quotes for sword, amulet, staff, and potion are 115, 71, 93, and 49 G", () => {
    const premiumFor = (type: string) => executeScenario({
      customer: customer(), steps: [{ op: "quote", items: [{ type }] }],
    }).results[0].premium;
    expect(["sword", "amulet", "staff", "potion"].map(premiumFor)).toEqual([115, 71, 93, 49]);
  });
  it("prices rune quantities with an exact-three block: base premiums 50, 60, 100, and 175 G for 2, 3, 4, and 7 runes", () => {
    const premiumFor = (count: number) => executeScenario({
      customer: customer(),
      steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }],
    }).results[0].premium;
    expect([2, 3, 4, 7].map(premiumFor)).toEqual([60, 71, 115, 198]);
  });
  it("treats component types as alike only when exact: mixed trio base 75 G and two separate trios base 120 G", () => {
    const premiumFor = (types: string[]) => executeScenario({
      customer: customer(), steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    }).results[0].premium;
    expect(premiumFor(["rune", "rune", "moonstone"])).toBe(88);
    expect(premiumFor(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toBe(137);
  });
  it("applies a cursed surcharge only to the affected item: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const result = executeScenario({ customer: customer(), steps: [{ op: "quote", items: [
      { type: "sword", cursed: true }, { type: "amulet", cursed: false },
    ] }] });
    expect(result.results[0].premium).toBe(231);
  });
  it("applies loyalty at exactly 2 years and high enchantment at exactly 5 while level 4 has no enchantment surcharge", () => {
    const premiumAt = (enchantment: number) => executeScenario({
      customer: customer(2), steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment }] }],
    }).results[0].premium;
    expect(premiumAt(5)).toBe(175);
    expect(premiumAt(4)).toBe(145);
  });
  it("quotes a newcomer’s cursed sword at 165 G", () => {
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items: [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ] }] }).results[0].premium).toBe(165);
  });
  it("quotes a long-standing customer’s second-contract cursed level-7 sword at 160 G", () => {
    const result = executeScenario({ customer: customer(3), steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1].premium).toBe(160);
  });
  it("reimburses standard steel sword damage 500 at 400 G and rune damage 200 at 100 G", () => {
    const result = executeScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[2].payout).toBe(100);
  });
  it("applies enchantment and dragon precedence: level-9 dragon 1000 pays 400, level-5 dragon 800 pays 700, level-9 steel 1000 pays 400 G", () => {
    const payoutFor = (material: string, enchantment: number, amount: number) => executeScenario({
      customer: customer(), steps: [
        { op: "quote", items: [{ type: "sword", material, enchantment }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
      ],
    }).results[1].payout;
    expect(payoutFor("dragon", 9, 1000)).toBe(400);
    expect(payoutFor("dragon", 5, 800)).toBe(700);
    expect(payoutFor("steel", 9, 1000)).toBe(400);
  });
  it("applies the 100 G deductible separately to two damaged items for a combined payout of 600 G", () => {
    const result = executeScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1].payout).toBe(600);
  });
  it("treats two insured swords and two sword damages separately with insurance sum 2000 G and cap 4000 G", () => {
    const result = executeScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 1000 }, { itemType: "sword", amount: 1000 },
      ] } },
    ] }).results[1];
    expect(result).toEqual({ payout: 1800, remainingCap: 2200 });
  });
  it("rejects the whole claim via non-zero CLI status when same-type damages outnumber insured items", () => {
    const cli = runCli({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("bases caps on unmodified values: sword+amulet 3200, cursed sword 2000, and sword+3 runes 3500 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 2, incident: { cause: "none", damages: [] } },
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 4, incident: { cause: "none", damages: [] } },
    ];
    const results = executeScenario({ customer: customer(), steps }).results;
    expect([results[1].remainingCap, results[3].remainingCap, results[5].remainingCap]).toEqual([3200, 2000, 3500]);
  });
  it("exhausts a sword policy cap across claims: payouts 1400 then 600 G with remaining cap 0", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const results = executeScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [damage] } },
    ] }).results;
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("keeps premium fractions until the end and rounds 197.5 G up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0].premium).toBe(198);
  });
  it("keeps payout fractions until the end and rounds 350.5 G down to 350 G", () => {
    const result = executeScenario({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1].payout).toBe(350);
  });
  it("rejects an unknown quote item with non-zero CLI status, stderr description, and no stdout results", () => {
    const cli = runCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("rejects unowned and unknown claim items with non-zero CLI status and stderr description", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const cli = runCli({ customer: customer(), steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr).not.toBe("");
      expect(cli.stdout).toBe("");
    }
  });
  it("rejects negative damage with non-zero CLI status and stderr description", () => {
    const cli = runCli({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
});
