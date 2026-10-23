import { describe, expect, it } from "vitest";
import type { Item } from "./item.js";
import { runScenario } from "./scenario.js";

interface Damage {
  itemType: string;
  amount: number;
}

function claimOnQuotedPolicy(items: Item[], damages: Damage[]): unknown {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1];
}

describe("claim", () => {
  it("regular sword (steel, enchantment 3), damage 500 -> payout 400, remaining cap 1600", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimOnQuotedPolicy([sword], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it("rune, damage 200 -> payout 100 (no special clause), remaining cap 400", () => {
    expect(claimOnQuotedPolicy([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

  it("damage below the deductible -> payout 0 (chosen reading: payout never negative)", () => {
    expect(claimOnQuotedPolicy([{ type: "sword" }], [{ itemType: "sword", amount: 50 }])).toEqual({
      payout: 0,
      remainingCap: 2000,
    });
  });

  it("dragon sword, enchantment 5, damage 800 -> payout 700 (full reimbursement)", () => {
    const dragonSword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimOnQuotedPolicy([dragonSword], [{ itemType: "sword", amount: 800 }])).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });

  it("steel sword, enchantment 9, damage 1000 -> payout 400 (50 % first, then deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimOnQuotedPolicy([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it("steel sword, enchantment 7, damage 1000 -> payout 900 (below the enchantment threshold)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7 };
    expect(claimOnQuotedPolicy([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 900,
      remainingCap: 1100,
    });
  });

  it("dragon sword, enchantment 9, damage 1000 -> payout 400 (50 % rule wins)", () => {
    const dragonSword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimOnQuotedPolicy([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it("dragon sword, enchantment exactly 8, damage 1000 -> payout 400", () => {
    const dragonSword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimOnQuotedPolicy([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it("sword damage 500 + amulet damage 300 -> payout 600 (deductible per damaged item)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimOnQuotedPolicy([{ type: "sword" }, { type: "amulet" }], damages)).toMatchObject({
      payout: 600,
    });
  });

  it("payout calculation yielding 350.5 -> payout 350 (rounded down)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8 };
    expect(claimOnQuotedPolicy([sword], [{ itemType: "sword", amount: 901 }])).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  it("two swords, two sword damages of 500 -> each has its own deductible: payout 800, remaining cap 3200", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimOnQuotedPolicy([{ type: "sword" }, { type: "sword" }], damages)).toEqual({
      payout: 800,
      remainingCap: 3200,
    });
  });

  it("two sword damages but only one sword insured -> claim is rejected with an error", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claimOnQuotedPolicy([{ type: "sword" }], damages)).toThrow(/sword/);
  });

  it("amulet damaged while only a sword is insured -> claim is rejected with an error", () => {
    expect(() =>
      claimOnQuotedPolicy([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }]),
    ).toThrow(/amulet/);
  });

  it("damage with unknown item type -> claim is rejected with an error", () => {
    expect(() =>
      claimOnQuotedPolicy([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }]),
    ).toThrow(/broomstick/);
  });

  it("damage amount -200 -> claim is rejected with an error", () => {
    expect(() =>
      claimOnQuotedPolicy([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
    ).toThrow(/-200/);
  });

  it("claim refers to a step that is not an existing quote -> rejected with an error (chosen reading)", () => {
    const damages = [{ itemType: "sword", amount: 500 }];
    const claimOn = (policy: number) => () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy, incident: { cause: "fire", damages } },
        ],
      });
    expect(claimOn(7)).toThrow(/policy 7/);
    expect(claimOn(1)).toThrow(/policy 1/);
  });

  it("claim on the second policy uses that policy's items", () => {
    const claimOn = (policy: number, itemType: string) => () =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy,
            incident: { cause: "fire", damages: [{ itemType, amount: 300 }] },
          },
        ],
      }).results[2];
    expect(claimOn(1, "amulet")()).toMatchObject({ payout: 200 });
    expect(claimOn(0, "amulet")).toThrow(/amulet/);
  });

  it("sword + amulet -> insurance sum 1600, cap 3200", () => {
    const damages = [{ itemType: "sword", amount: 500 }];
    expect(claimOnQuotedPolicy([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({
      payout: 400,
      remainingCap: 2800,
    });
  });

  it("cursed sword -> cap 2000 (premium modifiers do not raise the cap)", () => {
    const cursedSword = { type: "sword", cursed: true };
    expect(claimOnQuotedPolicy([cursedSword], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it("staff -> insurance sum 800, cap 1600", () => {
    const damages = [{ itemType: "staff", amount: 500 }];
    expect(claimOnQuotedPolicy([{ type: "staff" }], damages)).toEqual({
      payout: 400,
      remainingCap: 1200,
    });
  });

  it("potion -> insurance sum 400, cap 800", () => {
    const damages = [{ itemType: "potion", amount: 500 }];
    expect(claimOnQuotedPolicy([{ type: "potion" }], damages)).toEqual({
      payout: 400,
      remainingCap: 400,
    });
  });

  it("moonstone -> insurance sum 250, cap 500", () => {
    const damages = [{ itemType: "moonstone", amount: 200 }];
    expect(claimOnQuotedPolicy([{ type: "moonstone" }], damages)).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

  it("sword + 3 runes -> insurance sum 1750, cap 3500 (block affects premium only)", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(claimOnQuotedPolicy(items, [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 3100,
    });
  });

  it("two successive claims of 1500 on a sword -> 1400 / cap 600, then 600 / cap 0", () => {
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident },
        { op: "claim", policy: 0, incident },
      ],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

});
