import { describe, expect, it } from "vitest";
import { processScenario, type Damage, type Item } from "./claimOffice.js";

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
const moonstones = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "moonstone" }));

function premiumsFor(itemLists: Item[][], yearsWithMHPCO = 0): number[] {
  const steps = itemLists.map((items) => ({ op: "quote" as const, items }));
  return processScenario({ customer: { yearsWithMHPCO }, steps }).results.map(
    (result) => ("premium" in result ? result.premium : Number.NaN),
  );
}

// Quote premiums below are final premiums. Unless stated otherwise the customer
// has 0 years with MHPCO and the quote is their first contract, so the policy
// base premium receives only the 10 % first-insurance surcharge and the 5 G fee.
describe("claim office quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumsFor([[]])).toEqual([5]);
  });
  it("plain sword -> base 100 G -> premium 115 G", () => {
    expect(premiumsFor([[{ type: "sword" }]])).toEqual([115]);
  });
  it("plain amulet -> base 60 G -> premium 71 G", () => {
    expect(premiumsFor([[{ type: "amulet" }]])).toEqual([71]);
  });
  it("plain staff -> base 80 G -> premium 93 G", () => {
    expect(premiumsFor([[{ type: "staff" }]])).toEqual([93]);
  });
  it("plain potion -> base 40 G -> premium 49 G", () => {
    expect(premiumsFor([[{ type: "potion" }]])).toEqual([49]);
  });
  it("one rune -> base 25 G -> 32.5 G rounded up to premium 33 G", () => {
    expect(premiumsFor([[{ type: "rune" }]])).toEqual([33]);
  });
  it("one moonstone -> base 25 G -> premium 33 G", () => {
    expect(premiumsFor([[{ type: "moonstone" }]])).toEqual([33]);
  });
  it("2 runes -> base 50 G -> premium 60 G", () => {
    expect(premiumsFor([runes(2)])).toEqual([60]);
  });
  it("3 runes -> block base 60 G -> premium 71 G", () => {
    expect(premiumsFor([runes(3)])).toEqual([71]);
  });
  it("4 runes -> base 100 G (block requires exactly 3) -> premium 115 G", () => {
    expect(premiumsFor([runes(4)])).toEqual([115]);
  });
  it("7 runes -> base 175 G -> 197.5 G rounded up to premium 198 G", () => {
    expect(premiumsFor([runes(7)])).toEqual([198]);
  });
  it("2 runes + 1 moonstone -> base 75 G (no block: different types) -> premium 88 G", () => {
    expect(premiumsFor([[...runes(2), ...moonstones(1)]])).toEqual([88]);
  });
  it("3 runes + 3 moonstones -> base 120 G (two separate blocks) -> premium 137 G", () => {
    expect(premiumsFor([[...runes(3), ...moonstones(3)]])).toEqual([137]);
  });
  it("newcomer with cursed steel sword enchantment 3 -> premium 165 G", () => {
    expect(premiumsFor([[{ type: "sword", material: "steel", enchantment: 3, cursed: true }]])).toEqual([165]);
  });
  it("cursed sword + plain amulet -> base 160 G + 50 G curse on sword only + 16 G first insurance -> premium 231 G", () => {
    expect(premiumsFor([[{ type: "sword", cursed: true }, { type: "amulet", cursed: false }]])).toEqual([231]);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge -> premium 145 G", () => {
    expect(premiumsFor([[{ type: "sword", enchantment: 5 }]])).toEqual([145]);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(premiumsFor([[{ type: "sword", enchantment: 4 }]])).toEqual([115]);
  });
  it("cursed sword with exactly enchantment 5 -> both surcharges -> premium 195 G", () => {
    expect(premiumsFor([[{ type: "sword", enchantment: 5, cursed: true }]])).toEqual([195]);
  });
  it("cursed sword with enchantment 4 -> only curse surcharge -> premium 165 G", () => {
    expect(premiumsFor([[{ type: "sword", enchantment: 4, cursed: true }]])).toEqual([165]);
  });
  it("plain sword + amulet with enchantment 6 -> 30 % of amulet base only -> premium 199 G", () => {
    expect(premiumsFor([[{ type: "sword" }, { type: "amulet", enchantment: 6 }]])).toEqual([199]);
  });
  it("customer with exactly 2 years -> loyalty discount on sword -> premium 95 G", () => {
    expect(premiumsFor([[{ type: "sword" }]], 2)).toEqual([95]);
  });
  it("customer with 1 year -> no loyalty discount on sword -> premium 115 G", () => {
    expect(premiumsFor([[{ type: "sword" }]], 1)).toEqual([115]);
  });
  it("three sword quotes by a newcomer -> 15 % follow-up discount on 2nd and 3rd -> premiums 115, 100, 100 G", () => {
    const sword = [{ type: "sword" }];
    expect(premiumsFor([sword, sword, sword])).toEqual([115, 100, 100]);
  });
  it("3-year customer's second quote of a cursed steel sword enchantment 7 -> premium 160 G (first insurance still applies)", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(premiumsFor([[{ type: "amulet" }], [cursedSword]], 3)).toEqual([59, 160]);
  });
});

