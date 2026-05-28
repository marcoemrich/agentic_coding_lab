import { describe, it, expect } from "vitest";
import { run } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Simplest case
  it("empty item list — premium 5 G (only processing fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // Base premiums for single items (with processing fee)
  it("single sword (first insurance) — premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet (first insurance) — premium 71 G (60 base + 6 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff (first insurance) — premium 93 G (80 base + 8 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion (first insurance) — premium 49 G (40 base + 4 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Components
  it("single rune (first insurance) — premium 33 G (25 base + 2.5 first + 5 fee = 32.5 → 33)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("single moonstone (first insurance) — premium 33 G (same as rune)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  // Building block of 3 alike components
  it("2 runes — premium 60 G (50 base + 5 first + 5 fee, no block)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes — premium 71 G (60 block + 6 first + 5 fee, block applies)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes — premium 115 G (100 base + 10 first + 5 fee, no block, requires exactly 3)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes — premium 198 G (175 base + 17.5 first + 5 fee = 197.5 → 198)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // Alike components — different types are not alike
  it("2 runes + 1 moonstone — premium 88 G (75 base + 7.5 first + 5 fee = 87.5 → 88, different types not alike)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones — premium 137 G (120 base from 2 blocks + 12 first + 5 fee)", () => {
    const result = run({
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
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Item-specific modifiers
  it("cursed sword (first insurance) — premium 165 G (100 base + 50 curse + 10 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("sword ench 5 (first insurance) — premium 145 G (100 base + 30 high-ench + 10 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword ench 4 — premium 115 G (no high-ench surcharge)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword ench 5 — premium 195 G (100 + 50 curse + 30 high + 10 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // Customer-level modifiers
  it("customer with 2 years, single sword — premium 95 G (loyalty discount applies)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("customer with 1 year — no loyalty discount (100 sword + 10 first + 5 fee = 115 G)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("first contract — 10% first insurance surcharge applies (100 sword + 10 first + 5 fee = 115 G)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("second contract — 15% follow-up discount applies on second quote (100 sword + 10 first - 15 follow-up + 5 fee = 100 G)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet — premium 231 G (160 base + 50 curse on sword only + 16 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // Rounding in MHPCO's favor
  it("premium yielding 197.5 G — rounded up to 198 G (7 runes: 175 base + 17.5 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G — rounded down to 350 G (sword ench 9, damage 901: 450.5 - 100)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Integration examples
  it("newcomer cursed sword — premium 165 G (integration: 100 + 50 curse + 10 first + 5 fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract with cursed sword ench 7 — premium 160 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claims — basic deductible
  it("regular sword damage 500 G — payout 400 G (deductible), remainingCap 1600 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G — payout 100 G (deductible, no special clause); remainingCap 400 G", () => {
    const result = run({
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
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claims — enchantment threshold
  it("dragon-material sword ench 8, damage 1000 G — payout 400 G (50% then deductible); remainingCap 1600 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 9, damage 1000 G — payout 400 G (50% wins, then deductible); remainingCap 1600 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 5, damage 800 G — payout 700 G (dragon full, then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9, damage 1000 G — payout 400 G (50% then deductible); remainingCap 1600 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claims — multiple damages
  it("dragon attack damages sword 500 + amulet 300 — payout 600 G (deductible per item); remainingCap 2600 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Multiple items of the same type
  it("two swords policy — insurance sum 2000 G, cap 4000 G (two damages each deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array references more items than policy — run throws", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    })).toThrow();
  });

  // Cap exhaustion
  it("sword + amulet — insurance sum 1600 G, cap 3200 G (sword damage 3300 → payout 3200, cap 0)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 3300 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword — cap 2000 G (based on unmodified insurance value)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + 3 runes block — insurance sum 1750 G (block affects premium only); cap 3500", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("sword two successive 1500 G claims — first payout 1400 cap 600, second payout 600 cap 0", () => {
    const result = run({
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
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Edge case errors
  it("unknown item type in quote — run throws", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item not in policy — run throws", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    })).toThrow();
  });
  it("negative damage amount — run throws", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    })).toThrow();
  });
});
