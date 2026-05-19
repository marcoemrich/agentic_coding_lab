import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - base premiums", () => {
    it("returns 5G processing fee for empty item list", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [], false);
      expect(result).toBe(5);
    });
    it("returns base premium plus fee for a single sword (100 + 5 = 105)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        false
      );
      expect(result).toBe(115);
    });
    it("returns base premium plus fee for a single amulet (60 + 5 = 65)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        false
      );
      expect(result).toBe(71);
    });
    it("returns base premium plus fee for a single staff (80 + 5 = 85)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
        false
      );
      expect(result).toBe(93);
    });
    it("returns base premium plus fee for a single potion (40 + 5 = 45)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        false
      );
      expect(result).toBe(49);
    });
    it("sums base premiums for multiple items plus fee", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
        false
      );
      expect(result).toBe(181);
    });
  });

  describe("quote - component premiums", () => {
    it("returns 25G base premium per component (e.g. 2 runes = 50)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
        ],
        false
      );
      expect(result).toBe(60);
    });
    it("applies block discount for exactly 3 alike components (3 runes = 60)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
        ],
        false
      );
      expect(result).toBe(73);
    });
    it("does not apply block for 4 alike components (4 runes = 100)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
        ],
        false
      );
      expect(result).toBe(115);
    });
    it("does not apply block for 3 components of different types (2 runes + 1 moonstone = 75)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
        ],
        false
      );
      expect(result).toBe(88);
    });
    it("applies separate blocks for 3 runes and 3 moonstones (120)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "rune", material: "stone", enchantment: 0, cursed: false },
          { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
        ],
        false
      );
      expect(result).toBe(140);
    });
  });

  describe("quote - item-level modifiers", () => {
    it("adds 50% cursed surcharge to the cursed item's base premium only", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
        false
      );
      // sword base 100 + curse 50 + amulet base 60 = 210 + 16 first-ins (10% of 160) + 5 fee = 231
      expect(result).toBe(231);
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        false
      );
      expect(result).toBe(145);
    });
    it("applies both cursed and high-enchantment surcharges to the same item", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        false
      );
      // 100 base + 50 curse + 30 enchantment + 10 first-ins + 5 fee = 195
      expect(result).toBe(195);
    });
    it("does not apply high-enchantment surcharge for enchantment level 4", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        false
      );
      expect(result).toBe(115);
    });
  });

  describe("quote - policy-level modifiers", () => {
    it("applies 10% first-insurance surcharge on the policy base premium", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        false
      );
      // 100 base + 10 first-insurance (10% of 100) + 5 fee = 115
      expect(result).toBe(115);
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const result = quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        false
      );
      // 100 base + 10 first-ins - 20 loyalty + 5 fee = 95
      expect(result).toBe(95);
    });
    it("applies 15% follow-up discount on second quote", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        true
      );
      // 100 base + 10 first-ins - 15 follow-up + 5 fee = 100
      expect(result).toBe(100);
    });
    it("applies first-insurance surcharge even for long-standing customers", () => {
      const result = quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        true
      );
      // 100 base + 10 first-ins - 20 loyalty - 15 follow-up + 5 fee = 80
      expect(result).toBe(80);
    });
  });

  describe("quote - rounding", () => {
    it("rounds premium up in MHPCO's favor (ceiling)", () => {
      const result = quote(
        { yearsWithMHPCO: 2 },
        [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
        false
      );
      // 25 item + 2.5 first-ins - 5 loyalty + 5 fee = 27.5 → ceil = 28
      expect(result).toBe(28);
    });
  });

  describe("quote - integration", () => {
    it("newcomer with cursed sword: 165G", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        false
      );
      // 100 base + 50 curse + 10 first-ins + 5 fee = 165
      expect(result).toBe(165);
    });
    it("long-standing customer second contract with cursed high-enchantment sword: 160G", () => {
      const result = quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        true
      );
      // 100 base + 50 curse + 30 enchantment = 180 item premium
      // policy base = 100: +10 first-ins - 20 loyalty - 15 follow-up + 5 fee = 160
      expect(result).toBe(160);
    });
  });

  describe("claim - basic payout", () => {
    it("applies 100G deductible per damaged item", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      };
      const result = claim(policy, [{ itemType: "sword", amount: 500 }]);
      // 500 damage - 100 deductible = 400 payout
      expect(result.payout).toBe(400);
    });
    it("fully reimburses dragon-material item damage minus deductible", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      };
      const result = claim(policy, [{ itemType: "sword", amount: 800 }]);
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      expect(result.payout).toBe(700);
    });
    it("reimburses at 50% for enchantment >= 8 then applies deductible", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      };
      const result = claim(policy, [{ itemType: "sword", amount: 1000 }]);
      // 50% of 1000 = 500, then deductible: 500 - 100 = 400
      expect(result.payout).toBe(400);
    });
    it("applies 50% rule when both dragon material and enchantment >= 8", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      };
      const result = claim(policy, [{ itemType: "sword", amount: 1000 }]);
      // both clauses apply; 50% wins: 1000 * 0.5 = 500, then deductible: 500 - 100 = 400
      expect(result.payout).toBe(400);
    });
    it("does not apply enchantment clause for enchantment < 8", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      };
      const result = claim(policy, [{ itemType: "sword", amount: 800 }]);
      // enchantment 5 < 8: full reimbursement, then deductible: 800 - 100 = 700
      expect(result.payout).toBe(700);
    });
  });

  describe("claim - cap", () => {
    it("caps total payout at twice the insurance sum", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      };
      // insurance sum = 1000, cap = 2000
      // damage 2500 - 100 deductible = 2400, capped to 2000
      const result = claim(policy, [{ itemType: "sword", amount: 2500 }]);
      expect(result.payout).toBe(2000);
      expect(result.remainingCap).toBe(0);
    });
    it("tracks remaining cap across successive claims on same policy", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      };
      // insurance sum = 1000, cap = 2000
      // first claim: 1500 - 100 = 1400, remaining cap = 600
      const first = claim(policy, [{ itemType: "sword", amount: 1500 }]);
      expect(first.payout).toBe(1400);
      expect(first.remainingCap).toBe(600);
      // second claim: 1500 - 100 = 1400, but capped to remaining 600
      const second = claim(policy, [{ itemType: "sword", amount: 1500 }], first.remainingCap);
      expect(second.payout).toBe(600);
      expect(second.remainingCap).toBe(0);
    });
  });

  describe("claim - multiple items", () => {
    it("applies deductible separately per damaged item in same event", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      };
      const result = claim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ]);
      // (500 - 100) + (300 - 100) = 600
      expect(result.payout).toBe(600);
    });
    it("handles damage to component (rune) with deductible", () => {
      const policy = {
        items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
      };
      const result = claim(policy, [{ itemType: "rune", amount: 200 }]);
      // 200 - 100 deductible = 100
      expect(result.payout).toBe(100);
    });
  });

  describe("claim - rounding", () => {
    it("rounds payout down in MHPCO's favor (floor)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      };
      const result = claim(policy, [{ itemType: "sword", amount: 701 }]);
      // 701 * 0.5 = 350.5, then deductible: 350.5 - 100 = 250.5 → floor = 250
      expect(result.payout).toBe(250);
    });
  });

  describe("error handling", () => {
    it("rejects unknown item type in quote", () => {
      expect(() =>
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
          false
        )
      ).toThrow();
    });
    it("rejects claim for item not in policy", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      };
      expect(() =>
        claim(policy, [{ itemType: "amulet", amount: 300 }])
      ).toThrow();
    });
    it("rejects claim with more damage entries than insured items of that type", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      };
      // two sword damages but only one sword insured
      expect(() =>
        claim(policy, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ])
      ).toThrow();
    });
    it("rejects negative damage amount", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      };
      expect(() =>
        claim(policy, [{ itemType: "sword", amount: -200 }])
      ).toThrow();
    });
  });

  describe("CLI integration", () => {
    it("reads scenario JSON from stdin and writes results JSON to stdout", async () => {
      const { execSync } = await import("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
      });
      const result = JSON.parse(output);
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("processes sequential quote and claim steps referencing policy by index", async () => {
      const { execSync } = await import("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
      });
      const result = JSON.parse(output);
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
  });
});
