import { describe, it, expect } from "vitest";
import { calculateDamagePayout, processClaim, validateDamageAmounts } from "./claims";
import type { Item } from "./types";

describe("Claims - Damage Payout Calculation", () => {
  it("should apply 100 G deductible per damage event", () => {
    // Regular sword (steel, enchantment 3), damage 500 G
    // → payout 400 G (full reimbursement minus 100 G deductible; no special clause applies)
    const item: Item = { type: "sword", material: "steel", enchantment: 3 };
    expect(calculateDamagePayout(item, 500)).toBe(400);
  });

  it("should handle damage to components with no special clauses", () => {
    // rune (no material/enchantment), damage 200 G
    // → payout 100 G (200 - 100 deductible)
    const item: Item = { type: "rune" };
    expect(calculateDamagePayout(item, 200)).toBe(100);
  });

  it("should apply 50% reduction for high enchantment (>= 8)", () => {
    // high enchantment sword (enchantment 8), damage 1000 G
    // → 50% reduction: 500, then deductible: 500 - 100 = 400
    const item: Item = { type: "sword", enchantment: 8 };
    expect(calculateDamagePayout(item, 1000)).toBe(400);
  });

  it("should apply 50% reduction for enchantment 9", () => {
    // steel sword, enchantment 9, damage 1000 G
    // → payout 400 G (50% of 1000 = 500, then 500 - 100 deductible)
    const item: Item = { type: "sword", material: "steel", enchantment: 9 };
    expect(calculateDamagePayout(item, 1000)).toBe(400);
  });

  it("should fully reimburse dragon material (no enchantment)", () => {
    // dragon-material sword, enchantment 5, damage 800 G
    // → payout 700 G (full reimbursement 800 - 100 deductible)
    const item: Item = { type: "sword", material: "dragon", enchantment: 5 };
    expect(calculateDamagePayout(item, 800)).toBe(700);
  });

  it("should apply 50% rule when both dragon material and high enchantment apply", () => {
    // dragon-material sword, enchantment 9, damage 1000 G
    // → payout 400 G (50% rule wins: 1000 * 0.5 = 500, then 500 - 100 deductible)
    const item: Item = { type: "sword", material: "dragon", enchantment: 9 };
    expect(calculateDamagePayout(item, 1000)).toBe(400);
  });

  it("should apply 50% rule when both clauses apply (dragon + enchantment 8)", () => {
    // dragon-material sword with exactly enchantment 8, damage 1000 G
    // → payout 400 G (50% rule wins: 500 - 100 deductible)
    const item: Item = { type: "sword", material: "dragon", enchantment: 8 };
    expect(calculateDamagePayout(item, 1000)).toBe(400);
  });

  it("should not apply reduction if damage is less than deductible", () => {
    // Damage 50 G < deductible 100 G → payout 0
    const item: Item = { type: "sword" };
    expect(calculateDamagePayout(item, 50)).toBe(0);
  });

  it("should round down in customer's disfavor (floor)", () => {
    // 50% of 501 = 250.5, then deductible: 250.5 - 100 = 150.5 → floor to 150
    const item: Item = { type: "sword", enchantment: 8 };
    expect(calculateDamagePayout(item, 501)).toBe(150);
  });
});

describe("Claims - Damage Validation", () => {
  it("should reject negative damage amounts", () => {
    expect(() => validateDamageAmounts([{ itemType: "sword", amount: -200 }])).toThrow();
  });

  it("should accept zero damage", () => {
    expect(() => validateDamageAmounts([{ itemType: "sword", amount: 0 }])).not.toThrow();
  });

  it("should accept positive damage", () => {
    expect(() => validateDamageAmounts([{ itemType: "sword", amount: 500 }])).not.toThrow();
  });
});

describe("Claims - Full Claim Processing", () => {
  it("should process single item damage with cap tracking", () => {
    const policyItems: Item[] = [{ type: "sword" }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 500 }],
    };
    const capRemaining = 2000; // sword cap = 1000 * 2

    const result = processClaim(policyItems, incident, capRemaining);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("should handle multiple damages to different items", () => {
    // sword (cap 2000) + amulet (cap 1200) = cap 3200
    const policyItems: Item[] = [{ type: "sword" }, { type: "amulet" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "amulet" as const, amount: 300 },
      ],
    };
    const capRemaining = 3200;

    const result = processClaim(policyItems, incident, capRemaining);
    // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total 600
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });

  it("should apply cap limit to payout", () => {
    const policyItems: Item[] = [{ type: "sword" }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 2500 }],
    };
    const capRemaining = 1500; // less than full payout

    const result = processClaim(policyItems, incident, capRemaining);
    // Damage: 2500 - 100 = 2400, but cap is 1500
    expect(result.payout).toBe(1500);
    expect(result.remainingCap).toBe(0);
  });

  it("should reject claim for uninsured item", () => {
    const policyItems: Item[] = [{ type: "sword" }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "amulet" as const, amount: 300 }],
    };

    expect(() => processClaim(policyItems, incident, 2000)).toThrow();
  });

  it("should reject claim with more items than policy covers", () => {
    const policyItems: Item[] = [{ type: "sword" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "sword" as const, amount: 600 },
      ],
    };

    expect(() => processClaim(policyItems, incident, 2000)).toThrow();
  });

  it("should handle successive claims with cap exhaustion", () => {
    // sword (cap 2000)
    const policyItems: Item[] = [{ type: "sword" }];
    const incident1 = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 1500 }],
    };

    // First claim: damage 1500, payout after deductible: 1400, cap remaining: 600
    const result1 = processClaim(policyItems, incident1, 2000);
    expect(result1.payout).toBe(1400);
    expect(result1.remainingCap).toBe(600);

    // Second claim
    const incident2 = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 1500 }],
    };
    const result2 = processClaim(policyItems, incident2, result1.remainingCap);
    // Desired payout: 1400, but cap remaining is 600, so payout: 600
    expect(result2.payout).toBe(600);
    expect(result2.remainingCap).toBe(0);
  });

  it("should handle damage with multiple items of same type", () => {
    const policyItems: Item[] = [{ type: "sword" }, { type: "sword" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "sword" as const, amount: 500 },
      ],
    };
    const capRemaining = 4000;

    const result = processClaim(policyItems, incident, capRemaining);
    // Each sword: 500 - 100 = 400; total 800
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });
});
