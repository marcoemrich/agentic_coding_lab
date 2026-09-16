import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Item } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0, priorQuotes = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      ...Array.from({ length: priorQuotes }, () => ({ op: "quote", items: [] })),
      { op: "quote", items },
    ],
  }).results.at(-1);

const policyScenario = (items: Item[], damages: Array<{ itemType: string; amount: number }> = []) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "incident", damages } },
    ],
  });

const runCli = (scenario: unknown) => spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
  input: JSON.stringify(scenario),
  encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one plain sword at 115 G from its 100 G base premium", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("quotes one plain amulet at 71 G from its 60 G base premium", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("quotes one plain staff at 93 G from its 80 G base premium", () => {
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("quotes one plain potion at 49 G from its 40 G base premium", () => {
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes one rune at 33 G from its 25 G component base premium", () => {
    expect(quote([{ type: "rune" }])).toEqual({ premium: 33 });
  });
  it("quotes one moonstone at 33 G from its 25 G component base premium", () => {
    expect(quote([{ type: "moonstone" }])).toEqual({ premium: 33 });
  });
  it("quotes 2 runes at 60 G from a 50 G base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes at 71 G from the 60 G block premium", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ premium: 71 });
  });
  it("quotes 4 runes at 115 G from a 100 G base premium with no block", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes 7 runes at 198 G from a 175 G base premium and rounds 197.5 up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("quotes 2 runes and 1 moonstone at 88 G because unlike types do not form a block", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("quotes 3 runes and 3 moonstones at 137 G from two separate 60 G blocks", () => {
    expect(quote([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy, yielding 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("applies the loyalty discount at exactly 2 years, yielding 95 G for a plain sword", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, yielding 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, yielding 165 G for a cursed sword", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 });
  });
  it("applies high-enchantment surcharge at enchantment 5 without a curse, yielding 145 G", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it("applies the 15% follow-up discount after the first quote while retaining each item's 10% assessment, yielding 100 G", () => {
    expect(quote([{ type: "sword" }], 0, 1)).toEqual({ premium: 100 });
  });
  it("quotes the newcomer cursed steel sword integration example at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]))
      .toEqual({ premium: 165 });
  });
  it("quotes the long-standing customer's cursed enchantment-7 sword on the second contract at 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, 1))
      .toEqual({ premium: 160 });
  });
  it("gives a sword policy a 2000 G cap from its 1000 G insurance value", () => {
    expect(policyScenario([{ type: "sword" }]).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives an amulet policy a 1200 G cap from its 600 G insurance value", () => {
    expect(policyScenario([{ type: "amulet" }]).results[1]).toEqual({ payout: 0, remainingCap: 1200 });
  });
  it("gives a staff policy a 1600 G cap from its 800 G insurance value", () => {
    expect(policyScenario([{ type: "staff" }]).results[1]).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("gives a potion policy an 800 G cap from its 400 G insurance value", () => {
    expect(policyScenario([{ type: "potion" }]).results[1]).toEqual({ payout: 0, remainingCap: 800 });
  });
  it("gives a rune policy a 500 G cap from its 250 G insurance value", () => {
    expect(policyScenario([{ type: "rune" }]).results[1]).toEqual({ payout: 0, remainingCap: 500 });
  });
  it("gives a moonstone policy a 500 G cap from its 250 G insurance value", () => {
    expect(policyScenario([{ type: "moonstone" }]).results[1]).toEqual({ payout: 0, remainingCap: 500 });
  });
  it("reimburses regular sword damage of 500 G at 400 G after one deductible", () => {
    expect(policyScenario(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    ).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage of 200 G at 100 G without special clauses", () => {
    expect(policyScenario([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).results[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("reimburses an enchantment-8 dragon sword damaged for 1000 G at 400 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    ).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50% enchantment rule win for an enchantment-9 dragon sword, paying 400 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    ).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses an enchantment-5 dragon sword before deductible, paying 700 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    ).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("reimburses an enchantment-9 steel sword at 50% before deductible, paying 400 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    ).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a separate 100 G deductible to sword and amulet damage entries, paying 600 G", () => {
    expect(policyScenario(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    ).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("covers two swords with a 4000 G cap and treats their damage entries separately", () => {
    expect(policyScenario(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    ).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim by throwing when sword damage entries outnumber insured swords", () => {
    expect(() => policyScenario(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    )).toThrow();
  });
  it("sets a sword-and-amulet policy cap to 3200 G", () => {
    expect(policyScenario([{ type: "sword" }, { type: "amulet" }]).results[1])
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword cap at 2000 G despite premium modifiers", () => {
    expect(policyScenario([{ type: "sword", cursed: true }]).results[1])
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets a sword-and-3-rune policy cap to 3500 G despite the component block discount", () => {
    expect(policyScenario([
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ]).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts 1400 G then 600 G, exhausting the cap", () => {
    const scenario = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(scenario.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional raw payout of 350.5 G down to 350 G", () => {
    expect(policyScenario(
      [{ type: "sword", enchantment: 8 }],
      [{ itemType: "sword", amount: 901 }],
    ).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown|broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a claim for an uninsured item through the CLI with non-zero status and stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("rejects a claim for an unknown item type through the CLI with non-zero status and stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("rejects a negative damage amount through the CLI with non-zero status and stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("reads the normative JSON schema from stdin and emits ordered quote and claim results through the CLI", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
    expect(result.stderr).toBe("");
  });
});
