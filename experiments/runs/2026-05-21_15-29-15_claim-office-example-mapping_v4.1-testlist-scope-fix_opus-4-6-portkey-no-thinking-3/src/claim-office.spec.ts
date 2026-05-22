import { describe, it, expect } from "vitest";
import { claimOffice } from "./claim-office.js";

describe("Claim Office", () => {
  // =========================================================================
  // QUOTE: Edge cases
  // =========================================================================

  describe("quote — edge cases", () => {
    it("should return premium 5 G for an empty item list — only the processing fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });

    it("should return an error for an unknown item type (e.g. broomstick)", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        })
      ).toThrow();
    });
  });

  // =========================================================================
  // QUOTE: Single-item base premiums
  // =========================================================================

  describe("quote — single item base premiums", () => {
    it("should return premium 115 G for a single sword — 100 G base + 10 G first insurance + 5 G fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });

    it("should return premium 71 G for a single amulet — 60 G base + 6 G first insurance + 5 G fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });

    it("should return premium 93 G for a single staff — 80 G base + 8 G first insurance + 5 G fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });

    it("should return premium 49 G for a single potion — 40 G base + 4 G first insurance + 5 G fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  // =========================================================================
  // QUOTE: Component base premiums
  // =========================================================================

  describe("quote — component base premiums", () => {
    it("should return premium 33 G for 1 rune — 25 G base + 2.5 G first insurance + 5 G fee, rounded up", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });

    it("should return premium 60 G for 2 runes — 50 G base + 5 G first insurance + 5 G fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });

    it("should return premium 71 G for 3 runes — 60 G block base + 6 G first insurance + 5 G fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });

    it("should return premium 115 G for 4 runes — 100 G base (no block) + 10 G first insurance + 5 G fee", () => {
      const result = claimOffice({
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });

    it("should return premium 198 G for 7 runes — 175 G base + 17.5 G first insurance + 5 G fee, rounded up", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
  });

  // =========================================================================
  // QUOTE: "Alike" components (different types do not form blocks)
  // =========================================================================

  describe("quote — alike components", () => {
    it("should return premium 88 G for 2 runes + 1 moonstone — 75 G base (no block, different types) + 7.5 G first insurance + 5 G fee, rounded up", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });

    it("should return premium 137 G for 3 runes + 3 moonstones — 120 G base (two separate blocks) + 12 G first insurance + 5 G fee", () => {
      const result = claimOffice({
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
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  // =========================================================================
  // QUOTE: Item-specific modifiers — cursed surcharge
  // =========================================================================

  describe("quote — cursed surcharge", () => {
    it("should return premium 165 G for a cursed sword — 100 G base + 50 G curse (50%) + 10 G first insurance + 5 G fee", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
  });

  // =========================================================================
  // QUOTE: Item-specific modifiers — high enchantment surcharge
  // =========================================================================

  describe("quote — high enchantment surcharge", () => {
    it("should apply high-enchantment surcharge for sword with enchantment exactly 5 — 100 + 30 + 10 first insurance + 5 fee = 145 G", () => {
      const result = claimOffice({
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
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });

    it("should not apply high-enchantment surcharge for sword with enchantment 4 — 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
      const result = claimOffice({
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  // =========================================================================
  // QUOTE: Modifier scope on multi-item policies
  // =========================================================================

  describe("quote — modifier scope on multi-item policies", () => {
    it("should apply cursed surcharge only to the cursed item — cursed sword + plain amulet: 100 + 50 (curse) + 60 + 16 first insurance (10% of 160 base) + 5 fee = 231 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  // =========================================================================
  // QUOTE: Policy-wide modifiers — loyalty discount
  // =========================================================================

  describe("quote — loyalty discount", () => {
    it("should apply loyalty discount for customer with exactly 2 years — 20% discount on policy base premium, with first insurance", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });

    it("should not apply loyalty discount for customer with less than 2 years", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  // =========================================================================
  // QUOTE: Policy-wide modifiers — first insurance surcharge
  // =========================================================================

  describe("quote — first insurance surcharge", () => {
    it("should apply 10% first insurance surcharge on the first quote — sword: 100 + 10 = 110 G + 5 G fee = 115 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });

    it("should apply first insurance surcharge even for long-standing customers — each item in a quote is treated as a first insurance regardless of history", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
  });

  // =========================================================================
  // QUOTE: Policy-wide modifiers — follow-up contract discount
  // =========================================================================

  describe("quote — follow-up contract discount", () => {
    it("should apply 15% follow-up discount on the second quote — applied to policy base premium", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
  });

  // =========================================================================
  // QUOTE: Rounding premiums in MHPCO's favor (up)
  // =========================================================================

  describe("quote — rounding", () => {
    it("should round premium up — a calculation yielding 197.5 G results in 198 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });

    it("should keep intermediate amounts as fractions and only round the final premium", () => {
      // Customer 2 years, second quote, 7 runes:
      // rawPolicyBase = 175
      // first insurance = 17.5, loyalty = -35, follow-up = -26.25
      // policyWideModifier = 17.5 - 35 - 26.25 = -43.75
      // total = 175 + (-43.75) + 5 = 136.25 → ceil = 137
      // If intermediates were rounded individually: 18 - 35 - 27 = -44 → 175 + (-44) + 5 = 136 (wrong!)
      const result = claimOffice({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 95 },
          { premium: 137 },
        ],
      });
    });
  });

  // =========================================================================
  // QUOTE: Integration examples
  // =========================================================================

  describe("quote — integration: newcomer with cursed sword", () => {
    it("should return premium 165 G — 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165 G (customer: 0 years, no previous contract, cursed steel sword ench 3)", () => {
      const result = claimOffice({
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
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
  });

  describe("quote — integration: long-standing customer second contract", () => {
    it("should return premium 160 G — 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160 G (customer: 3 years, second quote, cursed steel sword ench 7)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
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
      expect(result).toEqual({
        results: [
          { premium: 95 },
          { premium: 160 },
        ],
      });
    });
  });

  // =========================================================================
  // CLAIM: Standard reimbursement (no special clauses)
  // =========================================================================

  describe("claim — standard reimbursement", () => {
    it("should return payout 400 G for regular sword (steel, ench 3) with damage 500 G — full reimbursement minus 100 G deductible", () => {
      const result = claimOffice({
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
              cause: "accident",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });

    it("should return payout 100 G for rune with damage 200 G — full reimbursement minus 100 G deductible (no enchantment/material)", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
  });

  // =========================================================================
  // CLAIM: Deductible per damage event (multiple items in one claim)
  // =========================================================================

  describe("claim — deductible per damage event", () => {
    it("should return payout 600 G for dragon attack damaging sword (500 G) and amulet (300 G) — 100 G deductible per damaged item: (500-100) + (300-100) = 600 G", () => {
      const result = claimOffice({
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 181 },
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
  });

  // =========================================================================
  // CLAIM: Enchantment >= 8 (50% reimbursement)
  // =========================================================================

  describe("claim — high enchantment clause", () => {
    it("should return payout 400 G for steel sword ench 9, damage 1000 G — 50% of 1000 = 500, minus 100 deductible = 400 G", () => {
      const result = claimOffice({
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
              cause: "accident",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  // =========================================================================
  // CLAIM: Dragon material (full reimbursement)
  // =========================================================================

  describe("claim — dragon material clause", () => {
    it("should return payout 700 G for dragon-material sword ench 5, damage 800 G — full reimbursement minus 100 deductible: 800 - 100 = 700 G", () => {
      const result = claimOffice({
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
              cause: "accident",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    });
  });

  // =========================================================================
  // CLAIM: Both clauses apply — 50% wins, then deductible
  // =========================================================================

  describe("claim — enchantment vs dragon material interaction", () => {
    it("should return payout 400 G for dragon-material sword ench 9, damage 1000 G — both clauses: 50% wins (500), then deductible (500 - 100) = 400 G", () => {
      const result = claimOffice({
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
              cause: "accident",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });

    it("should return payout 400 G for dragon-material sword ench 8, damage 1000 G — both clauses: 50% wins (500), then deductible (500 - 100) = 400 G", () => {
      const result = claimOffice({
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
              cause: "accident",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  // =========================================================================
  // CLAIM: Multiple items of the same type
  // =========================================================================

  describe("claim — multiple items same type", () => {
    it("should compute insurance sum 2000 G and cap 4000 G for two swords", () => {
      const result = claimOffice({
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
              cause: "accident",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 225 },
          { payout: 400, remainingCap: 3600 },
        ],
      });
    });

    it("should apply separate deductibles when both swords are damaged in a dragon attack", () => {
      const result = claimOffice({
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 225 },
          { payout: 800, remainingCap: 3200 },
        ],
      });
    });

    it("should return an error when damages contain more entries of a type than the policy covers", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "accident",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
  });

  // =========================================================================
  // CLAIM: Cap exhaustion
  // =========================================================================

  describe("claim — cap exhaustion", () => {
    it("should compute insurance sum 1600 G and cap 3200 G for a sword + amulet policy", () => {
      const result = claimOffice({
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
              cause: "accident",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 181 },
          { payout: 100, remainingCap: 3100 },
        ],
      });
    });

    it("should compute cap 2000 G for a cursed sword — cap based on unmodified insurance value 1000 G, not premium", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 165 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });

    it("should compute insurance sum 1750 G for a sword + 3 runes block — block discount affects premium only, not insurance sum", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });
      // Insurance sum = 1000 (sword) + 3*250 (runes) = 1750
      // Cap = 2 * 1750 = 3500
      // Payout = 200 - 100 (deductible) = 100
      // remainingCap = 3500 - 100 = 3400
      // Premium: sword base 100 + rune block 60 = 160 raw base
      //   + first insurance 10% of 160 = 16
      //   + 5 fee = 181
      expect(result).toEqual({
        results: [
          { premium: 181 },
          { payout: 100, remainingCap: 3400 },
        ],
      });
    });

    it("should return payout 1400 G on first claim of 1500 G for a sword policy (cap 2000 G) — remaining cap 600 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
        ],
      });
    });

    it("should return payout 600 G on second claim of 1500 G after first claim exhausted 1400 G — remaining cap 0 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  // =========================================================================
  // CLAIM: Rounding payouts in MHPCO's favor (down)
  // =========================================================================

  describe("claim — rounding", () => {
    it("should round payout down — a calculation yielding 350.5 G results in 350 G", () => {
      const result = claimOffice({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 145 },
          { payout: 350, remainingCap: 1650 },
        ],
      });
    });
  });

  // =========================================================================
  // CLAIM: Edge cases
  // =========================================================================

  describe("claim — edge cases", () => {
    it("should return an error when claim references an item not in the policy", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "accident",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        })
      ).toThrow();
    });

    it("should return an error when claim contains a negative damage amount", () => {
      expect(() =>
        claimOffice({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "accident",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
  });
});
