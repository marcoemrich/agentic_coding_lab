import { describe, expect, it } from "vitest";
import { processClaim } from "./claim.js";
import { makePolicy } from "./quote.js";

describe("processClaim", () => {
  it("does not reimburse damage to ordinary items", () => {
    const policy = makePolicy([{ type: "amulet", material: "silver", enchantment: 2 }]);
    const before = policy.remainingCap;
    const result = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 300 }],
    });
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(before);
  });

  it("reimburses dragon-material items fully (minus deductible)", () => {
    const policy = makePolicy([{ type: "sword", material: "dragon" }]);
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // 500 - 100 deductible = 400
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(2000 - 400);
  });

  it("reimburses highly enchanted items at 50% (minus deductible)", () => {
    const policy = makePolicy([{ type: "staff", material: "wood", enchantment: 8 }]);
    const result = processClaim(policy, {
      damages: [{ itemType: "staff", amount: 600 }],
    });
    // 600 * 0.5 = 300, - 100 = 200
    expect(result.payout).toBe(200);
    expect(result.remainingCap).toBe(1600 - 200);
  });

  it("applies a single deductible per claim (not per damage line)", () => {
    const policy = makePolicy([
      { type: "sword", material: "dragon" },
      { type: "amulet", material: "dragon" },
    ]);
    const result = processClaim(policy, {
      damages: [
        { itemType: "sword", amount: 200 },
        { itemType: "amulet", amount: 100 },
      ],
    });
    // (200 + 100) - 100 deductible = 200
    expect(result.payout).toBe(200);
  });

  it("clamps payout to zero when deductible exceeds eligible amount", () => {
    const policy = makePolicy([{ type: "sword", material: "dragon" }]);
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 50 }],
    });
    expect(result.payout).toBe(0);
  });

  it("caps total payout at twice the insurance sum across claims", () => {
    const policy = makePolicy([{ type: "potion", material: "dragon" }]);
    // insurance sum = 400, cap = 800
    const first = processClaim(policy, {
      damages: [{ itemType: "potion", amount: 700 }],
    });
    // 700 - 100 = 600
    expect(first.payout).toBe(600);
    expect(first.remainingCap).toBe(200);

    const second = processClaim(policy, {
      damages: [{ itemType: "potion", amount: 1000 }],
    });
    // eligible = 1000, -100 = 900, but cap remaining = 200
    expect(second.payout).toBe(200);
    expect(second.remainingCap).toBe(0);

    const third = processClaim(policy, {
      damages: [{ itemType: "potion", amount: 500 }],
    });
    expect(third.payout).toBe(0);
    expect(third.remainingCap).toBe(0);
  });

  it("prefers dragon (100%) over high enchantment (50%) when both apply", () => {
    const policy = makePolicy([
      { type: "sword", material: "dragon", enchantment: 9 },
    ]);
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 300 }],
    });
    expect(result.payout).toBe(200); // 300 - 100
  });
});
