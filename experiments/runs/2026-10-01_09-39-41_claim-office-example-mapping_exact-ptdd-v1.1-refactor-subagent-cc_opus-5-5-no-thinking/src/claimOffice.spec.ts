import { describe, expect, it } from "vitest";
import { runScenario, type ClaimStep, type Damage, type QuoteItem, type Step } from "./claimOffice.js";

const quote = (items: QuoteItem[]) => ({ op: "quote" as const, items });

const scenarioResultsFor = (yearsWithMHPCO: number, ...steps: Step[]) =>
  runScenario({ customer: { yearsWithMHPCO }, steps }).results;

const premiumFor = (yearsWithMHPCO: number, items: QuoteItem[]) => scenarioResultsFor(yearsWithMHPCO, quote(items))[0];

const alikeComponents = (type: string, count: number): QuoteItem[] => Array.from({ length: count }, () => ({ type }));
const runes = (count: number) => alikeComponents("rune", count);
const moonstones = (count: number) => alikeComponents("moonstone", count);

const expectRejected = (run: () => unknown) => {
  let rejection: unknown;
  try {
    run();
  } catch (error) {
    rejection = error;
  }
  expect((rejection as Error | undefined)?.constructor).toBe(Error);
};

describe("quote", () => {
  it("empty item list (newcomer) -> premium 5 G (only the processing fee)", () => {
    expect(premiumFor(0, [])).toEqual({ premium: 5 });
  });
  it("newcomer, plain steel sword enchantment 3 -> 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(premiumFor(0, [{ type: "sword", material: "steel", enchantment: 3 }])).toEqual({ premium: 115 });
  });
  it("newcomer, plain amulet -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor(0, [{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("newcomer, plain staff -> 80 + 8 + 5 = 93 G", () => {
    expect(premiumFor(0, [{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("newcomer, plain potion -> 40 + 4 + 5 = 49 G", () => {
    expect(premiumFor(0, [{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("newcomer, 2 runes -> base 50 G -> 50 + 5 + 5 = 60 G", () => {
    expect(premiumFor(0, runes(2))).toEqual({ premium: 60 });
  });
  it("newcomer, 1 rune -> 25 + 2.5 + 5 = 32.5 -> rounded up in MHPCO's favor to 33 G", () => {
    expect(premiumFor(0, [{ type: "rune" }])).toEqual({ premium: 33 });
  });
  it("newcomer, 1 moonstone -> 25 + 2.5 + 5 = 32.5 -> 33 G", () => {
    expect(premiumFor(0, [{ type: "moonstone" }])).toEqual({ premium: 33 });
  });
  it("newcomer, 3 runes -> block base 60 G -> 60 + 6 + 5 = 71 G", () => {
    expect(premiumFor(0, runes(3))).toEqual({ premium: 71 });
  });
  it("newcomer, 4 runes -> no block (exactly 3 required), base 100 G -> 115 G", () => {
    expect(premiumFor(0, runes(4))).toEqual({ premium: 115 });
  });
  it("newcomer, 7 runes -> no block, base 175 G -> 197.5 -> rounded up to 198 G", () => {
    expect(premiumFor(0, runes(7))).toEqual({ premium: 198 });
  });
  it("newcomer, 2 runes + 1 moonstone -> no block (different types), base 75 G -> 87.5 -> 88 G", () => {
    expect(premiumFor(0, [...runes(2), ...moonstones(1)])).toEqual({ premium: 88 });
  });
  it("newcomer, 3 runes + 3 moonstones -> two blocks, base 120 G -> 137 G", () => {
    expect(premiumFor(0, [...runes(3), ...moonstones(3)])).toEqual({ premium: 137 });
  });
  it("newcomer, cursed steel sword enchantment 3 -> 100 + 50 curse + 10 first = 160 + 5 = 165 G", () => {
    expect(premiumFor(0, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("newcomer, cursed sword + plain amulet -> curse only on sword: 160 + 50 + 16 + 5 = 231 G", () => {
    expect(premiumFor(0, [{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("newcomer, sword enchantment exactly 5 -> high-enchantment surcharge: 100 + 30 + 10 + 5 = 145 G", () => {
    expect(premiumFor(0, [{ type: "sword", enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it("newcomer, sword enchantment 4 -> no high-enchantment surcharge: 115 G", () => {
    expect(premiumFor(0, [{ type: "sword", enchantment: 4 }])).toEqual({ premium: 115 });
  });
  it("newcomer, cursed sword enchantment 5 -> both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(premiumFor(0, [{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("newcomer, cursed sword enchantment 4 -> only curse surcharge: 165 G", () => {
    expect(premiumFor(0, [{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("newcomer, sword enchantment 5 + plain amulet -> surcharge only on sword: 160 + 30 + 16 + 5 = 211 G", () => {
    expect(premiumFor(0, [{ type: "sword", enchantment: 5 }, { type: "amulet" }])).toEqual({ premium: 211 });
  });
  it("customer with exactly 2 years, plain sword -> loyalty discount: 100 - 20 + 10 + 5 = 95 G", () => {
    expect(premiumFor(2, [{ type: "sword" }])).toEqual({ premium: 95 });
  });
  it("customer with 1 year, plain sword -> no loyalty discount: 115 G", () => {
    expect(premiumFor(1, [{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("newcomer, second quote in scenario, plain sword -> follow-up discount: 100 + 10 - 15 + 5 = 100 G", () => {
    const sword = { type: "sword" };
    const results = scenarioResultsFor(0, quote([sword]), quote([sword]));
    expect(results[1]).toEqual({ premium: 100 });
  });
  it("newcomer, third quote in scenario, plain sword -> follow-up discount still 15 %: 100 G", () => {
    const sword = { type: "sword" };
    const results = scenarioResultsFor(0, quote([sword]), quote([sword]), quote([sword]));
    expect(results[2]).toEqual({ premium: 100 });
  });
  it("3 years, second quote, cursed sword enchantment 7 -> 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const results = scenarioResultsFor(3, quote([{ type: "amulet" }]), quote([cursedSword]));
    expect(results[1]).toEqual({ premium: 160 });
  });
  it("quote with unknown item type 'broomstick' -> runScenario throws an Error (chosen contract: domain throws, CLI maps to non-zero exit)", () => {
    expectRejected(() => premiumFor(0, [{ type: "broomstick" }]));
  });
});

const claimOf = (...damages: Damage[]): ClaimStep => ({
  op: "claim",
  policy: 0,
  incident: { cause: "dragon attack", damages },
});

const claimResultsFor = (items: QuoteItem[], ...claims: ClaimStep[]) =>
  scenarioResultsFor(0, quote(items), ...claims).slice(1);

const singleSwordClaimResultsFor = (sword: QuoteItem, amount: number) =>
  claimResultsFor([sword], claimOf({ itemType: "sword", amount }));

describe("claim", () => {
  it("schema example: 5 years, silver amulet enchantment 2, fire damage 200 -> premium 59 G, payout 100 G, remainingCap 1100 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        quote([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]),
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("regular steel sword enchantment 3, damage 500 -> payout 400 G, remainingCap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(singleSwordClaimResultsFor(sword, 500)).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("rune, damage 200 -> payout 100 G, remainingCap 400 G", () => {
    expect(claimResultsFor(runes(1), claimOf({ itemType: "rune", amount: 200 }))).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it("steel sword enchantment 9, damage 1000 -> 50 % then deductible: payout 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(singleSwordClaimResultsFor(sword, 1000)).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword enchantment 9, damage 1000 -> 50 % rule wins: payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(singleSwordClaimResultsFor(sword, 1000)).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword enchantment 5, damage 800 -> full reimbursement: payout 700 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(singleSwordClaimResultsFor(sword, 800)).toEqual([{ payout: 700, remainingCap: 1300 }]);
  });
  it("dragon-material sword enchantment exactly 8, damage 1000 -> high-enchantment clause applies: payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(singleSwordClaimResultsFor(sword, 1000)).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("steel sword enchantment 9, damage 901 -> 350.5 -> rounded down in MHPCO's favor to 350 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(singleSwordClaimResultsFor(sword, 901)).toEqual([{ payout: 350, remainingCap: 1650 }]);
  });
  it("sword + amulet, dragon attack damages sword 500 and amulet 300 -> deductible per item: payout 600 G, remainingCap 2600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const dragonAttack = claimOf({ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 });
    expect(claimResultsFor(items, dragonAttack)).toEqual([{ payout: 600, remainingCap: 2600 }]);
  });
  it("two swords insured, both damaged 500 each -> separate deductibles: payout 800 G, remainingCap 3200 G (cap 4000)", () => {
    const swords = [{ type: "sword" }, { type: "sword" }];
    const dragonAttack = claimOf({ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 });
    expect(claimResultsFor(swords, dragonAttack)).toEqual([{ payout: 800, remainingCap: 3200 }]);
  });
  it("cursed sword, damage 1500 -> cap based on unmodified value 2000: payout 1400 G, remainingCap 600 G", () => {
    expect(singleSwordClaimResultsFor({ type: "sword", cursed: true }, 1500)).toEqual([{ payout: 1400, remainingCap: 600 }]);
  });
  it("sword + 3 runes (block), sword damage 500 -> insurance sum 1750, cap 3500: payout 400 G, remainingCap 3100 G", () => {
    const items = [{ type: "sword" }, ...runes(3)];
    expect(claimResultsFor(items, claimOf({ itemType: "sword", amount: 500 }))).toEqual([{ payout: 400, remainingCap: 3100 }]);
  });
  it("sword, two successive claims of 1500 -> payouts 1400 G then 600 G, remainingCap 600 G then 0 G", () => {
    const swordDamage = claimOf({ itemType: "sword", amount: 1500 });
    expect(claimResultsFor([{ type: "sword" }], swordDamage, swordDamage)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("claim for an amulet when only a sword is insured -> runScenario throws an Error", () => {
    expectRejected(() => claimResultsFor([{ type: "sword" }], claimOf({ itemType: "amulet", amount: 200 })));
  });
  it("claim for an unknown item type -> runScenario throws an Error", () => {
    expectRejected(() => claimResultsFor([{ type: "sword" }], claimOf({ itemType: "broomstick", amount: 200 })));
  });
  it("two sword damages but only one sword insured -> whole claim rejected: runScenario throws an Error", () => {
    const twoSwordDamages = claimOf({ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 });
    expectRejected(() => claimResultsFor([{ type: "sword" }], twoSwordDamages));
  });
  it("damage amount -200 -> runScenario throws an Error", () => {
    expectRejected(() => claimResultsFor([{ type: "sword" }], claimOf({ itemType: "sword", amount: -200 })));
  });
});
