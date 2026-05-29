import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("Claim Office", () => {
  describe("quote — base premiums and fee", () => {
    it("returns 5 G for an empty item list (processing fee only)", () => {
      expect(quote({ items: [] })).toBe(5);
    });
    it("returns 105 G for a single plain sword (100 base + 5 fee)", () => {
      expect(quote({ items: [{ type: "sword" }] })).toBe(105);
    });
    it("returns 65 G for a single plain amulet (60 base + 5 fee)", () => {
      expect(quote({ items: [{ type: "amulet" }] })).toBe(65);
    });
    it("returns 85 G for a single plain staff (80 base + 5 fee)", () => {
      expect(quote({ items: [{ type: "staff" }] })).toBe(85);
    });
    it("returns 45 G for a single plain potion (40 base + 5 fee)", () => {
      expect(quote({ items: [{ type: "potion" }] })).toBe(45);
    });
    it("returns 30 G for a single rune (25 base + 5 fee)", () => {
      expect(quote({ items: [{ type: "rune" }] })).toBe(30);
    });
    it("returns 30 G for a single moonstone (25 base + 5 fee)", () => {
      expect(quote({ items: [{ type: "moonstone" }] })).toBe(30);
    });
  });

  describe("quote — component building blocks", () => {
    it("returns 55 G for 2 runes (50 base + 5 fee)", () => {
      expect(quote({ items: [{ type: "rune" }, { type: "rune" }] })).toBe(55);
    });
    it("returns 65 G for 3 runes (60 base block + 5 fee)", () => {
      expect(
        quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }),
      ).toBe(65);
    });
    it("returns 105 G for 4 runes (100 base, no block + 5 fee)", () => {
      expect(
        quote({
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }),
      ).toBe(105);
    });
    it("returns 180 G for 7 runes (175 base + 5 fee)", () => {
      expect(
        quote({
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        }),
      ).toBe(180);
    });
    it("returns 80 G for 2 runes + 1 moonstone (75 base, no block: different types + 5 fee)", () => {
      expect(
        quote({
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        }),
      ).toBe(80);
    });
    it("returns 125 G for 3 runes + 3 moonstones (120 base, two separate blocks + 5 fee)", () => {
      expect(
        quote({
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        }),
      ).toBe(125);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("adds 50% curse surcharge to a cursed sword's base premium", () => {
      expect(quote({ items: [{ type: "sword", cursed: true }] })).toBe(155);
    });
    it("adds 30% high-enchantment surcharge to a sword with enchantment exactly 5", () => {
      expect(quote({ items: [{ type: "sword", enchantment: 5 }] })).toBe(135);
    });
    it("does not add high-enchantment surcharge to a sword with enchantment 4", () => {
      expect(quote({ items: [{ type: "sword", enchantment: 4 }] })).toBe(105);
    });
    it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
      expect(
        quote({ items: [{ type: "sword", cursed: true, enchantment: 5 }] }),
      ).toBe(185);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("applies 20% loyalty discount for a customer with exactly 2 years with MHPCO", () => {
      expect(
        quote({ customer: { yearsWithMHPCO: 2 }, items: [{ type: "sword" }] }),
      ).toBe(85);
    });
    it("does not apply loyalty discount for a customer with fewer than 2 years", () => {
      expect(
        quote({ customer: { yearsWithMHPCO: 1 }, items: [{ type: "sword" }] }),
      ).toBe(105);
    });
    it("applies 10% first-insurance surcharge to each item in a quote regardless of history", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContracts: 0 },
          items: [{ type: "sword" }],
        }),
      ).toBe(115);
    });
    it("applies 15% follow-up discount on the customer's second quote in a scenario", () => {
      // First-insurance still applies on a follow-up contract per the spec
      // ("each item in a quote is treated as a first insurance, regardless of
      // customer history"): 100 base + 10 first-insurance − 15 follow-up
      // + 5 fee = 100.
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContracts: 1 },
          items: [{ type: "sword" }],
        }),
      ).toBe(100);
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("sums item base premiums into the policy base premium for a cursed sword and a plain amulet", () => {
      expect(
        quote({ items: [{ type: "sword", cursed: true }, { type: "amulet" }] }),
      ).toBe(215);
    });
    it("applies the curse surcharge to only the cursed item's base premium, not the policy total", () => {
      // sword base 100 + amulet base 60 = policy base 160.
      // Curse surcharge is 50% of the cursed sword's base (50), NOT 50% of
      // the policy total (which would be 80). So 160 + 50 + 5 fee = 215.
      // The policy-total interpretation would yield 160 + 80 + 5 = 245.
      expect(
        quote({ items: [{ type: "sword", cursed: true }, { type: "amulet" }] }),
      ).toBe(215);
    });
  });

  describe("quote — rounding", () => {
    it("rounds the final premium up to whole G (197.5 → 198)", () => {
      // Loyal customer (2 years) with a single high-enchantment rune:
      // base 25 - loyalty 25*0.2 (5) + high-ench 25*0.3 (7.5) + 5 fee = 32.5
      // The unrounded premium 32.5 must round UP to 33 (in MHPCO's favour).
      expect(
        quote({
          customer: { yearsWithMHPCO: 2 },
          items: [{ type: "rune", enchantment: 5 }],
        }),
      ).toBe(33);
    });
  });

  describe("quote — integration examples", () => {
    it("returns 165 G for a newcomer's cursed steel sword at enchantment 3", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContracts: 0 },
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        }),
      ).toBe(165);
    });
    it("returns 160 G for a long-standing customer's second-quote cursed steel sword at enchantment 7", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 3, previousContracts: 1 },
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        }),
      ).toBe(160);
    });
  });

  describe("claim — standard reimbursement and deductible", () => {
    it("pays 400 G for a steel sword enchantment 3 with 500 G damage (full minus 100 deductible)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        }).payout,
      ).toBe(400);
    });
    it("pays 100 G for a rune with 200 G damage (full minus 100 deductible)", () => {
      expect(
        claim({
          items: [{ type: "rune" }],
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        }).payout,
      ).toBe(100);
    });
    it("applies the 100 G deductible once per damaged item (sword 500 + amulet 300 → 600)", () => {
      expect(
        claim({
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet" },
          ],
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        }).payout,
      ).toBe(600);
    });
  });

  describe("claim — special clauses", () => {
    it("reimburses 50% before deductible for a steel sword at enchantment 9 with 1000 G damage (→ 400)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        }).payout,
      ).toBe(400);
    });
    it("fully reimburses before deductible for a dragon sword at enchantment 5 with 800 G damage (→ 700)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        }).payout,
      ).toBe(700);
    });
    it("applies the 50% rule over dragon material for a dragon sword at enchantment 9 with 1000 G damage (→ 400)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        }).payout,
      ).toBe(400);
    });
    it("applies the high-enchantment clause for a dragon sword at exactly enchantment 8 with 1000 G damage (→ 400)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        }).payout,
      ).toBe(400);
    });
  });

  describe("claim — cap", () => {
    it("caps total payout at twice the unmodified insurance sum", () => {
      // Single sword: insurance value 1000 → insurance sum 1000 → cap 2000.
      // Damage 3000: raw reimbursement = 3000 − 100 deductible = 2900, which
      // exceeds the cap 2000, so the payout is capped at 2000.
      expect(
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 3000 }],
          },
        }).payout,
      ).toBe(2000);
    });
    it("reduces a claim to the remaining cap and reports remainingCap across successive claims (1500 → 1400 then 600)", () => {
      const first = claim({
        items: [{ type: "sword", material: "steel", enchantment: 3 }],
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      });
      expect(first.payout).toBe(1400);
      expect(first.remainingCap).toBe(600);

      const second = claim({
        items: [{ type: "sword", material: "steel", enchantment: 3 }],
        remainingCap: first.remainingCap,
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      });
      expect(second.payout).toBe(600);
      expect(second.remainingCap).toBe(0);
    });
  });

  describe("claim — rounding", () => {
    it("rounds the final payout down to whole G (350.5 → 350)", () => {
      // Steel sword at enchantment 9 (high-enchantment → 50% reimbursement)
      // with 901 G damage: 901 * 0.5 = 450.5, − 100 deductible = 350.5.
      // The unrounded payout 350.5 must round DOWN to 350 (in MHPCO's
      // favour). Cap = 2 * 1000 = 2000, not exceeded.
      expect(
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        }).payout,
      ).toBe(350);
    });
  });
});
