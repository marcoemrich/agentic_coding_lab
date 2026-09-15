import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./office.js";

function premium(type: string): number | undefined {
  return executeScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items: [{ type }] }],
  }).results[0].premium;
}

function runCli(scenario: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for only the processing fee", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes the main-item price list: sword 115 G, amulet 71 G, staff 93 G, potion 49 G including first-insurance surcharge and fee", () => {
    expect([premium("sword"), premium("amulet"), premium("staff"), premium("potion")])
      .toEqual([115, 71, 93, 49]);
  });
  it("quotes two runes at 60 G including first-insurance surcharge and fee (50 G base premium)", () => {
    const output = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(output.results[0].premium).toBe(60);
  });
  it("quotes exactly three runes at 71 G including first-insurance surcharge and fee (60 G block base premium)", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(71);
  });
  it("quotes four runes at 115 G including first-insurance surcharge and fee (100 G base; no block)", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(115);
  });
  it("quotes seven runes at 198 G including first-insurance surcharge and fee (175 G base; no block)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(198);
  });
  it("does not combine unlike components: two runes and one moonstone have 75 G base and quote at 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(88);
  });
  it("prices separate alike blocks: three runes and three moonstones have 120 G base and quote at 137 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(137);
  });
  it("scopes a curse to its item: cursed sword plus plain amulet is 210 G before policy modifiers and quotes at 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(231);
  });
  it("applies the loyalty threshold at exactly 2 years: a plain sword quotes at 95 G", () => {
    const output = executeScenario({
      customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output.results[0].premium).toBe(95);
  });
  it("applies both curse and high-enchantment surcharge at enchantment 5: sword quotes at 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but still applies curse: sword quotes at 165 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(165);
  });
  it("quotes a newcomer with a cursed steel sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(output.results[0].premium).toBe(165);
  });
  it("quotes a long-standing customer's second contract containing a new cursed enchantment-7 sword at 160 G", () => {
    const output = executeScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(output.results[1].premium).toBe(160);
  });
  it("rounds a 197.5 G premium upward to 198 G only after all modifiers", () => {
    const output = executeScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(output.results[1].premium).toBe(198);
  });
  it("reports standard sword damage 500 G as payout 400 G and remaining cap 1600 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reports rune damage 200 G as payout 100 G and remaining cap 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies one deductible to each damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(output.results[1].payout).toBe(600);
  });
  it("applies enchantment 8 before deductible even for dragon material: 1000 G damage pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1].payout).toBe(400);
  });
  it("lets the 50% enchantment-9 clause win over dragon material: 1000 G damage pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1].payout).toBe(400);
  });
  it("fully reimburses dragon-material enchantment-5 damage before deductible: 800 G damage pays 700 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(output.results[1].payout).toBe(700);
  });
  it("halves steel enchantment-9 damage before deductible: 1000 G damage pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1].payout).toBe(400);
  });
  it("rounds a 350.5 G raw payout downward to 350 G only after calculation", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(output.results[1].payout).toBe(350);
  });
  it("treats two insured swords and two sword damages as distinct, with a 4000 G initial cap and separate deductibles", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole CLI claim with non-zero status and stderr when damages outnumber insured items, writing no stdout results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/damage.*insured/i);
    expect(execution.stdout).toBe("");
  });
  it("bases sword-plus-amulet cap on their 1600 G insurance sum, leaving 3200 G with no damage", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(output.results[1].remainingCap).toBe(3200);
  });
  it("bases cursed-sword cap on unmodified 1000 G insurance value, leaving 2000 G with no damage", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(output.results[1].remainingCap).toBe(2000);
  });
  it("bases sword-plus-three-rune cap on 1750 G insurance value despite the premium block, leaving 3500 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(output.results[1].remainingCap).toBe(3500);
  });
  it("tracks cap exhaustion across two 1500 G sword claims: payouts 1400 G then 600 G, leaving zero", () => {
    const claim = { op: "claim", policy: 0, incident: {
      cause: "battle", damages: [{ itemType: "sword", amount: 1500 }],
    } };
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, claim, claim,
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects an unknown quote item in the CLI with non-zero status and an error on stderr, writing no stdout results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/unknown item type.*broomstick/i);
    expect(execution.stdout).toBe("");
  });
  it("rejects a CLI claim for an unowned known item with non-zero status and an error on stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
  });
  it("rejects a CLI claim for an unknown item type with non-zero status and an error on stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
  });
  it("rejects a CLI claim with negative damage with non-zero status and an error on stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/negative damage/i);
  });
  it("emits one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
