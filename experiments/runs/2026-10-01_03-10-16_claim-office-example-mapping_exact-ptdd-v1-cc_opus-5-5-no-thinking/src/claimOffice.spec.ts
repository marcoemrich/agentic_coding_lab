import { describe, expect, it } from "vitest";
import { runScenario, type Damage, type Item, type Scenario, type Step } from "./claimOffice.js";

const premiumOf = (scenario: Scenario, step = 0): unknown => runScenario(scenario)[step];
const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
const moonstones = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "moonstone" }));
const newcomerQuote = (items: Item[]): unknown =>
  premiumOf({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });

describe("quote", () => {
  it("empty item list -> premium 5 (only the processing fee)", () => {
    expect(premiumOf({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ premium: 5 });
  });
  it("newcomer plain sword -> 100 base + 10 first insurance + 5 fee = 115", () => {
    expect(newcomerQuote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("newcomer plain amulet -> 60 base + 6 first insurance + 5 fee = 71", () => {
    expect(newcomerQuote([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("newcomer plain staff -> 80 base + 8 first insurance + 5 fee = 93", () => {
    expect(newcomerQuote([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("newcomer plain potion -> 40 base + 4 first insurance + 5 fee = 49", () => {
    expect(newcomerQuote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("2 runes -> base 50 -> premium 60", () => {
    expect(newcomerQuote(runes(2))).toEqual({ premium: 60 });
  });
  it("3 runes -> block base 60 -> premium 71", () => {
    expect(newcomerQuote(runes(3))).toEqual({ premium: 71 });
  });
  it("4 runes -> no block, base 100 -> premium 115", () => {
    expect(newcomerQuote(runes(4))).toEqual({ premium: 115 });
  });
  it("7 runes -> no block, base 175 -> 197.5 rounded up in MHPCO's favor to 198", () => {
    expect(newcomerQuote(runes(7))).toEqual({ premium: 198 });
  });
  it("1 moonstone -> base 25 -> 32.5 rounded up to 33", () => {
    expect(newcomerQuote(moonstones(1))).toEqual({ premium: 33 });
  });
  it("2 runes + 1 moonstone -> no block across types, base 75 -> 87.5 rounded up to 88", () => {
    expect(newcomerQuote([...runes(2), ...moonstones(1)])).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> two separate blocks, base 120 -> premium 137", () => {
    expect(newcomerQuote([...runes(3), ...moonstones(3)])).toEqual({ premium: 137 });
  });
  it("newcomer cursed steel sword enchantment 3 -> premium 165", () => {
    expect(newcomerQuote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("cursed sword + plain amulet -> surcharge only on sword: 160 + 50 + 16 + 5 = 231", () => {
    expect(newcomerQuote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({
      premium: 231,
    });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge: 100 + 30 + 10 + 5 = 145", () => {
    expect(newcomerQuote([{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge: 115", () => {
    expect(newcomerQuote([{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 5 -> both surcharges: 100 + 50 + 30 + 10 + 5 = 195", () => {
    expect(newcomerQuote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("cursed sword with enchantment 4 -> curse surcharge only: 165", () => {
    expect(newcomerQuote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("amulet with enchantment 6 -> surcharge on amulet base: 60 + 18 + 6 + 5 = 89", () => {
    expect(newcomerQuote([{ type: "amulet", enchantment: 6 }])).toEqual({ premium: 89 });
  });
  it("customer with exactly 2 years -> loyalty discount: 100 - 20 + 10 + 5 = 95", () => {
    expect(premiumOf({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({
      premium: 95,
    });
  });
  it("customer with 1 year -> no loyalty discount: 115", () => {
    expect(premiumOf({ customer: { yearsWithMHPCO: 1 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({
      premium: 115,
    });
  });
  it("second quote in scenario -> follow-up discount: 100 + 10 - 15 + 5 = 100", () => {
    const sword: Step = { op: "quote", items: [{ type: "sword" }] };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [sword, sword] })).toEqual([
      { premium: 115 },
      { premium: 100 },
    ]);
  });
  it("third quote in scenario -> follow-up discount again: 100", () => {
    const sword: Step = { op: "quote", items: [{ type: "sword" }] };
    expect(premiumOf({ customer: { yearsWithMHPCO: 0 }, steps: [sword, sword, sword] }, 2)).toEqual({ premium: 100 });
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 -> 175 then 160", () => {
    const cursedSword: Step = {
      op: "quote",
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
    };
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [cursedSword, cursedSword] })).toEqual([
      { premium: 175 },
      { premium: 160 },
    ]);
  });
});

const claimAgainst = (items: Item[], ...damages: Damage[]): unknown =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  })[1];

describe("claim", () => {
  it("schema example: loyal customer's amulet, damage 200 -> payout 100, remainingCap 1100", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("regular steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    expect(
      claimAgainst([{ type: "sword", material: "steel", enchantment: 3 }], { itemType: "sword", amount: 500 }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250), damage 200 -> payout 100, remainingCap 400", () => {
    expect(claimAgainst(runes(1), { itemType: "rune", amount: 200 })).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword enchantment 9, damage 1000 -> 50% rule wins, payout 400", () => {
    expect(
      claimAgainst([{ type: "sword", material: "dragon", enchantment: 9 }], { itemType: "sword", amount: 1000 }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 -> full reimbursement, payout 700", () => {
    expect(
      claimAgainst([{ type: "sword", material: "dragon", enchantment: 5 }], { itemType: "sword", amount: 800 }),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400", () => {
    expect(
      claimAgainst([{ type: "sword", material: "steel", enchantment: 9 }], { itemType: "sword", amount: 1000 }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword with exactly enchantment 8, damage 1000 -> payout 400", () => {
    expect(
      claimAgainst([{ type: "sword", material: "dragon", enchantment: 8 }], { itemType: "sword", amount: 1000 }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword enchantment 8, damage 901 -> 350.5 rounded down to 350, remainingCap 1650", () => {
    expect(claimAgainst([{ type: "sword", enchantment: 8 }], { itemType: "sword", amount: 901 })).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });
  it("dragon attack on sword (500) and amulet (300) -> deductible per item, payout 600, cap 3200 -> remainingCap 2600", () => {
    expect(
      claimAgainst(
        [{ type: "sword" }, { type: "amulet" }],
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords, both damaged 500 -> separate deductibles, payout 800, cap 4000 -> remainingCap 3200", () => {
    expect(
      claimAgainst(
        [{ type: "sword" }, { type: "sword" }],
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("cursed sword cap based on unmodified value: damage 500 -> payout 400, remainingCap 1600", () => {
    expect(claimAgainst([{ type: "sword", cursed: true }], { itemType: "sword", amount: 500 })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("sword + 3 runes insurance sum 1750, damage sword 500 -> payout 400, remainingCap 3100", () => {
    expect(claimAgainst([{ type: "sword" }, ...runes(3)], { itemType: "sword", amount: 500 })).toEqual({
      payout: 400,
      remainingCap: 3100,
    });
  });
  it("two successive claims of 1500 on a sword -> 1400/600 then 600/0", () => {
    const claim: Step = {
      op: "claim",
      policy: 0,
      incident: { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    expect(
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim] }),
    ).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("staff (insurance value 800), damage 200 -> payout 100, remainingCap 1500", () => {
    expect(claimAgainst([{ type: "staff" }], { itemType: "staff", amount: 200 })).toEqual({
      payout: 100,
      remainingCap: 1500,
    });
  });
  it("potion (insurance value 400), damage 200 -> payout 100, remainingCap 700", () => {
    expect(claimAgainst([{ type: "potion" }], { itemType: "potion", amount: 200 })).toEqual({
      payout: 100,
      remainingCap: 700,
    });
  });
});

describe("rejected scenarios (runScenario throws an Error naming the problem)", () => {
  it("quote with unknown item type broomstick -> throws", () => {
    expect(() => newcomerQuote([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("claim damage to an amulet when only a sword is insured -> throws", () => {
    expect(() => claimAgainst([{ type: "sword" }], { itemType: "amulet", amount: 200 })).toThrow(/amulet/);
  });
  it("claim damage to an unknown item type -> throws", () => {
    expect(() => claimAgainst([{ type: "sword" }], { itemType: "broomstick", amount: 200 })).toThrow(/broomstick/);
  });
  it("claim with two sword damages but only one sword insured -> throws", () => {
    expect(() =>
      claimAgainst([{ type: "sword" }], { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }),
    ).toThrow(/sword/);
  });
  it("claim with damage amount -200 -> throws", () => {
    expect(() => claimAgainst([{ type: "sword" }], { itemType: "sword", amount: -200 })).toThrow(/-200/);
  });
});
