import { describe, expect, it } from "vitest";
import { runScenario, type ClaimStep, type Damage, type Item, type QuoteStep } from "./claim-office.js";

const newcomer = { yearsWithMHPCO: 0 };

function quotePremium(items: Item[], customer = newcomer): number {
  const { results } = runScenario({ customer, steps: [{ op: "quote", items }] });
  return (results[0] as { premium: number }).premium;
}

function quoteStep(items: Item[]): QuoteStep {
  return { op: "quote", items };
}

function claimStep(policy: number, damages: Damage[]): ClaimStep {
  return { op: "claim", policy, incident: { cause: "dragon attack", damages } };
}

function claimResult(items: Item[], damages: Damage[]): unknown {
  const { results } = runScenario({ customer: newcomer, steps: [quoteStep(items), claimStep(0, damages)] });
  return results[1];
}

function runes(count: number): Item[] {
  return Array.from({ length: count }, () => ({ type: "rune" }));
}

describe("quote premiums", () => {
  it("empty item list -> premium 5 (only the processing fee)", () => {
    expect(quotePremium([])).toBe(5);
  });
  it("plain sword for a newcomer -> 115 (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
  });
  it("plain amulet for a newcomer -> 71 (60 base + 6 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);
  });
  it("plain staff for a newcomer -> 93 (80 base + 8 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "staff", material: "oak", enchantment: 0, cursed: false }])).toBe(93);
  });
  it("plain potion for a newcomer -> 49 (40 base + 4 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
  });
  it("1 rune -> 33 (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
    expect(quotePremium(runes(1))).toBe(33);
  });
  it("1 moonstone -> 33 (25 base, same as rune)", () => {
    expect(quotePremium([{ type: "moonstone" }])).toBe(33);
  });
  it("2 runes -> 60 (50 base)", () => {
    expect(quotePremium(runes(2))).toBe(60);
  });
  it("3 runes -> 71 (60 block base)", () => {
    expect(quotePremium(runes(3))).toBe(71);
  });
  it("4 runes -> 115 (100 base, no block)", () => {
    expect(quotePremium(runes(4))).toBe(115);
  });
  it("7 runes -> 198 (175 base; 197.5 rounded up in MHPCO's favor)", () => {
    expect(quotePremium(runes(7))).toBe(198);
  });
  it("2 runes + 1 moonstone -> 88 (75 base, no block across different types)", () => {
    expect(quotePremium([...runes(2), { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> 137 (120 base, two separate blocks)", () => {
    expect(quotePremium([...runes(3), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))])).toBe(137);
  });
  it("cursed sword for a newcomer -> 165 (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("cursed sword + plain amulet -> 231 (160 base + 50 curse on sword only + 16 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("sword with enchantment 4 -> 115 (no high-enchantment surcharge)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("sword with exactly enchantment 5 -> 145 (100 + 30 high enchantment + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5, cursed: false }])).toBe(145);
  });
  it("cursed sword with enchantment 5 -> 195 (both surcharges: 100 + 50 + 30 + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("customer with 1 year -> sword 115 (no loyalty discount)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1 })).toBe(115);
  });
  it("customer with exactly 2 years -> sword 95 (100 - 20 loyalty + 10 + 5)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("second quote in a scenario is a follow-up contract -> sword 100 (100 + 10 - 15 + 5)", () => {
    const sword = { type: "sword" };
    const { results } = runScenario({
      customer: newcomer,
      steps: [quoteStep([sword]), quoteStep([sword])],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("long-standing customer's second contract, cursed sword enchantment 7 -> 160", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        quoteStep([{ type: "amulet" }]),
        quoteStep([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
  it("schema example: 5-year customer, silver amulet enchantment 2 -> 59", () => {
    expect(quotePremium([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }], { yearsWithMHPCO: 5 })).toBe(59);
  });
  it("quote with unknown item type 'broomstick' -> throws an Error", () => {
    expect(() => quotePremium([{ type: "broomstick" }])).toThrow(Error);
  });
});

describe("claims", () => {
  it("regular steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    expect(
      claimResult([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 -> payout 100, remainingCap 400 (cap 2 x 250)", () => {
    expect(claimResult(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("sword 500 + amulet 300 damaged -> payout 600 (deductible per damaged item), remainingCap 2600 (cap 3200)", () => {
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
  it("steel sword enchantment 9, damage 1000 -> payout 400 (50 % then deductible)", () => {
    expect(
      claimResult([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 9, damage 1000 -> payout 400 (50 % rule wins)", () => {
    expect(
      claimResult([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword exactly enchantment 8, damage 1000 -> payout 400", () => {
    expect(
      claimResult([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 -> payout 700 (full reimbursement)", () => {
    expect(
      claimResult([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("payout of 350.5 is rounded down -> enchantment 9 sword damage 901 -> payout 350", () => {
    expect(
      claimResult([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("two swords, both damaged 500 -> payout 800, remainingCap 3200 (cap 4000)", () => {
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
  it("cursed sword (premium 165), damage 2500 -> payout 2000, remainingCap 0 (cap from insurance value 1000)", () => {
    expect(
      claimResult([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], [{ itemType: "sword", amount: 2500 }]),
    ).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3 runes, sword damage 1000 -> payout 900, remainingCap 2600 (cap 3500)", () => {
    expect(claimResult([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 900,
      remainingCap: 2600,
    });
  });
  it("two successive 1500 claims on a sword -> 1400/600 then 600/0", () => {
    const claim = claimStep(0, [{ itemType: "sword", amount: 1500 }]);
    const { results } = runScenario({ customer: newcomer, steps: [quoteStep([{ type: "sword" }]), claim, claim] });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("claim refers to its policy by quote step index -> amulet on policy 1, damage 200 -> payout 100, remainingCap 1100", () => {
    const { results } = runScenario({
      customer: newcomer,
      steps: [
        quoteStep([{ type: "sword" }]),
        quoteStep([{ type: "amulet" }]),
        claimStep(1, [{ itemType: "amulet", amount: 200 }]),
      ],
    });
    expect(results[2]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("schema example: amulet damage 200 -> payout 100, remainingCap 1100", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        quoteStep([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]),
        claimStep(0, [{ itemType: "amulet", amount: 200 }]),
      ],
    });
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("damage to an amulet when only a sword is insured -> throws an Error", () => {
    expect(() => claimResult([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(Error);
  });
  it("damage to an unknown item type -> throws an Error", () => {
    expect(() => claimResult([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(Error);
  });
  it("two sword damages but only one sword insured -> throws an Error (whole claim rejected)", () => {
    expect(() =>
      claimResult(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toThrow(Error);
  });
  it("damage amount -200 -> throws an Error", () => {
    expect(() => claimResult([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
});
