import { describe, expect, it } from "vitest";
import { runScenario, type Damage, type InsuredItem, type Step } from "./claimOffice.js";

const alikeItems = (type: string, count: number): InsuredItem[] => Array.from({ length: count }, () => ({ type }));
const runes = (count: number): InsuredItem[] => alikeItems("rune", count);
const moonstones = (count: number): InsuredItem[] => alikeItems("moonstone", count);

const resultsFor = (steps: Step[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps }).results;

const quoteStep = (items: InsuredItem[]): Step => ({ op: "quote", items });

const claimStep = (policy: number, damages: Damage[], cause = "dragon attack"): Step => ({
  op: "claim",
  policy,
  incident: { cause, damages },
});

const claimAgainst = (items: InsuredItem[], damages: Damage[]) => resultsFor([quoteStep(items), claimStep(0, damages)])[1];

const payoutFor = (item: InsuredItem, amount: number) =>
  (claimAgainst([item], [{ itemType: item.type, amount }]) as { payout: number }).payout;

const quoteFor = (items: InsuredItem[], yearsWithMHPCO = 0): number => {
  const [result] = resultsFor([quoteStep(items)], yearsWithMHPCO);
  return (result as { premium: number }).premium;
};

// Reading adopted for failures: the domain throws an Error; the CLI turns it into
// a non-zero exit status with an error description on stderr and nothing on stdout.
// Premiums below include the 10 % first-insurance surcharge (each quoted item is a
// first insurance) and the 5 G fee; "base" values from the spec are noted alongside.

describe("quote — base premiums (newcomer, first contract)", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quoteFor([])).toBe(5);
  });
  it("plain sword → 115 G (base 100 + 10 first insurance + 5 fee)", () => {
    expect(quoteFor([{ type: "sword" }])).toBe(115);
  });
  it("plain amulet → 71 G (base 60 + 6 + 5)", () => {
    expect(quoteFor([{ type: "amulet" }])).toBe(71);
  });
  it("plain staff → 93 G (base 80 + 8 + 5)", () => {
    expect(quoteFor([{ type: "staff" }])).toBe(93);
  });
  it("plain potion → 49 G (base 40 + 4 + 5)", () => {
    expect(quoteFor([{ type: "potion" }])).toBe(49);
  });
  it("1 rune → 33 G (base 25 + 2.5 + 5 = 32.5, rounded up)", () => {
    expect(quoteFor([{ type: "rune" }])).toBe(33);
  });
  it("1 moonstone → 33 G (base 25, same as rune)", () => {
    expect(quoteFor([{ type: "moonstone" }])).toBe(33);
  });
  it("2 runes → 60 G (base 50)", () => {
    expect(quoteFor(runes(2))).toBe(60);
  });
  it("3 runes → 71 G (base 60, block applies)", () => {
    expect(quoteFor(runes(3))).toBe(71);
  });
  it("4 runes → 115 G (base 100, no block — block requires exactly 3)", () => {
    expect(quoteFor(runes(4))).toBe(115);
  });
  it("7 runes → 198 G (base 175; 197.5 rounded up in MHPCO's favor)", () => {
    expect(quoteFor(runes(7))).toBe(198);
  });
  it("2 runes + 1 moonstone → 88 G (base 75, no block: different types; 87.5 rounded up)", () => {
    expect(quoteFor([...runes(2), ...moonstones(1)])).toBe(88);
  });
  it("3 runes + 3 moonstones → 137 G (base 120, two separate blocks)", () => {
    expect(quoteFor([...runes(3), ...moonstones(3)])).toBe(137);
  });
  it("unknown item type (broomstick) → throws an Error", () => {
    expect(() => quoteFor([{ type: "broomstick" }])).toThrow(Error);
  });
});

