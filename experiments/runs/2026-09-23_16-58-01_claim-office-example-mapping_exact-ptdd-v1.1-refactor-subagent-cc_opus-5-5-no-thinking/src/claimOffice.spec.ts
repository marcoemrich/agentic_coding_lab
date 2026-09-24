import { describe, expect, it } from "vitest";
import { runScenario, type Item, type Scenario } from "./claimOffice.js";

const newcomer = { yearsWithMHPCO: 0 };

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
const moonstones = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "moonstone" }));

const dragonSword = (enchantment: number): Item => ({ type: "sword", material: "dragon", enchantment, cursed: false });
const sword = (enchantment: number, cursed: boolean): Item => ({ type: "sword", material: "steel", enchantment, cursed });

function premiumFor(customer: Scenario["customer"], items: Item[]): number {
  const [result] = runScenario({ customer, steps: [{ op: "quote", items }] });
  return "premium" in result ? result.premium : Number.NaN;
}

const damage = (itemType: string, amount: number) => ({ itemType, amount });

function claimsAgainst(items: Item[], ...claims: ReturnType<typeof damage>[][]) {
  const steps: Scenario["steps"] = [
    { op: "quote", items },
    ...claims.map((damages) => ({ op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } })),
  ];
  return runScenario({ customer: newcomer, steps }).slice(1);
}

describe("quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumFor(newcomer, [])).toBe(5);
  });
  it("newcomer, plain steel sword (enchantment 3) -> 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(premiumFor(newcomer, [sword(3, false)])).toBe(115);
  });
  it("newcomer, plain amulet -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor(newcomer, [{ type: "amulet" }])).toBe(71);
  });
  it("newcomer, plain staff -> 80 + 8 + 5 = 93 G", () => {
    expect(premiumFor(newcomer, [{ type: "staff" }])).toBe(93);
  });
  it("newcomer, plain potion -> 40 + 4 + 5 = 49 G", () => {
    expect(premiumFor(newcomer, [{ type: "potion" }])).toBe(49);
  });
  it("newcomer, 1 rune -> 25 + 2.5 + 5 = 32.5 -> rounded up to 33 G", () => {
    expect(premiumFor(newcomer, runes(1))).toBe(33);
  });
  it("newcomer, 1 moonstone -> 25 base like any component -> 33 G", () => {
    expect(premiumFor(newcomer, moonstones(1))).toBe(33);
  });
  it("2 runes -> base 50 G -> 50 + 5 + 5 = 60 G", () => {
    expect(premiumFor(newcomer, runes(2))).toBe(60);
  });
  it("3 runes -> block base 60 G -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor(newcomer, runes(3))).toBe(71);
  });
  it("4 runes -> base 100 G (no block, block requires exactly 3) -> 100 + 10 + 5 = 115 G", () => {
    expect(premiumFor(newcomer, runes(4))).toBe(115);
  });
  it("7 runes -> base 175 G -> 175 + 17.5 + 5 = 197.5 -> 198 G", () => {
    expect(premiumFor(newcomer, runes(7))).toBe(198);
  });
  it("2 runes + 1 moonstone -> base 75 G (no block: different types) -> 75 + 7.5 + 5 = 87.5 -> 88 G", () => {
    expect(premiumFor(newcomer, [...runes(2), ...moonstones(1)])).toBe(88);
  });
  it("3 runes + 3 moonstones -> base 120 G (two blocks) -> 120 + 12 + 5 = 137 G", () => {
    expect(premiumFor(newcomer, [...runes(3), ...moonstones(3)])).toBe(137);
  });
  it("newcomer, cursed steel sword (enchantment 3) -> 100 + 50 curse + 10 first + 5 = 165 G", () => {
    expect(premiumFor(newcomer, [sword(3, true)])).toBe(165);
  });
  it("sword with enchantment 4, not cursed -> no high-enchantment surcharge -> 115 G", () => {
    expect(premiumFor(newcomer, [sword(4, false)])).toBe(115);
  });
  it("sword with exactly enchantment 5 -> 30 % surcharge -> 100 + 30 + 10 + 5 = 145 G", () => {
    expect(premiumFor(newcomer, [sword(5, false)])).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 -> both surcharges -> 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(premiumFor(newcomer, [sword(5, true)])).toBe(195);
  });
  it("cursed sword with enchantment 4 -> only curse surcharge -> 165 G", () => {
    expect(premiumFor(newcomer, [sword(4, true)])).toBe(165);
  });
  it("cursed sword + plain amulet -> curse applies to sword only: 160 + 50 + 16 first + 5 = 231 G", () => {
    expect(premiumFor(newcomer, [sword(3, true), { type: "amulet" }])).toBe(231);
  });
  it("customer with 1 year, plain sword -> no loyalty discount -> 115 G", () => {
    expect(premiumFor({ yearsWithMHPCO: 1 }, [sword(3, false)])).toBe(115);
  });
  it("customer with exactly 2 years, plain sword -> 20 % loyalty discount on policy base: 100 - 20 + 10 + 5 = 95 G", () => {
    expect(premiumFor({ yearsWithMHPCO: 2 }, [sword(3, false)])).toBe(95);
  });
  it("second quote in scenario gets 15 % follow-up discount on policy base: newcomer plain sword twice -> 115 G, then 100 + 10 - 15 + 5 = 100 G", () => {
    const quoteSword = { op: "quote" as const, items: [sword(3, false)] };
    expect(runScenario({ customer: newcomer, steps: [quoteSword, quoteSword] })).toEqual([
      { premium: 115 },
      { premium: 100 },
    ]);
  });
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 -> 160 G (first insurance still applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [sword(3, false)] },
        { op: "quote", items: [sword(7, true)] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
  it("2 years, cursed sword enchantment 5 + rune -> 125 + 50 + 30 - 25 + 12.5 + 5 = 197.5 -> rounded up to 198 G", () => {
    expect(premiumFor({ yearsWithMHPCO: 2 }, [sword(5, true), ...runes(1)])).toBe(198);
  });
});

