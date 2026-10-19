import { describe, it, expect } from "vitest";
import { insuranceSum, processClaim, type PolicyItem } from "./claim.js";

const sword: PolicyItem = { type: "sword" };

describe("MHPCO insurance sum", () => {
  it("should sum insurance values for a sword (1000) and amulet (600) -> 1600 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("should sum two swords -> 2000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it("should base insurance sum on unmodified values -- cursed sword -> 1000 G", () => {
    expect(insuranceSum([{ type: "sword", cursed: true }])).toBe(1000);
  });
  it("should count block components at full value -- sword + 3 runes -> 1750 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(1750);
  });
});

describe("MHPCO claim (payout)", () => {
  it("should reimburse a regular sword (steel, enchantment 3) with 500 G damage -> 400 G", () => {
    const r = processClaim([{ type: "sword", material: "steel", enchantment: 3 }], 2000, [
      { itemType: "sword", amount: 500 },
    ]);
    expect(r.payout).toBe(400);
    expect(r.remainingCap).toBe(1600);
  });

  it("should reimburse damage to a rune with 200 G damage -> 100 G", () => {
    const r = processClaim([{ type: "rune" }], 500, [{ itemType: "rune", amount: 200 }]);
    expect(r.payout).toBe(100);
  });

  it("should reimburse dragon sword enchantment 9 with 1000 G damage -> 400 G (50% then deductible)", () => {
    const r = processClaim([{ type: "sword", material: "dragon", enchantment: 9 }], 2000, [
      { itemType: "sword", amount: 1000 },
    ]);
    expect(r.payout).toBe(400);
  });

  it("should reimburse dragon sword enchantment 5 with 800 G damage -> 700 G (full then deductible)", () => {
    const r = processClaim([{ type: "sword", material: "dragon", enchantment: 5 }], 2000, [
      { itemType: "sword", amount: 800 },
    ]);
    expect(r.payout).toBe(700);
  });

  it("should reimburse steel sword enchantment 9 with 1000 G damage -> 400 G (50% then deductible)", () => {
    const r = processClaim([{ type: "sword", material: "steel", enchantment: 9 }], 2000, [
      { itemType: "sword", amount: 1000 },
    ]);
    expect(r.payout).toBe(400);
  });

  it("should reimburse dragon sword enchantment exactly 8 with 1000 G damage -> 400 G", () => {
    const r = processClaim([{ type: "sword", material: "dragon", enchantment: 8 }], 2000, [
      { itemType: "sword", amount: 1000 },
    ]);
    expect(r.payout).toBe(400);
  });

  it("should apply deductible once per damaged item -- sword 500 + amulet 300 -> 600 G", () => {
    const r = processClaim([{ type: "sword" }, { type: "amulet" }], 5000, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ]);
    expect(r.payout).toBe(600);
  });

  it("should round payout down in MHPCO's favor -- enchantment 9 steel sword damage 901 -> 350 G", () => {
    const r = processClaim([{ type: "sword", material: "steel", enchantment: 9 }], 2000, [
      { itemType: "sword", amount: 901 },
    ]);
    expect(r.payout).toBe(350);
  });

  it("should treat each damage entry as separate damage with its own deductible -- two swords -> 800 G", () => {
    const r = processClaim([{ type: "sword" }, { type: "sword" }], 4000, [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ]);
    expect(r.payout).toBe(800);
  });

  it("should exhaust cap across successive claims -- 1500 then 1500 on a sword", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3 }];
    const first = processClaim(policy, 2000, [{ itemType: "sword", amount: 1500 }]);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = processClaim(policy, first.remainingCap, [{ itemType: "sword", amount: 1500 }]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  it("should reject claim with more damages of a type than policy covers", () => {
    expect(() =>
      processClaim([{ type: "sword" }], 2000, [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]),
    ).toThrow();
  });

  it("should reject claim referencing damage to an item not in the policy", () => {
    expect(() =>
      processClaim([{ type: "sword" }], 2000, [{ itemType: "amulet", amount: 200 }]),
    ).toThrow();
  });

  it("should reject claim referencing an unknown item type", () => {
    expect(() =>
      processClaim([{ type: "sword" }], 2000, [{ itemType: "broomstick", amount: 200 }]),
    ).toThrow();
  });

  it("should reject claim with negative damage amount", () => {
    expect(() =>
      processClaim([{ type: "sword" }], 2000, [{ itemType: "sword", amount: -200 }]),
    ).toThrow();
  });
});