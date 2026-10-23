import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";
import type { ClaimOutcome, Damage } from "./claim.js";
import type { Item } from "./quote.js";

const premiumsOf = (itemLists: Item[][], yearsWithMHPCO = 0): number[] => {
  const steps = itemLists.map((items) => ({ op: "quote" as const, items }));
  const { results } = runScenario({ customer: { yearsWithMHPCO }, steps });
  return results.map((result) => (result as { premium: number }).premium);
};

const premiumOf = (items: Item[], yearsWithMHPCO = 0): number => premiumsOf([items], yearsWithMHPCO)[0];

const claimOutcomesOf = (policyItems: Item[], claims: Damage[][]): ClaimOutcome[] => {
  const claimSteps = claims.map((damages) => ({
    op: "claim" as const,
    policy: 0,
    incident: { cause: "dragon attack", damages },
  }));
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items: policyItems }, ...claimSteps],
  });
  return results.slice(1) as ClaimOutcome[];
};

const claimOutcomeOf = (policyItems: Item[], damages: Damage[]): ClaimOutcome =>
  claimOutcomesOf(policyItems, [damages])[0];

describe("MHPCO claim office: quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumOf([])).toBe(5);
  });
  it("plain sword for a newcomer -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "sword" }])).toBe(115);
  });
  it("plain amulet for a newcomer -> 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "amulet" }])).toBe(71);
  });
  it("plain staff for a newcomer -> 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "staff" }])).toBe(93);
  });
  it("plain potion for a newcomer -> 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "potion" }])).toBe(49);
  });
  it("2 runes -> base 50 G -> 60 G (50 + 5 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes -> block base 60 G -> 71 G (60 + 6 + 5)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("3 moonstones -> block base 60 G -> 71 G (moonstones form blocks too)", () => {
    expect(premiumOf([{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(71);
  });
  it("4 runes -> base 100 G (no block, block requires exactly 3) -> 115 G", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(premiumOf(runes)).toBe(115);
  });
  it("7 runes -> base 175 G -> 197.5 rounded up to 198 G (rounding in MHPCO's favor)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(premiumOf(runes)).toBe(198);
  });
  it("2 runes + 1 moonstone -> base 75 G (alike = same type, no block) -> 88 G (87.5 rounded up)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> base 120 G (two separate blocks) -> 137 G", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(premiumOf([...runes, ...moonstones])).toBe(137);
  });
  it("cursed sword for a newcomer -> 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword enchantment 5 -> 145 G (100 + 30 high enchantment + 10 + 5)", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("cursed sword enchantment 5 -> 195 G (both surcharges apply: 100 + 50 + 30 + 10 + 5)", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("sword enchantment 4 -> 115 G (no high-enchantment surcharge)", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword enchantment 4 -> 165 G (curse only)", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("cursed sword + plain amulet -> 231 G (curse surcharge on the sword's 100 only: 160 + 50 + 16 + 5)", () => {
    expect(premiumOf([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("customer with exactly 2 years, plain sword -> 95 G (100 - 20 loyalty + 10 + 5)", () => {
    expect(premiumOf([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year, plain sword -> 115 G (no loyalty discount)", () => {
    expect(premiumOf([{ type: "sword" }], 1)).toBe(115);
  });
  it("customer with 2 years, sword + amulet -> 149 G (loyalty on the policy base 160: 160 - 32 + 16 + 5)", () => {
    expect(premiumOf([{ type: "sword" }, { type: "amulet" }], 2)).toBe(149);
  });
  it("second quote of a newcomer, plain sword -> 100 G (100 + 10 first - 15 follow-up + 5)", () => {
    const sword = [{ type: "sword" }];
    expect(premiumsOf([sword, sword])).toEqual([115, 100]);
  });
  it("third quote also receives the follow-up discount -> 100 G", () => {
    const sword = [{ type: "sword" }];
    expect(premiumsOf([sword, sword, sword])).toEqual([115, 100, 100]);
  });
  it("long-standing customer's second quote, cursed sword enchantment 7 -> 160 G (integration example)", () => {
    const cursedSword = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(premiumsOf([[{ type: "amulet" }], cursedSword], 3)[1]).toBe(160);
  });
  it("schema example: amulet for 5 years customer -> 59 G (60 - 12 + 6 + 5)", () => {
    const silverAmulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(premiumOf([silverAmulet], 5)).toBe(59);
  });
  it("quote with unknown item type 'broomstick' is rejected with an error and writes no results", () => {
    expect(() => premiumOf([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
});

describe("MHPCO claim office: claim", () => {
  it("regular sword (steel, enchantment 3), damage 500 -> payout 400, remaining cap 1600", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune, damage 200 -> payout 100 (no special clause)", () => {
    expect(claimOutcomeOf([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("damage of 100 or less -> payout 0 (deductible fully consumes the damage)", () => {
    expect(claimOutcomeOf([{ type: "sword" }], [{ itemType: "sword", amount: 50 }])).toEqual({
      payout: 0,
      remainingCap: 2000,
    });
  });
  it("steel sword enchantment 8, damage 1000 -> payout 400 (high-enchantment clause at the threshold)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword enchantment 7, damage 1000 -> payout 900 (below the threshold)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 (50 % first, then deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("dragon-material sword enchantment 8, damage 1000 -> payout 400", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (50 % rule wins)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 (full reimbursement then deductible)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible per damaged item)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimOutcomeOf([{ type: "sword" }, { type: "amulet" }], damages).payout).toBe(600);
  });
  it("policy with two swords: insurance sum 2000, cap 4000 -> remaining cap after claim reflects 4000", () => {
    const outcome = claimOutcomeOf([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }]);
    expect(outcome).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("two sword damages on two insured swords -> each with its own deductible (payout 800 for 500 + 500)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimOutcomeOf([{ type: "sword" }, { type: "sword" }], damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("each damage entry applies to the matching insured item's enchantment (two swords, enchantment 9 and 3)", () => {
    const swords = [
      { type: "sword", enchantment: 9 },
      { type: "sword", enchantment: 3 },
    ];
    const damages = [
      { itemType: "sword", amount: 1000 },
      { itemType: "sword", amount: 1000 },
    ];
    expect(claimOutcomeOf(swords, damages).payout).toBe(1300);
  });
  it("more sword damages than insured swords -> claim rejected with an error", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claimOutcomeOf([{ type: "sword" }], damages)).toThrow(/sword/);
  });
  it("sword + amulet policy -> cap 3200 (remaining cap after a 500 sword damage is 2800)", () => {
    const outcome = claimOutcomeOf([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]);
    expect(outcome).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("amulet-only policy -> cap 1200 (insurance value 600)", () => {
    const outcome = claimOutcomeOf([{ type: "amulet" }], [{ itemType: "amulet", amount: 100 }]);
    expect(outcome).toEqual({ payout: 0, remainingCap: 1200 });
  });
  it("staff-only policy -> cap 1600 (insurance value 800)", () => {
    const outcome = claimOutcomeOf([{ type: "staff" }], [{ itemType: "staff", amount: 100 }]);
    expect(outcome).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("potion-only policy -> cap 800 (insurance value 400)", () => {
    const outcome = claimOutcomeOf([{ type: "potion" }], [{ itemType: "potion", amount: 100 }]);
    expect(outcome).toEqual({ payout: 0, remainingCap: 800 });
  });
  it("moonstone-only policy -> cap 500 (insurance value 250)", () => {
    const outcome = claimOutcomeOf([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 100 }]);
    expect(outcome).toEqual({ payout: 0, remainingCap: 500 });
  });
  it("cursed sword -> cap 2000 (premium modifiers do not raise the cap)", () => {
    const outcome = claimOutcomeOf([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 100 }]);
    expect(outcome).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes -> insurance sum 1750, cap 3500 (block discount does not affect the sum)", () => {
    const policy = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(claimOutcomeOf(policy, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("two successive claims of 1500 on a sword -> payout 1400 / cap 600, then payout 600 / cap 0", () => {
    const claim = [{ itemType: "sword", amount: 1500 }];
    expect(claimOutcomesOf([{ type: "sword" }], [claim, claim])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("caps of different policies are tracked independently", () => {
    const claimOn = (policy: number, itemType: string) => ({
      op: "claim" as const,
      policy,
      incident: { cause: "fire", damages: [{ itemType, amount: 1500 }] },
    });
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
        claimOn(0, "sword"),
        claimOn(1, "sword"),
      ],
    });
    expect(results.slice(2)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 1400, remainingCap: 600 },
    ]);
  });
  it("payout calculation yielding 350.5 -> 350 (rounded down)", () => {
    const sword = { type: "sword", enchantment: 8 };
    expect(claimOutcomeOf([sword], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("damage to an amulet not part of a sword-only policy -> claim rejected with an error", () => {
    expect(() => claimOutcomeOf([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
  });
  it("damage with unknown item type -> claim rejected with an error", () => {
    expect(() => claimOutcomeOf([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
  });
  it("damage with amount -200 -> claim rejected with an error", () => {
    expect(() => claimOutcomeOf([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
  });
  it("claim referencing a step that is not a quote -> claim rejected with an error (chosen reading)", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [] } };
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [claim] })).toThrow(/policy 0/);
  });
  it("schema example: amulet policy, fire, damage 200 -> payout 100, remaining cap 1100", () => {
    const silverAmulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(claimOutcomeOf([silverAmulet], [{ itemType: "amulet", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 1100,
    });
  });
});
