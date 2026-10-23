import { describe, expect, it } from "vitest";
import { claimPayout, type PolicyState } from "./claim.js";

// Helper to build a policy from items and a starting remaining cap.
function makePolicy(items: { type: string }[], remainingCap?: number): PolicyState {
  const insuranceSum = items.reduce(
    (sum, i) =>
      sum +
      (i.type === "sword"
        ? 1000
        : i.type === "amulet"
          ? 600
          : i.type === "staff"
            ? 800
            : i.type === "potion"
              ? 400
              : i.type === "rune" || i.type === "moonstone"
                ? 250
                : 0),
    0,
  );
  return {
    items: items.map((i) => ({ type: i.type })),
    insuranceSum,
    premium: 0,
    remainingCap: remainingCap ?? 2 * insuranceSum,
  };
}

describe("claim -- standard reimbursement (no special clauses)", () => {
  it("a regular sword (steel, enchantment 3) damaged 500 G yields payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const result = claimPayout(policy, [{ itemType: "sword", amount: 500 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("a rune damaged 200 G yields payout 100 G (full reimbursement minus 100 G deductible; no enchantment/material clause)", () => {
    const policy = makePolicy([{ type: "rune" }]);
    const result = claimPayout(policy, [{ itemType: "rune", amount: 200 }]);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  it("damage 100 G exactly yields payout 0 G (deductible absorbs the entire damage)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const result = claimPayout(policy, [{ itemType: "sword", amount: 100 }]);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it("damage below the deductible yields payout 0 G (e.g. damage 50 G → payout 0)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    const result = claimPayout(policy, [{ itemType: "sword", amount: 50 }]);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });
});

describe("claim -- high-enchantment clause (enchantment >= 8)", () => {
  it("a steel sword with enchantment 8, damage 1000 G yields payout 400 G (50% rule: 500 then minus 100 deductible)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].enchantment = 8;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("a steel sword with enchantment 9, damage 1000 G yields payout 400 G (only high-enchantment applies: 500 then minus 100)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].enchantment = 9;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("a steel sword with enchantment 7, damage 1000 G yields standard reimbursement: payout 900 G (1000 - 100)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].enchantment = 7;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(900);
    expect(result.remainingCap).toBe(1100);
  });
});

describe("claim -- dragon-material clause", () => {
  it("a dragon-material sword with enchantment 7, damage 1000 G yields payout 900 G (full reimbursement then minus 100 deductible)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].material = "dragon";
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(900);
    expect(result.remainingCap).toBe(1100);
  });

  it("a dragon-material sword with enchantment 8, damage 1000 G yields payout 400 G (high-enchantment clause applies too, 50% wins; 500 - 100)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].material = "dragon";
    policy.items[0].enchantment = 8;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("a dragon-material sword with enchantment 9, damage 1000 G yields payout 400 G (both clauses apply; 50% wins; 500 - 100)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].material = "dragon";
    policy.items[0].enchantment = 9;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it("a dragon-material sword with enchantment 5, damage 800 G yields payout 700 G (only dragon clause: 800 - 100)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].material = "dragon";
    policy.items[0].enchantment = 5;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 800 }]);
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });

  it("a dragon-material staff (enchantment 0), damage 600 G yields payout 500 G (dragon clause applies; 600 - 100)", () => {
    const policy = makePolicy([{ type: "staff" }]);
    policy.items[0].material = "dragon";
    const result = claimPayout(policy, [{ itemType: "staff", amount: 600 }]);
    expect(result.payout).toBe(500);
    expect(result.remainingCap).toBe(1100);
  });
});

