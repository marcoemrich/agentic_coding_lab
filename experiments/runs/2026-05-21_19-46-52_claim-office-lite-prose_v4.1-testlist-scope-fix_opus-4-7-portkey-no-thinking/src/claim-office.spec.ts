import { describe, it, expect } from "vitest";
import { quote, claim, type Item } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("QUOTE - base prices (first insurance, year 0, no other modifiers)", () => {
    // Base premium * 1.10 (first insurance) + 5 (fee), rounded up
    it("quotes an empty item list at just the processing fee — 5 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
    });
    it("quotes a plain sword at 115 G (100 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ]),
      ).toBe(115);
    });
    it("quotes a plain amulet at 71 G (60 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ]),
      ).toBe(71);
    });
    it("quotes a plain staff at 93 G (80 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "staff", material: "oak", enchantment: 0, cursed: false },
        ]),
      ).toBe(93);
    });
    it("quotes a plain potion at 49 G (40 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "potion", material: "glass", enchantment: 0, cursed: false },
        ]),
      ).toBe(49);
    });
    it("quotes a single rune at 33 G (25 * 1.10 = 27.5 → 28 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
        ]),
      ).toBe(33);
    });
    it("quotes a single moonstone at 33 G (25 * 1.10 = 27.5 → 28 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        ]),
      ).toBe(33);
    });
  });

  describe("QUOTE - component bundle special pricing", () => {
    it("quotes 3 alike runes at the bundle price 71 G (60 * 1.10 + 5), not 3 * 33", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
        ]),
      ).toBe(71);
    });
    it("quotes 3 alike moonstones at the bundle price 71 G (60 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
          { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
          { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        ]),
      ).toBe(71);
    });
  });

  describe("QUOTE - risk surcharges (single sword, first insurance, year 0)", () => {
    it("adds 50% surcharge for a cursed sword — 170 G (100 * 1.5 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
        ]),
      ).toBe(170);
    });
    it("adds 30% surcharge for a highly enchanted sword (enchantment 5) — 148 G (100 * 1.3 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 5, cursed: false },
        ]),
      ).toBe(148);
    });
    it("does not add the enchantment surcharge for enchantment 4 — 115 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 4, cursed: false },
        ]),
      ).toBe(115);
    });
    it("stacks both surcharges for a cursed highly enchanted sword — 220 G (100 * 1.5 * 1.3 * 1.10 = 214.5 → 215 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 5, cursed: true },
        ]),
      ).toBe(220);
    });
  });

  describe("QUOTE - customer discounts", () => {
    it("applies 20% loyalty discount for a customer with 2 years — 93 G (100 * 0.8 * 1.10 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 2 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ]),
      ).toBe(93);
    });
    it("does not apply loyalty discount for a customer with 1 year — 115 G", () => {
      expect(
        quote({ yearsWithMHPCO: 1 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ]),
      ).toBe(115);
    });
    it("applies 20% loyalty discount for a customer with 5 years — 93 G", () => {
      expect(
        quote({ yearsWithMHPCO: 5 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ]),
      ).toBe(93);
    });
  });

  describe("QUOTE - contract sequence discounts", () => {
    it("applies 10% first-insurance surcharge on the first quote — sword at 115 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ], 0),
      ).toBe(115);
    });
    it("applies 15% discount on the second quote in a scenario — sword at 90 G (100 * 0.85 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ], 1),
      ).toBe(90);
    });
    it("applies 15% discount on the third quote in a scenario — sword at 90 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ], 2),
      ).toBe(90);
    });
  });

  describe("QUOTE - rounding in MHPCO's favor", () => {
    it("rounds fractional premiums up to whole G (rune 27.5 → 28, then + 5 = 33 G)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
        ]),
      ).toBe(33);
    });
  });

  describe("QUOTE - multiple items in one quote", () => {
    it("sums premiums across mixed items with a single processing fee — sword + amulet at 181 G (110 + 66 + 5)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ]),
      ).toBe(181);
    });
  });

  describe("CLAIM - reimbursement rules", () => {
    it("pays 0 for damage to an item that is neither high-enchantment nor dragon material", () => {
      expect(
        claim(
          [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          { cause: "theft", damages: [{ itemType: "sword", amount: 300 }] },
        ),
      ).toBe(0);
    });
    it("pays 50% of damage minus 100 G deductible for an item with enchantment 8 — damage 400 → payout 100 G", () => {
      expect(
        claim(
          [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          { cause: "theft", damages: [{ itemType: "sword", amount: 400 }] },
        ),
      ).toBe(100);
    });
    it("does not apply 50% rule for enchantment 7 — payout 0", () => {
      expect(
        claim(
          [{ type: "sword", material: "steel", enchantment: 7, cursed: false }],
          { cause: "theft", damages: [{ itemType: "sword", amount: 400 }] },
        ),
      ).toBe(0);
    });
    it("pays full damage minus 100 G deductible for a dragon-material item — damage 500 → payout 400 G", () => {
      expect(
        claim(
          [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }],
          { cause: "theft", damages: [{ itemType: "sword", amount: 500 }] },
        ),
      ).toBe(400);
    });
    it("applies a single 100 G deductible per damage event, not per damaged item", () => {
      expect(
        claim(
          [
            { type: "sword", material: "dragon", enchantment: 0, cursed: false },
            { type: "amulet", material: "dragon", enchantment: 0, cursed: false },
          ],
          {
            cause: "theft",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "amulet", amount: 200 },
            ],
          },
        ),
      ).toBe(300);
    });
    it("sums reimbursements across multiple damaged items in one incident before subtracting the deductible", () => {
      // High-enchantment sword: 400 * 0.5 = 200
      // Dragon amulet: 300 (full)
      // Sum: 500, minus 100 deductible = 400
      expect(
        claim(
          [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
            { type: "amulet", material: "dragon", enchantment: 0, cursed: false },
          ],
          {
            cause: "theft",
            damages: [
              { itemType: "sword", amount: 400 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        ),
      ).toBe(400);
    });
    it("never returns a negative payout (small damage below the deductible yields 0)", () => {
      expect(
        claim(
          [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }],
          { cause: "theft", damages: [{ itemType: "sword", amount: 50 }] },
        ),
      ).toBe(0);
    });
  });

  describe("CLAIM - references the correct policy", () => {
    it("uses the items from the policy identified by the zero-based policy index when matching itemType", () => {
      // Policy 0: only sword items (no amulet)
      const policy0Items: Item[] = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ];
      // Policy 1: a dragon-material amulet
      const policy1Items: Item[] = [
        { type: "amulet", material: "dragon", enchantment: 0, cursed: false },
      ];
      // Claim referencing policy1's items: damage to amulet 200 → 200 (full, dragon) - 100 deductible = 100
      expect(
        claim(policy1Items, {
          cause: "theft",
          damages: [{ itemType: "amulet", amount: 200 }],
        }),
      ).toBe(100);
      // Sanity: same claim against policy0 (no amulet) → 0
      expect(
        claim(policy0Items, {
          cause: "theft",
          damages: [{ itemType: "amulet", amount: 200 }],
        }),
      ).toBe(0);
    });
  });
});
