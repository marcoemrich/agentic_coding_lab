import { describe, expect, it } from "vitest";
import { type Damage, type Item, runScenario, type StepResult } from "./claimOffice.js";

function premiumFor(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return (results[0] as { premium: number }).premium;
}

function components(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

function claimFor(items: Item[], damages: Damage[]): StepResult {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1];
}

describe("quote", () => {
  it("empty item list -> premium 5 G (fee only; first insurance on 0 G base)", () => {
    expect(premiumFor([])).toBe(5);
  });
  it("newcomer with a plain sword -> 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(premiumFor([{ type: "sword" }])).toBe(115);
  });
  it("newcomer with a plain amulet -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor([{ type: "amulet" }])).toBe(71);
  });
  it("newcomer with a plain staff -> 80 + 8 + 5 = 93 G", () => {
    expect(premiumFor([{ type: "staff" }])).toBe(93);
  });
  it("newcomer with a plain potion -> 40 + 4 + 5 = 49 G", () => {
    expect(premiumFor([{ type: "potion" }])).toBe(49);
  });
  it("2 runes -> 50 G base -> 50 + 5 + 5 = 60 G", () => {
    expect(premiumFor(components("rune", 2))).toBe(60);
  });
  it("3 runes -> block 60 G base -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor(components("rune", 3))).toBe(71);
  });
  it("4 runes -> no block, 100 G base -> 100 + 10 + 5 = 115 G", () => {
    expect(premiumFor(components("rune", 4))).toBe(115);
  });
  it("7 runes -> no block, 175 G base -> 175 + 17.5 + 5 = 197.5 -> rounded up to 198 G", () => {
    expect(premiumFor(components("rune", 7))).toBe(198);
  });
  it("2 moonstones -> 50 G base -> 60 G (moonstone is a component)", () => {
    expect(premiumFor(components("moonstone", 2))).toBe(60);
  });
  it("2 runes + 1 moonstone -> 75 G base, no block across types -> 75 + 7.5 + 5 = 87.5 -> 88 G", () => {
    expect(premiumFor([...components("rune", 2), ...components("moonstone", 1)])).toBe(88);
  });
  it("3 runes + 3 moonstones -> two blocks, 120 G base -> 120 + 12 + 5 = 137 G", () => {
    expect(premiumFor([...components("rune", 3), ...components("moonstone", 3)])).toBe(137);
  });
  it("newcomer with a cursed sword (steel, enchantment 3) -> 165 G", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> 115 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("sword with exactly enchantment 5 -> 30% surcharge -> 100 + 30 + 10 + 5 = 145 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("cursed sword with enchantment 5 -> both surcharges -> 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("cursed sword + plain amulet -> curse only on sword: 160 + 50 + 16 first insurance + 5 = 231 G", () => {
    expect(premiumFor([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("high enchantment only on the enchanted item: enchantment-5 sword + plain amulet -> 160 + 30 + 16 + 5 = 211 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5 }, { type: "amulet" }])).toBe(211);
  });
  it("customer with exactly 2 years -> loyalty discount: plain sword -> 100 - 20 + 10 + 5 = 95 G", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year -> no loyalty discount: plain sword -> 115 G", () => {
    expect(premiumFor([{ type: "sword" }], 1)).toBe(115);
  });
  it("second quote in a scenario gets the 15% follow-up discount: plain sword twice -> 115 G then 100 G", () => {
    const sword = { type: "sword" };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 -> 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
  it("throws Error for an unknown item type (broomstick)", () => {
    expect(() => premiumFor([{ type: "broomstick" }])).toThrow(Error);
  });
});

describe("claim", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    expect(claimFor([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("rune (insurance value 250 G), damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimFor([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("amulet cap is 2 x 600 G: damage 200 G -> payout 100 G, remaining cap 1100 G", () => {
    expect(claimFor([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("staff cap is 2 x 800 G: damage 200 G -> payout 100 G, remaining cap 1500 G", () => {
    expect(claimFor([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("potion cap is 2 x 400 G: damage 200 G -> payout 100 G, remaining cap 700 G", () => {
    expect(claimFor([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
  });
  it("moonstone cap is 2 x 250 G: damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimFor([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    expect(claimFor([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G", () => {
    expect(claimFor([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% rule wins)", () => {
    expect(claimFor([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    expect(claimFor([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("payout of 350.5 G is rounded down to 350 G (enchantment-9 sword, damage 901 G)", () => {
    expect(claimFor([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("dragon attack on sword (500 G) and amulet (300 G) -> payout 600 G, deductible once per damaged item, remaining cap 2600 G", () => {
    expect(
      claimFor(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("policy with sword and amulet -> insurance sum 1600 G, cap 3200 G", () => {
    expect(claimFor([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("cursed sword -> cap 2000 G, based on unmodified insurance value", () => {
    expect(claimFor([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword and 3 runes (a block) -> insurance sum 1750 G, cap 3500 G", () => {
    expect(claimFor([{ type: "sword" }, ...components("rune", 3)], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("policy with two swords, both damaged 500 G -> two deductibles, payout 800 G, remaining cap 3200 G", () => {
    expect(
      claimFor(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("two successive 1500 G claims on a sword -> 1400 G (cap 600 G) then 600 G (cap 0 G)", () => {
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
  it("throws Error when damages list more swords than the policy covers", () => {
    expect(() =>
      claimFor(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toThrow(Error);
  });
  it("throws Error when a damaged item type is not part of the policy (amulet on sword policy)", () => {
    expect(() => claimFor([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(Error);
  });
  it("throws Error when a damaged item type is unknown", () => {
    expect(() => claimFor([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(Error);
  });
  it("throws Error when a damage amount is negative (-200)", () => {
    expect(() => claimFor([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
});
