import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums for single items ---
  it("empty item list -- premium 5 G (processing fee only)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      }),
    ).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword for a newcomer -- premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet for a newcomer -- premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff for a newcomer -- premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      }),
    ).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion for a newcomer -- premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      }),
    ).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components and the building block of 3 alike ---
  it("2 runes -- base premium 50 G, premium 60 G (50 + 5 first insurance + 5 fee)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      }),
    ).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -- block applies, base premium 60 G, premium 71 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      }),
    ).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -- no block (block requires exactly 3), base premium 100 G, premium 115 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -- base premium 175 G, premium 198 G (197.5 rounded up)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
      }),
    ).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -- no block (different types), base premium 75 G, premium 88 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        ],
      }),
    ).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -- two separate blocks, base premium 120 G, premium 137 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Quote: item-specific modifiers ---
  it("cursed sword for a newcomer -- premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5 -- high-enchantment surcharge applies, premium 145 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge, premium 115 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 4 -- curse only, premium 165 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: true }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 165 }] });
  });
  it("cursed sword with enchantment exactly 5 -- both surcharges, premium 195 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -- curse applies to the cursed item's base only, premium 231 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            ],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with exactly 2 years -- loyalty discount applies, sword premium 95 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year -- no loyalty discount, sword premium 115 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote in a scenario -- 15% follow-up contract discount, sword premium 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("long-standing customer's second contract with a cursed sword enchantment 7 -- premium 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "quote", items: [cursedSword] },
        ],
      }).results[1],
    ).toEqual({ premium: 160 });
  });

  // --- Quote: errors ---
  it("quote with an unknown item type -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G -- payout 400 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 400 });
  });
  it("rune (insurance value 250 G), damage 200 G -- payout 100 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 100 });
  });
  it("claim reports remainingCap after the payout -- sword policy cap 2000 G, payout 400 G, remainingCap 1600 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      }).results[1],
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: special clauses ---
  it("dragon-material sword, enchantment 5, damage 800 G -- payout 700 G (full reimbursement then deductible)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 700 });
  });
  it("steel sword, enchantment 9, damage 1000 G -- payout 400 G (50% then deductible)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword, enchantment exactly 8, damage 1000 G -- payout 400 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -- payout 400 G (50% rule wins)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 400 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) -- payout 600 G (deductible per damaged item)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "amulet", material: "silver", enchantment: 1 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 600 });
  });
  it("two swords insured, both damaged -- each damage entry gets its own deductible", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "sword", material: "steel", enchantment: 3 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      }).results[1],
    ).toEqual({ payout: 700, remainingCap: 3300 });
  });

  // --- Claim: insurance sum and cap ---
  it("policy with sword + amulet -- insurance sum 1600 G, cap 3200 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "amulet", material: "silver", enchantment: 1 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      }).results[1],
    ).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword -- cap 2000 G based on the unmodified insurance value", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("policy with sword + 3 runes -- insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 100 }] },
          },
        ],
      }).results[1],
    ).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword policy, two successive claims of 1500 G -- first payout 1400 G (cap 600 left), second payout 600 G (cap 0)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          claim,
          claim,
        ],
      }).results.slice(1),
    ).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- Claim: rounding in MHPCO's favour ---
  it("payout calculation yielding 350.5 G -- final payout 350 G (rounded down)", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      }).results[1],
    ).toMatchObject({ payout: 350 });
  });

  // --- Claim: errors ---
  it("claim damaging an item not covered by the policy -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim with more damages of a type than insured -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("claim with a negative damage amount -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes results JSON to stdout", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], { input: scenario }).toString();
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it.todo("CLI exits with a non-zero status and writes to stderr on an invalid scenario");
});
