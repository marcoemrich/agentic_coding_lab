import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

/** Runs the `claim-office` CLI with the given scenario on stdin. */
const runCli = (scenario: unknown) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty policy ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result.results).toEqual([{ premium: 5 }]);
  });

  // --- Base premiums for main items (with first-insurance surcharge and fee) ---
  it("a single plain sword for a new customer → 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("a single plain amulet for a new customer → 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("a single plain staff for a new customer → 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("a single plain potion for a new customer → 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // --- Components and building blocks ---
  it("2 runes → 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 G base * 1.1 first insurance + 5 G fee = 60 G
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes → 60 G base premium (block of 3 alike components applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    // 60 G base * 1.1 first insurance + 5 G fee = 71 G
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 100 G base * 1.1 first insurance + 5 G fee = 115 G
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 G base * 1.1 first insurance + 5 G fee = 197.5 → 198 G (rounded up)
    expect(result.results).toEqual([{ premium: 198 }]);
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

    // 75 G base * 1.1 first insurance + 5 G fee = 87.5 → 88 G (rounded up)
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
          ],
        },
      ],
    });

    // 120 G base * 1.1 first insurance + 5 G fee = 137 G
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // --- Item-level modifiers ---
  it("a cursed sword → 50 % risk surcharge on its base premium (100 G → 150 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("a sword with enchantment 5 → 30 % high-enchantment surcharge applies (100 G → 130 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("a sword with enchantment 4 → no high-enchantment surcharge (100 G base)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 G base * 1.1 first insurance + 5 G fee = 115 G
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("a cursed sword with enchantment 5 → both surcharges apply (100 G → 180 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee = 195 G
    expect(result.results).toEqual([{ premium: 195 }]);
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → policy base 160 G, curse adds 50 G (50 % of the cursed item only) → 210 G before further modifiers and fee", () => {
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

    // Policy base 160 G + 50 G curse (the sword only) + 16 G first insurance
    // (10 % of the 160 G policy base) + 5 G fee = 231 G
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  // --- Policy-level modifiers ---
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

    // 100 G base − 20 G loyalty + 10 G first insurance = 90 G + 5 G fee = 95 G
    expect(result.results).toEqual([{ premium: 95 }]);
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

    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("every quote carries the 10 % first insurance surcharge, regardless of customer history", () => {
    const swordQuote = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [swordQuote, swordQuote],
    });

    // Second quote: 100 − 20 loyalty + 10 first insurance − 15 follow-up + 5 fee = 80 G.
    // Were "first insurance" once per customer rather than per quote, this would be 70 G.
    expect(result.results[1]).toEqual({ premium: 80 });
  });
  it("the second quote in a scenario receives the 15 % follow-up contract discount", () => {
    const swordQuote = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [swordQuote, swordQuote],
    });

    // First: 100 + 10 first insurance + 5 fee = 115 G
    // Second: 100 + 10 first insurance − 15 follow-up = 95 + 5 fee = 100 G
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // --- Rounding in MHPCO's favor ---
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 G base * 1.1 + 5 G fee = 197.5 G exactly → 198 G in the MHPCO's favour
    expect(result.results).toEqual([{ premium: 198 }]);
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    // 50 % of 901 = 450.5, − 100 deductible = 350.5 → 350 G in the MHPCO's favour
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples ---
  it("newcomer (0 years, no previous contract) with a cursed steel sword, enchantment 3 → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("3-year customer's second quote of a cursed steel sword, enchantment 7 → premium 160 G", () => {
    const cursedSwordQuote = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [cursedSwordQuote, cursedSwordQuote],
    });

    // Second quote: 100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
    // + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee = 160 G
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claims: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (damage minus 100 G deductible)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    // Insurance sum 1000 G, cap 2000 G; payout 500 − 100 deductible = 400 G
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    // Insurance sum 250 G, cap 500 G; no special clause applies, so 200 − 100 = 100 G
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claims: special clauses ---
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // Only the dragon-material clause applies (enchantment 5 < 8): 800 − 100 = 700 G
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // High-enchantment clause: 50 % of 1000 = 500, then 100 G deductible = 400 G
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins over dragon material)", () => {
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Both clauses apply; the 50 % rule wins: 500 − 100 deductible = 400 G
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Enchantment 8 meets the threshold: 50 % of 1000 = 500, − 100 deductible = 400 G
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claims: deductible per damage event ---
  it("a dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible applies once per damaged item)", () => {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    // (500 − 100) + (300 − 100) = 600 G; insurance sum 1600 G, cap 3200 G
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claims: insurance sum and cap ---
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 9000 }] },
        },
      ],
    });

    // The desired 8900 G is cut to the 3200 G cap (= 2 × 1600 G insurance sum)
    expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 9000 }] },
        },
      ],
    });

    // Two swords are insured for 2 × 1000 G, so the cap is 4000 G
    expect(result.results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount affects the premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 9000 }] },
        },
      ],
    });

    // Insurance sum 1000 + 3 × 250 = 1750 G — the block discount cuts the premium,
    // not the coverage — so the cap is 3500 G
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 9000 }] },
        },
      ],
    });

    // The cap follows the unmodified insurance value of 1000 G, not the 165 G premium
    expect(result.results).toEqual([
      { premium: 165 },
      { payout: 2000, remainingCap: 0 },
    ]);
  });
  it("sword insured (cap 2000 G), two successive claims of 1500 G each → first payout 1400 G with remainingCap 600 G, second payout 600 G with remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
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

    // The second claim's desired 1400 G is cut to the 600 G of cap left over
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of the same type ---
  it("two swords insured, a dragon attack damages both → each damage entry gets its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
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

    // Two separate damages, each bearing its own deductible: 400 + 400 = 800 G
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Error cases (CLI exits non-zero, error on stderr) ---
  it("quote includes an item with an unknown type (e.g. broomstick) → error, no results", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim references an item not part of the policy (amulet damaged when only a sword is insured) → error", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim references a damage entry with an unknown item type → error", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim contains more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("claim contains a damage entry with amount: -200 → error", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

  // --- CLI ---
  it("the CLI reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    // The spec's own schema example
    const result = runCli({
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

    expect(result.status).toBe(0);
    // 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee = 59 G;
    // insurance sum 600 G, cap 1200 G; payout 200 − 100 = 100 G
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("the CLI exits with a non-zero status code and writes an error description to stderr on an invalid scenario", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    // A description of the problem, not a crash dump
    expect(result.stderr.trim()).toBe(
      'The MHPCO does not insure items of type "broomstick"',
    );
  });
});
