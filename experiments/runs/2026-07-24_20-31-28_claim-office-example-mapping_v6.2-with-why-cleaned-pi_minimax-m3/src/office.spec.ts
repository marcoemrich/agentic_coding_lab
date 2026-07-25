// MHPCO Claim Office - test list covering every spec example and rule
// All tests are `it.todo()` placeholders to be activated one at a time.
import { describe, it, expect } from "vitest";
import { quote, claim, capForPolicy, insuranceSum } from "./office.js";

describe("quote - simple item types", () => {
  it("empty item list → 5 G (only processing fee)", () => {
    expect(quote([], 0, false)).toBe(5);
  });
  it("single sword (plain) → 115 G (100 base + 10 first ins + 5 fee)", () => {
    expect(quote([{ type: "sword" }], 0, false)).toBe(115);
  });
  it("single amulet (plain) → 71 G (60 base + 6 first ins + 5 fee)", () => {
    expect(quote([{ type: "amulet" }], 0, false)).toBe(71);
  });
  it("single staff (plain) → 93 G (80 base + 8 first ins + 5 fee)", () => {
    expect(quote([{ type: "staff" }], 0, false)).toBe(93);
  });
  it("single potion (plain) → 49 G (40 base + 4 first ins + 5 fee)", () => {
    expect(quote([{ type: "potion" }], 0, false)).toBe(49);
  });
  it("single rune (plain) → 33 G (25 base + 2.5 first ins + 5 fee, rounded up)", () => {
    expect(quote([{ type: "rune" }], 0, false)).toBe(33);
  });
  it("single moonstone (plain) → 33 G (25 base + 2.5 first ins + 5 fee, rounded up)", () => {
    expect(quote([{ type: "moonstone" }], 0, false)).toBe(33);
  });
});

describe("quote - building block of 3 alike components", () => {
  it("2 runes (no block) → 60 G (2×25 + 5 first ins + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }], 0, false)).toBe(60);
  });
  it("3 runes (block applies) → 71 G (60 + 6 first ins + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0, false)).toBe(71);
  });
  it("4 runes (no block — block requires exactly 3) → 115 G (4×25 + 10 first ins + 5 fee)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 0, false)).toBe(115);
  });
  it("7 runes (no block) → 198 G (7×25 + 17.5 first ins + 5 fee, rounded up)", () => {
    const sevenRunes = Array(7).fill({ type: "rune" });
    expect(quote(sevenRunes, 0, false)).toBe(198);
  });
});

describe('quote - "alike" components', () => {
  it("2 runes + 1 moonstone (different types, no block) → 88 G (75 + 7.5 first ins + 5 fee, rounded up)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0, false)).toBe(88);
  });
  it("3 runes + 3 moonstones (two separate blocks) → 137 G (120 + 12 first ins + 5 fee)", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ], 0, false)).toBe(137);
  });
});

describe("quote - item-specific modifier thresholds", () => {
  it("sword (enchantment 4, no curse) → 115 G (no high-ench surcharge, +10 first ins + 5 fee)", () => {
    expect(quote([{ type: "sword", enchantment: 4 }], 0, false)).toBe(115);
  });
  it("sword (enchantment 5, no curse) → 145 G (high-ench surcharge applies: +30 + 10 first ins + 5 fee)", () => {
    expect(quote([{ type: "sword", enchantment: 5 }], 0, false)).toBe(145);
  });
  it("cursed sword (enchantment 4) → 165 G (curse applies, high-ench does not: +50 + 10 first ins + 5 fee)", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }], 0, false)).toBe(165);
  });
  it("cursed sword (enchantment 5) → 195 G (both surcharges apply: +50 + 30 + 10 first ins + 5 fee)", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }], 0, false)).toBe(195);
  });
});

describe("quote - policy-wide modifier thresholds", () => {
  it("sword (customer 1 year) → 115 G (no loyalty discount)", () => {
    expect(quote([{ type: "sword" }], 1, false)).toBe(115);
  });
  it("sword (customer 2 years) → 95 G (loyalty discount applies: −20)", () => {
    expect(quote([{ type: "sword" }], 2, false)).toBe(95);
  });
  it("sword (customer 3 years, follow-up quote) → 80 G (loyalty −20 + follow-up −15)", () => {
    expect(quote([{ type: "sword" }], 3, true)).toBe(80);
  });
});

