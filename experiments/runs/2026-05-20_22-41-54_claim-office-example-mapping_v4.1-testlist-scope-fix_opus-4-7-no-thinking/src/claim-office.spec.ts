import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ===== Edge case: empty quote =====
  it("quote with empty item list returns premium 5 G (only processing fee)", () => {
    const result = quote({ customer: { yearsInsured: 0, previousContracts: 0 }, items: [] });
    expect(result.premium).toBe(5);
  });

  // ===== Base premiums per item type =====
  it("quote for a single plain sword (newcomer, first insurance) returns premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    });
    expect(result.premium).toBe(115);
  });
  it("quote for a single plain amulet (newcomer, first insurance) returns premium 71 G (60 base + 6 first + 5 fee)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "amulet", material: "steel", enchantment: 3, cursed: false }],
    });
    expect(result.premium).toBe(71);
  });
  it("quote for a single plain staff (newcomer, first insurance) returns premium 93 G (80 base + 8 first + 5 fee)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "staff", material: "wood", enchantment: 3, cursed: false }],
    });
    expect(result.premium).toBe(93);
  });
  it("quote for a single plain potion (newcomer, first insurance) returns premium 49 G (40 base + 4 first + 5 fee)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "potion", material: "glass", enchantment: 3, cursed: false }],
    });
    expect(result.premium).toBe(49);
  });
  it("quote for a single component (newcomer, first insurance) returns premium 33 G (25 base + 2.5 first → 27.5 + 5 fee = 32.5 → round up to 33 G)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "rune" }],
    });
    expect(result.premium).toBe(33);
  });

  // ===== Block-of-3 alike components (base premium examples) =====
  it("quote base premium for 2 runes is 50 G (no block)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "rune" }, { type: "rune" }],
    });
    expect(result.premium).toBe(60);
  });
  it("quote base premium for 3 runes is 60 G (block applies)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
    });
    expect(result.premium).toBe(71);
  });
  it("quote base premium for 4 runes is 100 G (no block — block requires exactly 3)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
    });
    expect(result.premium).toBe(115);
  });
  it("quote base premium for 7 runes is 175 G (no block: 7×25)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
    });
    expect(result.premium).toBe(198);
  });

  // ===== Alike components clarification =====
  it("quote base premium for 2 runes + 1 moonstone is 75 G (no block: different types)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
    });
    expect(result.premium).toBe(88);
  });
  it("quote base premium for 3 runes + 3 moonstones is 120 G (two separate blocks)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ],
    });
    expect(result.premium).toBe(137);
  });

  // ===== Item-specific modifiers in isolation =====
  it("cursed sword item modifier adds 50% surcharge to that item's base (100 G → 150 G item subtotal)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
    });
    expect(result.premium).toBe(165);
  });
  it("high-enchantment sword (enchantment 5) adds 30% surcharge to that item's base", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
    });
    expect(result.premium).toBe(145);
  });
  it("sword with enchantment 4 does NOT get high-enchantment surcharge", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
    });
    expect(result.premium).toBe(115);
  });
  it("cursed AND high-enchantment sword (enchantment 5) gets both surcharges", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
    });
    expect(result.premium).toBe(195);
  });

  // ===== Policy-wide modifiers in isolation =====
  it("loyalty discount applies for customer with exactly 2 years (20% off policy base)", () => {
    const result = quote({
      customer: { yearsInsured: 2, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    });
    expect(result.premium).toBe(95);
  });
  it("loyalty discount does NOT apply for customer with 1 year", () => {
    const result = quote({
      customer: { yearsInsured: 1, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    });
    expect(result.premium).toBe(115);
  });
  it("first insurance surcharge adds 10% per item (each item in the quote is treated as first insurance)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ],
    });
    expect(result.premium).toBe(225);
  });
  it("follow-up contract discount (-15%) applies to second quote in scenario", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    });
    expect(result.premium).toBe(100);
  });

  // ===== Modifier scope (multi-item policy) =====
  it("policy with cursed sword (100 G) + plain amulet (60 G) has policy base 160 G; curse adds 50 G (50% of sword only) → 210 G before policy modifiers and fee", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "steel", enchantment: 3, cursed: false },
      ],
    });
    expect(result.premium).toBe(231);
  });

  // ===== Integration: Newcomer with a cursed sword =====
  it("newcomer (0 years) with cursed sword (steel, enchantment 3) gets premium 165 G (100 base + 50 curse + 10 first = 160 + 5 fee)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
    });
    expect(result.premium).toBe(165);
  });

  // ===== Integration: Long-standing customer's second contract =====
  it("3-year customer's second quote of cursed sword (steel, enchantment 7) gets premium 160 G (100 + 50 curse + 30 high-ench − 20 loyalty + 10 first − 15 follow-up = 155 + 5 fee)", () => {
    const result = quote({
      customer: { yearsInsured: 3, previousContracts: 1 },
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
    });
    expect(result.premium).toBe(160);
  });

  // ===== Rounding rules =====
  it("premium calculation yielding 197.5 G is rounded UP to 198 G (in MHPCO's favor)", () => {
    const result = quote({
      customer: { yearsInsured: 0, previousContracts: 0 },
      items: [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
    });
    expect(result.premium).toBe(198);
  });
  it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
    const result = quote({
      customer: { yearsInsured: 2, previousContracts: 0 },
      items: [{ type: "rune" }],
    });
    expect(result.premium).toBe(28);
  });

  // ===== Claim: standard reimbursement =====
  it("claim on regular sword (steel, enchantment 3), damage 500 G → payout 400 G (500 − 100 deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim on a rune (insurance value 250 G), damage 200 G → payout 100 G (200 − 100 deductible; no special clause for components)", () => {
    const result = claim({
      items: [{ type: "rune" }],
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });

  // ===== Claim: enchantment threshold and dragon material =====
  it("claim on dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins: 500 − 100)", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim on dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement: 800 − 100)", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });
  it("claim on steel sword, enchantment 9, damage 1000 G → payout 400 G (50% rule: 500 − 100)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("claim on dragon-material sword, enchantment exactly 8, damage 1000 G → payout 400 G (high-ench applies: 500 − 100)", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  // ===== Claim: deductible per damage event =====
  it("dragon attack damages sword (500 G) and amulet (300 G) → total payout 600 G (100 G deductible per damaged item: 400 + 200)", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "steel", enchantment: 3, cursed: false },
      ],
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  // ===== Claim: multiple items of same type =====
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(900);
    expect(result.remainingCap).toBe(3100);
  });
  it("dragon attack damages both of two insured swords → each damage entry gets its own deductible", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ],
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
  it("claim references more swords damaged than insured (2 sword damages, 1 sword insured) → error / rejection", () => {
    expect(() =>
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      })
    ).toThrow();
  });

  // ===== Claim: cap and insurance sum =====
  it("policy with sword + amulet has insurance sum 1600 G and cap 3200 G", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "steel", enchantment: 3, cursed: false },
      ],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(900);
    expect(result.remainingCap).toBe(2300);
  });
  it("policy with cursed sword has cap 2000 G (based on unmodified insurance value; premium modifiers don't raise cap)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(900);
    expect(result.remainingCap).toBe(1100);
  });
  it("policy with sword + 3 runes (block) has insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "rune", material: "steel", enchantment: 3, cursed: false },
        { type: "rune", material: "steel", enchantment: 3, cursed: false },
        { type: "rune", material: "steel", enchantment: 3, cursed: false },
      ],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(900);
    expect(result.remainingCap).toBe(2600);
  });

  // ===== Claim: cap exhaustion across successive claims =====
  it("sword insured (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("after first claim used 1400 G, second claim of 1500 G → payout 600 G (reduced to remaining cap), remainingCap 0 G", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      damages: [{ itemType: "sword", amount: 1500 }],
      priorPaid: 1400,
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // ===== Claim: payout rounding =====
  it("payout calculation yielding 350.5 G is rounded DOWN to 350 G (in MHPCO's favor)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
      damages: [{ itemType: "sword", amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });

  // ===== Edge cases / errors =====
  it("quote with unknown item type (e.g. broomstick) → error", () => {
    expect(() =>
      quote({
        customer: { yearsInsured: 0, previousContracts: 0 },
        items: [{ type: "broomstick" }],
      })
    ).toThrow();
  });
  it("claim references damage to item not in policy (e.g. amulet damaged when only sword insured) → error", () => {
    expect(() =>
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        damages: [{ itemType: "amulet", amount: 300 }],
      })
    ).toThrow();
  });
  it("claim references damage to unknown item type → error", () => {
    expect(() =>
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        damages: [{ itemType: "broomstick", amount: 100 }],
      })
    ).toThrow();
  });
  it("claim with negative damage amount → error", () => {
    expect(() =>
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        damages: [{ itemType: "sword", amount: -200 }],
      })
    ).toThrow();
  });

  // ===== CLI =====
  it("CLI reads JSON scenario from stdin and writes JSON results to stdout (schema-example scenario)", () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const output = execSync("tsx src/cli.ts", { input: JSON.stringify(input) }).toString();
    const parsed = JSON.parse(output);
    expect(parsed).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("CLI exits with non-zero status on unknown item type in quote; writes error to stderr; no results on stdout", () => {
    const { spawnSync } = require("node:child_process");
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "broomstick" }] },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("CLI exits with non-zero status when claim references item not in policy; writes error to stderr", () => {
    const { spawnSync } = require("node:child_process");
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("CLI exits with non-zero status when claim contains negative damage amount; writes error to stderr", () => {
    const { spawnSync } = require("node:child_process");
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("CLI exits with non-zero status when claim has more damages of a type than policy covers", () => {
    const { spawnSync } = require("node:child_process");
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
