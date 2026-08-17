import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword 95 G, amulet 59 G, staff 77 G, and potion 41 G after modifiers and fee", () => {
    const quote = (type: string) => processScenario({
      customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type }] }],
    }).results[0];
    expect([quote("sword"), quote("amulet"), quote("staff"), quote("potion")])
      .toEqual([{ premium: 95 }, { premium: 59 }, { premium: 77 }, { premium: 41 }]);
  });
  it("quotes 2 runes at 50 G after modifiers and fee", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
    ] });
    expect(result.results[0]).toEqual({ premium: 50 });
  });
  it("quotes exactly 3 runes at 59 G after modifiers and fee", () => {
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    const result = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: runes }] });
    expect(result.results[0]).toEqual({ premium: 59 });
  });
  it("quotes 4 runes at 95 G after modifiers and fee", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 95 });
  });
  it("quotes 7 runes at 163 G after modifiers and fee", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 163 });
  });
  it("quotes 2 runes and 1 moonstone at 73 G after modifiers and fee because unlike types do not form a block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 73 });
  });
  it("quotes 3 runes and 3 moonstones at 113 G after modifiers and fee as two blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 113 });
  });
  it("quotes a cursed sword and plain amulet at 199 G because curse affects only the sword", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 199 });
  });
  it("applies the 20 percent loyalty discount at exactly 2 years", () => {
    const premium = (yearsWithMHPCO: number) => processScenario({
      customer: { yearsWithMHPCO }, steps: [{ op: "quote", items: [{ type: "sword" }] }],
    }).results[0];
    expect([premium(1), premium(2)]).toEqual([{ premium: 115 }, { premium: 95 }]);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 165 });
  });
  it("rounds a 197.5 G premium up to 198 G only after all modifiers", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 198 });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0])
      .toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "amulet" }] },
      { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for 500 G regular sword damage", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G dragon sword damage at enchantment 8", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for 1000 G dragon sword damage at enchantment 9 because half reimbursement wins", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G dragon sword damage at enchantment 5", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G steel sword damage at enchantment 9", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives two insured swords an insurance sum of 2000 G and cap of 4000 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 },
      ] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("rejects the whole claim with an Error when damage entries of a type exceed insured items", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 },
      ] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("gives a sword and amulet policy a 3200 G cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives sword plus 3 runes a 3500 G cap despite the premium block discount", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("pays 1400 G on the first 1500 G sword claim and leaves 600 G cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("limits the second 1500 G sword claim to 600 G and leaves zero cap", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[2])
      .toEqual({ payout: 600, remainingCap: 0 });
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects an unknown quote item with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects a claim for an uninsured item with non-zero status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects an unknown damaged item with non-zero status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects negative damage with non-zero status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI reads normative JSON and writes ordered quote and claim results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
  it("exposes the CLI as the named claim-office executable", () => {
    const result = spawnSync("./claim-office", [], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
