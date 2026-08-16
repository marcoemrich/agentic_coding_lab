import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item } from "./claim-office.js";

function premiumFor(items: Item[], yearsWithMHPCO = 0): number {
  const result = processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];
  if (!("premium" in result)) throw new Error("expected quote result");
  return result.premium;
}

function runCli(input: unknown) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

function singleSwordClaim(details: Partial<Item>, amount: number): { payout: number; remainingCap: number } {
  const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items: [{ type: "sword", ...details }] },
    { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
  ] }).results[1];
  if (!("payout" in result)) throw new Error("expected claim result");
  return result;
}

describe("MHPCO claim office", () => {
  it("empty quote costs only the 5 G processing fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("main-item price list: sword 100 G, amulet 60 G, staff 80 G, potion 40 G", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("2 runes cost 50 G base premium", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("exactly 3 runes form a 60 G block", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes cost 100 G because blocks require exactly 3", () => {
    expect(premiumFor(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("7 runes cost 175 G", () => {
    expect(premiumFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("2 runes plus 1 moonstone cost 75 G because unlike types do not form a block", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes plus 3 moonstones form two blocks and cost 120 G", () => {
    expect(premiumFor([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
  it("cursed sword plus plain amulet has 210 G before policy modifiers and 231 G final", () => {
    expect(premiumFor([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("exactly 2 customer years applies the 20% loyalty discount", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("enchantment 5 cursed sword receives both 30% and 50% surcharges", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("enchantment 4 sword receives no enchantment surcharge", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("first-insurance 10% surcharge applies to each item regardless of customer history", () => {
    expect(premiumFor([{ type: "sword" }, { type: "amulet" }], 5)).toBe(149);
  });
  it("a contract after the first quote receives the 15% follow-up discount", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    }).results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("newcomer cursed sword integration premium is 165 G", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("long-standing customer's second cursed enchanted sword quote is 160 G", () => {
    const scenario = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("regular steel sword damage 500 G pays 400 G and leaves 1600 G cap", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 500 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G pays 100 G", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "rune", amount: 200 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword at enchantment 8 with 1000 G damage pays 400 G", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword at enchantment 9 with 1000 G damage pays 400 G because 50% wins", () => {
    expect(singleSwordClaim({ material: "dragon", enchantment: 9 }, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword at enchantment 5 with 800 G damage pays 700 G", () => {
    expect(singleSwordClaim({ material: "dragon", enchantment: 5 }, 800)).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword at enchantment 9 with 1000 G damage pays 400 G", () => {
    expect(singleSwordClaim({ material: "steel", enchantment: 9 }, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword damage 500 plus amulet damage 300 pays 600 G with two deductibles", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords have 4000 G cap and two damage entries get separate deductibles", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("CLI rejects two sword damages when only one sword is insured", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toContain("not covered by policy");
    expect(execution.stdout).toBe("");
  });
  it("sword and amulet insurance sum gives a 3200 G cap", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword premium modifiers do not increase its 2000 G cap", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results;
    expect(results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword and 3-rune block retain insurance cap 3500 G despite premium discount", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results;
    expect(results).toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]);
  });
  it("successive 1500 G sword claims pay 1400 G then 600 G and exhaust cap", () => {
    const damage = { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] };
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: damage },
      { op: "claim", policy: 0, incident: damage },
    ] }).results;
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("premium 197.5 rounds to 198 and payout 350.5 rounds to 350 only at final totals", () => {
    expect(premiumFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
    expect(singleSwordClaim({ enchantment: 8 }, 901)).toEqual({ payout: 350, remainingCap: 1650 });
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }, { type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "magic", damages: [
        { itemType: "sword", amount: 901 }, { itemType: "sword", amount: 901 },
      ] } },
    ] }).results;
    expect(results[1]).toEqual({ payout: 701, remainingCap: 3299 });
  });
  it("CLI rejects unknown quote types, uninsured or unknown damages, and negative damage", () => {
    const customer = { yearsWithMHPCO: 0 };
    const quote = { op: "quote" as const, items: [{ type: "sword" }] };
    const invalidScenarios = [
      { customer, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] },
      { customer, steps: [quote, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] },
      { customer, steps: [quote, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] },
      { customer, steps: [quote, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] },
    ];
    for (const scenario of invalidScenarios) {
      const execution = runCli(scenario);
      expect(execution.status).not.toBe(0);
      expect(execution.stderr.length).toBeGreaterThan(0);
      expect(execution.stdout).toBe("");
    }
  });
  it("normative schema example emits ordered premium then payout/remainingCap results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).toBe(0);
    expect(execution.stderr).toBe("");
    expect(JSON.parse(execution.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
