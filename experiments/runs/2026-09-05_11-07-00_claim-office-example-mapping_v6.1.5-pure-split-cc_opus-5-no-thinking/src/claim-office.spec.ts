import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case and base premiums ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("a plain sword → base premium 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("a plain amulet → base premium 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("a plain staff → base premium 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("a plain potion → base premium 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", cursed: false }],
        },
      ],
    });

    expect(result.results).toEqual([{ premium: 49 }]);
  });
  it("a single rune → base premium 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(result.results).toEqual([{ premium: 33 }]);
  });
  it("a single moonstone → base premium 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(result.results).toEqual([{ premium: 33 }]);
  });

  // --- Components: block of 3 alike ---
  it("2 runes → 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    });

    // 50 G base + 5 G first insurance + 5 G fee = 60 G
    expect(result.results).toEqual([{ premium: 60 }]);
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

    // 60 G block base + 6 G first insurance + 5 G fee = 71 G
    expect(result.results).toEqual([{ premium: 71 }]);
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

    // 100 G base + 10 G first insurance + 5 G fee = 115 G
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G → 198 G (rounded up)
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G → 88 G (rounded up)
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

    // 60 G + 60 G = 120 G base + 12 G first insurance + 5 G fee = 137 G
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword adds a 50 % risk surcharge on its own base premium (+50 G)", () => {
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

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment 5 adds a 30 % high-enchantment surcharge (+30 G)", () => {
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

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge", () => {
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

    // 100 G base + 10 G first insurance + 5 G fee = 115 G (no surcharge)
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 gets both surcharges (+50 G and +30 G)", () => {
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

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee = 195 G
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("customer with exactly 2 years with MHPCO receives the 20 % loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee = 95 G
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year with MHPCO receives no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee = 115 G (no loyalty discount)
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("a first insurance carries a 10 % initial assessment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    // 60 G base + 6 G first insurance (10 % of the 60 G policy base) + 5 G fee = 71 G
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("the second quote in a scenario receives a 15 % follow-up contract discount", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    // first:  100 G base + 10 G first insurance + 5 G fee = 115 G
    // second: 100 G base + 10 G first insurance − 15 G follow-up + 5 G fee = 100 G
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("a 5 G processing fee is added to every premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", cursed: false }],
        },
      ],
    });

    // 40 G base + 4 G first insurance + 5 G fee (added at the very end) = 49 G
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G → 210 G before further modifiers and fee", () => {
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

    // policy base 160 G (100 + 60)
    // + 50 G curse   — 50 % of the CURSED SWORD's 100 G base, not of the 160 G total
    // + 16 G first insurance — 10 % of the 160 G policy base
    // + 5 G fee
    // = 231 G
    expect(result.results).toEqual([{ premium: 231 }]);
  });
  it("item-specific modifiers apply per item; policy-wide modifiers apply to the policy base premium; the fee is added last", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "staff", material: "oak", enchantment: 6, cursed: false },
          ],
        },
      ],
    });

    // policy base = 100 (sword) + 80 (staff) = 180 G
    // item-specific (each on its OWN item base):
    //   + 50 G curse            — 50 % of the sword's 100 G
    //   + 24 G high enchantment — 30 % of the staff's 80 G
    // policy-wide (each on the 180 G POLICY base):
    //   − 36 G loyalty          — 20 % of 180
    //   + 18 G first insurance  — 10 % of 180
    // + 5 G fee, added last
    // = 180 + 74 − 36 + 18 + 5 = 241 G
    expect(result.results).toEqual([{ premium: 241 }]);
  });

  // --- Rounding in MHPCO's favour ---
  it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });

    // 175 + 17.5 + 5 = 197.5 G exactly; a fractional premium is rounded UP,
    // in the MHPCO's favour → 198 G
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
            { type: "rune" },
          ],
        },
      ],
    });

    // policy base = 100 + 25 = 125 G
    // + 50 G curse (50 % of the sword's 100 G)
    // + 30 G high enchantment (30 % of the sword's 100 G)
    // + 12.5 G first insurance (10 % of 125) — carried as a FRACTION, not rounded here
    // + 5 G fee
    // exact total 222.5 G, rounded up once at the very end → 223 G
    expect(result.results).toEqual([{ premium: 223 }]);
  });

  // --- Integration examples ---
  it("newcomer with a cursed sword (0 years, no previous contract) → premium 165 G", () => {
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

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // first quote:  60 G base − 12 G loyalty + 6 G first insurance + 5 G fee = 59 G
    //
    // second quote (the customer's follow-up contract):
    //   100 G base + 50 G curse + 30 G high enchantment
    //   − 20 G loyalty + 10 G first insurance − 15 G follow-up contract
    //   = 155 G + 5 G fee = 160 G
    // The first-insurance surcharge STILL applies on a follow-up contract:
    // each item in a quote is treated as a first insurance, whatever the history.
    expect(result.results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });

  // --- Claim: standard reimbursement ---
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

    // quote: 100 G base + 10 G first insurance + 5 G fee = 115 G
    //
    // claim: no special clause applies (enchantment 3 < 8, steel is not dragon),
    // so full reimbursement 500 G − 100 G deductible = 400 G payout.
    // insurance sum 1000 G → cap 2000 G; 2000 − 400 = 1600 G remaining
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
    ]);
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
            cause: "theft",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });

    // quote: 25 G base + 2.5 G first insurance + 5 G fee = 32.5 → 33 G
    //
    // claim: runes have no enchantment level or material, so no special clause
    // applies: 200 G − 100 G deductible = 100 G payout.
    // insurance sum 250 G → cap 500 G; 500 − 100 = 400 G remaining
    expect(result.results).toEqual([
      { premium: 33 },
      { payout: 100, remainingCap: 400 },
    ]);
  });

  // --- Claim: special clauses ---
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // quote: 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    //
    // claim: enchantment 9 >= 8 → reimbursed at 50 %: 1000 × 0.5 = 500 G,
    // THEN the 100 G deductible → 400 G. The order matters: halve first,
    // deduct second.
    // insurance sum 1000 G → cap 2000 G; 2000 − 400 = 1600 G remaining
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });

    // quote: 100 G base + 30 G high enchantment (5 >= 5 on the premium side)
    //        + 10 G first insurance + 5 G fee = 145 G
    //
    // claim: enchantment 5 < 8, so no half-reimbursement; only the dragon-material
    // clause applies → full 800 G, then the 100 G deductible = 700 G
    // insurance sum 1000 G → cap 2000 G; 2000 − 700 = 1300 G remaining
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
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

    // quote: 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    //
    // claim: BOTH clauses apply — dragon material (full) and enchantment 9 >= 8
    // (half). The 50 % rule TAKES PRECEDENCE over dragon-material full
    // reimbursement: 1000 × 0.5 = 500 G, then the 100 G deductible → 400 G
    // insurance sum 1000 G → cap 2000 G; 2000 − 400 = 1600 G remaining
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
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

    // quote: 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    //
    // claim: exactly 8 meets the >= 8 threshold (inclusive), so the
    // half-reimbursement clause applies: 1000 × 0.5 = 500 G,
    // then the 100 G deductible → 400 G
    // insurance sum 1000 G → cap 2000 G; 2000 − 400 = 1600 G remaining
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
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

    // quote: 160 G base (100 + 60) + 16 G first insurance + 5 G fee = 181 G
    //
    // claim: the 100 G deductible applies once per DAMAGED ITEM, not once per
    // incident: (500 − 100) + (300 − 100) = 400 + 200 = 600 G
    // insurance sum 1600 G (1000 + 600) → cap 3200 G; 3200 − 600 = 2600 G remaining
    expect(result.results).toEqual([
      { premium: 181 },
      { payout: 600, remainingCap: 2600 },
    ]);
  });

  // --- Claim: rounding ---
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

    // quote: 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
    //
    // claim: enchantment 9 >= 8 → 901 × 0.5 = 450.5 G, then the 100 G
    // deductible = 350.5 G. A payout rounds DOWN in the MHPCO's favour
    // (the opposite direction from a premium) → 350 G
    // insurance sum 1000 G → cap 2000 G; 2000 − 350 = 1650 G remaining
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 350, remainingCap: 1650 },
    ]);
  });

  // --- Claim: insurance sum and cap ---
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
          incident: {
            cause: "flood",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    // quote: 160 G base + 16 G first insurance + 5 G fee = 181 G
    //
    // claim: 300 − 100 deductible = 200 G payout.
    // The insurance sum is the sum of the items' INSURANCE VALUES — not their
    // premiums: 1000 (sword) + 600 (amulet) = 1600 G. The cap is twice that,
    // 3200 G; 3200 − 200 = 3000 G remaining.
    expect(result.results).toEqual([
      { premium: 181 },
      { payout: 200, remainingCap: 3000 },
    ]);
  });
  it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
            cause: "curse backfire",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    });

    // quote: 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G
    //
    // claim: 400 − 100 deductible = 300 G payout.
    // The cap rests on the UNMODIFIED insurance value of 1000 G → 2000 G.
    // The curse surcharge raises the premium but NOT the cap.
    // 2000 − 300 = 1700 G remaining.
    expect(result.results).toEqual([
      { premium: 165 },
      { payout: 300, remainingCap: 1700 },
    ]);
  });
  it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G (block discount affects the premium only)", () => {
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
            cause: "flood",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });

    // quote: policy base 160 G = 100 (sword) + 60 (the 3-rune block)
    //        + 16 G first insurance + 5 G fee = 181 G
    //
    // claim: 200 − 100 deductible = 100 G payout.
    // The insurance sum counts each rune at its FULL 250 G insurance value —
    // the block is a premium discount and does not reduce cover:
    // 1000 + 3 × 250 = 1750 G → cap 3500 G; 3500 − 100 = 3400 G remaining.
    expect(result.results).toEqual([
      { premium: 181 },
      { payout: 100, remainingCap: 3400 },
    ]);
  });
  it("sword insured (cap 2000 G), two successive claims of 1500 G each → first payout 1400 G then 600 G, exhausting the cap", () => {
    const dragonAttack = {
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
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        dragonAttack,
        dragonAttack,
      ],
    });

    // quote: 100 G base + 10 G first insurance + 5 G fee = 115 G
    // insurance sum 1000 G → cap 2000 G
    //
    // first claim:  1500 − 100 deductible = 1400 G; 2000 − 1400 = 600 G left
    // second claim: the desired 1400 G is reduced to the 600 G still available
    //               → payout 600 G, cap exhausted at 0 G
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- Multiple items of the same type ---
  it("a policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });

    // quote: 200 G base (two swords at 100 each) + 20 G first insurance
    //        + 5 G fee = 225 G
    //
    // claim: 500 − 100 deductible = 400 G payout.
    // insurance sum 2000 G (2 × 1000) → cap 4000 G; 4000 − 400 = 3600 G remaining
    expect(result.results).toEqual([
      { premium: 225 },
      { payout: 400, remainingCap: 3600 },
    ]);
  });

  it("3 swords → 300 G base premium (the block applies to components only, not main items)", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [sword, sword, sword] }],
    });

    // The building-block discount is a COMPONENTS-only rule (runes, moonstones).
    // Three swords are three main items, so they cost 3 × 100 = 300 G base —
    // not the 60 G block price.
    // 300 G base + 30 G first insurance + 5 G fee = 335 G
    expect(result.results).toEqual([{ premium: 335 }]);
  });
  it("two sword damage entries on a two-sword policy → each treated as a separate damage with its own deductible", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });

    // quote: 200 G base + 20 G first insurance + 5 G fee = 225 G
    //
    // claim: two entries of the same itemType are two SEPARATE damages, each
    // carrying its own deductible: (500 − 100) + (300 − 100) = 600 G
    // insurance sum 2000 G → cap 4000 G; 4000 − 600 = 3400 G remaining
    expect(result.results).toEqual([
      { premium: 225 },
      { payout: 600, remainingCap: 3400 },
    ]);
  });
  it("more damage entries of a type than the policy covers → the whole claim is rejected", () => {
    const runOverclaimedScenario = () =>
      runScenario({
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

    // Two sword damages, but only one sword is insured — the whole claim is
    // rejected rather than partially settled.
    expect(runOverclaimedScenario).toThrow(/sword/);
  });

  // --- Edge cases / errors ---
  it("quote with an unknown item type (e.g. broomstick) → error", () => {
    const quoteABroomstick = () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });

    // The MHPCO has no price list entry for a broomstick, so it will not quote.
    expect(quoteABroomstick).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy (amulet damaged when only a sword insured) → error", () => {
    const claimForAnUninsuredAmulet = () =>
      runScenario({
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
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });

    // The policy insures a sword; the MHPCO will not pay for an amulet.
    expect(claimForAnUninsuredAmulet).toThrow(/amulet/);
  });
  it("claim referencing a damage entry with an unknown item type → error", () => {
    const claimForABroomstick = () =>
      runScenario({
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
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      });

    // A broomstick is neither insured under this policy nor known to the office.
    expect(claimForABroomstick).toThrow(/broomstick/);
  });
  it("claim containing a damage entry with amount -200 → error", () => {
    const claimANegativeAmount = () =>
      runScenario({
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
              cause: "fraud attempt",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      });

    // Damage cannot be negative; the MHPCO does not take deposits this way.
    expect(claimANegativeAmount).toThrow(/-200|negative/);
  });

  // --- CLI contract: see cli.spec.ts ---
});
