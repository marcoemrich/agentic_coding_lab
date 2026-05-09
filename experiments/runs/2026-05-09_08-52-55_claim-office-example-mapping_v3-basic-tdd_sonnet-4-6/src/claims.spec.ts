import { describe, it, expect } from "vitest";
import { processClaim } from "./claims.js";
import type { ItemInput, IncidentInput, Policy } from "./types.js";

function makePolicy(items: ItemInput[]): Policy {
  const INSURANCE_VALUES: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
    rune: 250,
    moonstone: 250,
  };
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

describe("standard reimbursement", () => {
  it("regular sword (steel, enchantment 3), damage 500 → payout 400", () => {
    const policy = makePolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const incident: IncidentInput = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 500 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(2000 - 400);
  });

  it("rune, damage 200 → payout 100", () => {
    const policy = makePolicy([{ type: "rune" }]);
    const incident: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "rune", amount: 200 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(500 - 100);
  });
});

describe("enchantment threshold", () => {
  it("sword with enchantment 8, damage 1000 → payout 400 (50% - deductible)", () => {
    const policy = makePolicy([{ type: "sword", enchantment: 8 }]);
    const incident: IncidentInput = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400); // 1000 * 0.5 - 100
  });

  it("steel sword, enchantment 9, damage 1000 → payout 400", () => {
    const policy = makePolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const incident: IncidentInput = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });
});

describe("dragon material", () => {
  it("dragon-material sword, enchantment 5, damage 800 → payout 700 (full - deductible)", () => {
    const policy = makePolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const incident: IncidentInput = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 800 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(700);
  });

  it("dragon-material sword, enchantment 9, damage 1000 → payout 400 (high-enchant wins)", () => {
    const policy = makePolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const incident: IncidentInput = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });

  it("dragon-material sword, enchantment 8, damage 1000 → payout 400", () => {
    const policy = makePolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const incident: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });
});

describe("deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600", () => {
    const policy = makePolicy([{ type: "sword" }, { type: "amulet" }]);
    const incident: IncidentInput = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(600); // (500-100) + (300-100) = 400 + 200
  });
});

describe("cap exhaustion", () => {
  it("successive claims reduce cap", () => {
    // sword: insurance 1000, cap 2000
    // first claim: 1500 G damage → 1400 G payout, remaining cap 600
    const policy = makePolicy([{ type: "sword" }]);
    const incident1: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const result1 = processClaim(policy, incident1);
    expect(result1.payout).toBe(1400);
    expect(result1.remainingCap).toBe(600);

    // second claim uses updated policy
    const updatedPolicy = { ...policy, remainingCap: result1.remainingCap };
    const incident2: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const result2 = processClaim(updatedPolicy, incident2);
    expect(result2.payout).toBe(600);
    expect(result2.remainingCap).toBe(0);
  });
});

describe("rounding for payouts", () => {
  it("payout of 350.5 rounds down to 350", () => {
    // We need a case where the raw computation yields 350.5
    // enchantment 9 item, damage 801: 801 * 0.5 = 400.5, then -100 = 300.5 → floor = 300
    // Let's try damage 901: 901 * 0.5 = 450.5, -100 = 350.5 → floor = 350
    const policy = makePolicy([{ type: "sword", enchantment: 9 }]);
    const incident: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 901 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(350);
  });
});

describe("error cases", () => {
  it("claim references item not in policy → throws", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const incident: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 300 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it("more damage entries of a type than insured → throws", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const incident: IncidentInput = {
      cause: "fire",
      damages: [
        { itemType: "sword", amount: 300 },
        { itemType: "sword", amount: 400 },
      ],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it("negative damage amount → throws", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const incident: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: -200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it("unknown item type in damage → throws", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const incident: IncidentInput = {
      cause: "fire",
      damages: [{ itemType: "broomstick", amount: 200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });
});

describe("multiple items of same type", () => {
  it("two swords: insurance sum 2000, cap 4000", () => {
    const policy = makePolicy([{ type: "sword" }, { type: "sword" }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
    expect(policy.remainingCap).toBe(4000);
  });

  it("two swords damaged in dragon attack, each gets own deductible", () => {
    const policy = makePolicy([{ type: "sword" }, { type: "sword" }]);
    const incident: IncidentInput = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(800); // (500-100) + (500-100)
  });
});
