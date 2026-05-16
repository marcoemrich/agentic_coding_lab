import { describe, it, expect } from "vitest";
import { processClaim } from "./claims.js";
import type { Policy } from "./types.js";

function makePolicy(items: Policy["items"]): Policy {
  const insuranceSum = items.reduce((acc, i) => {
    if (i.type === "sword") return acc + 1000;
    if (i.type === "amulet") return acc + 600;
    if (i.type === "staff") return acc + 800;
    if (i.type === "potion") return acc + 400;
    return acc + 250;
  }, 0);
  return { items, insuranceSum, cap: 2 * insuranceSum, paidOut: 0 };
}

describe("processClaim", () => {
  it("applies 100 G deductible", () => {
    const policy = makePolicy([
      { type: "amulet", material: "silver", enchantment: 2 },
    ]);
    const outcome = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 200 }],
    });
    expect(outcome.payout).toBe(100); // 200 - 100
    expect(outcome.remainingCap).toBe(2 * 600 - 100);
  });

  it("deductible cannot make payout negative", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const outcome = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 50 }],
    });
    expect(outcome.payout).toBe(0);
    expect(outcome.remainingCap).toBe(2000);
  });

  it("highly enchanted item (>=8) reimbursed at 50%", () => {
    const policy = makePolicy([
      { type: "sword", material: "steel", enchantment: 8 },
    ]);
    const outcome = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // 500 * 0.5 = 250; -100 deduct = 150
    expect(outcome.payout).toBe(150);
  });

  it("dragon material fully reimbursed even with high enchantment", () => {
    const policy = makePolicy([
      { type: "sword", material: "dragon", enchantment: 9 },
    ]);
    const outcome = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // 500 * 1.0 = 500; -100 = 400
    expect(outcome.payout).toBe(400);
  });

  it("caps payout at 2x insurance sum across multiple claims", () => {
    const policy = makePolicy([{ type: "amulet" }]);
    // cap = 1200
    const first = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 1000 }],
    });
    expect(first.payout).toBe(900); // 1000 - 100
    expect(first.remainingCap).toBe(300);

    const second = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 1000 }],
    });
    // 1000 - 100 = 900 but cap remaining is 300
    expect(second.payout).toBe(300);
    expect(second.remainingCap).toBe(0);
  });

  it("handles multiple damages in one incident", () => {
    const policy = makePolicy([
      { type: "sword", material: "steel" },
      { type: "amulet", material: "silver" },
    ]);
    const outcome = processClaim(policy, {
      damages: [
        { itemType: "sword", amount: 300 },
        { itemType: "amulet", amount: 200 },
      ],
    });
    // 500 total - 100 deductible = 400
    expect(outcome.payout).toBe(400);
  });
});
