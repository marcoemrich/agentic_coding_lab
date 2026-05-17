import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("empty item list returns premium of 5 G (processing fee only)", () => {
      expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [] })).toEqual({ premium: 5 });
    });
    it("single plain sword returns 105 G (100 base + 5 fee)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })).toEqual({ premium: 105 });
    });
    it("single plain amulet returns 65 G (60 base + 5 fee)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      })).toEqual({ premium: 65 });
    });
    it("single plain staff returns 85 G (80 base + 5 fee)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
      })).toEqual({ premium: 85 });
    });
    it("single plain potion returns 45 G (40 base + 5 fee)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      })).toEqual({ premium: 45 });
    });
    it("single rune component returns 30 G (25 base + 5 fee)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }],
      })).toEqual({ premium: 30 });
    });
    it("two different items sums their base premiums (sword + amulet → 165 G)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      })).toEqual({ premium: 165 });
    });
    it("three alike components form a building block (3 runes → 65 G)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      })).toEqual({ premium: 65 });
    });
    it("four alike components do not form a block (4 runes → 105 G)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      })).toEqual({ premium: 105 });
    });
    it("two different component types do not form a block (2 runes + 1 moonstone → 80 G)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      })).toEqual({ premium: 80 });
    });
    it("cursed item adds 50% surcharge on that item's base premium", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      })).toEqual({ premium: 155 });
    });
    it("highly enchanted item (enchantment ≥ 5) adds 30% surcharge", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      })).toEqual({ premium: 135 });
    });
    it("long-standing customer (≥ 2 years) gets 20% loyalty discount on policy total", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 2 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })).toEqual({ premium: 85 });
    });
    it("first insurance adds 10% surcharge per item", () => {
      // First insurance is +10% on each item's base premium, applied as policy-level surcharge.
      // Sword: 100 base + 10 first insurance = 110 + 5 fee = 115
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        firstInsurance: true,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })).toEqual({ premium: 115 });
    });
    it("follow-up contract gives 15% discount on policy total", () => {
      // Follow-up: sword 100 - 15 + 5 = 90
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        followUp: true,
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })).toEqual({ premium: 90 });
    });
    it("premium rounded up in MHPCO's favor", () => {
      // Cursed amulet base 60 + 30 curse = 90 policy base.
      // followUp -15%: 90 * 0.85 = 76.5 + 5 fee = 81.5 → rounded UP = 82
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        followUp: true,
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: true }],
      })).toEqual({ premium: 82 });
    });
    it("unknown item type causes error", () => {
      expect(() => quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "broomstick" }],
      })).toThrow();
    });
  });

  describe("claim", () => {
    it("standard damage minus 100 G deductible (sword damage 500 → payout 400)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        incident: { damages: [{ itemType: "sword", amount: 500 }] },
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to enchantment ≥ 8 item reimbursed at 50% then deductible", () => {
      // Sword enchantment 8, damage 800 → 400 (50%) - 100 deductible = 300 payout
      // Cap = 2 × 1000 = 2000; remaining = 2000 - 300 = 1700
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        incident: { damages: [{ itemType: "sword", amount: 800 }] },
      })).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("damage to dragon-material item fully reimbursed then deductible", () => {
      // Dragon material sword, enchantment 5, damage 800 → 800 - 100 deductible = 700 payout
      // Cap = 2 × 1000 = 2000; remaining = 2000 - 700 = 1300
      expect(claim({
        policy: { items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        incident: { damages: [{ itemType: "sword", amount: 800 }] },
      })).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("payout capped at 2× insurance sum", () => {
      // Amulet insurance 600, cap = 2 × 600 = 1200
      // Damage 2000 → raw payout would be 2000 - 100 = 1900, but cap is 1200
      // So payout = 1200, remainingCap = 0
      expect(claim({
        policy: { items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        incident: { damages: [{ itemType: "amulet", amount: 2000 }] },
      })).toEqual({ payout: 1200, remainingCap: 0 });
    });
    it("deductible applies per damage event (multi-item damage)", () => {
      // Sword (1000) + amulet (600), insurance sum 1600, cap = 3200
      // Damages: sword 500 → 400, amulet 300 → 200; total payout = 600
      // Remaining cap = 3200 - 600 = 2600
      expect(claim({
        policy: {
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        incident: {
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      })).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("claim with item not in policy causes error", () => {
      expect(() => claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        incident: { damages: [{ itemType: "amulet", amount: 100 }] },
      })).toThrow();
    });
    it("claim with negative damage amount causes error", () => {
      expect(() => claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        incident: { damages: [{ itemType: "sword", amount: -200 }] },
      })).toThrow();
    });
  });
});
