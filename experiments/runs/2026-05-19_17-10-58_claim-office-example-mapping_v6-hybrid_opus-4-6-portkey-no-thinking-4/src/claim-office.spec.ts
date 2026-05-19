import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns 115 G for a single sword (100 base + 10 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 71 G for a single amulet (60 base + 6 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 93 G for a single staff (80 base + 8 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("returns 49 G for a single potion (40 base + 4 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("returns 181 G for a sword and an amulet (160 base + 16 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component premiums", () => {
    it("returns 33 G for a single rune (25 base + 2.5 first, ceil + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      // 25 + 2.5 + 5 = 32.5, ceil = 33
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("returns 60 G for 2 runes (50 base + 5 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("returns 71 G for 3 alike runes (60 block + 6 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("returns 115 G for 4 runes (no block: 100 base + 10 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns 88 G for 2 runes + 1 moonstone (75 base + 7.5 first, ceil + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      // 75 + 7.5 + 5 = 87.5, ceil = 88
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("returns 137 G for 3 runes + 3 moonstones (120 base + 12 first + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - cursed surcharge", () => {
    it("adds 50% surcharge to a cursed sword (100 + 50 + 10 first + 5 fee = 165 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // cursed sword: 100+50, plain amulet: 60, base=160, 160+50+16 first+5 fee = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - high enchantment surcharge", () => {
    it("adds 30% surcharge for enchantment level 5 (100 + 30 + 10 first + 5 fee = 145 G)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("does not add surcharge for enchantment level 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies both cursed and high enchantment surcharges to the same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      // 100 base + 50 cursed + 30 enchant + 10 first + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
  });

  describe("Quote - loyalty discount", () => {
    it("applies 20% loyalty discount for customer with 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 100 base - 20 loyalty + 10 first + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("does not apply loyalty discount for customer with 1 year", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 100 base + 10 first + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
  });

  describe("Quote - first insurance surcharge", () => {
    it("adds 10% first insurance surcharge on policy base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 100 base + 10 first insurance (10% of 100) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
  });

  describe("Quote - follow-up contract discount", () => {
    it("applies 15% follow-up discount on second quote in scenario", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // First quote: 100 base + 10 first + 5 fee = 115
      // Second quote: 100 base - 15 follow-up + 10 first + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up in MHPCO's favor (ceiling)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      // 25 base - 5 loyalty (20%) + 2.5 first (10%) + 5 fee = 27.5, ceil = 28
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword: 165 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          },
        ],
      });
      // 100 base + 50 cursed + 10 first insurance + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed enchanted sword: 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      // Second contract: 100 base + 50 cursed + 30 enchant - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - errors", () => {
    it("throws error for unknown item type", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "dragon_egg", material: "obsidian", enchantment: 0, cursed: false }],
            },
          ],
        })
      ).toThrow();
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100 G deductible per damaged item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "sword", amount: 500 }],
          },
        ],
      });
      // Sword insurance value: 1000 G, damage: 500, reimbursement: 500 - 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400 });
    });
    it("fully reimburses standard item damage minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "amulet", amount: 350 }],
          },
        ],
      });
      // Amulet damage: 350 - 100 deductible = 250
      expect(result.results[1]).toEqual({ payout: 250 });
    });
  });

  describe("Claim - dragon material", () => {
    it("fully reimburses damage to dragon material items minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "sword", amount: 700 }],
          },
        ],
      });
      // Dragon material: full reimbursement minus deductible = 700 - 100 = 600
      expect(result.results[1]).toEqual({ payout: 600 });
    });
  });

  describe("Claim - high enchantment reimbursement", () => {
    it("reimburses 50% of damage for enchantment >= 8, then applies deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "sword", amount: 600 }],
          },
        ],
      });
      // High enchantment: 50% of 600 = 300, then minus 100 deductible = 200
      expect(result.results[1]).toEqual({ payout: 200 });
    });
    it("50% rule wins over dragon material when enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "sword", amount: 800 }],
          },
        ],
      });
      // Enchantment >= 8 wins over dragon: 50% of 800 = 400, minus 100 deductible = 300
      expect(result.results[1]).toEqual({ payout: 300 });
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "potion", amount: 1000 }],
          },
        ],
      });
      // Potion insurance value: 400 G, cap = 2 * 400 = 800
      // Damage: 1000 - 100 deductible = 900, but capped at 800
      expect(result.results[1]).toEqual({ payout: 800 });
    });
    it("tracks remaining cap across multiple claims on same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "potion", amount: 600 }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "potion", amount: 500 }],
          },
        ],
      });
      // Potion insurance value: 400, cap = 800
      // Claim 1: 600 - 100 = 500, remaining cap = 800 - 500 = 300
      // Claim 2: 500 - 100 = 400, but remaining cap = 300, so payout = 300
      expect(result.results[1]).toEqual({ payout: 500 });
      expect(result.results[2]).toEqual({ payout: 300 });
    });
  });

  describe("Claim - multiple damages in one event", () => {
    it("applies deductible per damaged item in same event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            damages: [
              { type: "sword", amount: 400 },
              { type: "amulet", amount: 300 },
            ],
          },
        ],
      });
      // Sword: 400 - 100 = 300, Amulet: 300 - 100 = 200, total = 500
      expect(result.results[1]).toEqual({ payout: 500 });
    });
    it("handles two damages of same item type when policy covers two", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            damages: [
              { type: "sword", amount: 500 },
              { type: "sword", amount: 300 },
            ],
          },
        ],
      });
      // Two swords insured: damage 1: 500-100=400, damage 2: 300-100=200, total=600
      expect(result.results[1]).toEqual({ payout: 600 });
    });
  });

  describe("Claim - payout rounding", () => {
    it("rounds payout down in MHPCO's favor (floor)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          },
          {
            op: "claim" as const,
            damages: [{ type: "sword", amount: 555 }],
          },
        ],
      });
      // High enchantment: 50% of 555 = 277.5, minus 100 deductible = 177.5, floor = 177
      expect(result.results[1]).toEqual({ payout: 177 });
    });
  });

  describe("Claim - errors", () => {
    it("rejects damage for item type not in policy", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
            {
              op: "claim" as const,
              damages: [{ type: "amulet", amount: 300 }],
            },
          ],
        })
      ).toThrow();
    });
    it("rejects more damages of a type than policy covers", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
            {
              op: "claim" as const,
              damages: [
                { type: "sword", amount: 300 },
                { type: "sword", amount: 200 },
              ],
            },
          ],
        })
      ).toThrow();
    });
    it("rejects negative damage amount", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
            {
              op: "claim" as const,
              damages: [{ type: "sword", amount: -100 }],
            },
          ],
        })
      ).toThrow();
    });
  });
});
