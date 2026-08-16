import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Scenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Array<Record<string, unknown>>) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: Array<{ itemType: string; amount: number }>) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "test incident", damages },
});
const item = (type: string, additions: Record<string, unknown> = {}) => ({ type, ...additions });

function executeCli(scenario: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

function expectCliRejection(scenario: unknown) {
  const execution = executeCli(scenario);
  expect(execution.status).not.toBe(0);
  expect(execution.stderr.length).toBeGreaterThan(0);
  expect(execution.stderr).not.toContain("ERR_MODULE_NOT_FOUND");
  expect(execution.stdout).toBe("");
}

describe("MHPCO claim office", () => {
  it("empty quote returns the 5 G processing fee", () => {
    expect(runScenario({ customer: customer(), steps: [quote([])] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("plain sword has a 115 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([item("sword")])] })).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("plain amulet has a 71 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([item("amulet")])] })).toEqual({
      results: [{ premium: 71 }],
    });
  });
  it("plain staff has a 93 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([item("staff")])] })).toEqual({
      results: [{ premium: 93 }],
    });
  });
  it("plain potion has a 49 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([item("potion")])] })).toEqual({
      results: [{ premium: 49 }],
    });
  });
  it("2 runes have a 50 G base and a 60 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([item("rune"), item("rune")])] })).toEqual({
      results: [{ premium: 60 }],
    });
  });
  it("exactly 3 runes use the 60 G block base and have a 71 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([item("rune"), item("rune"), item("rune")])] })).toEqual({
      results: [{ premium: 71 }],
    });
  });
  it("4 runes do not use a block and have a 115 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote(Array.from({ length: 4 }, () => item("rune"))) ] })).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("7 runes have a 175 G base and round a 197.5 G premium up to 198 G", () => {
    expect(runScenario({ customer: customer(), steps: [quote(Array.from({ length: 7 }, () => item("rune"))) ] })).toEqual({
      results: [{ premium: 198 }],
    });
  });
  it("2 runes and 1 moonstone are not alike and have an 88 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([item("rune"), item("rune"), item("moonstone")])] })).toEqual({
      results: [{ premium: 88 }],
    });
  });
  it("3 runes and 3 moonstones form two blocks and have a 137 G premium", () => {
    expect(runScenario({ customer: customer(), steps: [quote([
      item("rune"), item("rune"), item("rune"),
      item("moonstone"), item("moonstone"), item("moonstone"),
    ])] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("curse modifies only the cursed sword in a sword and amulet policy, producing 231 G", () => {
    const scenario: Scenario = {
      customer: customer(),
      steps: [quote([item("sword", { cursed: true }), item("amulet")])],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("exactly 2 years earns loyalty discount and produces a 95 G sword premium", () => {
    expect(runScenario({ customer: customer(2), steps: [quote([item("sword")])] })).toEqual({
      results: [{ premium: 95 }],
    });
  });
  it("enchantment 5 and curse both apply, producing a 195 G sword premium", () => {
    expect(runScenario({
      customer: customer(),
      steps: [quote([item("sword", { enchantment: 5, cursed: true })])],
    })).toEqual({ results: [{ premium: 195 }] });
  });
  it("enchantment 4 does not add enchantment risk, producing a 165 G cursed sword premium", () => {
    expect(runScenario({
      customer: customer(),
      steps: [quote([item("sword", { enchantment: 4, cursed: true })])],
    })).toEqual({ results: [{ premium: 165 }] });
  });
  it("newcomer with a cursed sword receives the integration premium of 165 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [quote([item("sword", { material: "steel", enchantment: 3, cursed: true })])],
    })).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second quote for a new cursed enchanted sword is 160 G", () => {
    expect(runScenario({
      customer: customer(3),
      steps: [
        quote([]),
        quote([item("sword", { material: "steel", enchantment: 7, cursed: true })]),
      ],
    })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("regular sword damage of 500 G pays 400 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword", { material: "steel", enchantment: 3 })]),
        claim(0, [{ itemType: "sword", amount: 500 }]),
      ],
    })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("rune damage of 200 G pays 100 G without item special clauses", () => {
    expect(runScenario({
      customer: customer(),
      steps: [quote([item("rune")]), claim(0, [{ itemType: "rune", amount: 200 }])],
    })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("dragon sword at enchantment 8 with 1000 G damage pays 400 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword", { material: "dragon", enchantment: 8 })]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("500 G sword and 300 G amulet damages deduct 100 G each and pay 600 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword"), item("amulet")]),
        claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]),
      ],
    })).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("dragon sword at enchantment 9 with 1000 G damage pays 400 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword", { material: "dragon", enchantment: 9 })]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("dragon sword at enchantment 5 with 800 G damage pays 700 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword", { material: "dragon", enchantment: 5 })]),
        claim(0, [{ itemType: "sword", amount: 800 }]),
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("steel sword at enchantment 9 with 1000 G damage pays 400 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword", { material: "steel", enchantment: 9 })]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("two insured swords accept two damages and retain the unused portion of their 4000 G cap", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword"), item("sword")]),
        claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]),
      ],
    })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("CLI rejects more same-type damage entries than the policy covers", () => {
    expectCliRejection({
      customer: customer(),
      steps: [
        quote([item("sword")]),
        claim(0, [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }]),
      ],
    });
  });
  it("sword and amulet policy caps a large claim at 3200 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword"), item("amulet")]),
        claim(0, [{ itemType: "sword", amount: 5000 }, { itemType: "amulet", amount: 5000 }]),
      ],
    })).toEqual({ results: [{ premium: 181 }, { payout: 3200, remainingCap: 0 }] });
  });
  it("cursed sword premium modifiers do not raise its 2000 G payout cap", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword", { cursed: true, enchantment: 3 })]),
        claim(0, [{ itemType: "sword", amount: 2500 }]),
      ],
    })).toEqual({ results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }] });
  });
  it("sword and 3-rune block retain a 1750 G insurance sum and 3500 G cap", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword"), item("rune"), item("rune"), item("rune")]),
        claim(0, [{ itemType: "sword", amount: 4000 }]),
      ],
    })).toEqual({ results: [{ premium: 181 }, { payout: 3500, remainingCap: 0 }] });
  });
  it("successive 1500 G sword claims pay 1400 G then 600 G and exhaust the cap", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword")]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
      ],
    })).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("a raw payout of 350.5 G rounds down to 350 G", () => {
    expect(runScenario({
      customer: customer(),
      steps: [
        quote([item("sword", { enchantment: 9 })]),
        claim(0, [{ itemType: "sword", amount: 901 }]),
      ],
    })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
  it("staff and potion insurance values cap payouts at 1600 G and 800 G", () => {
    const staffScenario: Scenario = {
      customer: customer(),
      steps: [quote([item("staff")]), claim(0, [{ itemType: "staff", amount: 5000 }])],
    };
    const potionScenario: Scenario = {
      customer: customer(),
      steps: [quote([item("potion")]), claim(0, [{ itemType: "potion", amount: 5000 }])],
    };
    expect(runScenario(staffScenario)).toEqual({
      results: [{ premium: 93 }, { payout: 1600, remainingCap: 0 }],
    });
    expect(runScenario(potionScenario)).toEqual({
      results: [{ premium: 49 }, { payout: 800, remainingCap: 0 }],
    });
  });
  it("CLI rejects an unknown quote type with stderr and no stdout", () => {
    expectCliRejection({
      customer: customer(),
      steps: [quote([item("broomstick")])],
    });
  });
  it("CLI rejects damage to an item not covered by the policy", () => {
    expectCliRejection({
      customer: customer(),
      steps: [quote([item("sword")]), claim(0, [{ itemType: "amulet", amount: 200 }])],
    });
  });
  it("CLI rejects a damage entry with an unknown item type", () => {
    expectCliRejection({
      customer: customer(),
      steps: [quote([item("sword")]), claim(0, [{ itemType: "broomstick", amount: 200 }])],
    });
  });
  it("CLI rejects a negative damage amount", () => {
    expectCliRejection({
      customer: customer(),
      steps: [quote([item("sword")]), claim(0, [{ itemType: "sword", amount: -200 }])],
    });
  });
});
