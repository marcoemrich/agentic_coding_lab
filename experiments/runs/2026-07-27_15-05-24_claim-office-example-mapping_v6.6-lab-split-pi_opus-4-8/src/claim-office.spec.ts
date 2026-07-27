import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import {
  basePremium,
  insuranceSum,
  capFor,
  runScenario,
} from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums: main items (price list) ---
  it("basePremium: single sword -- 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("basePremium: single amulet -- 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("basePremium: single staff -- 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("basePremium: single potion -- 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  // --- Base premiums: components and block of 3 alike ---
  it("basePremium: 2 runes -- 50 G (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("basePremium: 3 runes -- 60 G (block applies)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("basePremium: 4 runes -- 100 G (no block; block needs exactly 3)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("basePremium: 7 runes -- 175 G (one block + 4 singles)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(runes)).toBe(175);
  });

  // --- "Alike" components ---
  it("basePremium: 2 runes + 1 moonstone -- 75 G (no block, different types)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("basePremium: 3 runes + 3 moonstones -- 120 G (two separate blocks)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(120);
  });

  // --- Insurance sums and caps ---
  it("insuranceSum: two swords -- 2000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it("insuranceSum: sword + amulet -- 1600 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("insuranceSum: sword + 3 runes -- 1750 G (block affects premium only)", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(1750);
  });
  it("capFor: two swords -- cap 4000 G (2x insurance sum)", () => {
    expect(capFor([{ type: "sword" }, { type: "sword" }])).toBe(4000);
  });
  it("capFor: cursed sword -- cap 2000 G (based on unmodified value)", () => {
    expect(capFor([{ type: "sword", cursed: true }])).toBe(2000);
  });

  // --- Final premium via runScenario (quote) ---
  it("quote: empty item list -- premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote: newcomer plain sword -- premium 115 G (100 + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote: newcomer cursed sword (steel, ench 3) -- premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("quote: sword exactly enchantment 5, newcomer -- premium 145 G (100 + 30 high + 10 first + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("quote: sword enchantment 4, newcomer -- premium 115 G (no high-enchant surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote: cursed sword enchantment 5, newcomer -- premium 195 G (both surcharges)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("quote: customer exactly 2 years, plain sword -- premium 95 G (loyalty applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("quote: long-standing customer's second contract, cursed sword ench 7 -- premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({
      premium: 160,
    });
  });
  it("quote: modifier scope -- cursed sword + plain amulet, newcomer -- premium 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("quote: rounding in MHPCO favor -- newcomer 7 runes yields 197.5 -> premium 198 G (up)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Claim processing ---
  it("claim: standard sword (steel, ench 3), damage 500 -- payout 400, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("claim: rune, damage 200 -- payout 100 (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "theft",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("claim: dragon sword, ench 8, damage 1000 -- payout 400 (high-ench 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("claim: dragon sword, ench 5, damage 800 -- payout 700 (dragon full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("claim: dragon sword, ench 9, damage 1000 -- payout 400 (both clauses, 50% wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("claim: steel sword, ench 9, damage 1000 -- payout 400 (high-ench 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("claim: deductible per event -- sword 500 + amulet 300 -- payout 600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });
  it("claim: two swords both damaged, 500 each -- payout 800 (own deductible each)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 800,
      remainingCap: 3200,
    });
  });
  it("claim: payout rounding -- steel sword ench 8, damage 901 yields 350.5 -> payout 350 (down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });
  it("claim: cap exhaustion -- two 1500 claims on sword -- 1400 then 600, remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    const results = (result as { results: unknown[] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error cases (CLI exits non-zero) ---
  it("error: quote with unknown item type -- runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("error: claim references item not in policy -- runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("error: claim damage amount negative -- runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("error: more damages of a type than covered -- runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("cli: unknown item type exits non-zero with stderr and no stdout results", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
});
