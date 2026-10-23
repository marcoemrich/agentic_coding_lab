import { describe, it, expect } from "vitest";
import { processClaim } from "./claim.js";
import type { Policy } from "./types.js";

describe("Claim - Standard reimbursement (no special clauses)", () => {
  it("should fully reimburse steel sword (no high enchant, no dragon): damage 500 -> payout 400", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3 }],
      insuranceSum: 1000,
      cap: 2000,
      capRemaining: 2000,
    };
    const result = processClaim({
      policy,
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("should fully reimburse rune (no enchant, no material): damage 200 -> payout 100", () => {
    const policy: Policy = {
      items: [{ type: "rune" }],
      insuranceSum: 250,
      cap: 500,
      capRemaining: 500,
    };
    const result = processClaim({
      policy,
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });
});

describe("Claim - Dragon material clause (full reimbursement)", () => {
  it("should fully reimburse dragon sword (enchantment 5, below 8): damage 800 -> payout 700", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 5 }],
      insuranceSum: 1000,
      cap: 2000,
      capRemaining: 2000,
    };
    const result = processClaim({
      policy,
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });
});

describe("Claim - High enchantment clause (50% reimbursement, wins over dragon)", () => {
  it("should apply 50% rule on dragon sword enchantment 8 (50% wins): damage 1000 -> payout 400", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 8 }],
      insuranceSum: 1000,
      cap: 2000,
      capRemaining: 2000,
    };
    const result = processClaim({
      policy,
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it("should apply 50% rule on dragon sword enchantment 9 (both clauses, 50% wins): damage 1000 -> payout 400", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
      insuranceSum: 1000,
      cap: 2000,
      capRemaining: 2000,
    };
    const result = processClaim({
      policy,
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  it("should apply 50% rule on steel sword enchantment 9 (only high enchantment clause): damage 1000 -> payout 400", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9 }],
      insuranceSum: 1000,
      cap: 2000,
      capRemaining: 2000,
    };
    const result = processClaim({
      policy,
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
});

describe("Claim - Deductible per damage event", () => {
  it("should apply 100 G deductible per damaged item: sword 500 + amulet 300 -> payout 600", () => {
    const policy: Policy = {
      items: [{ type: "sword" }, { type: "amulet" }],
      insuranceSum: 1600,
      cap: 3200,
      capRemaining: 3200,
    };
    const result = processClaim({
      policy,
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
});

describe("Claim - Rounding in MHPCO's favor", () => {
  it("should round payout down to whole G (350.5 -> 350 G)", () => {
    // Damage 450.5 with no clauses: reimbursement = 450.5 - 100 deductible = 350.5
    const policy: Policy = {
      items: [{ type: "sword" }],
      insuranceSum: 1000,
      cap: 2000,
      capRemaining: 2000,
    };
    const result = processClaim({
      policy,
      damages: [{ itemType: "sword", amount: 450.5 }],
    });
    expect(result.payout).toBe(350);
  });
});

describe("Claim - Multiple damages to same item type", () => {
  it("should treat each damage entry as a separate event with its own deductible: two swords damaged 500 each -> payout 800", () => {
    const policy: Policy = {
      items: [{ type: "sword" }, { type: "sword" }],
      insuranceSum: 2000,
      cap: 4000,
      capRemaining: 4000,
    };
    const result = processClaim({
      policy,
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result.payout).toBe(800); // (500-100) + (500-100) = 800
  });

  it("should reject claim if damages array exceeds policy item count for that type", () => {
    const policy: Policy = {
      items: [{ type: "sword" }], // Only 1 sword
      insuranceSum: 1000,
      cap: 2000,
      capRemaining: 2000,
    };
    expect(() =>
      processClaim({
        policy,
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      })
    ).toThrow();
  });
});
