import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const runCli = (scenario: unknown) => spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
  cwd: process.cwd(), input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim-office CLI", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one plain sword from its 100 G base premium at 115 G including first-insurance surcharge and fee", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes one plain amulet from its 60 G base premium at 71 G including first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "amulet" }] }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes one plain staff from its 80 G base premium at 93 G including first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "staff" }] }] })).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes one plain potion from its 40 G base premium at 49 G including first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "potion" }] }] })).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes 2 runes from a 50 G component base premium at 60 G total", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes using the 60 G block premium at 71 G total", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block from a 100 G base premium at 115 G total", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at 198 G, rounding 197.5 G up", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base and 88 G total", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("applies separate blocks to 3 runes and 3 moonstones: 120 G base and 137 G total", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a cursed surcharge to its sword in a sword-and-amulet policy: 231 G total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword costs 95 G", () => {
    expect(processScenario({ customer: customer(2), steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: sword costs 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment below 5: a cursed enchantment-4 sword costs 165 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("pays 400 G for 1000 G damage to an enchantment-8 dragon sword, then leaves 1600 G cap", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("applies one deductible per damaged item: 500 G sword plus 300 G amulet damage pays 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const claim = { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("normally reimburses 500 G damage to a regular enchantment-3 steel sword at 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("normally reimburses 200 G damage to a rune at 100 G", () => {
    const items = [{ type: "rune" }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% enchantment rule win for an enchantment-9 dragon sword: 1000 G damage pays 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below enchantment 8: 800 G damage pays 700 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves damage for an enchantment-9 steel sword: 1000 G damage pays 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("counts two insured swords separately, producing a 4000 G initial cap", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const claim = { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero CLI status when sword damages outnumber insured swords", () => {
    const items = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages } };
    expect(() => processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] })).toThrow();
  });
  it("caps a sword-and-amulet policy at 3200 G from its 1600 G insurance sum", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const claim = { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("caps a cursed sword at 2000 G based on unmodified insurance value", () => {
    const items = [{ type: "sword", cursed: true }];
    const claim = { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("caps a sword-and-3-rune policy at 3500 G despite the component block discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const claim = { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: payouts 1400 G then 600 G, leaving zero", () => {
    const items = [{ type: "sword" }];
    const claim = () => ({ op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } });
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim(), claim()] }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    const items = [{ type: "sword", enchantment: 8 }];
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } };
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }, claim] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects unknown quote type broomstick with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stderr).not.toContain("ERR_MODULE_NOT_FOUND");
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an item absent from the policy with non-zero status and stderr", () => {
    const scenario = { customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount with non-zero status and stderr", () => {
    const scenario = { customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("uses customer contract history but still assesses each newly quoted item: second cursed enchantment-7 sword quote is 160 G", () => {
    const first = { op: "quote", items: [] };
    const second = { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] };
    expect(processScenario({ customer: customer(3), steps: [first, second] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
});
