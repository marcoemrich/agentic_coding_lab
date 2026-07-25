import { describe, it, expect } from "vitest";
import { computeClaim } from "./claims.js";

describe("Claims", () => {
  // Standard reimbursement (no special clauses)
  it("computeClaim pays 400 G for a regular sword (steel, enchantment 3) with 500 G damage (full reimbursement minus 100 G deductible; no special clause applies)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 3 }];
    const damages = [{ itemType: "sword", amount: 500 }];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(400);
  });
  it("computeClaim pays 100 G for a rune (insurance value 250 G) with 200 G damage (full reimbursement minus deductible; runes have no enchantment level or material, so no special clause applies)", () => {
    const policyItems = [{ type: "rune" }];
    const damages = [{ itemType: "rune", amount: 200 }];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(100);
  });

  // Enchantment threshold vs. dragon material
  it("computeClaim pays 400 G for a dragon-material sword, enchantment 9, damage 1000 G (both clauses apply; the 50% rule wins, then deductible: 500-100)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(400);
  });
  it("computeClaim pays 700 G for a dragon-material sword, enchantment 5, damage 800 G (only the dragon-material clause applies: full reimbursement, then deductible: 800-100)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const damages = [{ itemType: "sword", amount: 800 }];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(700);
  });
  it("computeClaim pays 400 G for a steel sword, enchantment 9, damage 1000 G (only the high-enchantment clause applies: 50% first, then deductible: 500-100)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(400);
  });

  // Modifier thresholds (claim side)
  it("computeClaim pays 400 G for a dragon-material sword with exactly enchantment 8, damage 1000 G (high-enchantment clause applies, then deductible)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(400);
  });

  // Deductible per damage event
  it("computeClaim pays 600 G total for a dragon attack damaging an insured sword (500 G) and an insured amulet (300 G), deductible applied once per damaged item", () => {
    const policyItems = [{ type: "sword" }, { type: "amulet" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(600);
  });

  // Multiple items of the same type
  it("computeClaim treats two damage entries of {itemType: sword} on a two-sword policy as separate damages, each with its own deductible", () => {
    const policyItems = [{ type: "sword" }, { type: "sword" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(600);
  });
  it("computeClaim rejects a claim (throws) when damages contain more entries of a type than the policy covers (e.g. two sword damages but only one sword insured)", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ];
    expect(() => computeClaim(policyItems, damages, 0)).toThrow();
  });

  // Cap exhaustion
  it("computeClaim caps a cursed sword's claim at 2000 G based on the unmodified insurance value of 1000 G (premium modifiers do not raise the cap)", () => {
    const policyItems = [{ type: "sword", cursed: true }];
    const damages = [{ itemType: "sword", amount: 5000 }];
    const result = computeClaim(policyItems, damages, 0);
    expect(result.payout).toBe(2000);
    expect(result.remainingCap).toBe(0);
  });
  it("computeClaim pays 1400 G and leaves 600 G remaining cap for a first 1500 G claim against a 1000 G insured sword (cap 2000 G)", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = computeClaim(policyItems, damages, 0);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("computeClaim pays 600 G and leaves 0 G remaining cap for a second successive 1500 G claim against the same sword after the first claim already used 1400 G of the 2000 G cap", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = computeClaim(policyItems, damages, 1400);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // Rounding in the MHPCO's favor
  it("computeClaim rounds a payout of 350.5 G down to 350 G", () => {
    const policyItems = [{ type: "sword", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 901 }];
    expect(computeClaim(policyItems, damages, 0).payout).toBe(350);
  });

  // Edge cases (validation)
  it("computeClaim rejects a claim (throws) when a damage entry references an item not part of the policy (e.g. amulet damaged when only a sword is insured)", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [{ itemType: "amulet", amount: 200 }];
    expect(() => computeClaim(policyItems, damages, 0)).toThrow();
  });
  it("computeClaim rejects a claim (throws) when a damage entry references an unknown item type", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [{ itemType: "broomstick", amount: 200 }];
    expect(() => computeClaim(policyItems, damages, 0)).toThrow();
  });
  it("computeClaim rejects a claim (throws) when a damage entry has amount: -200", () => {
    const policyItems = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: -200 }];
    expect(() => computeClaim(policyItems, damages, 0)).toThrow();
  });
});
