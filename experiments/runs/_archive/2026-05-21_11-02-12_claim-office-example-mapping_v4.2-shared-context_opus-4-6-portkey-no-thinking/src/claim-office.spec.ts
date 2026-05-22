import { describe, it, expect } from "vitest";
import { calculatePremium, calculatePayout } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Item values and base premiums", () => {
    it("should return 100 G base premium for a single sword", () => {
      expect(calculatePremium([{ type: "sword" }])).toBe(115);
    });
    it("should return 60 G base premium for a single amulet", () => {
      expect(calculatePremium([{ type: "amulet" }])).toBe(71);
    });
    it("should return 80 G base premium for a single staff", () => {
      expect(calculatePremium([{ type: "staff" }])).toBe(93);
    });
    it("should return 40 G base premium for a single potion", () => {
      expect(calculatePremium([{ type: "potion" }])).toBe(49);
    });
    it("should return 25 G base premium for a single rune component", () => {
      expect(calculatePremium([{ type: "rune" }])).toBe(33);
    });
  });

  describe("Component block discount", () => {
    it("should return 50 G base premium for 2 runes (no block)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("should return 60 G base premium for 3 runes (block discount applies)", () => {
      expect(calculatePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("should return 100 G base premium for 4 runes (no block -- block requires exactly 3)", () => {
      expect(
        calculatePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ])
      ).toBe(115);
    });
    it("should return 175 G base premium for 7 runes (no blocks possible)", () => {
      expect(
        calculatePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ])
      ).toBe(198);
    });
    it("should return 75 G base premium for 2 runes + 1 moonstone (no block -- different types)", () => {
      expect(
        calculatePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ])
      ).toBe(88);
    });
    it("should return 120 G base premium for 3 runes + 3 moonstones (two separate blocks)", () => {
      expect(
        calculatePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ])
      ).toBe(137);
    });
  });

  describe("Item-specific premium modifiers", () => {
    it("should add 50% cursed surcharge to the cursed item base premium only -- cursed sword (100) + plain amulet (60) = 210 G before policy modifiers and fee", () => {
      expect(
        calculatePremium([
          { type: "sword", cursed: true },
          { type: "amulet" },
        ])
      ).toBe(231);
    });
    it("should add 30% high-enchantment surcharge for item with enchantment >= 5", () => {
      expect(
        calculatePremium([{ type: "sword", enchantment: 5 }])
      ).toBe(145);
    });
    it("should not add high-enchantment surcharge for item with enchantment 4", () => {
      expect(
        calculatePremium([{ type: "sword", enchantment: 4 }])
      ).toBe(115);
    });
    it("should stack cursed and high-enchantment surcharges on the same item -- sword enchantment 5 cursed: 100 + 50 + 30 = 180 G item premium", () => {
      expect(
        calculatePremium([{ type: "sword", enchantment: 5, cursed: true }])
      ).toBe(195);
    });
  });

  describe("Policy-wide premium modifiers", () => {
    it("should apply 20% loyalty discount for customer with yearsWithMHPCO >= 2", () => {
      expect(
        calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 3 })
      ).toBe(93);
    });
    it("should apply loyalty discount for customer with exactly 2 years", () => {
      expect(
        calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 2 })
      ).toBe(93);
    });
    it("should not apply loyalty discount for customer with 1 year", () => {
      expect(
        calculatePremium([{ type: "sword" }], { yearsWithMHPCO: 1 })
      ).toBe(115);
    });
    it("should add 10% first insurance surcharge on policy base premium (always applies per item in quote)", () => {
      expect(
        calculatePremium([{ type: "sword" }])
      ).toBe(115);
    });
    it("should apply 15% follow-up discount on second and subsequent quotes in a scenario", () => {
      expect(
        calculatePremium([{ type: "sword" }], undefined, { isFollowUp: true })
      ).toBe(99);
    });
    it("should add 5 G processing fee at the very end of premium calculation", () => {
      expect(
        calculatePremium([{ type: "sword" }])
      ).toBe(115);
    });
  });

  describe("Empty and edge-case quotes", () => {
    it("should return 5 G premium for empty item list (processing fee only)", () => {
      expect(calculatePremium([])).toBe(5);
    });
  });

  describe("Modifier application order", () => {
    it("should apply item-specific modifiers to item base premium, then policy-wide modifiers to sum, then fee last", () => {
      // Cursed sword (100 base + 50 curse surcharge) + plain amulet (60 base)
      // Policy base premium (for policy-wide modifiers): 160
      // Loyalty -20%: 160 * 0.8 = 128
      // First insurance +10%: 128 * 1.1 = 140.8
      // Add item surcharges: 140.8 + 50 = 190.8
      // Fee +5: 195.8
      // Ceil: 196
      expect(
        calculatePremium(
          [{ type: "sword", cursed: true }, { type: "amulet" }],
          { yearsWithMHPCO: 3 }
        )
      ).toBe(196);
    });
  });

  describe("Rounding in MHPCO favor", () => {
    it("should round premium UP (ceil) -- a calculation yielding 197.5 G becomes 198 G", () => {
      // 7 runes: 175 base * 1.1 first insurance + 5 fee = 192.5 + 5 = 197.5 before rounding
      // Ceil(197.5) = 198
      expect(
        calculatePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ])
      ).toBe(198);
    });
    it("should round payout DOWN (floor) -- a calculation yielding 350.5 G becomes 350 G", () => {
      // Steel sword with enchantment 9: 50% reimbursement rule (R8)
      // Damage 901 G: 50% of 901 = 450.5, minus 100 deductible = 350.5
      // Floor(350.5) = 350
      const policy = {
        items: [{ type: "sword" as const, enchantment: 9 }],
      };
      const damages = [{ itemType: "sword" as const, amount: 901 }];
      expect(calculatePayout(policy, damages)).toBe(350);
    });
    it("should keep intermediates as fractions and round only the final result", () => {
      // Staff (80 base), loyalty customer (3 years), follow-up contract
      // Policy premium: 80
      // Loyalty -20%: 80 * 0.8 = 64
      // First insurance +10%: 64 * 1.1 = 70.4
      // Follow-up -15%: 70.4 * 0.85 = 59.84
      // Fee: 59.84 + 5 = 64.84
      // Ceil(64.84) = 65
      // If intermediates were rounded: 64 -> 71 -> 61 -> 66 (WRONG)
      expect(
        calculatePremium(
          [{ type: "staff" }],
          { yearsWithMHPCO: 3 },
          { isFollowUp: true }
        )
      ).toBe(65);
    });
  });

  describe("Integration: newcomer with cursed sword", () => {
    it("should compute 165 G premium for newcomer (0 years, first contract) with cursed sword (steel, enchantment 3) -- 100 base + 50 curse + 10 first insurance + 5 fee", () => {
      // Newcomer: 0 years, no previous contract
      // Cursed sword (steel, enchantment 3): 100 base + 50 curse surcharge
      // First insurance +10% on base premium = +10
      // Processing fee = +5
      // Total: 100 + 50 + 10 + 5 = 165
      expect(
        calculatePremium(
          [{ type: "sword", cursed: true, enchantment: 3 }],
          { yearsWithMHPCO: 0 }
        )
      ).toBe(165);
    });
  });

  describe("Integration: long-standing customer second contract", () => {
    it("should compute 160 G premium for 3-year customer on second quote with cursed sword (steel, enchantment 7) -- 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160 G", () => {
      // Customer: 3 years (loyalty discount), second quote (follow-up discount)
      // Cursed sword (steel, enchantment 7): 100 base
      // Policy base premium: 100
      // Loyalty -20%: 100 * 0.8 = 80
      // First insurance +10%: 80 * 1.1 = 88
      // Follow-up -15%: 88 * 0.85 = 74.8
      // Item surcharges: 50 (curse) + 30 (enchantment 7 >= 5) = 80
      // Subtotal: 74.8 + 80 = 154.8
      // Fee: 154.8 + 5 = 159.8
      // Ceil(159.8) = 160
      expect(
        calculatePremium(
          [{ type: "sword", cursed: true, enchantment: 7 }],
          { yearsWithMHPCO: 3 },
          { isFollowUp: true }
        )
      ).toBe(160);
    });
  });

  describe("Claim: deductible", () => {
    it("should apply 100 G deductible per damaged item -- sword 500 G + amulet 300 G = 600 G payout", () => {
      // Per E5: dragon attack damages sword (500 G) and amulet (300 G)
      // Standard reimbursement (steel, low enchantment): full damage minus deductible per item
      // Payout = (500 - 100) + (300 - 100) = 400 + 200 = 600
      const policy = {
        items: [
          { type: "sword" as const, enchantment: 3 },
          { type: "amulet" as const, enchantment: 2 },
        ],
      };
      const damages = [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "amulet" as const, amount: 300 },
      ];
      expect(calculatePayout(policy, damages)).toBe(600);
    });
  });

  describe("Claim: standard reimbursement (no special clauses)", () => {
    it.todo("should return 400 G payout for regular sword (steel, enchantment 3) with 500 G damage -- full reimbursement minus 100 G deductible");
    it.todo("should return 100 G payout for rune with 200 G damage -- full reimbursement minus 100 G deductible, no special clauses for components");
  });

  describe("Claim: high-enchantment reimbursement", () => {
    it.todo("should reimburse at 50% for item with enchantment >= 8 then apply deductible -- steel sword enchantment 9, 1000 G damage = 400 G payout");
  });

  describe("Claim: dragon material reimbursement", () => {
    it.todo("should fully reimburse dragon-material item then apply deductible -- dragon sword enchantment 5, 800 G damage = 700 G payout");
  });

  describe("Claim: enchantment >= 8 AND dragon material", () => {
    it.todo("should apply 50% rule when both dragon material and enchantment >= 8 -- dragon sword enchantment 9, 1000 G damage = 400 G payout");
    it.todo("should return 400 G payout for dragon-material sword with exactly enchantment 8, 1000 G damage -- 50% then deductible");
  });

  describe("Claim: cap", () => {
    it.todo("should cap total payout at 2x insurance sum");
    it.todo("should compute insurance sum as 1600 G for sword + amulet, cap 3200 G");
    it.todo("should base cap on unmodified insurance value not premium -- cursed sword 1000 G value -> cap 2000 G");
    it.todo("should compute insurance sum 1750 G for sword + 3 runes block -- block discount affects premium only, not insurance sum");
    it.todo("should track cap across successive claims -- first claim 1400 G payout (cap remaining 600 G), second claim clamped to 600 G (cap remaining 0 G)");
  });

  describe("Claim: multiple items of the same type", () => {
    it.todo("should compute insurance sum 2000 G and cap 4000 G for two swords");
    it.todo("should treat each damage entry for same-type items separately with its own deductible");
    it.todo("should reject claim when damages array has more entries of a type than policy covers -- CLI exits non-zero");
  });

  describe("Error handling", () => {
    it.todo("should exit non-zero and write to stderr for unknown item type in quote (e.g. broomstick)");
    it.todo("should exit non-zero and write to stderr for claim referencing item not in policy");
    it.todo("should exit non-zero and write to stderr for negative damage amount");
    it.todo("should not write results to stdout on error");
  });

  describe("CLI input/output format", () => {
    it.todo("should read JSON scenario from stdin and write JSON results to stdout");
    it.todo("should output quote result with premium field as integer");
    it.todo("should output claim result with payout and remainingCap fields as integers");
    it.todo("should process sequential steps where a claim references an earlier quote by step index");
  });
});
