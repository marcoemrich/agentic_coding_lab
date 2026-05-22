import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  const DEFAULT_CUSTOMER = { yearsWithMHPCO: 0, previousQuotes: 0 };

  describe("Quote: base premiums", () => {
    it("should return 5 G for an empty item list (processing fee only)", () => {
      const premium = quote([], DEFAULT_CUSTOMER);
      expect(premium).toBe(5);
    });
    it("should return 115 G for a single sword (100 base + 10 first-ins + 5 fee)", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(115);
    });
    it("should return 71 G for a single amulet (60 base + 6 first-ins + 5 fee)", () => {
      const premium = quote(
        [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(71);
    });
    it("should return 93 G for a single staff (80 base + 8 first-ins + 5 fee)", () => {
      const premium = quote(
        [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(93);
    });
    it("should return 49 G for a single potion (40 base + 4 first-ins + 5 fee)", () => {
      const premium = quote(
        [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(49);
    });
    it("should return 33 G for a single rune component (25 base + 2.5 first-ins + 5 fee, rounded up)", () => {
      const premium = quote(
        [{ type: "rune" }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(33);
    });
  });

  describe("Quote: component building block", () => {
    it("should return 60 G for 2 runes (50 base + 5 first-ins + 5 fee, no block)", () => {
      const premium = quote(
        [{ type: "rune" }, { type: "rune" }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(60);
    });
    it("should return 71 G for 3 runes (60 base + 6 first-ins + 5 fee, block applies for exactly 3 alike)", () => {
      const premium = quote(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(71);
    });
    it("should return 115 G for 4 runes (100 base + 10 first-ins + 5 fee, no block -- block requires exactly 3)", () => {
      const premium = quote(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(115);
    });
    it("should return 198 G for 7 runes (175 base + 17.5 first-ins + 5 fee = 197.5, rounded up)", () => {
      const premium = quote(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(198);
    });
  });

  describe("Quote: alike components means same type", () => {
    it("should return 88 G for 2 runes + 1 moonstone (75 base + 7.5 first-ins + 5 fee = 87.5, rounded up)", () => {
      const premium = quote(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(88);
    });
    it("should return 137 G for 3 runes + 3 moonstones (120 base + 12 first-ins + 5 fee, two separate blocks)", () => {
      const premium = quote(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(137);
    });
  });

  describe("Quote: item-specific modifiers", () => {
    it("should add 50% cursed surcharge to the cursed item's base premium only", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(165);
    });
    it("should add 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(145);
    });
    it("should not add high-enchantment surcharge for enchantment level 4", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(115);
    });
    it("should apply both cursed and high-enchantment surcharges when both conditions met (enchantment 5 + cursed)", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(195);
    });
  });

  describe("Quote: modifier scope on multi-item policies", () => {
    it("should apply cursed surcharge only to the cursed item -- cursed sword (100) + plain amulet (60) = 160 base + 50 curse + 16 first-ins + 5 fee = 231", () => {
      const premium = quote(
        [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(231);
    });
  });

  describe("Quote: policy-wide modifiers", () => {
    it("should apply 20% loyalty discount when customer has >= 2 years with MHPCO", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 2, previousQuotes: 0 },
      );
      // base premium = 100, loyalty discount = -20, first-ins = +10, fee = 5
      // total = 100 - 20 + 10 + 5 = 95
      expect(premium).toBe(95);
    });
    it("should apply loyalty discount when customer has exactly 2 years with MHPCO", () => {
      const premium = quote(
        [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 2, previousQuotes: 0 },
      );
      // base premium = 60, loyalty discount = -12, first-ins = +6, fee = 5
      // total = 60 - 12 + 6 + 5 = 59
      expect(premium).toBe(59);
    });
    it("should not apply loyalty discount when customer has < 2 years with MHPCO", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 1, previousQuotes: 0 },
      );
      // base premium = 100, no loyalty discount (1 < 2), first-ins = +10, fee = 5
      // total = 100 + 10 + 5 = 115
      expect(premium).toBe(115);
    });
    it("should apply 10% first insurance surcharge on the policy base premium", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        DEFAULT_CUSTOMER,
      );
      // base premium = 100, first insurance surcharge = +10% of 100 = +10, fee = 5
      // total = 100 + 10 + 5 = 115
      expect(premium).toBe(115);
    });
    it("should apply 15% follow-up contract discount on the customer's second quote in the scenario", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        { yearsWithMHPCO: 0, previousQuotes: 1 },
      );
      // base premium = 100, first-ins = +10, follow-up discount = -15, fee = 5
      // total = 100 + 10 - 15 + 5 = 100
      expect(premium).toBe(100);
    });
  });

  describe("Quote: rounding in MHPCO's favor", () => {
    it("should round premium UP when calculation yields a fractional amount (e.g. 197.5 -> 198 G)", () => {
      // 7 runes: 175 base + 17.5 first-ins + 5 fee = 197.5, rounded up = 198
      const premium = quote(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(198);
    });
  });

  describe("Quote: integration -- newcomer with cursed sword", () => {
    it("should return 165 G for newcomer (0 years, first contract) with cursed steel sword ench 3 (100 base + 50 curse + 10 first insurance = 160 + 5 fee)", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        DEFAULT_CUSTOMER,
      );
      expect(premium).toBe(165);
    });
  });

  describe("Quote: integration -- long-standing customer second contract", () => {
    it("should return 160 G for 3-year customer's second contract with cursed steel sword ench 7 (100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up = 155 + 5 fee)", () => {
      const premium = quote(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3, previousQuotes: 1 },
      );
      // base = 100, cursed = +50, high-ench = +30, loyalty = -20, first-ins = +10, follow-up = -15
      // = 155 + 5 fee = 160
      expect(premium).toBe(160);
    });
  });

  describe("Claim: standard reimbursement", () => {
    it("should return payout 400 G for regular steel sword (ench 3), damage 500 G (full reimbursement minus 100 deductible)", () => {
      const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
      const damages = [{ type: "sword", amount: 500 }];
      const result = claim(policy, damages);
      expect(result.payout).toBe(400);
    });
    it("should return payout 100 G for rune component, damage 200 G (full reimbursement minus 100 deductible; no special clause)", () => {
      const policy = [{ type: "rune" }];
      const damages = [{ type: "rune", amount: 200 }];
      const result = claim(policy, damages);
      expect(result.payout).toBe(100);
    });
  });

  describe("Claim: high enchantment reimbursement", () => {
    it("should reimburse at 50% for items with enchantment >= 8 -- steel sword ench 9, damage 1000 G -> payout 400 G (500 - 100)", () => {
      const policy = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
      const damages = [{ type: "sword", amount: 1000 }];
      const result = claim(policy, damages);
      expect(result.payout).toBe(400);
    });
    it("should reimburse at 50% for dragon-material sword with ench 8, damage 1000 G -> payout 400 G (500 - 100)", () => {
      const policy = [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }];
      const damages = [{ type: "sword", amount: 1000 }];
      const result = claim(policy, damages);
      expect(result.payout).toBe(400);
    });
  });

  describe("Claim: dragon material reimbursement", () => {
    it("should fully reimburse dragon-material items with ench < 8 -- dragon sword ench 5, damage 800 G -> payout 700 G (800 - 100)", () => {
      const policy = [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }];
      const damages = [{ type: "sword", amount: 800 }];
      const result = claim(policy, damages);
      expect(result.payout).toBe(700);
    });
  });

  describe("Claim: enchantment threshold vs. dragon material interaction", () => {
    it("should apply 50% rule when both dragon material and ench >= 8 -- dragon sword ench 9, damage 1000 G -> payout 400 G", () => {
      const policy = [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }];
      const damages = [{ type: "sword", amount: 1000 }];
      const result = claim(policy, damages);
      expect(result.payout).toBe(400);
    });
  });

  describe("Claim: deductible per damage event", () => {
    it("should apply 100 G deductible per damaged item -- sword (500 G) + amulet (300 G) -> payout 600 G ((500-100) + (300-100))", () => {
      const policy = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      const damages = [
        { type: "sword", amount: 500 },
        { type: "amulet", amount: 300 },
      ];
      const result = claim(policy, damages);
      expect(result.payout).toBe(600);
    });
  });

  describe("Claim: payout rounding", () => {
    it("should round payout DOWN when calculation yields a fractional amount (e.g. 350.5 -> 350 G)", () => {
      // Steel sword ench 9 -> 50% reimbursement; damage 901 G
      // reimbursement = 901 * 0.5 = 450.5, minus 100 deductible = 350.5
      // Round down -> 350
      const policy = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
      const damages = [{ type: "sword", amount: 901 }];
      const result = claim(policy, damages);
      expect(result.payout).toBe(350);
    });
  });

  describe("Claim: cap", () => {
    it("should set cap at 2x insurance sum -- sword (1000) + amulet (600) = insurance sum 1600, cap 3200 G", () => {
      const policy = [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      const damages = [{ type: "sword", amount: 500 }];
      const result = claim(policy, damages);
      // insurance sum = 1000 + 600 = 1600, cap = 3200
      // payout = 500 - 100 deductible = 400
      // remainingCap = 3200 - 400 = 2800
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(2800);
    });
    it.todo("should base cap on unmodified insurance value -- cursed sword (insurance 1000 G) -> cap 2000 G regardless of premium modifiers");
    it.todo("should not let component block discount affect insurance sum -- sword + 3 runes = insurance sum 1750 G (1000 + 3*250)");
    it.todo("should set cap at 4000 G for two swords (insurance sum 2000 G)");
  });

  describe("Claim: cap exhaustion across successive claims", () => {
    it.todo("should pay 1400 G on first claim of 1500 G damage (1500-100), remaining cap 600 G, then pay 600 G on second claim of 1500 G (capped), remaining cap 0 G");
  });

  describe("Claim: multiple items of the same type", () => {
    it.todo("should treat each damage entry for same-type items separately with its own deductible");
    it.todo("should reject claim with non-zero exit code when damages contain more entries of a type than the policy covers");
  });

  describe("Error handling", () => {
    it.todo("should reject quote with unknown item type (e.g. broomstick) -- non-zero exit, error to stderr");
    it.todo("should reject claim with damage entry for item not in the policy -- non-zero exit, error to stderr");
    it.todo("should reject claim with negative damage amount -- non-zero exit, error to stderr");
    it.todo("should reject claim with unknown item type in damage entry -- non-zero exit, error to stderr");
  });

  describe("CLI interface", () => {
    it.todo("should read JSON scenario from stdin and write JSON results to stdout");
    it.todo("should output correct schema: quote step produces {premium: N}, claim step produces {payout: N, remainingCap: N}");
    it.todo("should process multi-step scenario with quote followed by claim referencing it by step index");
    it.todo("should exit with non-zero status code and write error to stderr for invalid input");
  });
});
