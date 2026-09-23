import { describe, expect, it } from "vitest";
import { runScenario, type Item } from "./claimOffice.js";

function components(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

interface Damage {
  itemType: string;
  amount: number;
}

function claimsOn(items: Item[], ...claims: Damage[][]) {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...claims.map((damages) => ({ op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } })),
    ],
  });
  return results.slice(1);
}

function premiumOf(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return (results[0] as { premium: number }).premium;
}

// Premium examples use a newcomer (0 years) on their first quote unless stated:
// premium = policy base + item surcharges + 10 % first insurance + 5 G fee, rounded up.
describe("claim office scenario", () => {
  describe("quote: base premiums", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      expect(premiumOf([])).toBe(5);
    });
    it("sword (100 G base) -> premium 115 G", () => {
      expect(premiumOf([{ type: "sword" }])).toBe(115);
    });
    it("amulet (60 G base) -> premium 71 G", () => {
      expect(premiumOf([{ type: "amulet" }])).toBe(71);
    });
    it("staff (80 G base) -> premium 93 G", () => {
      expect(premiumOf([{ type: "staff" }])).toBe(93);
    });
    it("potion (40 G base) -> premium 49 G", () => {
      expect(premiumOf([{ type: "potion" }])).toBe(49);
    });
    it("1 rune (25 G base) -> 32.5 G rounded up to premium 33 G", () => {
      expect(premiumOf([{ type: "rune" }])).toBe(33);
    });
    it("1 moonstone (25 G base) -> premium 33 G", () => {
      expect(premiumOf([{ type: "moonstone" }])).toBe(33);
    });
    it("2 runes (50 G base) -> premium 60 G", () => {
      expect(premiumOf(components("rune", 2))).toBe(60);
    });
    it("3 runes (60 G block base) -> premium 71 G", () => {
      expect(premiumOf(components("rune", 3))).toBe(71);
    });
    it("4 runes (100 G base, no block) -> premium 115 G", () => {
      expect(premiumOf(components("rune", 4))).toBe(115);
    });
    it("7 runes (175 G base) -> 197.5 G rounded up to premium 198 G", () => {
      expect(premiumOf(components("rune", 7))).toBe(198);
    });
    it("2 runes + 1 moonstone (75 G base, different types) -> 87.5 G rounded up to premium 88 G", () => {
      expect(premiumOf([...components("rune", 2), { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones (120 G base, two blocks) -> premium 137 G", () => {
      expect(premiumOf([...components("rune", 3), ...components("moonstone", 3)])).toBe(137);
    });
  });

  describe("quote: premium modifiers", () => {
    it("newcomer with cursed sword (steel, enchantment 3) -> premium 165 G", () => {
      expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("cursed surcharge applies only to the cursed item: cursed sword + plain amulet -> 210 G + 16 G first insurance + 5 G = 231 G", () => {
      expect(premiumOf([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
    });
    it("sword with enchantment 4, not cursed -> no surcharge, premium 115 G", () => {
      expect(premiumOf([{ type: "sword", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("sword with exactly enchantment 5 -> high-enchantment surcharge, premium 145 G", () => {
      expect(premiumOf([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with exactly enchantment 5 -> both surcharges, premium 195 G", () => {
      expect(premiumOf([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("customer with 1 year -> no loyalty discount, sword premium 115 G", () => {
      expect(premiumOf([{ type: "sword" }], 1)).toBe(115);
    });
    it("customer with exactly 2 years -> loyalty discount, sword premium 95 G", () => {
      expect(premiumOf([{ type: "sword" }], 2)).toBe(95);
    });
    it("second quote in a scenario gets 15 % follow-up discount: plain sword quoted twice -> 115 G then 100 G", () => {
      const sword = { op: "quote" as const, items: [{ type: "sword" }] };
      const { results } = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [sword, sword] });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer (3 years), second quote, cursed sword enchantment 7 -> premium 160 G (first insurance still applies)", () => {
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

  describe("claim: reimbursement", () => {
    it("steel sword enchantment 3, damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3 };
      expect(claimsOn([sword], [{ itemType: "sword", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("rune, damage 200 G -> payout 100 G, remaining cap 400 G", () => {
      expect(claimsOn([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([{ payout: 100, remainingCap: 400 }]);
    });
    it("dragon sword exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimsOn([sword], [{ itemType: "sword", amount: 1000 }])[0]).toMatchObject({ payout: 400 });
    });
    it("dragon sword enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimsOn([sword], [{ itemType: "sword", amount: 1000 }])[0]).toMatchObject({ payout: 400 });
    });
    it("dragon sword enchantment 5, damage 800 G -> payout 700 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimsOn([sword], [{ itemType: "sword", amount: 800 }])[0]).toMatchObject({ payout: 700 });
    });
    it("steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimsOn([sword], [{ itemType: "sword", amount: 1000 }])[0]).toMatchObject({ payout: 400 });
    });
    it("deductible per damaged item: sword 500 G + amulet 300 G -> payout 600 G, remaining cap 2600 G", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(claimsOn([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([{ payout: 600, remainingCap: 2600 }]);
    });
    it("two insured swords both damaged 500 G -> each has own deductible, payout 800 G, remaining cap 3200 G (cap 4000 G)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ];
      expect(claimsOn([{ type: "sword" }, { type: "sword" }], damages)).toEqual([{ payout: 800, remainingCap: 3200 }]);
    });
    it("payout 350.5 G is rounded down: steel sword enchantment 9, damage 901 G -> payout 350 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimsOn([sword], [{ itemType: "sword", amount: 901 }])[0]).toMatchObject({ payout: 350 });
    });
    it("intermediate fractions kept: two enchantment-9 swords damaged 901 G each -> payout 701 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      const damages = [
        { itemType: "sword", amount: 901 },
        { itemType: "sword", amount: 901 },
      ];
      expect(claimsOn([sword, sword], damages)[0]).toMatchObject({ payout: 701 });
    });
  });

  describe("claim: cap", () => {
    it("sword + amulet -> cap 3200 G: amulet damage 300 G -> payout 200 G, remaining cap 3000 G", () => {
      const results = claimsOn([{ type: "sword" }, { type: "amulet" }], [{ itemType: "amulet", amount: 300 }]);
      expect(results).toEqual([{ payout: 200, remainingCap: 3000 }]);
    });
    it("cursed sword cap is based on insurance value 1000 G -> cap 2000 G: damage 500 G -> remaining cap 1600 G", () => {
      const results = claimsOn([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]);
      expect(results).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("sword + 3 runes -> insurance sum 1750 G, cap 3500 G: rune damage 200 G -> remaining cap 3400 G", () => {
      const results = claimsOn([{ type: "sword" }, ...components("rune", 3)], [{ itemType: "rune", amount: 200 }]);
      expect(results).toEqual([{ payout: 100, remainingCap: 3400 }]);
    });
    it("staff insurance value 800 G -> cap 1600 G: damage 500 G -> payout 400 G, remaining cap 1200 G", () => {
      expect(claimsOn([{ type: "staff" }], [{ itemType: "staff", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 1200 }]);
    });
    it("potion insurance value 400 G -> cap 800 G: damage 500 G -> payout 400 G, remaining cap 400 G", () => {
      expect(claimsOn([{ type: "potion" }], [{ itemType: "potion", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 400 }]);
    });
    it("moonstone insurance value 250 G -> cap 500 G: damage 200 G -> payout 100 G, remaining cap 400 G", () => {
      const results = claimsOn([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }]);
      expect(results).toEqual([{ payout: 100, remainingCap: 400 }]);
    });
    it("two successive 1500 G sword claims -> payout 1400 G / remaining 600 G, then payout 600 G / remaining 0 G", () => {
      const damage = [{ itemType: "sword", amount: 1500 }];
      expect(claimsOn([{ type: "sword" }], damage, damage)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("rejections (runScenario throws an Error describing the problem)", () => {
    it("quote with unknown item type 'broomstick' -> throws", () => {
      expect(() => premiumOf([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim damage to an amulet when only a sword is insured -> throws", () => {
      expect(() => claimsOn([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });
    it("claim damage with unknown item type -> throws", () => {
      expect(() => claimsOn([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
    });
    it("claim damage with amount -200 -> throws", () => {
      expect(() => claimsOn([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
    it("claim with two sword damages but only one sword insured -> throws", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ];
      expect(() => claimsOn([{ type: "sword" }], damages)).toThrow(/sword/);
    });
  });
});
