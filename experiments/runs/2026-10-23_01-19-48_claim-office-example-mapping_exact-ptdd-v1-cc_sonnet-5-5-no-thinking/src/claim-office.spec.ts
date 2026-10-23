import { describe, expect, it } from "vitest";
import type { Damage } from "./claim.js";
import { runScenario } from "./claim-office.js";
import type { Item } from "./price-list.js";

const premiumOf = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const claimOf = (items: Item[], damages: Damage[]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1];

// Reading: all premiums below are for a customer with 0 years and a first quote unless stated,
// so every premium includes the 10 % first insurance surcharge and the 5 G fee.
// Reading: every rejection makes the scenario run throw an Error (the CLI maps it to exit code 1 + stderr).

describe("quote: base premiums", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumOf([])).toEqual({ premium: 5 });
  });
  it("sword (base 100 G) -> premium 115 G", () => {
    expect(premiumOf([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("amulet (base 60 G) -> premium 71 G", () => {
    expect(premiumOf([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("staff (base 80 G) -> premium 93 G", () => {
    expect(premiumOf([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("potion (base 40 G) -> premium 49 G", () => {
    expect(premiumOf([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("single rune (base 25 G) -> premium 33 G (32.5 rounded up)", () => {
    expect(premiumOf([{ type: "rune" }])).toEqual({ premium: 33 });
  });
  it("single moonstone (base 25 G) -> premium 33 G (32.5 rounded up)", () => {
    expect(premiumOf([{ type: "moonstone" }])).toEqual({ premium: 33 });
  });
  it("unknown item type (broomstick) -> run is rejected with an error", () => {
    expect(() => premiumOf([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
});

describe("quote: building block of 3 alike components", () => {
  it("2 runes -> base 50 G -> premium 60 G", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("3 runes -> base 60 G (block applies) -> premium 71 G", () => {
    expect(premiumOf(Array(3).fill({ type: "rune" }))).toEqual({ premium: 71 });
  });
  it("3 moonstones -> base 60 G (block applies) -> premium 71 G", () => {
    expect(premiumOf(Array(3).fill({ type: "moonstone" }))).toEqual({ premium: 71 });
  });
  it("4 runes -> base 100 G (no block, block requires exactly 3) -> premium 115 G", () => {
    expect(premiumOf(Array(4).fill({ type: "rune" }))).toEqual({ premium: 115 });
  });
  it("7 runes -> base 175 G -> premium 198 G (197.5 rounded up in the MHPCO's favor)", () => {
    expect(premiumOf(Array(7).fill({ type: "rune" }))).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> base 75 G (different types, no block) -> premium 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(premiumOf(items)).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> base 120 G (two separate blocks) -> premium 137 G", () => {
    const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
    expect(premiumOf(items)).toEqual({ premium: 137 });
  });
});

describe("quote: premium modifiers", () => {
  it("cursed steel sword, enchantment 3 -> 100 + 50 + 10 + 5 = 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(premiumOf([sword])).toEqual({ premium: 165 });
  });
  it("sword with enchantment 5 -> high enchantment surcharge applies -> 145 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it("cursed sword with enchantment 5 -> both surcharges apply -> 195 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("sword with enchantment 4 -> no high enchantment surcharge -> 115 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 4 -> only curse surcharge -> 165 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("cursed sword + plain amulet -> curse surcharge applies to the sword only -> 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(premiumOf(items)).toEqual({ premium: 231 });
  });
  it("customer with exactly 2 years -> loyalty discount applies -> sword 95 G", () => {
    expect(premiumOf([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("customer with 1 year -> no loyalty discount -> sword 115 G", () => {
    expect(premiumOf([{ type: "sword" }], 1)).toEqual({ premium: 115 });
  });
  it("loyalty discount applies to the policy base premium -> 2 years, cursed sword + amulet -> 199 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(premiumOf(items, 2)).toEqual({ premium: 199 });
  });
  it("second quote in the scenario receives the 15 % follow-up discount -> sword 115 G then 100 G", () => {
    const quote = { op: "quote" as const, items: [{ type: "sword" }] };
    const { results } = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [quote, quote] });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("integration: 3 years, second quote, cursed sword with enchantment 7 -> 160 G", () => {
    const first = { op: "quote" as const, items: [{ type: "sword" }] };
    const second = { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] };
    const { results } = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [first, second] });
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("claim: reimbursement", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune, damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimOf([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("damage smaller than the deductible -> payout 0 G (reading: payout never negative)", () => {
    expect(claimOf([{ type: "sword" }], [{ itemType: "sword", amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword with enchantment 7, damage 1000 G -> payout 900 G (below the 50 % threshold)", () => {
    const sword = { type: "sword", enchantment: 7 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("dragon sword, enchantment 8, damage 1000 G -> payout 400 G (50 % clause, then deductible)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword, enchantment 9, damage 1000 G -> payout 400 G (50 % clause wins)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword, enchantment 5, damage 800 G -> payout 700 G (dragon clause only)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % clause only)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("payout of 350.5 G (steel sword, enchantment 8, damage 901 G) -> 350 G (rounded down)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("sword 500 G + amulet 300 G damaged by a dragon attack -> payout 600 G (deductible per damaged item)", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    expect(claimOf([{ type: "sword" }, { type: "amulet" }], damages)).toMatchObject({ payout: 600 });
  });
  it("two damages with different items of the same type are matched in policy order", () => {
    const swords = [{ type: "sword", enchantment: 9 }, { type: "sword", enchantment: 3 }];
    const damages = [{ itemType: "sword", amount: 1000 }, { itemType: "sword", amount: 1000 }];
    expect(claimOf(swords, damages)).toMatchObject({ payout: 1300 });
  });
});

describe("claim: insurance sum and cap", () => {
  it("amulet (insured 600 G) -> cap 1200 G: damage 300 G -> payout 200 G, remaining cap 1000 G", () => {
    expect(claimOf([{ type: "amulet" }], [{ itemType: "amulet", amount: 300 }])).toEqual({ payout: 200, remainingCap: 1000 });
  });
  it("staff (insured 800 G) -> cap 1600 G: damage 300 G -> payout 200 G, remaining cap 1400 G", () => {
    expect(claimOf([{ type: "staff" }], [{ itemType: "staff", amount: 300 }])).toEqual({ payout: 200, remainingCap: 1400 });
  });
  it("potion (insured 400 G) -> cap 800 G: damage 300 G -> payout 200 G, remaining cap 600 G", () => {
    expect(claimOf([{ type: "potion" }], [{ itemType: "potion", amount: 300 }])).toEqual({ payout: 200, remainingCap: 600 });
  });
  it("moonstone (insured 250 G) -> cap 500 G: damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimOf([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("sword + amulet -> insurance sum 1600 G, cap 3200 G: sword 500 G + amulet 300 G -> remaining cap 2600 G", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    expect(claimOf([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("cursed sword -> cap stays 2000 G (premium modifiers do not raise the cap)", () => {
    const sword = { type: "sword", cursed: true };
    expect(claimOf([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + 3 runes -> insurance sum 1750 G, cap 3500 G (block does not change the sum)", () => {
    const items = [{ type: "sword" }, ...Array(3).fill({ type: "rune" })];
    expect(claimOf(items, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("two swords -> insurance sum 2000 G, cap 4000 G: both swords damaged by 500 G -> payout 800 G, remaining cap 3200 G", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(claimOf([{ type: "sword" }, { type: "sword" }], damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("two successive claims of 1500 G on a sword -> 1400 G / remaining 600 G, then 600 G / remaining 0 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("claims refer to the policy by quote step index and keep separate caps", () => {
    const damage = (itemType: string, amount: number) => ({ cause: "fire", damages: [{ itemType, amount }] });
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: damage("amulet", 300) },
        { op: "claim", policy: 0, incident: damage("sword", 500) },
      ],
    });
    expect(results.slice(2)).toEqual([
      { payout: 200, remainingCap: 1000 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
});

describe("claim: rejections", () => {
  it("two sword damages but only one sword insured -> whole claim rejected with an error", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(() => claimOf([{ type: "sword" }], damages)).toThrow(/sword/);
  });
  it("amulet damaged although only a sword is insured -> rejected with an error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
  });
  it("damage with unknown item type -> rejected with an error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
  });
  it("damage with amount -200 -> rejected with an error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
  });
});
