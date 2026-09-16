import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword from its 100 G base premium plus first-insurance surcharge and fee at 115 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
    ] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes plain amulet, staff, and potion base premiums of 60 G, 80 G, and 40 G", () => {
    const items = [{ type: "amulet" }, { type: "staff" }, { type: "potion" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 203 }] });
  });
  it("quotes 2 runes at a 50 G component base premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes using the 60 G building-block base premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at a 100 G base premium", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at a 175 G base premium", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block, yielding a 75 G base premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes and 3 moonstones as two separate 60 G blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword, giving 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but still applies curse", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer’s cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer’s second cursed enchanted sword contract at 160 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "potion" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });
  it("rounds a 197.5 G final premium up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("claims 400 G for a dragon sword at enchantment 8 damaged for 1000 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("applies one 100 G deductible to each of two damaged items, paying 600 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("claims 400 G for 500 G damage to a regular steel sword at enchantment 3", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("claims 100 G for 200 G damage to an insured rune", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("lets the 50% enchantment rule win for a dragon sword at enchantment 9, paying 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("fully reimburses a dragon sword at enchantment 5 less deductible, paying 700 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("reimburses a steel sword at enchantment 9 at 50% less deductible, paying 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("insures two swords for 2000 G and establishes a 4000 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 0 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 225 }, { payout: 0, remainingCap: 4000 }],
    });
  });
  it("treats two same-type sword damage entries as separate damages with separate deductibles", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });
  it("rejects the whole claim with non-zero CLI status when same-type damages exceed insured quantity", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] };
    const cli = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
  it("sets a sword-and-amulet policy cap from their 1600 G insurance sum to 3200 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }],
    });
  });
  it("sets a cursed sword cap to 2000 G from unmodified insurance value", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("sets a sword-and-3-rune cap to 3500 G despite the component block premium discount", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("tracks cap exhaustion across claims: 1400 G then 600 G, leaving 0 G", () => {
    const claim = { op: "claim", policy: 0, incident: {
      cause: "attack", damages: [{ itemType: "sword", amount: 1500 }],
    } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ] });
  });
  it("rounds a raw 350.5 G payout down to 350 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("rejects an unknown quoted type with non-zero CLI status, stderr description, and no stdout results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] };
    const cli = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
  it("rejects damage to a known but uninsured item with non-zero CLI status and stderr description", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
  });
  it("rejects damage with an unknown item type with non-zero CLI status and stderr description", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] };
    const cli = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
  });
  it("rejects a negative damage amount with non-zero CLI status and stderr description", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const cli = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
  });
  it("emits one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 5 }, steps })).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
