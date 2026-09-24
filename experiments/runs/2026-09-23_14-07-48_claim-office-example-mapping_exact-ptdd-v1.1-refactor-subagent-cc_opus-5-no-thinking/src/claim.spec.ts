import { describe, expect, it } from "vitest";
import { claim, openPolicy } from "./claim.js";

describe("MHPCO claim processing", () => {
  it("claims a regular steel sword enchantment 3 with damage 500 G -- payout 400 G (full reimbursement minus the 100 G deductible)", () => {
    const policy = openPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      }).payout,
    ).toBe(400);
  });

  it("claims a rune (insurance value 250 G) with damage 200 G -- payout 100 G (runes have no enchantment level or material, so no special clause applies)", () => {
    const policy = openPolicy([{ type: "rune" }]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      }).payout,
    ).toBe(100);
  });

  it("applies the 100 G deductible once per damaged item -- a dragon attack damaging an insured sword (500 G) and an insured amulet (300 G) pays out 600 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      }).payout,
    ).toBe(600);
  });

  it("claims a steel sword enchantment 9 with damage 1000 G -- payout 400 G (the 50 % high-enchantment clause applies first, then the deductible)", () => {
    const policy = openPolicy([
      { type: "sword", material: "steel", enchantment: 9 },
    ]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      }).payout,
    ).toBe(400);
  });

  it("claims a dragon-material sword enchantment 5 with damage 800 G -- payout 700 G (only the dragon-material clause applies: full reimbursement, then the deductible)", () => {
    const policy = openPolicy([
      { type: "sword", material: "dragon", enchantment: 5 },
    ]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 800 }],
      }).payout,
    ).toBe(700);
  });

  it("claims a dragon-material sword enchantment 9 with damage 1000 G -- payout 400 G (both clauses apply; the 50 % rule wins, then the deductible)", () => {
    const policy = openPolicy([
      { type: "sword", material: "dragon", enchantment: 9 },
    ]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      }).payout,
    ).toBe(400);
  });

  it("claims a dragon-material sword with exactly enchantment 8 and damage 1000 G -- payout 400 G (the high-enchantment threshold is inclusive)", () => {
    const policy = openPolicy([
      { type: "sword", material: "dragon", enchantment: 8 },
    ]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      }).payout,
    ).toBe(400);
  });

  it("claims a steel sword enchantment 7 with damage 1000 G -- payout 900 G (below the high-enchantment threshold, so full reimbursement then the deductible)", () => {
    const policy = openPolicy([
      { type: "sword", material: "steel", enchantment: 7 },
    ]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      }).payout,
    ).toBe(900);
  });

  it("reports the remaining cap after a claim -- sword policy (insurance sum 1000 G, cap 2000 G), claim 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const policy = openPolicy([{ type: "sword" }]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });

  it("caps a second successive claim at the remaining cap -- sword policy, two claims of 1500 G: first pays 1400 G leaving 600 G, second pays 600 G leaving 0 G", () => {
    const policy = openPolicy([{ type: "sword" }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    const first = claim(policy, incident);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(first.policy, incident);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  it("computes the insurance sum of a sword plus an amulet as 1600 G -- cap 3200 G", () => {
    expect(
      openPolicy([{ type: "sword" }, { type: "amulet" }]).remainingCap,
    ).toBe(3200);
  });

  it("computes the cap from unmodified insurance values -- a cursed sword (premium 165 G) still has cap 2000 G", () => {
    expect(openPolicy([{ type: "sword", cursed: true }]).remainingCap).toBe(
      2000,
    );
  });

  it("computes the insurance sum of a sword plus 3 runes as 1750 G -- cap 3500 G; the block discount affects the premium only", () => {
    expect(
      openPolicy([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]).remainingCap,
    ).toBe(3500);
  });

  it("computes the insurance sum of two swords as 2000 G -- cap 4000 G", () => {
    expect(
      openPolicy([{ type: "sword" }, { type: "sword" }]).remainingCap,
    ).toBe(4000);
  });

  it("treats two sword damage entries against a two-sword policy as separate damages, each with its own deductible -- 500 G each pays out 800 G", () => {
    const policy = openPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }).payout,
    ).toBe(800);
  });

  it("rounds a payout of 350.5 G down to 350 G (in MHPCO's favor) -- sword enchantment 9, damage 901 G: 450.5 - 100 = 350.5", () => {
    const policy = openPolicy([{ type: "sword", enchantment: 9 }]);
    expect(
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 901 }],
      }).payout,
    ).toBe(350);
  });
});
