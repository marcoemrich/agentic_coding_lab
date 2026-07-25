import { describe, it, expect } from "vitest";
import { claim } from "./claim.js";
import type { Item, Policy } from "./types.js";

function makePolicy(items: Item[], remainingCap: number): Policy {
  // Insurance value per item type
  const insuranceValues: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
    rune: 250,
    moonstone: 250,
  };
  const insuranceSum = items.reduce(
    (sum: number, item: Item) => sum + (insuranceValues[item.type] ?? 0),
    0,
  );
  return {
    items,
    insuranceSum,
    cap: 2 * insuranceSum,
    remainingCap,
  };
}

describe("claim", () => {
  // Standard reimbursement (no special clauses, no dragon material, enchantment < 8)
  it("regular sword (steel, enchantment 3), damage 500 -> payout 400 G", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      2000,
    );
    expect(claim(policy, [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // Rune has no enchantment or material, so no special clause applies
  it("damage to rune (200 G) -> payout 100 G", () => {
    const policy = makePolicy([{ type: "rune" }], 500);
    expect(claim(policy, [{ itemType: "rune", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

  // Deductible per damaged item
  it("sword damaged 500 + amulet damaged 300 -> payout 600 G (deductible per item)", () => {
    const policy = makePolicy(
      [{ type: "sword" }, { type: "amulet" }],
      3200,
    );
    expect(
      claim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ]),
    ).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });

  // Enchantment >= 8: 50% reimbursement then deductible
  it("sword (steel, enchantment 9), damage 1000 -> payout 400 G (50% rule)", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      2000,
    );
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("sword (steel, enchantment 8) damage 1000 -> payout 400 G (boundary, 50% rule)", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "steel", enchantment: 8 }],
      2000,
    );
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // Dragon material: full reimbursement then deductible (only if enchantment < 8)
  it("sword (dragon, enchantment 5), damage 800 -> payout 700 G (dragon clause only)", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      2000,
    );
    expect(claim(policy, [{ itemType: "sword", amount: 800 }])).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("sword (dragon, enchantment 7), damage 1000 -> payout 900 G (dragon clause only)", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "dragon", enchantment: 7 }],
      2000,
    );
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 900,
      remainingCap: 1100,
    });
  });

  // Both clauses apply, 50% wins (then deductible)
  it("sword (dragon, enchantment 8), damage 1000 -> payout 400 G (both, 50% wins)", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      2000,
    );
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("sword (dragon, enchantment 9), damage 1000 -> payout 400 G (both, 50% wins)", () => {
    const policy = makePolicy(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      2000,
    );
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // Multiple items of the same type, each damage has its own deductible
  it(
    "policy covers two swords, two damage entries (1000 G each) -> payout 1800 G (each separate)",
    () => {
      const policy = makePolicy(
        [{ type: "sword" }, { type: "sword" }],
        4000,
      );
      expect(
        claim(policy, [
          { itemType: "sword", amount: 1000 },
          { itemType: "sword", amount: 1000 },
        ]),
      ).toEqual({
        payout: 1800,
        remainingCap: 2200,
      });
    },
  );

  // Cap exhaustion across multiple claims
  it(
    "sword insured (cap 2000), two successive claims of 1500 G -> first 1400 / remaining 600, second 600 / remaining 0",
    () => {
      const policy = makePolicy([{ type: "sword" }], 2000);

      const first = claim(policy, [{ itemType: "sword", amount: 1500 }]);
      expect(first).toEqual({ payout: 1400, remainingCap: 600 });

      const second = claim(
        { ...policy, remainingCap: first.remainingCap },
        [{ itemType: "sword", amount: 1500 }],
      );
      expect(second).toEqual({ payout: 600, remainingCap: 0 });
    },
  );

  // Edge cases / errors
  it("damage references an item not in the policy -> throws", () => {
    const policy = makePolicy([{ type: "sword" }], 2000);
    expect(() =>
      claim(policy, [{ itemType: "amulet", amount: 200 }]),
    ).toThrow();
  });
  it("negative damage amount -> throws", () => {
    const policy = makePolicy([{ type: "sword" }], 2000);
    expect(() =>
      claim(policy, [{ itemType: "sword", amount: -200 }]),
    ).toThrow();
  });
  it("more damage entries of a type than items in policy -> throws", () => {
    const policy = makePolicy([{ type: "sword" }], 2000);
    expect(() =>
      claim(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]),
    ).toThrow();
  });
  it("damage to rune (100 G) -> payout 0 G (full minus deductible, but cannot go negative)", () => {
    const policy = makePolicy([{ type: "rune" }], 500);
    expect(claim(policy, [{ itemType: "rune", amount: 100 }])).toEqual({
      payout: 0,
      remainingCap: 500,
    });
  });
});
