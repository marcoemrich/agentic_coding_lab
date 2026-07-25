import { describe, it, expect } from "vitest";
import { createPolicy, processClaim, type Policy } from "./policy.js";

describe("createPolicy", () => {
  it("single sword → insurance sum 1000, cap 2000", () => {
    const p = createPolicy([{ type: "sword" }]);
    expect(p.insuranceSum).toBe(1000);
    expect(p.cap).toBe(2000);
  });
  it("sword + amulet → insurance sum 1600, cap 3200", () => {
    const p = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(p.insuranceSum).toBe(1600);
    expect(p.cap).toBe(3200);
  });
  it("two swords → insurance sum 2000, cap 4000", () => {
    const p = createPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(p.insuranceSum).toBe(2000);
    expect(p.cap).toBe(4000);
  });
  it("sword + 3 runes (block) → insurance sum 1750, cap 3500 (block affects premium only)", () => {
    const p = createPolicy([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]);
    expect(p.insuranceSum).toBe(1750);
    expect(p.cap).toBe(3500);
  });
  it("cursed sword (insurance 1000, premium 165) → cap 2000 (based on unmodified insurance value)", () => {
    const p = createPolicy([{ type: "sword", cursed: true }]);
    expect(p.insuranceSum).toBe(1000);
    expect(p.cap).toBe(2000);
  });
  it("policy remainingCap starts equal to cap", () => {
    const p = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(p.remainingCap).toBe(p.cap);
    expect(p.remainingCap).toBe(3200);
  });
});

describe("processClaim", () => {
  // -- Standard reimbursement --
  it("steel sword enchantment 3, damage 500 → payout 400 (500 - 100 deductible, no special clause)", () => {
    const policy = createPolicy([{ type: "sword", enchantment: 3 }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("rune damage 200 → payout 100 (200 - 100 deductible, no enchantment/material on runes)", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });

  // -- High enchantment clause --
  it("steel sword enchantment 9, damage 1000 → payout 400 (50% first, then deductible: 500 - 100)", () => {
    const policy = createPolicy([{ type: "sword", enchantment: 9 }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("dragon material sword enchantment 9, damage 1000 → payout 400 (50% rule wins, then deductible: 500 - 100)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("dragon material sword enchantment 8, damage 1000 → payout 400 (high-enchantment clause applies, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // -- Dragon material clause (no high enchantment) --
  it("dragon material sword enchantment 5, damage 800 → payout 700 (full reimbursement, then deductible: 800 - 100)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });

  // -- Deductible per damage event --
  it("dragon attack on sword (500) + amulet (300) → payout 600 (400 + 200, deductible per damaged item)", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    const result = processClaim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] });
    expect(result.payout).toBe(600);
  });

  // -- Multiple damages of same type --
  it("policy with two swords, two sword damages → each damage treated independently with own deductible", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    const result = processClaim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] });
    expect(result.payout).toBe(600);
  });

  // -- Cap exhaustion --
  it("single sword (cap 2000), claim of 1500 → payout 1400, remainingCap 600", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("single sword, two successive claims of 1500 each → first payout 1400 cap remaining 600, second payout 600 cap remaining 0 (capped)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const r1 = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim({ ...policy, remainingCap: 600 }, { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  // -- Rounding --
  it("payout computation yielding 350.5 → final payout 350 (rounded down)", () => {
    // Construct a case where totalRaw = 350.5: one damage of 550.5 with no high-enchant.
    const policy = createPolicy([{ type: "sword" }]);
    const result = processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 450.5 }] });
    // 450.5 - 100 = 350.5 → floor → 350
    expect(result.payout).toBe(350);
  });

  // -- Errors --
  it("damage itemType not in policy → throws Error", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() => processClaim(policy, { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] })).toThrow();
  });
  it("damage amount negative → throws Error", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() => processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: -200 }] })).toThrow();
  });
  it("more damages of a given type than items in policy → throws Error", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() => processClaim(policy, { cause: "test", damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }] })).toThrow();
  });
  it("damage with unknown itemType → throws Error", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() => processClaim(policy, { cause: "test", damages: [{ itemType: "broomstick", amount: 200 }] })).toThrow();
  });
});
