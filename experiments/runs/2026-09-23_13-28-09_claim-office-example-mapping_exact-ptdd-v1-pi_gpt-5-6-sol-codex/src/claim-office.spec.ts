import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario, type Item, type Scenario } from "./claim-office.js";

const quote = (items: Item[], years = 0) => executeScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: "quote", items }] }).results[0];
const repeated = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const policyClaim = (items: Item[], damages: Array<{ itemType: string; amount: number }>) => executeScenario({
  customer: { yearsWithMHPCO: 0 },
  steps: [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "incident", damages } }],
}).results[1];
const cli = (scenario: Scenario) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
const invalidClaim = (items: Item[], damages: Array<{ itemType: string; amount: number }>) => cli({ customer: { yearsWithMHPCO: 0 }, steps: [
  { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "incident", damages } },
] });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for only the processing fee", () => expect(quote([])).toEqual({ premium: 5 }));
  it("quotes one plain sword from its 100 G base premium at 115 G", () => expect(quote([{ type: "sword" }])).toEqual({ premium: 115 }));
  it("quotes one plain amulet from its 60 G base premium at 71 G", () => expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 }));
  it("quotes one plain staff from its 80 G base premium at 93 G", () => expect(quote([{ type: "staff" }])).toEqual({ premium: 93 }));
  it("quotes one plain potion from its 40 G base premium at 49 G", () => expect(quote([{ type: "potion" }])).toEqual({ premium: 49 }));
  it("quotes 2 runes from a 50 G component base premium at 60 G", () => expect(quote(repeated("rune", 2))).toEqual({ premium: 60 }));
  it("quotes exactly 3 runes using the 60 G block base premium at 71 G", () => expect(quote(repeated("rune", 3))).toEqual({ premium: 71 }));
  it("quotes 4 runes without a block using a 100 G base premium at 115 G", () => expect(quote(repeated("rune", 4))).toEqual({ premium: 115 }));
  it("quotes 7 runes without a block using a 175 G base premium at 198 G, rounding 197.5 up", () => expect(quote(repeated("rune", 7))).toEqual({ premium: 198 }));
  it("quotes 2 runes and 1 moonstone without an alike block at 88 G", () => expect(quote([...repeated("rune", 2), { type: "moonstone" }])).toEqual({ premium: 88 }));
  it("quotes 3 runes and 3 moonstones as two separate blocks at 137 G", () => expect(quote([...repeated("rune", 3), ...repeated("moonstone", 3)])).toEqual({ premium: 137 }));
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy, yielding 231 G", () => expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 }));
  it("applies the loyalty discount at exactly 2 years, yielding 95 G for a plain sword", () => expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 }));
  it("applies high enchantment at exactly level 5 and stacks it with curse, yielding 195 G for a cursed sword", () => expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 }));
  it("does not apply high enchantment at level 4, yielding 165 G for a cursed sword", () => expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 }));
  it("quotes a newcomer cursed steel sword at 165 G", () => expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 }));
  it("quotes a long-standing customer's second contract for a new cursed level-7 sword at 160 G", () => {
    const actual = executeScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: "quote", items: [] }, { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] }] });
    expect(actual.results[1]).toEqual({ premium: 160 });
  });
  it("reports a sword-and-amulet insurance cap of 3200 G", () => expect(policyClaim([{ type: "sword" }, { type: "amulet" }], [])).toEqual({ payout: 0, remainingCap: 3200 }));
  it("bases a cursed sword's 2000 G cap on unmodified insurance value", () => expect(policyClaim([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 }));
  it("reports a sword-and-3-runes insurance sum of 1750 G and cap of 3500 G despite the premium block", () => expect(policyClaim([{ type: "sword" }, ...repeated("rune", 3)], [])).toEqual({ payout: 0, remainingCap: 3500 }));
  it("reports two swords' 2000 G insurance sum as a 4000 G cap", () => expect(policyClaim(repeated("sword", 2), [])).toEqual({ payout: 0, remainingCap: 4000 }));
  it("reports independent insurance values through caps: amulet 1200 G, staff 1600 G, potion 800 G, rune and moonstone 500 G each", () => {
    expect(["amulet", "staff", "potion", "rune", "moonstone"].map((type) => policyClaim([{ type }], []))).toEqual([
      { payout: 0, remainingCap: 1200 }, { payout: 0, remainingCap: 1600 }, { payout: 0, remainingCap: 800 }, { payout: 0, remainingCap: 500 }, { payout: 0, remainingCap: 500 },
    ]);
  });
  it("reimburses a regular steel level-3 sword damage of 500 G at 400 G after one deductible", () => expect(policyClaim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("reimburses rune damage of 200 G at 100 G without item special clauses", () => expect(policyClaim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 }));
  it("applies the level-8 50 percent clause before deductible to dragon sword damage of 1000 G, paying 400 G", () => expect(policyClaim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("lets the level-9 50 percent clause win over dragon material for 1000 G damage, paying 400 G", () => expect(policyClaim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("fully reimburses level-5 dragon sword damage of 800 G before deductible, paying 700 G", () => expect(policyClaim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 }));
  it("applies the level-9 50 percent clause to steel sword damage of 1000 G, paying 400 G", () => expect(policyClaim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }));
  it("applies a separate deductible to sword damage 500 G and amulet damage 300 G, paying 600 G", () => expect(policyClaim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 }));
  it("treats two same-type insured swords as separate damages with separate deductibles", () => expect(policyClaim(repeated("sword", 2), [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])).toEqual({ payout: 200, remainingCap: 3800 }));
  it("rounds a fractional payout of 350.5 G down to 350 G only at the end", () => expect(policyClaim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 }));
  it("limits successive 1500 G sword claims to payouts 1400 G then 600 G and leaves zero cap", () => {
    const damage = { incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const actual = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, ...damage }, { op: "claim", policy: 0, ...damage }] });
    expect(actual.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rejects the whole CLI claim when two sword damages exceed one insured sword, with non-zero status and stderr only", () => {
    const result = invalidClaim([{ type: "sword" }], [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }]);
    expect(result.status).not.toBe(0); expect(result.stderr).not.toBe(""); expect(result.stdout).toBe("");
  });
  it("rejects a CLI quote containing unknown broomstick type, with non-zero status and stderr only", () => {
    const result = cli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0); expect(result.stderr).not.toBe(""); expect(result.stdout).toBe("");
  });
  it("rejects a CLI claim for an unowned amulet, with non-zero status and stderr", () => expect(invalidClaim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]).status).not.toBe(0));
  it("rejects a CLI claim for an unknown item type, with non-zero status and stderr", () => expect(invalidClaim([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]).status).not.toBe(0));
  it("rejects a CLI claim with damage amount -200, with non-zero status and stderr", () => expect(invalidClaim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]).status).not.toBe(0));
  it("CLI reads sequential JSON steps and writes quote then claim results in matching order and normative shape", () => {
    const result = cli({ customer: { yearsWithMHPCO: 5 }, steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] });
    expect(result.status).toBe(0); expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
