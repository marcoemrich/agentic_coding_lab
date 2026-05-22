import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge cases — simplest first
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for single items (with fee, no other modifiers, year=0 first-quote)
  it("single sword (steel, ench 3, not cursed), 0 years, first quote → 100 base + 10 first-insurance + 5 fee = 115 G", () => {
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
  it("single amulet (silver, ench 2, not cursed), 0 years, first quote → 60 base + 6 first-insurance + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (wood, ench 2, not cursed), 0 years, first quote → 80 base + 8 first-insurance + 5 fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (glass, ench 2, not cursed), 0 years, first quote → 40 base + 4 first-insurance + 5 fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components — building block of 3 alike
  it("2 runes → base premium 50 G (no block), full premium 60 G with first-insurance and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → base premium 60 G (block applies), full premium 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → base premium 100 G (no block; block requires exactly 3), full premium 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → base premium 175 G (no block applies), full premium 198 G (197.5 rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // "Alike" components — same type required
  it("2 runes + 1 moonstone → base premium 75 G (no block: different types), full premium 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → base 120 G (two blocks), full premium 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet, 0 yrs, first quote → 160 base + 50 curse + 16 first-insurance + 5 fee = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Modifier thresholds — premium
  it("customer with exactly 2 years, sword, first quote → 100 + 10 first-insurance - 20 loyalty + 5 fee = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("sword with exactly enchantment 5 → +30 high-ench, +10 first-ins, +5 fee = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge: 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 → 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Rounding — premium rounded up (MHPCO's favor)
  it("premium rounding: 197.5 → 198 G (rounded up in MHPCO's favor) — covered by 7-rune case", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Integration examples from spec
  it("Newcomer with cursed sword (steel, ench 3), 0 years → 165 G (integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("Long-standing customer's second contract: 3 years, cursed sword ench 7, 2nd quote → 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // Errors on quote
  it("quote includes item with unknown type → throws (CLI maps to non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // ===== CLAIMS =====

  // Standard reimbursement (no special clauses)
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G (full minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("damage to rune (insurance value 250 G), damage 200 G → payout 100 G", () => {
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
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

  // Enchantment threshold for claims
  it("dragon-material sword with exactly ench 8, damage 1000 G → payout 400 G (50% rule, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon-material sword ench 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon-material sword ench 5, damage 800 G → payout 700 G (only dragon clause; full minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("steel sword ench 9, damage 1000 G → payout 400 G (only high-enchantment clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // Deductible per damage event
  it("dragon attack on sword (500 G) and amulet (300 G) → payout 600 G (deductible applies once per damaged item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });

  // Multiple items of the same type
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G; two sword damages → each gets its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 600 },
            { itemType: "sword", amount: 400 },
          ] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 800,
      remainingCap: 3200,
    });
  });
  it("damages contains more entries of a type than insured → claim rejected (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 400 },
            ] },
          },
        ],
      }),
    ).toThrow();
  });

  // Cap exhaustion
  it("sword + amulet policy → insurance sum 1600 G, cap 3200 G (observed via small claim)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 100,
      remainingCap: 3100,
    });
  });
  it("cursed sword (insurance value 1000 G) → cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 200,
      remainingCap: 1800,
    });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 100,
      remainingCap: 3400,
    });
  });
  it("sword cap 2000 G; first claim 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("sword cap 2000 G; second claim 1500 G after first 1500 G claim → payout 600 G, remainingCap 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
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
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[2]).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // Rounding for payouts — rounded down (MHPCO's favor)
  it("payout that yields 350.5 G → final payout 350 G (rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect((result as { results: { payout: number; remainingCap: number }[] }).results[1]).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  // Claim errors
  it("claim references damage for item not in policy → throws (CLI maps to non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim contains damage with amount: -200 → throws (CLI maps to non-zero exit)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
