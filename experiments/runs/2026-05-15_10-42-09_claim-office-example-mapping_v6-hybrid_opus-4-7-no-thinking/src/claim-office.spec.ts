import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

// All quote tests use yearsWithMHPCO=0 and previousQuoteCount=0 unless stated,
// meaning: no loyalty discount, first insurance surcharge applies (+10% of policy base),
// no follow-up discount.

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list yields premium of 5 G (processing fee only)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
    });
    it("a single sword yields premium 115 G (100 base + 10 first ins + 5 fee)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          0,
        ),
      ).toBe(115);
    });
    it("a single amulet yields premium 71 G (60 base + 6 first ins + 5 fee)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          0,
        ),
      ).toBe(71);
    });
    it("a single staff yields premium 93 G (80 base + 8 first ins + 5 fee)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
          0,
        ),
      ).toBe(93);
    });
    it("a single potion yields premium 49 G (40 base + 4 first ins + 5 fee)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          0,
        ),
      ).toBe(49);
    });
    it("a sword and an amulet yields premium 181 G (160 base + 16 first ins + 5)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
          0,
        ),
      ).toBe(181);
    });
  });

  describe("quote — components and blocks", () => {
    it("a single rune yields premium 33 G (25 base + 2.5 first ins → rounded up 28 + 5 = 33)", () => {
      // 25 + 2.5 = 27.5 + 5 fee = 32.5 → rounded up 33
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
    });
    it("two runes yield premium 60 G (50 base + 5 first ins + 5 fee)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0),
      ).toBe(60);
    });
    it("three runes yield premium 71 G (60 block + 6 first ins + 5 fee)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          0,
        ),
      ).toBe(71);
    });
    it("four runes yield premium 115 G (100 base + 10 first ins + 5 fee, no block)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          0,
        ),
      ).toBe(115);
    });
    it("seven runes yield premium 198 G (175 base + 17.5 first ins → 192.5 + 5 fee → 197.5 → 198)", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(198);
    });
    it("two runes + one moonstone yield premium 88 G (75 base + 7.5 first ins → 82.5 + 5 → 87.5 → 88)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          0,
        ),
      ).toBe(88);
    });
    it("three runes + three moonstones yield premium 137 G (120 base + 12 first ins + 5 fee)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
          0,
        ),
      ).toBe(137);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("a cursed sword adds 50 G surcharge (100 + 50 + 10 first ins + 5 = 165)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          0,
        ),
      ).toBe(165);
    });
    it("a sword with enchantment 5 adds 30 G surcharge (100 + 30 + 10 first ins + 5 = 145)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          0,
        ),
      ).toBe(145);
    });
    it("a sword with enchantment 4 has no high-enchantment surcharge (100 + 10 + 5 = 115)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          0,
        ),
      ).toBe(115);
    });
    it("a cursed sword with enchantment 5 adds both surcharges (100+50+30+10+5=195)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          0,
        ),
      ).toBe(195);
    });
    it("cursed surcharge on multi-item policy applies to cursed item only (100+50+60+16 first ins+5=231)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [
            { type: "sword", material: "steel", enchantment: 1, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
          0,
        ),
      ).toBe(231);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("loyalty discount of 20% applies for customer with 2+ years (100 -20 +10 +5 = 95)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 2 },
          [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          0,
        ),
      ).toBe(95);
    });
    it("first insurance surcharge of 10% applies on every quote (100 +10 +5 = 115)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          0,
        ),
      ).toBe(115);
    });
    it("follow-up contract discount of 15% applies on second+ quote (100 -15 +10 +5 = 100)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          1,
        ),
      ).toBe(100);
    });
  });

  describe("quote — rounding", () => {
    it("premium is rounded up in MHPCO's favor (197.5 → 198)", () => {
      // 7 runes: 175 base + 17.5 first ins + 5 fee = 197.5 → 198
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(198);
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer with cursed sword yields premium 165 G", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          0,
        ),
      ).toBe(165);
    });
    it("long-standing customer's second contract with cursed enchanted sword yields 160 G", () => {
      expect(
        quote(
          { yearsWithMHPCO: 3 },
          [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          1,
        ),
      ).toBe(160);
    });
  });

  describe("quote — validation", () => {
    it("unknown item type causes an error", () => {
      expect(() =>
        quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0),
      ).toThrow();
    });
  });

  describe("claim — basic payouts", () => {
    it("standard sword damage of 500 G yields payout 400 G (minus 100 deductible)", () => {
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        0,
      );
      expect(result.payout).toBe(400);
    });
    it("rune damage of 200 G yields payout 100 G (minus 100 deductible)", () => {
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }],
        { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        0,
      );
      expect(result.payout).toBe(100);
    });
    it("damage to multiple items applies deductible per item", () => {
      // sword: 500-100=400, amulet: 300-100=200, total=600
      const result = claim(
        { yearsWithMHPCO: 0 },
        [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
        0,
      );
      expect(result.payout).toBe(600);
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword fully reimbursed minus deductible", () => {
      // dragon sword, enchantment 5, damage 800 → 800 - 100 = 700 (only dragon clause applies)
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        0,
      );
      expect(result.payout).toBe(700);
    });
    it("enchantment 8 sword reimbursed at 50% then deductible", () => {
      // steel sword, enchantment 8, damage 1000 → 500 - 100 = 400
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        0,
      );
      expect(result.payout).toBe(400);
    });
    it("enchantment 9 dragon sword: 50% rule wins, then deductible", () => {
      // dragon sword, enchantment 9, damage 1000 → 500 - 100 = 400
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        0,
      );
      expect(result.payout).toBe(400);
    });
  });

  describe("claim — cap and remaining", () => {
    it("payout capped at twice insurance sum (cap exhaustion)", () => {
      // sword insurance 1000, cap 2000. capUsed 1400, so 600 remains.
      // Damage 1500 - 100 = 1400 desired, but capped to 600.
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        1400,
      );
      expect(result.payout).toBe(600);
    });
    it("remainingCap is reported correctly after a claim", () => {
      // sword cap 2000, capUsed 0, payout 1400, remaining 600
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        0,
      );
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    });
  });

  describe("claim — rounding", () => {
    it("payout is rounded down in MHPCO's favor", () => {
      // sword enchantment 8 (50% rule), damage 801 → 400.5 - 100 = 300.5 → 300
      const result = claim(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 801 }] },
        0,
      );
      expect(result.payout).toBe(300);
    });
  });

  describe("claim — validation", () => {
    it("damage referencing item not in policy causes error", () => {
      // amulet damaged but only sword insured
      expect(() =>
        claim(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
          0,
        ),
      ).toThrow();
    });
    it("negative damage amount causes error", () => {
      expect(() =>
        claim(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          0,
        ),
      ).toThrow();
    });
    it("more damages of a type than insured causes error", () => {
      // only 1 sword insured, but 2 sword damages
      expect(() =>
        claim(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
          0,
        ),
      ).toThrow();
    });
  });
});
