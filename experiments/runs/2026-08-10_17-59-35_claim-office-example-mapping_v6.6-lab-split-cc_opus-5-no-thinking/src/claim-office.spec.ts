import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runScenario, type Item } from "./claim-office.js";

const runCli = (scenario: unknown): string =>
  execFileSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

type CliFailure = { status: number; stdout: string; stderr: string };

const runCliExpectingFailure = (scenario: unknown): CliFailure | null => {
  try {
    execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: "pipe",
    });

    return null;
  } catch (error) {
    return error as CliFailure;
  }
};

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case and base premiums ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("a single sword → base premium 100 G, plus 10 G first insurance and 5 G fee → 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("a single amulet → base premium 60 G → premium 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("a single staff → base premium 80 G → premium 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("a single potion → base premium 40 G → premium 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and the building block of 3 alike ---
  it("1 rune → base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → rounded up in MHPCO's favour
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 base + 5 first insurance + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // block: 60 base (not 75) + 6 first insurance + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array(7).fill({ type: "rune" }) as Item[] },
      ],
    });

    // 175 base + 17.5 first insurance + 5 fee = 197.5 → 198 (rounded up)
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    // 3 items but not alike → no block: 75 base + 7.5 + 5 = 87.5 → 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const result = runScenario({
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
    });

    // two blocks: 60 + 60 = 120 base + 12 first insurance + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds a 50 % surcharge on that item's base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with exactly enchantment 5 → 30 % high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });

    // 100 base + 30 high enchantment + 10 first insurance = 140 + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee = 115 (no surcharge below 5)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword with enchantment 5 and cursed → both surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment + 10 first insurance = 190 + 5 = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("policy with a cursed sword and a plain amulet → base 160 G, curse surcharge 50 G (item-scoped) → 210 G before further modifiers and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1 },
          ],
        },
      ],
    });

    // 160 policy base + 50 curse (50% of the sword's 100, not of 160)
    // = 210, + 16 first insurance (10% of 160) + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 base − 20 loyalty + 10 first insurance = 90 + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year → no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 base + 10 first insurance + 5 fee = 115 (no loyalty below 2 years)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("each item in a quote carries the 10 % first insurance surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      ],
    });

    // 160 base + 16 first insurance (10% of every item's base) + 5 fee = 181
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("the second quote of a customer receives a 15 % follow-up contract discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // first contract:  100 − 20 loyalty + 10 first insurance = 90 + 5 = 95
    // second contract: 100 + 50 curse + 30 high ench − 20 loyalty
    //                  + 10 first insurance − 15 follow-up = 155 + 5 = 160
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });
  it("a 5 G processing fee is added to every premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }, { type: "staff" }],
        },
      ],
    });

    // 240 base + 24 first insurance + 5 fee = 269 — one fee, not one per item
    expect(result).toEqual({ results: [{ premium: 269 }] });
  });

  // --- Rounding ---
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        // one cursed rune: 25 base + 12.5 curse + 2.5 first insurance + 5 fee
        // = 45 exactly. Two of them keep fractions alive at every step:
        // 50 base + 25 curse + 5 first insurance + 5 fee = 85.
        // Three (a block) is the discriminating case:
        // 60 block base + 37.5 curse + 6 first insurance + 5 fee = 108.5 → 109
        {
          op: "quote",
          items: Array(3).fill({ type: "rune", cursed: true }) as Item[],
        },
      ],
    });

    // intermediates stay fractional; only the final premium is rounded, upward
    expect(result).toEqual({ results: [{ premium: 109 }] });
  });
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
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

    // 901 × 0.5 = 450.5, − 100 deductible = 350.5 → rounded DOWN to 350
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Integration examples ---
  it("newcomer with a cursed sword (0 years, no previous contract) → premium 165 G", () => {
    // end-to-end through the CLI: 100 base + 50 curse + 10 first insurance
    // = 160 + 5 fee = 165
    const stdout = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G", () => {
    const stdout = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // second contract: 100 base + 50 curse + 30 high enchantment
    // − 20 loyalty + 10 first insurance − 15 follow-up = 155 + 5 fee = 160.
    // The first-insurance surcharge still applies to the new sword even though
    // the customer is on a follow-up contract.
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });

  // --- Claims: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
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

    // 500 damage − 100 deductible = 400; cap 2 × 1000 = 2000, remaining 1600
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });

    // runes have no enchantment or material → no special clause
    // 200 − 100 deductible = 100; cap 2 × 250 = 500, remaining 400
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claims: special clauses ---
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 5,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });

    // dragon material → full reimbursement 800, then deductible → 700
    // enchantment 5 < 8, so the 50 % clause does not apply
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
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

    // enchantment 9 >= 8 → 50 % of 1000 = 500, then deductible → 400
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 9,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // both clauses apply; the 50 % rule wins → 500, then deductible → 400
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 8,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // exactly 8 meets the >= 8 threshold → 50 % of 1000 = 500, then deductible
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claims: deductible per damage event ---
  it("a dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    });

    // (500 − 100) + (300 − 100) = 600 — one deductible per damaged item,
    // not one per incident (which would give 700)
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claims: insurance sum and cap ---
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    // a zero payout (100 − 100) leaves the full cap visible:
    // 2 × (1000 + 600) = 3200
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }],
    });
  });
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    // each sword contributes its full insurance value: 2 × 1000 → cap 4000
    // premium: a group of 2 is no block → 200 + 20 + 5 = 225
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 0, remainingCap: 4000 }],
    });
  });
  it("a cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    // premium 165 carries the curse surcharge, but the cap stays
    // 2 × the unmodified insurance value of 1000
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount affects the premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    // premium uses the rune block (100 + 60 = 160 base → 181),
    // but the insurance sum counts each rune in full:
    // 1000 + 3×250 = 1750 → cap 3500
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("two successive claims of 1500 G on a sword → payout 1400 G (cap remaining 600 G), then payout 600 G (cap remaining 0 G)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        claim,
        claim,
      ],
    });

    // cap 2000. first claim takes 1400, leaving 600;
    // the second wants 1400 but is reduced to the remaining 600
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Claims: multiple items of the same type ---
  it("two sword damage entries against a policy covering two swords → each entry gets its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });

    // each entry is its own damage: (500 − 100) + (500 − 100) = 800
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });

  // --- Errors ---
  it("quote with an unknown item type (e.g. broomstick) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "broomstick" }] }],
    };

    // the message must name the offending type so the CLI's stderr is useful
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy (amulet damaged when only a sword is insured) → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("claim with more damage entries of a type than the policy covers → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };

    // only one sword is insured — the whole claim is rejected
    expect(() => runScenario(scenario)).toThrow(/sword/);
  });
  it("claim with a damage entry with amount -200 → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/-200|negative/);
  });

  // --- CLI ---
  it('the CLI reads a scenario JSON from stdin and writes {"results": [...]} to stdout', () => {
    // the spec's own schema example
    const stdout = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });

    // 60 base − 12 loyalty + 6 insurance surcharge = 54 + 5 fee = 59
    // payout 200 − 100 = 100; cap 2 × 600 = 1200, remaining 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("the CLI exits with a non-zero status code and writes an error description to stderr on an invalid scenario", () => {
    const failure = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(failure).not.toBeNull();
    expect(failure?.status).not.toBe(0);
    expect(failure?.stderr).toMatch(/broomstick/);
    // a description, not a crash: no stack frames, no results on stdout
    expect(failure?.stderr).not.toMatch(/\s+at\s+/);
    expect(failure?.stdout).not.toContain("results");
  });
});
