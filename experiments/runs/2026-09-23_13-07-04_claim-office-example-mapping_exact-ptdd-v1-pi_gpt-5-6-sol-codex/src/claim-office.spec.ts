import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: any[];
}

function run(scenario: Scenario) {
  return { status: 0, json: processScenario(scenario) as any };
}

function runCli(scenario: Scenario) {
  const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { ...result, json: result.stdout ? JSON.parse(result.stdout) : undefined };
}

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: unknown[]) => ({ op: "quote", items });
const claim = (policy: number, damages: unknown[], cause = "accident") => ({
  op: "claim", policy, incident: { cause, damages },
});
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const item = (type: string, overrides = {}) => ({ type, material: "steel", enchantment: 0, cursed: false, ...overrides });

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    const result = run({ customer: customer(), steps: [quote([])] });
    expect(result.status).toBe(0);
    expect(result.json).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one plain sword at 115 G, proving its 100 G base premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("sword")])] }).json.results[0].premium).toBe(115);
  });
  it("quotes one plain amulet at 71 G, proving its 60 G base premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("amulet")])] }).json.results[0].premium).toBe(71);
  });
  it("quotes one plain staff at 93 G, proving its 80 G base premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("staff")])] }).json.results[0].premium).toBe(93);
  });
  it("quotes one plain potion at 49 G, proving its 40 G base premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("potion")])] }).json.results[0].premium).toBe(49);
  });
  it("quotes one rune at 33 G, proving its 25 G component base premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("rune")])] }).json.results[0].premium).toBe(33);
  });
  it("quotes one moonstone at 33 G, proving its 25 G component base premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("moonstone")])] }).json.results[0].premium).toBe(33);
  });
  it("quotes 2 runes from a 50 G base at 60 G total", () => {
    expect(run({ customer: customer(), steps: [quote([item("rune"), item("rune")])] }).json.results[0].premium).toBe(60);
  });
  it("quotes exactly 3 runes using the 60 G block base at 71 G total", () => {
    expect(run({ customer: customer(), steps: [quote([item("rune"), item("rune"), item("rune")])] }).json.results[0].premium).toBe(71);
  });
  it("quotes 4 runes without a block from a 100 G base at 115 G total", () => {
    expect(run({ customer: customer(), steps: [quote(Array.from({ length: 4 }, () => item("rune")))] }).json.results[0].premium).toBe(115);
  });
  it("quotes 7 runes without a block from a 175 G base at 198 G total, rounding 197.5 up", () => {
    expect(run({ customer: customer(), steps: [quote(Array.from({ length: 7 }, () => item("rune")))] }).json.results[0].premium).toBe(198);
  });
  it("quotes 2 runes plus 1 moonstone without a mixed-type block from a 75 G base at 88 G total", () => {
    const items = [item("rune"), item("rune"), item("moonstone")];
    expect(run({ customer: customer(), steps: [quote(items)] }).json.results[0].premium).toBe(88);
  });
  it("quotes 3 runes plus 3 moonstones as two separate blocks from a 120 G base at 137 G total", () => {
    const items = [...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))];
    expect(run({ customer: customer(), steps: [quote(items)] }).json.results[0].premium).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy: 231 G total", () => {
    const items = [item("sword", { cursed: true }), item("amulet")];
    expect(run({ customer: customer(), steps: [quote(items)] }).json.results[0].premium).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword costs 95 G", () => {
    expect(run({ customer: customer(2), steps: [quote([item("sword")])] }).json.results[0].premium).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: a sword costs 195 G", () => {
    const sword = item("sword", { cursed: true, enchantment: 5 });
    expect(run({ customer: customer(), steps: [quote([sword])] }).json.results[0].premium).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but does apply curse: a sword costs 165 G", () => {
    const sword = item("sword", { cursed: true, enchantment: 4 });
    expect(run({ customer: customer(), steps: [quote([sword])] }).json.results[0].premium).toBe(165);
  });
  it("quotes a newcomer with a cursed enchantment-3 sword at 165 G", () => {
    const sword = item("sword", { cursed: true, enchantment: 3 });
    expect(run({ customer: customer(0), steps: [quote([sword])] }).json.results[0].premium).toBe(165);
  });
  it("quotes a long-standing customer's second contract with a cursed enchantment-7 sword at 160 G", () => {
    const sword = item("sword", { cursed: true, enchantment: 7 });
    const result = run({ customer: customer(3), steps: [quote([]), quote([sword])] });
    expect(result.json.results[1].premium).toBe(160);
  });
  it("tracks sword insurance value as 1000 G by leaving a 2000 G cap after a zero-damage claim", () => {
    const result = run({ customer: customer(), steps: [quote([item("sword")]), claim(0, [damage("sword", 0)])] });
    expect(result.json.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("tracks amulet insurance value as 600 G by leaving a 1200 G cap after a zero-damage claim", () => {
    const result = run({ customer: customer(), steps: [quote([item("amulet")]), claim(0, [damage("amulet", 0)])] });
    expect(result.json.results[1].remainingCap).toBe(1200);
  });
  it("tracks staff insurance value as 800 G by leaving a 1600 G cap after a zero-damage claim", () => {
    const result = run({ customer: customer(), steps: [quote([item("staff")]), claim(0, [damage("staff", 0)])] });
    expect(result.json.results[1].remainingCap).toBe(1600);
  });
  it("tracks potion insurance value as 400 G by leaving an 800 G cap after a zero-damage claim", () => {
    const result = run({ customer: customer(), steps: [quote([item("potion")]), claim(0, [damage("potion", 0)])] });
    expect(result.json.results[1].remainingCap).toBe(800);
  });
  it("tracks rune insurance value as 250 G by leaving a 500 G cap after a zero-damage claim", () => {
    const result = run({ customer: customer(), steps: [quote([item("rune")]), claim(0, [damage("rune", 0)])] });
    expect(result.json.results[1].remainingCap).toBe(500);
  });
  it("tracks moonstone insurance value as 250 G by leaving a 500 G cap after a zero-damage claim", () => {
    const result = run({ customer: customer(), steps: [quote([item("moonstone")]), claim(0, [damage("moonstone", 0)])] });
    expect(result.json.results[1].remainingCap).toBe(500);
  });
  it("pays 400 G for exactly enchantment 8 dragon sword damage of 1000 G", () => {
    const sword = item("sword", { material: "dragon", enchantment: 8 });
    const result = run({ customer: customer(), steps: [quote([sword]), claim(0, [damage("sword", 1000)])] });
    expect(result.json.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible to each item in one event: sword 500 plus amulet 300 pays 600 G", () => {
    const items = [item("sword"), item("amulet")];
    const result = run({ customer: customer(), steps: [quote(items), claim(0, [damage("sword", 500), damage("amulet", 300)], "dragon attack")] });
    expect(result.json.results[1].payout).toBe(600);
  });
  it("pays 400 G for regular enchantment-3 steel sword damage of 500 G", () => {
    const result = run({ customer: customer(), steps: [quote([item("sword", { enchantment: 3 })]), claim(0, [damage("sword", 500)])] });
    expect(result.json.results[1].payout).toBe(400);
  });
  it("pays 100 G for rune damage of 200 G", () => {
    const result = run({ customer: customer(), steps: [quote([item("rune")]), claim(0, [damage("rune", 200)])] });
    expect(result.json.results[1].payout).toBe(100);
  });
  it("lets the 50% enchantment rule win for an enchantment-9 dragon sword: 1000 G damage pays 400 G", () => {
    const sword = item("sword", { material: "dragon", enchantment: 9 });
    const result = run({ customer: customer(), steps: [quote([sword]), claim(0, [damage("sword", 1000)])] });
    expect(result.json.results[1].payout).toBe(400);
  });
  it("fully reimburses enchantment-5 dragon sword damage before deductible: 800 G damage pays 700 G", () => {
    const sword = item("sword", { material: "dragon", enchantment: 5 });
    const result = run({ customer: customer(), steps: [quote([sword]), claim(0, [damage("sword", 800)])] });
    expect(result.json.results[1].payout).toBe(700);
  });
  it("halves enchantment-9 steel sword damage before deductible: 1000 G damage pays 400 G", () => {
    const sword = item("sword", { material: "steel", enchantment: 9 });
    const result = run({ customer: customer(), steps: [quote([sword]), claim(0, [damage("sword", 1000)])] });
    expect(result.json.results[1].payout).toBe(400);
  });
  it("insures two swords independently with a 4000 G cap and separate deductibles for two damages", () => {
    const result = run({ customer: customer(), steps: [quote([item("sword"), item("sword")]), claim(0, [damage("sword", 500), damage("sword", 500)])] });
    expect(result.json.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero status and stderr when damages outnumber insured items of that type", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [damage("sword", 200), damage("sword", 200)])] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("sets a sword-and-amulet policy cap to 3200 G from their 1600 G insurance sum", () => {
    const result = run({ customer: customer(), steps: [quote([item("sword"), item("amulet")]), claim(0, [])] });
    expect(result.json.results[1].remainingCap).toBe(3200);
  });
  it("sets a cursed sword cap to 2000 G from unmodified insurance value, not its 165 G premium", () => {
    const result = run({ customer: customer(), steps: [quote([item("sword", { cursed: true })]), claim(0, [])] });
    expect(result.json.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sets sword plus 3-rune block cap to 3500 G from a 1750 G insurance sum", () => {
    const items = [item("sword"), item("rune"), item("rune"), item("rune")];
    const result = run({ customer: customer(), steps: [quote(items), claim(0, [])] });
    expect(result.json.results[1].remainingCap).toBe(3500);
  });
  it("limits successive 1500 G sword claims to payouts 1400 then 600, leaving cap 600 then 0", () => {
    const steps = [quote([item("sword")]), claim(0, [damage("sword", 1500)]), claim(0, [damage("sword", 1500)])];
    const results = run({ customer: customer(), steps }).json.results;
    expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional 350.5 G raw payout down to 350 G only at the end", () => {
    const sword = item("sword", { enchantment: 8 });
    const result = run({ customer: customer(), steps: [quote([sword]), claim(0, [damage("sword", 901)])] });
    expect(result.json.results[1].payout).toBe(350);
  });
  it("rejects an unknown quote item with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({ customer: customer(), steps: [quote([item("broomstick")])] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsured known item with non-zero status and stderr", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [damage("amulet", 200)])] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("rejects damage with an unknown item type with non-zero status and stderr", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [damage("broomstick", 200)])] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("rejects negative damage with non-zero status and stderr", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [damage("sword", -200)])] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("emits one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const steps = [quote([item("amulet", { material: "silver", enchantment: 2 })]), claim(0, [damage("amulet", 200)], "fire")];
    const result = runCli({ customer: customer(5), steps });
    expect(result.status).toBe(0);
    expect(result.json).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
