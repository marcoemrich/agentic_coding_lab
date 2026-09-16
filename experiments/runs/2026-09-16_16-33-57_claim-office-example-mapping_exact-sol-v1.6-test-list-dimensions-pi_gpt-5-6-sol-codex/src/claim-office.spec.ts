import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Damage, type Item, type Scenario } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];
const cap = (items: Item[]) =>
  runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
  ] }).results[1];
const claim = (items: Item[], damages: Damage[]) =>
  runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "damage", damages } },
  ] }).results[1];
const invalidCli = (scenario: Scenario) => spawnSync("./claim-office", [], {
  input: JSON.stringify(scenario), encoding: "utf8",
});
const customer = { yearsWithMHPCO: 0 };

const repeated = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => expect(quote([])).toEqual({ premium: 5 }));
  it("quotes a plain sword from its 100 G base premium at 115 G", () => expect(quote([{ type: "sword" }])).toEqual({ premium: 115 }));
  it("quotes a plain amulet from its 60 G base premium at 71 G", () => expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 }));
  it("quotes a plain staff from its 80 G base premium at 93 G", () => expect(quote([{ type: "staff" }])).toEqual({ premium: 93 }));
  it("quotes a plain potion from its 40 G base premium at 49 G", () => expect(quote([{ type: "potion" }])).toEqual({ premium: 49 }));
  it("quotes one rune from its 25 G base premium at 33 G", () => expect(quote([{ type: "rune" }])).toEqual({ premium: 33 }));
  it("quotes one moonstone from its 25 G base premium at 33 G", () => expect(quote([{ type: "moonstone" }])).toEqual({ premium: 33 }));

  it("gives a sword policy a 2000 G cap from its 1000 G insurance value", () => expect(cap([{ type: "sword" }])).toEqual({ payout: 0, remainingCap: 2000 }));
  it("gives an amulet policy a 1200 G cap from its 600 G insurance value", () => expect(cap([{ type: "amulet" }])).toEqual({ payout: 0, remainingCap: 1200 }));
  it("gives a staff policy a 1600 G cap from its 800 G insurance value", () => expect(cap([{ type: "staff" }])).toEqual({ payout: 0, remainingCap: 1600 }));
  it("gives a potion policy an 800 G cap from its 400 G insurance value", () => expect(cap([{ type: "potion" }])).toEqual({ payout: 0, remainingCap: 800 }));
  it("gives a rune policy a 500 G cap from its 250 G insurance value", () => expect(cap([{ type: "rune" }])).toEqual({ payout: 0, remainingCap: 500 }));
  it("gives a moonstone policy a 500 G cap from its 250 G insurance value", () => expect(cap([{ type: "moonstone" }])).toEqual({ payout: 0, remainingCap: 500 }));

  it("quotes 2 runes from a 50 G component base at 60 G", () => expect(quote(repeated("rune", 2))).toEqual({ premium: 60 }));
  it("quotes exactly 3 runes from the 60 G block base at 71 G", () => expect(quote(repeated("rune", 3))).toEqual({ premium: 71 }));
  it("quotes 4 runes without a block from a 100 G base at 115 G", () => expect(quote(repeated("rune", 4))).toEqual({ premium: 115 }));
  it("quotes 7 runes without blocks at 198 G after rounding 197.5 up", () => expect(quote(repeated("rune", 7))).toEqual({ premium: 198 }));
  it("does not combine 2 runes and 1 moonstone: 75 G base quotes at 88 G", () => expect(quote([...repeated("rune", 2), { type: "moonstone" }])).toEqual({ premium: 88 }));
  it("applies separate blocks to 3 runes and 3 moonstones: 120 G base quotes at 137 G", () => expect(quote([...repeated("rune", 3), ...repeated("moonstone", 3)])).toEqual({ premium: 137 }));

  it("scopes a cursed sword surcharge to that item beside a plain amulet: 210 G before policy modifiers and 231 G final", () => expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 }));
  it("applies loyalty at exactly 2 years: a plain sword quotes at 95 G", () => expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 }));
  it("applies both curse and high-enchantment surcharges at enchantment 5: 195 G", () => expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 }));
  it("does not apply high-enchantment at level 4 but applies curse: 165 G", () => expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 }));
  it("quotes a newcomer’s cursed steel sword at 165 G", () => expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 }));
  it("quotes a long-standing customer’s cursed level-7 sword on the second contract at 160 G, retaining first-insurance surcharge", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it("pays 400 G for a dragon sword at exactly enchantment 8 damaged for 1000 G, leaving 1600 G cap", () => expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("deducts 100 G separately for sword damage 500 G and amulet damage 300 G: payout 600 G", () => expect(claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 }));
  it("fully reimburses a regular level-3 steel sword less deductible: damage 500 G pays 400 G", () => expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("fully reimburses a rune less deductible: damage 200 G pays 100 G", () => expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 }));
  it("lets the 50% enchantment rule win for a level-9 dragon sword: damage 1000 G pays 400 G", () => expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("fully reimburses a level-5 dragon sword: damage 800 G pays 700 G", () => expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 }));
  it("half reimburses a level-9 steel sword: damage 1000 G pays 400 G", () => expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }));

  it("gives two insured swords a 4000 G cap", () => expect(cap(repeated("sword", 2))).toEqual({ payout: 0, remainingCap: 4000 }));
  it("treats two sword damage entries as separate insured items and deductibles: 500 G each pays 800 G", () => expect(claim(repeated("sword", 2), [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 }));
  it("rejects the whole claim via non-zero CLI exit, stderr, and no stdout when sword damages outnumber insured swords", () => {
    const result = invalidCli({ customer, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr).not.toBe(""); expect(result.stdout).toBe("");
  });

  it("caps a sword-and-amulet policy at 3200 G", () => expect(cap([{ type: "sword" }, { type: "amulet" }])).toEqual({ payout: 0, remainingCap: 3200 }));
  it("keeps a cursed sword cap at 2000 G despite premium modifiers", () => expect(cap([{ type: "sword", cursed: true }])).toEqual({ payout: 0, remainingCap: 2000 }));
  it("values a sword and 3-rune block at 1750 G insurance sum and 3500 G cap", () => expect(cap([{ type: "sword" }, ...repeated("rune", 3)])).toEqual({ payout: 0, remainingCap: 3500 }));
  it("exhausts a sword policy cap across claims: payouts 1400 G then 600 G, remaining caps 600 G then 0 G", () => {
    const result = runScenario({ customer, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } }] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a raw payout of 350.5 G down to 350 G only at the end", () => expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 }));

  it("rejects an unknown quoted broomstick via non-zero CLI exit, stderr, and no stdout", () => {
    const result = invalidCli({ customer, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0); expect(result.stderr).not.toBe(""); expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsured known item via non-zero CLI exit, stderr, and no stdout", () => {
    const result = invalidCli({ customer, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr).not.toBe(""); expect(result.stdout).toBe("");
  });
  it("rejects damage to an unknown item via non-zero CLI exit, stderr, and no stdout", () => {
    const result = invalidCli({ customer, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr).not.toBe(""); expect(result.stdout).toBe("");
  });
  it("rejects negative damage via non-zero CLI exit, stderr, and no stdout", () => {
    const result = invalidCli({ customer, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] });
    expect(result.status).not.toBe(0); expect(result.stderr).not.toBe(""); expect(result.stdout).toBe("");
  });

  it("reads sequential JSON steps from stdin and writes ordered quote and claim result objects to stdout", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 5 }, steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    const result = invalidCli(scenario);
    expect(result.status).toBe(0); expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
