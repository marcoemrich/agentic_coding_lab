import { describe, it, expect } from "vitest";
import { claim, insuranceSum, policyCap } from "./claim.js";

describe("claim", () => {
  // Standard reimbursement (no special clauses)
  it("steel sword ench 3, damage 500 G -> payout 400 G (full minus 100 deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "steel", enchantment: 3 }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    });
    expect(result.payout).toBe(400);
  });
  it("rune (no enchantment, no material), damage 200 G -> payout 100 G (full minus 100 deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "rune" }], remainingCap: 500 },
      incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
    });
    expect(result.payout).toBe(100);
  });

  // Enchantment threshold vs dragon material
  it("dragon-material sword ench 8, damage 1000 G -> payout 400 G (high-ench 50% then deductible: 500 - 100)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "dragon", enchantment: 8 }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword ench 9, damage 1000 G -> payout 400 G (both clauses; 50% wins, then deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "dragon", enchantment: 9 }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword ench 5, damage 800 G -> payout 700 G (only dragon clause: full reimbursement minus deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "dragon", enchantment: 5 }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
    });
    expect(result.payout).toBe(700);
  });
  it("steel sword ench 9, damage 1000 G -> payout 400 G (only high-ench clause: 50% then deductible)", () => {
    const result = claim({
      policy: { items: [{ type: "sword", material: "steel", enchantment: 9 }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    });
    expect(result.payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (deductible applied once per damaged item)", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }, { type: "amulet" }], remainingCap: 3200 },
      incident: {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      },
    });
    expect(result.payout).toBe(600);
  });

  // Multiple items of the same type
  it("policy covers two swords, damage to both -> each entry gets its own deductible", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }, { type: "sword" }], remainingCap: 4000 },
      incident: {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ],
      },
    });
    // (500-100) + (400-100) = 700
    expect(result.payout).toBe(700);
  });
  it("policy covers one sword but claim has two sword damages -> claim is rejected", () => {
    expect(() => claim({
      policy: { items: [{ type: "sword" }], remainingCap: 2000 },
      incident: {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ],
      },
    })).toThrow();
  });

  // Cap exhaustion
  it("policy covers sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(insuranceSum(items)).toBe(1600);
    expect(policyCap(items)).toBe(3200);
  });
  it("cursed sword -> cap 2000 G based on unmodified insurance value (premium modifiers don't raise cap)", () => {
    expect(policyCap([{ type: "sword", cursed: true, enchantment: 9 }])).toBe(2000);
  });
  it("sword + 3 runes (block) -> insurance sum 1750 G, cap 3500 G (block discount affects premium only)", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(insuranceSum(items)).toBe(1750);
    expect(policyCap(items)).toBe(3500);
  });
  it("sword (cap 2000) first claim 1500 -> payout 1400, cap remaining 600", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword (cap 2000) second claim 1500 against cap remaining 600 -> payout 600, cap remaining 0", () => {
    const result = claim({
      policy: { items: [{ type: "sword" }], remainingCap: 600 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // Rounding payout
  it("payout calculation yielding 350.5 G rounds down to 350 G (MHPCO favor)", () => {
    // high-ench sword, damage 901: 901*0.5 = 450.5; -100 deductible = 350.5 -> floor 350.
    const result = claim({
      policy: { items: [{ type: "sword", enchantment: 8 }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
    });
    expect(result.payout).toBe(350);
  });

  // Edge cases
  it("claim references item not in policy -> throws error", () => {
    expect(() => claim({
      policy: { items: [{ type: "sword" }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
    })).toThrow();
  });
  it("claim contains damage entry with negative amount -> throws error", () => {
    expect(() => claim({
      policy: { items: [{ type: "sword" }], remainingCap: 2000 },
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
    })).toThrow();
  });
});
