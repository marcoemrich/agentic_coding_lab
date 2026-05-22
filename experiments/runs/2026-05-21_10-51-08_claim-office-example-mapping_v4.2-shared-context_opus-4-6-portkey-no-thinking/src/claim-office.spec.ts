import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ===================================================================
  // QUOTE -- Base premiums and item values
  // ===================================================================

  describe("quote -- base premiums", () => {
    it("empty item list => premium 5 G (processing fee only)", () => {
      const result = quote({
        items: [],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(5);
    });

    it("single sword (0 years, first quote) => premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(115);
    });

    it("single amulet (0 years, first quote) => premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "amulet" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(71);
    });

    it("single staff (0 years, first quote) => premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "staff" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(93);
    });

    it("single potion (0 years, first quote) => premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
      const result = quote({
        items: [{ type: "potion" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(49);
    });

    it("single rune (0 years, first quote) => premium 33 G (25 base + 2.5 first-insurance rounded up to 28 + 5 fee)", () => {
      const result = quote({
        items: [{ type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(33);
    });
  });

  // ===================================================================
  // QUOTE -- Component building blocks
  // ===================================================================

  describe("quote -- component building blocks", () => {
    it("2 runes => 50 G base premium (no block)", () => {
      const result = quote({
        items: [{ type: "rune" }, { type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // base: 2 * 25 = 50, first-ins: 50 * 0.1 = 5, fee: 5 => total 60
      expect(result.premium).toBe(60);
    });

    it("3 runes => 60 G base premium (block of 3 alike applies)", () => {
      const result = quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // base: 60 (block discount for exactly 3 alike), first-ins: 60 * 0.1 = 6, fee: 5 => total 71
      expect(result.premium).toBe(71);
    });

    it("4 runes => 100 G base premium (no block; block requires exactly 3)", () => {
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
      // base: 4 * 25 = 100 (no block; 4 != 3), first-ins: 100 * 0.1 = 10, fee: 5 => total 115
      expect(result.premium).toBe(115);
    });

    it("7 runes => 175 G base premium (no blocks possible)", () => {
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
      // base: 7 * 25 = 175 (no block; 7 != 3), first-ins: 175 * 0.1 = 17.5, fee: 5 => ceil(197.5) = 198
      expect(result.premium).toBe(198);
    });

    it("2 runes + 1 moonstone => 75 G base premium (no block; different types are not alike)", () => {
      const result = quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // base: 2*25 + 1*25 = 75 (no block; different types), first-ins: 75 * 0.1 = 7.5, fee: 5 => ceil(87.5) = 88
      expect(result.premium).toBe(88);
    });

    it("3 runes + 3 moonstones => 120 G base premium (two separate blocks of alike components)", () => {
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
      // base: 60 (rune block) + 60 (moonstone block) = 120, first-ins: 120 * 0.1 = 12, fee: 5 => total 137
      expect(result.premium).toBe(137);
    });
  });

  // ===================================================================
  // QUOTE -- Item-specific premium modifiers
  // ===================================================================

  describe("quote -- item-specific modifiers", () => {
    it("cursed sword (0 years, first quote) => premium 165 G (100 base + 50 curse + 10 first-ins + 5 fee)", () => {
      const result = quote({
        items: [{ type: "sword", cursed: true }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(165);
    });

    it("sword with enchantment 5 (0 years, first quote) => premium 145 G (100 base + 30 high-ench + 10 first-ins + 5 fee)", () => {
      const result = quote({
        items: [{ type: "sword", enchantment: 5 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(145);
    });

    it("sword with enchantment 4 (0 years, first quote) => premium 115 G (no high-enchantment surcharge)", () => {
      const result = quote({
        items: [{ type: "sword", enchantment: 4 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(115);
    });

    it("cursed sword with enchantment 5 (0 years, first quote) => premium 195 G (100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee)", () => {
      const result = quote({
        items: [{ type: "sword", cursed: true, enchantment: 5 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(195);
    });
  });

  // ===================================================================
  // QUOTE -- Multi-item modifier scope
  // ===================================================================

  describe("quote -- multi-item modifier scope", () => {
    it("cursed sword + plain amulet (0 years, first quote) => 231 G (160 policy base + 50 curse on sword + 16 first-ins on 160 + 5 fee; curse does not affect amulet)", () => {
      const result = quote({
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      // base: 100 (sword) + 60 (amulet) = 160
      // curse surcharge: 100 * 0.5 = 50 (item-specific, only on sword)
      // first-ins: 160 * 0.1 = 16 (policy-wide, on base total)
      // fee: 5
      // total: 160 + 50 + 16 + 5 = 231
      expect(result.premium).toBe(231);
    });
  });

  // ===================================================================
  // QUOTE -- Policy-wide modifiers
  // ===================================================================

  describe("quote -- policy-wide modifiers", () => {
    it("long-standing customer (exactly 2 years), plain sword, first quote => premium 95 G (100 - 20 loyalty + 10 first-ins + 5 fee)", () => {
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 2 },
        isFollowUp: false,
      });
      // base: 100, loyalty: -20% of 100 = -20, first-ins: +10% of 100 = +10, fee: +5
      // total: 100 - 20 + 10 + 5 = 95
      expect(result.premium).toBe(95);
    });

    it("customer with 1 year, plain sword, first quote => premium 115 G (no loyalty discount)", () => {
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 1 },
        isFollowUp: false,
      });
      // base: 100, no loyalty (1 < 2), first-ins: +10% of 100 = +10, fee: +5
      // total: 100 + 10 + 5 = 115
      expect(result.premium).toBe(115);
    });

    it("second quote in scenario (0 years), plain sword => premium 100 G (100 + 10 first-ins - 15 follow-up + 5 fee)", () => {
      const result = quote({
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: true,
      });
      // base: 100, first-ins: +10% of 100 = +10, follow-up: -15% of 100 = -15, fee: +5
      // total: 100 + 10 - 15 + 5 = 100
      expect(result.premium).toBe(100);
    });

    it("first-insurance surcharge always applies to every item regardless of customer history (per spec Q3)", () => {
      // Even a veteran 5-year customer gets the first-insurance surcharge
      const result = quote({
        items: [{ type: "sword" }, { type: "amulet" }],
        customer: { yearsWithMHPCO: 5 },
        isFollowUp: false,
      });
      // base: 100 + 60 = 160
      // first-insurance: 160 * 0.1 = 16 (always applied, per Q3)
      // loyalty: 160 * 0.2 = 32 (yearsWithMHPCO >= 2)
      // fee: 5
      // total: 160 + 16 - 32 + 5 = 149
      expect(result.premium).toBe(149);
    });
  });

  // ===================================================================
  // QUOTE -- Integration examples
  // ===================================================================

  describe("quote -- integration", () => {
    it("newcomer with cursed sword => 165 G (100 base + 50 curse + 10 first-ins = 160 + 5 fee)", () => {
      // E12: Customer 0 years, no previous contract, cursed steel sword ench 3
      const result = quote({
        items: [{ type: "sword", cursed: true, enchantment: 3 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      });
      expect(result.premium).toBe(165);
    });

    it("long-standing customer second contract: cursed ench-7 sword => 160 G (100 + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up = 155 + 5 fee)", () => {
      // E13: Customer 3 years, 2nd quote, cursed sword ench 7
      const result = quote({
        items: [{ type: "sword", cursed: true, enchantment: 7 }],
        customer: { yearsWithMHPCO: 3 },
        isFollowUp: true,
      });
      // base: 100
      // item surcharges: 50 (curse) + 30 (high-ench) = 80
      // policy-wide: -20 (loyalty) + 10 (first-ins) - 15 (follow-up) = -25
      // total before fee: 100 + 80 - 25 = 155
      // + 5 fee = 160
      expect(result.premium).toBe(160);
    });
  });

  // ===================================================================
  // QUOTE -- Rounding
  // ===================================================================

  describe("quote -- rounding", () => {
    it("premium calculation yielding 197.5 G => final premium 198 G (rounded up in MHPCO favor)", () => {
      // E11: 7 runes => base 175, first-ins 17.5, fee 5 => raw 197.5, ceil => 198
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
      expect(result.premium).toBe(198);
    });
  });

  // ===================================================================
  // CLAIM -- Standard reimbursement
  // ===================================================================

  describe("claim -- standard reimbursement", () => {
    it("regular steel sword ench 3, damage 500 G => payout 400 G (full reimbursement minus 100 G deductible)", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 3 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 500 }],
      });
      // E6: standard reimbursement (no special clause), damage 500 - 100 deductible = 400
      // Insurance sum: 1000 (sword), cap: 2000, remainingCap: 2000 - 400 = 1600
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });

    it("rune, damage 200 G => payout 100 G (full reimbursement minus 100 G deductible; no special clause)", () => {
      const policy = {
        items: [{ type: "rune" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "rune", amount: 200 }],
      });
      // E6: rune is a component with 250 G insurance value, standard reimbursement
      // damage 200 - 100 deductible = 100 payout
      // Insurance sum: 250, cap: 500, remainingCap: 500 - 100 = 400
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(400);
    });
  });

  // ===================================================================
  // CLAIM -- Enchantment and dragon material clauses
  // ===================================================================

  describe("claim -- enchantment and dragon material clauses", () => {
    it("dragon-material sword ench 9, damage 1000 G => payout 400 G (both clauses: 50% wins, 500 - 100 deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 1000 }],
      });
      // E7: Both dragon material and high enchantment (>=8) apply
      // R5: When both apply, 50% wins (enchantment clause takes precedence)
      // Reimbursement: 1000 * 0.5 = 500, minus 100 deductible = 400
      // Insurance sum: 1000 (sword), cap: 2000, remainingCap: 2000 - 400 = 1600
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });

    it("dragon-material sword ench 5, damage 800 G => payout 700 G (dragon clause only: full, 800 - 100)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 800 }],
      });
      // E7: Dragon material with ench 5 (below claim threshold of 8)
      // Only dragon clause applies: fully reimbursed
      // Payout: 800 - 100 deductible = 700
      // Insurance sum: 1000 (sword), cap: 2000, remainingCap: 2000 - 700 = 1300
      expect(result.payout).toBe(700);
      expect(result.remainingCap).toBe(1300);
    });

    it("steel sword ench 9, damage 1000 G => payout 400 G (enchantment clause only: 50%, 500 - 100)", () => {
      const policy = {
        items: [{ type: "sword", enchantment: 9 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 1000 }],
      });
      // E7: Steel sword (no dragon material) with enchantment 9 (>= 8)
      // Only enchantment clause applies: 50% reimbursement
      // Reimbursement: 1000 * 0.5 = 500, minus 100 deductible = 400
      // Insurance sum: 1000 (sword), cap: 2000, remainingCap: 2000 - 400 = 1600
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });

    it("dragon-material sword ench exactly 8, damage 1000 G => payout 400 G (high-ench clause: 50%, 500 - 100)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 1000 }],
      });
      // E8: Dragon-material sword with enchantment exactly at threshold (8)
      // High-enchantment clause applies (ench >= 8): 50% * 1000 = 500, minus 100 deductible = 400
      // Insurance sum: 1000 (sword), cap: 2000, remainingCap: 2000 - 400 = 1600
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
  });

  // ===================================================================
  // CLAIM -- Deductible
  // ===================================================================

  describe("claim -- deductible", () => {
    it("deductible per damage event: sword 500 G + amulet 300 G => total payout 600 G (100 G deductible per item)", () => {
      const policy = {
        items: [{ type: "sword" }, { type: "amulet" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [
          { type: "sword", amount: 500 },
          { type: "amulet", amount: 300 },
        ],
      });
      // E5: Dragon attack damages sword (500 G) and amulet (300 G)
      // Payout = (500-100) + (300-100) = 600 G (100 G deductible per item)
      // Insurance sum: 1000 (sword) + 600 (amulet) = 1600, cap: 3200, remainingCap: 3200 - 600 = 2600
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(2600);
    });
  });

  // ===================================================================
  // CLAIM -- Multiple items of the same type
  // ===================================================================

  describe("claim -- multiple items of same type", () => {
    it("two swords insured => insurance sum 2000 G, cap 4000 G", () => {
      const policy = {
        items: [{ type: "sword" }, { type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 500 }],
      });
      // E9: Two swords insured => insurance sum = 2 * 1000 = 2000 G, cap = 2 * 2000 = 4000 G
      // Single damage: 500 - 100 deductible = 400 payout
      // remainingCap: 4000 - 400 = 3600
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(3600);
    });

    it("two sword damages both get their own deductible", () => {
      const policy = {
        items: [{ type: "sword" }, { type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [
          { type: "sword", amount: 500 },
          { type: "sword", amount: 500 },
        ],
      });
      // E9: Two swords insured, two sword damages in same event
      // Each damage gets its own 100 G deductible
      // Payout = (500-100) + (500-100) = 800 G
      // Insurance sum: 2 * 1000 = 2000 G, cap: 4000 G, remainingCap: 4000 - 800 = 3200 G
      expect(result.payout).toBe(800);
      expect(result.remainingCap).toBe(3200);
    });
  });

  // ===================================================================
  // CLAIM -- Cap and cap exhaustion
  // ===================================================================

  describe("claim -- cap", () => {
    it("sword + amulet => insurance sum 1600 G, cap 3200 G (2x insurance sum)", () => {
      const policy = {
        items: [{ type: "sword" }, { type: "amulet" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 200 }],
      });
      // E10: sword (1000) + amulet (600) = 1600 insurance sum, cap = 2 * 1600 = 3200
      // damage 200 - 100 deductible = 100 payout
      // remainingCap: 3200 - 100 = 3100
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(3100);
    });

    it("cursed sword: cap based on unmodified insurance value (1000 G => cap 2000 G, not affected by premium modifiers)", () => {
      const policy = {
        items: [{ type: "sword", cursed: true }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 200 }],
      });
      // E10: Cursed sword insurance value = 1000 G (unmodified by premium modifiers)
      // Cap = 2 * 1000 = 2000 G (curse only affects premium, not insurance sum)
      // Payout: 200 - 100 deductible = 100
      // remainingCap: 2000 - 100 = 1900
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1900);
    });

    it("sword + 3 runes block => insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
      const policy = {
        items: [
          { type: "sword" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 200 }],
      });
      // E10: sword (1000) + 3 runes (3 * 250 = 750) = 1750 insurance sum
      // Block discount only affects premium (60 G instead of 75 G), NOT insurance sum
      // Cap = 2 * 1750 = 3500
      // Payout: 200 - 100 deductible = 100
      // remainingCap: 3500 - 100 = 3400
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(3400);
    });

    it("cap exhaustion first claim: damage 1500 G => payout 1400 G, remaining cap 600 G", () => {
      const policy = {
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 1500 }],
      });
      // E10: Sword insured (insurance sum 1000 G, cap 2000 G)
      // Claim 1: damage 1500 G, payout = 1500 - 100 deductible = 1400 G
      // remainingCap = 2000 - 1400 = 600 G
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    });

    it("cap exhaustion second claim: damage 1500 G => payout 600 G (capped to remaining), remaining cap 0 G", () => {
      const policy = {
        items: [{ type: "sword" }],
        customer: { yearsWithMHPCO: 0 },
        isFollowUp: false,
      };
      // E10: Sword insured (insurance sum 1000 G, cap 2000 G)
      // First claim consumed 1400 G (damage 1500 - 100 deductible), remaining cap = 600 G
      // Second claim: damage 1500 G, desired payout = 1500 - 100 = 1400 G
      // But capped to remaining 600 G => actual payout = 600 G, remaining cap = 0 G
      const result = claim(policy, {
        damages: [{ type: "sword", amount: 1500 }],
      }, { previousPayouts: 1400 });
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    });
  });

  // ===================================================================
  // CLAIM -- Rounding
  // ===================================================================

  describe("claim -- rounding", () => {
    it.todo(
      "payout calculation yielding 350.5 G => final payout 350 G (rounded down in MHPCO favor)"
    );
  });

  // ===================================================================
  // Error handling
  // ===================================================================

  describe("error handling", () => {
    it.todo(
      "unknown item type in quote (e.g. broomstick) => error"
    );

    it.todo(
      "claim damage for item not in policy => error"
    );

    it.todo(
      "claim damage for unknown item type => error"
    );

    it.todo(
      "negative damage amount => error"
    );

    it.todo(
      "more damage entries of a type than insured items => error"
    );
  });

  // ===================================================================
  // CLI integration
  // ===================================================================

  describe("CLI integration", () => {
    it.todo(
      "CLI reads JSON from stdin and writes JSON with results array to stdout"
    );

    it.todo(
      "CLI quote step produces result with premium as integer"
    );

    it.todo(
      "CLI claim step produces result with payout and remainingCap as integers"
    );

    it.todo(
      "CLI multi-step scenario: quote then claim against that policy via step index"
    );

    it.todo(
      "CLI error: exits with non-zero status code, writes error to stderr, no results on stdout"
    );
  });
});
