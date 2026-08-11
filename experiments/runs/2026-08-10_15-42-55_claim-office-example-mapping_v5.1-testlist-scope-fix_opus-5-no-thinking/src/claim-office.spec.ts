import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

/** `times(3, "rune")` reads as "3 runes" — the quantity is what these examples are about. */
function times(count: number, type: string) {
  return Array.from({ length: count }, () => ({ type }));
}

/** Insures `items`, then claims `damages` against that policy; returns the claim result. */
function claimAgainst(items: { type: string; [key: string]: unknown }[], damages: { itemType: string; amount: number }[]) {
  const output = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return output.results[1];
}

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases -------------------------------------------
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain potion for a new customer → base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(output).toEqual({ results: [{ premium: 49 }] });
  });
  it("single plain sword for a new customer → base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet for a new customer → base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff for a new customer → base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(output).toEqual({ results: [{ premium: 93 }] });
  });

  // --- Components and the building block -------------------------------
  it("2 runes → 50 G base premium", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: times(2, "rune") }],
    });

    // 50 G base + 5 G first insurance + 5 G fee = 60 G
    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: times(3, "rune") }],
    });

    // 60 G block base + 6 G first insurance + 5 G fee = 71 G
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: times(4, "rune") }],
    });

    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: times(7, "rune") }],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G → 198 G
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [...times(2, "rune"), ...times(1, "moonstone")] },
      ],
    });

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G → 88 G
    expect(output).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [...times(3, "rune"), ...times(3, "moonstone")] },
      ],
    });

    // 120 G base + 12 G first insurance + 5 G fee = 137 G
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers -----------------------------------------
  it("cursed sword adds a 50 % surcharge on the item's base premium (100 G → 150 G base portion)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });

    // 100 G base + 50 G curse + 10 G first insurance (10 % of base) = 160 G + 5 G fee = 165 G
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 adds a 30 % high-enchantment surcharge (exactly at the threshold)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance = 140 G + 5 G fee = 145 G
    expect(output).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });

    // 100 G base + 10 G first insurance = 110 G + 5 G fee = 115 G
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 gets both surcharges (50 % + 30 %)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance = 190 G + 5 G fee = 195 G
    expect(output).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers -------------------------------------------
  it("customer with exactly 2 years with MHPCO gets the 20 % loyalty discount", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance = 90 G + 5 G fee = 95 G
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO gets no loyalty discount", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance = 110 G + 5 G fee = 115 G
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("the second quote in a scenario gets the 15 % follow-up contract discount", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // first: 100 + 10 first insurance + 5 fee = 115 G
    // second: 100 + 10 first insurance − 15 follow-up = 95 G + 5 G fee = 100 G
    expect(output).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("the first insurance surcharge of 10 % applies to every quote, including follow-up contracts", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });

    // first quote:  40 G base + 4 G first insurance − 8 G loyalty = 36 G + 5 G fee = 41 G
    // second quote: 100 G base + 50 G curse + 30 G high enchantment
    //   − 20 G loyalty + 10 G first insurance − 15 G follow-up = 155 G + 5 G fee = 160 G
    expect(output).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });

  // --- Modifier scope on multi-item policies ---------------------------
  it("policy with a cursed sword (100 G) and a plain amulet (60 G) → 160 G base + 50 G curse = 210 G before further modifiers and fee", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });

    // 160 G policy base + 50 G curse (50 % of the sword only, not the policy total)
    //   + 16 G first insurance (10 % of the policy base) = 226 G + 5 G fee = 231 G
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---------------------------------------------------------
  it("a premium calculation yielding 197.5 G → final premium 198 G (rounded up, in MHPCO's favor)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: times(7, "rune") }],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G → 198 G
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });
  it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down, in MHPCO's favor)", () => {
    const result = claimAgainst(
      [{ type: "sword", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
    );

    // 50 % of 901 = 450.5, then deductible → 350.5 G, rounded down to 350 G
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples --------------------------------------------
  it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 → premium 165 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment − 20 loyalty + 10 first insurance
    //   − 15 follow-up = 155 G + 5 G fee = 160 G
    expect(output.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement -----------------------------------
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = claimAgainst(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    );

    // full reimbursement 500 G − 100 G deductible = 400 G; cap 2000 G − 400 G = 1600 G
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (no enchantment/material clause)", () => {
    const result = claimAgainst([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);

    // full reimbursement 200 G − 100 G deductible = 100 G; cap 500 G − 100 G = 400 G
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ------------------------------------------
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const result = claimAgainst(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    );

    // only the dragon-material clause applies: full reimbursement, then deductible
    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    const result = claimAgainst(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );

    // only the high-enchantment clause applies: 50 % of 1000 = 500, then deductible
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins over full reimbursement)", () => {
    const result = claimAgainst(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );

    // both clauses apply; the 50 % rule wins, then deductible: 500 − 100
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (threshold applies)", () => {
    const result = claimAgainst(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    );

    // high-enchantment clause applies at exactly 8, then deductible
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ------------------------------
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const result = claimAgainst(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );

    // (500 − 100) + (300 − 100) = 600 G; cap 3200 G − 600 G = 2600 G
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: insurance sum and cap ------------------------------------
  it("policy with a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    const result = claimAgainst(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 200 }],
    );

    // insurance sum 1000 + 600 = 1600 G → cap 3200 G; payout 200 − 100 = 100 G
    expect(result).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("policy with two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = claimAgainst(times(2, "sword"), [{ itemType: "sword", amount: 200 }]);

    // insurance sum 2×1000 = 2000 G → cap 4000 G; payout 200 − 100 = 100 G
    expect(result).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("policy with a cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
    const result = claimAgainst(
      [{ type: "sword", cursed: true }],
      [{ itemType: "sword", amount: 1600 }],
    );

    // cap is based on the unmodified insurance value 1000 G → 2000 G, not on the 165 G premium
    expect(result).toEqual({ payout: 1500, remainingCap: 500 });
  });
  it("policy with a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G (block discount does not lower the insurance sum)", () => {
    const result = claimAgainst(
      [{ type: "sword" }, ...times(3, "rune")],
      [{ itemType: "rune", amount: 200 }],
    );

    // insurance sum 1000 + 3×250 = 1750 G → cap 3500 G; payout 200 − 100 = 100 G
    expect(result).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword policy (cap 2000 G), two successive claims of 1500 G → first payout 1400 G with remainingCap 600 G, second payout 600 G with remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });

    // first: 1500 − 100 = 1400, cap 2000 − 1400 = 600
    // second: desired 1400 is reduced to the remaining 600
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type --------------------------
  it("policy with two swords, a dragon attack damaging both → each damage entry gets its own deductible", () => {
    const result = claimAgainst(times(2, "sword"), [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ]);

    // insurance sum 2×1000 = 2000 G → cap 4000 G
    // (500 − 100) + (300 − 100) = 600 G; 4000 − 600 = 3400 G
    expect(result).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("damages contain more entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
    expect(() =>
      claimAgainst(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 300 },
          { itemType: "sword", amount: 200 },
        ],
      ),
    ).toThrow(/sword/);
  });

  // --- Errors -----------------------------------------------------------
  it("quote with an unknown item type (e.g. broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim references a damage entry whose item is not part of the policy (amulet damaged, only a sword insured) → error", () => {
    expect(() =>
      claimAgainst([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]),
    ).toThrow(/amulet/);
  });
  it("claim references a damage entry with an unknown item type → error", () => {
    expect(() =>
      claimAgainst([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }]),
    ).toThrow(/broomstick/);
  });
  it("claim contains a damage entry with amount -200 → error", () => {
    expect(() =>
      claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
    ).toThrow(/-200|negative/);
  });

  // --- CLI --------------------------------------------------------------
  it("CLI reads the schema example scenario from stdin and writes {results: [{premium}, {payout, remainingCap}]} to stdout", () => {
    const scenario = {
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
    };

    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    // quote: 60 base − 12 loyalty + 6 first insurance = 54 + 5 fee = 59 G
    // claim: 200 − 100 deductible = 100 G; cap 1200 − 100 = 1100 G
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status code and writes an error description to stderr for an unknown item type, writing no results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
});
