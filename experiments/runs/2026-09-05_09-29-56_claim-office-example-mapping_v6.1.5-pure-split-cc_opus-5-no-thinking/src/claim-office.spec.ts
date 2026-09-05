import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

// Runs the real CLI as a subprocess so stdin, stdout, stderr and the exit code
// are all exercised as a user would see them.
const runCli = (
  input: unknown,
): { status: number | null; stdout: string; stderr: string } => {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case and single main items -------------------------
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("plain sword (base 100 G) for a newcomer → premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("plain amulet (base 60 G) for a newcomer → premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("plain staff (base 80 G) for a newcomer → premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("plain potion (base 40 G) for a newcomer → premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and blocks of 3 alike -----------------------------------
  it("1 rune → 25 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium", () => {
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

    // 60 block base (not 75) + 6 first insurance + 5 fee = 71
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

    // 100 base (no block) + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 base (7 x 25 — no block discount for subsets of a larger group)
    // + 17.5 first insurance + 5 fee = 197.5 → 198 (rounded up)
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

    // "alike" means the same type: 2 runes + 1 moonstone is not a block.
    // 75 base + 7.5 first insurance + 5 fee = 87.5 → 88 (rounded up)
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

    // Two blocks of 3 alike components: 60 + 60 = 120 base
    // + 12 first insurance + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers --------------------------------------------
  it("cursed sword adds a 50 % surcharge on that item's base premium (100 → 150)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies (100 → 130)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (100 → 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee = 115 (no surcharge below level 5)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with exactly enchantment 5 → both surcharges apply (100 → 180)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // Rates add, not compound: 100 base + 50 curse + 30 high enchantment
    // + 10 first insurance + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ----------------------------------------------
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 base − 20 loyalty + 10 first insurance + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee = 115 (no loyalty below 2 years)
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  // Per the spec, first insurance is a policy-wide modifier on the policy base
  // premium; "each item is a first insurance" means it applies to every quote
  // regardless of customer history, not that it is charged per item.
  it("the 10 % first insurance surcharge applies to every quote regardless of customer history", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 10 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // First:  60 + 6 first insurance − 12 loyalty + 5 fee = 59
    // Second: 100 + 10 first insurance − 20 loyalty − 15 follow-up + 5 = 80
    // The surcharge still applies on the follow-up contract's new item.
    expect(result).toEqual({ results: [{ premium: 59 }, { premium: 80 }] });
  });
  it("second quote in a scenario receives a 15 % follow-up contract discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // First contract:  100 − 20 loyalty + 10 first insurance + 5 fee = 95
    // Second contract: 100 + 50 curse + 30 high ench − 20 loyalty
    //                  + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // --- Modifier scope on multi-item policies ------------------------------
  it("cursed sword + plain amulet → policy base 160 G, curse adds 50 G (only the sword's base) → 210 G before further modifiers and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    // Policy base 160 (100 + 60); curse adds 50 = 50 % of the SWORD's base
    // only, not of 160 → 210. First insurance 16 (10 % of the 160 policy
    // base) + 5 fee = 231.
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding in the MHPCO's favour --------------------------------------
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 197.5 rounds up — always in the MHPCO's favour
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    // 901 x 0.5 = 450.5, − 100 = 350.5 → rounded DOWN to 350, the opposite
    // direction from premiums but likewise in the MHPCO's favour.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("intermediate amounts are kept as fractions; only the final amount is rounded", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", enchantment: 5 }] }],
    });

    // Two fractional intermediates that sum to a whole number:
    //   25 base + 7.5 high enchantment + 2.5 first insurance + 5 fee = 40.
    // Rounding each term in the MHPCO's favour as it is computed would give
    // 25 + 8 + 3 + 5 = 41. Pinning 40 proves only the final total is rounded.
    expect(result).toEqual({ results: [{ premium: 40 }] });
  });

  // --- Integration examples ------------------------------------------------
  // Spec integration example. Same scenario as the cursed-surcharge test
  // above; kept as its own case so the spec's worked example is named.
  it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  // Spec integration example: "Long-standing customer's second contract".
  it("3-year customer's second quote, cursed sword enchantment 7 → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment − 20 loyalty
    // + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
    expect(result).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  // --- Insurance sum and cap ----------------------------------------------
  it("policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    // Insurance sum 1000 + 600 = 1600 → cap 3200; a 100 G payout leaves 3100.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }],
    });
  });
  it("policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    // Two swords → insurance sum 2 x 1000 = 2000 → cap 4000.
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 100, remainingCap: 3900 }],
    });
  });
  it("policy covering a sword and 3 runes → insurance sum 1750 G (block affects premium only), cap 3500 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
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
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    // Premium uses the rune block (100 + 60 = 160 base → 181), but the
    // insurance sum does not: 1000 + 3 x 250 = 1750 → cap 3500.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("cursed sword (premium 165 G) → cap 2000 G, based on the unmodified insurance value", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    // The curse raises the premium to 165 but not the insurance value:
    // cap stays 2 x 1000 = 2000, leaving 1900 after a 100 G payout.
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 100, remainingCap: 1900 }],
    });
  });

  // --- Claim: standard reimbursement ---------------------------------------
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });

    // Full reimbursement minus the 100 G deductible; no special clause.
    // Insurance sum 1000 → cap 2000, so 2000 − 400 = 1600 remains.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
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

    // Runes have no enchantment level or material, so no special clause
    // applies: 200 − 100 deductible = 100. Cap 500 → 400 remaining.
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim: special clauses ----------------------------------------------
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
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

    // Enchantment >= 8 → reimbursed at 50 %: 500, then the deductible → 400.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
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

    // Enchantment 5 < 8, so only the dragon-material clause applies:
    // full reimbursement 800, then the deductible → 700.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
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

    // Both clauses apply; the 50 % rule wins over full reimbursement:
    // 500, then the deductible → 400.
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
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
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

    // Threshold met exactly: 50 % clause applies → 500, then deductible → 400.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: deductible per damage event ----------------------------------
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
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

    // One deductible per damaged item: (500 − 100) + (300 − 100) = 600.
    // Insurance sum 1600 → cap 3200 → 2600 remaining.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("dragon attack damages both of two insured swords → each damage entry gets its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });

    // Two entries of the same type are two separate damages:
    // (500 − 100) + (400 − 100) = 700. Insurance sum 2000 → cap 4000.
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 700, remainingCap: 3300 }],
    });
  });
  // NOTE: not a spec example. The spec never shows a damage below the
  // deductible; this asserts the reading that a payout is a reimbursement and
  // so cannot go negative (the MHPCO does not bill the customer for a small
  // claim). Flagged because it is an interpretation, not a stated rule.
  it("damage amount below the deductible does not produce a negative payout", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });

    // 50 − 100 would be −50; the payout floors at 0 and the cap is untouched.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
    });
  });

  // --- Claim: cap ----------------------------------------------------------
  it("sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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

    // 1500 − 100 = 1400, within the 2000 cap; 600 remains.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword policy, second successive claim of 1500 G → payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claim,
        claim,
      ],
    });

    // The cap carries across claims on the same policy: the second claim's
    // desired 1400 is reduced to the 600 that remains.
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Error cases ---------------------------------------------------------
  it("quote with an unknown item type (broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy (amulet when only a sword is insured) → error", () => {
    expect(() =>
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
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim referencing an item with an unknown type → error", () => {
    expect(() =>
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
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
    expect(() =>
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
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("claim with a damage entry of amount -200 → error", () => {
    expect(() =>
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
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(/-200|negative/);
  });

  // --- CLI -----------------------------------------------------------------
  it("CLI reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("CLI on the schema example → results [{premium: ...}, {payout: 100, remainingCap: ...}]", () => {
    // The spec's "Schema example", verbatim.
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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

    // 60 base + 6 first insurance − 12 loyalty + 5 fee = 59.
    // 200 − 100 deductible = 100; insurance sum 600 → cap 1200 → 1100 left.
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status code and writes an error to stderr for an unknown item type, with no results on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toContain("results");
    // A described error, not a crash: no stack frames, no interpreter banner.
    expect(stderr).not.toMatch(/\n\s+at /);
    expect(stderr).not.toMatch(/Node\.js v/);
  });
  it("CLI exits with a non-zero status code and writes an error to stderr for an invalid claim", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/negative|-200/);
    expect(stdout).not.toContain("results");
    // A described error, not a crash.
    expect(stderr).not.toMatch(/\n\s+at /);
    expect(stderr).not.toMatch(/Node\.js v/);
  });
});
