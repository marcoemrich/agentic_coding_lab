import { describe, expect, it } from "vitest";
import { type Damage, type Item, type StepResult, processScenario } from "./claim-office.js";

const newcomer = { yearsWithMHPCO: 0 };
const rune: Item = { type: "rune" };
const moonstone: Item = { type: "moonstone" };

function times(count: number, item: Item): Item[] {
  return Array.from({ length: count }, () => item);
}

function premiumsForSuccessiveQuotes(itemLists: Item[][], customer = newcomer): number[] {
  const { results } = processScenario({ customer, steps: itemLists.map((items) => ({ op: "quote", items })) });
  return results.map((result) => (result as { premium: number }).premium);
}

function premiumFor(items: Item[], customer = newcomer): number {
  return premiumsForSuccessiveQuotes([items], customer)[0];
}

describe("quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumFor([])).toBe(5);
  });
  it("newcomer insures a plain sword -> 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
  });
  it("newcomer insures a plain amulet -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor([{ type: "amulet" }])).toBe(71);
  });
  it("newcomer insures a plain staff -> 80 + 8 + 5 = 93 G", () => {
    expect(premiumFor([{ type: "staff" }])).toBe(93);
  });
  it("newcomer insures a plain potion -> 40 + 4 + 5 = 49 G", () => {
    expect(premiumFor([{ type: "potion" }])).toBe(49);
  });
  it("2 runes -> 50 G base premium -> 50 + 5 + 5 = 60 G", () => {
    expect(premiumFor(times(2, rune))).toBe(60);
  });
  it("3 runes -> 60 G base premium (block) -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor(times(3, rune))).toBe(71);
  });
  it("4 runes -> 100 G base premium (no block) -> 100 + 10 + 5 = 115 G", () => {
    expect(premiumFor(times(4, rune))).toBe(115);
  });
  it("7 runes -> 175 G base premium -> 175 + 17.5 + 5 = 197.5 -> 198 G", () => {
    expect(premiumFor(times(7, rune))).toBe(198);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (different types, no block) -> 87.5 -> 88 G", () => {
    expect(premiumFor([...times(2, rune), moonstone])).toBe(88);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two blocks) -> 120 + 12 + 5 = 137 G", () => {
    expect(premiumFor([...times(3, rune), ...times(3, moonstone)])).toBe(137);
  });
  it("newcomer with a cursed steel sword (enchantment 3) -> 165 G", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("cursed sword + plain amulet -> 160 base + 50 curse (of the sword only) = 210, + 16 first + 5 fee = 231 G", () => {
    expect(premiumFor([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge: 100 + 30 + 10 + 5 = 145 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: false }])).toBe(145);
  });
  it("cursed sword with enchantment 5 -> both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge: 115 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("cursed sword with enchantment 4 -> only curse surcharge: 165 G", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("customer with exactly 2 years -> loyalty discount: 100 - 20 + 10 + 5 = 95 G", () => {
    expect(premiumFor([{ type: "sword" }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("customer with 1 year -> no loyalty discount: 115 G", () => {
    expect(premiumFor([{ type: "sword" }], { yearsWithMHPCO: 1 })).toBe(115);
  });
  it("second quote of a newcomer -> follow-up discount: first 115 G, second 100 + 10 - 15 + 5 = 100 G", () => {
    const sword: Item = { type: "sword" };
    expect(premiumsForSuccessiveQuotes([[sword], [sword]])).toEqual([115, 100]);
  });
  it("long-standing customer (3 years), second quote of cursed sword enchantment 7 -> 160 G (first insurance still applies)", () => {
    const premiums = premiumsForSuccessiveQuotes(
      [[{ type: "amulet" }], [{ type: "sword", material: "steel", enchantment: 7, cursed: true }]],
      { yearsWithMHPCO: 3 },
    );
    expect(premiums[1]).toBe(160);
  });
  it("premium yielding 197.5 G (second quote: cursed sword + 2 runes) -> rounded up to 198 G", () => {
    const premiums = premiumsForSuccessiveQuotes([[], [{ type: "sword", cursed: true }, ...times(2, rune)]]);
    expect(premiums[1]).toBe(198);
  });
});

function claimResultsFor(insuredItems: Item[], claims: Damage[][]): StepResult[] {
  const { results } = processScenario({
    customer: newcomer,
    steps: [
      { op: "quote", items: insuredItems },
      ...claims.map((damages) => ({ op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } })),
    ],
  });
  return results.slice(1);
}

function claimResultFor(insuredItems: Item[], damages: Damage[]): StepResult {
  return claimResultsFor(insuredItems, [damages])[0];
}

describe("claim", () => {
  it("regular steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    expect(
      claimResultFor([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250), damage 200 -> payout 100, remainingCap 400", () => {
    expect(claimResultFor([rune], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("amulet (insurance value 600), damage 200 -> payout 100, remainingCap 1100", () => {
    expect(claimResultFor([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 1100,
    });
  });
  it("staff (insurance value 800), damage 200 -> payout 100, remainingCap 1500", () => {
    expect(claimResultFor([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 1500,
    });
  });
  it("potion (insurance value 400), damage 200 -> payout 100, remainingCap 700", () => {
    expect(claimResultFor([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 700,
    });
  });
  it("moonstone (insurance value 250), damage 200 -> payout 100, remainingCap 400", () => {
    expect(claimResultFor([moonstone], [{ itemType: "moonstone", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 (50 % then deductible)", () => {
    expect(
      claimResultFor([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (50 % rule wins)", () => {
    expect(
      claimResultFor([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 -> payout 400", () => {
    expect(
      claimResultFor([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 (full reimbursement)", () => {
    expect(
      claimResultFor([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible per item), remainingCap 2600", () => {
    expect(
      claimResultFor(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("policy with two swords, both damaged 500 each -> payout 800, remainingCap 3200 (cap 4000)", () => {
    expect(
      claimResultFor(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("cursed sword policy -> cap 2000 from unmodified insurance value: damage 500 -> payout 400, remainingCap 1600", () => {
    expect(claimResultFor([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("sword + 3 runes (block) -> insurance sum 1750, cap 3500: sword damage 500 -> payout 400, remainingCap 3100", () => {
    expect(claimResultFor([{ type: "sword" }, ...times(3, rune)], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 3100,
    });
  });
  it("two successive claims of 1500 on a sword -> payout 1400 / remainingCap 600, then payout 600 / remainingCap 0", () => {
    const swordDamage = [{ itemType: "sword", amount: 1500 }];
    expect(claimResultsFor([{ type: "sword" }], [swordDamage, swordDamage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("payout yielding 350.5 G (steel sword enchantment 9, damage 901) -> rounded down to 350 G", () => {
    expect(
      claimResultFor([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });
});
