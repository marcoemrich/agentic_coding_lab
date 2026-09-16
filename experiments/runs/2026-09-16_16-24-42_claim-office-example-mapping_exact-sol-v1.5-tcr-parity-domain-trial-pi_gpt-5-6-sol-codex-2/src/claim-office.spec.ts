import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item, type Scenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Item[], years = 0) => processScenario({
  customer: customer(years), steps: [{ op: "quote", items }],
}).results[0] as { premium: number };
const claim = (items: Item[], damages: Array<{ itemType: string; amount: number }>) => processScenario({
  customer: customer(),
  steps: [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "incident", damages } }],
}).results[1] as { payout: number; remainingCap: number };
const repeated = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const runCli = (scenario: Scenario) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for only the processing fee", () => expect(quote([])).toEqual({ premium: 5 }));
  it("quotes sword, amulet, staff, and potion price-list premiums as 115, 71, 93, and 49 G for a newcomer", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }]).premium)).toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at a 50 G component base premium", () => expect(quote(repeated("rune", 2)).premium).toBe(60));
  it("quotes exactly 3 runes at the special 60 G block base premium", () => expect(quote(repeated("rune", 3)).premium).toBe(71));
  it("quotes 4 runes at a 100 G base premium because blocks require exactly 3", () => expect(quote(repeated("rune", 4)).premium).toBe(115));
  it("quotes 7 runes at a 175 G base premium", () => expect(quote(repeated("rune", 7)).premium).toBe(198));
  it("quotes 2 runes and 1 moonstone at 75 G base because unlike types do not form a block", () => {
    expect(quote([...repeated("rune", 2), { type: "moonstone" }]).premium).toBe(88);
  });
  it("quotes 3 runes and 3 moonstones at a 120 G base as two separate blocks", () => {
    expect(quote([...repeated("rune", 3), ...repeated("moonstone", 3)]).premium).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy: 231 G total", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }]).premium).toBe(231);
  });
  it("applies loyalty at exactly 2 years: a plain sword costs 95 G", () => expect(quote([{ type: "sword" }], 2).premium).toBe(95));
  it("applies both curse and high-enchantment surcharges at enchantment 5: a sword costs 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }]).premium).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4: a cursed sword costs 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }]).premium).toBe(165);
  });
  it("quotes a newcomer cursed sword at the integration premium of 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]).premium).toBe(165);
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const scenario: Scenario = { customer: customer(3), steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] };
    expect((processScenario(scenario).results[1] as { premium: number }).premium).toBe(160);
  });
  it("rounds a 197.5 G premium up to 198 G only after all modifiers", () => expect(quote(repeated("rune", 7)).premium).toBe(198));
  it("rejects an unknown quote item through the CLI with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0); expect(result.stderr.length).toBeGreaterThan(0); expect(result.stdout).toBe("");
  });
  it("pays 400 G for a regular sword damaged by 500 G and leaves 1600 G cap", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged by 200 G without item special clauses", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for an enchantment-8 dragon sword damaged by 1000 G because the half rule wins", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("pays 400 G for an enchantment-9 dragon sword damaged by 1000 G because the half rule wins", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("pays 700 G for an enchantment-5 dragon sword damaged by 800 G at full reimbursement", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("pays 400 G for an enchantment-9 steel sword damaged by 1000 G at half reimbursement", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("applies a deductible to each damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]).payout).toBe(600);
  });
  it("insures two swords for a 4000 G cap and treats two sword damages separately", () => {
    expect(claim(repeated("sword", 2), [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects through the CLI when damage entries outnumber insured items of that type", () => {
    const result = runCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("sets a sword-and-amulet policy cap to 3200 G from the 1600 G insurance sum", () => expect(claim([{ type: "sword" }, { type: "amulet" }], [])).toEqual({ payout: 0, remainingCap: 3200 }));
  it("sets a cursed sword cap to 2000 G from unmodified insurance value", () => expect(claim([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 }));
  it("sets a sword-and-3-runes cap to 3500 G despite the component premium block", () => expect(claim([{ type: "sword" }, ...repeated("rune", 3)], [])).toEqual({ payout: 0, remainingCap: 3500 }));
  it("limits successive 1500 G sword claims to payouts of 1400 G then 600 G, exhausting the cap", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const result = processScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "one", damages: [damage] } }, { op: "claim", policy: 0, incident: { cause: "two", damages: [damage] } }] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional 350.5 G raw payout down to 350 G only at the end", () => {
    expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });
  it("rejects through the CLI a damage type absent from the policy with non-zero status and stderr", () => {
    const result = runCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("rejects through the CLI an unknown damage type with non-zero status and stderr", () => {
    const result = runCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("rejects through the CLI a negative damage amount with non-zero status and stderr", () => {
    const result = runCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("emits quote and claim results in step order using a zero-based quote policy index", () => {
    const scenario: Scenario = { customer: customer(5), steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    expect(processScenario(scenario).results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
});
