import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const invokeCli = (scenario: unknown) => spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("quotes one plain sword at 115 G: 100 base + 10 first-insurance surcharge + 5 fee", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("quotes one plain amulet at 71 G, staff at 93 G, and potion at 49 G from the price list", () => {
    const premium = (type: string) => runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type }] }] }).results[0];
    expect([premium("amulet"), premium("staff"), premium("potion")]).toEqual([
      { premium: 71 }, { premium: 93 }, { premium: 49 },
    ]);
  });
  it("quotes 2 runes at a 50 G component base premium", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the special 60 G block base premium", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: Array.from({ length: 3 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 100 G base because blocks require exactly 3", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G base because blocks do not apply within larger groups", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone at 75 G base because alike means identical type", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones at 120 G base as two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse surcharge only to the cursed sword in a cursed sword plus plain amulet policy", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 30 percent high-enchantment surcharge at exactly enchantment 5 and stacks it with curse", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply the high-enchantment surcharge at enchantment 4", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies the 20 percent loyalty discount at exactly 2 years to the policy base premium", () => {
    expect(runScenario({ customer: customer(2), steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract with a new cursed enchanted sword at 160 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "amulet" }] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: customer(3), steps }).results[1]).toEqual({ premium: 160 });
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr, and no stdout results", () => {
    const result = invokeCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("pays 400 G for 500 G damage to a regular sword after one deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to an insured rune after one deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 8 because the 50 percent rule wins", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 9 because the 50 percent rule wins", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G damage to a dragon sword at enchantment 5 using full reimbursement", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a steel sword at enchantment 9 using half reimbursement", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 100 G deductible separately to sword and amulet damages for a total 600 G payout", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords for 2000 G and gives their policy a 4000 G cap", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages when two swords are insured", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole CLI claim when damage entries outnumber insured items of that type", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    const result = invokeCli({ customer: customer(), steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("gives a sword plus amulet policy a 3200 G cap from its 1600 G insurance sum", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value rather than premium", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: customer(), steps }).results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("gives sword plus 3 runes a 3500 G cap because block pricing does not reduce insurance value", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts of 1400 G then 600 G, exhausting the cap", () => {
    const incident = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident }, { op: "claim" as const, policy: 0, incident }];
    expect(runScenario({ customer: customer(), steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional 350.5 G raw payout down to 350 G only at the end", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "magic", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects through the CLI damage to an item type absent from the policy with stderr and no stdout results", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const result = invokeCli({ customer: customer(), steps });
    expect([result.status === 0, result.stderr === "", result.stdout !== ""]).toEqual([false, false, false]);
  });
  it("rejects through the CLI an unknown damaged item type with stderr and no stdout results", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    const result = invokeCli({ customer: customer(), steps });
    expect([result.status === 0, result.stderr === "", result.stdout !== ""]).toEqual([false, false, false]);
  });
  it("rejects through the CLI a negative damage amount with stderr and no stdout results", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    const result = invokeCli({ customer: customer(), steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("writes one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    const result = invokeCli({ customer: customer(5), steps });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
