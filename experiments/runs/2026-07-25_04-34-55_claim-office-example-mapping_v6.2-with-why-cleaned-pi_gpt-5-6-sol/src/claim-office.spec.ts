import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item, type Scenario } from "./claim-office.js";

const run = (scenario: Scenario) => processScenario(scenario);

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });

const quote = (items: Item[]) => ({ op: "quote" as const, items });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(run({ customer: customer(), steps: [quote([])] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("uses the price list for sword, amulet, staff, and potion premiums", () => {
    expect(run({ customer: customer(), steps: [
      quote([{ type: "sword" }]), quote([{ type: "amulet" }]),
      quote([{ type: "staff" }]), quote([{ type: "potion" }]),
    ] })).toEqual({ results: [
      { premium: 115 }, { premium: 62 }, { premium: 81 }, { premium: 43 },
    ] });
  });
  it("prices component quantities 2, 3, 4, and 7 at 50, 60, 100, and 175 G before the fee", () => {
    const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
    expect(run({ customer: customer(), steps: [quote(runes(2)), quote(runes(3)), quote(runes(4)), quote(runes(7))] })).toEqual({
      results: [{ premium: 60 }, { premium: 62 }, { premium: 100 }, { premium: 172 }],
    });
  });
  it("forms component blocks only from exactly three components of the same type", () => {
    const mixed = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    const twoBlocks = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(run({ customer: customer(), steps: [quote(mixed), quote(twoBlocks)] })).toEqual({ results: [{ premium: 88 }, { premium: 119 }] });
  });
  it("applies cursed and high-enchantment modifiers at their exact thresholds only to affected items", () => {
    expect(run({ customer: customer(), steps: [
      quote([{ type: "sword", cursed: true, enchantment: 4 }]),
      quote([{ type: "sword", cursed: true, enchantment: 5 }]),
      quote([{ type: "sword", enchantment: 5 }]),
    ] })).toEqual({ results: [{ premium: 165 }, { premium: 180 }, { premium: 130 }] });
  });
  it("applies cursed item surcharge only to that item in a multi-item policy -- 231 G including fee", () => {
    expect(run({ customer: customer(), steps: [quote([{ type: "sword", cursed: true }, { type: "amulet" }])] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty, first-insurance, and follow-up modifiers to the policy base premium", () => {
    expect(run({ customer: customer(2), steps: [quote([{ type: "sword" }]), quote([{ type: "sword" }])] })).toEqual({
      results: [{ premium: 95 }, { premium: 80 }],
    });
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(run({ customer: customer(), steps: [quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's cursed enchanted sword on their second contract at 160 G", () => {
    expect(run({ customer: customer(3), steps: [quote([]), quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])] })).toEqual({
      results: [{ premium: 5 }, { premium: 160 }],
    });
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    expect(run({ customer: customer(), steps: [quote(Array.from({ length: 7 }, () => ({ type: "rune" })))] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("reimburses ordinary sword and rune damage in full before one 100 G deductible each", () => {
    expect(run({ customer: customer(), steps: [
      quote([{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }]),
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }, { itemType: "rune", amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 143 }, { payout: 500, remainingCap: 2000 }] });
  });
  it("applies one deductible per damaged item in an incident -- 600 G total", () => {
    expect(run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "amulet" }]), {
      op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] },
    }] })).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("lets enchantment 8+ reimbursement override dragon material and otherwise reimburses dragon fully", () => {
    const claim = (policy: number, amount: number) => ({ op: "claim" as const, policy, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } });
    expect(run({ customer: customer(), steps: [
      quote([{ type: "sword", material: "dragon", enchantment: 8 }]), claim(0, 1000),
      quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim(2, 800),
      quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim(4, 1000),
    ] })).toEqual({ results: [
      { premium: 145 }, { payout: 400, remainingCap: 1600 },
      { premium: 130 }, { payout: 700, remainingCap: 1300 },
      { premium: 130 }, { payout: 400, remainingCap: 1600 },
    ] });
  });
  it("calculates policy caps from item insurance values including duplicates and undiscounted components", () => {
    const emptyClaim = (policy: number) => ({ op: "claim" as const, policy, incident: { cause: "inspection", damages: [] } });
    expect(run({ customer: customer(), steps: [
      quote([{ type: "sword" }, { type: "sword" }]), emptyClaim(0),
      quote([{ type: "sword", cursed: true }]), emptyClaim(2),
      quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]), emptyClaim(4),
    ] })).toEqual({ results: [
      { premium: 225 }, { payout: 0, remainingCap: 4000 },
      { premium: 150 }, { payout: 0, remainingCap: 2000 },
      { premium: 157 }, { payout: 0, remainingCap: 3500 },
    ] });
  });
  it("treats duplicate covered items as separate damages with separate deductibles", () => {
    expect(run({ customer: customer(), steps: [quote([{ type: "sword" }, { type: "sword" }]), {
      op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] },
    }] })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("rejects a claim containing more damages of a type than the policy covers", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "sword" }]), {
      op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] },
    }] })).toThrow("not covered");
  });
  it("exhausts a policy cap across successive claims -- 1400 G then 600 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(run({ customer: customer(), steps: [quote([{ type: "sword" }]),
      { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });
  it("rounds a fractional payout of 350.5 G down to 350 G only at the end", () => {
    expect(run({ customer: customer(), steps: [quote([{ type: "sword", enchantment: 8 }]), {
      op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] },
    }] })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
  it("rejects quote items with unknown types", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "broomstick" }])] })).toThrow("Unknown item type");
  });
  it("rejects claim damage for unknown or uninsured item types", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      expect(() => run({ customer: customer(), steps: [quote([{ type: "sword" }]), {
        op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] },
      }] })).toThrow("not covered");
    }
  });
  it("rejects negative damage amounts", () => {
    expect(() => run({ customer: customer(), steps: [quote([{ type: "sword" }]), {
      op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] },
    }] })).toThrow("negative");
  });
  it("CLI reads stdin, writes ordered JSON results, and reports invalid scenarios only on stderr with non-zero status", () => {
    const valid: Scenario = { customer: customer(5), steps: [quote([{ type: "amulet" }]), {
      op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
    }] };
    const stdout = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(valid), encoding: "utf8" });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });

    const invalid = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: customer(), steps: [quote([{ type: "broomstick" }])] }), encoding: "utf8",
    });
    expect(invalid.status).not.toBe(0);
    expect(invalid.stdout).toBe("");
    expect(invalid.stderr).toContain("Unknown item type");
  });
});