describe("quote — item-specific modifiers", () => {
  it("cursed sword, enchantment 3, newcomer → 165 G (100 + 50 curse + 10 first + 5)", () => {
    expect(quoteFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword with exactly enchantment 5 → 145 G (100 + 30 high enchantment + 10 + 5)", () => {
    expect(quoteFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 → 195 G (both surcharges)", () => {
    expect(quoteFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("sword with enchantment 4 → 115 G (no high-enchantment surcharge)", () => {
    expect(quoteFor([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword with enchantment 4 → 165 G (curse surcharge only)", () => {
    expect(quoteFor([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("cursed potion → 69 G (40 + 20 curse + 4 + 5) — surcharges apply to non-sword items", () => {
    expect(quoteFor([{ type: "potion", cursed: true }])).toBe(69);
  });
  it("amulet with enchantment 6 → 89 G (60 + 18 high enchantment + 6 + 5)", () => {
    expect(quoteFor([{ type: "amulet", enchantment: 6 }])).toBe(89);
  });
  it("cursed sword + plain amulet → 231 G (base 160 + 50 curse on sword only + 16 first + 5)", () => {
    expect(quoteFor([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
});

describe("quote — policy-wide modifiers", () => {
  it("customer with exactly 2 years, plain sword → 95 G (100 − 20 loyalty + 10 + 5)", () => {
    expect(quoteFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year, plain sword → 115 G (no loyalty discount)", () => {
    expect(quoteFor([{ type: "sword" }], 1)).toBe(115);
  });
  it("second quote of a 0-year customer, plain sword → 100 G (100 + 10 − 15 follow-up + 5)", () => {
    const sword = [{ type: "sword" }];
    expect(resultsFor([quoteStep(sword), quoteStep(sword)])).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("third quote of a 0-year customer, plain sword → 100 G (15 % on each follow-up contract)", () => {
    const sword = [{ type: "sword" }];
    expect(resultsFor([quoteStep(sword), quoteStep(sword), quoteStep(sword)])).toEqual([
      { premium: 115 },
      { premium: 100 },
      { premium: 100 },
    ]);
  });
  it("3-year customer, second quote, cursed sword enchantment 7 → 160 G (integration example)", () => {
    const results = resultsFor(
      [quoteStep([{ type: "amulet" }]), quoteStep([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])],
      3,
    );
    expect(results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
});

describe("claim — reimbursement", () => {
  it("schema example: 5-year customer, silver amulet ench 2 → premium 59 G; fire damage 200 → payout 100, remainingCap 1100", () => {
    const results = resultsFor(
      [
        quoteStep([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]),
        claimStep(0, [{ itemType: "amulet", amount: 200 }], "fire"),
      ],
      5,
    );
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("steel sword ench 3, damage 500 → payout 400, remainingCap 1600", () => {
    expect(
      claimAgainst([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune, damage 200 → payout 100, remainingCap 400", () => {
    expect(claimAgainst(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("moonstone, damage 200 → payout 100, remainingCap 400", () => {
    expect(claimAgainst(moonstones(1), [{ itemType: "moonstone", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("staff, damage 300 → payout 200, remainingCap 1400", () => {
    expect(claimAgainst([{ type: "staff" }], [{ itemType: "staff", amount: 300 }])).toEqual({
      payout: 200,
      remainingCap: 1400,
    });
  });
  it("potion, damage 300 → payout 200, remainingCap 600", () => {
    expect(claimAgainst([{ type: "potion" }], [{ itemType: "potion", amount: 300 }])).toEqual({
      payout: 200,
      remainingCap: 600,
    });
  });
  it("steel sword ench 9, damage 1000 → payout 400 (50 % then deductible)", () => {
    expect(payoutFor({ type: "sword", material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });
  it("dragon sword ench 9, damage 1000 → payout 400 (50 % rule wins)", () => {
    expect(payoutFor({ type: "sword", material: "dragon", enchantment: 9 }, 1000)).toBe(400);
  });
  it("dragon sword exactly ench 8, damage 1000 → payout 400", () => {
    expect(payoutFor({ type: "sword", material: "dragon", enchantment: 8 }, 1000)).toBe(400);
  });
  it("dragon sword ench 5, damage 800 → payout 700 (full reimbursement minus deductible)", () => {
    expect(payoutFor({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toBe(700);
  });
  it("steel sword ench 8, damage 901 → payout 350 (350.5 rounded down)", () => {
    expect(payoutFor({ type: "sword", material: "steel", enchantment: 8 }, 901)).toBe(350);
  });
  it("sword 500 + amulet 300 in one incident → payout 600 (deductible per damaged item), remainingCap 2600", () => {
    expect(
      claimAgainst(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords insured, both damaged 500 → payout 800, remainingCap 3200 (cap 4000)", () => {
    expect(
      claimAgainst(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
});

describe("claim — cap", () => {
  it("cursed sword policy, damage 500 → remainingCap 1600 (cap 2000 from insurance value, not premium)", () => {
    expect(claimAgainst([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("sword + 3 runes policy, sword damage 500 → remainingCap 3100 (insurance sum 1750)", () => {
    expect(claimAgainst([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 3100,
    });
  });
  it("sword policy, two successive claims of 1500 → payouts 1400 then 600; remainingCap 600 then 0", () => {
    const damages = [{ itemType: "sword", amount: 1500 }];
    expect(resultsFor([quoteStep([{ type: "sword" }]), claimStep(0, damages), claimStep(0, damages)]).slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});

describe("claim — rejections", () => {
  it("damage to an amulet when only a sword is insured → throws an Error", () => {
    expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(Error);
  });
  it("damage to an unknown item type → throws an Error", () => {
    expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(Error);
  });
  it("two sword damages but only one sword insured → throws an Error", () => {
    expect(() =>
      claimAgainst(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toThrow(Error);
  });
  it("damage amount −200 → throws an Error", () => {
    expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
});
