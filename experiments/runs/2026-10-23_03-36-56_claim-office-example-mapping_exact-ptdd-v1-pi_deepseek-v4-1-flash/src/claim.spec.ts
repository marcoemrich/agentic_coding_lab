import { describe, expect, it } from "vitest";
import { claimAgainstPolicy, claimPayout, createPolicy } from "./claim.js";

describe("claim payout", () => {
  it("reimburses a regular steel sword with enchantment 3 in full minus the deductible -- damage 500 G yields 400 G", () => {
    expect(
      claimPayout([{ type: "sword", material: "steel", enchantment: 3 }], {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a rune with no enchantment or material in full minus the deductible -- damage 200 G yields 100 G", () => {
    expect(
      claimPayout([{ type: "rune" }], {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      }),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("reimburses a dragon-material sword with exactly enchantment 8 at 50 % and then subtracts the deductible -- damage 1000 G yields 400 G", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 50 % high-enchantment clause over the dragon-material clause -- dragon sword, enchantment 9, damage 1000 G yields 400 G", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a dragon-material sword with enchantment 5 in full minus the deductible -- damage 800 G yields 700 G", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 800 }],
        },
      ),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("reimburses a steel sword with enchantment 9 at 50 % minus the deductible -- damage 1000 G yields 400 G", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the deductible once per damaged item in one incident -- sword damage 500 G + amulet damage 300 G yields 600 G", () => {
    expect(
      claimPayout(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 2 },
        ],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats each damage entry of the same item type as a separate damage with its own deductible -- two sword damages 500 G and 300 G yield 600 G", () => {
    expect(
      claimPayout(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 },
        ],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        },
      ),
    ).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("caps the total payout at twice the insurance sum -- sword plus amulet policy, cap 3200 G, damage 4000 G yields 3200 G", () => {
    expect(
      claimPayout(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 2 },
        ],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 3000 },
            { itemType: "amulet", amount: 1000 },
          ],
        },
      ),
    ).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("bases the cap on the unmodified insurance value of a cursed sword -- cap 2000 G, damage 3000 G yields 2000 G", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        {
          cause: "curse backlash",
          damages: [{ itemType: "sword", amount: 3000 }],
        },
      ),
    ).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("bases the cap on the insurance sum, not the block-discounted premium -- sword plus 3 runes, cap 3500 G, damage 3000 G yields 2900 G", () => {
    expect(
      claimPayout(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 3000 }],
        },
      ),
    ).toEqual({ payout: 2900, remainingCap: 600 });
  });
  it("reduces the second claim to the remaining cap -- sword policy, first claim 1500 G yields 1400 G and 600 G remaining, second claim 1500 G yields 600 G and 0 G remaining", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    const incident = {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    expect(claimAgainstPolicy(policy, incident)).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(claimAgainstPolicy(policy, incident)).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });
  it("reports the remaining cap after a partial claim -- sword plus amulet policy, cap 3200 G, damage 1000 G yields 900 G and 2300 G remaining", () => {
    expect(
      claimPayout(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 2 },
        ],
        {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      ),
    ).toEqual({ payout: 900, remainingCap: 2300 });
  });
  it("rounds the final payout down in the MHPCO's favor -- high-enchantment sword, damage 901 G yields 350.5 G rounded down to 350 G", () => {
    expect(
      claimPayout(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 901 }],
        },
      ),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });
});
