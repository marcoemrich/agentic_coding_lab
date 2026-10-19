import { describe, it, expect } from "vitest";
import { createPolicy, processClaim } from "./claim.js";
import type { Damage, Item } from "./types.js";

describe("processClaim", () => {
  describe("standard reimbursement (no special clauses)", () => {
    it("should compute payout 400 G for regular sword (steel, enchantment 3), damage 500 G (full - 100 deductible)", () => {
      const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
      const result = processClaim(policy, [{ itemType: "sword", amount: 500 }]);
      expect(result.payout).toBe(400);
    });
    it("should compute payout 100 G for rune damage 200 G (full - 100 deductible)", () => {
      const policy = createPolicy([{ type: "rune" }]);
      const result = processClaim(policy, [{ itemType: "rune", amount: 200 }]);
      expect(result.payout).toBe(100);
    });
  });

  describe("multi-item damage in single incident", () => {
    it("should apply deductible once per damaged item: dragon attack on sword (500) + amulet (300) -> payout 600 G", () => {
      const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
      const result = processClaim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ]);
      expect(result.payout).toBe(600);
    });
  });

  describe("high enchantment and dragon material clauses", () => {
    it("should apply high-enchantment clause for dragon-material sword enchantment 8, damage 1000 -> payout 400 G (50% then deductible)", () => {
      const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
      const result = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
      expect(result.payout).toBe(400);
    });
    it("should let 50% rule win when both clauses apply: dragon-material sword enchantment 9, damage 1000 -> payout 400 G", () => {
      const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
      const result = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
      expect(result.payout).toBe(400);
    });
    it("should apply only dragon-material clause for dragon-material sword enchantment 5, damage 800 -> payout 700 G", () => {
      const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
      const result = processClaim(policy, [{ itemType: "sword", amount: 800 }]);
      expect(result.payout).toBe(700);
    });
    it("should apply only high-enchantment clause for steel sword enchantment 9, damage 1000 -> payout 400 G", () => {
      const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
      const result = processClaim(policy, [{ itemType: "sword", amount: 1000 }]);
      expect(result.payout).toBe(400);
    });
  });

  describe("policy creation: insurance sum and cap", () => {
    it("should compute insurance sum 2000 G and cap 4000 G for policy with 2 swords", () => {
      const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
      expect(policy.insuranceSum).toBe(2000);
      expect(policy.cap).toBe(4000);
    });
    it("should compute insurance sum 1600 G and cap 3200 G for policy with sword + amulet", () => {
      const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
      expect(policy.insuranceSum).toBe(1600);
      expect(policy.cap).toBe(3200);
    });
    it("should compute cap based on unmodified insurance value for cursed sword (cap 2000 G, not affected by premium modifiers)", () => {
      const policy = createPolicy([{ type: "sword", cursed: true }]);
      expect(policy.cap).toBe(2000);
    });
    it("should compute insurance sum 1750 G for policy with sword + 3 runes (block affects premium only)", () => {
      const policy = createPolicy([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]);
      expect(policy.insuranceSum).toBe(1750);
    });
  });

  describe("multiple damages of same type", () => {
    it("should treat each damages entry as separate damage with own deductible: 2 sword damages each 500 G on policy with 2 swords -> payout (500-100)*2 = 800 G", () => {
      const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
      const result = processClaim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]);
      expect(result.payout).toBe(800);
    });
  });

  describe("cap exhaustion", () => {
    it("should track remaining cap across multiple claims: sword (cap 2000), first claim 1500 -> payout 1400, cap remaining 600; second claim 1500 -> payout 600, cap remaining 0", () => {
      let policy = createPolicy([{ type: "sword" }]);
      const r1 = processClaim(policy, [{ itemType: "sword", amount: 1500 }]);
      expect(r1.payout).toBe(1400);
      expect(r1.remainingCap).toBe(600);
      policy = { ...policy, remainingCap: r1.remainingCap };
      const r2 = processClaim(policy, [{ itemType: "sword", amount: 1500 }]);
      expect(r2.payout).toBe(600);
      expect(r2.remainingCap).toBe(0);
    });
  });

  describe("rounding", () => {
    it("should round payout down to whole G in MHPCO's favor (350.5 -> 350)", () => {
      // We need a damage that yields exactly 350.5 after clause + deductible.
      // 250 damage * 1.5 clause (enchantment >= 8) - 100 deductible - actually we need a fractional result.
      // Try: amount 301 with no clauses -> 301 - 100 = 201 (whole).
      // We need a fractional: amount - 100 = fraction. Let's use amount 250.5 -> 250.5 - 100 = 150.5 -> floor 150.
      // But damages.amount is integer per spec schema. So construct via two damages: one 250 (regular), plus small fractional.
      // Easier: use policy cap to clip. amount 1500 - 100 = 1400, cap 1400.5? Cap is integer.
      // Realistic path: damage 451 to enchanted sword (50%) = 225.5 - 100 = 125.5 -> floor 125.
      const policy = createPolicy([{ type: "sword", enchantment: 9 }]);
      const result = processClaim(policy, [{ itemType: "sword", amount: 451 }]);
      // 451 * 0.5 = 225.5; 225.5 - 100 = 125.5; floor = 125
      expect(result.payout).toBe(125);
    });
  });
});

void (null as unknown as { item: Item; damage: Damage });
