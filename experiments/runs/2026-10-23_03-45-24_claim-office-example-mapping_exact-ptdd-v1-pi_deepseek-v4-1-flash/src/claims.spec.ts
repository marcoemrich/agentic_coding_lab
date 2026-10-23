import { describe, expect, it } from "vitest";
import { claimPayout, claimPayoutForDamages } from "./claims.js";
import { policyInsuranceSum, policyCap, processClaim } from "./policy.js";

describe("claim payout", () => {
  it("pays 400 G for a regular steel sword (enchantment 3) with 500 G damage (full reimbursement minus 100 G deductible)", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { itemType: "sword", amount: 500 },
      ),
    ).toBe(400);
  });
  it("pays 100 G for a rune with 200 G damage (no special clause applies, minus 100 G deductible)", () => {
    expect(
      claimPayout([{ type: "rune" }], { itemType: "rune", amount: 200 }),
    ).toBe(100);
  });
  it("pays 700 G for a dragon-material sword with enchantment 5 and 800 G damage (dragon clause only)", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        { itemType: "sword", amount: 800 },
      ),
    ).toBe(700);
  });
  it("pays 400 G for a steel sword with enchantment 9 and 1000 G damage (high-enchantment clause only)", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        { itemType: "sword", amount: 1000 },
      ),
    ).toBe(400);
  });
  it("pays 400 G for a dragon-material sword with enchantment 8 and 1000 G damage (both clauses, 50 % rule wins)", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        { itemType: "sword", amount: 1000 },
      ),
    ).toBe(400);
  });
  it("pays 400 G for a dragon-material sword with enchantment 9 and 1000 G damage (both clauses, 50 % rule wins)", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        { itemType: "sword", amount: 1000 },
      ),
    ).toBe(400);
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G pay 600 G", () => {
    expect(
      claimPayoutForDamages(
        [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    ).toBe(600);
  });
  it("treats two sword damage entries as separate damages with their own deductibles (400 G + 400 G = 800 G)", () => {
    expect(
      claimPayoutForDamages(
        [{ type: "sword", material: "steel", enchantment: 3 }, { type: "sword", material: "steel", enchantment: 3 }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toBe(800);
  });
  it("rounds a 350.5 G payout down in the MHPCO's favor to 350 G (steel sword, enchantment 9, damage 901 G)", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        { itemType: "sword", amount: 901 },
      ),
    ).toBe(350);
  });
});

describe("policy insurance sum and cap", () => {
  it("sums 2000 G insurance value and 4000 G cap for a policy covering two swords", () => {
    const swords = [{ type: "sword" }, { type: "sword" }];
    expect(policyInsuranceSum(swords)).toBe(2000);
    expect(policyCap(swords)).toBe(4000);
  });
  it("sums 1600 G insurance value and 3200 G cap for a policy covering a sword and an amulet", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(policyInsuranceSum(items)).toBe(1600);
    expect(policyCap(items)).toBe(3200);
  });
  it("uses the unmodified insurance value for the cap: a cursed sword keeps a 2000 G cap", () => {
    const items = [{ type: "sword", cursed: true }];
    expect(policyInsuranceSum(items)).toBe(1000);
    expect(policyCap(items)).toBe(2000);
  });
  it("sums 1750 G insurance value for a policy covering a sword and 3 runes (block discount affects the premium only)", () => {
    const items = [
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    expect(policyInsuranceSum(items)).toBe(1750);
  });
});

describe("cap exhaustion", () => {
  it("caps the second claim at the remaining cap: 1500 G damage pays 1400 G leaving 600 G, then 1500 G damage pays 600 G leaving 0 G", () => {
    const policy = { items: [{ type: "sword" }], remainingCap: policyCap([{ type: "sword" }]) };
    const first = processClaim(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    const second = processClaim({ ...policy, remainingCap: first.remainingCap }, [
      { itemType: "sword", amount: 1500 },
    ]);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});
