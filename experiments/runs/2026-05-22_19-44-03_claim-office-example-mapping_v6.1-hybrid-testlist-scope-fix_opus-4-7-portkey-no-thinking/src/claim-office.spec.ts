import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases ---
  it("empty item list → premium 5 G (only processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per main item type (no modifiers, 0 years, first quote) ---
  // Plain item base premium + 10 G first-insurance + 5 G fee
  it("plain sword (steel, enchantment 0) for new customer → premium 115 G (100 + 10 + 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("plain amulet for new customer → premium 71 G (60 + 6 first-insurance rounded up + 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("plain staff for new customer → premium 93 G (80 + 8 + 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("plain potion for new customer → premium 49 G (40 + 4 + 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component pricing (runes/moonstones) ---
  it("2 runes → premium 60 G (50 base + 5 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → premium 71 G (60 block + 6 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → premium 115 G (no block; 100 base + 10 first-insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → premium 198 G (no block: 7*25=175 base + 17.5 first-insurance rounded up + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarification (❓) ---
  it("2 runes + 1 moonstone → premium 88 G (no block: 75 base + first-insurance + fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → premium 137 G (two blocks: 120 + 12 first-ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Modifiers in isolation (item-specific) ---
  it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with exactly enchantment 5 → premium 145 G (100 + 30 high-ench + 10 first-ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (premium 115 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with exactly enchantment 5 → premium 195 G (100 + 50 curse + 30 ench + 10 first-ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO → loyalty discount applies (plain sword → 95 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 95 }] });
  });
  it("second quote in scenario gets 15% follow-up contract discount (plain sword, 0 years, 2nd quote → 100 base + 10 first-ins - 15 follow-up + 5 fee = 100)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Modifier scope on multi-item policies (❓) ---
  it("cursed sword + plain amulet → premium 231 G (160 base + 50 curse + 16 first-ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding in MHPCO's favor ---
  it("premium calculation yielding 137.5 G → final premium 143 G (rounded up + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 143 }] });
  });
  it("payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("intermediate amounts kept as fractions; only final is rounded (cursed amulet + rune → 129 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: true },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 129 }] });
  });

  // --- Integration examples ---
  it("long-standing customer's second contract (3 years, cursed sword enchantment 7) → premium 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (500 - 100 deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "goblin", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250 G), damage 200 G → payout 100 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim processing: enchantment threshold ---
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-ench wins, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon only: full minus deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (high-ench: 50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
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
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G (single damage 200 → payout 100, remainingCap 3900)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("two-sword policy: dragon attack with two sword damage entries → each treated separately with own deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    // (500-100) + (300-100) = 600. Cap 4000 - 600 = 3400.
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("damages contain more entries of a type than policy covers → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });

  // --- Cap exhaustion ---
  it("policy covers sword + amulet → insurance sum 1600 G, cap 3200 G (damage 200 → remainingCap 3100)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword (insurance value 1000 G) → cap 2000 G (modifiers do not raise cap)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("policy with sword + 3 runes → insurance sum 1750 G (block discount affects premium only)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword insured (cap 2000 G); two successive 1500 G claims → first 1400 G remaining 600 G; second 600 G remaining 0 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases ---
  it("quote includes unknown item type (e.g. 'broomstick') → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });
  it("claim references damage entry whose item is not part of the policy → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      })
    ).toThrow();
  });
  it("claim references damage entry with unknown item type → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 100 }] },
          },
        ],
      })
    ).toThrow();
  });
  it("claim contains damage entry with negative amount → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })
    ).toThrow();
  });

  // --- End-to-end schema example ---
  it("schema example: long-standing customer amulet quote + fire claim 200 G → premium and payout integers per schema", () => {
    const out = runScenario({
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
    // Amulet base 60, loyalty applies (5≥2): (10-20)% × 60 = -6, total 60-6=54 → +5 fee = 59 G
    // Claim: 200-100 deductible = 100, cap 2×600=1200 → remaining 1100
    expect(out).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
});
