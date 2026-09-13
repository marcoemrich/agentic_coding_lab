import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item } from "./claim-office.js";

function claim(items: Item[], damages: Array<{ itemType: string; amount: number }>) {
  const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "test", damages } }];
  return processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1];
}

function runCli(scenario: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses all main-item prices: sword, amulet, staff, potion quote at 313 G and insurance sum 2800 G", () => {
    const items = ["sword", "amulet", "staff", "potion"].map((type) => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 313 }] });
  });
  it("quotes 2 runes from a 50 G component base premium", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes using the 60 G building block", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes from a 100 G base premium with no block", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes from a 175 G base premium with no partial block", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone from a 75 G base premium with no mixed block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones from two 60 G blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword, making sword plus amulet 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years, making a plain sword 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, making a sword 195 G", () => {
    const item = { type: "sword", enchantment: 5, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, making a cursed sword 165 G", () => {
    const item = { type: "sword", enchantment: 4, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("pays 400 G for dragon-material sword at enchantment 8 damaged for 1000 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a 100 G deductible per damaged item, paying 600 G for sword 500 plus amulet 300", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } }] }).results;
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for regular steel sword enchantment 3 damaged for 500 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toMatchObject({ payout: 400 });
  });
  it("pays 100 G for a rune damaged for 200 G", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toMatchObject({ payout: 100 });
  });
  it("lets the 50 percent clause win for dragon sword enchantment 9, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
  });
  it("fully reimburses dragon sword enchantment 5 before deductible, paying 700 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])).toMatchObject({ payout: 700 });
  });
  it("pays 400 G for steel sword enchantment 9 damaged for 1000 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
  });
  it("gives two insured swords insurance sum 2000 G and cap 4000 G", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], [])).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toMatchObject({ payout: 800 });
  });
  it("rejects the whole claim when sword damages outnumber insured swords", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toThrow(/not covered/);
  });
  it("gives a sword plus amulet insurance sum 1600 G and cap 3200 G", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [])).toMatchObject({ remainingCap: 3200 });
  });
  it("bases a cursed sword cap at 2000 G despite its 165 G modified premium", () => {
    expect(claim([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives sword plus 3-rune block insurance sum 1750 G and cap 3500 G", () => {
    expect(claim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], [])).toMatchObject({ remainingCap: 3500 });
  });
  it("pays 1400 G then 600 G for successive 1500 G sword claims, leaving cap 0 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [damage] } }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [damage] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 197.5 G premium up to 198 G only after all calculations", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("rounds a 350.5 G payout down to 350 G only after all calculations", () => {
    expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }])).toMatchObject({ payout: 350 });
  });
  it("CLI rejects unknown quote type with non-zero status, stderr description, and empty stdout", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    const execution = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/Unknown item type: broomstick/);
    expect(execution.stdout).toBe("");
  });
  it("CLI rejects a damage item absent from the policy with non-zero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    const execution = runCli(scenario);
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/not covered/);
  });
  it("CLI rejects an unknown claimed item type with non-zero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] };
    expect(runCli(scenario).stderr).toMatch(/not covered/);
  });
  it("CLI rejects negative damage with non-zero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] };
    const execution = runCli(scenario);
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/must not be negative/);
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's cursed enchantment-7 sword on their second contract at 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [sword] }];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 160 });
  });
  it("rejects a claim policy index that points to a later quote", () => {
    const steps = [{ op: "claim" as const, policy: 1, incident: { cause: "fire", damages: [] } }, { op: "quote" as const, items: [{ type: "sword" }] }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/earlier quote/);
  });
  it("emits normative sequential result shape for amulet quote and claim", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 5 }, steps })).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("writes the normative sequential result as JSON through the CLI", () => {
    const steps = [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const execution = runCli({ customer: { yearsWithMHPCO: 5 }, steps });
    expect(execution).toMatchObject({ status: 0, stderr: "", stdout: JSON.stringify({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] }) });
  });
});
