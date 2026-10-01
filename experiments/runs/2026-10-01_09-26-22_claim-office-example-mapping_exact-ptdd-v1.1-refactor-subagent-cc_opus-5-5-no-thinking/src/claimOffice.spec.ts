import { describe, expect, it } from "vitest";
import { runScenario, type Item } from "./claimOffice.js";

const newcomer = { yearsWithMHPCO: 0 };

function quoteFor(customer: { yearsWithMHPCO: number }, items: Item[]) {
  return runScenario({ customer, steps: [{ op: "quote", items }] }).results[0];
}

function claimAgainst(insuredItems: Item[], damages: { itemType: string; amount: number }[]) {
  const quote = { op: "quote" as const, items: insuredItems };
  const claim = { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } };
  return runScenario({ customer: newcomer, steps: [quote, claim] }).results[1];
}

function components(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

// Premium expectations include the always-applied 10 % first-insurance surcharge
// on the policy base premium and the 5 G processing fee, rounded up.
describe("claim office scenario", () => {
  describe("quote -- base premiums", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      expect(quoteFor(newcomer, [])).toEqual({ premium: 5 });
    });
    it("newcomer, plain sword (base 100) -> premium 115 G (100 + 10 first insurance + 5 fee)", () => {
      expect(quoteFor(newcomer, [{ type: "sword" }])).toEqual({ premium: 115 });
    });
    it("newcomer, plain amulet (base 60) -> premium 71 G (60 + 6 + 5)", () => {
      expect(quoteFor(newcomer, [{ type: "amulet" }])).toEqual({ premium: 71 });
    });
    it("newcomer, plain staff (base 80) -> premium 93 G (80 + 8 + 5)", () => {
      expect(quoteFor(newcomer, [{ type: "staff" }])).toEqual({ premium: 93 });
    });
    it("newcomer, plain potion (base 40) -> premium 49 G (40 + 4 + 5)", () => {
      expect(quoteFor(newcomer, [{ type: "potion" }])).toEqual({ premium: 49 });
    });
    it("newcomer, 1 rune (base 25) -> 32.5 rounded up in MHPCO's favor -> premium 33 G", () => {
      expect(quoteFor(newcomer, [{ type: "rune" }])).toEqual({ premium: 33 });
    });
    it("newcomer, 1 moonstone (base 25) -> premium 33 G", () => {
      expect(quoteFor(newcomer, [{ type: "moonstone" }])).toEqual({ premium: 33 });
    });
    it("newcomer, 2 runes (base 50) -> premium 60 G (50 + 5 + 5)", () => {
      expect(quoteFor(newcomer, components("rune", 2))).toEqual({ premium: 60 });
    });
    it("newcomer, 3 runes form a block (base 60) -> premium 71 G (60 + 6 + 5)", () => {
      expect(quoteFor(newcomer, components("rune", 3))).toEqual({ premium: 71 });
    });
    it("newcomer, 4 runes, no block (base 100) -> premium 115 G", () => {
      expect(quoteFor(newcomer, components("rune", 4))).toEqual({ premium: 115 });
    });
    it("newcomer, 7 runes, no block (base 175) -> 197.5 rounded up -> premium 198 G", () => {
      expect(quoteFor(newcomer, components("rune", 7))).toEqual({ premium: 198 });
    });
    it("newcomer, 2 runes + 1 moonstone, no block across types (base 75) -> 87.5 rounded up -> premium 88 G", () => {
      expect(quoteFor(newcomer, [...components("rune", 2), ...components("moonstone", 1)])).toEqual({ premium: 88 });
    });
    it("newcomer, 3 runes + 3 moonstones form two blocks (base 120) -> premium 137 G (120 + 12 + 5)", () => {
      expect(quoteFor(newcomer, [...components("rune", 3), ...components("moonstone", 3)])).toEqual({ premium: 137 });
    });
  });

  describe("quote -- premium modifiers", () => {
    it("newcomer, cursed sword enchantment 3 -> premium 165 G (100 + 50 curse + 10 + 5)", () => {
      expect(quoteFor(newcomer, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
    });
    it("newcomer, sword with exactly enchantment 5 -> high-enchantment surcharge applies -> premium 145 G (100 + 30 + 10 + 5)", () => {
      expect(quoteFor(newcomer, [{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
    });
    it("newcomer, sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
      expect(quoteFor(newcomer, [{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
    });
    it("newcomer, cursed sword with enchantment 5 -> both surcharges -> premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
      expect(quoteFor(newcomer, [{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
    });
    it("newcomer, cursed sword with enchantment 4 -> only curse surcharge -> premium 165 G", () => {
      expect(quoteFor(newcomer, [{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
    });
    it("newcomer, cursed sword + plain amulet -> curse applies to the sword only -> premium 231 G (160 + 50 + 16 + 5)", () => {
      expect(quoteFor(newcomer, [{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
    });
    it("customer with exactly 2 years, plain sword -> loyalty discount applies -> premium 95 G (100 - 20 + 10 + 5)", () => {
      expect(quoteFor({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toEqual({ premium: 95 });
    });
    it("customer with 1 year, plain sword -> no loyalty discount -> premium 115 G", () => {
      expect(quoteFor({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toEqual({ premium: 115 });
    });
    it("newcomer's second quote, plain sword -> follow-up discount -> premium 100 G (100 + 10 - 15 + 5)", () => {
      const swordQuote = { op: "quote" as const, items: [{ type: "sword" }] };
      const { results } = runScenario({ customer: newcomer, steps: [swordQuote, swordQuote] });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("3-year customer's second quote, cursed sword enchantment 7 -> first insurance still applies -> premium 160 G", () => {
      const firstQuote = { op: "quote" as const, items: [{ type: "sword" }] };
      const secondQuote = { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] };
      const { results } = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [firstQuote, secondQuote] });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim -- payouts", () => {
    it("steel sword enchantment 3, damage 500 -> payout 400 G, remaining cap 1600 G", () => {
      const steelSword = { type: "sword", material: "steel", enchantment: 3 };
      expect(claimAgainst([steelSword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune, damage 200 -> payout 100 G, remaining cap 400 G", () => {
      expect(claimAgainst([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("steel sword enchantment 9, damage 1000 -> 50 % then deductible -> payout 400 G", () => {
      const steelSword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimAgainst([steelSword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
    });
    it("dragon sword with exactly enchantment 8, damage 1000 -> payout 400 G", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimAgainst([dragonSword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
    });
    it("dragon sword enchantment 9, damage 1000 -> 50 % rule wins -> payout 400 G", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimAgainst([dragonSword], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 });
    });
    it("dragon sword enchantment 5, damage 800 -> full reimbursement -> payout 700 G", () => {
      const dragonSword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimAgainst([dragonSword], [{ itemType: "sword", amount: 800 }])).toMatchObject({ payout: 700 });
    });
    it("sword (500) and amulet (300) damaged -> deductible per damaged item -> payout 600 G, remaining cap 2600 G", () => {
      const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
      expect(claimAgainst([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two swords insured, both damaged 500 each -> payout 800 G, remaining cap 3200 G (cap 4000)", () => {
      const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
      expect(claimAgainst([{ type: "sword" }, { type: "sword" }], damages)).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("sword enchantment 9, damage 901 -> 350.5 rounded down -> payout 350 G", () => {
      const enchantedSword = { type: "sword", enchantment: 9 };
      expect(claimAgainst([enchantedSword], [{ itemType: "sword", amount: 901 }])).toMatchObject({ payout: 350 });
    });
  });

  describe("claim -- cap", () => {
    it("sword insured, two successive claims of 1500 -> payouts 1400 G then 600 G, remaining caps 600 G then 0 G", () => {
      const quote = { op: "quote" as const, items: [{ type: "sword" }] };
      const claim = { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
      const { results } = runScenario({ customer: newcomer, steps: [quote, claim, claim] });
      expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
    });
    it("cursed sword, damage 5000 -> cap 2000 G from unmodified insurance value -> payout 2000 G, remaining cap 0 G", () => {
      const cursedSword = { type: "sword", cursed: true };
      expect(claimAgainst([cursedSword], [{ itemType: "sword", amount: 5000 }])).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("sword and amulet, damages 5000 each -> cap 3200 G -> payout 3200 G, remaining cap 0 G", () => {
      const damages = [{ itemType: "sword", amount: 5000 }, { itemType: "amulet", amount: 5000 }];
      expect(claimAgainst([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({ payout: 3200, remainingCap: 0 });
    });
    it("sword and 3 runes (block), sword damage 5000 -> cap 3500 G -> payout 3500 G, remaining cap 0 G", () => {
      const insured = [{ type: "sword" }, ...components("rune", 3)];
      expect(claimAgainst(insured, [{ itemType: "sword", amount: 5000 }])).toEqual({ payout: 3500, remainingCap: 0 });
    });
    it("staff, damage 200 -> remaining cap 1500 G (cap 1600)", () => {
      expect(claimAgainst([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
    });
    it("potion, damage 200 -> remaining cap 700 G (cap 800)", () => {
      expect(claimAgainst([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
    });
    it("moonstone, damage 200 -> remaining cap 400 G (cap 500)", () => {
      expect(claimAgainst([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("rejections (thrown Error, whole scenario rejected)", () => {
    it("quote with unknown item type broomstick -> throws Error", () => {
      expect(() => quoteFor(newcomer, [{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim damaging an amulet when only a sword is insured -> throws Error", () => {
      expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });
    it("claim damaging an item of unknown type -> throws Error", () => {
      expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
    });
    it("claim with two sword damages when only one sword is insured -> throws Error", () => {
      const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
      expect(() => claimAgainst([{ type: "sword" }], damages)).toThrow(/sword/);
    });
    it("claim with damage amount -200 -> throws Error", () => {
      expect(() => claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });
});