describe("claim -- multiple damages per incident", () => {
  it("a dragon attack damages an insured sword (500 G) and an insured amulet (300 G) yields payout 600 G (each damaged item has its own 100 G deductible; 400 + 200)", () => {
    const policy = makePolicy([{ type: "sword" }, { type: "amulet" }]);
    const result = claimPayout(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ]);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });

  it("two damages of the same item type (two sword damages, policy covers two swords) yield separate payouts, each with its own deductible (damage 500 each → payout 400 + 400 = 800)", () => {
    const policy = makePolicy([{ type: "sword" }, { type: "sword" }]);
    const result = claimPayout(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ]);
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });

  it("damages array contains more entries of a given type than the policy actually covers (two sword damages but only one sword insured) rejects with a thrown error", () => {
    const policy = makePolicy([{ type: "sword" }]);
    expect(() =>
      claimPayout(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]),
    ).toThrow();
  });

  it("a damage entry whose item is not part of the policy (amulet damage when only a sword is insured) rejects with a thrown error", () => {
    const policy = makePolicy([{ type: "sword" }]);
    expect(() =>
      claimPayout(policy, [{ itemType: "amulet", amount: 300 }]),
    ).toThrow();
  });

  it("a damage entry with an unknown item type rejects with a thrown error", () => {
    const policy = makePolicy([{ type: "sword" }]);
    expect(() =>
      claimPayout(policy, [{ itemType: "broomstick", amount: 200 }]),
    ).toThrow();
  });

  it("a damage entry with a negative amount rejects with a thrown error", () => {
    const policy = makePolicy([{ type: "sword" }]);
    expect(() =>
      claimPayout(policy, [{ itemType: "sword", amount: -200 }]),
    ).toThrow();
  });
});

describe("claim -- cap exhaustion", () => {
  it("a policy covers a sword and an amulet → insurance sum 1600 G, cap 3200 G (2x insurance sum)", () => {
    const policy = makePolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });

  it("a cursed sword (insurance value 1000 G) has cap 2000 G based on unmodified insurance value; premium modifiers do not raise the cap", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].cursed = true;
    expect(policy.insuranceSum).toBe(1000);
    expect(policy.remainingCap).toBe(2000);
  });

  it("a policy covers a sword and 3 runes (block) → insurance sum 1750 G; block discount affects premium only", () => {
    const policy = makePolicy([
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(policy.insuranceSum).toBe(1750);
    expect(policy.remainingCap).toBe(3500);
  });

  it("a sword insured (insurance sum 1000 G, cap 2000 G): first claim of 1500 G yields payout 1400 G, cap remaining 600 G", () => {
    let policy = makePolicy([{ type: "sword" }]);
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
    policy = { ...policy, remainingCap: result.remainingCap };
  });

  it("a sword insured: second successive claim of 1500 G (after first 1400 G payout) yields payout 600 G, cap remaining 0 G (desired 1400 reduced to remaining cap)", () => {
    let policy = makePolicy([{ type: "sword" }]);
    const first = claimPayout(policy, [{ itemType: "sword", amount: 1500 }]);
    policy = { ...policy, remainingCap: first.remainingCap };
    const second = claimPayout(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  it("once the cap is exhausted, a further claim yields payout 0 G, cap remaining 0 G", () => {
    let policy = makePolicy([{ type: "sword" }]);
    policy = { ...policy, remainingCap: 0 };
    const result = claimPayout(policy, [{ itemType: "sword", amount: 500 }]);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(0);
  });

  it("a single claim whose raw payout exceeds the remaining cap is reduced to the remaining cap", () => {
    let policy = makePolicy([{ type: "sword" }]);
    policy = { ...policy, remainingCap: 100 };
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(0);
  });
});

describe("claim -- rounding in MHPCO's favor", () => {
  it("a payout calculation that yields 350.5 G is rounded DOWN to 350 G final (901 damage * 0.5 - 100 = 350.5, floor = 350)", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].enchantment = 8;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 901 }]);
    expect(result.payout).toBe(350);
  });
});

describe("claim -- clause precedence", () => {
  it("when both high-enchantment and dragon-material clauses apply, the 50% rule wins and the dragon rule does not further increase the payout", () => {
    const policy = makePolicy([{ type: "sword" }]);
    policy.items[0].material = "dragon";
    policy.items[0].enchantment = 8;
    const result = claimPayout(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
  });
});
