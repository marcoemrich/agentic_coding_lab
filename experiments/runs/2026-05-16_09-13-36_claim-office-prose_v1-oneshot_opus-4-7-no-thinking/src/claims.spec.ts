import { describe, it, expect } from "vitest";
import { processClaim } from "./claims.js";
import { Policy } from "./types.js";

function makePolicy(): Policy {
  return {
    items: [
      { type: "sword", material: "steel", enchantment: 9, cursed: false },
      { type: "amulet", material: "dragon", enchantment: 2, cursed: false },
      { type: "potion", material: "glass", enchantment: 3, cursed: false },
    ],
    insuranceSum: 1000 + 600 + 400,
    remainingCap: (1000 + 600 + 400) * 2,
  };
}

describe("processClaim", () => {
  it("high enchantment item: 50% reimbursement minus deductible", () => {
    const policy = makePolicy();
    // damage 400 to sword (ench 9): 400*0.5=200; -100 deductible = 100
    const r = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 400 }],
    });
    expect(r.payout).toBe(100);
    expect(r.remainingCap).toBe(4000 - 100);
  });

  it("dragon material item: full reimbursement minus deductible", () => {
    const policy = makePolicy();
    // amulet dragon, 500 dmg -> 500 - 100 = 400
    const r = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 500 }],
    });
    expect(r.payout).toBe(400);
  });

  it("non-covered item: payout 0", () => {
    const policy = makePolicy();
    // potion: not enchanted >=8, not dragon. 0 reimbursable, payout 0
    const r = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "potion", amount: 300 }],
    });
    expect(r.payout).toBe(0);
    expect(r.remainingCap).toBe(4000);
  });

  it("multiple damages in one incident share one deductible", () => {
    const policy = makePolicy();
    // sword 9, dmg 400 -> 200; amulet dragon, dmg 200 -> 200; total 400 - 100 = 300
    const r = processClaim(policy, {
      cause: "fire",
      damages: [
        { itemType: "sword", amount: 400 },
        { itemType: "amulet", amount: 200 },
      ],
    });
    expect(r.payout).toBe(300);
  });

  it("payout capped at remaining policy cap", () => {
    const policy = makePolicy();
    policy.remainingCap = 50;
    const r = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 5000 }],
    });
    expect(r.payout).toBe(50);
    expect(r.remainingCap).toBe(0);
  });

  it("damage below deductible yields 0 payout", () => {
    const policy = makePolicy();
    const r = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 100 }], // 100*0.5=50, < 100 deductible
    });
    expect(r.payout).toBe(0);
  });
});
