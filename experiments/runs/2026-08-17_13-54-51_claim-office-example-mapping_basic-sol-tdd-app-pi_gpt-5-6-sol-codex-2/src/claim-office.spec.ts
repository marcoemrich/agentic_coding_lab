import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Scenario } from "./claim-office.js";

const run = (scenario: Scenario) => processScenario(scenario).results;
const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Scenario["steps"][number] extends never ? never : any) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: Array<{ itemType: string; amount: number }>) => ({ op: "claim" as const, policy, incident: { cause: "incident", damages } });

const item = (type: string, options: Record<string, unknown> = {}) => ({ type, ...options });

describe("MHPCO claim office", () => {
  it("empty quote costs 5 G", () => {
    expect(run({ customer: customer(), steps: [quote([])] })).toEqual([{ premium: 5 }]);
  });
  it("main-item price list yields sword 115 G, amulet 71 G, staff 93 G, and potion 49 G", () => {
    const premium = (type: string) => run({ customer: customer(), steps: [quote([item(type)])] })[0];
    expect(premium("sword")).toEqual({ premium: 115 });
    expect(premium("amulet")).toEqual({ premium: 71 });
    expect(premium("staff")).toEqual({ premium: 93 });
    expect(premium("potion")).toEqual({ premium: 49 });
  });
  it("2 runes have 50 G base premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("rune"), item("rune")])] })).toEqual([{ premium: 60 }]);
  });
  it("exactly 3 runes use the 60 G block premium", () => {
    expect(run({ customer: customer(), steps: [quote([item("rune"), item("rune"), item("rune")])] })).toEqual([{ premium: 71 }]);
  });
  it("4 runes cost 100 G base premium with no block", () => {
    expect(run({ customer: customer(), steps: [quote(Array.from({ length: 4 }, () => item("rune"))) ] })).toEqual([{ premium: 115 }]);
  });
  it("7 runes cost 175 G base premium with no block", () => {
    expect(run({ customer: customer(), steps: [quote(Array.from({ length: 7 }, () => item("rune"))) ] })).toEqual([{ premium: 198 }]);
  });
  it("2 runes plus 1 moonstone cost 75 G base premium with no mixed block", () => {
    expect(run({ customer: customer(), steps: [quote([item("rune"), item("rune"), item("moonstone")])] })).toEqual([{ premium: 88 }]);
  });
  it("3 runes plus 3 moonstones cost 120 G base premium as two blocks", () => {
    const items = [...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))];
    expect(run({ customer: customer(), steps: [quote(items)] })).toEqual([{ premium: 137 }]);
  });
  it("cursed sword plus plain amulet scopes the 50 G curse surcharge to the sword", () => {
    const items = [item("sword", { cursed: true }), item("amulet", { cursed: false })];
    expect(run({ customer: customer(), steps: [quote(items)] })).toEqual([{ premium: 231 }]);
  });
  it("exactly 2 years applies the 20% loyalty discount", () => {
    expect(run({ customer: customer(2), steps: [quote([item("sword")])] })).toEqual([{ premium: 95 }]);
  });
  it("enchantment 5 and curse both apply to a sword", () => {
    expect(run({ customer: customer(), steps: [quote([item("sword", { cursed: true, enchantment: 5 })])] })).toEqual([{ premium: 195 }]);
  });
  it("enchantment 4 does not add a surcharge while curse still applies", () => {
    expect(run({ customer: customer(), steps: [quote([item("sword", { cursed: true, enchantment: 4 })])] })).toEqual([{ premium: 165 }]);
  });
  it("newcomer with cursed sword pays 165 G", () => {
    expect(run({ customer: customer(), steps: [quote([item("sword", { material: "steel", enchantment: 3, cursed: true })])] })).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer's second cursed enchanted sword quote pays 160 G and still has initial assessment", () => {
    const steps = [quote([]), quote([item("sword", { material: "steel", enchantment: 7, cursed: true })])];
    expect(run({ customer: customer(3), steps })).toEqual([{ premium: 5 }, { premium: 160 }]);
  });
  it("premium calculation of 197.5 G rounds up once to 198 G", () => {
    const runes = Array.from({ length: 7 }, () => item("rune"));
    expect(run({ customer: customer(), steps: [quote(runes)] })).toEqual([{ premium: 198 }]);
  });
  it("regular steel enchantment-3 sword damage 500 G pays 400 G", () => {
    const steps = [quote([item("sword", { material: "steel", enchantment: 3 })]), claim(0, [{ itemType: "sword", amount: 500 }])];
    expect(run({ customer: customer(), steps })).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("rune damage 200 G pays 100 G", () => {
    const steps = [quote([item("rune")]), claim(0, [{ itemType: "rune", amount: 200 }])];
    expect(run({ customer: customer(), steps })).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });
  it("dragon or steel sword at enchantment 8+ damage 1000 G pays 400 G because 50% wins", () => {
    const payout = (material: string, enchantment: number) => run({
      customer: customer(),
      steps: [quote([item("sword", { material, enchantment })]), claim(0, [{ itemType: "sword", amount: 1000 }])],
    })[1];
    expect(payout("dragon", 8)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(payout("dragon", 9)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(payout("steel", 9)).toEqual({ payout: 400, remainingCap: 1600 });
    const fractional = run({
      customer: customer(),
      steps: [quote([item("sword", { material: "steel", enchantment: 9 })]), claim(0, [{ itemType: "sword", amount: 901 }])],
    })[1];
    expect(fractional).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("dragon sword at enchantment 5 damage 800 G pays 700 G", () => {
    const steps = [quote([item("sword", { material: "dragon", enchantment: 5 })]), claim(0, [{ itemType: "sword", amount: 800 }])];
    expect(run({ customer: customer(), steps })[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("sword damage 500 G and amulet damage 300 G pay 600 G with two deductibles", () => {
    const steps = [quote([item("sword"), item("amulet")]), claim(0, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ])];
    expect(run({ customer: customer(), steps })[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords create 4000 G cap and two damage entries are separate", () => {
    const steps = [quote([item("sword"), item("sword")]), claim(0, [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ])];
    expect(run({ customer: customer(), steps })).toEqual([
      { premium: 225 },
      { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("successive sword claims of 1500 G pay 1400 G then 600 G and exhaust cap", () => {
    const steps = [
      quote([item("sword")]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
      claim(0, [{ itemType: "sword", amount: 1500 }]),
    ];
    expect(run({ customer: customer(), steps }).slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("cap uses unmodified values and component block does not reduce insurance sum", () => {
    const cursed = run({ customer: customer(), steps: [
      quote([item("sword", { cursed: true })]),
      claim(0, [{ itemType: "sword", amount: 0 }]),
    ]});
    const blockItems = [item("sword"), item("rune"), item("rune"), item("rune")];
    const block = run({ customer: customer(), steps: [
      quote(blockItems),
      claim(0, [{ itemType: "rune", amount: 0 }]),
    ]});
    expect(cursed).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
    expect(block[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("throws Error for unknown quote types, uninsured or excess damages, negative amounts, or invalid policy", () => {
    const invalid = [
      { customer: customer(), steps: [quote([item("broomstick")])] },
      { customer: customer(), steps: [quote([item("sword")]), claim(0, [{ itemType: "amulet", amount: 200 }])] },
      { customer: customer(), steps: [quote([item("sword")]), claim(0, [{ itemType: "broomstick", amount: 200 }])] },
      { customer: customer(), steps: [quote([item("sword")]), claim(0, [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ])] },
      { customer: customer(), steps: [quote([item("sword")]), claim(0, [{ itemType: "sword", amount: -200 }])] },
      { customer: customer(), steps: [claim(2, [{ itemType: "sword", amount: 200 }])] },
    ] as Scenario[];
    invalid.forEach((scenario) => expect(() => processScenario(scenario)).toThrow(Error));
  });
  it("CLI writes ordered normative JSON, and invalid input writes only stderr with non-zero status", () => {
    const invoke = (scenario: Scenario) => spawnSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      { input: JSON.stringify(scenario), encoding: "utf8" },
    );
    const valid = invoke({ customer: customer(5), steps: [
      quote([item("amulet", { material: "silver", enchantment: 2, cursed: false })]),
      claim(0, [{ itemType: "amulet", amount: 200 }]),
    ] });
    expect(valid.status).toBe(0);
    expect(valid.stdout.trim()).toBe('{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}');
    expect(valid.stderr).toBe("");

    const invalid = invoke({ customer: customer(), steps: [quote([item("broomstick")])] });
    expect(invalid.status).not.toBe(0);
    expect(invalid.stdout).toBe("");
    expect(invalid.stderr).toContain("Unknown item type");
  });
});