// Claims reference a policy created by an earlier quote step.
function claimResultsFor(items: Item[], ...claims: Damage[][]) {
  const claimSteps = claims.map((damages) => ({
    op: "claim" as const,
    policy: 0,
    incident: { cause: "dragon attack", damages },
  }));
  const { results } = processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items }, ...claimSteps],
  });
  return results.slice(1);
}

describe("claim office claim", () => {
  it("5-year customer insures silver amulet, fire damages it for 200 G -> premium 59 G, payout 100 G, remaining cap 1100 G", () => {
    const { results } = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("regular steel sword enchantment 3, damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("rune, damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimResultsFor(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("moonstone, damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimResultsFor(moonstones(1), [{ itemType: "moonstone", amount: 200 }])).toEqual([
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("staff, damage 500 G -> payout 400 G, remaining cap 1200 G", () => {
    expect(claimResultsFor([{ type: "staff" }], [{ itemType: "staff", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 1200 },
    ]);
  });
  it("potion, damage 500 G -> payout 400 G, remaining cap 400 G", () => {
    expect(claimResultsFor([{ type: "potion" }], [{ itemType: "potion", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 400 },
    ]);
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword enchantment 5, damage 800 G -> payout 700 G, remaining cap 1300 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 800 }])).toEqual([
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("steel sword enchantment 8, damage 901 G -> 350.5 G rounded down to payout 350 G, remaining cap 1650 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8 };
    expect(claimResultsFor([sword], [{ itemType: "sword", amount: 901 }])).toEqual([
      { payout: 350, remainingCap: 1650 },
    ]);
  });
  it("sword + amulet, dragon attack damages sword 500 G and amulet 300 G -> payout 600 G (deductible per item), remaining cap 2600 G", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimResultsFor([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([
      { payout: 600, remainingCap: 2600 },
    ]);
  });
  it("two swords, both damaged for 500 G -> payout 800 G, remaining cap 3200 G (cap 4000 G)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimResultsFor([{ type: "sword" }, { type: "sword" }], damages)).toEqual([
      { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("cursed sword, damage 1500 G -> payout 1400 G, remaining cap 600 G (cap from unmodified value)", () => {
    expect(claimResultsFor([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 1500 }])).toEqual([
      { payout: 1400, remainingCap: 600 },
    ]);
  });
  it("sword + 3 runes, sword damaged for 500 G -> payout 400 G, remaining cap 3100 G (insurance sum 1750 G)", () => {
    expect(claimResultsFor([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 3100 },
    ]);
  });
  it("sword, two successive claims of 1500 G -> payouts 1400 G then 600 G, remaining cap 600 G then 0 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(claimResultsFor([{ type: "sword" }], [damage], [damage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});
