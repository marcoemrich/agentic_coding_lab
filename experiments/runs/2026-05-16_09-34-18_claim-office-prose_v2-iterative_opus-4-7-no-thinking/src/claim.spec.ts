import { describe, it, expect } from "vitest";
import { processClaim } from "./claim.js";
import type { Policy } from "./types.js";

function makePolicy(items: Policy["items"]): Policy {
  const insuranceSum = 1000;
  const cap = 2000;
  return { items, insuranceSum, cap, remainingCap: cap };
}

describe("processClaim", () => {
  it("subtracts 100G deductible from damage", () => {
    const policy = makePolicy([
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ]);
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 200 }],
    });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1900);
  });

  it("payout cannot be negative when damage is below deductible", () => {
    const policy = makePolicy([
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ]);
    const result = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 50 }],
    });
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it("high-enchantment item (>= 8) reimbursed at 50%", () => {
    const policy = makePolicy([
      { type: "staff", material: "oak", enchantment: 10, cursed: false },
    ]);
    // damage 600 -> 300 reimbursable -> 300 - 100 = 200
    const result = processClaim(policy, {
      damages: [{ itemType: "staff", amount: 600 }],
    });
    expect(result.payout).toBe(200);
    expect(result.remainingCap).toBe(1800);
  });

  it("dragon material fully reimbursed", () => {
    const policy = makePolicy([
      { type: "sword", material: "dragon", enchantment: 3, cursed: false },
    ]);
    // damage 500 - 100 = 400
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });

  it("dragon material overrides high-enchantment 50% rule", () => {
    const policy = makePolicy([
      { type: "sword", material: "dragon", enchantment: 10, cursed: false },
    ]);
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });

  it("payout capped at twice the insurance sum (across claims)", () => {
    const policy = makePolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    ]);
    // First claim: 2000 damage - 100 deductible = 1900 payout. remaining 100.
    const r1 = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 2000 }],
    });
    expect(r1.payout).toBe(1900);
    expect(r1.remainingCap).toBe(100);

    // Second claim: would pay 900 but cap is 100
    const r2 = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(r2.payout).toBe(100);
    expect(r2.remainingCap).toBe(0);

    // Third claim: nothing left
    const r3 = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(r3.payout).toBe(0);
    expect(r3.remainingCap).toBe(0);
  });

  it("one deductible per incident, not per damaged item", () => {
    const policy = makePolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ]);
    // 300 + 200 = 500 reimbursable - 100 = 400
    const result = processClaim(policy, {
      damages: [
        { itemType: "sword", amount: 300 },
        { itemType: "amulet", amount: 200 },
      ],
    });
    expect(result.payout).toBe(400);
  });
});