describe("quote - modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet, customer 0y, first quote → 231 G (curse is per-item, first ins on policy base)", () => {
    expect(quote([
      { type: "sword", cursed: true },
      { type: "amulet" },
    ], 0, false)).toBe(231);
  });
});

describe("quote - integration examples from the spec", () => {
  it("newcomer with cursed sword (0y, first quote) → 165 G (100 + 50 + 10 + 5)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0, false)).toBe(165);
  });
  it("long-standing customer's second contract (3y, cursed sword enchantment 7, 2nd quote) → 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, true)).toBe(160);
  });
});

describe("quote - rounding in MHPCO's favor", () => {
  it("premium with .5 fraction rounds UP — 1 staff + 1 rune, 0y, first quote → 121 G (from 120.5)", () => {
    expect(quote([{ type: "staff" }, { type: "rune" }], 0, false)).toBe(121);
  });
});

describe("quote - error cases", () => {
  it("unknown item type → throws (CLI exits non-zero, no results written)", () => {
    expect(() => quote([{ type: "broomstick" }], 0, false)).toThrow();
  });
});

describe("claim - standard reimbursement (no special clauses)", () => {
  it("steel sword (enchantment 3), damage 500 G → payout 400 G (500 − 100 deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3 }],
      remainingCap: 2000,
    };
    const result = claim(policy, { damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("rune, damage 200 G → payout 100 G (200 − 100 deductible; runes have no enchantment/material)", () => {
    const policy: Policy = {
      items: [{ type: "rune" }],
      remainingCap: 500,
    };
    const result = claim(policy, { damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });
});

describe("claim - dragon material clause", () => {
  it("dragon-material sword (enchantment 5), damage 800 G → payout 700 G (full reimbursement, no high-ench)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 5 }],
      remainingCap: 2000,
    };
    const result = claim(policy, { damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });
});

describe("claim - high-enchantment clause (≥8) wins over dragon", () => {
  it("dragon-material sword (enchantment 9), damage 1000 G → payout 400 G (50% then deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
      remainingCap: 2000,
    };
    const result = claim(policy, { damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("steel sword (enchantment 9), damage 1000 G → payout 400 G (only high-ench clause applies)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9 }],
      remainingCap: 2000,
    };
    const result = claim(policy, { damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("dragon-material sword (enchantment exactly 8), damage 1000 G → payout 400 G (high-ench clause triggers at ≥8)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 8 }],
      remainingCap: 2000,
    };
    const result = claim(policy, { damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
});

describe("claim - deductible applies once per damaged item", () => {
  it("dragon attack damages sword (500 G) + amulet (300 G) → payout 600 G (400 + 200)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet" }],
      remainingCap: 3200,
    };
    const result = claim(policy, {
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });
});

describe("claim - insurance sum and cap", () => {
  it("two-sword policy → insurance sum 2000 G, cap 4000 G", () => {
    expect(capForPolicy([{ type: "sword" }, { type: "sword" }])).toBe(4000);
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it.todo("dragon attack damages two swords — each damage gets its own deductible");
  it.todo("claim with more damages of a type than policy covers → throws (claim rejected)");
  it.todo("sword + amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword (insurance value 1000 G) → cap 2000 G (premium modifiers do not raise cap)");
  it.todo("sword + 3 runes (a block) → insurance sum 1750 G (block affects premium only, not insurance sum)");
});

describe("claim - cap exhaustion", () => {
  it.todo("first claim of 1500 G on sword (cap 2000) → payout 1400, remainingCap 600");
  it.todo("second claim of 1500 G on same sword (cap 600) → payout 600, remainingCap 0 (capped)");
});

describe("claim - rounding in MHPCO's favor", () => {
  it.todo("payout with .5 fraction rounds DOWN — steel sword (ench 9), damage 901 → payout 350 G (from 350.5)");
});

describe("claim - error cases", () => {
  it.todo("damage entry with item not in policy → throws");
  it.todo("damage entry with unknown item type → throws");
  it.todo("damage entry with negative amount (−200) → throws");
});
