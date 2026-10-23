import { describe, expect, it } from "vitest";
import { claimPayout, damagePayout, policyCap, processClaim } from "./claim.js";

// Inactive test list for claim (payout) behavior.
// Activate exactly one entry per Predictive TDD cycle.
describe("MHPCO claim", () => {
  it("regular steel sword (enchantment 3) damage 500 -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
    expect(damagePayout({ type: "sword", material: "steel", enchantment: 3 }, 500)).toBe(400);
  });
  it("rune (insurance value 250 G) damage 200 -> payout 100 G (no special clause applies)", () => {
    expect(damagePayout({ type: "rune" }, 200)).toBe(100);
  });
  it("deductible applies once per damaged item: sword 500 + amulet 300 -> payout 600 G", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet", enchantment: 1 }];
    expect(
      claimPayout(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ]),
    ).toBe(600);
  });
  it("steel sword with enchantment 7 damage 1000 -> payout 900 G (no high-enchantment clause)", () => {
    expect(damagePayout({ type: "sword", material: "steel", enchantment: 7 }, 1000)).toBe(900);
  });
  it("steel sword with enchantment 8 damage 1000 -> payout 400 G (50 % clause at the boundary, then deductible)", () => {
    expect(damagePayout({ type: "sword", material: "steel", enchantment: 8 }, 1000)).toBe(400);
  });
  it("dragon-material sword with enchantment 5 damage 800 -> payout 700 G (full reimbursement, then deductible)", () => {
    expect(damagePayout({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toBe(700);
  });
  it("dragon-material sword with enchantment 9 damage 1000 -> payout 400 G (50 % rule wins, then deductible)", () => {
    expect(damagePayout({ type: "sword", material: "dragon", enchantment: 9 }, 1000)).toBe(400);
  });
  it("steel sword with enchantment 9 damage 1000 -> payout 400 G (only the high-enchantment clause)", () => {
    expect(damagePayout({ type: "sword", material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });
  it("payout 350.5 G is rounded down in the MHPCO's favor (enchantment 8, damage 901 -> 350 G)", () => {
    expect(damagePayout({ type: "sword", material: "steel", enchantment: 8 }, 901)).toBe(350);
  });
  it("sword + amulet policy -> insurance sum 1600 G and cap 3200 G", () => {
    expect(policyCap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
  });
  it("cursed sword -> cap 2000 G based on the unmodified insurance value", () => {
    expect(policyCap([{ type: "sword", cursed: true, enchantment: 9 }])).toBe(2000);
  });
  it("sword + 3 runes block -> insurance sum 1750 G and cap 3500 G", () => {
    expect(policyCap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(3500);
  });
  it("two swords -> insurance sum 2000 G and cap 4000 G", () => {
    expect(policyCap([{ type: "sword" }, { type: "sword" }])).toBe(4000);
  });
  it("two sword damages are separate damages with their own deductible (500 + 500 -> payout 800, remainingCap 3200)", () => {
    const policy = [{ type: "sword" }, { type: "sword" }];
    expect(
      processClaim(
        policy,
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
        policyCap(policy),
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("successive claims: 1500 -> payout 1400 remainingCap 600; then 1500 -> payout 600 remainingCap 0 (desired 1400 reduced to the remaining cap)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3 }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const first = processClaim(policy, damages, policyCap(policy));
    const second = processClaim(policy, damages, first.remainingCap);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});
