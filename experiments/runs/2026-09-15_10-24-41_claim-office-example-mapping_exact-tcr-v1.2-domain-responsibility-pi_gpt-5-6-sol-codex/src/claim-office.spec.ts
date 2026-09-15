import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./claim-office.js";

const runCli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

const quote = (items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0, earlierQuotes: Array<Array<{ type: string }>> = []) =>
  executeScenario({ customer: { yearsWithMHPCO }, steps: [...earlierQuotes.map((earlierItems) => ({ op: "quote" as const, items: earlierItems })), { op: "quote" as const, items }] }).results.at(-1)?.premium;

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword from its 100 G base premium at 115 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes a plain amulet from its 60 G base premium at 71 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a plain staff from its 80 G base premium at 93 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes a plain potion from its 40 G base premium at 49 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes 2 runes at a 50 G component base premium, producing 60 G with first-insurance surcharge and fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes at the special 60 G block base premium, producing 71 G with policy initial surcharge and fee", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(71);
  });
  it("quotes 4 runes without a block at 100 G base premium, producing 115 G", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes without a block at 175 G base premium, producing 198 G after rounding up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("does not group unlike components: 2 runes and 1 moonstone have 75 G base premium and produce 88 G after rounding", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("groups component types separately: 3 runes and 3 moonstones have 120 G base premium and produce 137 G", () => {
    expect(quote([...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))])).toBe(137);
  });
  it("scopes a cursed surcharge to its item: cursed sword plus plain amulet is 210 G before policy modifiers and 231 G total", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword quote is 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: a cursed sword quote is 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply high-enchantment below 5 while still applying curse: a cursed enchantment-4 sword quote is 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("quotes a newcomer with a cursed sword at the integration-example premium of 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second contract with a new cursed enchantment-7 sword at 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, [[{ type: "amulet" }]])).toBe(160);
  });
  it("rounds a fractional premium of 197.5 G up to 198 G only at the end", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("reimburses a regular sword damaged by 500 G at 400 G and leaves 1600 G cap", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a rune damaged by 200 G at 100 G and leaves 400 G cap", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the enchantment-8 half reimbursement before deductible: dragon sword damage 1000 G pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]?.payout).toBe(400);
  });
  it("lets the half-reimbursement rule win for dragon enchantment 9: damage 1000 G pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]?.payout).toBe(400);
  });
  it("fully reimburses dragon material below enchantment 8: enchantment-5 damage 800 G pays 700 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(output.results[1]?.payout).toBe(700);
  });
  it("half reimburses steel enchantment 9: damage 1000 G pays 400 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]?.payout).toBe(400);
  });
  it("applies one deductible to each damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] });
    expect(output.results[1]?.payout).toBe(600);
  });
  it("treats two same-type policy items as separate damages and gives two swords a 4000 G cap", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with a non-zero CLI status when damages outnumber insured items of that type", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("damage");
  });
  it("bases a sword-and-amulet cap on their 1600 G insurance sum, yielding 3200 G", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value, not its 165 G premium", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(output.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("bases a sword-and-3-rune cap on 1750 G insurance value despite the component block discount", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(output.results[1]?.remainingCap).toBe(3500);
  });
  it("exhausts a sword policy cap across claims: payouts are 1400 G then 600 G with no cap remaining", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "flood", damages: [damage] } },
    ] });
    expect(output.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional desired payout of 350.5 G down to 350 G only at the end", () => {
    const output = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(output.results[1]?.payout).toBe(350);
  });
  it("rejects an unknown quote item with non-zero CLI status, stderr description, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("unknown item type");
    expect(result.stdout).toBe("");
  });
  it("rejects a claim for an uninsured known item with non-zero CLI status and stderr description", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("damage");
  });
  it("rejects a claim for an unknown item type with non-zero CLI status and stderr description", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("unknown item type");
  });
  it("rejects a negative damage amount with non-zero CLI status and stderr description", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("damage amount");
  });
  it("reads sequential JSON steps from stdin and writes quote and claim results in schema order", () => {
    const scenario = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
