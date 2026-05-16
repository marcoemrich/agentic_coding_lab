import { describe, it, expect } from "vitest";
import { processClaim } from "../claim.js";
import type { Policy } from "../types.js";

function makePolicy(items: Policy["items"], insuranceSum: number): Policy {
  return { items, insuranceSum, remainingCap: 2 * insuranceSum };
}

describe("processClaim", () => {
  it("regular damage minus 100 G deductible", () => {
    const policy = makePolicy(
      [{ type: "amulet", material: "silver", enchantment: 2 }],
      600,
    );
    const r = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 200 }],
    });
    expect(r.payout).toBe(100);
    expect(r.remainingCap).toBe(1200 - 100);
  });

  it("damage smaller than deductible yields 0 payout", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "steel", enchantment: 0 }],
      1000,
    );
    const r = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 50 }],
    });
    expect(r.payout).toBe(0);
    expect(r.remainingCap).toBe(2000);
  });

  it("high enchantment (>=8) reimburses at 50%", () => {
    const policy = makePolicy(
      [{ type: "staff", material: "oak", enchantment: 8 }],
      800,
    );
    const r = processClaim(policy, {
      damages: [{ itemType: "staff", amount: 400 }],
    });
    // 400 * 0.5 = 200 - 100 deductible = 100
    expect(r.payout).toBe(100);
    expect(r.remainingCap).toBe(1600 - 100);
  });

  it("dragon material fully reimbursed, even with high enchantment", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      1000,
    );
    const r = processClaim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // dragon overrides enchantment penalty: full 500 - 100 = 400
    expect(r.payout).toBe(400);
    expect(r.remainingCap).toBe(2000 - 400);
  });

  it("payout capped at 2x insurance sum across multiple claims", () => {
    const policy = makePolicy(
      [{ type: "amulet", material: "silver", enchantment: 2 }],
      600,
    );
    // cap = 1200
    const r1 = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 1000 }],
    });
    expect(r1.payout).toBe(900); // 1000 - 100 = 900, within cap
    expect(r1.remainingCap).toBe(300);

    const r2 = processClaim(policy, {
      damages: [{ itemType: "amulet", amount: 1000 }],
    });
    // would-be 900, but cap remaining only 300
    expect(r2.payout).toBe(300);
    expect(r2.remainingCap).toBe(0);
  });

  it("one deductible per incident regardless of damage count", () => {
    const policy = makePolicy(
      [
        { type: "sword", material: "steel" },
        { type: "amulet", material: "silver" },
      ],
      1600,
    );
    const r = processClaim(policy, {
      damages: [
        { itemType: "sword", amount: 200 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    // total raw = 500, minus 100 = 400
    expect(r.payout).toBe(400);
  });
});
