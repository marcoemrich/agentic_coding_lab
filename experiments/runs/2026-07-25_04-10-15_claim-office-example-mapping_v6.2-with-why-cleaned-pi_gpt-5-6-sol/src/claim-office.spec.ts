import { describe, expect, it } from "vitest";
import { runScenario, type Scenario } from "./claim-office.js";
import { executeCli } from "./cli.js";

const run = (scenario: Scenario) => runScenario(scenario);

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });

const quote = (items: Scenario["steps"][number] extends never ? never : any) => ({ op: "quote" as const, items });

const claim = (policy: number, damages: Array<{ itemType: string; amount: number }>) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "test incident", damages },
});

describe("MHPCO claim office", () => {
  it("charges only the 5 G processing fee for an empty item list", () => {
    expect(run({ customer: customer(), steps: [quote([])] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price-list base premiums and insurance values for every main item", () => {
    expect(["sword", "amulet", "staff", "potion"].map(type =>
      run({ customer: customer(), steps: [quote([{ type }]), claim(0, [])] }).results,
    )).toEqual([
      [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
      [{ premium: 71 }, { payout: 0, remainingCap: 1200 }],
      [{ premium: 93 }, { payout: 0, remainingCap: 1600 }],
      [{ premium: 49 }, { payout: 0, remainingCap: 800 }],
    ]);
  });
  it("prices components at 25 G each and applies a 60 G block only to exactly three alike components", () => {
    const premiums = [2, 3, 4, 7].map(count => run({ customer: customer(), steps: [quote(Array.from({ length: count }, () => ({ type: "rune" })))] }).results[0]);
    expect(premiums).toEqual([{ premium: 60 }, { premium: 71 }, { premium: 115 }, { premium: 198 }]);
  });
  it("treats component types separately, giving no mixed block and two blocks for three of each type", () => {
    const mixed = run({ customer: customer(), steps: [quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])] });
    const twoBlocks = run({ customer: customer(), steps: [quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])] });
    expect([mixed.results[0], twoBlocks.results[0]]).toEqual([{ premium: 88 }, { premium: 137 }]);
  });
  it("applies curse and enchantment surcharges per affected item at the exact enchantment threshold", () => {
    const premiums = [
      [{ type: "sword", cursed: true }, { type: "amulet" }],
      [{ type: "sword", enchantment: 5, cursed: true }],
      [{ type: "sword", enchantment: 4, cursed: true }],
    ].map(items => (run({ customer: customer(), steps: [quote(items)] }).results[0] as { premium: number }).premium);
    expect(premiums).toEqual([231, 195, 165]);
  });
  it("applies loyalty, first-insurance, and follow-up modifiers to policy base while adding the fee last", () => {
    const newcomer = run({ customer: customer(0), steps: [quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])] });
    const established = run({ customer: customer(3), steps: [
      quote([]),
      quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
    ] });
    expect(newcomer.results[0]).toEqual({ premium: 165 });
    expect(established.results[1]).toEqual({ premium: 160 });
  });
  it("rounds a fractional premium upward only after all modifiers", () => {
    expect(run({ customer: customer(), steps: [quote(Array.from({ length: 7 }, () => ({ type: "rune" })))] }).results[0]).toEqual({ premium: 198 });
  });
  it("reimburses ordinary items and components fully before one 100 G deductible per damage entry", () => {
    const standard = run({ customer: customer(), steps: [quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim(0, [{ itemType: "sword", amount: 500 }])] });
    const rune = run({ customer: customer(), steps: [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])] });
    const attack = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])] });
    expect([standard.results[1], rune.results[1], attack.results[1]]).toEqual([
      { payout: 400, remainingCap: 1600 },
      { payout: 100, remainingCap: 400 },
      { payout: 600, remainingCap: 2600 },
    ]);
  });
  it("uses half reimbursement at enchantment 8 or above even for dragon material, otherwise dragons reimburse fully", () => {
    const payout = (material: string, enchantment: number, amount: number) => {
      const result = run({ customer: customer(), steps: [quote([{ type: "sword", material, enchantment }]), claim(0, [{ itemType: "sword", amount }])] });
      return result.results[1];
    };
    expect([
      payout("dragon", 8, 1000), payout("dragon", 9, 1000),
      payout("dragon", 5, 800), payout("steel", 9, 1000),
    ]).toEqual([
      { payout: 400, remainingCap: 1600 }, { payout: 400, remainingCap: 1600 },
      { payout: 700, remainingCap: 1300 }, { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("supports duplicate insured item types and rejects damage multiplicity beyond policy coverage", () => {
    const duplicate = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])] });
    expect(duplicate.results).toEqual([{ premium: 225 }, { payout: 800, remainingCap: 3200 }]);
    expect(() => run({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])] })).toThrow(/not insured/i);
  });
  it("bases the policy cap on unmodified item values, including every component despite block discounts", () => {
    const swordAmulet = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [])] });
    const cursedSword = run({ customer: customer(), steps: [quote([{ type: "sword", cursed: true }]), claim(0, [])] });
    const block = run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]), claim(0, [])] });
    expect([swordAmulet.results[1], cursedSword.results[1], block.results[1]]).toEqual([
      { payout: 0, remainingCap: 3200 }, { payout: 0, remainingCap: 2000 }, { payout: 0, remainingCap: 3500 },
    ]);
  });
  it("tracks cap exhaustion across successive claims and limits the second payout to the remaining cap", () => {
    expect(run({ customer: customer(), steps: [
      quote([{ type: "sword" }]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
    ] }).results).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds fractional payout downward only at the final payout", () => {
    expect(run({ customer: customer(), steps: [
      quote([{ type: "sword", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 901 }]),
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects unknown quote item types without producing results", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "broomstick" }])] })).toThrow(/unknown item type/i);
  });
  it("rejects unowned, unknown, and negative claim damages without partially processing the claim", () => {
    const scenario = (damages: Array<{ itemType: string; amount: number }>) => ({ customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, damages)] } as Scenario);
    expect(() => run(scenario([{ itemType: "amulet", amount: 200 }]))).toThrow(/not insured/i);
    expect(() => run(scenario([{ itemType: "wand", amount: 200 }]))).toThrow(/not insured/i);
    expect(() => run(scenario([{ itemType: "sword", amount: -200 }]))).toThrow(/negative/i);
    expect(() => run(scenario([{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 200 }]))).toThrow(/not insured/i);
  });
  it("processes the normative CLI scenario sequentially and emits results in input order", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        quote([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]),
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(JSON.parse(executeCli(input))).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
