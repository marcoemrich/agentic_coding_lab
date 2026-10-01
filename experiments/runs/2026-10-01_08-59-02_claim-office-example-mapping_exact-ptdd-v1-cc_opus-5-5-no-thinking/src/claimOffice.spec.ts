import { describe, expect, it } from "vitest";
import { runScenario } from "./claimOffice.js";

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));

function premiumFor(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return (results[0] as { premium: number }).premium;
}

function claimFor(items: Item[], damages: { itemType: string; amount: number }[]) {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1];
}

describe("quote premium (newcomer, first contract: base + 10% first insurance + 5 G fee)", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumFor([])).toBe(5);
  });
  it("plain sword -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "sword", material: "steel" }])).toBe(115);
  });
  it("plain amulet -> 71 G (60 base + 6 + 5)", () => {
    expect(premiumFor([{ type: "amulet" }])).toBe(71);
  });
  it("plain staff -> 93 G (80 base + 8 + 5)", () => {
    expect(premiumFor([{ type: "staff" }])).toBe(93);
  });
  it("plain potion -> 49 G (40 base + 4 + 5)", () => {
    expect(premiumFor([{ type: "potion" }])).toBe(49);
  });
  it("1 rune -> 33 G (25 base + 2.5 + 5 = 32.5, rounded up in MHPCO's favor)", () => {
    expect(premiumFor([{ type: "rune" }])).toBe(33);
  });
  it("1 moonstone -> 33 G (25 base component premium)", () => {
    expect(premiumFor([{ type: "moonstone" }])).toBe(33);
  });
  it("2 runes -> 60 G (50 base)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes -> 71 G (60 base, block applies)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes -> 115 G (100 base, no block: block requires exactly 3)", () => {
    expect(premiumFor(runes(4))).toBe(115);
  });
  it("7 runes -> 198 G (175 base -> 197.5 rounded up)", () => {
    expect(premiumFor(runes(7))).toBe(198);
  });
  it("2 runes + 1 moonstone -> 88 G (75 base, no block: different types; 87.5 rounded up)", () => {
    expect(premiumFor([...runes(2), { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> 137 G (120 base, two separate blocks)", () => {
    const moonstones: Item[] = [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }];
    expect(premiumFor([...runes(3), ...moonstones])).toBe(137);
  });
});

describe("premium modifiers", () => {
  it("newcomer with cursed steel sword enchantment 3 -> 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
    expect(premiumFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("cursed sword + plain amulet -> 231 G (curse adds 50 % of sword base only: 160 + 50 + 16 first + 5 fee)", () => {
    expect(premiumFor([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("sword with exactly enchantment 5 -> 145 G (100 + 30 high enchantment + 10 + 5)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with enchantment 4 -> 115 G (no high-enchantment surcharge)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword with exactly enchantment 5 -> 195 G (both surcharges: 100 + 50 + 30 + 10 + 5)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("cursed sword with enchantment 4 -> 165 G (only curse surcharge)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("customer with exactly 2 years -> loyalty discount: plain sword 95 G (100 - 20 + 10 + 5)", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year -> no loyalty discount: plain sword 115 G", () => {
    expect(premiumFor([{ type: "sword" }], 1)).toBe(115);
  });
  it("second quote of a 0-year customer -> follow-up discount: plain sword 100 G (100 + 10 - 15 + 5)", () => {
    const quote = { op: "quote" as const, items: [{ type: "sword" }] };
    const { results } = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [quote, quote] });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -> 160 G", () => {
    const first = { op: "quote" as const, items: [{ type: "amulet" }] };
    const second = { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] };
    const { results } = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [first, second] });
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("claim payout", () => {
  it("regular steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune, damage 200 -> payout 100, remainingCap 400 (rune insured at 250 G)", () => {
    expect(claimFor([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon-material sword enchantment exactly 8, damage 1000 -> payout 400", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (50 % rule wins)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 (full reimbursement)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 800 }])).toMatchObject({ payout: 700 });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 (50 % first, then deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
  });
  it("steel sword enchantment 9, damage 901 -> payout 350 (350.5 rounded down in MHPCO's favor)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimFor([sword], [{ itemType: "sword", amount: 901 }])).toMatchObject({ payout: 350 });
  });
  it("sword (500) and amulet (300) damaged in one event -> payout 600, remainingCap 2600 (deductible per damaged item)", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    expect(claimFor([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords both damaged by 500 -> payout 800, remainingCap 3200 (cap 4000)", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(claimFor([{ type: "sword" }, { type: "sword" }], damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });
});

describe("insurance sum and cap", () => {
  it("amulet, damage 200 -> payout 100, remainingCap 1100 (amulet insured at 600 G)", () => {
    expect(claimFor([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("staff, damage 200 -> payout 100, remainingCap 1500 (staff insured at 800 G)", () => {
    expect(claimFor([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("potion, damage 200 -> payout 100, remainingCap 700 (potion insured at 400 G)", () => {
    expect(claimFor([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
  });
  it("moonstone, damage 200 -> payout 100, remainingCap 400 (moonstone insured at 250 G)", () => {
    expect(claimFor([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("cursed sword, damage 500 -> remainingCap 1600 (cap from unmodified insurance value 1000)", () => {
    expect(claimFor([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + 3 runes (block), sword damage 500 -> payout 400, remainingCap 3100 (insurance sum 1750)", () => {
    const items = [{ type: "sword" }, ...runes(3)];
    expect(claimFor(items, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("sword, two successive claims of 1500 -> payouts 1400 then 600, remainingCap 600 then 0", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] } };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
});
