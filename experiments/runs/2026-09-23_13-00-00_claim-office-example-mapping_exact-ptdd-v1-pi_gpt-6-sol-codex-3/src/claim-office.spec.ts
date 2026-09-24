import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./office.js";

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
const item = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Item[], years = 0) => runScenario({ customer: customer(years), steps: [{ op: "quote", items }] }).results[0];
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const incident = (...damages: ReturnType<typeof damage>[]) => ({ cause: "dragon attack", damages });
const policy = (items: Item[], ...incidents: ReturnType<typeof incident>[]) =>
  runScenario({ customer: customer(), steps: [{ op: "quote", items }, ...incidents.map(entry => ({ op: "claim" as const, policy: 0, incident: entry }))] }).results;
const cli = (steps: unknown[]) => spawnSync("./claim-office", { input: JSON.stringify({ customer: customer(), steps }), encoding: "utf8" });

// Each case is an independently executable example from the initial inactive list.
describe("MHPCO quotes", () => {
  it("empty items: fee 5", () => expect(quote([])).toEqual({ premium: 5 }));
  it("sword base 100 and value 1000: premium 115", () => expect(quote(item("sword", 1))).toEqual({ premium: 115 }));
  it("amulet base 60: premium 71", () => expect(quote(item("amulet", 1))).toEqual({ premium: 71 }));
  it("staff base 80: premium 93", () => expect(quote(item("staff", 1))).toEqual({ premium: 93 }));
  it("potion base 40: premium 49", () => expect(quote(item("potion", 1))).toEqual({ premium: 49 }));
  it("rune base 25: premium 33 after rounding 32.5 up", () => expect(quote(item("rune", 1))).toEqual({ premium: 33 }));
  it("moonstone base 25: premium 33", () => expect(quote(item("moonstone", 1))).toEqual({ premium: 33 }));
  it("2 runes base 50: premium 60", () => expect(quote(item("rune", 2))).toEqual({ premium: 60 }));
  it("3 runes block base 60: premium 71", () => expect(quote(item("rune", 3))).toEqual({ premium: 71 }));
  it("4 runes no block base 100: premium 115", () => expect(quote(item("rune", 4))).toEqual({ premium: 115 }));
  it("7 runes no block base 175: premium 198 after rounding 197.5 up", () => expect(quote(item("rune", 7))).toEqual({ premium: 198 }));
  it("2 runes plus moonstone no block base 75: premium 88", () => expect(quote([...item("rune", 2), ...item("moonstone", 1)])).toEqual({ premium: 88 }));
  it("3 runes and 3 moonstones two blocks base 120: premium 137", () => expect(quote([...item("rune", 3), ...item("moonstone", 3)])).toEqual({ premium: 137 }));
  it("cursed sword and plain amulet: surcharge 50 on sword base only, premium 231", () => expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 }));
  it("steel sword enchantment 4: no high surcharge, premium 115", () => expect(quote([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 }));
  it("sword enchantment 5: high surcharge 30, premium 145", () => expect(quote([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 }));
  it("cursed sword enchantment 5: 50 plus 30 surcharges, premium 195", () => expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 }));
  it("exactly 2 years: loyalty discount 20 on base, premium 95", () => expect(quote(item("sword", 1), 2)).toEqual({ premium: 95 }));
  it("1 year: no loyalty, premium 115", () => expect(quote(item("sword", 1), 1)).toEqual({ premium: 115 }));
  it("second quote: first insurance 10 still applies and follow-up discount 15: premium 100", () => {
    expect(runScenario({ customer: customer(), steps: [{ op: "quote", items: item("sword", 1) }, { op: "quote", items: item("sword", 1) }] }).results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("newcomer cursed steel sword enchantment 3: premium 165", () => expect(quote([{ type: "sword", cursed: true, material: "steel", enchantment: 3 }])).toEqual({ premium: 165 }));
  it("3-year customer's second quote cursed steel sword enchantment 7: premium 160", () => {
    expect(runScenario({ customer: customer(3), steps: [{ op: "quote", items: [] }, { op: "quote", items: [{ type: "sword", cursed: true, material: "steel", enchantment: 7 }] }] }).results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO claims", () => {
  it("schema example: amulet damage 200 pays 100, cap remaining 1100", () => expect(policy([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }], incident(damage("amulet", 200)))[1]).toEqual({ payout: 100, remainingCap: 1100 }));
  it("steel sword enchantment 3 damage 500: payout 400, remaining 1600", () => expect(policy([{ type: "sword", material: "steel", enchantment: 3 }], incident(damage("sword", 500)))[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("rune damage 200: payout 100, remaining 400", () => expect(policy(item("rune", 1), incident(damage("rune", 200)))[1]).toEqual({ payout: 100, remainingCap: 400 }));
  it("dragon sword enchantment 5 damage 800: pays 700", () => expect(policy([{ type: "sword", material: "dragon", enchantment: 5 }], incident(damage("sword", 800)))[1]).toEqual({ payout: 700, remainingCap: 1300 }));
  it("steel sword enchantment 9 damage 1000: pays 400", () => expect(policy([{ type: "sword", material: "steel", enchantment: 9 }], incident(damage("sword", 1000)))[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("dragon sword enchantment 8 damage 1000: high clause wins, pays 400", () => expect(policy([{ type: "sword", material: "dragon", enchantment: 8 }], incident(damage("sword", 1000)))[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("dragon sword enchantment 9 damage 1000: high clause wins, pays 400", () => expect(policy([{ type: "sword", material: "dragon", enchantment: 9 }], incident(damage("sword", 1000)))[1]).toEqual({ payout: 400, remainingCap: 1600 }));
  it("sword 500 and amulet 300: two deductibles yield payout 600", () => expect(policy([...item("sword", 1), ...item("amulet", 1)], incident(damage("sword", 500), damage("amulet", 300)))[1]).toEqual({ payout: 600, remainingCap: 2600 }));
  it("two swords value 2000 cap 4000; two damage entries 500 each pay 800", () => expect(policy(item("sword", 2), incident(damage("sword", 500), damage("sword", 500)))[1]).toEqual({ payout: 800, remainingCap: 3200 }));
  it("staff insurance value 800 yields cap 1600", () => expect(policy(item("staff", 1), incident())[1]).toEqual({ payout: 0, remainingCap: 1600 }));
  it("potion insurance value 400 yields cap 800", () => expect(policy(item("potion", 1), incident())[1]).toEqual({ payout: 0, remainingCap: 800 }));
  it("moonstone insurance value 250 yields cap 500", () => expect(policy(item("moonstone", 1), incident())[1]).toEqual({ payout: 0, remainingCap: 500 }));
  it("sword and amulet insurance sum 1600 cap 3200", () => expect(policy([...item("sword", 1), ...item("amulet", 1)], incident())[1]).toEqual({ payout: 0, remainingCap: 3200 }));
  it("cursed sword premium 165 does not change cap 2000", () => expect(policy([{ type: "sword", cursed: true }], incident())[1]).toEqual({ payout: 0, remainingCap: 2000 }));
  it("sword and 3 rune block value 1750 cap 3500", () => expect(policy([...item("sword", 1), ...item("rune", 3)], incident())[1]).toEqual({ payout: 0, remainingCap: 3500 }));
  it("two successive sword claims 1500: pay 1400 then 600, caps 600 then 0", () => expect(policy(item("sword", 1), incident(damage("sword", 1500)), incident(damage("sword", 1500))).slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]));
  it("damage 901 at enchantment 8: 350.5 rounds down to payout 350", () => expect(policy([{ type: "sword", enchantment: 8 }], incident(damage("sword", 901)))[1]).toEqual({ payout: 350, remainingCap: 1650 }));
});

describe("CLI rejection and transport", () => {
  it("executable reads stdin and emits ordered JSON results", () => {
    const result = cli([{ op: "quote", items: [{ type: "amulet" }] }, { op: "claim", policy: 0, incident: incident(damage("amulet", 200)) }]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }, { payout: 100, remainingCap: 1100 }] });
  });
  it.each([
    ["unknown quote broomstick", [{ op: "quote", items: [{ type: "broomstick" }] }]],
    ["unlisted amulet damage", [{ op: "quote", items: item("sword", 1) }, { op: "claim", policy: 0, incident: incident(damage("amulet", 200)) }]],
    ["unknown damage type", [{ op: "quote", items: item("sword", 1) }, { op: "claim", policy: 0, incident: incident(damage("broomstick", 200)) }]],
    ["two sword damages but only one insured", [{ op: "quote", items: item("sword", 1) }, { op: "claim", policy: 0, incident: incident(damage("sword", 200), damage("sword", 200)) }]],
    ["negative damage -200", [{ op: "quote", items: item("sword", 1) }, { op: "claim", policy: 0, incident: incident(damage("sword", -200)) }]],
  ])("%s: nonzero exit with stderr description and no results on stdout", (_name, steps) => {
    const result = cli(steps as unknown[]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
});
