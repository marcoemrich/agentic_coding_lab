import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("Quote - base premiums", () => {
  it("returns 5 G for an empty item list (processing fee only)", () => {
    const result = quote([], { yearsWithMHPCO: 0, contractNumber: 1 });
    expect(result.premium).toBe(5);
  });
  it("returns base premium plus fee for a single sword", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 100 base + 10 first insurance (10% of 100) + 5 fee = 115
    expect(result.premium).toBe(115);
  });
  it("returns base premium plus fee for a single amulet", () => {
    const result = quote(
      [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 60 base + 6 first insurance (10% of 60) + 5 fee = 71
    expect(result.premium).toBe(71);
  });
  it("returns base premium plus fee for a single staff", () => {
    const result = quote(
      [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 80 base + 8 first insurance (10% of 80) + 5 fee = 93
    expect(result.premium).toBe(93);
  });
  it("returns base premium plus fee for a single potion", () => {
    const result = quote(
      [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 40 base + 4 first insurance (10% of 40) + 5 fee = 49
    expect(result.premium).toBe(49);
  });
  it("returns base premium plus fee for a single component (rune)", () => {
    const result = quote(
      [{ type: "rune" }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 25 base + 2.5 first insurance (10% of 25) + 5 fee = 32.5, rounded up = 33
    expect(result.premium).toBe(33);
  });
  it("returns combined base premiums plus fee for multiple different items", () => {
    const result = quote(
      [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // (100 + 60) base + 16 first insurance (10% of 160) + 5 fee = 181
    expect(result.premium).toBe(181);
  });
});

describe("Quote - component block pricing", () => {
  it("charges 50 G for 2 runes (no block)", () => {
    const result = quote(
      [{ type: "rune" }, { type: "rune" }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 2 × 25 = 50 base + 5 first insurance (10%) + 5 fee = 60
    expect(result.premium).toBe(60);
  });
  it("charges 60 G for exactly 3 alike components (block discount)", () => {
    const result = quote(
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 3 runes block = 60 base + 6 first insurance (10%) + 5 fee = 71
    expect(result.premium).toBe(71);
  });
  it("charges 100 G for 4 runes (no block)", () => {
    const result = quote(
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 4 × 25 = 100 base (no block) + 10 first insurance (10%) + 5 fee = 115
    expect(result.premium).toBe(115);
  });
  it("charges 75 G for 2 runes + 1 moonstone (different types, no block)", () => {
    const result = quote(
      [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 2×25 + 1×25 = 75 base (no block: different types) + 7.5 first insurance + 5 fee = 87.5, ceil = 88
    expect(result.premium).toBe(88);
  });
  it("charges 120 G for 3 runes + 3 moonstones (two separate blocks)", () => {
    const result = quote(
      [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 2 blocks × 60 = 120 base + 12 first insurance (10%) + 5 fee = 137
    expect(result.premium).toBe(137);
  });
});

describe("Quote - item-specific modifiers", () => {
  it("adds 50% surcharge for a cursed item", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 100 base + 50 curse (50% of 100) + 10 first insurance (10% of 100) + 5 fee = 165
    expect(result.premium).toBe(165);
  });
  it("adds 30% surcharge for enchantment level 5 or above", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 100 base + 30 enchant (30% of 100) + 10 first insurance (10% of 100) + 5 fee = 145
    expect(result.premium).toBe(145);
  });
  it("applies both cursed and high-enchantment surcharges to the same item", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 100 base + 50 curse + 30 enchant + 10 first insurance (10% of 100) + 5 fee = 195
    expect(result.premium).toBe(195);
  });
  it("applies item-specific modifiers only to the affected item in a multi-item policy", () => {
    const result = quote(
      [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // policy base = 160 (100+60), curse surcharge = 50 (on sword only)
    // first insurance = 16 (10% of 160), fee = 5
    // total = 160 + 50 + 16 + 5 = 231
    expect(result.premium).toBe(231);
  });
});

describe("Quote - policy-wide modifiers", () => {
  it("applies 20% loyalty discount for customers with 2 or more years", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 2, contractNumber: 1 }
    );
    // 100 base - 20 loyalty (20% of 100) + 10 first insurance (10% of 100) + 5 fee = 95
    expect(result.premium).toBe(95);
  });
  it("applies 10% first insurance surcharge (always applies per quote)", () => {
    const result = quote(
      [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 60 base + 6 first insurance (10% of 60) + 5 fee = 71
    expect(result.premium).toBe(71);
  });
  it("applies 15% follow-up discount on second and subsequent contracts", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 2 }
    );
    // 100 base + 10 first insurance (10%) - 15 follow-up (15%) + 5 fee = 100
    expect(result.premium).toBe(100);
  });
  it("applies loyalty, first insurance, and follow-up together", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      { yearsWithMHPCO: 3, contractNumber: 2 }
    );
    // 100 base - 20 loyalty (20%) + 10 first insurance (10%) - 15 follow-up (15%) + 5 fee = 80
    expect(result.premium).toBe(80);
  });
});

describe("Quote - rounding", () => {
  it("rounds premium up to whole G (in MHPCO's favor)", () => {
    const result = quote(
      [{ type: "moonstone" }],
      { yearsWithMHPCO: 2, contractNumber: 2 }
    );
    // 25 base - 5 loyalty (20%) + 2.5 first insurance (10%) - 3.75 follow-up (15%) = 18.75 + 5 fee = 23.75, ceil = 24
    expect(result.premium).toBe(24);
  });
});

describe("Quote - integration", () => {
  it("newcomer with cursed sword pays 165 G", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    // 100 base + 50 curse + 10 first insurance (10% of 100) + 5 fee = 165
    expect(result.premium).toBe(165);
  });
  it("long-standing customer second contract with cursed high-enchantment sword pays 160 G", () => {
    const result = quote(
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      { yearsWithMHPCO: 3, contractNumber: 2 }
    );
    // 100 base + 50 curse + 30 enchant - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    expect(result.premium).toBe(160);
  });
});

describe("Claim - standard reimbursement", () => {
  it("reimburses damage minus 100 G deductible for a standard item", () => {
    const policy = quote(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { yearsWithMHPCO: 0, contractNumber: 1 }
    );
    const result = claim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // 500 damage - 100 deductible = 400 payout
    expect(result.payout).toBe(400);
    // cap = 2 × 1000 = 2000, remaining = 2000 - 400 = 1600
    expect(result.remainingCap).toBe(1600);
  });
  it.todo("reimburses damage to a component minus deductible");
});

describe("Claim - special clauses", () => {
  it.todo("reimburses at 50% for enchantment level 8 or above, then deductible");
  it.todo("fully reimburses dragon material items, then deductible");
  it.todo("applies 50% rule when both high enchantment and dragon material apply");
});

describe("Claim - deductible per item", () => {
  it.todo("applies deductible separately to each damaged item in an event");
});

describe("Claim - cap", () => {
  it.todo("caps total payout at twice the insurance sum");
  it.todo("tracks remaining cap across multiple claims on the same policy");
});

describe("Claim - rounding", () => {
  it.todo("rounds payout down to whole G (in MHPCO's favor)");
});

describe("Error handling", () => {
  it.todo("rejects unknown item type in a quote");
  it.todo("rejects claim referencing an item not in the policy");
  it.todo("rejects claim with more damage entries than insured items of that type");
  it.todo("rejects negative damage amount");
});
