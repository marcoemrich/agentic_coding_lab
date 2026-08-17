import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario, type Item, type Scenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Item[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: Array<{ itemType: string; amount: number }>) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "incident", damages },
});
const run = (scenario: Scenario) => processScenario(scenario);
const runCli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("empty quote returns premium 5 G (processing fee only)", () => {
    expect(run({ customer: customer(), steps: [quote([])] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("main price list quotes sword 115, amulet 71, staff 93, and potion 49 G", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      run({ customer: customer(), steps: [quote([{ type }])] }).results[0],
    );
    expect(premiums).toEqual([
      { premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 },
    ]);
  });
  it("2 runes have 50 G base and quote to 60 G", () => {
    expect(run({ customer: customer(), steps: [quote([{ type: "rune" }, { type: "rune" }])] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("exactly 3 runes use the 60 G block base and quote to 71 G", () => {
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(run({ customer: customer(), steps: [quote(runes)] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes do not use a block: 100 G base and 115 G premium", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(run({ customer: customer(), steps: [quote(runes)] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes do not use blocks: 175 G base and rounded premium 198 G", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(run({ customer: customer(), steps: [quote(runes)] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes plus 1 moonstone are unlike: 75 G base and 88 G premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(run({ customer: customer(), steps: [quote(items)] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes plus 3 moonstones form separate blocks: 120 G base and 137 G premium", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(run({ customer: customer(), steps: [quote(items)] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("cursed sword plus plain amulet scopes 50 G curse to sword: premium 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(run({ customer: customer(), steps: [quote(items)] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("exactly 2 years activates loyalty: plain sword premium 95 G", () => {
    expect(run({ customer: customer(2), steps: [quote([{ type: "sword" }])] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it("enchantment exactly 5 and curse both apply: sword premium 195 G", () => {
    const sword = { type: "sword", enchantment: 5, cursed: true };
    expect(run({ customer: customer(), steps: [quote([sword])] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("enchantment 4 avoids enchantment surcharge while curse applies: premium 165 G", () => {
    const sword = { type: "sword", enchantment: 4, cursed: true };
    expect(run({ customer: customer(), steps: [quote([sword])] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("newcomer cursed sword integration premium is 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(run({ customer: customer(), steps: [quote([sword])] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second cursed enchanted sword contract is 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(run({ customer: customer(3), steps: [quote([]), quote([sword])] }))
      .toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("regular sword damage 500 pays 400 G and leaves cap 1600 G", () => {
    const steps = [
      quote([{ type: "sword", material: "steel", enchantment: 3 }]),
      claim(0, [{ itemType: "sword", amount: 500 }]),
    ];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 pays 100 G and leaves cap 400 G", () => {
    const steps = [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword at enchantment 8 with damage 1000 pays 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword at enchantment 9 with damage 1000 pays 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword at enchantment 5 with damage 800 pays 700 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 800 }])];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword at enchantment 9 with damage 1000 pays 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    const steps = [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword damage 500 plus amulet damage 300 applies two deductibles: payout 600 G", () => {
    const items = [{ type: "sword", enchantment: 3 }, { type: "amulet", enchantment: 2 }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const result = run({ customer: customer(), steps: [quote(items), claim(0, damages)] }).results[1];
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords have cap 4000 and two damage entries get separate deductibles", () => {
    const items = [{ type: "sword", enchantment: 3 }, { type: "sword", enchantment: 3 }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const result = run({ customer: customer(), steps: [quote(items), claim(0, damages)] }).results[1];
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more same-type damages than insured items rejects the whole claim", () => {
    const steps = [
      quote([{ type: "sword" }]),
      claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]),
    ];
    expect(() => run({ customer: customer(), steps })).toThrow();
  });
  it("sword plus amulet insurance sum 1600 creates cap 3200 G", () => {
    const steps = [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [])];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword premium modifiers do not raise its 2000 G cap", () => {
    const steps = [quote([{ type: "sword", cursed: true }]), claim(0, [])];
    expect(run({ customer: customer(), steps }).results)
      .toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword plus 3-rune premium block still creates insurance sum 1750 and cap 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [quote(items), claim(0, [])];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive sword claims of 1500 pay 1400 then 600 and exhaust the cap", () => {
    const steps = [
      quote([{ type: "sword", enchantment: 3 }]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
    ];
    expect(run({ customer: customer(), steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("fractional premium 197.5 rounds up to 198 only at the end", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(run({ customer: customer(), steps: [quote(items)] }).results[0])
      .toEqual({ premium: 198 });
  });
  it("fractional payout 350.5 rounds down to 350 only at the end", () => {
    const steps = [
      quote([{ type: "sword", enchantment: 8 }]),
      claim(0, [{ itemType: "sword", amount: 901 }]),
    ];
    expect(run({ customer: customer(), steps }).results[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("invalid quote type, uninsured or unknown claim item, and negative damage fail via CLI", () => {
    const invalidScenarios = [
      { customer: customer(), steps: [quote([{ type: "broomstick" }])] },
      { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "amulet", amount: 200 }])] },
      { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "broomstick", amount: 200 }])] },
      { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])] },
    ];
    for (const scenario of invalidScenarios) {
      const result = runCli(scenario);
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
      expect(result.stdout).toBe("");
    }
  });
  it("CLI processes sequential quote and claim and emits the binding JSON result fields", () => {
    const scenario = {
      customer: customer(5),
      steps: [
        quote([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]),
        claim(0, [{ itemType: "amulet", amount: 200 }]),
      ],
    };
    const result = runCli(scenario);
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("three alike main items do not receive the component block: premium 335 G", () => {
    const swords = Array.from({ length: 3 }, () => ({ type: "sword" }));
    expect(run({ customer: customer(), steps: [quote(swords)] }).results[0])
      .toEqual({ premium: 335 });
  });
});
