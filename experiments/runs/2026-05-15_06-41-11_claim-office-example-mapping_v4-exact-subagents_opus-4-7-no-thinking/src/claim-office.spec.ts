import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - base premiums and processing fee", () => {
    it("empty item list yields premium 5 G (only the processing fee)", () => {
      const result = quote({ customer: { yearsWithMHPCO: 0 }, items: [] });
      expect(result.premium).toBe(5);
    });
    it("a single plain sword (newcomer, first contract) yields base premium 100 G + 10 G first-insurance surcharge + 5 G fee = 115 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      });
      expect(result.premium).toBe(115);
    });
    it("a single plain amulet (newcomer, first contract) yields base premium 60 G + 6 G first-insurance surcharge + 5 G fee = 71 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      });
      expect(result.premium).toBe(71);
    });
    it("a single plain staff (newcomer, first contract) yields base premium 80 G + 8 G first-insurance surcharge + 5 G fee = 93 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
      });
      expect(result.premium).toBe(93);
    });
    it("a single plain potion yields base premium 40 G + fee", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      });
      expect(result.premium).toBe(49);
    });
  });

  describe("quote - components and building blocks", () => {
    it("2 runes yield 50 G base premium (25 each, no block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }] as any,
      });
      expect(result.premium).toBe(60);
    });
    it("3 runes yield 60 G base premium (block applies)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] as any,
      });
      expect(result.premium).toBe(71);
    });
    it("4 runes yield 100 G base premium (no block - block requires exactly 3)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] as any,
      });
      expect(result.premium).toBe(115);
    });
    it("7 runes yield 175 G base premium (no block for any group of size != 3)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ] as any,
      });
      expect(result.premium).toBe(198);
    });
    it("2 runes + 1 moonstone yield 75 G base premium (no block: different types)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] as any,
      });
      expect(result.premium).toBe(88);
    });
    it("3 runes + 3 moonstones yield 120 G base premium (two separate blocks)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ] as any,
      });
      expect(result.premium).toBe(137);
    });
  });

  describe("quote - item-specific modifiers", () => {
    it("a cursed sword adds 50% of the sword's base premium as curse surcharge", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      });
      expect(result.premium).toBe(150);
    });
    it("a sword with enchantment exactly 5 adds the 30% high-enchantment surcharge", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      });
      expect(result.premium).toBe(130);
    });
    it("a sword with enchantment 4 does not add the high-enchantment surcharge", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      });
      expect(result.premium).toBe(100);
    });
    it("a cursed sword with enchantment 5 adds both curse and high-enchantment surcharges", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      });
      expect(result.premium).toBe(180);
    });
  });

  describe("quote - policy-wide modifiers", () => {
    it("a customer with exactly 2 years with MHPCO gets the 20% loyalty discount", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 2, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      });
      expect(result.premium).toBe(80);
    });
    it("a first insurance (customer's first contract) adds a 10% surcharge on the policy base", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      });
      expect(result.premium).toBe(115);
    });
    it("a follow-up contract (not the first) applies a 15% discount on the policy base", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      });
      expect(result.premium).toBe(100);
    });
  });

  describe("quote - multi-item policies and modifier scope", () => {
    it("a policy covering a cursed sword and a plain amulet yields policy base 160 G plus 50 G curse surcharge = 210 G before further modifiers and fee", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 1 },
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      });
      expect(result.premium).toBe(207);
    });
  });

  describe("quote - rounding", () => {
    it("a premium calculation that yields 197.5 G is rounded up to 198 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ] as any,
      });
      expect(result.premium).toBe(198);
    });
  });

  describe("quote - integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 yields premium 165 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      });
      expect(result.premium).toBe(165);
    });
    it("3-year customer's second quote with a cursed steel sword enchantment 7 yields premium 160 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 3, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      });
      expect(result.premium).toBe(160);
    });
  });

  describe("claim - standard reimbursement and deductible", () => {
    it("a regular sword (steel, enchantment 3) with 500 G damage yields payout 400 G", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      };
      const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
      expect(result.payout).toBe(400);
    });
    it("damage to a rune (insurance value 250 G) of 200 G yields payout 100 G", () => {
      const policy = {
        items: [{ type: "rune" }] as any,
      };
      const result = claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
      expect(result.payout).toBe(100);
    });
    it("a dragon attack damaging an insured sword (500 G) and insured amulet (300 G) yields payout 600 G (deductible per damage event)", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      };
      const result = claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      });
      expect(result.payout).toBe(600);
    });
  });

  describe("claim - special clauses", () => {
    it("a steel sword with enchantment 9 and damage 1000 G yields payout 400 G (50% rule then deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      };
      const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
      expect(result.payout).toBe(400);
    });
    it("a dragon-material sword with enchantment 5 and damage 800 G yields payout 700 G (dragon material full reimbursement then deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      };
      const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
      expect(result.payout).toBe(700);
    });
    it("a dragon-material sword with enchantment 9 and damage 1000 G yields payout 400 G (50% rule wins, then deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      };
      const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
      expect(result.payout).toBe(400);
    });
    it("a dragon-material sword with enchantment exactly 8 and damage 1000 G yields payout 400 G (high-enchantment clause then deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
      };
      const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
      expect(result.payout).toBe(400);
    });
  });

  describe("claim - cap exhaustion", () => {
    it("a policy covering a sword and an amulet has insurance sum 1600 G and cap 3200 G", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      };
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 5000 }],
      });
      expect(result.payout).toBe(3200);
      expect(result.remainingCap).toBe(0);
    });
    it("a cursed sword policy has cap 2000 G (based on unmodified insurance value)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      };
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 5000 }],
      });
      expect(result.payout).toBe(2000);
      expect(result.remainingCap).toBe(0);
    });
    it("a policy with a sword and 3 runes has insurance sum 1750 G (block discount does not affect insurance sum)", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ] as any,
      };
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 5000 }],
      });
      expect(result.payout).toBe(3500);
      expect(result.remainingCap).toBe(0);
    });
    it("two successive 1500 G claims on a sword policy yield payouts 1400 G then 600 G (cap exhausted)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      };
      const r1 = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      });
      expect(r1.payout).toBe(1400);
      expect(r1.remainingCap).toBe(600);
      const r2 = claim(
        policy,
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        { remainingCap: r1.remainingCap },
      );
      expect(r2.payout).toBe(600);
      expect(r2.remainingCap).toBe(0);
    });
  });

  describe("claim - multiple items of the same type", () => {
    it("a policy covering two swords has insurance sum 2000 G and cap 4000 G", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ],
      };
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 10000 }],
      });
      expect(result.payout).toBe(4000);
      expect(result.remainingCap).toBe(0);
    });
    it("a dragon attack damaging both insured swords treats each damage entry as separate with its own deductible", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ],
      };
      const result = claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      });
      expect(result.payout).toBe(600);
    });
  });

  describe("claim - rounding", () => {
    it("a payout calculation yielding 350.5 G is rounded down to 350 G", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
      };
      const result = claim(policy, {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 901 }],
      });
      expect(result.payout).toBe(350);
    });
  });
});