describe("claim", () => {
  it("regular steel sword (enchantment 3), damage 500 G -> payout 400 G, remainingCap 1600 G", () => {
    expect(claimsAgainst([sword(3, false)], [damage("sword", 500)])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("rune (insurance value 250 G), damage 200 G -> payout 100 G, remainingCap 400 G", () => {
    expect(claimsAgainst(runes(1), [damage("rune", 200)])).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it("amulet damage 200 G -> payout 100 G, remainingCap 1100 G (cap = 2 x 600)", () => {
    expect(claimsAgainst([{ type: "amulet" }], [damage("amulet", 200)])).toEqual([{ payout: 100, remainingCap: 1100 }]);
  });
  it("staff damage 200 G -> payout 100 G, remainingCap 1500 G (cap = 2 x 800)", () => {
    expect(claimsAgainst([{ type: "staff" }], [damage("staff", 200)])).toEqual([{ payout: 100, remainingCap: 1500 }]);
  });
  it("potion damage 200 G -> payout 100 G, remainingCap 700 G (cap = 2 x 400)", () => {
    expect(claimsAgainst([{ type: "potion" }], [damage("potion", 200)])).toEqual([{ payout: 100, remainingCap: 700 }]);
  });
  it("moonstone damage 200 G -> payout 100 G, remainingCap 400 G (cap = 2 x 250)", () => {
    expect(claimsAgainst(moonstones(1), [damage("moonstone", 200)])).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it("steel sword enchantment 9, damage 1000 G -> 50 % then deductible -> payout 400 G", () => {
    expect(claimsAgainst([sword(9, false)], [damage("sword", 1000)])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon sword enchantment 9, damage 1000 G -> 50 % rule wins -> payout 400 G", () => {
    expect(claimsAgainst([dragonSword(9)], [damage("sword", 1000)])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon sword exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    expect(claimsAgainst([dragonSword(8)], [damage("sword", 1000)])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon sword enchantment 5, damage 800 G -> full reimbursement -> payout 700 G", () => {
    expect(claimsAgainst([dragonSword(5)], [damage("sword", 800)])).toEqual([{ payout: 700, remainingCap: 1300 }]);
  });
  it("sword enchantment 8, damage 901 G -> 450.5 - 100 = 350.5 -> rounded down to 350 G", () => {
    expect(claimsAgainst([sword(8, false)], [damage("sword", 901)])).toEqual([{ payout: 350, remainingCap: 1650 }]);
  });
  it("sword (500 G) and amulet (300 G) damaged in one event -> deductible per item -> payout 600 G, remainingCap 2600 G", () => {
    expect(
      claimsAgainst([sword(3, false), { type: "amulet" }], [damage("sword", 500), damage("amulet", 300)]),
    ).toEqual([{ payout: 600, remainingCap: 2600 }]);
  });
  it("two swords insured -> cap 4000 G; both damaged 500 G each -> payout 800 G, remainingCap 3200 G", () => {
    expect(
      claimsAgainst([sword(3, false), sword(3, false)], [damage("sword", 500), damage("sword", 500)]),
    ).toEqual([{ payout: 800, remainingCap: 3200 }]);
  });
  it("cursed sword -> cap 2000 G based on unmodified insurance value: damage 500 G -> remainingCap 1600 G", () => {
    expect(claimsAgainst([sword(3, true)], [damage("sword", 500)])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("sword + 3 runes (block) -> insurance sum 1750 G, cap 3500 G: sword damage 500 G -> remainingCap 3100 G", () => {
    expect(claimsAgainst([sword(3, false), ...runes(3)], [damage("sword", 500)])).toEqual([
      { payout: 400, remainingCap: 3100 },
    ]);
  });
  it("sword, two successive claims of 1500 G -> payouts 1400 G (cap 600) then 600 G (cap 0)", () => {
    expect(claimsAgainst([sword(3, false)], [damage("sword", 1500)], [damage("sword", 1500)])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("claim references the policy by its quote step index when several policies exist", () => {
    const results = runScenario({
      customer: newcomer,
      steps: [
        { op: "quote", items: [sword(3, false)] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [damage("amulet", 200)] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage("sword", 500)] } },
      ],
    });
    expect(results.slice(2)).toEqual([
      { payout: 100, remainingCap: 1100 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
});

describe("rejections (throws Error with a description)", () => {
  it("quote with unknown item type 'broomstick' throws", () => {
    expect(() => premiumFor(newcomer, [{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("claim damaging an amulet when only a sword is insured throws", () => {
    expect(() => claimsAgainst([sword(3, false)], [damage("amulet", 200)])).toThrow(/amulet/);
  });
  it("claim damaging an unknown item type throws", () => {
    expect(() => claimsAgainst([sword(3, false)], [damage("broomstick", 200)])).toThrow(/broomstick/);
  });
  it("claim with two sword damages but only one sword insured throws", () => {
    expect(() => claimsAgainst([sword(3, false)], [damage("sword", 500), damage("sword", 500)])).toThrow(/sword/);
  });
  it("claim with damage amount -200 throws", () => {
    expect(() => claimsAgainst([sword(3, false)], [damage("sword", -200)])).toThrow(/-200/);
  });
});
