import { describe, expect, it } from "vitest";
import { runScenario, type ClaimStep, type Damage, type Item, type Result } from "./claim-office.js";

// Chosen error reading: the spec defines rejection only at the CLI (non-zero exit,
// error text on stderr). In the domain, runScenario rejects by throwing an Error.

const newcomer = { yearsWithMHPCO: 0 };

function quotePremium(items: Item[], customer = newcomer): number {
  const { results } = runScenario({ customer, steps: [{ op: "quote", items }] });
  return (results[0] as { premium: number }).premium;
}

describe("quote — catalogue and base premiums (newcomer: +10 % first insurance, +5 G fee)", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([])).toBe(5);
  });
  it("plain sword -> base 100 -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword" }])).toBe(115);
  });
  it("plain amulet -> base 60 -> premium 71 G", () => {
    expect(quotePremium([{ type: "amulet" }])).toBe(71);
  });
  it("plain staff -> base 80 -> premium 93 G", () => {
    expect(quotePremium([{ type: "staff" }])).toBe(93);
  });
  it("plain potion -> base 40 -> premium 49 G", () => {
    expect(quotePremium([{ type: "potion" }])).toBe(49);
  });
  it("2 runes -> base 50 -> premium 60 G", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("2 moonstones -> base 50 -> premium 60 G", () => {
    expect(quotePremium([{ type: "moonstone" }, { type: "moonstone" }])).toBe(60);
  });
  it("3 runes -> block base 60 -> premium 71 G", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes -> no block, base 100 -> premium 115 G", () => {
    expect(quotePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("7 runes -> base 175 -> 197.5 rounded up in MHPCO's favor -> premium 198 G", () => {
    expect(quotePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("2 runes + 1 moonstone -> no block (different types), base 75 -> 87.5 -> premium 88 G", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> two blocks, base 120 -> premium 137 G", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(quotePremium([...runes, ...moonstones])).toBe(137);
  });
  it("quote with unknown item type 'broomstick' -> throws an Error", () => {
    expect(() => quotePremium([{ type: "broomstick" }])).toThrow(Error);
  });
});

describe("quote — item-specific modifiers", () => {
  it("cursed steel sword, enchantment 3, newcomer -> premium 165 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword enchantment 4, not cursed -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("sword enchantment 4, cursed -> curse only -> premium 165 G", () => {
    expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("sword exactly enchantment 5, not cursed -> +30 % -> premium 145 G", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5, cursed: false }])).toBe(145);
  });
  it("sword exactly enchantment 5, cursed -> both surcharges -> premium 195 G", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("cursed sword + plain amulet -> base 160 + 50 curse (sword only) + 16 first insurance + 5 -> premium 231 G", () => {
    expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
});

describe("quote — policy-wide modifiers and customer history", () => {
  it("customer exactly 2 years, plain sword -> loyalty applies -> premium 95 G", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("customer 1 year, plain sword -> no loyalty -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1 })).toBe(115);
  });
  it("newcomer second quote, plain sword -> follow-up -15 %, first insurance still +10 % -> premium 100 G", () => {
    const { results } = runScenario({
      customer: newcomer,
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 100 });
  });
  it("newcomer third quote, plain sword -> follow-up discount again -> premium 100 G", () => {
    const { results } = runScenario({
      customer: newcomer,
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[2]).toEqual({ premium: 100 });
  });
  it("3-year customer second quote, cursed steel sword enchantment 7 -> premium 160 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
});

function claimResult(items: Item[], damages: Damage[]): Result {
  const { results } = runScenario({
    customer: newcomer,
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1];
}

describe("claim — reimbursement clauses", () => {
  it("steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    expect(
      claimResult([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune, damage 200 -> payout 100, remainingCap 400", () => {
    expect(claimResult([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("staff (insurance value 800, cap 1600), damage 200 -> payout 100, remainingCap 1500", () => {
    expect(claimResult([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 1500,
    });
  });
  it("potion (insurance value 400, cap 800), damage 200 -> payout 100, remainingCap 700", () => {
    expect(claimResult([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 700,
    });
  });
  it("steel sword enchantment 9, damage 1000 -> 50 % then deductible -> payout 400, remainingCap 1600", () => {
    expect(
      claimResult([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 -> full then deductible -> payout 700, remainingCap 1300", () => {
    expect(
      claimResult([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon sword exactly enchantment 8, damage 1000 -> 50 % wins -> payout 400", () => {
    expect(
      claimResult([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 9, damage 1000 -> 50 % wins -> payout 400", () => {
    expect(
      claimResult([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("amulet enchantment 9, damage 901 -> 350.5 rounded down -> payout 350", () => {
    expect(claimResult([{ type: "amulet", enchantment: 9 }], [{ itemType: "amulet", amount: 901 }])).toMatchObject({
      payout: 350,
    });
  });
});

describe("claim — deductible per damaged item", () => {
  it("sword (500) and amulet (300) damaged by a dragon -> payout 600, remainingCap 2600", () => {
    expect(
      claimResult(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords both damaged 500 -> payout 800, remainingCap 3200 (cap 4000)", () => {
    expect(
      claimResult(
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
  it("cursed sword: cap from unmodified value 2000; damage 1500 -> payout 1400, remainingCap 600", () => {
    expect(claimResult([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 1500 }])).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("sword + 3 runes: insurance sum 1750, cap 3500; sword damage 3000 -> payout 2900, remainingCap 600", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(claimResult(items, [{ itemType: "sword", amount: 3000 }])).toEqual({ payout: 2900, remainingCap: 600 });
  });
  it("sword + amulet: cap 3200; damages 3000 + 500 -> desired 3300 limited -> payout 3200, remainingCap 0", () => {
    expect(
      claimResult(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 3000 },
          { itemType: "amulet", amount: 500 },
        ],
      ),
    ).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("two successive claims of 1500 on one sword -> 1400/600 then 600/0", () => {
    const claim: ClaimStep = { op: "claim", policy: 0, incident: { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] } };
    const { results } = runScenario({
      customer: newcomer,
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("claim refers to its policy by quote step index -> amulet policy at step 1, damage 300 -> payout 200, remainingCap 1000", () => {
    const { results } = runScenario({
      customer: newcomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
});

describe("claim — rejections", () => {
  it("damage to an amulet when only a sword is insured -> throws an Error", () => {
    expect(() => claimResult([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/not insured/);
  });
  it("damage to an unknown item type -> throws an Error", () => {
    expect(() => claimResult([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/not insured/);
  });
  it("two sword damages but only one sword insured -> throws an Error", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claimResult([{ type: "sword" }], damages)).toThrow(/not insured/);
  });
  it("damage amount -200 -> throws an Error", () => {
    expect(() => claimResult([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
});
