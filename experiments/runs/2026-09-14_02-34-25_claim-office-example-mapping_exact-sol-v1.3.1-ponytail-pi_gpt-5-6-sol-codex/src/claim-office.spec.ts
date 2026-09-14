import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes sword, amulet, staff, and potion base prices plus first-insurance surcharge and fee", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map(type =>
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0].premium
    );
    expect(premiums).toEqual([115, 71, 93, 49]);
  });
  it("quotes two runes at 60 G total including first-insurance surcharge and fee (50 G base)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly three runes at 71 G (60 G block base)", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes four runes at 115 G (100 G base; no block)", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes seven runes at 198 G after rounding up from 197.5 G (175 G base; no block)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes two runes and one moonstone at 88 G (75 G base; mixed types do not form a block)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes three runes and three moonstones at 137 G (two 60 G blocks)", () => {
    const items = ["rune", "moonstone"].flatMap(type => Array.from({ length: 3 }, () => ({ type })));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy: 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly two years: plain sword costs 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: sword costs 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but applies curse: sword costs 165 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed enchantment-7 sword at 160 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });
  it("standard sword damage of 500 G pays 400 G and leaves 1600 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune damage of 200 G pays 100 G and leaves 400 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword at enchantment 8 with 1000 G damage pays 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(400);
  });
  it("dragon sword at enchantment 9 with 1000 G damage pays 400 G because the 50% clause wins", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(400);
  });
  it("dragon sword at enchantment 5 with 800 G damage pays 700 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(700);
  });
  it("steel sword at enchantment 9 with 1000 G damage pays 400 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(400);
  });
  it("damage to a sword for 500 G and amulet for 300 G pays 600 G with one deductible each", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(600);
  });
  it("two insured swords produce a 2000 G insurance sum and 4000 G cap", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two damage entries for two insured swords each receive their own deductible", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects with Error when damage entries outnumber insured items of that type", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] };
    expect(() => processScenario(scenario)).toThrow(Error);
  });
  it("sword and amulet policy has a 3200 G cap", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(3200);
  });
  it("cursed sword cap is 2000 G based on unmodified insurance value", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(2000);
  });
  it("sword and three-rune block has insurance sum 1750 G and cap 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(3500);
  });
  it("successive 1500 G sword claims pay 1400 G then 600 G and exhaust the cap", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "magic", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects unknown quote item with non-zero status, stderr description, and no stdout", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage for an item absent from policy with non-zero status and stderr description", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("amulet");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects negative damage with non-zero status and stderr description", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("-200");
    expect(result.stdout).toBe("");
  });
  it("CLI reads sequential quote and claim JSON and writes results in step order", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
