import { describe, expect, it } from "vitest";
import {
  ClaimOfficeError,
  createPolicy,
  processClaim,
  type Damage,
  type Policy,
} from "./claim.js";

function makePolicy(items: Policy["items"], cap: number): Policy {
  return { items, cap, paidOut: 0 };
}

describe("MHPCO Claim Office - Claim", () => {
  describe("standard reimbursement", () => {
    it("sword (steel, enchantment 3) damage 500 → payout 400 (full - 100 deductible)", () => {
      const policy = makePolicy(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        2000,
      );
      const damages: Damage[] = [{ itemType: "sword", amount: 500 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damage 200 → payout 100 (full - 100 deductible, no special clauses)", () => {
      const policy = makePolicy([{ type: "rune" }], 500);
      const damages: Damage[] = [{ itemType: "rune", amount: 200 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("amulet no special clause damage 50 → payout 0 (50 - 100 deductible, clamped)", () => {
      const policy = makePolicy([{ type: "amulet" }], 1200);
      const damages: Damage[] = [{ itemType: "amulet", amount: 50 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 0, remainingCap: 1200 });
    });
  });

  describe("enchantment threshold vs dragon material", () => {
    it("dragon-material sword (enchantment 8) damage 1000 → payout 400 (50% rule wins, then deductible)", () => {
      const policy = makePolicy(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        2000,
      );
      const damages: Damage[] = [{ itemType: "sword", amount: 1000 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword (enchantment 9) damage 1000 → payout 400 (both apply, 50% wins)", () => {
      const policy = makePolicy(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        2000,
      );
      const damages: Damage[] = [{ itemType: "sword", amount: 1000 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword (enchantment 5) damage 800 → payout 700 (only dragon material applies)", () => {
      const policy = makePolicy(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        2000,
      );
      const damages: Damage[] = [{ itemType: "sword", amount: 800 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword (enchantment 9) damage 1000 → payout 400 (only high-enchantment applies)", () => {
      const policy = makePolicy(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        2000,
      );
      const damages: Damage[] = [{ itemType: "sword", amount: 1000 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword (enchantment 4) damage 500 → payout 400 (only dragon, full - deductible)", () => {
      const policy = makePolicy(
        [{ type: "sword", material: "dragon", enchantment: 4 }],
        2000,
      );
      const damages: Damage[] = [{ itemType: "sword", amount: 500 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword (enchantment 7) damage 1000 → payout 900 (no high-enchantment clause at <8)", () => {
      const policy = makePolicy(
        [{ type: "sword", enchantment: 7 }],
        2000,
      );
      const damages: Damage[] = [{ itemType: "sword", amount: 1000 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 900, remainingCap: 1100 });
    });
  });

  describe("deductible per damage event", () => {
    it("dragon attack damages sword (500) + amulet (300) → payout 600 (each item gets own deductible)", () => {
      const policy = makePolicy(
        [{ type: "sword" }, { type: "amulet" }],
        3200,
      );
      const damages: Damage[] = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(processClaim(policy, damages)).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("multiple items of same type", () => {
    it("policy with 2 swords, dragon damages both → each entry treated as separate damage with its own deductible", () => {
      const policy = makePolicy(
        [{ type: "sword" }, { type: "sword" }],
        4000,
      );
      const damages: Damage[] = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(processClaim(policy, damages)).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("policy with 1 sword but damages contains 2 sword entries → throws ClaimOfficeError", () => {
      const policy = makePolicy([{ type: "sword" }], 2000);
      const damages: Damage[] = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(() => processClaim(policy, damages)).toThrow(ClaimOfficeError);
    });
    it("policy with 2 swords but damages contains 3 sword entries → throws ClaimOfficeError", () => {
      const policy = makePolicy(
        [{ type: "sword" }, { type: "sword" }],
        4000,
      );
      const damages: Damage[] = [
        { itemType: "sword", amount: 100 },
        { itemType: "sword", amount: 100 },
        { itemType: "sword", amount: 100 },
      ];
      expect(() => processClaim(policy, damages)).toThrow(ClaimOfficeError);
    });
  });

  describe("cap exhaustion", () => {
    it("policy with sword + amulet → insurance sum 1600, cap 3200", () => {
      const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
      expect(policy.cap).toBe(3200);
    });
    it("policy with cursed sword → cap 2000 (based on unmodified insurance value)", () => {
      const policy = createPolicy([{ type: "sword", cursed: true }]);
      expect(policy.cap).toBe(2000);
    });
    it("policy with sword + 3 runes (block) → insurance sum 1750, block discount does not affect insurance", () => {
      const policy = createPolicy([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]);
      expect(policy.cap).toBe(3500);
    });
    it("sword cap 2000, two successive claims of 1500 → first payout 1400 remaining 600, second payout 600 remaining 0", () => {
      const policy = makePolicy([{ type: "sword" }], 2000);
      const damages: Damage[] = [{ itemType: "sword", amount: 1500 }];
      const first = processClaim(policy, damages);
      expect(first).toEqual({ payout: 1400, remainingCap: 600 });
      const updatedPolicy: Policy = {
        ...policy,
        paidOut: first.payout,
      };
      const second = processClaim(updatedPolicy, damages);
      expect(second).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("rounding in MHPCO's favor", () => {
    it("payout calculation 350.5 → final 350 (rounded down)", () => {
      const policy = makePolicy([{ type: "sword", enchantment: 9 }], 2000);
      const damages: Damage[] = [{ itemType: "sword", amount: 901 }];
      expect(processClaim(policy, damages)).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("error cases", () => {
    it("claim with damage to item not in policy → throws ClaimOfficeError", () => {
      const policy = makePolicy([{ type: "sword" }], 2000);
      const damages: Damage[] = [{ itemType: "amulet", amount: 200 }];
      expect(() => processClaim(policy, damages)).toThrow(ClaimOfficeError);
    });
    it("claim with damage amount -200 → throws ClaimOfficeError", () => {
      const policy = makePolicy([{ type: "sword" }], 2000);
      const damages: Damage[] = [{ itemType: "sword", amount: -200 }];
      expect(() => processClaim(policy, damages)).toThrow(ClaimOfficeError);
    });
    it("claim with damage to unknown item type → throws ClaimOfficeError", () => {
      const policy = makePolicy([{ type: "sword" }], 2000);
      const damages: Damage[] = [{ itemType: "broomstick", amount: 200 }];
      expect(() => processClaim(policy, damages)).toThrow(ClaimOfficeError);
    });
  });
});
