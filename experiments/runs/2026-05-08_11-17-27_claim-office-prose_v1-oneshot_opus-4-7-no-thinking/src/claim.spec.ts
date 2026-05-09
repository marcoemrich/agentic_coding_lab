import { describe, expect, it } from "vitest";
import { processClaim } from "./claim.js";
import { buildPolicy } from "./quote.js";

describe("processClaim", () => {
  it("does not pay for damage to ordinary low-enchantment items", () => {
    const policy = buildPolicy([
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ]);
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 200 }],
    });
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(1200);
  });

  it("pays 50% for damage to highly enchanted items, less the 100 G deductible", () => {
    const policy = buildPolicy([
      { type: "staff", material: "oak", enchantment: 9, cursed: false },
    ]);
    const result = processClaim(policy, {
      cause: "lightning",
      damages: [{ itemType: "staff", amount: 600 }],
    });
    // gross = 300, payout = 300 - 100 = 200
    expect(result.payout).toBe(200);
    expect(result.remainingCap).toBe(1600 - 200);
  });

  it("fully reimburses dragon-material damage less the deductible", () => {
    const policy = buildPolicy([
      { type: "sword", material: "dragon", enchantment: 3, cursed: false },
    ]);
    const result = processClaim(policy, {
      cause: "battle",
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // gross = 500, payout = 500 - 100 = 400
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(2000 - 400);
  });

  it("caps total payout at twice the insurance sum across multiple claims", () => {
    const policy = buildPolicy([
      { type: "sword", material: "dragon", enchantment: 3, cursed: false },
    ]);
    // first claim: gross 3000, payout = 2900, but cap is 2000 → 2000
    const r1 = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 3000 }],
    });
    expect(r1.payout).toBe(2000);
    expect(r1.remainingCap).toBe(0);

    // subsequent claim: cap is exhausted
    const r2 = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(r2.payout).toBe(0);
    expect(r2.remainingCap).toBe(0);
  });

  it("returns 0 when reimbursable amount does not exceed deductible", () => {
    const policy = buildPolicy([
      { type: "staff", material: "oak", enchantment: 8, cursed: false },
    ]);
    const result = processClaim(policy, {
      damages: [{ itemType: "staff", amount: 100 }],
    });
    // 50% of 100 = 50, minus 100 deductible = 0 (clamped)
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(1600);
  });
});
