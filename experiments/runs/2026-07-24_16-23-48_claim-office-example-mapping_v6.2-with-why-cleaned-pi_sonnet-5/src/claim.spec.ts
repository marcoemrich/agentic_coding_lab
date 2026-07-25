import { describe, it, expect } from "vitest";
import { computeClaimPayout, computeCap } from "./claim.js";

describe("Claim - standard reimbursement", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -- payout 400 G (deductible only)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    const result = computeClaimPayout(policyItems, incident, 2000);
    expect(result.payout).toBe(400);
  });
  it("damage to a rune (insurance value 250 G), damage 200 G -- payout 100 G (deductible only, no special clauses)", () => {
    const policyItems = [{ type: "rune" }];
    const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
    const result = computeClaimPayout(policyItems, incident, 500);
    expect(result.payout).toBe(100);
  });
});

describe("Claim - special reimbursement clauses", () => {
  it("dragon-material sword, enchantment 9, damage 1000 G -- payout 400 G (50% rule wins over dragon-material, then deductible)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = computeClaimPayout(policyItems, incident, 2000);
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G -- payout 700 G (only dragon-material clause: full reimbursement, then deductible)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
    const result = computeClaimPayout(policyItems, incident, 2000);
    expect(result.payout).toBe(700);
  });
  it("steel sword, enchantment 9, damage 1000 G -- payout 400 G (only high-enchantment clause: 50% first, then deductible)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 9 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = computeClaimPayout(policyItems, incident, 2000);
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G -- payout 400 G (high-enchantment threshold clause applies)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = computeClaimPayout(policyItems, incident, 2000);
    expect(result.payout).toBe(400);
  });
});

describe("Claim - deductible per damage event", () => {
  it("dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -- payout 600 G (100 G deductible applies once per damaged item)", () => {
    const policyItems = [{ type: "sword" }, { type: "amulet" }];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    const result = computeClaimPayout(policyItems, incident, 3200);
    expect(result.payout).toBe(600);
  });
});

describe("Claim - multiple items of the same type", () => {
  it("policy covers two swords, damages array has two sword entries -- each entry is a separate damage with its own deductible", () => {
    const policyItems = [{ type: "sword" }, { type: "sword" }];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    const result = computeClaimPayout(policyItems, incident, 4000);
    expect(result.payout).toBe(800);
  });
  it("damages array has more entries of a type than the policy covers -- throws an error", () => {
    const policyItems = [{ type: "sword" }];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => computeClaimPayout(policyItems, incident, 2000)).toThrow();
  });
});

describe("Claim - cap exhaustion", () => {
  it("cursed sword (insurance value 1000 G) -- cap is 2000 G, based on unmodified insurance value", () => {
    const policyItems = [{ type: "sword", cursed: true }];
    expect(computeCap(policyItems)).toBe(2000);
  });
  it("sword insured (cap 2000 G); first claim of 1500 G -- payout 1400 G, remaining cap 600 G", () => {
    const policyItems = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = computeClaimPayout(policyItems, incident, 2000);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword insured (cap 2000 G); second successive claim of 1500 G after first -- payout 600 G, remaining cap 0 G", () => {
    const policyItems = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = computeClaimPayout(policyItems, incident, 600);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
});

describe("Claim - error cases", () => {
  it("claim references a damage entry whose item is not part of the policy -- throws an error", () => {
    const policyItems = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] };
    expect(() => computeClaimPayout(policyItems, incident, 2000)).toThrow();
  });
  it("claim references a damage entry with an unknown item type -- throws an error", () => {
    const policyItems = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] };
    expect(() => computeClaimPayout(policyItems, incident, 2000)).toThrow();
  });
  it("claim contains a damage entry with amount -200 -- throws an error", () => {
    const policyItems = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => computeClaimPayout(policyItems, incident, 2000)).toThrow();
  });
});
