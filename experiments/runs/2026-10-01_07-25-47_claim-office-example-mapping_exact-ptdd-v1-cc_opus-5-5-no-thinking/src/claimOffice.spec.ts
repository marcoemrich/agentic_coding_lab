import { describe, expect, it } from "vitest";
import { runScenario, type Item } from "./claimOffice.js";

const newcomer = { yearsWithMHPCO: 0 };
const premiumOf = (items: Item[], customer = newcomer) =>
  runScenario({ customer, steps: [{ op: "quote", items }] }).results[0];

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));

// Reading of the error contract: the spec only defines the CLI outcome
// (non-zero exit + stderr). At the domain level, runScenario signals a
// rejected scenario by throwing an Error; no type or message is specified.

describe("quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumOf([])).toEqual({ premium: 5 });
  });
  it("plain sword, newcomer -> base 100 + 10 first insurance + 5 fee = 115 G", () => {
    expect(premiumOf([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("plain amulet, newcomer -> base 60 + 6 first insurance + 5 fee = 71 G", () => {
    expect(premiumOf([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("plain staff, newcomer -> base 80 + 8 first insurance + 5 fee = 93 G", () => {
    expect(premiumOf([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("plain potion, newcomer -> base 40 + 4 first insurance + 5 fee = 49 G", () => {
    expect(premiumOf([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("2 runes -> base 50 G -> 50 + 5 + 5 = 60 G", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("3 runes -> block base 60 G -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumOf(runes(3))).toEqual({ premium: 71 });
  });
  it("4 runes -> no block, base 100 G -> 115 G", () => {
    expect(premiumOf(runes(4))).toEqual({ premium: 115 });
  });
  it("7 runes -> no block, base 175 G -> 192.5 + 5 = 197.5 rounded up to 198 G", () => {
    expect(premiumOf(runes(7))).toEqual({ premium: 198 });
  });
  it("1 moonstone -> base 25 G -> 27.5 + 5 = 32.5 rounded up to 33 G", () => {
    expect(premiumOf([{ type: "moonstone" }])).toEqual({ premium: 33 });
  });
  it("2 runes + 1 moonstone -> no block (different types), base 75 G -> 88 G", () => {
    expect(premiumOf([...runes(2), { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> two blocks, base 120 G -> 137 G", () => {
    const moonstones: Item[] = [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }];
    expect(premiumOf([...runes(3), ...moonstones])).toEqual({ premium: 137 });
  });
  it("newcomer with cursed steel sword enchantment 3 -> 165 G", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({
      premium: 165,
    });
  });
  it("sword enchantment 4, not cursed -> no high-enchantment surcharge -> 115 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
  });
  it("sword enchantment exactly 5 -> 30 % high-enchantment surcharge -> 145 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it("cursed sword enchantment 5 -> both surcharges -> 195 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("cursed sword enchantment 4 -> only curse surcharge -> 165 G", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("customer with exactly 2 years -> loyalty discount: 100 - 20 + 10 + 5 = 95 G", () => {
    expect(premiumOf([{ type: "sword" }], { yearsWithMHPCO: 2 })).toEqual({ premium: 95 });
  });
  it("customer with 1 year -> no loyalty discount -> 115 G", () => {
    expect(premiumOf([{ type: "sword" }], { yearsWithMHPCO: 1 })).toEqual({ premium: 115 });
  });
  it("cursed sword + plain amulet -> curse applies to sword only: 160 + 50 + 16 + 5 = 231 G", () => {
    expect(premiumOf([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("second quote in scenario -> 15 % follow-up discount: 100 + 10 - 15 + 5 = 100 G", () => {
    const { results } = runScenario({
      customer: newcomer,
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 100 });
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -> 160 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
  it("3-year customer, cursed sword enchantment 5 + 1 rune -> 197.5 rounded up to 198 G", () => {
    const items: Item[] = [{ type: "sword", enchantment: 5, cursed: true }, { type: "rune" }];
    expect(premiumOf(items, { yearsWithMHPCO: 3 })).toEqual({ premium: 198 });
  });
  it("quote with unknown item type broomstick -> throws Error", () => {
    expect(() => premiumOf([{ type: "broomstick" }])).toThrow(Error);
  });
});

const claimOf = (
  items: Item[],
  damages: { itemType: string; amount: number }[],
  customer = newcomer,
) =>
  runScenario({
    customer,
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  }).results[1];

describe("claim", () => {
  it("5-year customer, silver amulet, fire damage 200 -> payout 100, remainingCap 1100", () => {
    const amulet: Item = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(claimOf([amulet], [{ itemType: "amulet", amount: 200 }], { yearsWithMHPCO: 5 })).toEqual({
      payout: 100,
      remainingCap: 1100,
    });
  });
  it("regular steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("potion damage 300 -> payout 200, remainingCap 600 (cap 800)", () => {
    expect(claimOf([{ type: "potion" }], [{ itemType: "potion", amount: 300 }])).toEqual({
      payout: 200,
      remainingCap: 600,
    });
  });
  it("rune damage 200 -> payout 100, remainingCap 400 (cap 500)", () => {
    expect(claimOf(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("moonstone damage 150 -> payout 50, remainingCap 450 (cap 500)", () => {
    expect(claimOf([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 150 }])).toEqual({
      payout: 50,
      remainingCap: 450,
    });
  });
  it("dragon sword enchantment 9, damage 1000 -> 50 % wins: payout 400, remainingCap 1600", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 -> full: payout 700, remainingCap 1300", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
  });
  it("dragon sword exactly enchantment 8, damage 1000 -> payout 400", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimOf([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
  });
  it("sword + amulet, dragon attack 500 + 300 -> deductible per item: payout 600, remainingCap 2600 (cap 3200)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimOf([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords both damaged 500 -> separate deductibles: payout 800, remainingCap 3200 (cap 4000)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimOf([{ type: "sword" }, { type: "sword" }], damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("sword + 3 runes (block), sword damage 500 -> payout 400, remainingCap 3100 (cap 3500)", () => {
    expect(claimOf([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 3100,
    });
  });
  it("cursed sword (premium 165) damage 500 -> cap 2000 from insurance value: remainingCap 1600", () => {
    const { results } = runScenario({
      customer: newcomer,
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 165 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("sword, two successive claims of 1500 -> 1400 / 600, then 600 / 0", () => {
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] };
    const { results } = runScenario({
      customer: newcomer,
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
  it("steel staff enchantment 9, damage 901 -> 350.5 rounded down to 350, remainingCap 1250", () => {
    const staff: Item = { type: "staff", material: "steel", enchantment: 9 };
    expect(claimOf([staff], [{ itemType: "staff", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1250 });
  });
  it("amulet damaged when only a sword is insured -> throws Error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(Error);
  });
  it("damage with unknown item type -> throws Error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(Error);
  });
  it("two sword damages but only one sword insured -> throws Error (whole claim rejected)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claimOf([{ type: "sword" }], damages)).toThrow(Error);
  });
  it("damage amount -200 -> throws Error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
});
