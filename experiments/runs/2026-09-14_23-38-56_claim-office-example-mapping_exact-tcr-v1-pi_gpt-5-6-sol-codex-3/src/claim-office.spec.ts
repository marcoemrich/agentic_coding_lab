import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const runCli = (scenario: unknown) => spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes sword, amulet, staff, and potion at 115, 71, 93, and 49 G including first-assessment surcharge and fee", () => {
    const expected = { sword: 115, amulet: 71, staff: 93, potion: 49 };
    for (const [type, premium] of Object.entries(expected)) {
      expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type }] }] })).toEqual({ results: [{ premium }] });
    }
  });
  it("quotes 2 runes at 60 G including first-assessment surcharge and fee (50 G base premium)", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at 71 G including first-assessment surcharge and fee (60 G block premium)", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 115 G including first-assessment surcharge and fee (100 G base; no block)", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 198 G including first-assessment surcharge and fee (175 G base; no block)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone at 88 G including first-assessment surcharge and fee because unlike types do not form a block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones at 137 G including first-assessment surcharge and fee as two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a curse to its item: cursed sword plus plain amulet is 231 G with first-assessment surcharge and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years: plain sword is 95 G", () => {
    expect(runScenario({ customer: customer(2), steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: cursed sword is 195 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment below 5: cursed enchantment-4 sword is 165 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes newcomer cursed sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchantment-7 sword contract at 160 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [item] }];
    expect(runScenario({ customer: customer(3), steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a 197.5 G premium up to 198 G only at the end", () => {
    const items = [{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ premium: 198 });
  });
  it("claims regular steel enchantment-3 sword damage of 500 G at 400 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: customer(), steps })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("claims rune damage of 200 G at 100 G without item-specific clauses", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies one deductible to each damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claims dragon enchantment-8 sword damage of 1000 G at 400 G because the 50% clause wins", () => {
    const item = { type: "sword", material: "dragon", enchantment: 8 };
    const damage = { itemType: "sword", amount: 1000 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [damage] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims dragon enchantment-9 sword damage of 1000 G at 400 G because the 50% clause wins", () => {
    const item = { type: "sword", material: "dragon", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("claims dragon enchantment-5 sword damage of 800 G at 700 G with full reimbursement", () => {
    const item = { type: "sword", material: "dragon", enchantment: 5 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toMatchObject({ payout: 700 });
  });
  it("claims steel enchantment-9 sword damage of 1000 G at 400 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("rounds a raw payout of 350.5 G down to 350 G only at the end", () => {
    const item = { type: "sword", enchantment: 8 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toMatchObject({ payout: 350 });
  });
  it("sets two-sword insurance sum to 2000 G, cap to 4000 G, and treats two damages separately", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero CLI status and stderr when damages outnumber insured items", () => {
    const items = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "attack", damages } }];
    const result = runCli({ customer: customer(), steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("damages outnumber insured items");
    expect(result.stdout).toBe("");
  });
  it("sets sword-plus-amulet cap to 3200 G from their 1600 G insurance sum", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets cursed-sword cap to 2000 G from unmodified insurance value", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: customer(), steps })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sets sword-plus-3-rune cap to 3500 G from 1750 G insurance sum despite block pricing", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across claims: 1400 G then 600 G, leaving 600 G then 0 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim];
    expect(runScenario({ customer: customer(), steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects an unknown quote item with non-zero CLI status, stderr, and no stdout results", () => {
    const scenario = { customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("unknown item type");
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsured or unknown item with non-zero CLI status and stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const damages = [{ itemType, amount: 200 }];
      const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages } }];
      const result = runCli({ customer: customer(), steps });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("insured items");
    }
  });
  it("rejects negative damage with non-zero CLI status and stderr", () => {
    const damages = [{ itemType: "sword", amount: -200 }];
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages } }];
    const result = runCli({ customer: customer(), steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("negative damage");
  });
  it("emits schema-shaped ordered quote and claim results for the normative CLI example", () => {
    const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
    const damages = [{ itemType: "amulet", amount: 200 }];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "fire", damages } }];
    const result = runCli({ customer: customer(5), steps });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
