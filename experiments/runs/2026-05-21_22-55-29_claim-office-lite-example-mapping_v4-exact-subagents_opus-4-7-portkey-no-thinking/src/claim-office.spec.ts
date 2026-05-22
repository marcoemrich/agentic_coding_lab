import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - base premiums (includes 10% first-insurance surcharge per item)", () => {
    it("should return 5 G for empty item list (processing fee only)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
    });
    it("should return 115 G for a plain sword (100 base + 10 first + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
    });
    it("should return 71 G for a plain amulet (60 base + 6 first + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
    });
    it("should return 93 G for a plain staff (80 base + 8 first + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
    });
    it("should return 49 G for a plain potion (40 base + 4 first + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
    });
    it("should return 33 G for a single rune (25 base + 2.5 first + 5 fee, rounded up)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
    });
    it("should return 33 G for a single moonstone (25 base + 2.5 first + 5 fee, rounded up)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
    });
  });

  describe("quote - multiple items", () => {
    it("should sum base premiums with per-item first surcharge (sword+amulet: 100+60+10+6+5 = 181 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }])).toBe(181);
    });
    it("should return 60 G for two runes (50 base + 5 first + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
  });

  describe("quote - component blocks", () => {
    it("should apply block premium of 60 G for exactly 3 alike runes (60 base + 6 first + 5 fee = 71 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("should apply block premium of 60 G for exactly 3 alike moonstones (71 G total)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(71);
    });
    it("should not apply block for 4 runes — 100 base + 10 first + 5 fee = 115 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(115);
    });
    it("should apply one block + singles for 7 runes — 175 base + 17.5 first + 5 fee = 198 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(198);
    });
    it("should apply two separate blocks for 3 runes + 3 moonstones — 120 base + 12 first + 5 fee = 137 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ]),
      ).toBe(137);
    });
    it("should not apply block for 2 runes + 1 moonstone — 75 base + 7.5 first + 5 fee = 88 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ]),
      ).toBe(88);
    });
  });

  describe("quote - item-specific modifiers", () => {
    it("should add 50% curse surcharge to a cursed sword (100 + 50 curse + 10 first + 5 fee = 165 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
    });
    it("should add 30% high-enchantment surcharge for enchantment 5 (100 + 30 + 10 + 5 = 145 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("should not add high-enchantment surcharge for enchantment 4 (100 + 10 + 5 = 115 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("should add both curse and high-enchantment when both apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
    });
    it("should apply curse only to the cursed item in a multi-item policy (cursed sword + plain amulet: 100+60+50+10+6+5 = 231 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("quote - policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for customer with 2 years (100 - 20 + 10 + 5 = 95 G)", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
    });
    it("should apply 20% loyalty discount for customer with 3 years (95 G)", () => {
      expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }])).toBe(95);
    });
    it("should not apply loyalty discount for customer with 1 year (100 + 10 + 5 = 115 G)", () => {
      expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
    });
    it("should apply 10% first insurance surcharge per item (100 + 10 + 5 = 115 G for one sword)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
    });
    it("should apply 15% follow-up discount on customer's second quote (100 + 10 - 15 + 5 = 100 G)", () => {
      expect(quote({ yearsWithMHPCO: 0, previousQuotes: 1 }, [{ type: "sword" }])).toBe(100);
    });
    it("should not apply follow-up discount on the first quote", () => {
      expect(quote({ yearsWithMHPCO: 0, previousQuotes: 0 }, [{ type: "sword" }])).toBe(115);
    });
  });

  describe("quote - rounding and fee", () => {
    it("should round final premium UP to whole G (e.g. fractional total rounds up)", () => {
      // 5 runes: 5*25 = 125 base + 12.5 first-insurance + 5 fee = 142.5 -> 143
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(143);
    });
    it("should add 5 G processing fee at the very end", () => {
      // Difference between an item-bearing quote and the empty-list quote should equal the item costs only.
      // With one sword: 100 base + 10 first + 5 fee = 115. Empty: 5. Diff: 110 (no double-fee).
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]) - quote({ yearsWithMHPCO: 0 }, [])).toBe(110);
    });
  });

  describe("quote - integration examples", () => {
    it("should compute 165 G for newcomer with cursed sword (steel, enchantment 3), first quote", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0, previousQuotes: 0 },
          [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        ),
      ).toBe(165);
    });
    it("should compute 160 G for long-standing customer's second quote of cursed sword (steel, enchantment 7)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 3, previousQuotes: 1 },
          [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        ),
      ).toBe(160);
    });
  });

  describe("quote - error cases", () => {
    it("should throw an error for unknown item type in quote", () => {
      expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow();
    });
  });

  describe("claim - base reimbursement", () => {
    it("should pay out 400 G for regular sword (steel, enchantment 3) with 500 G damage (500 - 100 deductible)", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3 }];
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      expect(claim(items, incident)).toBe(400);
    });
    it("should pay out 100 G for a rune with 200 G damage (200 - 100 deductible)", () => {
      const items = [{ type: "rune" }];
      const incident = { cause: "x", damages: [{ itemType: "rune", amount: 200 }] };
      expect(claim(items, incident)).toBe(100);
    });
    it("should apply 100 G deductible per damaged item (sword 500 + amulet 300 = 600 G payout)", () => {
      const items = [{ type: "sword" }, { type: "amulet" }];
      const incident = {
        cause: "x",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      };
      expect(claim(items, incident)).toBe(600);
    });
  });

  describe("claim - special clauses", () => {
    it("should reimburse 50% for items with enchantment >= 8 (steel sword ench 9, damage 1000 -> 400 G)", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 9 }];
      const incident = { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(items, incident)).toBe(400);
    });
    it("should reimburse 50% for items with enchantment exactly 8 (dragon sword ench 8, damage 1000 -> 400 G)", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
      const incident = { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(items, incident)).toBe(400);
    });
    it("should fully reimburse dragon material items (dragon sword ench 5, damage 800 -> 700 G)", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
      const incident = { cause: "x", damages: [{ itemType: "sword", amount: 800 }] };
      expect(claim(items, incident)).toBe(700);
    });
    it("should apply 50% rule when both high-enchantment and dragon material apply (dragon sword ench 9, damage 1000 -> 400 G)", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
      const incident = { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(items, incident)).toBe(400);
    });
  });

  describe("claim - rounding", () => {
    it("should round final payout DOWN to whole G (350.5 -> 350 G)", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
      const incident = { cause: "x", damages: [{ itemType: "sword", amount: 901 }] };
      expect(claim(items, incident)).toBe(350);
    });
  });

  describe("claim - error cases", () => {
    it("should throw an error when claim references an item type not in the policy", () => {
      expect(() =>
        claim(
          [{ type: "sword" }],
          { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
        ),
      ).toThrow();
    });
    it("should throw an error when claim damage amount is negative", () => {
      expect(() =>
        claim(
          [{ type: "sword" }],
          { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
        ),
      ).toThrow();
    });
    it("should throw an error when claim has more damage entries of a type than the policy covers", () => {
      expect(() =>
        claim(
          [{ type: "sword" }],
          {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 200 },
            ],
          },
        ),
      ).toThrow();
    });
  });
});
