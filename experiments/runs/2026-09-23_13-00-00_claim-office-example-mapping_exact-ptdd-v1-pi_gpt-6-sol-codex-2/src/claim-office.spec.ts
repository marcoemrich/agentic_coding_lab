import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./office.js";

function expectCLIError(input: object): void {
  const result = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
  const steps = (input as { steps: Array<{ op: string; items?: Array<{ type: string }>; incident?: { damages: Array<{ itemType: string; amount: number }> } }> }).steps;
  const damage = steps.at(-1)?.incident?.damages;
  const description = damage?.some(entry => entry.amount < 0) ? /negative/i
    : damage ? /uninsured/i : /unknown item/i;
  expect(result.status).not.toBe(0);
  expect(result.stderr).toMatch(description);
  expect(result.stdout).toBe("");
}

describe("MHPCO claim office", () => {
  it("empty items: quote premium is only the 5 G processing fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("one plain sword: 100 G base plus 10 G first insurance plus 5 G fee = 115 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results).toEqual([{ premium: 115 }]);
  });
  it("one plain amulet: 60 G base plus 6 G first insurance plus 5 G fee = 71 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] }).results).toEqual([{ premium: 71 }]);
  });
  it("one plain staff: 80 G base plus 8 G first insurance plus 5 G fee = 93 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] }).results).toEqual([{ premium: 93 }]);
  });
  it("one plain potion: 40 G base plus 4 G first insurance plus 5 G fee = 49 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] }).results).toEqual([{ premium: 49 }]);
  });
  it("one rune: 25 G base plus 2.5 G first insurance plus 5 G fee rounds up to 33 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}]}]}).results).toEqual([{"premium": 33}]);
  });
  it("one moonstone: 25 G base plus 2.5 G first insurance plus 5 G fee rounds up to 33 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "moonstone"}]}]}).results).toEqual([{"premium": 33}]);
  });
  it("2 runes: 50 G base premium, total 60 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}]}]}).results).toEqual([{"premium": 60}]);
  });
  it("3 runes: exact block base 60 G, total 71 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}, {"type": "rune"}]}]}).results).toEqual([{"premium": 71}]);
  });
  it("4 runes: no block, base 100 G, total 115 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}, {"type": "rune"}, {"type": "rune"}]}]}).results).toEqual([{"premium": 115}]);
  });
  it("7 runes: no block, base 175 G, total 198 G after rounding up 197.5 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}, {"type": "rune"}, {"type": "rune"}, {"type": "rune"}, {"type": "rune"}, {"type": "rune"}]}]}).results).toEqual([{"premium": 198}]);
  });
  it("2 runes and 1 moonstone: different types, no block, base 75 G, total 88 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]}]}).results).toEqual([{"premium": 88}]);
  });
  it("3 runes and 3 moonstones: separate blocks base 120 G, total 137 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}, {"type": "moonstone"}, {"type": "moonstone"}]}]}).results).toEqual([{"premium": 137}]);
  });
  it("cursed sword: 50 G item surcharge; newcomer pays 165 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "cursed": true}]}]}).results).toEqual([{"premium": 165}]);
  });
  it("enchanted sword at level 4: no high-enchantment surcharge, premium 115 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "enchantment": 4}]}]}).results).toEqual([{"premium": 115}]);
  });
  it("enchanted sword at level 5: 30 G item surcharge, premium 145 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "enchantment": 5}]}]}).results).toEqual([{"premium": 145}]);
  });
  it("cursed sword at level 5: both item surcharges, premium 195 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "enchantment": 5, "cursed": true}]}]}).results).toEqual([{"premium": 195}]);
  });
  it("cursed sword and plain amulet: 160 G policy base plus 50 G item curse, 16 G first-insurance surcharge and 5 G fee = 231 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "cursed": true}, {"type": "amulet"}]}]}).results).toEqual([{"premium": 231}]);
  });
  it("customer at exactly 2 years: loyalty discount of 20 G on sword base, premium 95 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 2}, "steps": [{"op": "quote", "items": [{"type": "sword"}]}]}).results).toEqual([{"premium": 95}]);
  });
  it("second quote: follow-up discount of 15 G on sword base, first insurance still 10 G, total 100 G", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": []}, {"op": "quote", "items": [{"type": "sword"}]}]}).results).toEqual([{"premium": 5}, {"premium": 100}]);
  });
  it("long-standing second contract cursed level-7 sword: 160 G premium, including first-insurance surcharge", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 3}, "steps": [{"op": "quote", "items": [{"type": "amulet"}]}, {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}]}]}).results).toEqual([{"premium": 59}, {"premium": 160}]);
  });
  it("regular steel level-3 sword damage 500 G: payout 400 G and remaining cap 1600 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 3}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 500}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 400, "remainingCap": 1600}]);
  });
  it("rune damage 200 G: payout 100 G and remaining cap 400 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "rune"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "rune", "amount": 200}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 100, "remainingCap": 400}]);
  });
  it("dragon-material sword level 5 damage 800 G: payout 700 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "material": "dragon", "enchantment": 5}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 800}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 700, "remainingCap": 1300}]);
  });
  it("steel sword level 9 damage 1000 G: payout 400 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 9}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 1000}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 400, "remainingCap": 1600}]);
  });
  it("dragon-material sword level 8 damage 1000 G: high enchantment wins, payout 400 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "material": "dragon", "enchantment": 8}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 1000}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 400, "remainingCap": 1600}]);
  });
  it("dragon-material sword level 9 damage 1000 G: high enchantment wins, payout 400 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "material": "dragon", "enchantment": 9}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 1000}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 400, "remainingCap": 1600}]);
  });
  it("two damaged items sword 500 G and amulet 300 G: separate deductibles, payout 600 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}, {"type": "amulet"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 600, "remainingCap": 2600}]);
  });
  it("two insured swords: insurance sum 2000 G, cap 4000 G; two sword damages receive separate deductibles", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}, {"type": "sword"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 500}, {"itemType": "sword", "amount": 300}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 600, "remainingCap": 3400}]);
  });
  it("sword plus amulet: insurance sum 1600 G and cap 3200 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}, {"type": "amulet"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": []}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 0, "remainingCap": 3200}]);
  });
  it("cursed sword: cap 2000 G from value 1000 G despite premium 165 G", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "cursed": true}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": []}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 0, "remainingCap": 2000}]);
  });
  it("sword plus three runes: cap 3500 G from sum 1750 G despite block premium", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}, {"type": "rune"}, {"type": "rune"}, {"type": "rune"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": []}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 0, "remainingCap": 3500}]);
  });
  it("two successive sword claims of 1500 G: first pays 1400 G leaving 600 G, second pays 600 G leaving zero", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 1500}]}}, {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1500}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 1400, "remainingCap": 600}, {"payout": 600, "remainingCap": 0}]);
  });
  it("fractional payout 350.5 G: round down to 350 G only at final payout", () => {
    const results = runScenario({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword", "enchantment": 8}]}, {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [{"itemType": "sword", "amount": 901}]}}]}).results;
    expect(results[0]).toHaveProperty("premium", expect.any(Number));
    expect(results.slice(1)).toEqual([{"payout": 350, "remainingCap": 1650}]);
  });
  it("fractional intermediate premium: retain fractions until final ceiling", () => {
    expect(runScenario({"customer": {"yearsWithMHPCO": 2}, "steps": [{"op": "quote", "items": [{"type": "rune"}]}]}).results).toEqual([{"premium": 28}]);
  });
  it("schema example: quote amulet then claim fire damage 200 G yields integer premium 59 G and payout 100 G, remainingCap 1100 G", () => {
    const input = {"customer": {"yearsWithMHPCO": 5}, "steps": [{"op": "quote", "items": [{"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]}, {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]};
    const output = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(output.status).toBe(0);
    expect(JSON.parse(output.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(output.stderr).toBe("");
  });
  it("staff claim of 100 G: payout 0 G and cap 1600 G from value 800 G", () => {
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "staff", amount: 100 }] } }] }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("potion claim of 100 G: payout 0 G and cap 800 G from value 400 G", () => {
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "potion", amount: 100 }] } }] }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 800 });
  });
  it("moonstone claim of 100 G: payout 0 G and cap 500 G from value 250 G", () => {
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "moonstone" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "moonstone", amount: 100 }] } }] }).results;
    expect(results[1]).toEqual({ payout: 0, remainingCap: 500 });
  });
  it("CLI unknown quote type broomstick: nonzero exit, stderr description, no results on stdout", () => {
    expectCLIError({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]});
  });
  it("CLI claim amulet when only sword covered: nonzero exit and stderr description", () => {
    expectCLIError({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 100}]}}]});
  });
  it("CLI claim unknown item type: nonzero exit and stderr description", () => {
    expectCLIError({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "broomstick", "amount": 100}]}}]});
  });
  it("CLI two sword damages with only one sword insured: reject whole claim with nonzero exit and stderr", () => {
    expectCLIError({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": 100}, {"itemType": "sword", "amount": 100}]}}]});
  });
  it("CLI damage amount -200: nonzero exit and stderr description", () => {
    expectCLIError({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]}}]});
  });
});
