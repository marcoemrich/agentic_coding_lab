import { describe, it, expect } from "vitest";
import { quote, claim, runScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("Quote - Base premiums", () => {
    it("should return 5G for an empty item list (only processing fee)", () => {
      const result = quote({ customer: { years: 0 }, items: [] }, { isFollowUp: false });
      expect(result).toEqual({ premium: 5 });
    });
    it("should return 115G for a single sword (100G base + 10G first insurance + 5G fee)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 115 });
    });
    it("should return 71G for a single amulet (60G base + 6G first insurance + 5G fee)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "amulet" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 71 });
    });
    it("should return 93G for a single staff (80G base + 8G first insurance + 5G fee)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "staff" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 93 });
    });
    it("should return 49G for a single potion (40G base + 4G first insurance + 5G fee)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "potion" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 49 });
    });
  });

  describe("Quote - Component pricing", () => {
    it("should return 2 runes as 50G base premium (2 x 25G)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "rune" }, { type: "rune" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 60 });
    });
    it("should return 3 runes as 60G base premium (block of 3 alike applies)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 71 });
    });
    it("should return 4 runes as 100G base premium (no block — block requires exactly 3)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 115 });
    });
    it("should return 7 runes as 175G base premium (7 x 25G, no block)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 198 });
    });
    it("should return 2 runes + 1 moonstone as 75G base premium (no block: different types)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 88 });
    });
    it("should return 3 runes + 3 moonstones as 120G base premium (two separate blocks: 60G + 60G)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 137 });
    });
  });

  describe("Quote - Item-level modifiers", () => {
    it("should add 50% curse surcharge to a cursed sword (100G + 50G = 150G before policy modifiers)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword", cursed: true }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 165 });
    });
    it("should add 30% high-enchantment surcharge for sword with enchantment 5 (100G + 30G = 130G before policy modifiers)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword", enchantment: 5 }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 145 });
    });
    it("should not add high-enchantment surcharge for sword with enchantment 4 (100G before policy modifiers)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword", enchantment: 4 }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 115 });
    });
    it("should add both cursed and high-enchantment surcharges for cursed sword ench 5 (100G + 50G + 30G = 180G before policy modifiers)", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword", cursed: true, enchantment: 5 }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 195 });
    });
    it("should apply cursed surcharge only to the cursed item: cursed sword + plain amulet = 210G before policy modifiers and fee", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 231 });
    });
  });

  describe("Quote - Policy-level modifiers", () => {
    it("should apply 20% loyalty discount for customer with >= 2 years", () => {
      const result = quote(
        { customer: { years: 2 }, items: [{ type: "sword" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 95 });
    });
    it("should apply loyalty discount for customer with exactly 2 years", () => {
      const result = quote(
        { customer: { years: 2 }, items: [{ type: "amulet" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 59 });
    });
    it("should not apply loyalty discount for customer with 1 year", () => {
      const result = quote(
        { customer: { years: 1 }, items: [{ type: "sword" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 115 });
    });
    it("should always apply 10% first insurance surcharge on every quote", () => {
      const result = quote(
        { customer: { years: 5 }, items: [{ type: "sword" }, { type: "amulet" }] },
        { isFollowUp: false }
      );
      // policyBase = 100 + 60 = 160; first insurance = +10% (16); loyalty = -20% (-32); 160+16-32=144; +5 fee = 149
      expect(result).toEqual({ premium: 149 });
    });
    it("should apply 15% follow-up contract discount on second quote in scenario", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword" }] },
        { isFollowUp: true }
      );
      // policyBase = 100; first insurance = +10% (10); follow-up = -15% (-15); 100+10-15=95; +5 fee = 100
      expect(result).toEqual({ premium: 100 });
    });
    it("should apply policy-level modifiers to the sum of base premiums only (before item-level surcharges)", () => {
      // Base premiums: sword 100G + amulet 60G = 160G (basePremiumSum)
      // Surcharges: cursed sword +50G = 50G
      // First insurance: +10% of 160 = +16G
      // Loyalty: -20% of 160 = -32G
      // Premium before fee: 160 + 50 + 16 - 32 = 194G
      // +5G fee = 199G
      const result = quote(
        { customer: { years: 3 }, items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 199 });
    });
  });

  describe("Quote - Rounding", () => {
    it("should round premium up (ceil) — a calculation yielding 197.5G becomes 198G", () => {
      // 7 runes: base = 7 x 25 = 175G; first insurance = +10% of 175 = 17.5G; premium = 192.5 + 5 fee = 197.5G; ceil = 198G
      const result = quote(
        { customer: { years: 0 }, items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 198 });
    });
    it("should keep intermediates as fractions and only round the final premium", () => {
      // Single rune (25G base), 3-year customer (loyalty), follow-up contract
      // policyBase = 25
      // first insurance = +10% of 25 = +2.5 -> premium = 27.5
      // loyalty = -20% of 25 = -5.0 -> premium = 22.5
      // follow-up = -15% of 25 = -3.75 -> premium = 18.75
      // + 5G fee = 23.75
      // ceil(23.75) = 24
      // If intermediates were rounded, result would differ (e.g. 25)
      const result = quote(
        { customer: { years: 3 }, items: [{ type: "rune" }] },
        { isFollowUp: true }
      );
      expect(result).toEqual({ premium: 24 });
    });
  });

  describe("Quote - Integration: Newcomer cursed sword", () => {
    it("should return 165G for newcomer (0 years) with cursed sword (steel, ench 3): 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165G", () => {
      const result = quote(
        { customer: { years: 0 }, items: [{ type: "sword", cursed: true, enchantment: 3 }] },
        { isFollowUp: false }
      );
      expect(result).toEqual({ premium: 165 });
    });
  });

  describe("Quote - Integration: Long-standing customer second contract", () => {
    it("should return 160G for 3-year customer on second quote with cursed sword (steel, ench 7): 100 base + 50 curse + 30 high ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160G", () => {
      const result = quote(
        { customer: { years: 3 }, items: [{ type: "sword", cursed: true, enchantment: 7 }] },
        { isFollowUp: true }
      );
      expect(result).toEqual({ premium: 160 });
    });
  });

  describe("Claim - Standard reimbursement", () => {
    it("should return payout 400G for regular sword (steel, ench 3) with 500G damage (full reimbursement minus 100G deductible)", () => {
      const policy = {
        customer: { years: 0 },
        items: [{ type: "sword", enchantment: 3, material: "steel" }],
      };
      const damages = [{ type: "sword", amount: 500 }];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should return payout 100G for rune with 200G damage (full reimbursement minus 100G deductible; no special clauses)", () => {
      const policy = {
        customer: { years: 0 },
        items: [{ type: "rune" }],
      };
      const damages = [{ type: "rune", amount: 200 }];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim - Deductible per damage event", () => {
    it("should apply 100G deductible per damaged item: sword 500G + amulet 300G = payout 600G (400 + 200)", () => {
      const policy = {
        customer: { years: 0 },
        items: [{ type: "sword", enchantment: 3, material: "steel" }, { type: "amulet" }],
      };
      const damages = [
        { type: "sword", amount: 500 },
        { type: "amulet", amount: 300 },
      ];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim - Enchantment and dragon material clauses", () => {
    it("should return payout 400G for dragon-material sword ench 9, damage 1000G (both clauses: 50% wins, 500 - 100 deductible)", () => {
      const policy = {
        customer: { years: 0 },
        items: [{ type: "sword", enchantment: 9, material: "dragon" }],
      };
      const damages = [{ type: "sword", amount: 1000 }];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should return payout 700G for dragon-material sword ench 5, damage 800G (only dragon clause: 800 - 100 deductible)", () => {
      const policy = {
        customer: { years: 0 },
        items: [{ type: "sword", enchantment: 5, material: "dragon" }],
      };
      const damages = [{ type: "sword", amount: 800 }];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should return payout 400G for steel sword ench 9, damage 1000G (only high-ench clause: 50% = 500, minus 100 deductible)", () => {
      const policy = {
        customer: { years: 0 },
        items: [{ type: "sword", enchantment: 9, material: "steel" }],
      };
      const damages = [{ type: "sword", amount: 1000 }];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should return payout 400G for dragon-material sword ench 8, damage 1000G (threshold at 8: both clauses, 50% wins, 500 - 100)", () => {
      const policy = {
        customer: { years: 0 },
        items: [{ type: "sword", enchantment: 8, material: "dragon" }],
      };
      const damages = [{ type: "sword", amount: 1000 }];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim - Payout rounding", () => {
    it("should round payout down (floor) — a calculation yielding 350.5G becomes 350G", () => {
      // Steel sword ench 9 (high enchantment clause: 50% reimbursement), damage 901G
      // reimbursement = 901 * 0.5 = 450.5G
      // payout = 450.5 - 100 deductible = 350.5G
      // floor(350.5) = 350G
      const policy = {
        customer: { years: 0 },
        items: [{ type: "sword", enchantment: 9, material: "steel" }],
      };
      const damages = [{ type: "sword", amount: 901 }];
      const result = claim(policy, damages);
      expect(result).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("Claim - Cap and insurance sum", () => {
    it.todo("should compute insurance sum 2000G and cap 4000G for 2 swords");
    it.todo("should compute insurance sum 1600G and cap 3200G for sword + amulet");
    it.todo("should base cap on unmodified insurance value — cursed sword cap = 2000G");
    it.todo("should compute insurance sum 1750G for sword + 3 runes (block discount affects premium only, not insurance sum)");
    it.todo("should exhaust cap across two claims: first claim 1500G damage -> payout 1400G (remaining 600G), second claim 1500G damage -> payout 600G (remaining 0G)");
  });

  describe("Claim - Multiple items of same type", () => {
    it.todo("should treat 2 sword damage entries each with own deductible when policy covers 2 swords");
    it.todo("should reject with error when damages contain more entries of a type than the policy covers (2 sword damages, 1 sword insured)");
  });

  describe("Error handling", () => {
    it.todo("should exit with non-zero status and stderr error for unknown item type in quote (e.g. 'broomstick')");
    it.todo("should exit with non-zero status and stderr error when claim references item not in policy");
    it.todo("should exit with non-zero status and stderr error for negative damage amount");
  });

  describe("CLI interface", () => {
    it.todo("should read JSON scenario from stdin and write JSON results to stdout");
    it.todo("should output quote result with premium as integer");
    it.todo("should output claim result with payout and remainingCap as integers");
    it.todo("should exit with non-zero code and write error to stderr for invalid input, with no results on stdout");
  });
});
