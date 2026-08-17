import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item } from "./claim-office.js";

const runCli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario),
  encoding: "utf8",
});

const claim = (items: Item[], damages: Array<{ itemType: string; amount: number }>) => processScenario({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "incident", damages } },
  ],
}).results[1];

const quote = (items: Item[], yearsWithMHPCO = 0, priorQuotes = 0) => processScenario({
  customer: { yearsWithMHPCO },
  steps: [
    ...Array.from({ length: priorQuotes }, () => ({ op: "quote", items: [] })),
    { op: "quote", items },
  ],
}).results.at(-1)?.premium;

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes sword, amulet, staff, and potion at 313 G including first-insurance surcharges and fee", () => {
    expect(quote([{ type: "sword" }, { type: "amulet" }, { type: "staff" }, { type: "potion" }])).toBe(313);
  });
  it("quotes 2 runes at 60 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes as a 60 G block at 71 G after surcharge and fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes without a block at 115 G after surcharge and fee", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes without a block at 198 G after surcharge and fee", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("does not group 2 runes and 1 moonstone, quoting 88 G after surcharge and fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("groups 3 runes and 3 moonstones as two blocks, quoting 137 G after surcharge and fee", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy, quoting 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("applies loyalty at exactly 2 years, quoting a plain sword at 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, quoting a sword at 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4, quoting a cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("quotes a newcomer's cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second-contract cursed enchanted sword at 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, 1)).toBe(160);
  });
  it("rounds a 32.5 G rune premium up to 33 G", () => {
    expect(quote([{ type: "rune" }])).toBe(33);
  });
  it("rejects an unknown quote item so the CLI exits non-zero, writes stderr, and writes no stdout result", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/unknown item.*broomstick/i);
  });
  it("reimburses a regular sword damaged for 500 G at 400 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a rune damaged for 200 G at 100 G", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies one deductible to each of sword and amulet damage, paying 600 G", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [
      { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("lets enchantment 8 override dragon material for 1000 G damage, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets enchantment 9 override dragon material for 1000 G damage, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses enchantment 5 dragon material damage of 800 G minus deductible, paying 700 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]))
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves enchantment 9 steel damage of 1000 G before deductible, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("treats two insured swords as distinct damages with distinct deductibles and a 4000 G cap", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], [
      { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
    ])).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more damage entries of a type than insured so the CLI exits non-zero", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/not insured|more damage/i);
  });
  it("gives a sword-and-amulet policy a 3200 G cap", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], []))
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value", () => {
    expect(claim([{ type: "sword", cursed: true }], []))
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives a sword-and-3-rune policy a 3500 G cap despite the premium block", () => {
    expect(claim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], []))
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across successive 1500 G claims with payouts 1400 G then 600 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a calculated 350.5 G payout down to 350 G", () => {
    expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]))
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects damage to a type absent from the policy so the CLI exits non-zero and writes stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/not insured.*amulet/i);
  });
  it("rejects negative damage so the CLI exits non-zero and writes stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/negative damage|-200/i);
  });
  it("emits quote and claim results in step order using the normative schema", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("is exposed under the executable name claim-office", () => {
    const result = spawnSync("./claim-office", [], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
