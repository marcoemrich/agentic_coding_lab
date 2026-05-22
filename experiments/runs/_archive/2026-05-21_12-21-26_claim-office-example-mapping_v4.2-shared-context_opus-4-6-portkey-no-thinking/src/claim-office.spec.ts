import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ---------------------------------------------------------------
  // Quote: empty and single-item base premiums (R1, R2, R8, R20)
  // ---------------------------------------------------------------

  describe("quote -- base premiums", () => {
    it("should return 5 G for an empty item list (processing fee only)", () => {
      const result = quote({ items: [], customer: { yearsWithMHPCO: 0 }, isFollowUp: false });
      expect(result).toBe(5);
    });

    it("should return 115 G for a single sword (100 base + 10 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(115);
    });

    it("should return 71 G for a single amulet (60 base + 6 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "amulet" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(71);
    });

    it("should return 93 G for a single staff (80 base + 8 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "staff" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(93);
    });

    it("should return 49 G for a single potion (40 base + 4 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "potion" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(49);
    });

    it("should return 33 G for a single rune component (25 base + 2.5 first-ins -> ceil(27.5) + 5 fee = 33)", () => {
      const result = quote({
        items: [{ type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(33);
    });
  });

  // ---------------------------------------------------------------
  // Quote: component blocks (R2, E1, E2, Q1)
  // ---------------------------------------------------------------

  describe("quote -- component blocks", () => {
    it("should return 50 G base premium for 2 runes (2 * 25, no block)", () => {
      const result = quote({
        items: [{ type: "rune" }, { type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(60); // 50 base + 5 first-ins + 5 fee
    });

    it("should return 60 G base premium for 3 runes (block of 3 alike applies)", () => {
      const result = quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(71); // 60 base (block) + 6 first-ins + 5 fee = 71
    });

    it("should return 100 G base premium for 4 runes (no block, 4 * 25)", () => {
      const result = quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(115); // 100 base + 10 first-ins + 5 fee
    });

    it("should return 175 G base premium for 7 runes (no block, 7 * 25)", () => {
      const result = quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(198); // 175 base + 17.5 first-ins = 192.5, ceil(192.5 + 5) = 198
    });

    it("should return 75 G base premium for 2 runes + 1 moonstone (no block, different types)", () => {
      const result = quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(88); // 75 base + 7.5 first-ins = 82.5, ceil(82.5 + 5) = 88
    });

    it("should return 120 G base premium for 3 runes + 3 moonstones (two separate blocks)", () => {
      const result = quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(137); // 120 base (2 blocks of 60) + 12 first-ins + 5 fee = 137
    });
  });

  // ---------------------------------------------------------------
  // Quote: item-specific modifiers (R3, R4)
  // ---------------------------------------------------------------

  describe("quote -- cursed surcharge", () => {
    it("should add 50% surcharge to a cursed sword's base premium (100 + 50 = 150 item premium)", () => {
      const result = quote({
        items: [{ type: "sword", cursed: true }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(165); // 100 base + 50 curse + 10 first-ins + 5 fee = 165
    });

    it("should apply cursed surcharge only to the cursed item, not the whole policy -- cursed sword (100+50) + plain amulet (60) = 210 before policy modifiers and fee", () => {
      const result = quote({
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // policyBase = 100 + 60 = 160
      // itemSurcharges = 50 (50% of sword's 100 only)
      // firstInsurance = 160 * 0.1 = 16
      // total = 160 + 50 + 16 + 5 fee = 231
      expect(result).toBe(231);
    });
  });

  describe("quote -- high-enchantment surcharge", () => {
    it("should add 30% surcharge for sword with enchantment exactly 5 (100 + 30 = 130 item premium)", () => {
      const result = quote({
        items: [{ type: "sword", enchantment: 5 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // policyBase = 100, itemSurcharges = 30 (30% of 100), firstIns = 10, fee = 5
      // total = 100 + 30 + 10 + 5 = 145
      expect(result).toBe(145);
    });

    it("should NOT add high-enchantment surcharge for sword with enchantment 4", () => {
      const result = quote({
        items: [{ type: "sword", enchantment: 4 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // policyBase = 100, itemSurcharges = 0 (ench 4 < 5), firstIns = 10, fee = 5
      // total = 100 + 0 + 10 + 5 = 115
      expect(result).toBe(115);
    });

    it("should apply both cursed (50%) and high-enchantment (30%) surcharges when both conditions met on same item", () => {
      const result = quote({
        items: [{ type: "sword", cursed: true, enchantment: 5 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // policyBase = 100
      // itemSurcharges = 50 (cursed: 50% of 100) + 30 (high-ench: 30% of 100) = 80
      // firstInsurance = 100 * 0.1 = 10
      // total = 100 + 80 + 10 + 5 fee = 195
      expect(result).toBe(195);
    });
  });

  // ---------------------------------------------------------------
  // Quote: policy-wide modifiers (R5, R6, R7)
  // ---------------------------------------------------------------

  describe("quote -- loyalty discount", () => {
    it("should apply 20% loyalty discount for customer with exactly 2 years with MHPCO", () => {
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 2 },
        isFollowUp: false,
      });
      // policyBase = 100
      // loyaltyDiscount = 100 * 0.2 = 20
      // firstInsurance = 100 * 0.1 = 10
      // policyPremium = 100 + 0 - 20 + 10 = 90
      // total = ceil(90 + 5) = 95
      expect(result).toBe(95);
    });

    it("should NOT apply loyalty discount for customer with 1 year with MHPCO", () => {
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 1 },
        isFollowUp: false,
      });
      // policyBase = 100
      // loyaltyDiscount = 0 (1 year < 2 year threshold)
      // firstInsurance = 100 * 0.1 = 10
      // policyPremium = 100 + 0 - 0 + 10 = 110
      // total = ceil(110 + 5) = 115
      expect(result).toBe(115);
    });
  });

  describe("quote -- first-insurance surcharge", () => {
    it("should apply 10% first-insurance surcharge to policy base premium", () => {
      // Sword: policyBase = 100, firstInsurance = 100 * 0.1 = 10
      // total = 100 + 10 + 5 fee = 115
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(115);
    });

    it("should apply first-insurance surcharge even for long-standing customer (per item, not per customer)", () => {
      // Long-standing customer (3 years) with a single sword
      // First-insurance surcharge always applies regardless of customer history (R6, Q4)
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 3 },
        isFollowUp: false,
      });
      // policyBase = 100
      // loyaltyDiscount = 100 * 0.2 = 20 (customer >= 2 years)
      // firstInsurance = 100 * 0.1 = 10 (always applied, per item not per customer)
      // policyPremium = 100 + 0 - 20 + 10 = 90
      // total = ceil(90 + 5) = 95
      expect(result).toBe(95);
    });
  });

  describe("quote -- follow-up contract discount", () => {
    it("should NOT apply follow-up discount on the customer's first quote", () => {
      // First quote (isFollowUp: false) for a newcomer with a single sword
      // No follow-up discount should be applied
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // policyBase = 100
      // itemSurcharges = 0
      // loyaltyDiscount = 0 (0 years < 2 threshold)
      // firstInsurance = 100 * 0.1 = 10
      // followUpDiscount = 0 (first quote, not a follow-up)
      // policyPremium = 100 + 0 - 0 + 10 - 0 = 110
      // total = ceil(110 + 5) = 115
      expect(result).toBe(115);
    });

    it("should apply 15% follow-up discount on the customer's second quote step", () => {
      // Second quote (isFollowUp: true) for a newcomer with a single sword
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: true,
      });
      // policyBase = 100
      // itemSurcharges = 0
      // loyaltyDiscount = 0 (0 years < 2 threshold)
      // firstInsurance = 100 * 0.1 = 10
      // followUpDiscount = 100 * 0.15 = 15
      // policyPremium = 100 + 0 - 0 + 10 - 15 = 95
      // total = ceil(95 + 5) = 100
      expect(result).toBe(100);
    });
  });

  // ---------------------------------------------------------------
  // Quote: processing fee (R8)
  // ---------------------------------------------------------------

  describe("quote -- processing fee", () => {
    it("should add 5 G processing fee at the very end of every premium calculation", () => {
      // Sword + amulet for a newcomer, no follow-up
      // policyBase = 100 + 60 = 160
      // itemSurcharges = 0
      // firstInsurance = 160 * 0.1 = 16
      // policyPremium = 160 + 0 + 16 - 0 = 176
      // total = ceil(176 + 5) = 181
      // Fee is flat 5 G, not scaled to number of items or policy size
      const result = quote({
        items: [{ type: "sword" }, { type: "amulet" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(181);
    });
  });

  // ---------------------------------------------------------------
  // Quote: rounding (R10, E10)
  // ---------------------------------------------------------------

  describe("quote -- rounding", () => {
    it("should round premium UP (ceil) in MHPCO's favor -- e.g. 197.5 -> 198 G", () => {
      // 7 runes: policyBase = 175, firstIns = 17.5, policyPremium = 192.5
      // 192.5 + 5 fee = 197.5 -> ceil(197.5) = 198
      const result = quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(198);
    });
  });

  // ---------------------------------------------------------------
  // Quote: integration examples (E12, E13)
  // ---------------------------------------------------------------

  describe("quote -- integration", () => {
    it("newcomer with cursed sword (steel, ench 3): 100 base + 50 curse + 10 first-ins = 160 + 5 fee = 165 G", () => {
      // E12: Customer 0 years, no previous contract, cursed sword (steel, ench 3)
      // policyBase = 100 (sword)
      // itemSurcharges = 50 (cursed: 50% of 100; no high-ench since ench 3 < 5)
      // loyaltyDiscount = 0 (0 years < 2 threshold)
      // firstInsurance = 100 * 0.1 = 10
      // followUpDiscount = 0 (first quote)
      // policyPremium = 100 + 50 + 10 - 0 = 160
      // total = ceil(160 + 5) = 165
      const result = quote({
        items: [{ type: "sword", cursed: true, enchantment: 3 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result).toBe(165);
    });

    it("long-standing customer second contract, cursed sword (steel, ench 7): 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up = 155 + 5 fee = 160 G", () => {
      // E13: Customer 3 years (long-standing), this is second quote (follow-up)
      // Item: cursed sword (steel, ench 7)
      // policyBase = 100 (sword)
      // itemSurcharges = 50 (cursed: 50% of 100) + 30 (high-ench: 30% of 100, ench 7 >= 5) = 80
      // loyaltyDiscount = 100 * 0.2 = 20 (3 years >= 2 threshold)
      // firstInsurance = 100 * 0.1 = 10 (always applies, per R6/Q4)
      // followUpDiscount = 100 * 0.15 = 15 (second contract)
      // policyPremium = 100 + 80 + 10 - (20 + 15) = 155
      // total = ceil(155 + 5) = 160
      const result = quote({
        items: [{ type: "sword", cursed: true, enchantment: 7 }],
        customer: { yearsWithMHPCO: 3 },
        isFollowUp: true,
      });
      expect(result).toBe(160);
    });
  });

  // ---------------------------------------------------------------
  // Claim: standard reimbursement (R11, E6)
  // ---------------------------------------------------------------

  describe("claim -- standard reimbursement", () => {
    it("should return payout 400 G for regular steel sword (ench 3), damage 500 G (500 - 100 deductible)", () => {
      const result = claim({
        policyItems: [{ type: "sword", enchantment: 3 }],
        damages: [{ type: "sword", amount: 500 }],
      });
      // R11: 100 G deductible per damage event
      // No special clauses: ench 3 < 8, not dragon material
      // payout = 500 - 100 = 400
      expect(result.payout).toBe(400);
    });

    it("should return payout 100 G for rune component, damage 200 G (200 - 100 deductible, no special clause)", () => {
      const result = claim({
        policyItems: [{ type: "rune" }],
        damages: [{ type: "rune", amount: 200 }],
      });
      // R11: 100 G deductible per damage event
      // Components have no enchantment or material -- no special clauses
      // payout = 200 - 100 = 100
      expect(result.payout).toBe(100);
    });
  });

  // ---------------------------------------------------------------
  // Claim: deductible per damage event (R11, E5)
  // ---------------------------------------------------------------

  describe("claim -- deductible per damage event", () => {
    it("should apply 100 G deductible per damaged item -- sword 500 + amulet 300 = (400 + 200) = 600 G payout", () => {
      const result = claim({
        policyItems: [{ type: "sword" }, { type: "amulet" }],
        damages: [
          { type: "sword", amount: 500 },
          { type: "amulet", amount: 300 },
        ],
      });
      // R11: 100 G deductible per damage event (per damaged item)
      // sword: 500 - 100 = 400
      // amulet: 300 - 100 = 200
      // total payout = 400 + 200 = 600
      expect(result.payout).toBe(600);
    });
  });

  // ---------------------------------------------------------------
  // Claim: high-enchantment clause (R13, E7)
  // ---------------------------------------------------------------

  describe("claim -- high-enchantment clause", () => {
    it("should reimburse at 50% for steel sword ench 9, damage 1000 -> payout 400 G (500 - 100)", () => {
      const result = claim({
        policyItems: [{ type: "sword", enchantment: 9 }],
        damages: [{ type: "sword", amount: 1000 }],
      });
      // R13: enchantment >= 8 -> reimburse at 50% of damage amount
      // 50% of 1000 = 500, then subtract 100 deductible = 400
      expect(result.payout).toBe(400);
    });
  });

  // ---------------------------------------------------------------
  // Claim: dragon-material clause (R14, E7)
  // ---------------------------------------------------------------

  describe("claim -- dragon-material clause", () => {
    it("should fully reimburse dragon-material sword ench 5, damage 800 -> payout 700 G (800 - 100)", () => {
      const result = claim({
        policyItems: [{ type: "sword", enchantment: 5, material: "dragon" }],
        damages: [{ type: "sword", amount: 800 }],
      });
      // R14: dragon material -> fully reimbursed (before deductible)
      // ench 5 < 8, so R13 high-enchantment clause does NOT apply
      // payout = 800 - 100 deductible = 700
      expect(result.payout).toBe(700);
    });
  });

  // ---------------------------------------------------------------
  // Claim: high-enchantment + dragon-material interaction (R15, E4, E7)
  // ---------------------------------------------------------------

  describe("claim -- enchantment vs dragon material interaction", () => {
    it("should apply 50% rule when dragon-material AND ench >= 8: dragon sword ench 9, damage 1000 -> payout 400 G (500 - 100)", () => {
      const result = claim({
        policyItems: [{ type: "sword", enchantment: 9, material: "dragon" }],
        damages: [{ type: "sword", amount: 1000 }],
      });
      // R15: When both dragon-material (R14) and high-enchantment >= 8 (R13) apply,
      // the 50% rule wins. 50% of 1000 = 500, then subtract 100 deductible = 400
      expect(result.payout).toBe(400);
    });

    it("should apply 50% for dragon-material sword ench exactly 8, damage 1000 -> payout 400 G", () => {
      const result = claim({
        policyItems: [{ type: "sword", enchantment: 8, material: "dragon" }],
        damages: [{ type: "sword", amount: 1000 }],
      });
      // R15: dragon material + enchantment >= 8 -> 50% rule wins
      // 50% of 1000 = 500, then subtract 100 deductible = 400
      expect(result.payout).toBe(400);
    });
  });

  // ---------------------------------------------------------------
  // Claim: payout rounding (R10, E10)
  // ---------------------------------------------------------------

  describe("claim -- payout rounding", () => {
    it("should round payout DOWN (floor) in MHPCO's favor -- e.g. 350.5 -> 350 G", () => {
      const result = claim({
        policyItems: [{ type: "sword", enchantment: 9 }],
        damages: [{ type: "sword", amount: 901 }],
      });
      // R10: Payouts round DOWN (floor) in MHPCO's favor
      // R13: enchantment >= 8 -> reimburse at 50% of damage amount
      // 50% of 901 = 450.5, then subtract 100 deductible = 350.5
      // floor(350.5) = 350
      expect(result.payout).toBe(350);
    });
  });

  // ---------------------------------------------------------------
  // Claim: multiple items of the same type (R16, E8)
  // ---------------------------------------------------------------

  describe("claim -- multiple items of same type", () => {
    it("should compute insurance sum 2000 G and cap 4000 G for two insured swords", () => {
      const result = claim({
        policyItems: [
          { type: "sword", enchantment: 3 },
          { type: "sword", enchantment: 3 },
        ],
        damages: [{ type: "sword", amount: 500 }],
      });
      // R12: insurance sum = 2 * 1000 = 2000 G, cap = 2 * 2000 = 4000 G
      // R11: payout = 500 - 100 deductible = 400 G
      // remainingCap = 4000 - 400 = 3600 G
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(3600);
    });

    it("should apply separate deductibles when both swords are damaged in one event", () => {
      const result = claim({
        policyItems: [
          { type: "sword", enchantment: 3 },
          { type: "sword", enchantment: 3 },
        ],
        damages: [
          { type: "sword", amount: 500 },
          { type: "sword", amount: 500 },
        ],
      });
      // R16, E8: Each damaged sword gets its own 100 G deductible
      // sword 1: 500 - 100 = 400
      // sword 2: 500 - 100 = 400
      // total payout = 400 + 400 = 800
      // insurance sum = 2 * 1000 = 2000, cap = 4000, remainingCap = 4000 - 800 = 3200
      expect(result.payout).toBe(800);
      expect(result.remainingCap).toBe(3200);
    });

    it("should reject claim when damages array has more entries of a type than the policy covers", () => {
      // R16, R18, E8: Policy covers 1 sword, but damages has 2 sword entries -> rejection
      expect(() =>
        claim({
          policyItems: [{ type: "sword", enchantment: 3 }],
          damages: [
            { type: "sword", amount: 500 },
            { type: "sword", amount: 500 },
          ],
        })
      ).toThrow();
    });
  });

  // ---------------------------------------------------------------
  // Claim: cap (R12, E9)
  // ---------------------------------------------------------------

  describe("claim -- cap", () => {
    it.todo(
      "should compute cap as 2x insurance sum -- sword + amulet = 1600 sum, 3200 cap"
    );

    it.todo(
      "should base cap on unmodified insurance value -- cursed sword still has cap 2000"
    );

    it.todo(
      "should not let component block discount affect insurance sum -- sword + 3 runes = 1750 sum"
    );

    it.todo(
      "should exhaust cap across claims -- sword (sum 1000, cap 2000): first claim 1500 -> payout 1400 remaining 600; second claim 1500 -> payout 600 remaining 0"
    );
  });

  // ---------------------------------------------------------------
  // Error handling (R17, R18, R19, E11)
  // ---------------------------------------------------------------

  describe("error handling", () => {
    it.todo(
      "should reject quote with unknown item type (e.g. broomstick)"
    );

    it.todo(
      "should reject claim referencing a damage to an item not in the policy"
    );

    it.todo(
      "should reject claim with negative damage amount"
    );
  });

  // ---------------------------------------------------------------
  // CLI integration (CLI spec)
  // ---------------------------------------------------------------

  describe("CLI", () => {
    it.todo(
      "should read JSON from stdin and write JSON results to stdout"
    );

    it.todo(
      "should exit with non-zero status code and write error to stderr for unknown item type"
    );

    it.todo(
      "should exit with non-zero status code and write error to stderr for invalid claim"
    );

    it.todo(
      "should process sequential steps where a claim references an earlier quote by step index"
    );

    it.todo(
      "should return results array with same length and order as input steps"
    );

    it.todo(
      "should return premium field for quote results and payout + remainingCap for claim results"
    );
  });
});
