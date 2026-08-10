import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the main-item price list: sword 115, amulet 71, staff 93, potion 49 G", () => {
    const premium = (type: string) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0].premium;
    expect([premium("sword"), premium("amulet"), premium("staff"), premium("potion")]).toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at 60 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 alike runes using the block premium at 71 G", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("does not apply blocks to 4 or 7 runes: 115 G and 198 G", () => {
    const premium = (length: number) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length }, () => ({ type: "rune" })) }] }).results[0].premium;
    expect([premium(4), premium(7)]).toEqual([115, 198]);
  });
  it("does not combine 2 runes and 1 moonstone into a block: 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes and 3 moonstones as separate 60 G base blocks: 137 G final", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy: 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies enchantment surcharge at 5 and stacks curse, but not at 4", () => {
    const premium = (enchantment: number) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment }] }] }).results[0].premium;
    expect([premium(5), premium(4)]).toEqual([195, 165]);
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("discounts a follow-up contract while retaining initial assessment on its new items", () => {
    const quote = { op: "quote", items: [{ type: "sword" }] };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [quote, quote] })).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3, material: "steel" }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a longstanding customer's second-contract cursed enchanted sword at 160 G", () => {
    const first = { op: "quote", items: [] };
    const second = { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7, material: "steel" }] };
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [first, second] }).results[1]).toEqual({ premium: 160 });
  });
  it("keeps premium fractions until the end and rounds 197.5 up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("pays 400 G for 500 G damage to a regular sword", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to an insured rune", () => {
    const steps = [{ op: "quote", items: [{ type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 8", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the half reimbursement rule win for a dragon sword at enchantment 9: 400 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1].payout).toBe(400);
  });
  it("fully reimburses dragon sword enchantment 5 damage 800 less deductible: 700 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1].payout).toBe(700);
  });
  it("half reimburses steel sword enchantment 9 damage 1000 less deductible: 400 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1].payout).toBe(400);
  });
  it("applies a deductible to each damaged sword and amulet: payout 600 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1].payout).toBe(600);
  });
  it("covers two swords, permits two sword damages, and applies separate deductibles", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more same-type damages than insured items", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/insured/i);
  });
  it("bases caps on unmodified values for sword+amulet, cursed sword, and sword+3 runes", () => {
    const cap = (items: Array<{ type: string; cursed?: boolean }>) => {
      const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "x", damages: [] } }];
      return processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1].remainingCap;
    };
    expect([cap([{ type: "sword" }, { type: "amulet" }]), cap([{ type: "sword", cursed: true }]), cap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])]).toEqual([3200, 2000, 3500]);
  });
  it("exhausts a sword policy cap over successive claims: 1400 G then 600 G, remaining 0", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("keeps payout fractions until the end and rounds 350.5 down to 350 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1].payout).toBe(350);
  });
  it("CLI rejects an unknown quote item with stderr, nonzero status, and no stdout results", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/unknown|item/i);
    expect(run.stdout).toBe("");
  });
  it("CLI rejects an uninsured or unknown damaged item with stderr and nonzero status", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/insured/i);
    expect(run.stdout).toBe("");
  });
  it("CLI rejects negative damage with stderr and nonzero status", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } }] };
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/damage|amount|negative/i);
    expect(run.stdout).toBe("");
  });
  it("CLI emits ordered quote and claim results using the normative JSON schema", () => {
    const scenario = { customer: { yearsWithMHPCO: 5 }, steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(run.stderr).toBe("");
  });
});
