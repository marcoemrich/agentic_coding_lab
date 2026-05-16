import { describe, it, expect } from "vitest";
import { processClaim } from "./claims.js";
import type { PolicyRecord } from "./types.js";

describe("processClaim", () => {
  it("applies deductible per incident", () => {
    const policy: PolicyRecord = {
      items: [{ type: "amulet", material: "silver", enchantment: 2 }],
      insuranceSum: 600,
      remainingCap: 1200,
    };
    const result = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 200 }],
    });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1100);
  });

  it("returns 0 payout when damage less than deductible", () => {
    const policy: PolicyRecord = {
      items: [{ type: "sword", material: "steel", enchantment: 1 }],
      insuranceSum: 1000,
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 50 }],
    });
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it("reimburses high-enchant items at 50%", () => {
    const policy: PolicyRecord = {
      items: [{ type: "staff", material: "oak", enchantment: 8 }],
      insuranceSum: 800,
      remainingCap: 1600,
    };
    // damage 400 × 0.5 = 200; -100 deductible = 100
    const result = processClaim(policy, {
      damages: [{ itemType: "staff", amount: 400 }],
    });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1500);
  });

  it("fully reimburses dragon material", () => {
    const policy: PolicyRecord = {
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
      insuranceSum: 1000,
      remainingCap: 2000,
    };
    // dragon overrides high-enchant: damage 500 × 1 = 500, -100 = 400
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("caps payout at remaining cap", () => {
    const policy: PolicyRecord = {
      items: [{ type: "sword", material: "steel", enchantment: 1 }],
      insuranceSum: 1000,
      remainingCap: 50,
    };
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(50);
    expect(result.remainingCap).toBe(0);
  });

  it("sums damages across multiple items in one incident", () => {
    const policy: PolicyRecord = {
      items: [
        { type: "sword", material: "steel", enchantment: 1 },
        { type: "amulet", material: "silver", enchantment: 2 },
      ],
      insuranceSum: 1600,
      remainingCap: 3200,
    };
    const result = processClaim(policy, {
      damages: [
        { itemType: "sword", amount: 200 },
        { itemType: "amulet", amount: 150 },
      ],
    });
    // gross = 350, -100 deductible = 250
    expect(result.payout).toBe(250);
    expect(result.remainingCap).toBe(2950);
  });
});
