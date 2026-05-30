import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office — quote (premium)", () => {
  // --- Simplest cases ---
  it("empty item list → premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, { op: "quote", items: [] }, 0)).toBe(5);
  });

  // --- Single main item base premiums (+ fee, first insurance per item) ---
  // Newcomer, single plain item: base + 10% first insurance + 5 fee.
  it("single sword (newcomer) → 100 + 10 first + 5 fee = 115 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        0,
      ),
    ).toBe(115);
  });
  it("single amulet (newcomer) → 60 + 6 first + 5 fee = 71 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        0,
      ),
    ).toBe(71);
  });
  it("single staff (newcomer) → 80 + 8 first + 5 fee = 93 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] },
        0,
      ),
    ).toBe(93);
  });
  it("single potion (newcomer) → 40 + 4 first + 5 fee = 49 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        0,
      ),
    ).toBe(49);
  });

  // --- Components and building blocks (base premiums per spec examples) ---
  it("1 rune (newcomer) → base 25 → premium 33 G (25×1.1+5=32.5→33)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, { op: "quote", items: [{ type: "rune" }] }, 0),
    ).toBe(33);
  });
  it("2 runes (newcomer) → base 50 → premium 60 G (no block)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, { op: "quote", items: [{ type: "rune" }, { type: "rune" }] }, 0),
    ).toBe(60);
  });
  it("3 runes (newcomer) → base 60 block → premium 71 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        0,
      ),
    ).toBe(71);
  });
  it("4 runes (newcomer) → base 100 no block → premium 115 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        0,
      ),
    ).toBe(115);
  });
  it("7 runes (newcomer) → base 175 no block → premium 198 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        0,
      ),
    ).toBe(198);
  });

  // --- "Alike" components (❓ resolved: alike = same type) ---
  it("2 runes + 1 moonstone (newcomer) → base 75 no block → premium 88 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        0,
      ),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones (newcomer) → base 120 two blocks → premium 137 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
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
        0,
      ),
    ).toBe(137);
  });

  // --- Item-specific modifiers in isolation ---
  it("cursed sword (newcomer, steel ench 3) → curse +50, first +10 → premium 165 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        0,
      ),
    ).toBe(165);
  });
  it("sword ench 5 (newcomer) → high-ench +30, first +10 → premium 145 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
        0,
      ),
    ).toBe(145);
  });
  it("sword ench 4 (newcomer) → no high-ench → premium 115 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
        0,
      ),
    ).toBe(115);
  });
  it("cursed sword ench 5 (newcomer) → curse +50, high-ench +30, first +10 → premium 195 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
        0,
      ),
    ).toBe(195);
  });

  // --- Policy-wide modifiers in isolation ---
  it("loyalty: 2-year customer, plain sword (first quote) → -20 loyalty, +10 first → premium 95 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 2 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        0,
      ),
    ).toBe(95);
  });
  it("follow-up: 0-year customer, plain sword, 2nd quote (quoteIndex 1) → +10 first, -15 follow-up → premium 100 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        1,
      ),
    ).toBe(100);
  });

  // --- Modifier scope on multi-item policies (❓ resolved) ---
  it("cursed sword + plain amulet (newcomer, first quote) → curse +50 on sword, first +16 → premium 231 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        0,
      ),
    ).toBe(231);
  });

  // --- Rounding (MHPCO's favor) ---
  it("premium yielding 197.5 → rounded UP to 198 G (7 runes newcomer: 175×1.1+5=197.5)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        0,
      ),
    ).toBe(198);
  });

  // --- Integration examples ---
  it("integration: newcomer with cursed sword (steel, ench 3), first contract → premium 165 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        0,
      ),
    ).toBe(165);
  });
  it("integration: long-standing customer's 2nd contract: cursed sword (steel, ench 7), 3 years → premium 160 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        1,
      ),
    ).toBe(160);
  });
});

describe("MHPCO Claim Office — claim (payout)", () => {
  // --- Standard reimbursement (no special clauses) ---
  it("regular sword (steel, ench 3), damage 500 → payout 400 G (500 − 100 deductible)", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
      ).payout,
    ).toBe(400);
  });
  it("rune (value 250), damage 200 → payout 100 G (200 − 100, no special clause)", () => {
    expect(
      claim(
        [{ type: "rune" }],
        { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
      ).payout,
    ).toBe(100);
  });

  // --- Enchantment threshold vs dragon material ---
  it("dragon sword, ench 8, damage 1000 → payout 400 G (50% then deductible)", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      ).payout,
    ).toBe(400);
  });
  it("dragon sword, ench 9, damage 1000 → payout 400 G (50% wins, then deductible)", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      ).payout,
    ).toBe(400);
  });
  it("dragon sword, ench 5, damage 800 → payout 700 G (dragon full, then deductible)", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
      ).payout,
    ).toBe(700);
  });
  it("steel sword, ench 9, damage 1000 → payout 400 G (50% then deductible)", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
      ).payout,
    ).toBe(400);
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    expect(
      claim(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 2 },
        ],
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      ).payout,
    ).toBe(600);
  });

  // --- Multiple items of the same type ---
  it("two swords insured → insurance sum 2000, two sword damages each get own deductible", () => {
    const result = claim(
      [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "sword", material: "steel", enchantment: 3 },
      ],
      {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      },
    );
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });
  it("more sword damages than swords insured → claim rejected (error)", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 300 },
            { itemType: "sword", amount: 300 },
          ],
        },
      ),
    ).toThrow();
  });

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000): first claim 1500 → payout 1400, remainingCap 600", () => {
    const r = claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    );
    expect(r.payout).toBe(1400);
    expect(r.remainingCap).toBe(600);
  });
  it("sword (cap 2000): second claim 1500 → payout 600, remainingCap 0 (reduced to remaining cap)", () => {
    const r = claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      600,
    );
    expect(r.payout).toBe(600);
    expect(r.remainingCap).toBe(0);
  });

  // --- Cap basis ---
  it("cursed sword → cap 2000 (based on unmodified insurance value; premium modifiers do not raise cap)", () => {
    const r = claim(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    );
    expect(r.payout).toBe(1400);
    expect(r.remainingCap).toBe(600);
  });
  it("sword + 3 runes (block) → insurance sum 1750 (block discount does not affect insurance sum)", () => {
    const r = claim(
      [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    );
    expect(r.payout).toBe(400);
    expect(r.remainingCap).toBe(3100);
  });

  // --- Rounding (payout rounded down) ---
  it("payout yielding 350.5 → rounded DOWN to 350 G (ench 8 sword, damage 901)", () => {
    const r = claim(
      [{ type: "sword", material: "steel", enchantment: 8 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
    );
    expect(r.payout).toBe(350);
  });

  // --- Claim error cases ---
  it("damage to item not in policy → claim rejected (error)", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
      ),
    ).toThrow();
  });
  it("damage with negative amount → claim rejected (error)", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
      ),
    ).toThrow();
  });
});

describe("MHPCO Claim Office — unknown item / errors", () => {
  it("quote with unknown item type → throws (CLI exits non-zero)", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, { op: "quote", items: [{ type: "broomstick" }] }, 0),
    ).toThrow();
  });
});
