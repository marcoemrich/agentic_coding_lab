import { execFileSync, spawnSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office — quote", () => {
  // Simplest case
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result.results).toEqual([{ premium: 5 }]);
  });

  // Base premiums per item type (with first insurance surcharge + fee)
  it("a single sword → base premium 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 base + 10 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("a single amulet → base premium 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    // 60 base + 6 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("a single staff → base premium 80 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    // 80 base + 8 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("a single potion → base premium 40 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    // 40 base + 4 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 49 }]);
  });
  it("a single rune (component) → base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(result.results).toEqual([{ premium: 33 }]);
  });
  it("a single moonstone (component) → base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded up)
    expect(result.results).toEqual([{ premium: 33 }]);
  });

  // Building block of 3 alike components
  it("2 runes → 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 base + 5 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    // 60 block base + 6 first insurance + 5 fee
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

    // 100 base + 10 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 base + 17.5 first insurance + 5 fee = 197.5 → 198 (rounded up)
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  // "Alike" components means exactly the same type
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

    // 75 base + 7.5 first insurance + 5 fee = 87.5 → 88 (rounded up)
    expect(result.results).toEqual([{ premium: 88 }]);
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

    // 120 base (two blocks of 60) + 12 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // Item-specific modifiers
  it("cursed sword → 50 % risk surcharge on that item's base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 10 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 base + 30 high enchantment + 10 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee (no surcharge below level 5)
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with exactly enchantment 5 → both surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 195 }]);
  });

  // Policy-wide modifiers
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 base + 10 first insurance − 20 loyalty + 5 fee
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 base + 10 first insurance + 5 fee (no discount below 2 years)
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("first quote in a scenario → 10 % first insurance surcharge on the policy base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    // 80 base + 8 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("second quote in a scenario → 15 % follow-up contract discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // first: 100 + 10 first insurance + 5 fee
    // second: 100 + 10 first insurance − 15 follow-up + 5 fee
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("first insurance surcharge still applies on a follow-up contract", () => {
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

    // second: 100 base + 50 curse + 30 high enchantment
    //         − 20 loyalty + 10 first insurance − 15 follow-up + 5 fee
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Modifier scope on multi-item policies
  it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G (of the cursed item only) → 210 G before further modifiers and fee", () => {
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

    // 160 policy base + 50 curse (sword only) + 16 first insurance + 5 fee
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  // Rounding
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 + 17.5 + 5 = 197.5 exactly; the office rounds its own income up
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
    });

    // 25 base + 12.5 curse + 2.5 first insurance + 5 fee = 45 exactly.
    // Rounding each fraction up as it arose would give 25 + 13 + 3 + 5 = 46.
    expect(result.results).toEqual([{ premium: 45 }]);
  });

  // Integration examples
  it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 10 first insurance = 160, + 5 fee
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment − 20 loyalty
    // + 10 first insurance − 15 follow-up = 155, + 5 fee
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO Claim Office — claim", () => {
  // Standard reimbursement
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    // 500 − 100 deductible; cap 2×1000 = 2000, so 1600 remains
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

    // 200 − 100 deductible; cap 2×250 = 500, so 400 remains
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Special clauses
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // 1000 × 50 % = 500, then − 100 deductible; cap 2000 − 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // full reimbursement 800 − 100 deductible; cap 2000 − 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G (50 % rule applies, then deductible)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // the 50 % rule wins over dragon material: 500 − 100; cap 2000 − 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins over dragon material)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // both clauses apply, the 50 % rule wins: 500 − 100; cap 2000 − 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  it("one incident damaging an insured sword (500 G) and an insured amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
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

    // (500 − 100) + (300 − 100); cap 2×1600 = 3200, so 2600 remains
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Insurance sum and cap
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });

    // insurance sum 1000 + 600 = 1600 → cap 3200; 3200 − 100 payout = 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });

    // insurance sum 2×1000 = 2000 → cap 4000; 4000 − 100 payout = 3900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G (block discount affects the premium only)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });

    // insurance sum 1000 + 3×250 = 1750 → cap 3500; 3500 − 100 payout = 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("a cursed sword → cap 2000 G (based on the unmodified insurance value)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });

    // premium modifiers do not raise the cap: still 2×1000 = 2000, less 100 payout
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });

  // Cap exhaustion across successive claims
  it("sword policy (cap 2000 G), two successive claims of 1500 G each → first payout 1400 G with remaining cap 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    // 1500 − 100 = 1400, within the 2000 cap; 600 remains
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("second of the two successive 1500 G claims → payout 600 G, remaining cap 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    // desired 1400 exceeds the 600 that remains, so the payout is reduced to 600
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multiple items of the same type
  it("two insured swords, two sword damage entries → each entry is a separate damage with its own deductible", () => {
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

    // (500 − 100) + (500 − 100) = 800; cap 4000 − 800 = 3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // Rounding
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

    // 901 × 50 % = 450.5, − 100 = 350.5 → 350 (rounded down); cap 2000 − 350
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO Claim Office — errors", () => {
  it("quote with an unknown item type (e.g. broomstick) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim damaging an item that is not part of the policy (amulet when only a sword is insured) → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim damaging an item of unknown type → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
  it("claim with more damage entries of a type than the policy covers → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
  it("claim with a damage entry of amount -200 → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200|negative/);
  });
});

describe("MHPCO Claim Office — CLI", () => {
  it("reads a scenario from stdin and writes { results } to stdout in step order", () => {
    const scenario = {
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("schema example: amulet quote then a 200 G amulet claim → premium and payout/remainingCap", () => {
    const scenario = {
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    const { results } = JSON.parse(stdout);

    // the output shape the JSON schema requires
    expect(results).toHaveLength(2);
    expect(Object.keys(results[0])).toEqual(["premium"]);
    expect(Number.isInteger(results[0].premium)).toBe(true);
    expect(Object.keys(results[1]).sort()).toEqual(["payout", "remainingCap"]);
    expect(Number.isInteger(results[1].payout)).toBe(true);
    expect(Number.isInteger(results[1].remainingCap)).toBe(true);
  });
  it("exits with a non-zero status code and writes to stderr on an invalid scenario, with no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stderr).not.toMatch(/at .*claim-office/);
  });
});
