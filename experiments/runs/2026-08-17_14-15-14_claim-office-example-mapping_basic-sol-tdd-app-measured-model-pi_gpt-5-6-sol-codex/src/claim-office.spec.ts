import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, premiumBeforePolicyModifiers, processScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });

describe("MHPCO claim office", () => {
  it("empty item list costs 5 G (processing fee only)", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("price list: sword 100 G, amulet 60 G, staff 80 G, potion 40 G base premium", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => basePremium([{ type }])))
      .toEqual([100, 60, 80, 40]);
  });
  it("2 runes cost 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("exactly 3 runes cost 60 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes cost 100 G base premium because a block requires exactly 3", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("7 runes cost 175 G base premium", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("2 runes and 1 moonstone cost 75 G base premium because types differ", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes and 3 moonstones cost 120 G base premium as two separate blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(basePremium(items)).toBe(120);
  });
  it("cursed sword and plain amulet cost 210 G before policy modifiers and fee", () => {
    expect(premiumBeforePolicyModifiers([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
  });
  it("exactly 2 years with MHPCO earns the 20% loyalty discount", () => {
    const scenario = { customer: customer(2), steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("enchantment 5 cursed sword receives both 30% and 50% surcharges", () => {
    expect(premiumBeforePolicyModifiers([{ type: "sword", enchantment: 5, cursed: true }])).toBe(180);
  });
  it("enchantment 4 sword receives no enchantment surcharge, only curse when cursed", () => {
    expect(premiumBeforePolicyModifiers([{ type: "sword", enchantment: 4, cursed: true }])).toBe(150);
  });
  it("newcomer's first quote for a cursed sword costs 165 G", () => {
    const scenario = { customer: customer(), steps: [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second quote for a cursed enchanted sword costs 160 G", () => {
    const scenario = { customer: customer(3), steps: [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("dragon sword at enchantment 8 with 1000 G damage pays 400 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("500 G sword and 300 G amulet damages pay 600 G with a deductible per item", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 3 }, { type: "amulet", enchantment: 2 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("regular sword with 500 G damage pays 400 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("rune with 200 G damage pays 100 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("dragon sword at enchantment 9 with 1000 G damage pays 400 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("dragon sword at enchantment 5 with 800 G damage pays 700 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("steel sword at enchantment 9 with 1000 G damage pays 400 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("two insured swords accept two damages and have 4000 G total cap", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("more same-type damages than insured items throws Error and rejects the whole claim", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    expect(() => processScenario(scenario)).toThrow(Error);
  });
  it("sword and amulet use a 3200 G cap based on 1600 G insurance sum", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }] });
  });
  it("cursed sword uses a 2000 G cap based on unmodified insurance value", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sword and 3-rune block use a 3500 G cap based on 1750 G insurance sum", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }] });
  });
  it("two successive 1500 G sword claims pay 1400 G then 600 G and exhaust cap", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } };
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }] }, claim, claim,
    ] };
    expect(processScenario(scenario)).toEqual({ results: [
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ] });
  });
  it("a 197.5 G premium rounds upward to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("a 350.5 G payout rounds downward to 350 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
  it("unknown quote items, uninsured or unknown damages, and negative damage throw Error", () => {
    const invalidScenarios = [
      { customer: customer(), steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }] },
      { customer: customer(), steps: [{ op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] },
      { customer: customer(), steps: [{ op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "unknown", amount: 200 }] } }] },
      { customer: customer(), steps: [{ op: "quote" as const, items: [{ type: "sword" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] },
    ];
    for (const scenario of invalidScenarios) expect(() => processScenario(scenario)).toThrow(Error);

    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(invalidScenarios[0]), encoding: "utf8",
    });
    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
    expect(cli.stderr).not.toContain("ERR_MODULE_NOT_FOUND");
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
  });
});

void expect;
void basePremium;
void processScenario;
void customer;
