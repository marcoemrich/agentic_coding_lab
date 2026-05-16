import { describe, it, expect } from "vitest";
import { processClaim } from "./claim.js";
import type { Policy } from "./types.js";

function makePolicy(items: Policy["items"], insuranceSum: number): Policy {
  return { items, insuranceSum, remainingCap: insuranceSum * 2 };
}

describe("processClaim", () => {
  it("applies 100G deductible", () => {
    const policy = makePolicy(
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      600,
    );
    const result = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 200 }],
    });
    // 200 * 1 - 100 = 100
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1100);
  });

  it("reduces remaining cap with each claim", () => {
    const policy = makePolicy(
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      600,
    );
    processClaim(policy, { damages: [{ itemType: "amulet", amount: 200 }] });
    const result = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 250 }],
    });
    // remaining cap was 1100. 250-100 = 150 payout. cap 950.
    expect(result.payout).toBe(150);
    expect(result.remainingCap).toBe(950);
  });

  it("payout never negative if damage below deductible", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      1000,
    );
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 50 }],
    });
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it("reimburses high enchantment items at 50%", () => {
    const policy = makePolicy(
      [{ type: "staff", material: "oak", enchantment: 9, cursed: false }],
      800,
    );
    const result = processClaim(policy, {
      damages: [{ itemType: "staff", amount: 600 }],
    });
    // 600 * 0.5 = 300. -100 deductible = 200.
    expect(result.payout).toBe(200);
    expect(result.remainingCap).toBe(1400);
  });

  it("reimburses dragon material items at 100%", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      1000,
    );
    const result = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // dragon overrides enchantment: 500 * 1 - 100 = 400.
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("caps payout at 2x insurance sum", () => {
    const policy = makePolicy(
      [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      400,
    );
    // Cap is 800.
    const result = processClaim(policy, {
      damages: [{ itemType: "potion", amount: 2000 }],
    });
    // 2000 - 100 = 1900, capped to 800.
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(0);
  });
});
