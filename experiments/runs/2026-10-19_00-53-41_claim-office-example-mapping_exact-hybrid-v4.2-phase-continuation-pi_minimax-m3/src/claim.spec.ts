import { describe, it, expect } from "vitest";
import { processClaim, type Incident, type Policy } from "./claim.js";

const sword = (
  overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {},
) => ({
  type: "sword" as const,
  material: overrides.material ?? "steel",
  enchantment: overrides.enchantment ?? 3,
  cursed: overrides.cursed ?? false,
});

const amulet = (
  overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {},
) => ({
  type: "amulet" as const,
  material: overrides.material ?? "silver",
  enchantment: overrides.enchantment ?? 1,
  cursed: overrides.cursed ?? false,
});

const rune = () => ({ type: "rune" as const });

describe("Claim processing", () => {
  // ----- Standard reimbursement (no special clauses) -----
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus deductible)", () => {
    const policy: Policy = {
      items: [sword()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 500 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("damage to rune (insurance value 250 G), damage 200 G -> payout 100 G (full reimbursement minus deductible, no special clauses)", () => {
    const policy: Policy = {
      items: [rune()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "dropped",
      damages: [{ itemType: "rune", amount: 200 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  // ----- Enchantment threshold vs. dragon material -----
  it("dragon-material sword enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause wins, then deductible)", () => {
    const policy: Policy = {
      items: [sword({ material: "dragon", enchantment: 8 })],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("dragon-material sword enchantment 9, damage 1000 G -> payout 400 G (both apply, 50% wins, then deductible)", () => {
    const policy: Policy = {
      items: [sword({ material: "dragon", enchantment: 9 })],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("dragon-material sword enchantment 5, damage 800 G -> payout 700 G (only dragon-material clause applies)", () => {
    const policy: Policy = {
      items: [sword({ material: "dragon", enchantment: 5 })],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 800 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });

  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (only high-enchantment clause applies)", () => {
    const policy: Policy = {
      items: [sword({ material: "steel", enchantment: 9 })],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "war",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  // ----- Deductible per damage event -----
  it("dragon attack damages insured sword 500 G and insured amulet 300 G -> payout 600 G (deductible applies once per damaged item)", () => {
    const policy: Policy = {
      items: [sword(), amulet()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });

  // ----- Insurance sum and cap -----
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const policy: Policy = {
      items: [sword(), sword()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "minor",
      damages: [{ itemType: "sword", amount: 100 }],
    };
    const result = processClaim(policy, incident);
    // cap = 2 * 2000 = 4000
    expect(result.remainingCap).toBe(4000);
  });

  it("policy covers sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const policy: Policy = {
      items: [sword(), amulet()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "minor",
      damages: [{ itemType: "sword", amount: 100 }],
    };
    const result = processClaim(policy, incident);
    expect(result.remainingCap).toBe(3200);
  });

  it("policy covers sword + 3 runes -> insurance sum 1750 G (block discount affects premium only, not insurance)", () => {
    const policy: Policy = {
      items: [sword(), rune(), rune(), rune()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "minor",
      damages: [{ itemType: "sword", amount: 100 }],
    };
    const result = processClaim(policy, incident);
    // cap = 2 * (1000 + 3*250) = 3500
    expect(result.remainingCap).toBe(3500);
  });

  it("cursed sword (insurance value 1000 G, premium with modifiers 165 G) -> cap 2000 G (based on unmodified insurance value)", () => {
    const policy: Policy = {
      items: [sword({ cursed: true })],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "minor",
      damages: [{ itemType: "sword", amount: 100 }],
    };
    const result = processClaim(policy, incident);
    // Cursed surcharge affects premium but not insurance value. cap = 2 * 1000 = 2000
    expect(result.remainingCap).toBe(2000);
  });

  // ----- Cap exhaustion -----
  it("sword insured with cap 2000 G, two successive claims of 1500 G each -> first 1400 G (remaining 600), then 600 G (remaining 0)", () => {
    const policy: Policy = {
      items: [sword()],
      totalPayoutsSoFar: 0,
    };
    const firstIncident: Incident = {
      cause: "attack",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const first = processClaim(policy, firstIncident);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);

    const policyAfter: Policy = {
      items: [sword()],
      totalPayoutsSoFar: first.payout,
    };
    const secondIncident: Incident = {
      cause: "attack",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const second = processClaim(policyAfter, secondIncident);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // ----- Multiple items of the same type -----
  it("policy covers two swords, damages has two sword entries -> each entry treated as separate damage with own deductible", () => {
    const policy: Policy = {
      items: [sword(), sword()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    const result = processClaim(policy, incident);
    // Each damage: 500 - 100 deductible = 400; total = 800
    expect(result.payout).toBe(800);
  });

  it("damages array has more entries of a given type than policy covers -> claim rejected", () => {
    const policy: Policy = {
      items: [sword()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  // ----- Rounding -----
  it("should round payout down to whole G in MHPCO's favor (350.5 -> 350)", () => {
    // To get a 350.5 raw payout, we need damage such that:
    // amount * 1.0 - 100 = 350.5  =>  amount = 450.5
    // But amount is an integer, so 450 - 100 = 350 (not 350.5).
    // Let's use a high-enchantment case to get a non-integer payout.
    // enchantment 9: rate 0.5
    // amount * 0.5 - 100 = 350.5  =>  amount = 901
    const policy: Policy = {
      items: [sword({ enchantment: 9 })],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "battle",
      damages: [{ itemType: "sword", amount: 901 }],
    };
    const result = processClaim(policy, incident);
    // 901 * 0.5 - 100 = 350.5, rounded down to 350
    expect(result.payout).toBe(350);
  });

  // ----- Error cases -----
  it("should throw when damage entry references item not in policy (amulet damaged but only sword insured)", () => {
    const policy: Policy = {
      items: [sword()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it("should throw when damage entry references an unknown item type", () => {
    const policy: Policy = {
      items: [sword()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "fire",
      damages: [{ itemType: "broomstick", amount: 200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it("should throw when damage entry has negative amount", () => {
    const policy: Policy = {
      items: [sword()],
      totalPayoutsSoFar: 0,
    };
    const incident: Incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: -200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });
});
