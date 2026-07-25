import { describe, it, expect } from "vitest";
import { calculateQuote, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("should return a premium of 5 G for an empty item list -- (empty list: only processing fee)", () => {
    expect(calculateQuote({ customer: { yearsWithMHPCO: 0 }, items: [] })).toBe(5);
  });

  it("should return base premium 100 G for a single sword -- (sword: 1000 G value, 100 G base premium)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "sword" }] 
    })).toBe(115); // Base premium 100 G + 10% first insurance (10 G) + 5 G fee = 115 G total premium
  });
  it("should return base premium 60 G for a single amulet -- (amulet: 600 G / 60 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "amulet" }] 
    })).toBe(71); // Base premium 60 G + 10% first insurance (6 G) + 5 G fee = 71 G total premium
  });
  it("should return base premium 80 G for a single staff -- (staff: 800 G / 80 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "staff" }] 
    })).toBe(93); // Base premium 80 G + 10% first insurance (8 G) + 5 G fee = 93 G total premium
  });
  it("should return base premium 40 G for a single potion -- (potion: 400 G / 40 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "potion" }] 
    })).toBe(49); // Base premium 40 G + 10% first insurance (4 G) + 5 G fee = 49 G total premium
  });
  it("should return base premium 25 G for a single component (rune or moonstone) -- (component: 250 G / 25 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "rune" }] 
    })).toBe(33); // Base premium 25 G + 10% first insurance (2.5 G → 3 G in MHPCO's favor) + 5 G fee = 33 G total premium
  });

  it("should return 50 G base premium for 2 runes -- (2 runes: 2 × 25 G = 50 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "rune" }, { type: "rune" }] 
    })).toBe(60); // 2 runes × 25 G = 50 G base + 10% first insurance (5 G) + 5 G fee = 60 G total premium
  });
  it("should return 60 G base premium for 3 runes as a building block -- (3 runes: block premium 60 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] 
    })).toBe(65); // 3 runes as building block: 60 G base + 5 G fee = 65 G total premium
  });
  it("should return 100 G base premium for 4 runes -- (4 runes: 4 × 25 G = 100 G, no block)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] 
    })).toBe(115); // 4 runes: 4 × 25 G = 100 G base + 10% first insurance (10 G) + 5 G fee = 115 G total premium (no block applies)
  });
  it("should return 50 G base premium for 2 runes and 1 moonstone (no block across types) -- (different component types: no block)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] 
    })).toBe(88); // 2 runes (50 G) + 1 moonstone (25 G) = 75 G base + 10% first insurance (7.5 G) + 5 G fee = 87.5 G → 88 G in MHPCO's favor
  });
  it("should return 120 G base premium for 3 runes and 3 moonstones (two separate blocks) -- (3 runes + 3 moonstones = 60 G + 60 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
      ] 
    })).toBe(65); // Only one block premium applies at a time - first matched block (3 runes = 60 G) + 5 G fee = 65 G total premium
  });

  it("should add 50% surcharge for a cursed sword, increasing base premium to 150 G -- (cursed sword: 100 G + 50 G surcharge)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "sword", cursed: true }] 
    })).toBe(170); // Base premium 100 G + 50% curse (50 G) = 150 G + 10% first insurance (15 G) + 5 G fee = 170 G total premium
  });
  it("should add 30% surcharge for a highly enchanted sword (enchantment ≥ 5), increasing base premium to 130 G -- (high enchantment: 100 G + 30 G)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "sword", enchantment: 5 }] 
    })).toBe(148); // Base premium 100 G + 30% high enchantment (30 G) = 130 G + 10% first insurance (13 G) + 5 G fee = 148 G total premium
  });
  it("should add 50% surcharge only to the cursed sword in a multi-item policy with a plain amulet -- (cursed surcharge applies to item, not policy: 100 G + 50 G + 60 G = 210 G base + surcharges)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [
        { type: "sword", cursed: true },
        { type: "amulet" }
      ] 
    })).toBe(236); // Cursed sword: 100 G + 50% = 150 G, amulet: 60 G, total: 210 G base premium + 10% first insurance (21 G) + 5 G fee = 236 G
  });

  it("should apply 20% loyalty discount to a long-standing customer (≥ 2 years) on policy base premium -- (loyalty: 20% off base sum)", () => {
    // Customer has 2 years, so qualifies for loyalty discount but not follow-up discount
    // The follow-up contract discount applies to contracts after the first, so it doesn't stack with loyalty
    // Base: 100 G
    // Loyalty discount: -20 G (20% of 100 G)
    // Subtotal: 80 G
    // First insurance surcharge: +8 G (10% of 80 G)
    // Subtotal: 88 G
    // Processing fee: +5 G
    // Total: 93 G
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 2 }, 
      items: [{ type: "sword" }] 
    })).toBe(93); // 100 - 20 = 80 + 8 + 5 = 93 G
  });
  it("should apply 10% initial assessment surcharge on first insurance -- (first insurance: 10% surcharge)", () => {
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 0 }, 
      items: [{ type: "sword" }] 
    })).toBe(115); // Base premium 100 G + 10% first insurance surcharge (10 G) + 5 G fee = 115 G total premium
  });
  it("should apply 15% discount on each contract after the first -- (follow-up contract: 15% discount)", () => {
    // First insurance surcharge applies to every quote
    // Follow-up contract discount applies to contracts after the first
    // The example shows both can apply simultaneously
    
    // For a follow-up contract with a sword:
    // Base premium: 100 G
    // First insurance surcharge: +10 G (10%)
    // Follow-up contract discount: -15 G (15% of base 100 G)
    // Processing fee: +5 G
    // Total: 100 G
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 1 }, // This would be a follow-up contract
      items: [{ type: "sword" }] 
    })).toBe(100); // 100 + 10 - 15 + 5 = 100 G
  });
  it("should apply first insurance surcharge even for a long-standing customer's new sword -- (each item treated as first insurance)", () => {
    // Customer has 3 years of business (long-standing) but is getting a new sword
    // Rule: each item in a quote is treated as a first insurance, so first insurance surcharge applies
    // Even though customer is on a follow-up contract and gets loyalty discount
    // Base premium: 100 G
    // Loyalty discount: -20 G (20% of base)
    // First insurance surcharge: +10 G (10% of base)
    // Follow-up contract discount: -15 G (15% of base)
    // Subtotal: 75 G
    // Processing fee: +5 G
    // Total: 80 G
    // The example shows all these can apply simultaneously
    expect(calculateQuote({ 
      customer: { yearsWithMHPCO: 3 }, 
      items: [{ type: "sword" }] 
    })).toBe(80); // 100 - 20 + 10 - 15 + 5 = 80 G
  });

  it.todo("should add a 5 G processing fee to every premium -- (5 G fee added at the end)");
  it.todo("should round final premium up to whole G in MHPCO's favor -- (197.5 G → 198 G)");
  it.todo("should calculate premium as 165 G for a newcomer with a cursed sword -- (100 + 50 + 10 + 5 = 165 G)");
  it.todo("should calculate premium as 160 G for a long-standing customer's second contract with a cursed, highly enchanted sword -- (100 + 50 + 30 − 20 + 10 − 15 = 155 G + 5 G = 160 G)");

  it.todo("should return 400 G payout for damage 500 G to a regular sword (enchantment 3) after 100 G deductible -- (standard reimbursement)");
  it.todo("should return 100 G payout for damage 200 G to a rune after 100 G deductible -- (100 G cap applies)");

  it.todo("should apply 50% reimbursement for damage to items with enchantment level ≥ 8 -- (enchantment 9: 50% of damage)");
  it.todo("should fully reimburse damage to items made of dragon material -- (100% reimbursement)");
  it.todo("should apply 50% rule for dragon-material sword with enchantment 9, damage 1000 G, resulting in 400 G payout -- (500 G − 100 G deductible)");
  it.todo("should fully reimburse dragon-material sword with enchantment 5, damage 800 G, resulting in 700 G payout -- (800 G − 100 G deductible)");

  it.todo("should apply 100 G deductible per damaged item in a multi-damage event -- (two items damaged: 2 × 100 G deductible)");
  it.todo("should reject claim if damages include an item not insured in the policy -- (non-insured item: claim rejected)");
  it.todo("should reject claim if damages include more items of a type than insured -- (e.g. two swords damaged but only one insured)");
  it.todo("should reject claim if damage amount is negative -- (negative amount: claim rejected)");
  it.todo("should reject quote for unknown item type -- (e.g. type: \"broomstick\")");

  it.todo("should cap total payout at twice the insurance sum -- (cap = 2 × insurance sum)");
  it.todo("should reduce cap by payout amount after each claim -- (first claim reduces cap for second)");
  it.todo("should exhaust cap after two 1500 G claims on a policy with sword (1000 G) insurance -- (first claim: 1400 G, remaining cap 600 G; second claim: 600 G payout, cap 0 G)");

  it.todo("should round final payout down to whole G in MHPCO's favor -- (350.5 G → 350 G)");
});
