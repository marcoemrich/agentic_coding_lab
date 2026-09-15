import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword with 100 G base premium plus first-insurance surcharge and fee = 115 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet with 60 G base premium plus first-insurance surcharge and fee = 71 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "amulet" }] }] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff with 80 G base premium plus first-insurance surcharge and fee = 93 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "staff" }] }] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion with 40 G base premium plus first-insurance surcharge and fee = 49 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "potion" }] }] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes 2 runes at 50 G base premium plus 5 G first-insurance surcharge and 5 G fee = 60 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes as a 60 G block plus 6 G first-insurance surcharge and 5 G fee = 71 G", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 71 });
  });
  it("quotes 4 runes without a block at 100 G base plus 10 G first-insurance surcharge and 5 G fee = 115 G", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 115 });
  });
  it("quotes 7 runes without a block at 175 G base plus 17.5 G first-insurance surcharge and 5 G fee, rounded up = 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("quotes 2 runes and 1 moonstone without an alike block: 75 G base, yielding 88 G after surcharge, fee, and upward rounding", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 88 });
  });
  it("quotes 3 runes and 3 moonstones as two separate blocks: 120 G base, yielding 137 G after surcharge and fee", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 137 });
  });
  it("scopes a cursed surcharge to its sword in a cursed-sword/plain-amulet policy: 160 G base and 50 G curse, yielding 231 G with first-insurance surcharge and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 231 });
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword quote is 95 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results[0]).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: a cursed sword quote is 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 195 });
  });
  it("does not apply the high-enchantment surcharge at enchantment 4 but still applies curse: a cursed sword quote is 165 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a newcomer's cursed steel sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract for a new cursed enchantment-7 sword at 160 G, retaining first-insurance and adding follow-up discount", () => {
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });
  it("keeps premium fractions until the end and rounds 197.5 G upward to 198 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ premium: 198 });
  });
  it("reimburses a dragon sword at enchantment 8 for 50% before the deductible: 1000 G damage pays 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one 100 G deductible to each damaged item: 500 G sword plus 300 G amulet pays 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("reimburses a regular steel enchantment-3 sword fully before deductible: 500 G damage pays 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a rune without special clauses before deductible: 200 G damage pays 100 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "rune" }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% enchantment rule win for a dragon enchantment-9 sword: 1000 G damage pays 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below enchantment 8 before deductible: enchantment-5 damage of 800 G pays 700 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves steel enchantment-9 damage before deductible: 1000 G damage pays 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives a policy with two swords a 2000 G insurance sum and 4000 G cap", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two same-type damage entries as separate insured swords with separate deductibles: two 500 G damages pay 800 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim at the CLI with non-zero status and stderr, and no stdout results, when same-type damages outnumber insured items", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not covered/i);
    expect(result.stdout).toBe("");
  });
  it("gives a sword-and-amulet policy a 1600 G insurance sum and 3200 G cap", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value, not its 165 G premium", () => {
    const items = [{ type: "sword", cursed: true }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("gives sword plus a 3-rune block a 1750 G insurance sum and 3500 G cap despite the premium block discount", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across successive 1500 G sword claims: payouts 1400 G then 600 G, leaving 0 G", () => {
    const incident = { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident }, { op: "claim" as const, policy: 0, incident }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("keeps payout fractions until the end and rounds 350.5 G downward to 350 G", () => {
    const items = [{ type: "sword", enchantment: 8 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("exposes sequential quote and claim results through the CLI JSON schema and binding field names", () => {
    const input = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = runCli(input);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
  it("rejects an unknown quoted item type at the CLI with non-zero status, an error on stderr, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item/i);
    expect(result.stdout).toBe("");
  });
  it("rejects damage to a known item type absent from the policy at the CLI with non-zero status and an error on stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not covered/i);
    expect(result.stdout).toBe("");
  });
  it("rejects damage with an unknown item type at the CLI with non-zero status and an error on stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not covered/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount at the CLI with non-zero status and an error on stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative damage/i);
    expect(result.stdout).toBe("");
  });
});
